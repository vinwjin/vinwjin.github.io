import Link from "next/link";
import { ArrowUpRight, ArrowRight, Terminal, Cpu, Server, Workflow, Github } from "lucide-react";
import { getAllPosts, formatDate } from "@/lib/content";

export default function HomePage() {
  const posts = getAllPosts({ includeHidden: false });
  return <main className="personal-home">
    <section className="intro-grid" aria-labelledby="intro-title">
      <div className="intro-copy">
        <p className="micro-label"><span className="status-dot" /> 一个持续生长的个人实验室</p>
        <h1 id="intro-title">你好，我是<br /><span>Vinwjin<span className="orange-dot">.</span></span></h1>
        <h2>保持好奇，把想法变成日常。</h2>
        <p className="intro-description">一个热爱技术的折腾者。在 AI、NAS 与自动化之间探索，记录从「试试看」到「原来如此」的每一步。</p>
        <div className="intro-buttons"><a className="solid-button" href="#notes">看看我的笔记 <ArrowRight size={17}/></a><a className="plain-button" href="https://github.com/vinwjin" target="_blank" rel="noreferrer"><Github size={17}/> GitHub <ArrowUpRight size={15}/></a></div>
        <div className="intro-footnote"><span>独立探索</span><i /> <span>实践记录</span><i /> <span>开放分享</span></div>
      </div>
      <div className="lab-art" aria-label="AI、NAS 与自动化组成的个人实验室插画" role="img">
        <div className="art-grid"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/>
        <span className="art-coordinate">VINWJIN / DIGITAL WORKSPACE</span>
        <div className="art-core"><span>V<span>_</span></span><small>LAB / 01</small></div>
        <div className="floating-node ai-node"><Cpu size={23}/><div><b>AI 探索</b><small>Ideas into reality</small></div><span className="node-led"/></div>
        <div className="floating-node nas-node"><Server size={23}/><div><b>我的私有云</b><small>A place for everything</small></div></div>
        <div className="terminal-node"><div><span/><span/><span/><small>~/vinwjin/lab</small></div><p><em>❯</em> keep exploring<span className="cursor">_</span></p><small>好奇心，是最好的驱动力。</small></div>
        <span className="art-caption">BUILD. BREAK. LEARN. REPEAT.</span><span className="art-plus">+</span>
      </div>
    </section>
    <section className="explore-section" id="explore"><div className="section-top"><div><p className="micro-label">THE EXPLORATION</p><h2>我在折腾什么<span className="orange-dot"> ↗</span></h2></div><p>从兴趣出发，在实践中找到答案。</p></div>
      <div className="explore-grid">{[
        {n:"01",Icon:Cpu,title:"AI 与智能工具",en:"ARTIFICIAL INTELLIGENCE",desc:"探索 AI 助手与工具的用法，让想法拥有更直接的实现路径。",tags:"Claude / ChatGPT / OpenClaw",href:"/categories/ai/"},
        {n:"02",Icon:Server,title:"NAS 与私有云",en:"PERSONAL INFRASTRUCTURE",desc:"搭建自己的数字空间，存放数据、运行服务，也享受折腾的过程。",tags:"飞牛 NAS / Docker / 私有云",href:"/categories/nas/"},
        {n:"03",Icon:Workflow,title:"自动化与工作流",en:"AUTOMATION & WORKFLOWS",desc:"连接浏览器、脚本与 Agent，把重复的操作交给工具。",tags:"MCP / Playwriter / Shell",href:"/posts/2026-04-27-browser-mcp-playwriter-playwright-notes/"}
      ].map(({n,Icon,title,en,desc,tags,href})=><Link className="explore-card" href={href} key={n}><div className="card-top"><Icon size={26} strokeWidth={1.5}/><span>{n}</span></div><small>{en}</small><h3>{title}<ArrowUpRight size={20}/></h3><p>{desc}</p><div className="card-tags">{tags}</div></Link>)}</div>
    </section>
    <section className="notes-section" id="notes"><div className="section-top"><div><p className="micro-label">FIELD NOTES</p><h2>最近的探索笔记</h2></div><Link className="text-link" href="/archives/">全部笔记 <ArrowUpRight size={17}/></Link></div><div className="notes-list">{posts.map((p,i)=><Link href={`/posts/${p.slug}/`} className="note-row" key={p.slug}><span className="note-number">0{i+1}</span><div><div className="note-meta">{p.categories.join(" · ")}<span>{formatDate(p.date)}</span></div><h3>{p.title}</h3><p>{p.description.slice(0,90)}{p.description.length>90?"…":""}</p></div><span className="note-arrow"><ArrowUpRight size={23}/></span></Link>)}</div></section>
    <section className="about-strip"><div className="about-symbol"><Terminal size={32}/></div><div><p className="micro-label">A LITTLE ABOUT ME</p><h2>折腾，是最好的学习方式。</h2><p>这里是我的数字花园，存放经验、灵感，以及那些值得分享的尝试。</p></div><Link href="/about/" className="plain-button">更多关于我 <ArrowUpRight size={18}/></Link></section>
    <footer className="home-footer"><a href="/">Vinwjin<span className="orange-dot"> Lab.</span></a><span>保持好奇，持续探索。 © 2026 Vinwjin</span><a href="/atom.xml">RSS <ArrowUpRight size={13}/></a></footer>
  </main>;
}
