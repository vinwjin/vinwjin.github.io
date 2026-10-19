"use client";
import {useEffect} from "react";
export default function CodeCopy(){
  useEffect(()=>{
    const cleanups=[];
    document.querySelectorAll(".prose pre").forEach(block=>{
      const button=document.createElement("button");let timer;
      button.type="button";button.className="copy-code";button.textContent="复制";button.setAttribute("aria-label","复制代码");
      const copy=async()=>{
        try{await navigator.clipboard.writeText(block.querySelector("code")?.textContent||"");button.textContent="已复制";}
        catch{button.textContent="复制失败";}
        clearTimeout(timer);timer=setTimeout(()=>{button.textContent="复制";},1500);
      };
      button.addEventListener("click",copy);block.appendChild(button);
      cleanups.push(()=>{button.removeEventListener("click",copy);button.remove();clearTimeout(timer);});
    });
    return ()=>cleanups.forEach(fn=>fn());
  },[]);
  return null;
}
