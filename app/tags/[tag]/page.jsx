import { notFound } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import PageIntro from "@/components/PageIntro";
import { getAllTags,getPostsByTag,getTermFromSlug } from "@/lib/content";
export function generateStaticParams(){return getAllTags().map(t=>({tag:t.slug}));}
export async function generateMetadata({params}){
  const {tag}=await params;const name=getTermFromSlug(getAllTags(),tag);
  return {title:`#${name||"标签"} · 探索笔记`,alternates:{canonical:`/tags/${tag}/`}};
}
export default async function TagPage({params}){
  const {tag}=await params;const name=getTermFromSlug(getAllTags(),tag);if(!name)notFound();
  const posts=getPostsByTag(name);const relatedTags=[...new Set(posts.flatMap(p=>p.tags))].filter(t=>t!==name);
  return <main className="inner-page"><PageIntro eyebrow="THE INDEX / KEYWORD" title={"#"+name} description={`那些与 ${name} 有关的想法和实践。`} count={posts.length} back={{href:"/tags/",label:"标签索引"}}/><div className="collection-layout"><div className="journal-list">{posts.map((p,i)=><PostCard key={p.slug} post={p} index={i}/>)}</div><aside className="collection-aside"><p className="micro-label">CONNECTED IDEAS</p><h2>笔记里的其他关键词</h2><div className="related-tags">{relatedTags.map(t=>{const item=getAllTags().find(x=>x.name===t);return item&&<Link key={t} href={`/tags/${item.slug}/`}>#{t}</Link>;})}</div></aside></div></main>;
}
