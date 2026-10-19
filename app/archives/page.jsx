import PageIntro from "@/components/PageIntro";
import NotesExplorer from "@/components/NotesExplorer";
import { getAllPosts } from "@/lib/content";
import { noteSummary } from "@/lib/presentation";

export const metadata={title:"探索笔记",description:"按时间与主题浏览 Vinwjin 的 AI、NAS 和自动化实践记录。",alternates:{canonical:"/archives/"}};
export default function ArchivesPage(){
  const posts=getAllPosts({includeHidden:false});
  const summaries=posts.map(({slug,title,date,categories,tags,...p})=>({slug,title,date,categories,tags,description:noteSummary({...p,slug})}));
  return <main className="inner-page"><PageIntro eyebrow="FIELD NOTES / ALL ENTRIES" title="把探索，写成笔记" description="问题、尝试与解决过程，都留在这里。按时间回看，也按兴趣继续发现。" count={posts.length}/><NotesExplorer posts={summaries}/><div className="page-end"><span className="status-dot"/>探索仍在继续，笔记慢慢生长。</div></main>;
}
