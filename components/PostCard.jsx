import Link from "next/link";
import { CalendarDays, Folder, Tags } from "lucide-react";
import { formatDate } from "@/lib/content";
import { slugify } from "@/lib/slug";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-card-meta">
        <span><CalendarDays size={15} />{formatDate(post.date)}</span>
        {post.categories.length > 0 && <span><Folder size={15} />{post.categories.join(", ")}</span>}
      </div>
      <h2>
        <Link href={`/posts/${post.slug}/`}>{post.title}</Link>
      </h2>
      <p>{post.description || post.excerpt}</p>
      {post.tags.length > 0 && (
        <div className="tag-row">
          <Tags size={15} />
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${slugify(tag)}/`}>
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
