"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import NewsCard from "./NewsCard";
import { cn } from "@/lib/utils";

const categories = [
  { id: "singapore", label: "Singapore" },
  { id: "world", label: "World Affairs" },
  { id: "tech", label: "Technology" },
  { id: "ai", label: "AI & Science" },
  { id: "business", label: "Business" },
  { id: "science", label: "Science" },
];

interface Article {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: string;
}

export default function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState("singapore");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/news?category=${category}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setArticles(data.articles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(activeCategory);
  }, [activeCategory]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-1">News Analysis</p>
          <h2 className="text-2xl font-bold text-white">Current Affairs</h2>
          <p className="text-[#666] text-xs font-sans mt-1">
            Select any article — click &ldquo;Deep Context&rdquo; for a full analytical briefing.
          </p>
        </div>
        <button
          onClick={() => loadNews(activeCategory)}
          disabled={loading}
          className="p-2 text-[#444] hover:text-[#888] transition-colors disabled:opacity-30 mt-1"
          title="Refresh"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
        </button>
      </div>

      <div className="flex gap-0 mb-8 border-b border-[#1e1e1e] font-sans overflow-x-auto scrollbar-none" style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2.5 text-xs font-medium tracking-wide transition-colors duration-150 border-b-2 -mb-px whitespace-nowrap flex-shrink-0",
              activeCategory === cat.id
                ? "text-[#c8a96e] border-[#c8a96e]"
                : "text-[#555] border-transparent hover:text-[#888]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-12 text-[#444] font-sans">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Loading articles...</span>
        </div>
      )}

      {error && (
        <div className="border border-[#2a1a1a] bg-[#110a0a] p-4 text-[#c87070] text-sm font-sans">
          {error === "NEWS_API_KEY not configured"
            ? "Add NEWS_API_KEY to your environment variables."
            : error}
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1e1e1e]">
          {articles.map((article, i) => (
            <div key={`${article.url}-${i}`} className="bg-[#0a0a0a]">
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <p className="text-[#444] text-sm font-sans py-12">No articles available.</p>
      )}
    </div>
  );
}
