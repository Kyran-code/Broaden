"use client";

import { useState } from "react";
import DailyCard from "@/components/DailyCard";
import NewsFeed from "@/components/NewsFeed";
import LearningLog from "@/components/LearningLog";
import { cn } from "@/lib/utils";

type TopSection = "brief" | "log";

export default function Home() {
  const [topSection, setTopSection] = useState<TopSection>("brief");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-[#1e1e1e] sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-sans font-bold text-xl tracking-tight">BROADEN</span>
            <span className="hidden sm:block text-[#444] text-xs font-sans uppercase tracking-widest">Intelligence Briefings</span>
          </div>
          <div className="flex items-center gap-2 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] inline-block" />
            <span className="text-[#666] text-xs tracking-wide">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 pt-8 space-y-16">

        {/* Top section: Daily Brief ↔ Learning Log toggle */}
        <section>
          {/* Section header with toggle */}
          <div className="flex items-end justify-between mb-6 border-b border-[#1e1e1e] pb-0">
            <div
              className="flex gap-0 overflow-x-auto scrollbar-none"
              style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}
            >
              <TabButton
                active={topSection === "brief"}
                onClick={() => setTopSection("brief")}
                label="Daily Brief"
                sublabel="Today's topic"
              />
              <TabButton
                active={topSection === "log"}
                onClick={() => setTopSection("log")}
                label="Learning Log"
                sublabel="Track & retain"
              />
            </div>
          </div>

          {topSection === "brief" && (
            <div className="animate-in">
              <DailyCard />
            </div>
          )}

          {topSection === "log" && (
            <div className="animate-in">
              <div className="mb-6">
                <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-1">Learning Log</p>
                <h2 className="text-2xl font-bold text-white">What Did You Learn Today?</h2>
                <p className="text-[#666] text-xs font-sans mt-1">
                  Write freely — AI will categorise, extract concepts, and help you retain it.
                </p>
              </div>
              <LearningLog />
            </div>
          )}
        </section>

        {/* News feed — always visible */}
        <section>
          <NewsFeed />
        </section>

      </main>

      <footer className="border-t border-[#1e1e1e] py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between font-sans">
          <span className="text-[#444] text-xs uppercase tracking-widest">Broaden</span>
          <span className="text-[#333] text-xs">AI-assisted briefings</span>
        </div>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  sublabel,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-3 text-left border-b-2 -mb-px transition-colors duration-150 flex-shrink-0 whitespace-nowrap",
        active ? "border-[#c8a96e]" : "border-transparent"
      )}
    >
      <p className={cn("text-sm font-sans font-semibold transition-colors", active ? "text-white" : "text-[#555] hover:text-[#888]")}>
        {label}
      </p>
      <p className="text-[#444] text-xs font-sans mt-0.5">{sublabel}</p>
    </button>
  );
}
