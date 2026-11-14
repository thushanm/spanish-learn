import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Brain,
  Mic,
  Puzzle,
  Headphones,
  Zap,
  Bot,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px] md:h-16">
          {/* Logo & Cognitive Identity */}
          <div
            onClick={() => handleTab('roadmap')}
            className="flex min-w-0 items-center gap-2.5 md:gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-rose-500 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white whitespace-nowrap">
                  <span className="text-cyan-400">JTM</span> Spanish Learn
                </span>
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Neuro-Immersion
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
                Cognitive Spanish Acquisition (A1 - B2)
              </p>
            </div>
          </div>

          {/* Desktop Cognitive Modalities Tabs - Exactly 4 Core Workspaces */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => handleTab('roadmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Memory Retention Index */}
            <div
              onClick={() => handleTab('analytics')}
              title="See your practice progress"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-sm cursor-pointer hover:bg-cyan-500/20 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{stats.wordsPracticedCount > 0 ? `Accuracy: ${stats.averageAccuracy}%` : 'Your first lesson'}</span>
            </div>

            {/* Neuro Streak */}
            <div
              title={`${stats.streak} day practice streak`}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm"
            >
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{stats.streak > 0 ? `${stats.streak}d` : 'New'}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={stats.soundEnabled ? 'Mute lesson audio' : 'Enable lesson audio'}
              className="hidden sm:block p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
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
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumb-friendly phone dock */}
        <div className="fixed inset-x-0 bottom-0 z-50 flex md:hidden items-center justify-around gap-1 border-t border-cyan-400/15 bg-[#0B0F17]/95 px-2 pt-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] text-[10px] font-bold shadow-[0_-12px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <button
            onClick={() => handleTab('roadmap')}
            className={`mobile-nav-item flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 min-h-[52px] ${
              activeTab === 'roadmap' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Today</span>
          </button>
          <button
            onClick={() => handleTab('practice')}
            className={`mobile-nav-item -mt-5 flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 min-h-[60px] border ${
              activeTab === 'practice' ? 'border-cyan-300/60 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/25' : 'border-cyan-500/25 bg-cyan-500/15 text-cyan-300'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span>Speak</span>
          </button>
          <button
            onClick={() => handleTab('builder')}
            className={`mobile-nav-item flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 min-h-[52px] ${
              activeTab === 'builder' ? 'bg-indigo-500/20 text-indigo-400 font-extrabold' : 'text-slate-400'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>Build</span>
          </button>
          <button
            onClick={() => handleTab('analytics')}
            className={`mobile-nav-item flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 min-h-[52px] ${
              activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Progress</span>
          </button>
        </div>
      </div>
    </header>
  );
};
