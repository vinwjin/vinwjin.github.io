import Link from "next/link";
import { ArrowUpRight,Hash } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import { getAllTags } from "@/lib/content";
export const metadata={title:"标签索引",description:"通过关键词连接工具、主题和探索笔记。",alternates:{canonical:"/tags/"}};
export default function TagsPage(){
  const tags=getAllTags();const max=Math.max(...tags.map(t=>t.count));
  return <main className="inner-page"><PageIntro eyebrow="THE INDEX / CONNECT THE DOTS" title="用关键词，连接想法" description="工具、技术与实践场景，交织成这个实验室的兴趣地图。"/><div className="tag-index-layout"><aside className="tag-index-summary"><Hash size={42} strokeWidth={1}/><strong>{String(tags.length).padStart(2,"0")}</strong><span>个关键词</span><p>从熟悉的名字开始，找到与它相关的笔记。</p><div className="tiny-line"/><small>每个数字，都是一次留下记录的探索。</small></aside><div className="tag-index">{tags.map((tag,i)=><Link className="tag-index-item" href={`/tags/${tag.slug}/`} key={tag.slug}><span className="tag-index-number">{String(i+1).padStart(2,"0")}</span><strong><span>#</span>{tag.name}</strong><span className="tag-frequency"><i style={{width:(tag.count/max*100)+"%"}}/></span><span className="tag-count">{tag.count} 篇</span><ArrowUpRight size={17}/></Link>)}</div></div></main>;
}
