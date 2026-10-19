import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft,ArrowRight,Clock3,CalendarDays } from "lucide-react";
import CodeCopy from "@/components/CodeCopy";
import TableOfContents from "@/components/TableOfContents";
import { formatDate,getAllPosts,getAllTags,getPost,getRelatedPosts,renderMarkdown,headingsFromHtml } from "@/lib/content";
import { noteSummary,readingMinutes } from "@/lib/presentation";
import { slugify } from "@/lib/slug";
import { site } from "@/lib/site";

export function generateStaticParams(){return getAllPosts().map(post=>({slug:post.slug}));}
export async function generateMetadata({params}){
  const {slug}=await params;const post=getPost(slug);if(!post)return {};
  return {title:post.title,description:noteSummary(post),alternates:{canonical:`/posts/${post.slug}/`},openGraph:{title:post.title,description:noteSummary(post),url:`${site.url}/posts/${post.slug}/`,images:["/images/social-cover.svg"]}};
}
export default async function PostPage({params}){
  const {slug}=await params;const post=getPost(slug);if(!post)notFound();
  const html=await renderMarkdown(post.content);const headings=headingsFromHtml(html);
  const related=getRelatedPosts(post,2);
  const visibleTags=post.tags.filter(tag=>getAllTags().some(item=>item.name===tag));
  const publicPosts=getAllPosts({includeHidden:false});const index=publicPosts.findIndex(p=>p.slug===slug);
  const newer=index>0?publicPosts[index-1]:null;const older=index>=0?publicPosts[index+1]:null;
  return <main className="reading-page">
    <div className="article-breadcrumb"><Link href="/archives/"><ArrowLeft size={14}/>探索笔记</Link><span>/</span><span>{post.categories[0]||"笔记"}</span></div>
    <header className="article-hero"><p className="micro-label"><span className="orange-line"/>FIELD NOTE / {post.date.slice(0,4)}</p><h1>{post.title}</h1><p className="article-deck">{noteSummary(post)}</p><div className="article-byline"><span className="mini-avatar">v_</span><div><strong>Vinwjin</strong><span>探索与实践记录</span></div><div className="article-date"><CalendarDays size={13}/><time dateTime={post.date}>{formatDate(post.date)}</time></div><span className="reading-time"><Clock3 size={13}/>约 {readingMinutes(post)} 分钟</span>{post.updated&&post.updated!==post.date&&<span className="article-updated">更新于 {formatDate(post.updated)}</span>}</div><div className="tag-row">{visibleTags.map(tag=><Link href={`/tags/${slugify(tag)}/`} key={tag}>#{tag}</Link>)}</div></header>
    <div className="reading-grid"><article className="article"><div className="prose" dangerouslySetInnerHTML={{__html:html}}/><CodeCopy/><div className="article-endmark">✳<span>本篇笔记到这里，探索还在继续。</span></div><div className="article-pager">{newer?<Link href={`/posts/${newer.slug}/`}><small><ArrowLeft size={13}/>较新的笔记</small><strong>{newer.title}</strong></Link>:<Link href="/archives/"><small><ArrowLeft size={13}/>回到笔记</small><strong>看看其他探索记录</strong></Link>}{older&&<Link href={`/posts/${older.slug}/`}><small>较早的笔记<ArrowRight size={13}/></small><strong>{older.title}</strong></Link>}</div></article><TableOfContents headings={headings}/></div>
    {related.length>0&&<section className="related-notes"><div className="section-top"><div><p className="micro-label">FOLLOW THE THREAD</p><h2>顺着线索，再读一篇</h2></div></div><div>{related.map(p=><Link key={p.slug} href={`/posts/${p.slug}/`}><small>{p.categories.join(" / ")}</small><h3>{p.title}<ArrowRight size={20}/></h3><p>{noteSummary(p)}</p></Link>)}</div></section>}
  </main>;
}
