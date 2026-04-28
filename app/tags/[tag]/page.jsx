import PostCard from "@/components/PostCard";
import { getAllTags, getPostsByTag, getTermFromSlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const name = getTermFromSlug(getAllTags(), tag);
  return {
    title: name ? `标签：${name}` : "标签"
  };
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const name = getTermFromSlug(getAllTags(), tag);
  const posts = name ? getPostsByTag(name) : [];

  return (
    <main className="page-shell narrow">
      <header className="page-header">
        <h1>标签：{name}</h1>
        <p>{posts.length} 篇文章</p>
      </header>
      <section className="post-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}

