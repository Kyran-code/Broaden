import DailyCard from "@/components/DailyCard";
import NewsFeed from "@/components/NewsFeed";
import LearningLog from "@/components/LearningLog";

export default function Home() {
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 border-b border-[#1e1e1e]">
        <p className="text-[#666] text-xs font-sans uppercase tracking-widest mb-3">Daily Intelligence</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-snug max-w-2xl">
          What you don&apos;t know you don&apos;t know.
        </h1>
        <p className="mt-3 text-[#888] text-sm font-sans leading-relaxed max-w-xl">
          One in-depth topic briefing per day. Live news with full analytical context.
          Written for the curious mind that wants more than headlines.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-16 pt-10">
        <section>
          <DailyCard />
        </section>
        <section>
          <NewsFeed />
        </section>

        <section>
          <div className="border-t border-[#1e1e1e] pt-10">
            <LearningLog />
          </div>
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
