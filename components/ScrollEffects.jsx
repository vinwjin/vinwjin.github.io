"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollEffects() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadBingWallpaper() {
      try {
        const response = await fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN", {
          cache: "no-store"
        });
        const data = await response.json();
        const imageUrl = data?.images?.[0]?.url;

        if (!cancelled && imageUrl) {
          document.documentElement.style.setProperty("--hero-bg", `url("https://www.bing.com${imageUrl}")`);
        }
      } catch {
        document.documentElement.style.removeProperty("--hero-bg");
      }
    }

    loadBingWallpaper();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fadeMax = window.innerHeight * 0.72;
      const fadeProgress = Math.min(scrollY / fadeMax, 1);
      const background = document.querySelector(".web-bg");

      if (background) {
        background.style.opacity = String(Math.max(1 - fadeProgress * 0.78, 0.22));
        background.style.filter = `blur(${fadeProgress * 2.5}px) saturate(${1 - fadeProgress * 0.18})`;
      }

      setVisible(scrollY > 420);
      setProgress(max > 0 ? Math.min((scrollY / max) * 100, 100) : 0);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} />
      <button
        className={`back-top ${visible ? "is-visible" : ""}`}
        type="button"
        aria-label="回到顶部"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
