import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { formatDate } from "@/lib/content";
import { noteSummary,readingMinutes } from "@/lib/presentation";
import { slugify } from "@/lib/slug";
export default function PostCard({post,index=0}){
  return <article className="journal-card"><span className="journal-number">{String(index+1).padStart(2,"0")}</span><div className="journal-body"><div className="note-meta"><span>{post.categories.join(" / ")}</span><time dateTime={post.date}>{formatDate(post.date)}</time></div><h2><Link href={`/posts/${post.slug}/`}>{post.title}</Link></h2><p>{noteSummary(post)}</p><div className="journal-bottom"><div className="tag-row">{post.tags.map(tag=><Link key={tag} href={`/tags/${slugify(tag)}/`}>#{tag}</Link>)}</div><span className="reading-time"><Clock3 size={12}/>约 {readingMinutes(post)} 分钟</span></div></div><Link className="round-link" href={`/posts/${post.slug}/`} aria-label={`阅读：${post.title}`}><ArrowUpRight size={20}/></Link></article>;
}
