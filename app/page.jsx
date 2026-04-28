import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { getAllPosts } from "@/lib/content";
import { site } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts({ includeHidden: false });

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">AI / NAS / Automation</p>
        <h1>{site.title}</h1>
        <p>{site.description}</p>
      </section>
      <div className="content-grid">
        <section className="post-list" aria-label="文章列表">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </section>
        <Sidebar />
      </div>
    </main>
  );
}

