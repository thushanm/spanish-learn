export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface SpanishWordPhrase {
  id: string;
  spanish: string;
  english: string;
  phonetic: string;
  category: string;
  level: CEFRLevel;
  audioHint?: string;
  gender?: 'masculine' | 'feminine' | 'neutral';
  exampleSpanish: string;
  exampleEnglish: string;
  pronunciationTip?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  mnemonic?: string;
  filmReference?: string;
  culturalContext?: string;
}

export interface LearningUnit {
  id: string;
  title: string;
  subtitle: string;
  level: CEFRLevel;
  iconName: string;
  description: string;
  color: string;
  items: SpanishWordPhrase[];
}

export interface DialogueLine {
  id: string;
  speaker: 'agent' | 'user';
  spanish: string;
  english: string;
  phonetic: string;
  userHint?: string;
  audioHint?: string;
}

export interface DialogueScenario {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  category: string;
  partnerName: string;
  partnerRole: string;
  partnerAvatar: string;
  context: string;
  lines: DialogueLine[];
}

export interface TrickySound {
  id: string;
  symbol: string;
  name: string;
  description: string;
  howToProduce: string[];
  audioExamples: {
    spanish: string;
    english: string;
    phonetic: string;
  }[];
  challengeWords: SpanishWordPhrase[];
}

export interface MistakeWordRecord {
  id: string;
  spanish: string;
  english: string;
  phonetic?: string;
  failedCount: number;
  lastFailedDate: string;
}

export interface ReminderWordRecord {
  id: string;
  spanish: string;
  phonetic: string;
  english: string;
  exampleSentence?: string;
  sourceContext?: string;
  dateAdded: string;
  level?: string;
}

export interface AccuracySessionRecord {
  date: string;
  accuracy: number;
  wordsCount: number;
  xpEarned: number;
}

export interface DailyUsageRecord {
  date: string;
  seconds: number;
  wordsPracticed: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  lastPracticeDate: string;
  wordsPracticedCount: number;
  wordsLearnedCount: number;
  /** Phrases successfully produced by the learner; used to calculate real mastery. */
  masteredItemIds: string[];
  mistakeWordsCount: number;
  mistakeWordList: MistakeWordRecord[];
  accuracyHistory: AccuracySessionRecord[];
  averageAccuracy: number;
  completedUnits: string[];
  completedDialogues: string[];
  hearts: number;
  preferredAccent: 'es-ES' | 'es-MX';
  speechRate: number; // 0.8, 1.0, 1.2
  microphoneDeviceId?: string;
  soundEnabled: boolean;
  autoAdvance: boolean;
  // Daily Usage & Practice Memory Tracking
  todayDate: string;
  dailyStudySecondsToday: number;
  totalStudySeconds: number;
  wordsPracticedToday: number;
  dailyUsageHistory: DailyUsageRecord[];
}

export interface SpeechScoreResult {
  rawTranscript: string;
  score: number; // 0 to 100
  feedback: 'perfect' | 'great' | 'good' | 'retry';
  feedbackText: string;
  wordMatches: {
    expected: string;
    actual?: string;
    match: boolean;
  }[];
}
