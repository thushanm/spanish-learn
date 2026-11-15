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
    <header className="sticky top-0 z-40 bg-[#0B0F19]/92 backdrop-blur-md border-b border-slate-800 text-slate-100 select-none shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Cognitive Identity */}
          <div
            onClick={() => handleTab('roadmap')}
            className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-sky-400 p-[3px] shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F19] rounded-[12px] flex items-center justify-center">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-sm sm:text-lg tracking-tight text-white whitespace-nowrap">
                  <span className="text-sky-400">JTM</span> Spanish Learn
                </span>
                <span className="hidden lg:inline text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Arcade
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-bold truncate">
                Vibrant Spanish Mastery (A1 - B2)
              </p>
            </div>
          </div>

          {/* Desktop Cognitive Modalities Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => handleTab('roadmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                activeTab === 'roadmap'
                  ? 'bg-[#FFC800] border-[#E5A400] text-slate-950 shadow-sm'
                  : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Today</span>
            </button>

            <button
              onClick={() => handleTab('builder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                activeTab === 'builder'
                  ? 'bg-[#A855F7] border-[#8B2BE2] text-white shadow-sm'
                  : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>Build</span>
            </button>

            <button
              onClick={() => handleTab('dictionary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                activeTab === 'dictionary'
                  ? 'bg-[#1CB0F6] border-[#1899D6] text-white shadow-sm'
                  : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Words</span>
            </button>

            <button
              onClick={() => handleTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                activeTab === 'analytics'
                  ? 'bg-[#58CC02] border-[#46A302] text-white shadow-sm'
                  : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Progress</span>
            </button>
          </nav>

          {/* Performance Meters: Retention Index & Streak */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Accuracy badge (Desktop only) */}
            <div
              onClick={() => handleTab('analytics')}
              title="See your practice progress"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/60 border border-sky-500/30 text-sky-300 text-xs font-black shadow-sm cursor-pointer hover:bg-sky-900/50 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{stats.wordsPracticedCount > 0 ? `Acc: ${stats.averageAccuracy}%` : 'New'}</span>
            </div>

            {/* Streak */}
            <div
              title={`${stats.streak} day practice streak`}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-black shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{stats.streak > 0 ? `${stats.streak}d` : '1d'}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={stats.soundEnabled ? 'Mute lesson audio' : 'Enable lesson audio'}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-sky-400" />
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
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Floating Mobile Bottom Navigation Dock (Chunky Cartoon Arcade)
export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, stats } = useApp();

  const handleTab = (tab: any) => {
    soundEffects.triggerHaptic(20);
    if (stats.soundEnabled) {
      soundEffects.playBubblePop();
    }
    setActiveTab(tab);
  };

  const navItems = [
    { id: 'roadmap', label: 'Today', icon: Brain, activeColor: 'text-amber-500' },
    { id: 'builder', label: 'Build', icon: Puzzle, activeColor: 'text-purple-500' },
    { id: 'practice', label: 'Speak', icon: Mic, activeColor: 'text-emerald-500', isCenter: true },
    { id: 'dictionary', label: 'Words', icon: BookOpen, activeColor: 'text-sky-500' },
    { id: 'analytics', label: 'Progress', icon: BarChart3, activeColor: 'text-teal-500' },
  ];

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full max-w-md z-50 pointer-events-none">
      <nav className="pointer-events-auto flex md:hidden items-center justify-around gap-1 p-2 rounded-full bg-[#0E1524]/95 backdrop-blur-2xl border border-slate-700/60 shadow-[0_12px_40px_rgba(0,0,0,0.7)] select-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => handleTab(item.id)}
                className={`relative -mt-5 flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 min-h-[56px] border-b-[5px] transition-all active:translate-y-1.5 active:border-b-0 cursor-pointer shadow-lg ${
                  isActive
                    ? 'border-[#46A302] bg-[#58CC02] text-white font-black shadow-emerald-500/40 ring-4 ring-emerald-500/30'
                    : 'border-[#46A302] bg-[#58CC02] text-white font-black shadow-md'
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
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-slate-800/90 border border-slate-700 shadow-sm"
                />
              )}
              <IconComponent className={`relative z-10 w-4 h-4 transition-colors ${isActive ? item.activeColor : 'text-slate-400'}`} />
              <span className={`relative z-10 text-[10px] font-black tracking-tight truncate leading-none transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
