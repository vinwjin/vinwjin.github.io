import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAllPosts, renderMarkdown } from "../lib/content.js";
import { site } from "../lib/site.js";

const root = process.cwd();
const publicDir = path.join(root, "public");
const searchDir = path.join(publicDir, "js", "search");

fs.mkdirSync(searchDir, { recursive: true });

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_\-~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const posts = getAllPosts({ includeHidden: false });
const now = new Date().toISOString();

const searchIndex = posts.map((post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  date: post.date,
  tags: post.tags,
  categories: post.categories,
  text: stripMarkdown(post.content).slice(0, 5000)
}));

fs.writeFileSync(
  path.join(searchDir, "local-search.json"),
  JSON.stringify(searchIndex, null, 2),
  "utf8"
);

const sitemapUrls = [
  "",
  "archives/",
  "tags/",
  "categories/",
  "about/",
  ...posts.map((post) => `posts/${post.slug}/`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (url) => `  <url>
    <loc>${site.url}/${url}</loc>
    <lastmod>${now}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");

const entries = await Promise.all(
  posts.slice(0, 20).map(async (post) => {
    const html = await renderMarkdown(post.content);
    return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${site.url}/posts/${post.slug}/"/>
    <id>${site.url}/posts/${post.slug}/</id>
    <updated>${escapeXml(post.updated || post.date)}</updated>
    <summary>${escapeXml(post.description)}</summary>
    <content type="html">${escapeXml(html)}</content>
  </entry>`;
  })
);

const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(site.title)}</title>
  <subtitle>${escapeXml(site.description)}</subtitle>
  <link href="${site.url}/atom.xml" rel="self"/>
  <link href="${site.url}/"/>
  <updated>${now}</updated>
  <id>${site.url}/</id>
  <author>
    <name>${escapeXml(site.author)}</name>
  </author>
${entries.join("\n")}
</feed>
`;

fs.writeFileSync(path.join(publicDir, "atom.xml"), atom, "utf8");

const aboutSource = path.join(root, "content", "pages", "about.md");
if (fs.existsSync(aboutSource)) {
  const raw = fs.readFileSync(aboutSource, "utf8");
  matter(raw);
}

console.log(`Generated search index, sitemap, and Atom feed for ${posts.length} posts.`);
