import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Scroll,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Brain,
  Award,
  Globe2,
  Eye,
  EyeOff,
  Flame,
  Check,
  HelpCircle,
  X
} from 'lucide-react';
import {
  SPANISH_STORIES,
  SpanishStory,
  StorySentence,
  StoryWordDetail
} from '../data/storyBooksData';
import { useApp } from '../context/AppContext';
import { speakSpanish, stopSpeaking } from '../utils/speech';
import { freeAIService, StorySentenceExplanation } from '../utils/freeAIProvider';
import { CartoonMascot } from './CartoonMascot';
import { TactileButton } from './ui/TactileButton';
import { soundEffects } from '../utils/useSoundEffects';

const STORAGE_ACTIVE_STORY_KEY = 'jtm_story_active_id';
const STORAGE_COMPLETED_STORIES_KEY = 'jtm_completed_stories';
const STORAGE_SAVED_WORDS_KEY = 'jtm_saved_story_words';

export const StoryBookReader: React.FC = () => {
  const { stats, addXP, setMascotMood, triggerGameAction } = useApp();

  // Active Story selection
  const [selectedStoryId, setSelectedStoryId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_STORY_KEY);
      if (saved && SPANISH_STORIES.some(s => s.id === saved)) {
        return saved;
      }
    } catch (e) {}
    return SPANISH_STORIES[0].id;
  });

  const [completedStories, setCompletedStories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_STORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [savedWords, setSavedWords] = useState<StoryWordDetail[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_WORDS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Current Story object
  const currentStory: SpanishStory = useMemo(() => {
    return SPANISH_STORIES.find(s => s.id === selectedStoryId) || SPANISH_STORIES[0];
  }, [selectedStoryId]);

  // View state: 'library' | 'reader'
  const [viewMode, setViewMode] = useState<'reader' | 'library'>('reader');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'A1' | 'A2' | 'B1' | 'B2'>('ALL');

  // Narration & Audio state
  const [isNarrating, setIsNarrating] = useState(false);
  const [narrationRate, setNarrationRate] = useState<number>(0.85); // 0.85x default for storytelling clarity
  const [preferredAccent, setPreferredAccent] = useState<'es-ES' | 'es-MX'>(currentStory.accent);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);

  // Flattened list of sentences for linear read-along
  const allSentences = useMemo(() => {
    return currentStory.paragraphs.flatMap(p => p.sentences);
  }, [currentStory]);

  const activeSentence: StorySentence | undefined = allSentences[activeSentenceIndex];

  // Word inspector card state
  const [selectedWord, setSelectedWord] = useState<StoryWordDetail | null>(null);

  // Translation visibility toggles
  const [showAllEnglish, setShowAllEnglish] = useState(false);
  const [revealedSentences, setRevealedSentences] = useState<Record<string, boolean>>({});

  // Groq AI Sentence Explainer
  const [aiModalSentence, setAiModalSentence] = useState<StorySentence | null>(null);
  const [aiExplanation, setAiExplanation] = useState<StorySentenceExplanation | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Comprehension Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Narration timeout ref
  const narrationTimeoutRef = useRef<number | null>(null);
  const sentenceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Save active story ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_STORY_KEY, selectedStoryId);
    } catch (e) {}
  }, [selectedStoryId]);

  // Update preferred accent when story changes
  useEffect(() => {
    setPreferredAccent(currentStory.accent);
    stopNarration();
    setActiveSentenceIndex(0);
    setSelectedWord(null);
    setRevealedSentences({});
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  }, [currentStory.id]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (narrationTimeoutRef.current) {
        window.clearTimeout(narrationTimeoutRef.current);
      }
    };
  }, []);

  // Stop narration helper
  const stopNarration = () => {
    stopSpeaking();
    setIsNarrating(false);
    if (narrationTimeoutRef.current) {
      window.clearTimeout(narrationTimeoutRef.current);
      narrationTimeoutRef.current = null;
    }
  };

  // Play a specific sentence by index with callback to advance
  const playSentenceByIndex = (index: number, continuous: boolean = true) => {
    if (index >= allSentences.length) {
      // Reached the end of the story!
      stopNarration();
      soundEffects.playFanfare();
      setMascotMood('celebrate_finish');
      return;
    }

    setActiveSentenceIndex(index);
    const sentence = allSentences[index];
    if (!sentence) return;

    // Smooth scroll into view
    const targetElement = sentenceRefs.current[sentence.id];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (stats.soundEnabled) {
      speakSpanish(sentence.spanish, {
        rate: narrationRate,
        preferredAccent,
        onEnd: () => {
          if (continuous && isNarrating) {
            narrationTimeoutRef.current = window.setTimeout(() => {
              playSentenceByIndex(index + 1, true);
            }, 550); // Natural breathing pause between story sentences
          }
        },
        onError: () => {
          stopNarration();
        }
      });
    }
  };

  // Start or Toggle Continuous Narration
  const toggleNarration = () => {
    soundEffects.playClick();
    if (isNarrating) {
      stopNarration();
    } else {
      setIsNarrating(true);
      playSentenceByIndex(activeSentenceIndex, true);
    }
  };

  // Replay Story from start
  const handleRestartStory = () => {
    soundEffects.playClick();
    stopNarration();
    setActiveSentenceIndex(0);
    playSentenceByIndex(0, false);
  };

  // Play a single sentence without continuous advance
  const handlePlaySingleSentence = (sentence: StorySentence, index: number) => {
    soundEffects.playClick();
    stopNarration();
    setActiveSentenceIndex(index);
    if (stats.soundEnabled) {
      speakSpanish(sentence.spanish, {
        rate: narrationRate,
        preferredAccent
      });
    }
  };

  // Handle word click inspection
  const handleWordClick = (wordObj: StoryWordDetail, sentence: StorySentence) => {
    soundEffects.playSnap();
    setSelectedWord(wordObj);

    // Speak single word slowly
    if (stats.soundEnabled) {
      speakSpanish(wordObj.word, {
        rate: 0.72,
        preferredAccent
      });
    }
  };

  // Save/Unsave word to vocabulary list
  const toggleSaveWord = (word: StoryWordDetail) => {
    soundEffects.playBubblePop();
    const isAlreadySaved = savedWords.some(w => w.cleanWord === word.cleanWord);
    let next: StoryWordDetail[];
    if (isAlreadySaved) {
      next = savedWords.filter(w => w.cleanWord !== word.cleanWord);
    } else {
      next = [...savedWords, word];
    }
    setSavedWords(next);
    try {
      localStorage.setItem(STORAGE_SAVED_WORDS_KEY, JSON.stringify(next));
    } catch (e) {}
  };

  // Toggle single sentence translation
  const toggleSentenceTranslation = (id: string) => {
    soundEffects.playClick();
    setRevealedSentences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Groq AI Sentence Explainer Trigger
  const handleExplainSentenceWithGroq = async (sentence: StorySentence) => {
    soundEffects.playBoing();
    setAiModalSentence(sentence);
    setIsAnalyzingAi(true);

    try {
      const res = await freeAIService.explainStorySentenceWithGroq(
        sentence.spanish,
        sentence.english,
        currentStory.title,
        currentStory.level
      );
      setAiExplanation(res);
      setMascotMood('cheering');
    } catch (e) {
      console.warn('Groq explanation error:', e);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Comprehension Quiz submission
  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    soundEffects.playSnap();
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleGradeQuiz = () => {
    soundEffects.playClick();
    let correctCount = 0;
    currentStory.comprehensionQuiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / currentStory.comprehensionQuiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 66) {
      // Success!
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      soundEffects.playFanfare();
      addXP(50);
      triggerGameAction('correct');
      setMascotMood('cheering');

      if (!completedStories.includes(currentStory.id)) {
        const next = [...completedStories, currentStory.id];
        setCompletedStories(next);
        try {
          localStorage.setItem(STORAGE_COMPLETED_STORIES_KEY, JSON.stringify(next));
        } catch (e) {}
      }
    } else {
      triggerGameAction('wrong');
      setMascotMood('sad');
    }
  };

  // Story selector from library
  const handleChooseStory = (storyId: string) => {
    soundEffects.playBubblePop();
    setSelectedStoryId(storyId);
    setViewMode('reader');
  };

  // Filtered stories for library
  const filteredStories = useMemo(() => {
    if (levelFilter === 'ALL') return SPANISH_STORIES;
    return SPANISH_STORIES.filter(s => s.level === levelFilter);
  }, [levelFilter]);

  // Overall reading progress %
  const readingProgress = Math.round(
    ((activeSentenceIndex + 1) / Math.max(1, allSentences.length)) * 100
  );

  return (
    <div className="mobile-page max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-7 space-y-5 sm:space-y-6 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-[28px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-400 p-[3px] shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-[#0B0F19] rounded-[13px] flex items-center justify-center">
                <Scroll className="w-6 h-6 text-sky-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Spanish Storybook Reader
                </h1>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Librería de Cuentos
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                Immersive stories with read-along audio, tap-to-inspect words, and Groq AI grammar insights!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setViewMode(viewMode === 'reader' ? 'library' : 'reader');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-slate-200 hover:bg-slate-800 transition-all cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>{viewMode === 'reader' ? 'Browse All Stories' : 'Back to Reading'}</span>
            </button>

            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-black">
              <Award className="w-4 h-4 text-purple-400" />
              <span>{completedStories.length}/{SPANISH_STORIES.length} Read</span>
            </span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: STORY LIBRARY */}
      {viewMode === 'library' && (
        <div className="space-y-5">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  soundEffects.playBubblePop();
                  setLevelFilter(lvl);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  levelFilter === lvl
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'ALL' ? 'All Stories' : `Level ${lvl}`}
              </button>
            ))}
          </div>

          {/* Story Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredStories.map(story => {
              const isCurrent = story.id === currentStory.id;
              const isDone = completedStories.includes(story.id);

              return (
                <div
                  key={story.id}
                  onClick={() => handleChooseStory(story.id)}
                  className={`group relative overflow-hidden rounded-[24px] border-2 transition-all p-5 flex flex-col justify-between cursor-pointer shadow-lg hover:scale-[1.02] ${
                    isCurrent
                      ? 'bg-blue-950/40 border-sky-400 shadow-blue-500/20'
                      : 'bg-[#121927]/90 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{story.coverEmoji}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-black">
                          {story.country}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-black">
                          {story.level}
                        </span>
                        {isDone && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-400 italic font-medium mt-0.5">
                      {story.titleEnglish}
                    </p>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal mt-3 line-clamp-3">
                      {story.synopsis}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>⏱️ ~{story.readTimeMinutes} min read</span>
                    <span className="text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Now <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ACTIVE STORY READER */}
      {viewMode === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Main Story Reading Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* Story Title & Meta Card */}
            <div className="rounded-[24px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-6 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{currentStory.coverEmoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black">
                        {currentStory.levelBadge}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {currentStory.country} · {currentStory.genre}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {currentStory.title}
                    </h2>
                    <p className="text-xs text-slate-400 italic">
                      &ldquo;{currentStory.titleEnglish}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAllEnglish(!showAllEnglish)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    {showAllEnglish ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAllEnglish ? 'Hide English' : 'Show All English'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar of Story */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>Reading Progress</span>
                  <span>{activeSentenceIndex + 1} of {allSentences.length} sentences ({readingProgress}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Narration Floating Dock / Audio Bar */}
            <div className="sticky top-16 z-30 rounded-2xl border border-slate-700/80 bg-[#0E1524]/95 backdrop-blur-xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
              {/* Play / Pause Narration */}
              <div className="flex items-center gap-2">
                <TactileButton
                  variant={isNarrating ? 'cyan' : 'candy-green'}
                  size="sm"
                  onClick={toggleNarration}
                  className="min-w-[140px]"
                >
                  {isNarrating ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Read Along</span>
                    </>
                  )}
                </TactileButton>

                <button
                  onClick={handleRestartStory}
                  title="Restart Story Audio from Beginning"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* Speech Speed & Accent Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  {[
                    { rate: 0.75, label: '0.75x' },
                    { rate: 0.85, label: '0.85x' },
                    { rate: 1.0, label: '1.0x' }
                  ].map(item => (
                    <button
                      key={item.rate}
                      onClick={() => {
                        soundEffects.playSnap();
                        setNarrationRate(item.rate);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                        narrationRate === item.rate
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Accent switch */}
                <button
                  onClick={() => {
                    soundEffects.playSnap();
                    setPreferredAccent(preferredAccent === 'es-ES' ? 'es-MX' : 'es-ES');
                  }}
                  title="Switch between Spain 🇪🇸 and Mexico 🇲🇽 Spanish accent"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  {preferredAccent === 'es-ES' ? '🇪🇸 Spain' : '🇲🇽 Mexico'}
                </button>
              </div>
            </div>

            {/* Story Paragraphs Canvas */}
            <div className="space-y-6">
              {currentStory.paragraphs.map(paragraph => (
                <div
                  key={paragraph.id}
                  className="rounded-[26px] border-2 border-slate-800/80 bg-[#0E1524]/80 p-5 sm:p-7 shadow-lg space-y-4"
                >
                  {paragraph.sentences.map(sentence => {
                    const sentenceIndex = allSentences.findIndex(s => s.id === sentence.id);
                    const isActive = isNarrating && activeSentenceIndex === sentenceIndex;
                    const isRevealed = showAllEnglish || revealedSentences[sentence.id];

                    return (
                      <div
                        key={sentence.id}
                        ref={el => { sentenceRefs.current[sentence.id] = el; }}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-blue-950/60 border-sky-400 shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/30'
                            : 'bg-transparent border-transparent hover:border-slate-800 hover:bg-slate-900/40'
                        }`}
                      >
                        {/* Sentence Spanish Word Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-base sm:text-lg leading-relaxed">
                          {sentence.vocab.map((vocabItem, vIdx) => {
                            const isSelected = selectedWord && selectedWord.cleanWord === vocabItem.cleanWord;

                            return (
                              <button
                                key={vIdx}
                                onClick={() => handleWordClick(vocabItem, sentence)}
                                title={`Tap to inspect "${vocabItem.word}"`}
                                className={`px-2 py-0.5 rounded-lg text-left transition-all cursor-pointer font-bold ${
                                  isSelected
                                    ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/30 scale-105'
                                    : 'text-slate-100 hover:bg-sky-500/20 hover:text-sky-300 hover:underline decoration-sky-400/50'
                                }`}
                              >
                                {vocabItem.word}
                              </button>
                            );
                          })}

                          {/* Sentence Controls (Play, Translate, Groq AI) */}
                          <div className="inline-flex items-center gap-1 ml-2 shrink-0">
                            <button
                              onClick={() => handlePlaySingleSentence(sentence, sentenceIndex)}
                              title="Listen to this sentence"
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-sky-400 hover:bg-slate-800 transition-colors"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => toggleSentenceTranslation(sentence.id)}
                              title="Toggle English translation"
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleExplainSentenceWithGroq(sentence)}
                              title="Explain sentence grammar with Groq AI"
                              className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900/50 transition-colors"
                            >
                              <Brain className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Sentence English Translation */}
                        <AnimatePresence>
                          {isRevealed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400 font-medium italic"
                            >
                              &ldquo;{sentence.english}&rdquo;
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Comprehension Check Quiz at Story End */}
            <div className="rounded-[28px] border-2 border-indigo-500/40 bg-gradient-to-b from-[#13172E] to-[#0E1324] p-5 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Story Comprehension Quiz
                    </h3>
                    <p className="text-xs text-indigo-300 font-bold">
                      Answer {currentStory.comprehensionQuiz.length} questions to earn +50 XP and complete the story!
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black">
                  +50 XP
                </span>
              </div>

              {/* Questions */}
              <div className="space-y-5">
                {currentStory.comprehensionQuiz.map((q, qIdx) => {
                  const selectedOpt = quizAnswers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="text-xs font-black text-indigo-300 uppercase tracking-wider">
                        Question {qIdx + 1}
                      </div>
                      <div className="text-sm font-bold text-white">
                        {q.question}
                      </div>
                      <div className="text-xs text-slate-400 italic">
                        {q.questionSpanish}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = selectedOpt === optIdx;
                          const isCorrect = q.correctIndex === optIdx;

                          let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750';
                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-black';
                            } else if (isPicked && !isCorrect) {
                              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                            }
                          } else if (isPicked) {
                            btnStyle = 'bg-sky-500 text-white font-black border-sky-400 shadow-md';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectQuizOption(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className="text-[11px] text-slate-400 pt-1">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Quiz button */}
              <div className="flex items-center justify-between pt-2">
                {quizScore !== null ? (
                  <div className="text-sm font-black text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Score: {quizScore}% {quizScore >= 66 ? '— Story Completed! 🎉' : '— Try again for 100%!'}</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    Select answers above and click grade
                  </div>
                )}

                <TactileButton
                  variant="candy-green"
                  size="md"
                  onClick={handleGradeQuiz}
                  className="shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{quizSubmitted ? 'Re-check Answers' : 'Submit Quiz (+50 XP)'}</span>
                </TactileButton>
              </div>
            </div>
          </div>

          {/* Right Column: Word Inspector, Saved Vocabulary & Mascot (4 cols) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            {/* Expressive Cartoon Mascot Chico */}
            <div className="rounded-[24px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-3 shadow-xl">
              <CartoonMascot compact={true} />
            </div>

            {/* Word Inspector Card */}
            <div className="rounded-[24px] border-2 border-amber-500/40 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Word Inspector (Tap any word)
                  </h3>
                </div>
                {selectedWord && (
                  <button
                    onClick={() => setSelectedWord(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {selectedWord ? (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-amber-400">
                        {selectedWord.word}
                      </h4>
                      <span className="text-[11px] font-bold text-slate-400">
                        {selectedWord.partOfSpeech}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (stats.soundEnabled) {
                            speakSpanish(selectedWord.word, { rate: 0.72, preferredAccent });
                          }
                        }}
                        title="Pronounce word slowly"
                        className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleSaveWord(selectedWord)}
                        title={savedWords.some(w => w.cleanWord === selectedWord.cleanWord) ? 'Remove bookmark' : 'Save to my vocabulary'}
                        className={`p-2 rounded-xl border transition-colors ${
                          savedWords.some(w => w.cleanWord === selectedWord.cleanWord)
                            ? 'bg-amber-400 text-slate-950 border-amber-500'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                    <div>
                      <span className="font-bold text-slate-400">Meaning: </span>
                      <span className="text-white font-bold">{selectedWord.meaning}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400">Pronunciation: </span>
                      <span className="text-amber-300 font-mono">[{selectedWord.phonetic}]</span>
                    </div>
                    {selectedWord.note && (
                      <div className="text-slate-300 italic pt-1 border-t border-slate-800/80">
                        💡 {selectedWord.note}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed font-bold py-2">
                  Tap any Spanish word inside the story to hear slow native audio, see its English definition, and inspect grammar!
                </p>
              )}
            </div>

            {/* Saved Story Vocabulary List */}
            <div className="rounded-[24px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-sky-300">
                    Bookmarked Words ({savedWords.length})
                  </h3>
                </div>
              </div>

              {savedWords.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-none">
                  {savedWords.map((word, wIdx) => (
                    <div
                      key={wIdx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                    >
                      <div>
                        <span className="font-black text-amber-300">{word.word}</span>
                        <span className="text-slate-400 block text-[11px] truncate max-w-[150px]">
                          {word.meaning}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (stats.soundEnabled) {
                              speakSpanish(word.word, { rate: 0.75, preferredAccent });
                            }
                          }}
                          className="p-1.5 rounded-lg text-sky-400 hover:bg-slate-800"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleSaveWord(word)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-bold">
                  No bookmarked words yet. Tap the bookmark icon on any inspected word to review it anytime!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Groq AI Sentence Explainer Modal */}
      <AnimatePresence>
        {aiModalSentence && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border-2 border-purple-500/60 bg-[#0E1524] p-5 sm:p-7 shadow-2xl space-y-4 text-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Groq AI Sentence Explainer
                    </h3>
                    <p className="text-xs text-purple-300 font-bold">
                      Meta Llama 3.3 Linguistic Deep Dive
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAiModalSentence(null)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Target Sentence Box */}
              <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 space-y-1">
                <div className="text-sm sm:text-base font-bold text-white">
                  &ldquo;{aiModalSentence.spanish}&rdquo;
                </div>
                <div className="text-xs text-slate-400 italic">
                  &ldquo;{aiModalSentence.english}&rdquo;
                </div>
              </div>

              {/* Loading State */}
              {isAnalyzingAi && (
                <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-10 h-10 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <p className="text-sm font-black text-purple-300">
                    Groq Llama 3.3 is analyzing sentence grammar, verb tenses & nuances...
                  </p>
                </div>
              )}

              {/* Result */}
              {!isAnalyzingAi && aiExplanation && (
                <div className="space-y-3.5 text-xs sm:text-sm">
                  {/* Grammar Breakdown */}
                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1.5">
                    <span className="text-[11px] font-black uppercase text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Grammar & Syntax Breakdown
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {aiExplanation.grammarBreakdown}
                    </p>
                  </div>

                  {/* Idioms and Nuances */}
                  <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 space-y-1.5">
                    <span className="text-[11px] font-black uppercase text-sky-300 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Key Idioms & Literary Nuance
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-200 font-medium">
                      {aiExplanation.idiomsAndNuances.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Simplified Spanish Alternative */}
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
                    <span className="text-[11px] font-black uppercase text-emerald-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      Simplified Spanish (Beginner Friendly)
                    </span>
                    <p className="text-emerald-200 font-bold">
                      &ldquo;{aiExplanation.simplifiedSpanish}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <TactileButton
                      variant="cyan"
                      size="sm"
                      onClick={() => setAiModalSentence(null)}
                    >
                      <span>Got It! Back to Story</span>
                    </TactileButton>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
