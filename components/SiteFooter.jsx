import Link from "next/link";
import { ArrowUpRight, Github, Rss } from "lucide-react";

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top"><div><Link href="/" className="footer-brand">Vinwjin<span> Lab.</span></Link><p>一个人的实验室，也是持续生长的数字花园。</p></div><div className="footer-links"><a href="https://github.com/vinwjin" target="_blank" rel="noreferrer"><Github size={15}/>GitHub<ArrowUpRight size={13}/></a><a href="/atom.xml"><Rss size={15}/>订阅笔记<ArrowUpRight size={13}/></a></div></div>
    <div className="footer-bottom"><span>© 2026 Vinwjin · 保持好奇，持续探索。</span><span>AI / NAS / AUTOMATION</span><Link href="/about/">认识这个实验室 <ArrowUpRight size={12}/></Link></div>
  </footer>;
}
