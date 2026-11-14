import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Volume2,
  VolumeX,
  Settings,
  Compass,
  Mic,
  MessageSquare,
  Sparkles,
  BookOpen,
  Heart,
  Gem
} from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

interface NavbarProps {
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const { stats, updateSettings, activeTab, setActiveTab } = useApp();

  const handleTabClick = (tab: any) => {
    playClickSound(stats.soundEnabled);
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const nextVal = !stats.soundEnabled;
    playClickSound(nextVal);
    updateSettings({ soundEnabled: nextVal });
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#131f24] border-b-2 border-slate-200 dark:border-[#2b3d47] text-slate-800 dark:text-slate-100 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Duolingo Brand Logo */}
          <div
            onClick={() => handleTabClick('roadmap')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#58cc02] border-b-4 border-[#58a700] flex items-center justify-center text-white text-xl font-black shadow-md group-hover:scale-105 active:translate-y-1 active:border-b-0 transition-transform">
              🦜
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight text-[#58cc02]">
                  ¡Habla!
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#ffc800]/20 text-amber-500 border border-[#ffc800]/40">
                  LEARN SPANISH
                </span>
              </div>
            </div>
          </div>

          {/* Duolingo-style Chunky Desktop Tabs (English Interface) */}
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => handleTabClick('roadmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'roadmap'
                  ? 'bg-[#1cb0f6] border-[#1899d6] text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2a32]'
              }`}
            >
              <Compass className="w-4 h-4 stroke-[3]" />
              <span>Learn Path</span>
            </button>

            <button
              onClick={() => handleTabClick('practice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'practice'
                  ? 'bg-[#58cc02] border-[#58a700] text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2a32]'
              }`}
            >
              <Mic className="w-4 h-4 stroke-[3]" />
              <span>Voice Studio</span>
            </button>

            <button
              onClick={() => handleTabClick('ai-tutor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'ai-tutor'
                  ? 'bg-[#ff9600] border-[#e58500] text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2a32]'
              }`}
            >
              <Sparkles className="w-4 h-4 stroke-[3]" />
              <span>Paco AI Tutor</span>
            </button>

            <button
              onClick={() => handleTabClick('dialogue')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'dialogue'
                  ? 'bg-[#a463f8] border-[#8a42e8] text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2a32]'
              }`}
            >
              <MessageSquare className="w-4 h-4 stroke-[3]" />
              <span>Roleplay</span>
            </button>

            <button
              onClick={() => handleTabClick('clinic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'clinic'
                  ? 'bg-[#ff4b4b] border-[#ea2b2b] text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2a32]'
              }`}
            >
              <Sparkles className="w-4 h-4 stroke-[3]" />
              <span>Tricky Sounds</span>
            </button>

            <button
              onClick={() => handleTabClick('dictionary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border-b-4 ${
                activeTab === 'dictionary'
                  ? 'bg-[#2b3d47] border-[#1b2a32] text-white shadow-md'
                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2a32]'
              }`}
            >
              <BookOpen className="w-4 h-4 stroke-[3]" />
              <span>Vocabulary</span>
            </button>
          </nav>

          {/* Gamification Stats: Streak, Gems, Hearts */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Flame */}
            <div
              title={`${stats.streak} day practice streak!`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#ff9600] font-black text-xs sm:text-sm"
            >
              <Flame className="w-4 h-4 fill-[#ff9600] text-[#ff9600] animate-pulse" />
              <span>{stats.streak}</span>
            </div>

            {/* Gems */}
            <div
              title="450 Gems accumulated"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#1cb0f6]/10 border border-[#1cb0f6]/30 text-[#1cb0f6] font-black text-xs sm:text-sm"
            >
              <Gem className="w-4 h-4 fill-[#1cb0f6] text-[#1cb0f6]" />
              <span>450</span>
            </div>

            {/* Hearts */}
            <div
              title={`${stats.hearts} hearts remaining`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#ff4b4b]/10 border border-[#ff4b4b]/30 text-[#ff4b4b] font-black text-xs sm:text-sm"
            >
              <Heart className="w-4 h-4 fill-[#ff4b4b] text-[#ff4b4b]" />
              <span>{stats.hearts}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={stats.soundEnabled ? 'Mute app sounds' : 'Unmute app sounds'}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-[#1b2a32] hover:bg-slate-200 dark:hover:bg-[#2b3d47] text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-[#2b3d47] transition-colors"
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#58cc02]" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Settings Modal Button */}
            <button
              onClick={() => {
                playClickSound(stats.soundEnabled);
                onOpenSettings();
              }}
              title="Voice & App Settings"
              className="p-2 rounded-2xl bg-slate-100 dark:bg-[#1b2a32] hover:bg-slate-200 dark:hover:bg-[#2b3d47] text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-[#2b3d47] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-[#2b3d47] text-[11px] font-black uppercase">
          <button
            onClick={() => handleTabClick('roadmap')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl ${
              activeTab === 'roadmap' ? 'text-[#1cb0f6]' : 'text-slate-400'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Learn</span>
          </button>

          <button
            onClick={() => handleTabClick('practice')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl ${
              activeTab === 'practice' ? 'text-[#58cc02]' : 'text-slate-400'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice</span>
          </button>

          <button
            onClick={() => handleTabClick('ai-tutor')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl ${
              activeTab === 'ai-tutor' ? 'text-[#ff9600]' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Paco AI</span>
          </button>

          <button
            onClick={() => handleTabClick('dialogue')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl ${
              activeTab === 'dialogue' ? 'text-[#a463f8]' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Roleplay</span>
          </button>

          <button
            onClick={() => handleTabClick('clinic')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl ${
              activeTab === 'clinic' ? 'text-[#ff4b4b]' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Sounds</span>
          </button>
        </div>
      </div>
    </header>
  );
};
