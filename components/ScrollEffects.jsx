"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollEffects() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fadeMax = window.innerHeight * 0.6;
      const fadeProgress = Math.min(scrollY / fadeMax, 1);
      const background = document.querySelector(".web-bg");

      if (background) {
        background.style.opacity = String(Math.max(1 - fadeProgress * 0.45, 0.55));
        background.style.filter = `blur(${fadeProgress * 0.8}px)`;
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
