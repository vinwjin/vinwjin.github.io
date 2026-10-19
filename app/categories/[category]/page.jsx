import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import PageIntro from "@/components/PageIntro";
import { getAllCategories,getPostsByCategory,getTermFromSlug } from "@/lib/content";
export function generateStaticParams(){return getAllCategories().map(c=>({category:c.slug}));}
export async function generateMetadata({params}){
  const {category}=await params;const name=getTermFromSlug(getAllCategories(),category);
  return {title:`${name||"专题"} · 探索笔记`,alternates:{canonical:`/categories/${category}/`}};
}
export default async function CategoryPage({params}){
  const {category}=await params;const name=getTermFromSlug(getAllCategories(),category);if(!name)notFound();
  const posts=getPostsByCategory(name);
  return <main className="inner-page"><PageIntro eyebrow="EXPLORATION / SUBJECT" title={name} description={`围绕「${name}」的尝试、方法和实践记录。`} count={posts.length} back={{href:"/categories/",label:"全部专题"}}/><div className="collection-layout"><div className="journal-list">{posts.map((p,i)=><PostCard key={p.slug} post={p} index={i}/>)}</div><aside className="collection-aside"><p className="micro-label">KEEP EXPLORING</p><h2>换一条探索路线</h2><nav aria-label="其他专题">{getAllCategories().filter(c=>c.name!==name).map(c=><a href={`/categories/${c.slug}/`} key={c.slug}>{c.name}<span>{c.count} ↗</span></a>)}</nav><a className="text-link" href="/archives/">查看全部笔记 ↗</a></aside></div></main>;
}
