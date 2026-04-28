import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { postSlugFromFilename, slugify } from "./slug.js";

const root = process.cwd();
const postsDirectory = path.join(root, "content", "posts");
const pagesDirectory = path.join(root, "content", "pages");

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.map(String) : [String(value)];
}

function normalizeDate(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

export function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options
  }).format(new Date(value));
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

function extractHeadings(markdown) {
  const seen = new Map();
  return markdown
    .split("\n")
    .map((line) => /^(#{2,3})\s+(.+)$/.exec(line.trim()))
    .filter(Boolean)
    .map((match) => {
      const text = match[2].replace(/[#`*_]/g, "").trim();
      const base = slugify(text);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return {
        id: count ? `${base}-${count}` : base,
        text,
        level: match[1].length
      };
    });
}

function readPostFile(filename) {
  const fullPath = path.join(postsDirectory, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const slug = postSlugFromFilename(filename);
  const title = String(data.title ?? slug);
  const plainText = stripMarkdown(content);

  return {
    slug,
    title,
    date: normalizeDate(data.date),
    updated: normalizeDate(data.updated),
    description: data.description ? String(data.description) : plainText.slice(0, 160),
    categories: asArray(data.categories),
    tags: asArray(data.tags),
    cover: data.cover ? String(data.cover) : "/images/cover.jpg",
    hide: Boolean(data.hide),
    content,
    excerpt: plainText.slice(0, 220),
    readingTime: readingTime(plainText).text,
    headings: extractHeadings(content)
  };
}

export function getAllPosts({ includeHidden = true } = {}) {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map(readPostFile)
    .filter((post) => includeHidden || !post.hide)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPost(slug) {
  const post = getAllPosts().find((item) => item.slug === slug);
  if (!post) return null;
  return post;
}

export async function renderMarkdown(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] }
    })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file);
}

export function getPage(slug) {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    date: normalizeDate(data.date),
    content,
    headings: extractHeadings(content)
  };
}

export function getAllTags() {
  return countTerms(getAllPosts({ includeHidden: false }).flatMap((post) => post.tags));
}

export function getAllCategories() {
  return countTerms(getAllPosts({ includeHidden: false }).flatMap((post) => post.categories));
}

export function getPostsByTag(tag) {
  return getAllPosts({ includeHidden: false }).filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category) {
  return getAllPosts({ includeHidden: false }).filter((post) => post.categories.includes(category));
}

export function getArchiveGroups() {
  const groups = new Map();
  for (const post of getAllPosts({ includeHidden: false })) {
    const date = new Date(post.date);
    const key = `${date.getFullYear()}`;
    groups.set(key, [...(groups.get(key) ?? []), post]);
  }
  return [...groups.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
}

export function getRelatedPosts(post, limit = 5) {
  const score = (candidate) => {
    const tagHits = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
    const categoryHits = candidate.categories.filter((category) => post.categories.includes(category)).length;
    return tagHits * 2 + categoryHits;
  };

  return getAllPosts({ includeHidden: false })
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({ candidate, score: score(candidate) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.candidate.date) - new Date(a.candidate.date))
    .slice(0, limit)
    .map((item) => item.candidate);
}

function countTerms(terms) {
  const counts = new Map();
  for (const term of terms) counts.set(term, (counts.get(term) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}

export function getTermFromSlug(items, slug) {
  return items.find((item) => item.slug === slug)?.name ?? null;
}
