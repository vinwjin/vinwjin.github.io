"use client";

import { useEffect } from "react";

export default function CodeCopy() {
  useEffect(() => {
    const blocks = document.querySelectorAll("pre");
    const cleanups = [];

    blocks.forEach((block) => {
      if (block.querySelector(".copy-code")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-code";
      button.textContent = "复制";
      const onClick = async () => {
        await navigator.clipboard.writeText(block.innerText.replace(/^复制\n/, ""));
        button.textContent = "已复制";
        window.setTimeout(() => {
          button.textContent = "复制";
        }, 1200);
      };
      button.addEventListener("click", onClick);
      block.appendChild(button);
      cleanups.push(() => button.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}

