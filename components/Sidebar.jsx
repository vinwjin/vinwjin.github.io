import Link from "next/link";
import { getAllCategories, getAllPosts, getAllTags } from "@/lib/content";
import { site } from "@/lib/site";

export default function Sidebar() {
  const posts = getAllPosts({ includeHidden: false });
  const recent = posts.slice(0, 5);
  const tags = getAllTags().slice(0, 16);
  const categories = getAllCategories();

  return (
    <aside className="sidebar">
      <section>
        <h2>{site.author}</h2>
        <p>AI、NAS、技术宅。折腾记录与经验分享。</p>
      </section>
      <section>
        <h2>最近文章</h2>
        <ul className="plain-list">
          {recent.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>分类</h2>
        <div className="term-list">
          {categories.map((category) => (
            <Link key={category.name} href={`/categories/${category.slug}/`}>
              {category.name}<span>{category.count}</span>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2>标签</h2>
        <div className="tag-cloud">
          {tags.map((tag) => (
            <Link key={tag.name} href={`/tags/${tag.slug}/`}>
              {tag.name}
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

