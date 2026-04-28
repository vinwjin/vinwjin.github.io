import Link from "next/link";
import { notFound } from "next/navigation";
import CodeCopy from "@/components/CodeCopy";
import TableOfContents from "@/components/TableOfContents";
import { formatDate, getAllPosts, getPost, getRelatedPosts, renderMarkdown } from "@/lib/content";
import { slugify } from "@/lib/slug";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/posts/${post.slug}/`
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${site.url}/posts/${post.slug}/`,
      images: [post.cover]
    }
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const html = await renderMarkdown(post.content);
  const related = getRelatedPosts(post);

  return (
    <main className="article-shell">
      <article className="article">
        <header className="article-header">
          <div className="post-card-meta">
            <span>{formatDate(post.date)}</span>
            <span>{post.readingTime}</span>
            {post.categories.length > 0 && <span>{post.categories.join(", ")}</span>}
          </div>
          <h1>{post.title}</h1>
          {post.description && <p>{post.description}</p>}
          {post.tags.length > 0 && (
            <div className="tag-row">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${slugify(tag)}/`}>
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        <CodeCopy />
        {related.length > 0 && (
          <section className="related">
            <h2>相关文章</h2>
            <div className="related-list">
              {related.map((item) => (
                <Link key={item.slug} href={`/posts/${item.slug}/`}>
                  <span>{item.title}</span>
                  <small>{formatDate(item.date)}</small>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
      <TableOfContents headings={post.headings} />
    </main>
  );
}
