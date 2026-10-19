"use client";
import { useEffect,useState } from "react";
import { List,ChevronDown } from "lucide-react";
export default function TableOfContents({headings}){
  const [active,setActive]=useState("");
  const [expanded,setExpanded]=useState(false);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
      if(visible[0])setActive(visible[0].target.id);
    },{rootMargin:"-110px 0px -60% 0px"});
    headings?.forEach(h=>{const target=document.getElementById(h.id);if(target)observer.observe(target);});
    return ()=>observer.disconnect();
  },[headings]);
  if(!headings?.length)return null;
  return <aside className={`toc ${expanded?"is-expanded":""}`}><p className="micro-label">ON THIS PAGE</p><button className="toc-toggle" aria-expanded={expanded} aria-controls="toc-links" type="button" onClick={()=>setExpanded(!expanded)}><span><List size={15}/>本文目录</span><ChevronDown size={15}/></button><nav id="toc-links" className="toc-links" aria-label="文章目录">{headings.map((h,i)=><a key={h.id} className={`level-${h.level}`} href={"#"+h.id} aria-current={active===h.id?"location":undefined} onClick={()=>{setActive(h.id);setExpanded(false);}}><span>{String(i+1).padStart(2,"0")}</span>{h.text}</a>)}</nav><a className="toc-return" href="/archives/">← 返回探索笔记</a></aside>;
}
