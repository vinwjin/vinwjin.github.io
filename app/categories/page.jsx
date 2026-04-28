import Link from "next/link";
import { getAllCategories } from "@/lib/content";

export const metadata = {
  title: "分类",
  description: "Vinwjin Lab 的文章分类"
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <main className="page-shell narrow">
      <header className="page-header">
        <h1>分类</h1>
        <p>{categories.length} 个内容方向</p>
      </header>
      <div className="term-grid">
        {categories.map((category) => (
          <Link key={category.name} href={`/categories/${category.slug}/`}>
            <span>{category.name}</span>
            <small>{category.count}</small>
          </Link>
        ))}
      </div>
    </main>
  );
}

