"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import NewsCard from "./NewsCard";
import { cn } from "@/lib/utils";

const categories = [
  { id: "world", label: "World", emoji: "🌍" },
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "ai", label: "AI", emoji: "🤖" },
  { id: "business", label: "Business", emoji: "📈" },
  { id: "science", label: "Science", emoji: "🔬" },
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
  const [activeCategory, setActiveCategory] = useState("world");
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">News Feed</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Today&apos;s World, Explained</h2>
          <p className="text-slate-400 text-sm mt-1">Click &ldquo;Get Context&rdquo; on any article for an AI-powered deep dive.</p>
        </div>
        <button
          onClick={() => loadNews(activeCategory)}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
              activeCategory === cat.id
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600/50 hover:text-slate-300"
            )}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          <span className="ml-2 text-slate-400 text-sm">Loading news...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
          {error === "NEWS_API_KEY not configured"
            ? "Add your NewsAPI key to .env.local to load real news."
            : error}
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, i) => (
            <NewsCard key={`${article.url}-${i}`} article={article} />
          ))}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          No articles found for this category.
        </div>
      )}
    </div>
  );
}
