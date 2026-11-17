import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { UserStats, SpanishWordPhrase, MistakeWordRecord, AccuracySessionRecord, ReminderWordRecord, DailyUsageRecord } from '../types';
import { SPANISH_UNITS } from '../data/spanishData';
import { soundEffects } from '../utils/useSoundEffects';

export type ActiveTab =
  | 'roadmap'
  | 'cinema'
  | 'stories'
  | 'reminders'
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

export interface ReminderToastInfo {
  show: boolean;
  word: string;
  meaning: string;
}

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
  // Reminders Vault (Long-press to save from anywhere)
  reminderWords: ReminderWordRecord[];
  addReminderWord: (word: Omit<ReminderWordRecord, 'id' | 'dateAdded'> & { id?: string; dateAdded?: string }) => void;
  removeReminderWord: (id: string) => void;
  clearReminderWords: () => void;
  reminderToast: ReminderToastInfo | null;
  dismissReminderToast: () => void;
  // Cartoon Arcade Mood & Mascot State
  comboStreak: number;
  consecutiveMistakes: number;
  mascotMood: CartoonMascotMood;
  setMascotMood: (mood: CartoonMascotMood) => void;
  gameplayMood: GameplayMood;
  triggerGameAction: (action: 'correct' | 'wrong' | 'complete' | 'reset') => void;
  // Active Engagement & Smart Study Time Engine
  isActivelyPracticing: boolean;
  reportLearningActivity: (activityLabel?: string) => void;
  setIsMediaPlaying: (playing: boolean) => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

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
  autoAdvance: false,
  todayDate: getTodayDateString(),
  dailyStudySecondsToday: 0,
  totalStudySeconds: 0,
  wordsPracticedToday: 0,
  dailyUsageHistory: []
};

const STORAGE_KEY = 'cortex_spanish_user_stats_v4';
const NAV_STATE_KEY = 'jtm_spanish_nav_state_v1';

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
        const completedUnits = Array.isArray(parsed.completedUnits) && parsed.completedUnits.length > 0
          ? parsed.completedUnits
          : SPANISH_UNITS
              .filter(unit => unit.items.every(item => masteredItemIds.includes(item.id)))
              .map(unit => unit.id);
        const wordsPracticedCount = typeof parsed.wordsPracticedCount === 'number'
          ? parsed.wordsPracticedCount
          : 0;

        // Daily usage & time check
        const currentToday = getTodayDateString();
        const savedDate = typeof parsed.todayDate === 'string' ? parsed.todayDate : currentToday;
        let dailyStudySecondsToday = typeof parsed.dailyStudySecondsToday === 'number' ? parsed.dailyStudySecondsToday : 0;
        let wordsPracticedToday = typeof parsed.wordsPracticedToday === 'number' ? parsed.wordsPracticedToday : 0;
        let totalStudySeconds = typeof parsed.totalStudySeconds === 'number' ? parsed.totalStudySeconds : 0;
        let dailyUsageHistory = Array.isArray(parsed.dailyUsageHistory) ? parsed.dailyUsageHistory : [];

        // If day has changed, roll over today's data into history
        if (savedDate !== currentToday) {
          if (dailyStudySecondsToday > 0 || wordsPracticedToday > 0) {
            dailyUsageHistory = [
              { date: savedDate, seconds: dailyStudySecondsToday, wordsPracticed: wordsPracticedToday },
              ...dailyUsageHistory.slice(0, 13)
            ];
          }
          dailyStudySecondsToday = 0;
          wordsPracticedToday = 0;
        }

        return {
          ...DEFAULT_STATS,
          ...parsed,
          // Always preserve user points, XP, and streak reliably across all reloads and devices
          xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          lastPracticeDate: typeof parsed.lastPracticeDate === 'string' ? parsed.lastPracticeDate : '',
          wordsPracticedCount,
          wordsLearnedCount: typeof parsed.wordsLearnedCount === 'number' ? parsed.wordsLearnedCount : masteredItemIds.length,
          masteredItemIds,
          completedUnits,
          mistakeWordList: Array.isArray(parsed.mistakeWordList) ? parsed.mistakeWordList : [],
          mistakeWordsCount: Array.isArray(parsed.mistakeWordList) ? parsed.mistakeWordList.length : 0,
          accuracyHistory: Array.isArray(parsed.accuracyHistory) && parsed.accuracyHistory.length > 0 ? parsed.accuracyHistory : DEFAULT_STATS.accuracyHistory,
          averageAccuracy: typeof parsed.averageAccuracy === 'number' ? parsed.averageAccuracy : 0,
          todayDate: currentToday,
          dailyStudySecondsToday,
          totalStudySeconds,
          wordsPracticedToday,
          dailyUsageHistory
        };
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return DEFAULT_STATS;
  });

  // Persistent navigation state: user returns to exact tab and unit on reload
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(NAV_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.selectedUnitId === 'string' && parsed.selectedUnitId) {
          return parsed.selectedUnitId;
        }
      }
    } catch (e) {
      console.warn('Could not read nav state', e);
    }
    return 'unit-1';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    try {
      const saved = localStorage.getItem(NAV_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.activeTab === 'string' && parsed.activeTab) {
          return parsed.activeTab as ActiveTab;
        }
      }
    } catch (e) {
      console.warn('Could not read nav state', e);
    }
    return 'roadmap';
  });

  // Reminders Vault (Global 2-second Long-Press storage)
  const REMINDERS_KEY = 'jtm_reminders_vault_v1';
  const [reminderWords, setReminderWords] = useState<ReminderWordRecord[]>(() => {
    try {
      const saved = localStorage.getItem(REMINDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'rem-1',
        spanish: 'hermoso',
        phonetic: 'ehr-MOH-soh',
        english: 'beautiful / lovely',
        exampleSentence: 'Es un día muy hermoso en Barcelona.',
        sourceContext: 'Everyday Spanish',
        dateAdded: 'Today',
        level: 'A1'
      },
      {
        id: 'rem-2',
        spanish: 'despacio',
        phonetic: 'dehs-PAH-syoh',
        english: 'slowly / gently',
        exampleSentence: 'Por favor, habla más despacio.',
        sourceContext: 'Communication',
        dateAdded: 'Today',
        level: 'A1'
      }
    ];
  });

  const [reminderToast, setReminderToast] = useState<ReminderToastInfo | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminderWords));
    } catch (e) {}
  }, [reminderWords]);

  const addReminderWord = (wordData: Omit<ReminderWordRecord, 'id' | 'dateAdded'> & { id?: string; dateAdded?: string }) => {
    const clean = wordData.spanish.toLowerCase().trim();
    setReminderWords(prev => {
      const exists = prev.find(w => w.spanish.toLowerCase().trim() === clean);
      if (exists) return prev;
      const newWord: ReminderWordRecord = {
        id: wordData.id || `rem-${Date.now()}`,
        spanish: wordData.spanish.trim(),
        phonetic: wordData.phonetic || '',
        english: wordData.english || '',
        exampleSentence: wordData.exampleSentence || '',
        sourceContext: wordData.sourceContext || 'Saved Word',
        dateAdded: wordData.dateAdded || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        level: wordData.level || 'A1'
      };
      return [newWord, ...prev];
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(60); } catch (e) {}
    }
    soundEffects.playSnap();
    setReminderToast({ show: true, word: wordData.spanish, meaning: wordData.english });
    setTimeout(() => {
      setReminderToast(null);
    }, 3200);
  };

  const removeReminderWord = (id: string) => {
    soundEffects.playClick();
    setReminderWords(prev => prev.filter(w => w.id !== id));
  };

  const clearReminderWords = () => {
    soundEffects.playClick();
    setReminderWords([]);
  };

  const dismissReminderToast = () => {
    setReminderToast(null);
  };

  // Automatically save current tab and selected unit on every switch
  useEffect(() => {
    try {
      localStorage.setItem(NAV_STATE_KEY, JSON.stringify({ activeTab, selectedUnitId }));
    } catch (e) {
      console.warn('Could not save nav state to localStorage', e);
    }
  }, [activeTab, selectedUnitId]);

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

  // Active Engagement & Smart Study Time Engine
  // User Requirement: ONLY calculate time when user is actively practicing, reading stories, watching cinema clips, or building words.
  // DO NOT count passive time when the app is just sitting open idle or on roadmap/reminders/settings!
  const PRACTICE_TABS: ActiveTab[] = [
    'stories',
    'cinema',
    'builder',
    'practice',
    'listening',
    'sprint',
    'dialogue',
    'clinic',
    'ai-tutor'
  ];

  const activeTabRef = useRef<ActiveTab>(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
    if (!PRACTICE_TABS.includes(activeTab)) {
      setIsActivelyPracticing(false);
    }
  }, [activeTab]);

  const lastLearningActionTimeRef = useRef<number>(0);
  const [isMediaPlaying, setIsMediaPlaying] = useState<boolean>(false);
  const [isActivelyPracticing, setIsActivelyPracticing] = useState<boolean>(false);

  const reportLearningActivity = useCallback((_activityLabel?: string) => {
    if (PRACTICE_TABS.includes(activeTabRef.current)) {
      lastLearningActionTimeRef.current = Date.now();
      setIsActivelyPracticing(true);
    }
  }, []);

  // Global activity listeners: ONLY update active practice if currently on an active practice / learning tab!
  useEffect(() => {
    const onUserActivity = () => {
      if (PRACTICE_TABS.includes(activeTabRef.current)) {
        lastLearningActionTimeRef.current = Date.now();
        setIsActivelyPracticing(true);
      }
    };

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'touchstart', 'click', 'keydown', 'input'];
    events.forEach(evt => {
      window.addEventListener(evt, onUserActivity, { passive: true });
    });

    return () => {
      events.forEach(evt => {
        window.removeEventListener(evt, onUserActivity);
      });
    };
  }, []);

  // Smart Study Timer: ONLY ticks when:
  // 1. Tab/Window is visible AND
  // 2. Either:
  //    - Video/audio media is actively playing (e.g. Cinema clip playing)
  //    - OR Web Speech API is speaking (Story narration / pronunciation audio)
  //    - OR (Currently on a practice tab AND user has interacted within the last 15 seconds)
  // If user is on Roadmap, Reminders, Analytics, or is idle for > 15s, the timer is strictly PAUSED!
  useEffect(() => {
    const IDLE_TIMEOUT_MS = 15000; // 15 seconds idle timeout threshold

    const timer = setInterval(() => {
      const now = Date.now();
      const isDocumentVisible = typeof document !== 'undefined' && document.visibilityState === 'visible';
      const isPracticeTab = PRACTICE_TABS.includes(activeTabRef.current);
      const isSpeechActive = typeof window !== 'undefined' && Boolean(window.speechSynthesis && window.speechSynthesis.speaking);
      const isRecentlyActive = (now - lastLearningActionTimeRef.current) < IDLE_TIMEOUT_MS;

      const isEngaged = isDocumentVisible && (
        isMediaPlaying ||
        isSpeechActive ||
        (isPracticeTab && isRecentlyActive && lastLearningActionTimeRef.current > 0)
      );

      setIsActivelyPracticing(isEngaged);

      if (isEngaged) {
        setStats(prev => {
          const todayStr = getTodayDateString();
          if (prev.todayDate !== todayStr) {
            // Day rolled over at midnight while app is running
            const historyItem: DailyUsageRecord = {
              date: prev.todayDate,
              seconds: prev.dailyStudySecondsToday || 0,
              wordsPracticed: prev.wordsPracticedToday || 0
            };
            return {
              ...prev,
              todayDate: todayStr,
              dailyStudySecondsToday: 1,
              totalStudySeconds: (prev.totalStudySeconds || 0) + 1,
              wordsPracticedToday: 0,
              dailyUsageHistory: [historyItem, ...(prev.dailyUsageHistory || []).slice(0, 13)]
            };
          }
          return {
            ...prev,
            dailyStudySecondsToday: (prev.dailyStudySecondsToday || 0) + 1,
            totalStudySeconds: (prev.totalStudySeconds || 0) + 1
          };
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isMediaPlaying]);

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

      lastLearningActionTimeRef.current = Date.now();
      setIsActivelyPracticing(true);

      return {
        ...prev,
        ...markPracticeDay(prev),
        wordsPracticedCount: newCount,
        wordsPracticedToday: (prev.wordsPracticedToday || 0) + 1,
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
      completedDialogues: [],
      todayDate: getTodayDateString(),
      dailyStudySecondsToday: 0,
      totalStudySeconds: 0,
      wordsPracticedToday: 0,
      dailyUsageHistory: []
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
        reminderWords,
        addReminderWord,
        removeReminderWord,
        clearReminderWords,
        reminderToast,
        dismissReminderToast,
        comboStreak,
        consecutiveMistakes,
        mascotMood,
        setMascotMood,
        gameplayMood,
        triggerGameAction,
        isActivelyPracticing,
        reportLearningActivity,
        setIsMediaPlaying
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
