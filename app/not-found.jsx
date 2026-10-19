import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound(){return <main className="inner-page not-found"><p className="micro-label">A LITTLE OFF THE TRAIL</p><span>404<span className="orange-dot">.</span></span><h1>这条探索路线，暂时走不到。</h1><p>页面可能已经移动。回到笔记，换一条线索继续探索。</p><Link className="solid-button" href="/archives/"><ArrowLeft size={16}/>返回探索笔记</Link></main>;}
