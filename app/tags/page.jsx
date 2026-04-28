import Link from "next/link";
import { getAllTags } from "@/lib/content";

export const metadata = {
  title: "标签",
  description: "Vinwjin Lab 的文章标签"
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main className="page-shell narrow">
      <header className="page-header">
        <h1>标签</h1>
        <p>{tags.length} 个主题索引</p>
      </header>
      <div className="term-grid">
        {tags.map((tag) => (
          <Link key={tag.name} href={`/tags/${tag.slug}/`}>
            <span>{tag.name}</span>
            <small>{tag.count}</small>
          </Link>
        ))}
      </div>
    </main>
  );
}

