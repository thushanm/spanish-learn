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
  const { activeTab } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#070A0F] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      {/* Cognitive Immersion Navigation */}
      <CortexNavbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content Cognitive Workspaces */}
      <main className="flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-16">
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

      {/* Cognitive System Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A0F] py-7 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3 font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Brain className="w-4 h-4" />
              <span>JTM Spanish Learn</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Practice with helpful feedback</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Listen, build, speak, repeat</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            A practical Spanish course from A1 to B2. Small daily practice adds up.
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
