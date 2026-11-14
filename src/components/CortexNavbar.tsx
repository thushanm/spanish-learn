import React from 'react';
import { motion } from 'framer-motion';
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
import { soundEffects } from '../utils/useSoundEffects';

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

// Floating Mobile Bottom Navigation Dock (Ergonomic, Haptic, Framer Motion Pill)
export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, stats } = useApp();

  const handleTab = (tab: any) => {
    soundEffects.triggerHaptic(20);
    if (stats.soundEnabled) {
      soundEffects.playClick();
    }
    setActiveTab(tab);
  };

  const navItems = [
    { id: 'roadmap', label: 'Today', icon: Brain, activeColor: 'text-amber-300' },
    { id: 'builder', label: 'Build', icon: Puzzle, activeColor: 'text-indigo-300' },
    { id: 'practice', label: 'Speak', icon: Mic, activeColor: 'text-cyan-300', isCenter: true },
    { id: 'dictionary', label: 'Words', icon: BookOpen, activeColor: 'text-rose-300' },
    { id: 'analytics', label: 'Progress', icon: BarChart3, activeColor: 'text-emerald-300' },
  ];

  return (
    <div className="fixed bottom-2.5 inset-x-2.5 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full max-w-md z-50 pointer-events-none">
      <nav className="pointer-events-auto flex md:hidden items-center justify-around gap-1 p-1.5 rounded-3xl bg-[#0B0F19]/92 backdrop-blur-2xl border border-slate-700/60 shadow-[0_12px_40px_rgba(0,0,0,0.85)] select-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => handleTab(item.id)}
                className={`relative -mt-4 flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 min-h-[52px] border-b-4 transition-all active:translate-y-1 active:border-b-0 cursor-pointer shadow-lg ${
                  isActive
                    ? 'border-cyan-600 bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-cyan-500/30 ring-2 ring-cyan-300/50'
                    : 'border-slate-800 bg-gradient-to-tr from-cyan-600/30 to-teal-500/20 text-cyan-300 font-bold hover:bg-cyan-500/30'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-black text-[9px] uppercase tracking-wider leading-none">Speak</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTab(item.id)}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 min-h-[46px] transition-colors cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="activeFloatingTabPill"
                  transition={{ type: 'spring', stiffness: 480, damping: 32 }}
                  className="absolute inset-0 rounded-2xl bg-white/10 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                />
              )}
              <IconComponent className={`relative z-10 w-4 h-4 transition-colors ${isActive ? item.activeColor : 'text-slate-400'}`} />
              <span className={`relative z-10 text-[10px] font-bold tracking-tight truncate leading-none transition-colors ${isActive ? 'text-white font-black' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
