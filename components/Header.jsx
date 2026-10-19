"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/", label: "首页" },
  { href: "/archives/", label: "探索笔记" },
  { href: "/categories/", label: "专题" },
  { href: "/tags/", label: "标签索引" },
  { href: "/about/", label: "关于我" }
];

export default function Header({ onSearch }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  }
  return <header className="header-wrap">
    <a className="skip-link" href="#main-content">跳到正文</a>
    <div className="site-header">
      <Link href="/" className="brand" aria-label="Vinwjin Lab 首页"><span className="brand-mark">v_</span><span>Vinwjin<span className="brand-light"> Lab</span><small>PERSONAL DIGITAL GARDEN</small></span></Link>
      <nav className="nav-links" aria-label="主导航">{navigation.map(({href,label})=>{
        const active=href==="/"?pathname==="/":href==="/archives/"?(pathname.startsWith("/archives")||pathname.startsWith("/posts")):pathname.startsWith(href.slice(0,-1));
        return <Link key={href} href={href} aria-current={active?"page":undefined}>{label}</Link>;
      })}</nav>
      <div className="header-actions">
        <button className="search-trigger" type="button" onClick={onSearch} aria-label="搜索"><Search size={16}/><span>搜索</span><kbd>⌘ K</kbd></button>
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label="切换深浅色" aria-pressed={theme==="dark"}>{theme==="dark"?<Sun size={17}/>:<Moon size={17}/>}</button>
        <a className="icon-button github-header" href="https://github.com/vinwjin" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a>
      </div>
    </div>
  </header>;
}
