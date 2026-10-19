import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function PageIntro({eyebrow,title,description,count,back}){
  return <header className="page-intro">
    {back&&<Link className="back-link" href={back.href}><ArrowLeft size={14}/>{back.label}</Link>}
    <div className="page-intro-grid"><div><p className="micro-label"><span className="orange-line"/>{eyebrow}</p><h1>{title}<span className="orange-dot">.</span></h1><p className="page-description">{description}</p></div>{count!==undefined&&<div className="page-count"><strong>{String(count).padStart(2,"0")}</strong><span>篇探索笔记</span></div>}</div>
  </header>;
}
