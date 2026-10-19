"use client";

import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SearchDialog({open,onClose}) {
  const [items,setItems]=useState([]);
  const [query,setQuery]=useState("");
  const [status,setStatus]=useState("idle");
  const panel=useRef(null);
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    if(!open || items.length)return;
    let active=true;
    setStatus("loading");
    fetch("/js/search/local-search.json").then(r=>{if(!r.ok)throw Error();return r.json();})
      .then(data=>{if(active){setItems(data);setStatus("ready");}})
      .catch(()=>{if(active)setStatus("error");});
    return ()=>{active=false;};
  },[open,retry]);
  useEffect(()=>{
    if(!open)return;
    const previousFocus=document.activeElement;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    panel.current?.querySelector("input")?.focus();
    function keyboard(event){
      if(event.key==="Escape"){event.preventDefault();onClose();}
      if(event.key==="Tab"){
        const targets=panel.current?.querySelectorAll("input,button,a[href]");
        const first=targets?.[0],last=targets?.[targets.length-1];
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
      }
    }
    document.addEventListener("keydown",keyboard);
    return ()=>{document.body.style.overflow=previousOverflow;document.removeEventListener("keydown",keyboard);previousFocus?.focus();};
  },[open,onClose]);
  const results=useMemo(()=>{
    const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return items.filter(item=>words.every(word=>[item.title,item.description,...item.tags,...item.categories,item.text].join(" ").toLowerCase().includes(word)));
  },[items,query]);
  if(!open)return null;
  return <div className="search-overlay" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section ref={panel} className="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <div className="search-heading"><span id="search-title">搜索实验室</span><button type="button" className="icon-button" onClick={onClose} aria-label="关闭搜索"><X size={18}/></button></div>
      <div className="search-input-wrap"><Search size={20}/><input aria-label="搜索文章、标签、分类" placeholder="搜索文章、标签、分类" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>ESC</kbd></div>
      <div className="search-results" aria-live="polite">
        {status==="loading"?<p className="empty-state">正在读取笔记…</p>:status==="error"?<div className="empty-state">暂时无法读取笔记。<button type="button" className="inline-button" onClick={()=>setRetry(value=>value+1)}>重新加载</button></div>:results.length?results.map(item=><Link key={item.slug} href={`/posts/${item.slug}/`} onClick={onClose} className="search-result"><span><small>{item.categories.join(" / ")}</small><strong>{item.title}</strong></span><ArrowUpRight size={18}/></Link>):<p className="empty-state">没有找到「{query}」，试试 AI、NAS 或 MCP。</p>}
      </div>
      <div className="search-foot"><span>{results.length} 篇匹配笔记</span><span>ESC 关闭 · Ctrl / ⌘ K 搜索</span></div>
    </section>
  </div>;
}
