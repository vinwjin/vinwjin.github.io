import Link from "next/link";
import { formatDate, getArchiveGroups } from "@/lib/content";

export const metadata = {
  title: "归档",
  description: "Vinwjin Lab 的文章归档"
};

export default function ArchivesPage() {
  const groups = getArchiveGroups();

  return (
    <main className="page-shell narrow">
      <header className="page-header">
        <h1>归档</h1>
        <p>{groups.reduce((sum, [, posts]) => sum + posts.length, 0)} 篇公开文章</p>
      </header>
      <div className="timeline">
        {groups.map(([year, posts]) => (
          <section key={year}>
            <h2>{year}</h2>
            {posts.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}/`} className="timeline-item">
                <time>{formatDate(post.date, { month: "2-digit", day: "2-digit" })}</time>
                <span>{post.title}</span>
              </Link>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}

