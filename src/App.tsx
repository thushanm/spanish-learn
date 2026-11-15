import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CortexNavbar, MobileBottomNav } from './components/CortexNavbar';
import { LearningHome } from './components/LearningHome';
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

  // Dynamic Mood Backgrounds (Cartoon Arcade)
  const bgGradient =
    gameplayMood === 'streak'
      ? 'from-amber-400 via-orange-400 to-pink-500'
      : gameplayMood === 'mistake'
      ? 'from-rose-400 via-pink-400 to-purple-400'
      : 'from-sky-400 via-teal-300 to-emerald-300';

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${bgGradient} transition-colors duration-700 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-x-clip relative`}
    >
      {/* Floating Cartoon Background Elements / Floating Star Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 left-10 w-28 h-28 rounded-full bg-white/20 blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-8 w-44 h-44 rounded-full bg-white/25 blur-2xl animate-float-gently" />
        <div className="absolute bottom-24 left-1/4 w-36 h-36 rounded-full bg-white/20 blur-xl animate-pulse" />

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

      {/* Chunky Cartoon Arcade Footer */}
      <footer className="relative z-10 border-t-4 border-white/80 bg-white/90 backdrop-blur-md py-6 pb-[calc(8rem+env(safe-area-inset-bottom))] md:py-8 text-center text-xs text-slate-600 shadow-md">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3 font-black text-slate-800">
            <span className="flex items-center gap-1.5 text-sky-600">
              <Brain className="w-4 h-4" />
              <span>JTM Spanish Learn · Arcade</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Dopamine Micro-Lessons</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-amber-600">
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
