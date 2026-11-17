import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CortexNavbar, MobileBottomNav } from './components/CortexNavbar';
import { LearningHome } from './components/LearningHome';
import { CinemaSpanishLab } from './components/CinemaSpanishLab';
import { StoryBookReader } from './components/StoryBookReader';
import { AcousticSpeechStudio } from './components/AcousticSpeechStudio';
import { SentenceBuilderExercise } from './components/SentenceBuilderExercise';
import { ListeningLabExercise } from './components/ListeningLabExercise';
import { FlashSprintExercise } from './components/FlashSprintExercise';
import { AITutorChat } from './components/AITutorChat';
import { DialogueRoleplay } from './components/DialogueRoleplay';
import { PhoneticsClinic } from './components/PhoneticsClinic';
import { DictionarySearch } from './components/DictionarySearch';
import { CognitiveAnalytics } from './components/CognitiveAnalytics';
import { SettingsModal } from './components/SettingsModal';
import { GameRewardToast } from './components/GameRewardToast';
import { Brain, Sparkles, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, gameplayMood, comboStreak } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dynamic Mood Backgrounds - Rich, Eye-Pleasing Deep Dark Aesthetics (Zero eye strain)
  const bgGradient =
    gameplayMood === 'streak'
      ? 'from-[#180B26] via-[#240C2E] to-[#12081E]' // Deep Cosmic Amethyst / Neon Fiesta
      : gameplayMood === 'mistake'
      ? 'from-[#1E0E15] via-[#1A0A17] to-[#0D0711]' // Deep Velvet Wine / Gentle Dark Rose
      : 'from-[#0B0F19] via-[#0E1726] to-[#0A0D14]'; // Deep Midnight Obsidian / Neon Cyan

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${bgGradient} transition-colors duration-700 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-x-clip relative`}
    >
      {/* Ambient Floating Halos & Particles (Soft dark ambient lighting) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 left-10 w-44 h-44 rounded-full bg-sky-500/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-8 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl animate-float-gently" />
        <div className="absolute bottom-24 left-1/4 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />

        {/* Floating Stars in Combo Streak */}
        {gameplayMood === 'streak' && (
          <>
            <span className="absolute top-20 left-1/4 text-3xl animate-bounce">⭐</span>
            <span className="absolute top-1/2 right-16 text-3xl animate-spin">✨</span>
            <span className="absolute bottom-40 right-1/3 text-4xl animate-bounce">🌟</span>
          </>
        )}
      </div>

      {/* Cognitive Immersion Navigation */}
      <div className="relative z-40">
        <CortexNavbar onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>

      {/* Main Content Cognitive Workspaces */}
      <main className="relative z-10 flex-1 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-16">
        {activeTab === 'roadmap' && <LearningHome />}
        {activeTab === 'cinema' && <CinemaSpanishLab />}
        {activeTab === 'stories' && <StoryBookReader />}
        {activeTab === 'practice' && <AcousticSpeechStudio />}
        {activeTab === 'builder' && <SentenceBuilderExercise />}
        {activeTab === 'listening' && <ListeningLabExercise />}
        {activeTab === 'sprint' && <FlashSprintExercise />}
        {activeTab === 'ai-tutor' && <AITutorChat />}
        {activeTab === 'dialogue' && <DialogueRoleplay />}
        {activeTab === 'clinic' && <PhoneticsClinic />}
        {activeTab === 'dictionary' && <DictionarySearch />}
        {activeTab === 'analytics' && <CognitiveAnalytics />}
      </main>

      {/* Sleek Dark Arcade Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md py-6 pb-[calc(8rem+env(safe-area-inset-bottom))] md:py-8 text-center text-xs text-slate-400 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3 font-black text-slate-300">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Brain className="w-4 h-4" />
              <span>JTM Spanish Learn</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Dopamine Micro-Lessons</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>A1 to B2 Fluency</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-bold">
            A vibrant, joyful Spanish learning adventure. Every small practice brings victory!
          </p>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <GameRewardToast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
