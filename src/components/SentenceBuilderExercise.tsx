import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { SpanishWordPhrase } from '../types';
import { speakSpanish } from '../utils/speech';
import { useCartoonAudio, useSoundEffects } from '../utils/useSoundEffects';
import { TactileButton } from './ui/TactileButton';
import { CartoonMascot } from './CartoonMascot';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Flame,
  HelpCircle,
  Puzzle,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  X,
  Zap
} from 'lucide-react';

const BATCH_SIZE = 3;
const REPEAT_ROUNDS = 5;

type ChallengeStyle = 'translate' | 'everyday' | 'listen' | 'recall' | 'real-life';
type FeedbackState = 'idle' | 'correct' | 'incorrect';

interface WordChip {
  id: string;
  text: string;
}

interface BuildChallenge {
  id: string;
  item: SpanishWordPhrase;
  targetSpanish: string;
  prompt: string;
  helper: string;
  style: ChallengeStyle;
}

const PRAISE_LINES = [
  '👸 ¡Corona de Oro! 👑 ¡Eres la realeza del español!',
  '✨ ¡Magnífico! 🌟 ¡Tu gramática brilla como una joya real!',
  '💖 ¡Increíble! 🌹 ¡Hablas con una gracia y poder total!',
  '💎 ¡Sublime! 🚀 ¡Aciertos seguidos con pura fluidez!',
  '🥳 ¡Sensacional! 🎉 ¡Tu mente crea sinapsis de oro puro!'
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const normalizeSpanish = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function createChallenge(item: SpanishWordPhrase, round: number): BuildChallenge {
  const style = (['translate', 'everyday', 'listen', 'recall', 'real-life'] as ChallengeStyle[])[round];
  const targetSpanish = item.spanish;

  switch (style) {
    case 'listen':
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: 'Listen to the Spanish audio and assemble every word in order.',
        helper: 'Auditory Syntax Ear Training',
        style
      };
    case 'everyday':
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: `How would you say this naturally in a conversation?\n"${item.english}"`,
        helper: 'Everyday Practical Spanish',
        style
      };
    case 'recall':
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: `Recall this phrase from memory:\n"${item.english}"`,
        helper: 'Long-term Memory Retrieval',
        style
      };
    case 'real-life':
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: `Express this in Spanish:\n"${item.english}"`,
        helper: 'Native Situational Reflex',
        style
      };
    default:
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: item.english,
        helper: 'Put this idea into Spanish syntax',
        style
      };
  }
}

export const SentenceBuilderExercise: React.FC = () => {
  const { stats, selectedUnitId, recordPracticeResult, addXP, triggerGameAction, consecutiveMistakes, reportLearningActivity } = useApp();
  const sounds = useCartoonAudio(stats.soundEnabled);
  const currentUnit = SPANISH_UNITS.find(unit => unit.id === selectedUnitId) || SPANISH_UNITS[0];
  const topicItems = currentUnit.items;

  // Persistent exercise progress across reloads / device sleep
  const [batchStart, setBatchStart] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`jtm_builder_progress_${currentUnit.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.batchStart === 'number') return parsed.batchStart;
      }
    } catch {}
    return 0;
  });

  const [questionIndex, setQuestionIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`jtm_builder_progress_${currentUnit.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.questionIndex === 'number') return parsed.questionIndex;
      }
    } catch {}
    return 0;
  });

  const [availableChips, setAvailableChips] = useState<WordChip[]>([]);
  const [assembledChips, setAssembledChips] = useState<WordChip[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [correctStreak, setCorrectStreak] = useState(0);
  const [praise, setPraise] = useState<string | null>(null);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const [deckComplete, setDeckComplete] = useState(false);

  // Automatically save sentence builder progress
  useEffect(() => {
    try {
      localStorage.setItem(
        `jtm_builder_progress_${currentUnit.id}`,
        JSON.stringify({ batchStart, questionIndex })
      );
    } catch {}
  }, [currentUnit.id, batchStart, questionIndex]);

  const batchItems = useMemo(
    () => topicItems.slice(batchStart, batchStart + BATCH_SIZE),
    [topicItems, batchStart]
  );

  const challenges = useMemo(
    () => Array.from({ length: REPEAT_ROUNDS }, (_, round) =>
      shuffle(batchItems).map(item => createChallenge(item, round))
    ).flat(),
    [batchItems]
  );

  const currentChallenge = challenges[questionIndex];
  const currentItem = currentChallenge?.item;
  const totalDecks = Math.max(1, Math.ceil(topicItems.length / BATCH_SIZE));
  const deckNumber = Math.floor(batchStart / BATCH_SIZE) + 1;
  const roundNumber = batchItems.length ? Math.floor(questionIndex / batchItems.length) + 1 : 1;
  const hasNextDeck = batchStart + BATCH_SIZE < topicItems.length;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`jtm_builder_progress_${currentUnit.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setBatchStart(typeof parsed.batchStart === 'number' ? parsed.batchStart : 0);
        setQuestionIndex(typeof parsed.questionIndex === 'number' ? parsed.questionIndex : 0);
      } else {
        setBatchStart(0);
        setQuestionIndex(0);
      }
    } catch {
      setBatchStart(0);
      setQuestionIndex(0);
    }
    setCorrectStreak(0);
    setPraise(null);
    setDeckComplete(false);
  }, [currentUnit.id]);

  useEffect(() => {
    if (!currentChallenge) return;
    const words = currentChallenge.targetSpanish
      .replace(/[¿?¡!.,;:]/g, '')
      .split(' ')
      .filter(Boolean);

    const chips: WordChip[] = shuffle(words).map((text, i) => ({
      id: `chip-${currentChallenge.id}-${text}-${i}`,
      text
    }));

    setAvailableChips(chips);
    setAssembledChips([]);
    setFeedback('idle');
    setShowFloatingXP(false);
  }, [currentChallenge?.id]);

  const playChallengeAudio = () => {
    if (!currentChallenge) return;
    reportLearningActivity('builder_audio');
    sounds.playClick();
    speakSpanish(currentChallenge.targetSpanish, {
      rate: stats.speechRate,
      preferredAccent: stats.preferredAccent
    });
  };

  const resetTiles = () => {
    if (!currentChallenge || feedback !== 'idle') return;
    reportLearningActivity('builder_reset');
    sounds.playClick();
    const words = currentChallenge.targetSpanish
      .replace(/[¿?¡!.,;:]/g, '')
      .split(' ')
      .filter(Boolean);

    const chips: WordChip[] = shuffle(words).map((text, i) => ({
      id: `chip-${currentChallenge.id}-${text}-${i}`,
      text
    }));

    setAvailableChips(chips);
    setAssembledChips([]);
  };

  const addChip = (chip: WordChip) => {
    if (feedback !== 'idle') return;
    reportLearningActivity('builder_add_chip');
    sounds.playBubblePop();
    setAssembledChips(prev => [...prev, chip]);
    setAvailableChips(prev => prev.filter(c => c.id !== chip.id));
  };

  const removeChip = (chip: WordChip) => {
    if (feedback !== 'idle') return;
    reportLearningActivity('builder_remove_chip');
    sounds.playBubblePop();
    setAvailableChips(prev => [...prev, chip]);
    setAssembledChips(prev => prev.filter(c => c.id !== chip.id));
  };

  const checkSentence = () => {
    if (!currentChallenge || !currentItem || feedback !== 'idle') return;
    reportLearningActivity('builder_check_sentence');
    const builtSentence = assembledChips.map(c => c.text).join(' ');
    const isCorrect = normalizeSpanish(builtSentence) === normalizeSpanish(currentChallenge.targetSpanish);

    if (isCorrect) {
      setFeedback('correct');
      const nextStreak = correctStreak + 1;
      setCorrectStreak(nextStreak);
      triggerGameAction('correct');
      sounds.playCorrect(nextStreak);
      sounds.shoutCartoonCheer();
      recordPracticeResult(currentUnit.id, 100, currentItem);
      setShowFloatingXP(true);

      // Multiplier confetti bursts
      if (nextStreak % 3 === 0) {
        setPraise(PRAISE_LINES[(nextStreak / 3 - 1) % PRAISE_LINES.length]);
        confetti({
          particleCount: 75,
          spread: 70,
          colors: ['#FFC800', '#58CC02', '#1CB0F6', '#FF6492'],
          origin: { x: 0.3, y: 0.65 }
        });
        confetti({
          particleCount: 75,
          spread: 70,
          colors: ['#FFC800', '#58CC02', '#1CB0F6', '#FF6492'],
          origin: { x: 0.7, y: 0.65 }
        });
      }
    } else {
      setFeedback('incorrect');
      setCorrectStreak(0);
      triggerGameAction('wrong');
      if (consecutiveMistakes >= 1) {
        sounds.playSadTrombone();
      } else {
        sounds.playCartoonWhistleDown();
      }
      recordPracticeResult(currentUnit.id, 30, currentItem);
    }
  };

  const continueChallenge = () => {
    sounds.playClick();
    setPraise(null);
    setShowFloatingXP(false);

    if (questionIndex + 1 < challenges.length) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setDeckComplete(true);
      sounds.playFanfare();
      confetti({ particleCount: 120, spread: 80, startVelocity: 35, origin: { y: 0.65 } });
    }
  };

  const advanceToNextDeck = () => {
    sounds.playClick();
    setBatchStart(prev => prev + BATCH_SIZE);
    setQuestionIndex(0);
    setCorrectStreak(0);
    setPraise(null);
    setDeckComplete(false);
  };

  const restartCurrentDeck = () => {
    sounds.playClick();
    setQuestionIndex(0);
    setCorrectStreak(0);
    setPraise(null);
    setDeckComplete(false);
  };

  if (deckComplete) {
    return (
      <div className="mobile-page mx-auto max-w-2xl select-none px-4 py-8 text-center animate-princess-pop">
        <div className="relative overflow-hidden rounded-[32px] border border-emerald-400/50 bg-[#0B0F19] p-8 sm:p-12 shadow-2xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-1 text-5xl shadow-xl shadow-emerald-500/25 animate-float-gently">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#0F1422]">
              👑
            </div>
          </div>

          <h2 className="mt-5 text-2xl sm:text-3xl font-black text-white">
            ¡Pack Conquistado con Éxito!
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            You successfully repeated this vocabulary set through all 5 cognitive retrieval styles.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <TactileButton variant="emerald" onClick={restartCurrentDeck}>
              <span>Repeat for Mastery</span>
            </TactileButton>

            {hasNextDeck && (
              <TactileButton variant="gold" onClick={advanceToNextDeck}>
                <span>Next Pack ({deckNumber + 1}/{totalDecks})</span>
                <ArrowRight className="h-4 w-4" />
              </TactileButton>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isAnswered = feedback !== 'idle';
  const progress = challenges.length ? ((questionIndex + 1) / challenges.length) * 100 : 0;

  return (
    <div className="mobile-page mx-auto max-w-3xl select-none px-4 py-5 sm:py-8 space-y-4">
      {/* Expressive Cartoon Mascot responding to your sentence build */}
      <CartoonMascot compact />

      {/* Top Header Card */}
      <div className="rounded-[28px] sm:rounded-[32px] border-2 border-slate-700/60 bg-[#121927]/90 p-5 shadow-xl backdrop-blur-md text-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#A855F7] text-white shadow-md border-b-4 border-[#8B2BE2]">
              <Puzzle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-black text-white">Build a Spanish sentence</h1>
                {correctStreak >= 2 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{correctStreak}x Combo</span>
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs font-bold text-slate-400">{currentUnit.subtitle || currentUnit.title}</p>
            </div>
          </div>
          <div className="shrink-0 rounded-2xl bg-purple-950/60 border border-purple-500/40 px-3 py-1.5 text-right text-[10px] font-black uppercase tracking-wide text-purple-300 shadow-sm">
            <span className="block">Pack {deckNumber}/{totalDecks}</span>
            <span className="text-purple-400">Round {roundNumber}/{REPEAT_ROUNDS}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800 border border-slate-700 p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main Assembly Card (with screen-shake on wrong answer) */}
      <motion.main
        animate={feedback === 'incorrect' ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.45 }}
        className={`relative overflow-hidden rounded-[28px] sm:rounded-[32px] border-2 bg-[#121927]/90 p-5 shadow-xl transition-all sm:p-8 text-slate-100 ${
          feedback === 'correct'
            ? 'border-emerald-400 ring-4 ring-emerald-500/30'
            : feedback === 'incorrect'
            ? 'border-rose-400 ring-4 ring-rose-500/30'
            : 'border-slate-700/60'
        }`}
      >
        {/* Floating XP Score Popup */}
        <AnimatePresence>
          {showFloatingXP && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.9 }}
              animate={{ opacity: 0, y: -45, scale: 1.3 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute top-4 right-6 pointer-events-none z-30 flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm shadow-xl"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>+{correctStreak >= 3 ? 35 : 25} XP</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-purple-300">
            {currentChallenge.style === 'listen' ? <Volume2 className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            {currentChallenge.helper}
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-xl font-black leading-snug text-white sm:text-3xl">
            “{currentChallenge.prompt}”
          </h2>
          <button
            onClick={playChallengeAudio}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-2xl border-2 border-sky-500/40 bg-sky-950/60 px-4 py-2 text-xs font-black text-sky-300 transition-colors hover:bg-sky-900/60 cursor-pointer shadow-sm"
          >
            <Volume2 className="h-4 w-4" />
            <span>Escuchar en Español</span>
          </button>
        </div>

        {/* Answer Slot (Tiles fly in using Framer Motion layoutId) */}
        <section className="relative mt-6 sm:mt-8">
          <p className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Tu frase en español
          </p>
          <div
            className={`flex min-h-24 flex-wrap items-center justify-center gap-2.5 rounded-3xl border-2 border-dashed p-3 sm:min-h-28 sm:p-4 transition-colors ${
              feedback === 'correct'
                ? 'border-emerald-500/60 bg-emerald-950/30'
                : feedback === 'incorrect'
                ? 'border-rose-500/60 bg-rose-950/30'
                : 'border-slate-700 bg-slate-900/70'
            }`}
          >
            {assembledChips.length ? (
              assembledChips.map(chip => (
                <motion.button
                  key={chip.id}
                  layoutId={chip.id}
                  transition={{ type: 'spring', stiffness: 440, damping: 25 }}
                  onClick={() => removeChip(chip)}
                  disabled={isAnswered}
                  className="rounded-2xl border-b-[5px] border-[#1899D6] bg-[#1CB0F6] px-4 py-2.5 text-sm font-black text-white shadow-md active:translate-y-1 active:border-b-0 cursor-pointer"
                >
                  {chip.text}
                </motion.button>
              ))
            ) : (
              <span className="px-4 text-center text-xs font-bold text-slate-500">
                Toca las palabras de abajo para armar la respuesta
              </span>
            )}
          </div>
        </section>

        {/* Word Bank (Remaining Tiles) */}
        <section className="relative mt-5 sm:mt-7">
          <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Banco de palabras
          </p>
          <div className="flex min-h-16 flex-wrap justify-center gap-2.5">
            {availableChips.map(chip => (
              <motion.button
                key={chip.id}
                layoutId={chip.id}
                transition={{ type: 'spring', stiffness: 440, damping: 25 }}
                onClick={() => addChip(chip)}
                disabled={isAnswered}
                className="rounded-2xl border-b-[5px] border-slate-950 bg-slate-800 px-4 py-2.5 text-sm font-black text-slate-100 shadow-md hover:bg-slate-750 active:translate-y-1 active:border-b-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {chip.text}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Slide-Up Correct Feedback */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="relative mt-6 flex items-start gap-3 rounded-3xl border-2 border-emerald-500/50 bg-emerald-950/70 p-4 text-emerald-200 shadow-lg"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#58CC02] text-white shadow-md">
                <CheckCircle2 className="h-6 w-6 stroke-[3]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-emerald-300 text-base">¡Correcto! ¡Súper sintaxis!</p>
                <p className="mt-1 text-sm font-black text-emerald-100">{currentChallenge.targetSpanish}</p>
              </div>
              <button
                onClick={playChallengeAudio}
                className="rounded-xl bg-emerald-900/60 p-2.5 text-emerald-200 hover:bg-emerald-800/80 cursor-pointer"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Slide-Up Incorrect Feedback */}
          {feedback === 'incorrect' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="relative mt-6 rounded-3xl border-2 border-rose-500/50 bg-rose-950/70 p-4 text-left shadow-lg text-rose-100"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF4B4B] text-white shadow-md">
                  <X className="h-6 w-6 stroke-[3]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-rose-300 text-base">Casi — aquí tienes la respuesta correcta:</p>
                  <p className="mt-1.5 text-base font-black text-white sm:text-lg">
                    {currentChallenge.targetSpanish}
                  </p>
                  <p className="mt-1 text-xs font-bold leading-relaxed text-slate-300">
                    ¡No te rindas! Esta frase se repetirá en una ronda posterior para que la domines.
                  </p>
                </div>
                <button
                  onClick={playChallengeAudio}
                  className="rounded-xl bg-rose-900/60 p-2.5 text-rose-200 hover:bg-rose-800/80 cursor-pointer"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-slate-700/60 pt-5">
          <button
            onClick={resetTiles}
            disabled={isAnswered || assembledChips.length === 0}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-black text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Resetear</span>
          </button>

          {isAnswered ? (
            <TactileButton
              variant={feedback === 'correct' ? 'candy-green' : 'coral-red'}
              size="md"
              onClick={continueChallenge}
            >
              <span>Continuar</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </TactileButton>
          ) : (
            <TactileButton
              variant="sun-yellow"
              size="md"
              onClick={checkSentence}
              disabled={assembledChips.length === 0}
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Comprobar</span>
            </TactileButton>
          )}
        </div>
      </motion.main>
    </div>
  );
};
