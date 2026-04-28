import CodeCopy from "@/components/CodeCopy";
import TableOfContents from "@/components/TableOfContents";
import { getPage, renderMarkdown } from "@/lib/content";

export const metadata = {
  title: "关于",
  description: "关于 Vinwjin 和 Vinwjin Lab"
};

export default async function AboutPage() {
  const page = getPage("about");
  const html = await renderMarkdown(page.content);

  return (
    <main className="article-shell">
      <article className="article">
        <header className="article-header">
          <h1>{page.title}</h1>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        <CodeCopy />
      </article>
      <TableOfContents headings={page.headings} />
    </main>
  );
}

