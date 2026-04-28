"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function SearchDialog({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open || items.length) return;
    fetch("/js/search/local-search.json")
      .then((response) => response.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, [open, items.length]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return items.slice(0, 8);
    return items
      .map((item) => {
        const haystack = `${item.title} ${item.description} ${item.tags.join(" ")} ${item.categories.join(" ")} ${item.text}`.toLowerCase();
        const score = words.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ item }) => item);
  }, [items, query]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="站内搜索">
      <div className="search-panel">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索文章、标签、分类"
          />
          <button type="button" className="icon-button" onClick={onClose} aria-label="关闭搜索">
            <X size={18} />
          </button>
        </div>
        <div className="search-results">
          {results.length ? (
            results.map((item) => (
              <Link key={item.slug} href={`/posts/${item.slug}/`} onClick={onClose} className="search-result">
                <span>{item.title}</span>
                <small>{item.description}</small>
              </Link>
            ))
          ) : (
            <p className="empty-state">没有找到匹配内容。</p>
          )}
        </div>
      </div>
    </div>
  );
}

