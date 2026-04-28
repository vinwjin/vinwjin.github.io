import PostCard from "@/components/PostCard";
import { getAllCategories, getPostsByCategory, getTermFromSlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const name = getTermFromSlug(getAllCategories(), category);
  return {
    title: name ? `分类：${name}` : "分类"
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const name = getTermFromSlug(getAllCategories(), category);
  const posts = name ? getPostsByCategory(name) : [];

  return (
    <main className="page-shell narrow">
      <header className="page-header">
        <h1>分类：{name}</h1>
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

