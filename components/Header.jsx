"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export default function Header({ onSearch }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = saved || preferred;
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme || theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Vinwjin Lab 首页">
        <Image src="/images/logo.svg" alt="" width={34} height={34} priority />
        <span>{site.title}</span>
      </Link>
      <nav className="nav-links" aria-label="主导航">
        {site.nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" onClick={onSearch} aria-label="搜索">
          <Search size={18} />
        </button>
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label="切换暗色模式">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a className="icon-button" href={site.github} aria-label="GitHub" target="_blank" rel="noreferrer">
          <Github size={18} />
        </a>
      </div>
    </header>
  );
}
