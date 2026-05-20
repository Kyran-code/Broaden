import DailyCard from "@/components/DailyCard";
import NewsFeed from "@/components/NewsFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080d1a]">
      {/* Header */}
      <header className="border-b border-slate-800/60 sticky top-0 z-10 backdrop-blur-md bg-[#080d1a]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              B
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">Broaden</span>
              <span className="ml-2 text-slate-500 text-xs hidden sm:inline">Expand your mind daily</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 rounded-full border border-slate-700/50">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-slate-400 text-xs">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="mb-2">
          <span className="text-slate-500 text-sm">You don&apos;t know what you don&apos;t know.</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Broaden your world,{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            one idea at a time.
          </span>
        </h1>
        <p className="mt-3 text-slate-400 text-base max-w-2xl">
          Every day: one deep topic explained from scratch, and live news stories unpacked with AI context briefs.
          Go from knowing nothing to understanding everything.
        </p>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 space-y-12">
        <section>
          <DailyCard />
        </section>

        <section>
          <NewsFeed />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
              B
            </div>
            <span className="text-slate-600 text-sm">Broaden</span>
          </div>
          <span className="text-slate-700 text-xs">Powered by Claude AI</span>
        </div>
      </footer>
    </div>
  );
}
