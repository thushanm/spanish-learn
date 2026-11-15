import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats, SpanishWordPhrase, MistakeWordRecord, AccuracySessionRecord } from '../types';
import { SPANISH_UNITS } from '../data/spanishData';

export type ActiveTab =
  | 'roadmap'
  | 'practice'
  | 'builder'
  | 'listening'
  | 'sprint'
  | 'ai-tutor'
  | 'dialogue'
  | 'clinic'
  | 'dictionary'
  | 'analytics';

export type CartoonMascotMood = 'idle' | 'cheering' | 'party_dance' | 'sad' | 'crying' | 'celebrate_finish';
export type GameplayMood = 'normal' | 'streak' | 'mistake';

interface AppContextType {
  stats: UserStats;
  addXP: (amount: number) => void;
  recordPracticeResult: (unitId: string, score: number, wordItem?: SpanishWordPhrase) => void;
  recordMistakeWord: (wordItem: SpanishWordPhrase) => void;
  removeMistakeWord: (wordId: string) => void;
  completeDialogue: (dialogueId: string) => void;
  updateSettings: (settings: Partial<UserStats>) => void;
  resetProgress: () => void;
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // Cartoon Arcade Mood & Mascot State
  comboStreak: number;
  consecutiveMistakes: number;
  mascotMood: CartoonMascotMood;
  setMascotMood: (mood: CartoonMascotMood) => void;
  gameplayMood: GameplayMood;
  triggerGameAction: (action: 'correct' | 'wrong' | 'complete' | 'reset') => void;
}

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 0,
  lastPracticeDate: '',
  wordsPracticedCount: 0,
  wordsLearnedCount: 0,
  masteredItemIds: [],
  mistakeWordsCount: 0,
  mistakeWordList: [],
  accuracyHistory: [{ date: 'Today', accuracy: 0, wordsCount: 0, xpEarned: 0 }],
  averageAccuracy: 0,
  completedUnits: [],
  completedDialogues: [],
  hearts: 5,
  preferredAccent: 'es-ES',
  speechRate: 0.95,
  microphoneDeviceId: 'default',
  soundEnabled: true,
  autoAdvance: false
};

const STORAGE_KEY = 'cortex_spanish_user_stats_v4';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasMasteryData = Array.isArray(parsed.masteredItemIds);
        const knownItemIds = new Set(SPANISH_UNITS.flatMap(unit => unit.items.map(item => item.id)));
        const masteredItemIds = hasMasteryData
          ? parsed.masteredItemIds.filter((id: unknown) => typeof id === 'string' && knownItemIds.has(id))
          : [];
        const completedUnits = SPANISH_UNITS
          .filter(unit => unit.items.every(item => masteredItemIds.includes(item.id)))
          .map(unit => unit.id);
        const wordsPracticedCount = hasMasteryData && typeof parsed.wordsPracticedCount === 'number'
          ? parsed.wordsPracticedCount
          : 0;
        const hasRecordedAttempts = wordsPracticedCount > 0;
        return {
          ...DEFAULT_STATS,
          ...parsed,
          // Earlier builds marked whole lessons complete after one phrase. Their progress is not reliable,
          // so a learner begins with a clean, honest record once this tracker is introduced.
          xp: hasMasteryData ? parsed.xp : 0,
          streak: hasMasteryData ? parsed.streak : 0,
          lastPracticeDate: hasMasteryData ? parsed.lastPracticeDate : '',
          wordsPracticedCount,
          wordsLearnedCount: masteredItemIds.length,
          masteredItemIds,
          completedUnits,
          mistakeWordList: hasMasteryData && Array.isArray(parsed.mistakeWordList) ? parsed.mistakeWordList : [],
          mistakeWordsCount: hasMasteryData && Array.isArray(parsed.mistakeWordList) ? parsed.mistakeWordList.length : 0,
          accuracyHistory: hasRecordedAttempts && Array.isArray(parsed.accuracyHistory) ? parsed.accuracyHistory : DEFAULT_STATS.accuracyHistory,
          averageAccuracy: hasRecordedAttempts && typeof parsed.averageAccuracy === 'number' ? parsed.averageAccuracy : 0
        };
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return DEFAULT_STATS;
  });

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>('unit-1');
  const [activeTab, setActiveTab] = useState<ActiveTab>('roadmap');

  // Cartoon Arcade Mood & Mascot State
  const [comboStreak, setComboStreak] = useState(0);
  const [consecutiveMistakes, setConsecutiveMistakes] = useState(0);
  const [mascotMood, setMascotMood] = useState<CartoonMascotMood>('idle');

  const gameplayMood: GameplayMood =
    consecutiveMistakes > 0
      ? 'mistake'
      : comboStreak >= 2
      ? 'streak'
      : 'normal';

  const triggerGameAction = (action: 'correct' | 'wrong' | 'complete' | 'reset') => {
    if (action === 'correct') {
      setConsecutiveMistakes(0);
      setComboStreak(prev => {
        const next = prev + 1;
        if (next >= 3) {
          setMascotMood('party_dance');
        } else {
          setMascotMood('cheering');
        }
        return next;
      });
      setTimeout(() => {
        setMascotMood(prev => (prev === 'party_dance' || prev === 'cheering' ? 'idle' : prev));
      }, 3500);
    } else if (action === 'wrong') {
      setComboStreak(0);
      setConsecutiveMistakes(prev => {
        const next = prev + 1;
        if (next >= 2) {
          setMascotMood('crying');
        } else {
          setMascotMood('sad');
        }
        return next;
      });
      setTimeout(() => {
        setMascotMood(prev => (prev === 'crying' || prev === 'sad' ? 'idle' : prev));
      }, 4200);
    } else if (action === 'complete') {
      setMascotMood('celebrate_finish');
    } else if (action === 'reset') {
      setComboStreak(0);
      setConsecutiveMistakes(0);
      setMascotMood('idle');
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [stats]);

  const markPracticeDay = (previous: UserStats): Pick<UserStats, 'streak' | 'lastPracticeDate'> => {
    const today = new Date();
    const previousDay = new Date(previous.lastPracticeDate);
    const previousKey = Number.isNaN(previousDay.getTime()) ? '' : previousDay.toDateString();

    if (previousKey === today.toDateString()) {
      return { streak: previous.streak, lastPracticeDate: previous.lastPracticeDate };
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return {
      streak: previousKey === yesterday.toDateString() ? previous.streak + 1 : 1,
      lastPracticeDate: today.toISOString()
    };
  };

  const addXP = (amount: number) => {
    setStats(prev => ({ ...prev, ...markPracticeDay(prev), xp: prev.xp + amount }));
  };

  const recordPracticeResult = (unitId: string, score: number, wordItem?: SpanishWordPhrase) => {
    setStats(prev => {
      const newCount = prev.wordsPracticedCount + 1;
      const newAvg = Math.round((prev.averageAccuracy * prev.wordsPracticedCount + score) / newCount);
      const isLearned = score >= 75 && Boolean(wordItem);
      const isNewMastery = Boolean(isLearned && wordItem && !prev.masteredItemIds.includes(wordItem.id));
      const masteredItemIds = isNewMastery && wordItem
        ? [...prev.masteredItemIds, wordItem.id]
        : prev.masteredItemIds;

      let newMistakeList = [...prev.mistakeWordList];

      if (!isLearned && wordItem) {
        const existingIdx = newMistakeList.findIndex(m => m.id === wordItem.id);
        if (existingIdx >= 0) {
          newMistakeList[existingIdx] = {
            ...newMistakeList[existingIdx],
            failedCount: newMistakeList[existingIdx].failedCount + 1,
            lastFailedDate: new Date().toISOString()
          };
        } else {
          newMistakeList.unshift({
            id: wordItem.id,
            spanish: wordItem.spanish,
            english: wordItem.english,
            phonetic: wordItem.phonetic,
            failedCount: 1,
            lastFailedDate: new Date().toISOString()
          });
        }
      } else if (isLearned && wordItem) {
        // If passed successfully, remove from mistake list or decrement
        newMistakeList = newMistakeList.filter(m => m.id !== wordItem.id);
      }

      const unit = SPANISH_UNITS.find(candidate => candidate.id === unitId);
      const unitIsMastered = Boolean(unit) && unit!.items.every(item => masteredItemIds.includes(item.id));
      const isNewlyCompletedUnit = unitIsMastered && !prev.completedUnits.includes(unitId);
      const updatedUnits = isNewlyCompletedUnit
        ? [...prev.completedUnits, unitId]
        : prev.completedUnits;
      // Mistakes stay in the learner's review list, but only a correct answer earns XP.
      // This keeps game rewards trustworthy instead of celebrating an incorrect build.
      const practiceXp = score >= 85 ? 25 : score >= 75 ? 15 : 0;
      const unitCompletionBonus = isNewlyCompletedUnit ? 100 : 0;
      const miniQuestBonus = isNewMastery && masteredItemIds.length % 3 === 0 ? 30 : 0;

      // Update today's accuracy session record.
      const todayIndex = prev.accuracyHistory.findIndex(h => h.date === 'Today');
      let newHistory = [...prev.accuracyHistory];
      if (todayIndex >= 0) {
        const currentToday = newHistory[todayIndex];
        const updatedCount = currentToday.wordsCount + 1;
        const updatedAcc = Math.round((currentToday.accuracy * currentToday.wordsCount + score) / updatedCount);
        newHistory[todayIndex] = {
          ...currentToday,
          accuracy: updatedAcc,
          wordsCount: updatedCount,
          xpEarned: currentToday.xpEarned + practiceXp + unitCompletionBonus + miniQuestBonus
        };
      }

      return {
        ...prev,
        ...markPracticeDay(prev),
        wordsPracticedCount: newCount,
        wordsLearnedCount: masteredItemIds.length,
        masteredItemIds,
        mistakeWordsCount: newMistakeList.length,
        mistakeWordList: newMistakeList.slice(0, 50),
        accuracyHistory: newHistory,
        averageAccuracy: newAvg,
        completedUnits: updatedUnits,
        xp: prev.xp + practiceXp + unitCompletionBonus + miniQuestBonus
      };
    });
  };

  const recordMistakeWord = (wordItem: SpanishWordPhrase) => {
    setStats(prev => {
      const existingIdx = prev.mistakeWordList.findIndex(m => m.id === wordItem.id);
      let updated = [...prev.mistakeWordList];
      if (existingIdx >= 0) {
        updated[existingIdx] = {
          ...updated[existingIdx],
          failedCount: updated[existingIdx].failedCount + 1,
          lastFailedDate: new Date().toISOString()
        };
      } else {
        updated.unshift({
          id: wordItem.id,
          spanish: wordItem.spanish,
          english: wordItem.english,
          phonetic: wordItem.phonetic,
          failedCount: 1,
          lastFailedDate: new Date().toISOString()
        });
      }
      return {
        ...prev,
        ...markPracticeDay(prev),
        mistakeWordsCount: updated.length,
        mistakeWordList: updated.slice(0, 50)
      };
    });
  };

  const removeMistakeWord = (wordId: string) => {
    setStats(prev => {
      const mistakeWordList = prev.mistakeWordList.filter(m => m.id !== wordId);
      return { ...prev, mistakeWordList, mistakeWordsCount: mistakeWordList.length };
    });
  };

  const completeDialogue = (dialogueId: string) => {
    setStats(prev => {
      if (prev.completedDialogues.includes(dialogueId)) {
        return { ...prev, ...markPracticeDay(prev), xp: prev.xp + 20 };
      }
      return {
        ...prev,
        ...markPracticeDay(prev),
        completedDialogues: [...prev.completedDialogues, dialogueId],
        xp: prev.xp + 60
      };
    });
  };

  const updateSettings = (partial: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...partial }));
  };

  const resetProgress = () => {
    setStats({
      ...DEFAULT_STATS,
      xp: 0,
      streak: 0,
      wordsPracticedCount: 0,
      wordsLearnedCount: 0,
      masteredItemIds: [],
      mistakeWordsCount: 0,
      mistakeWordList: [],
      accuracyHistory: [
        { date: 'Today', accuracy: 0, wordsCount: 0, xpEarned: 0 }
      ],
      averageAccuracy: 0,
      completedUnits: [],
      completedDialogues: []
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
        stats,
        addXP,
        recordPracticeResult,
        recordMistakeWord,
        removeMistakeWord,
        completeDialogue,
        updateSettings,
        resetProgress,
        selectedUnitId,
        setSelectedUnitId,
        activeTab,
        setActiveTab,
        comboStreak,
        consecutiveMistakes,
        mascotMood,
        setMascotMood,
        gameplayMood,
        triggerGameAction
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
