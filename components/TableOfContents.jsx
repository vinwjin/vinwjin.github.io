export default function TableOfContents({ headings }) {
  if (!headings?.length) return null;

  return (
    <nav className="toc" aria-label="文章目录">
      <h2>目录</h2>
      {headings.map((heading) => (
        <a key={heading.id} className={`level-${heading.level}`} href={`#${heading.id}`}>
          {heading.text}
        </a>
      ))}
    </nav>
  );
}

