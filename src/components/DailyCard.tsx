"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Lightbulb, Zap, BookOpen, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

interface KeyIdea {
  term: string;
  explanation: string;
}

interface DailyBrief {
  topic: string;
  category: string;
  emoji: string;
  hook: string;
  whatIsIt: string;
  whyItMatters: string;
  keyIdeas: KeyIdea[];
  realWorldExample: string;
  commonMisconception: string;
  buildingBlocks: string;
  mindBlower: string;
}

export default function DailyCard() {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch("/api/daily");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setBrief(data);
      setExpanded(true);
    } catch {
      setError("Failed to load today's topic. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 rounded-2xl border border-indigo-500/20 overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-400 text-sm font-medium tracking-wider uppercase">Daily Discovery</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              What's your unknown unknown today?
            </h2>
            <p className="text-slate-400 text-sm">
              One topic, explained from zero to intermediate. Every day, something new.
            </p>
          </div>
          <div className="text-5xl flex-shrink-0">{brief?.emoji || "🎯"}</div>
        </div>

        {!brief && !loading && (
          <button
            onClick={fetch}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 group"
          >
            <Sparkles className="w-4 h-4" />
            Reveal Today&apos;s Topic
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {loading && (
          <div className="mt-6 flex items-center gap-3 text-indigo-300">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Generating your brief...</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {brief && (
          <div className="mt-6 space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/30">
                {brief.category}
              </span>
              <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                Beginner Friendly
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{brief.topic}</h3>

            <div className="mt-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <p className="text-indigo-200 italic text-sm leading-relaxed">&ldquo;{brief.hook}&rdquo;</p>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? "Collapse brief" : "Read full brief"}
            </button>

            {expanded && (
              <div className="mt-4 space-y-5 animate-in slide-in-from-top-2 duration-300">
                <Section icon={<BookOpen className="w-4 h-4" />} title="What Is It?" color="blue">
                  <p className="text-slate-300 text-sm leading-relaxed">{brief.whatIsIt}</p>
                </Section>

                <Section icon={<Zap className="w-4 h-4" />} title="Why It Matters" color="yellow">
                  <p className="text-slate-300 text-sm leading-relaxed">{brief.whyItMatters}</p>
                </Section>

                <Section icon={<Lightbulb className="w-4 h-4" />} title="Key Concepts" color="purple">
                  <div className="space-y-2">
                    {brief.keyIdeas?.map((idea, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-purple-400 font-bold text-sm mt-0.5 flex-shrink-0">{idea.term}:</span>
                        <span className="text-slate-300 text-sm leading-relaxed">{idea.explanation}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={<ArrowRight className="w-4 h-4" />} title="Real-World Example" color="green">
                  <p className="text-slate-300 text-sm leading-relaxed">{brief.realWorldExample}</p>
                </Section>

                <Section icon={<AlertCircle className="w-4 h-4" />} title="Common Misconception" color="red">
                  <p className="text-slate-300 text-sm leading-relaxed">{brief.commonMisconception}</p>
                </Section>

                <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🤯</span>
                    <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Mind Blower</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{brief.mindBlower}</p>
                </div>

                <Section icon={<ArrowRight className="w-4 h-4" />} title="Go Deeper" color="indigo">
                  <p className="text-slate-300 text-sm leading-relaxed">{brief.buildingBlocks}</p>
                </Section>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <div className={cn("p-4 border rounded-xl", colorMap[color])}>
      <div className={cn("flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider", colorMap[color].split(" ")[0])}>
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
