"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface Article {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: string;
}

interface Brief {
  whatsHappening: string;
  backgroundContext: string;
  keyPlayers: { name: string; role: string }[];
  whyItMatters: string;
  keyTerms: { term: string; definition: string }[];
  biggerPicture: string;
  whatToWatchNext: string;
}

export default function NewsCard({ article }: { article: Article }) {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(false);

  const loadBrief = async () => {
    if (brief) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: article.title, description: article.description }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBrief(data);
      setExpanded(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-colors duration-200">
      {article.image && (
        <div className="h-40 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-slate-500 text-xs">{article.source}</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-500 text-xs">{timeAgo(article.publishedAt)}</span>
        </div>

        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-3">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={loadBrief}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-medium rounded-lg transition-colors border border-indigo-500/20 hover:border-indigo-500/40 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : brief ? (
              expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
            ) : (
              <span>✦</span>
            )}
            {loading ? "Generating..." : brief ? (expanded ? "Hide Brief" : "Show Brief") : "Get Context"}
          </button>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 text-slate-400 hover:text-slate-300 text-xs font-medium rounded-lg transition-colors"
          >
            Read <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {error && (
          <p className="mt-2 text-red-400 text-xs">Failed to generate brief.</p>
        )}

        {brief && expanded && (
          <div className="mt-4 space-y-3 border-t border-slate-700/50 pt-4 animate-in slide-in-from-top-2 duration-200">
            <BriefSection title="What's Happening" emoji="📌">
              <p className="text-slate-300 text-xs leading-relaxed">{brief.whatsHappening}</p>
            </BriefSection>

            <BriefSection title="Background" emoji="📚">
              <p className="text-slate-300 text-xs leading-relaxed">{brief.backgroundContext}</p>
            </BriefSection>

            {brief.keyPlayers?.length > 0 && (
              <BriefSection title="Key Players" emoji="👥">
                <div className="space-y-1.5">
                  {brief.keyPlayers.map((p, i) => (
                    <div key={i}>
                      <span className="text-indigo-300 text-xs font-semibold">{p.name}: </span>
                      <span className="text-slate-300 text-xs">{p.role}</span>
                    </div>
                  ))}
                </div>
              </BriefSection>
            )}

            <BriefSection title="Why It Matters" emoji="⚡">
              <p className="text-slate-300 text-xs leading-relaxed">{brief.whyItMatters}</p>
            </BriefSection>

            {brief.keyTerms?.length > 0 && (
              <BriefSection title="Key Terms" emoji="📖">
                <div className="space-y-1.5">
                  {brief.keyTerms.map((t, i) => (
                    <div key={i}>
                      <span className="text-yellow-400 text-xs font-semibold">{t.term}: </span>
                      <span className="text-slate-300 text-xs">{t.definition}</span>
                    </div>
                  ))}
                </div>
              </BriefSection>
            )}

            <BriefSection title="Bigger Picture" emoji="🌐">
              <p className="text-slate-300 text-xs leading-relaxed">{brief.biggerPicture}</p>
            </BriefSection>

            <BriefSection title="What to Watch" emoji="👀">
              <p className="text-slate-300 text-xs leading-relaxed">{brief.whatToWatchNext}</p>
            </BriefSection>
          </div>
        )}
      </div>
    </div>
  );
}

function BriefSection({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs">{emoji}</span>
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      {children}
    </div>
  );
}
