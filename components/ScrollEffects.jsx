"use client";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
export default function ScrollEffects(){
  const [visible,setVisible]=useState(false);
  const [progress,setProgress]=useState(0);
  useEffect(()=>{
    let frame=0;
    function update(){
      const max=document.documentElement.scrollHeight-innerHeight;
      setProgress(max>0?Math.min(scrollY/max*100,100):0);
      setVisible(scrollY>550);frame=0;
    }
    function scroll(){if(!frame)frame=requestAnimationFrame(update);}
    update();addEventListener("scroll",scroll,{passive:true});addEventListener("resize",scroll);
    return ()=>{removeEventListener("scroll",scroll);removeEventListener("resize",scroll);cancelAnimationFrame(frame);};
  },[]);
  return <><div className="reading-progress" style={{width:progress+"%"}}/><button type="button" className={`back-top ${visible?"is-visible":""}`} aria-label="回到顶部" onClick={()=>window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})}><ArrowUp size={18}/></button></>;
}
