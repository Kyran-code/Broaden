"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Domain {
  name: string;
  relevance: "primary" | "secondary";
  reasoning: string;
}

interface KeyConcept {
  concept: string;
  explanation: string;
}

interface LogAnalysis {
  domains: Domain[];
  keyConcepts: KeyConcept[];
  summary: string;
  retentionQuestions: string[];
  connections: string;
  gaps: string;
}

interface LogEntry {
  id: string;
  date: string;
  timestamp: number;
  entry: string;
  analysis: LogAnalysis;
}

const DOMAIN_COLORS: Record<string, string> = {
  "Economics & Finance": "#c8a96e",
  "Computer Science & Technology": "#7eb8c8",
  "Biology & Medicine": "#7ec897",
  "Physics & Mathematics": "#c87eb8",
  "History & Geopolitics": "#c89a7e",
  "Psychology & Behaviour": "#b8c87e",
  "Philosophy & Ethics": "#7e97c8",
  "Environment & Climate": "#7ec8b8",
  "Law & Governance": "#c8c87e",
  "Business & Strategy": "#c8a96e",
  "Culture & Society": "#b87ec8",
  "Language & Linguistics": "#7eb8b8",
  "Astronomy & Space": "#8a7ec8",
  "Chemistry & Materials": "#c87e8a",
  "Neuroscience": "#c8907e",
  "Other": "#666",
};

function getDomainColor(name: string) {
  return DOMAIN_COLORS[name] || "#888";
}

export default function LearningLog() {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"log" | "domains">("log");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("broaden_logs");
    if (stored) setLogs(JSON.parse(stored));
  }, []);

  const saveLogs = (updated: LogEntry[]) => {
    setLogs(updated);
    localStorage.setItem("broaden_logs", JSON.stringify(updated));
  };

  const submit = async () => {
    if (!entry.trim() || entry.trim().length < 10) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry }),
      });
      if (!res.ok) throw new Error("Failed");
      const analysis: LogAnalysis = await res.json();

      const newEntry: LogEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        timestamp: Date.now(),
        entry,
        analysis,
      };

      const updated = [newEntry, ...logs];
      saveLogs(updated);
      setEntry("");
      setExpandedId(newEntry.id);
    } catch {
      setError("Failed to analyse entry. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  // Aggregate domain stats
  const domainStats = logs.reduce<Record<string, number>>((acc, log) => {
    log.analysis.domains?.forEach((d) => {
      const weight = d.relevance === "primary" ? 2 : 1;
      acc[d.name] = (acc[d.name] || 0) + weight;
    });
    return acc;
  }, {});

  const sortedDomains = Object.entries(domainStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxScore = sortedDomains[0]?.[1] || 1;

  const deleteEntry = (id: string) => {
    saveLogs(logs.filter((l) => l.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-1">Learning Log</p>
          <h2 className="text-2xl font-bold text-white">What Did You Learn Today?</h2>
          <p className="text-[#666] text-xs font-sans mt-1">
            Write freely — AI will categorise, extract concepts, and help you retain it.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-4 mb-8">
        <textarea
          ref={textareaRef}
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write what you learned today — be as specific as possible. The more detail you give, the better the AI can help you retain it and identify knowledge gaps..."
          rows={5}
          className="w-full bg-transparent text-[#c0c0c0] text-sm font-sans leading-relaxed placeholder-[#333] resize-none focus:outline-none"
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1a1a1a]">
          <span className="text-[#444] text-xs font-sans">{entry.length} characters</span>
          <button
            onClick={submit}
            disabled={loading || entry.trim().length < 10}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-sans font-semibold hover:bg-[#e8e8e8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            {loading ? "Analysing..." : "Analyse & Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-[#2a1a1a] bg-[#110a0a] p-3 text-[#c87070] text-xs font-sans mb-6">
          {error}
        </div>
      )}

      {logs.length > 0 && (
        <>
          {/* View toggle */}
          <div className="flex gap-0 mb-6 border-b border-[#1e1e1e] font-sans">
            {(["log", "domains"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={cn(
                  "px-4 py-2.5 text-xs font-medium tracking-wide transition-colors duration-150 border-b-2 -mb-px capitalize",
                  activeView === v
                    ? "text-[#c8a96e] border-[#c8a96e]"
                    : "text-[#555] border-transparent hover:text-[#888]"
                )}
              >
                {v === "log" ? "Entry History" : "Domain Map"}
              </button>
            ))}
          </div>

          {/* Domain map */}
          {activeView === "domains" && (
            <div className="space-y-3 animate-in">
              <p className="text-[#555] text-xs font-sans mb-4">
                Based on {logs.length} log {logs.length === 1 ? "entry" : "entries"} — weighted by how central each domain was to your learning.
              </p>
              {sortedDomains.map(([domain, score]) => (
                <div key={domain} className="flex items-center gap-3">
                  <div className="w-36 text-right flex-shrink-0">
                    <span className="text-[#888] text-xs font-sans leading-none">{domain}</span>
                  </div>
                  <div className="flex-1 h-px bg-[#1a1a1a] relative">
                    <div
                      className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-all duration-500"
                      style={{
                        width: `${(score / maxScore) * 100}%`,
                        backgroundColor: getDomainColor(domain),
                      }}
                    />
                  </div>
                  <span className="text-[#444] text-xs font-sans w-6 text-right flex-shrink-0">{score}</span>
                </div>
              ))}
            </div>
          )}

          {/* Entry history */}
          {activeView === "log" && (
            <div className="space-y-px animate-in">
              {logs.map((log) => (
                <div key={log.id} className="border border-[#1e1e1e] bg-[#0d0d0d]">
                  <button
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    className="w-full text-left p-4 flex items-start gap-3 hover:bg-[#111] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[#555] text-xs font-sans flex-shrink-0">{log.date}</span>
                        {log.analysis.domains?.slice(0, 2).map((d) => (
                          <span
                            key={d.name}
                            className="text-xs font-sans px-1.5 py-0.5 border"
                            style={{
                              color: getDomainColor(d.name),
                              borderColor: `${getDomainColor(d.name)}33`,
                            }}
                          >
                            {d.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-[#888] text-xs font-sans leading-relaxed line-clamp-2">{log.entry}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteEntry(log.id); }}
                        className="text-[#333] hover:text-[#888] transition-colors p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      {expandedId === log.id
                        ? <ChevronUp className="w-3.5 h-3.5 text-[#444]" />
                        : <ChevronDown className="w-3.5 h-3.5 text-[#444]" />
                      }
                    </div>
                  </button>

                  {expandedId === log.id && (
                    <div className="border-t border-[#1a1a1a] p-4 space-y-5 animate-in">
                      {/* Summary */}
                      <div>
                        <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">Summary</p>
                        <p className="text-[#aaa] text-sm font-sans leading-relaxed">{log.analysis.summary}</p>
                      </div>

                      {/* Key concepts */}
                      {log.analysis.keyConcepts?.length > 0 && (
                        <div>
                          <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">Concepts Identified</p>
                          <div className="space-y-3">
                            {log.analysis.keyConcepts.map((c, i) => (
                              <div key={i} className="border-l-2 border-[#2a2a2a] pl-3">
                                <p className="text-[#e0e0e0] text-xs font-sans font-semibold">{c.concept}</p>
                                <p className="text-[#777] text-xs font-sans leading-relaxed mt-0.5">{c.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Domain breakdown */}
                      {log.analysis.domains?.length > 0 && (
                        <div>
                          <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">Domain Breakdown</p>
                          <div className="space-y-1.5">
                            {log.analysis.domains.map((d, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span
                                  className="text-xs font-sans px-1.5 py-0.5 border flex-shrink-0"
                                  style={{ color: getDomainColor(d.name), borderColor: `${getDomainColor(d.name)}33` }}
                                >
                                  {d.relevance === "primary" ? "Primary" : "Secondary"}
                                </span>
                                <div>
                                  <span className="text-[#ccc] text-xs font-sans font-medium">{d.name}</span>
                                  <span className="text-[#555] text-xs font-sans"> — {d.reasoning}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Retention questions */}
                      {log.analysis.retentionQuestions?.length > 0 && (
                        <div>
                          <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">Retention Questions</p>
                          <div className="space-y-2">
                            {log.analysis.retentionQuestions.map((q, i) => (
                              <div key={i} className="flex gap-2.5">
                                <span className="text-[#444] font-sans text-xs flex-shrink-0 mt-0.5">{i + 1}.</span>
                                <p className="text-[#999] text-xs font-sans leading-relaxed">{q}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Connections */}
                      {log.analysis.connections && (
                        <div>
                          <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">Connections to Explore</p>
                          <p className="text-[#888] text-xs font-sans leading-relaxed">{log.analysis.connections}</p>
                        </div>
                      )}

                      {/* Gaps */}
                      {log.analysis.gaps && (
                        <div>
                          <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-2">Knowledge Gaps</p>
                          <p className="text-[#888] text-xs font-sans leading-relaxed">{log.analysis.gaps}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {logs.length === 0 && !loading && (
        <p className="text-[#333] text-xs font-sans">No entries yet. Write your first log above.</p>
      )}
    </div>
  );
}
