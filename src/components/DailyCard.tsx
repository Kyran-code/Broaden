"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ChatBox from "./ChatBox";

interface KeyTerm {
  term: string;
  definition: string;
}

interface Debate {
  debate: string;
  explanation: string;
}

interface Misconception {
  myth: string;
  reality: string;
}

interface FurtherReading {
  title: string;
  author: string;
  why: string;
}

interface DailyBrief {
  topic: string;
  category: string;
  openingEssay: string;
  historicalOrigins: string;
  coreMechanisms: string;
  keyTermsGlossary: KeyTerm[];
  keyDebates: Debate[];
  caseStudy: string;
  realWorldImplications: string;
  commonMisconceptions: Misconception[];
  futureOutlook: string;
  furtherReading: FurtherReading[];
}

export default function DailyCard() {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch("/api/daily");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setBrief(data);
    } catch {
      setError("Failed to generate briefing. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-1">Daily Briefing</p>
          <h2 className="text-2xl font-bold text-white">Topic of the Day</h2>
        </div>
      </div>

      {!brief && !loading && (
        <div className="border border-[#1e1e1e] p-8 text-center">
          <p className="text-[#666] text-sm font-sans mb-5 leading-relaxed">
            Each day, one specialised topic — explained with the depth of a long-form essay.<br />
            Expect 10–15 minutes of serious reading.
          </p>
          <button
            onClick={load}
            className="px-6 py-2.5 bg-white text-black text-sm font-sans font-semibold hover:bg-[#e8e8e8] transition-colors duration-150"
          >
            Load Today&apos;s Briefing
          </button>
        </div>
      )}

      {loading && (
        <div className="border border-[#1e1e1e] p-8 text-center">
          <p className="text-[#666] text-sm font-sans">Generating briefing — this may take a moment...</p>
          <div className="flex justify-center mt-4 gap-1">
            <span className="w-1 h-1 bg-[#444] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 bg-[#444] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 bg-[#444] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      {error && (
        <div className="border border-[#2a1a1a] bg-[#110a0a] p-4 text-[#c87070] text-sm font-sans">
          {error}
        </div>
      )}

      {brief && (
        <div className="animate-in">
          {/* Header */}
          <div className="border-b border-[#1e1e1e] pb-6 mb-8">
            <span className="text-[#666] text-xs font-sans uppercase tracking-widest">{brief.category}</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">{brief.topic}</h3>
            <p className="text-[#666] text-xs font-sans mt-3">Estimated reading time: 10–15 minutes</p>
          </div>

          <div className="space-y-10">
            {/* Opening Essay */}
            <Section label="Overview">
              <Prose text={brief.openingEssay} />
            </Section>

            {/* Historical Origins */}
            <Section label="Historical Origins">
              <Prose text={brief.historicalOrigins} />
            </Section>

            {/* Core Mechanisms */}
            <Section label="How It Works">
              <Prose text={brief.coreMechanisms} />
            </Section>

            {/* Key Terms */}
            {brief.keyTermsGlossary?.length > 0 && (
              <Section label="Glossary of Key Terms">
                <div className="space-y-4">
                  {brief.keyTermsGlossary.map((item, i) => (
                    <div key={i} className="border-l-2 border-[#c8a96e] pl-4">
                      <p className="text-white font-sans font-semibold text-sm">{item.term}</p>
                      <p className="text-[#999] text-sm leading-relaxed mt-1">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Key Debates */}
            {brief.keyDebates?.length > 0 && (
              <Section label="Key Debates & Controversies">
                <div className="space-y-6">
                  {brief.keyDebates.map((d, i) => (
                    <div key={i}>
                      <p className="text-white font-sans font-semibold text-sm mb-2">{d.debate}</p>
                      <Prose text={d.explanation} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Case Study */}
            {brief.caseStudy && (
              <Section label="Case Study">
                <div className="border-l-2 border-[#333] pl-5">
                  <Prose text={brief.caseStudy} />
                </div>
              </Section>
            )}

            {/* Real World Implications */}
            <Section label="Real-World Implications">
              <Prose text={brief.realWorldImplications} />
            </Section>

            {/* Misconceptions */}
            {brief.commonMisconceptions?.length > 0 && (
              <Section label="Common Misconceptions">
                <div className="space-y-4">
                  {brief.commonMisconceptions.map((m, i) => (
                    <div key={i} className="border border-[#1e1e1e] p-4">
                      <p className="text-[#888] text-xs font-sans uppercase tracking-wider mb-1">Myth</p>
                      <p className="text-[#ccc] text-sm italic mb-3">&ldquo;{m.myth}&rdquo;</p>
                      <p className="text-[#888] text-xs font-sans uppercase tracking-wider mb-1">Reality</p>
                      <p className="text-[#aaa] text-sm leading-relaxed">{m.reality}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Future Outlook */}
            <Section label="Where This Is Heading">
              <Prose text={brief.futureOutlook} />
            </Section>

            {/* Further Reading */}
            {brief.furtherReading?.length > 0 && (
              <Section label="Further Reading">
                <div className="space-y-3">
                  {brief.furtherReading.map((r, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-[#444] font-sans text-sm flex-shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                      <div>
                        <p className="text-white font-sans text-sm font-medium">{r.title}</p>
                        {r.author && <p className="text-[#666] text-xs font-sans">{r.author}</p>}
                        <p className="text-[#888] text-xs mt-1 leading-relaxed">{r.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Chat */}
            <ChatBox
              context={{ topic: brief.topic, category: brief.category }}
              contextType="topic"
              placeholder={`Ask anything about ${brief.topic}...`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="border-t border-[#1e1e1e] pt-6">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full text-left mb-4 group"
      >
        <span className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest flex-1">{label}</span>
        {collapsed
          ? <ChevronDown className="w-3 h-3 text-[#444] group-hover:text-[#888] transition-colors" />
          : <ChevronUp className="w-3 h-3 text-[#444] group-hover:text-[#888] transition-colors" />
        }
      </button>
      {!collapsed && children}
    </div>
  );
}

function Prose({ text }: { text: string }) {
  if (!text) return null;
  const paragraphs = text.split(/\n+/).filter(Boolean);
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-[#c0c0c0] text-[15px] leading-7">{p}</p>
      ))}
    </div>
  );
}
