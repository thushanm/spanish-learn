import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Brain,
  Mic,
  Puzzle,
  BookOpen,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

interface CortexNavbarProps {
  onOpenSettings: () => void;
}

export const CortexNavbar: React.FC<CortexNavbarProps> = ({ onOpenSettings }) => {
  const { stats, updateSettings, activeTab, setActiveTab } = useApp();

  const handleTab = (tab: any) => {
    playClickSound(stats.soundEnabled);
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const next = !stats.soundEnabled;
    playClickSound(next);
    updateSettings({ soundEnabled: next });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 text-slate-100 select-none shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Cognitive Identity */}
          <div
            onClick={() => handleTab('roadmap')}
            className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-rose-500 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-sm sm:text-lg tracking-tight text-white whitespace-nowrap">
                  <span className="text-cyan-400">JTM</span> Spanish Learn
                </span>
                <span className="hidden lg:inline text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Neuro-Immersion
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium truncate">
                Cognitive Spanish Acquisition (A1 - B2)
              </p>
            </div>
          </div>

          {/* Desktop Cognitive Modalities Tabs - Exactly 4 Core Workspaces */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => handleTab('roadmap')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Today</span>
            </button>

            <button
              onClick={() => handleTab('builder')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'builder'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>Build</span>
            </button>

            <button
              onClick={() => handleTab('dictionary')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dictionary'
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Words</span>
            </button>

            <button
              onClick={() => handleTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Progress</span>
            </button>
          </nav>

          {/* Cognitive Performance Meters: Retention Index & Streak */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Memory Retention Index (Desktop only) */}
            <div
              onClick={() => handleTab('analytics')}
              title="See your practice progress"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-sm cursor-pointer hover:bg-cyan-500/20 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{stats.wordsPracticedCount > 0 ? `Accuracy: ${stats.averageAccuracy}%` : 'New'}</span>
            </div>

            {/* Streak */}
            <div
              title={`${stats.streak} day practice streak`}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{stats.streak > 0 ? `${stats.streak}d` : '1d'}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={stats.soundEnabled ? 'Mute lesson audio' : 'Enable lesson audio'}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => {
                playClickSound(stats.soundEnabled);
                onOpenSettings();
              }}
              title="Language and learning settings"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Mobile Bottom Navigation Bar (Rendered outside <header> so it anchors to viewport bottom)
export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, stats } = useApp();

  const handleTab = (tab: any) => {
    playClickSound(stats.soundEnabled);
    setActiveTab(tab);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex md:hidden items-center justify-around gap-1 border-t border-slate-800/90 bg-[#0B0F17]/95 px-2 pt-1.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] text-[10px] font-bold shadow-[0_-8px_25px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <button
        onClick={() => handleTab('roadmap')}
        className={`mobile-nav-item flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 min-h-[48px] transition-all ${
          activeTab === 'roadmap' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Brain className="w-4 h-4" />
        <span className="truncate">Today</span>
      </button>

      <button
        onClick={() => handleTab('builder')}
        className={`mobile-nav-item flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 min-h-[48px] transition-all ${
          activeTab === 'builder' ? 'bg-indigo-500/20 text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Puzzle className="w-4 h-4" />
        <span className="truncate">Build</span>
      </button>

      {/* Center prominent Speak CTA button */}
      <button
        onClick={() => handleTab('practice')}
        className={`mobile-nav-item -mt-3.5 flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 min-h-[54px] border transition-all ${
          activeTab === 'practice'
            ? 'border-cyan-300/60 bg-gradient-to-tr from-cyan-400 to-teal-400 text-slate-950 shadow-lg shadow-cyan-400/30 font-black'
            : 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300 shadow-md shadow-cyan-500/15'
        }`}
      >
        <Mic className="w-5 h-5" />
        <span className="font-black text-[9px] uppercase tracking-wider">Speak</span>
      </button>

      <button
        onClick={() => handleTab('dictionary')}
        className={`mobile-nav-item flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 min-h-[48px] transition-all ${
          activeTab === 'dictionary' ? 'bg-rose-500/20 text-rose-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span className="truncate">Words</span>
      </button>

      <button
        onClick={() => handleTab('analytics')}
        className={`mobile-nav-item flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 min-h-[48px] transition-all ${
          activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        <span className="truncate">Progress</span>
      </button>
    </nav>
  );
};
