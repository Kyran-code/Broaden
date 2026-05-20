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

interface TimelineEntry {
  date: string;
  event: string;
}

interface KeyPlayer {
  name: string;
  role: string;
}

interface ExpertPerspective {
  perspective: string;
  reasoning: string;
}

interface KeyTerm {
  term: string;
  definition: string;
}

interface Brief {
  situation: string;
  historicalBackground: string;
  howItWorks: string;
  timeline: TimelineEntry[];
  keyPlayers: KeyPlayer[];
  whyItMatters: string;
  globalContext: string;
  expertPerspectives: ExpertPerspective[];
  keyTerms: KeyTerm[];
  whatToWatch: string;
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
    <div className="border border-[#1e1e1e] bg-[#0d0d0d] hover:border-[#2a2a2a] transition-colors duration-200">
      {article.image && (
        <div className="h-36 overflow-hidden border-b border-[#1e1e1e]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 font-sans">
          <span className="text-[#555] text-xs">{article.source}</span>
          <span className="text-[#333]">·</span>
          <span className="text-[#555] text-xs">{timeAgo(article.publishedAt)}</span>
        </div>

        <h3 className="text-[#e0e0e0] font-sans font-semibold text-sm leading-snug mb-2 line-clamp-3">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-[#666] text-xs font-sans leading-relaxed mb-3 line-clamp-2">
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-3 font-sans">
          <button
            onClick={loadBrief}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#2a2a2a] text-[#c8a96e] text-xs font-medium hover:border-[#c8a96e]/40 hover:bg-[#c8a96e]/5 transition-colors disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : brief ? (
              expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
            ) : null}
            {loading ? "Analysing..." : brief ? (expanded ? "Collapse" : "Expand Analysis") : "Deep Context"}
          </button>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#555] hover:text-[#888] text-xs transition-colors"
          >
            Source <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {error && (
          <p className="mt-2 text-[#c87070] text-xs font-sans">Failed to generate analysis.</p>
        )}

        {brief && expanded && (
          <div className="mt-5 border-t border-[#1e1e1e] pt-5 animate-in space-y-5">
            <BriefSection label="What Is Happening">
              <Prose text={brief.situation} />
            </BriefSection>

            <BriefSection label="Historical Background">
              <Prose text={brief.historicalBackground} />
            </BriefSection>

            <BriefSection label="How It Works">
              <Prose text={brief.howItWorks} />
            </BriefSection>

            {brief.timeline?.length > 0 && (
              <BriefSection label="Timeline of Key Events">
                <div className="space-y-2">
                  {brief.timeline.map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-[#c8a96e] text-xs font-sans font-semibold flex-shrink-0 mt-0.5 w-24">{t.date}</span>
                      <p className="text-[#999] text-xs font-sans leading-relaxed">{t.event}</p>
                    </div>
                  ))}
                </div>
              </BriefSection>
            )}

            {brief.keyPlayers?.length > 0 && (
              <BriefSection label="Key Players">
                <div className="space-y-3">
                  {brief.keyPlayers.map((p, i) => (
                    <div key={i} className="border-l-2 border-[#2a2a2a] pl-3">
                      <p className="text-[#e0e0e0] text-xs font-sans font-semibold">{p.name}</p>
                      <p className="text-[#888] text-xs font-sans leading-relaxed mt-0.5">{p.role}</p>
                    </div>
                  ))}
                </div>
              </BriefSection>
            )}

            <BriefSection label="Why It Matters">
              <Prose text={brief.whyItMatters} />
            </BriefSection>

            <BriefSection label="Global Context">
              <Prose text={brief.globalContext} />
            </BriefSection>

            {brief.expertPerspectives?.length > 0 && (
              <BriefSection label="Analytical Perspectives">
                <div className="space-y-3">
                  {brief.expertPerspectives.map((e, i) => (
                    <div key={i}>
                      <p className="text-[#c8a96e] text-xs font-sans font-semibold mb-1">{e.perspective}</p>
                      <p className="text-[#888] text-xs font-sans leading-relaxed">{e.reasoning}</p>
                    </div>
                  ))}
                </div>
              </BriefSection>
            )}

            {brief.keyTerms?.length > 0 && (
              <BriefSection label="Key Terms">
                <div className="space-y-2">
                  {brief.keyTerms.map((t, i) => (
                    <div key={i}>
                      <span className="text-[#e0e0e0] text-xs font-sans font-semibold">{t.term}: </span>
                      <span className="text-[#888] text-xs font-sans">{t.definition}</span>
                    </div>
                  ))}
                </div>
              </BriefSection>
            )}

            <BriefSection label="What to Watch">
              <Prose text={brief.whatToWatch} />
            </BriefSection>
          </div>
        )}
      </div>
    </div>
  );
}

function BriefSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">{label}</p>
      {children}
    </div>
  );
}

function Prose({ text }: { text: string }) {
  if (!text) return null;
  const paragraphs = text.split(/\n+/).filter(Boolean);
  return (
    <div className="space-y-2">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-[#999] text-xs font-sans leading-relaxed">{p}</p>
      ))}
    </div>
  );
}
