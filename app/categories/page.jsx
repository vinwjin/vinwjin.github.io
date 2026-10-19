import Link from "next/link";
import { ArrowUpRight,Cpu,Server,Workflow,BookOpen,FlaskConical } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import { getAllCategories } from "@/lib/content";

export const metadata={title:"探索专题",description:"沿着 AI、NAS 与自动化的线索，找到感兴趣的实践笔记。",alternates:{canonical:"/categories/"}};
const details={
  AI:{Icon:Cpu,en:"ARTIFICIAL INTELLIGENCE",desc:"AI 助手、工具接入与本地部署，探索想法落地的不同路径。",color:"terra"},
  NAS:{Icon:Server,en:"PERSONAL INFRASTRUCTURE",desc:"从私有云到容器服务，搭建属于自己的数字基础设施。",color:"sage"},
  "浏览器自动化":{Icon:Workflow,en:"BROWSER AUTOMATION",desc:"连接 Agent 与真实浏览器，记录工具选择、环境配置和工作流程。",color:"sand"},
  "教程":{Icon:BookOpen,en:"GUIDES & HOW-TOS",desc:"把安装配置和操作步骤整理清楚，为下一次实践留一份路标。",color:"stone"},
  "体验":{Icon:FlaskConical,en:"HANDS-ON EXPERIENCES",desc:"从实际使用出发，记下工具的第一印象与折腾心得。",color:"sage"}
};
export default function CategoriesPage(){
  const categories=getAllCategories();
  return <main className="inner-page"><PageIntro eyebrow="EXPLORATION / BY SUBJECT" title="顺着兴趣，继续探索" description="从一个工具，到一套工作流。这里的每个专题，都是一次持续的尝试。"/><div className="topic-index">{categories.map((category,i)=>{
    const {Icon,en,desc,color}=details[category.name]||{Icon:BookOpen,en:"NOTES & IDEAS",desc:"记录与这个主题相关的实践笔记。",color:"stone"};
    return <Link key={category.slug} className={`topic-card ${color}`} href={`/categories/${category.slug}/`}><div className="topic-top"><span className="topic-icon"><Icon size={29} strokeWidth={1.4}/></span><span>0{i+1} / {String(category.count).padStart(2,"0")} NOTES</span></div><p className="micro-label">{en}</p><h2>{category.name}<ArrowUpRight size={24}/></h2><p>{desc}</p><div className="topic-bottom"><span>进入专题</span><span>{category.count} 篇笔记</span></div></Link>;
  })}</div><div className="index-note"><span>INTEREST-LED, PRACTICE-DRIVEN.</span><p>一篇笔记可能属于多个专题。换一个入口，也会发现新的关联。</p></div></main>;
}
