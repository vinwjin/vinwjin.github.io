"use client";
import { useMemo,useState } from "react";
import Link from "next/link";
import { ArrowUpRight,Search } from "lucide-react";

export default function NotesExplorer({posts}){
  const [filter,setFilter]=useState("全部");
  const [query,setQuery]=useState("");
  const categories=["全部",...new Set(posts.flatMap(p=>p.categories))];
  const filtered=useMemo(()=>posts.filter(p=>(filter==="全部"||p.categories.includes(filter))&&[p.title,p.description,...p.tags].join(" ").toLowerCase().includes(query.trim().toLowerCase())),[posts,filter,query]);
  const years=[...new Set(filtered.map(p=>p.date.slice(0,4)))];
  return <>
    <div className="notes-toolbar"><div className="filter-chips" aria-label="按分类筛选">{categories.map(c=><button type="button" key={c} onClick={()=>setFilter(c)} aria-pressed={filter===c}>{c}{c==="全部"&&<span>{posts.length}</span>}</button>)}</div><label className="notes-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="在笔记中查找…" aria-label="筛选笔记"/></label></div>
    <div className="archive-results" aria-live="polite"><div className="result-caption"><span>EXPLORATION LOG</span><span>{filtered.length} 篇笔记</span></div>
      {years.map(year=><section className="archive-year" key={year}><div className="year-marker"><strong>{year}</strong><span>{filtered.filter(p=>p.date.startsWith(year)).length} 篇记录</span></div><div>{filtered.filter(p=>p.date.startsWith(year)).map(post=><Link className="archive-entry" href={`/posts/${post.slug}/`} key={post.slug}><time dateTime={post.date}><span>{post.date.slice(5,7)} /</span>{post.date.slice(8,10)}</time><div><div className="note-meta">{post.categories.join(" / ")}</div><h2>{post.title}</h2><p>{post.description}</p><div className="archive-tags">{post.tags.slice(0,4).map(t=><span key={t}>#{t}</span>)}</div></div><ArrowUpRight size={21}/></Link>)}</div></section>)}
      {!filtered.length&&<div className="empty-notes"><Search size={30}/><h2>这里暂时没有匹配的笔记</h2><p>换个关键词，或回到全部笔记继续探索。</p><button className="solid-button" type="button" onClick={()=>{setQuery("");setFilter("全部");}}>查看全部笔记</button></div>}
    </div>
  </>;
}
