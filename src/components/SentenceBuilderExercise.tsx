import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { SpanishWordPhrase } from '../types';
import { speakSpanish } from '../utils/speech';
import { useSoundEffects } from '../utils/useSoundEffects';
import { TactileButton } from './ui/TactileButton';
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
  const { stats, selectedUnitId, recordPracticeResult, addXP } = useApp();
  const sounds = useSoundEffects(stats.soundEnabled);
  const currentUnit = SPANISH_UNITS.find(unit => unit.id === selectedUnitId) || SPANISH_UNITS[0];
  const topicItems = currentUnit.items;

  const [batchStart, setBatchStart] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [availableChips, setAvailableChips] = useState<WordChip[]>([]);
  const [assembledChips, setAssembledChips] = useState<WordChip[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [correctStreak, setCorrectStreak] = useState(0);
  const [praise, setPraise] = useState<string | null>(null);
  const [showFloatingXP, setShowFloatingXP] = useState(false);
  const [deckComplete, setDeckComplete] = useState(false);

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
    setBatchStart(0);
    setQuestionIndex(0);
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
    sounds.playClick();
    speakSpanish(currentChallenge.targetSpanish, {
      rate: stats.speechRate,
      preferredAccent: stats.preferredAccent
    });
  };

  const resetTiles = () => {
    if (!currentChallenge || feedback !== 'idle') return;
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
    sounds.playSnap();
    setAssembledChips(prev => [...prev, chip]);
    setAvailableChips(prev => prev.filter(c => c.id !== chip.id));
  };

  const removeChip = (chip: WordChip) => {
    if (feedback !== 'idle') return;
    sounds.playSnap();
    setAvailableChips(prev => [...prev, chip]);
    setAssembledChips(prev => prev.filter(c => c.id !== chip.id));
  };

  const checkSentence = () => {
    if (!currentChallenge || !currentItem || feedback !== 'idle') return;
    const builtSentence = assembledChips.map(c => c.text).join(' ');
    const isCorrect = normalizeSpanish(builtSentence) === normalizeSpanish(currentChallenge.targetSpanish);

    if (isCorrect) {
      setFeedback('correct');
      const nextStreak = correctStreak + 1;
      setCorrectStreak(nextStreak);
      sounds.playCorrect(nextStreak);
      recordPracticeResult(currentUnit.id, 100, currentItem);
      setShowFloatingXP(true);

      // Multiplier confetti bursts
      if (nextStreak % 3 === 0) {
        setPraise(PRAISE_LINES[(nextStreak / 3 - 1) % PRAISE_LINES.length]);
        confetti({
          particleCount: 65,
          spread: 60,
          colors: ['#FFD700', '#F59E0B', '#10B981', '#EC4899'],
          origin: { x: 0.3, y: 0.65 }
        });
        confetti({
          particleCount: 65,
          spread: 60,
          colors: ['#FFD700', '#F59E0B', '#10B981', '#EC4899'],
          origin: { x: 0.7, y: 0.65 }
        });
      }
    } else {
      setFeedback('incorrect');
      setCorrectStreak(0);
      sounds.playIncorrect();
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
    <div className="mobile-page mx-auto max-w-3xl select-none px-4 py-5 sm:py-8">
      {/* Top Header Card */}
      <div className="mb-4 rounded-[26px] border border-slate-800 bg-[#0B0F19]/90 p-4 shadow-xl sm:mb-6 sm:p-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
              <Puzzle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-black text-white">Build a Spanish sentence</h1>
                {correctStreak >= 2 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider animate-bounce">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>{correctStreak}x Combo</span>
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-400">{currentUnit.subtitle || currentUnit.title}</p>
            </div>
          </div>
          <div className="shrink-0 rounded-xl bg-purple-500/10 border border-purple-400/20 px-2.5 py-1.5 text-right text-[10px] font-black uppercase tracking-wide text-purple-200">
            <span className="block">Pack {deckNumber}/{totalDecks}</span>
            <span className="text-purple-300/70">Round {roundNumber}/{REPEAT_ROUNDS}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-900 border border-slate-800 p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Royal Praise Burst Banner */}
      <AnimatePresence>
        {praise && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-4 flex items-center gap-3 rounded-3xl border border-amber-300/50 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 p-4 text-slate-950 shadow-xl shadow-amber-500/25 animate-royal-glow"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-2xl shadow-inner animate-float-gently">
              👸
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-80">👑 Elogio Real de la Princesa</p>
              <p className="text-sm sm:text-base font-black leading-tight">{praise}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Assembly Card (with screen-shake on wrong answer) */}
      <motion.main
        animate={feedback === 'incorrect' ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.45 }}
        className={`relative overflow-hidden rounded-[30px] border bg-[#0B0F19] p-5 shadow-2xl transition-all sm:p-8 ${
          feedback === 'correct'
            ? 'border-emerald-400/80 ring-4 ring-emerald-400/20'
            : feedback === 'incorrect'
            ? 'border-rose-500/80 ring-4 ring-rose-500/20'
            : 'border-slate-800'
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-purple-200">
            {currentChallenge.style === 'listen' ? <Volume2 className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            {currentChallenge.helper}
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-xl font-black leading-snug text-white sm:text-3xl">
            “{currentChallenge.prompt}”
          </h2>
          <button
            onClick={playChallengeAudio}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-2 text-xs font-black text-cyan-200 transition-colors hover:bg-cyan-400/20 cursor-pointer"
          >
            <Volume2 className="h-4 w-4" />
            <span>Escuchar en Español</span>
          </button>
        </div>

        {/* Answer Slot (Tiles fly in using Framer Motion layoutId) */}
        <section className="relative mt-6 sm:mt-8">
          <p className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
            Tu frase en español
          </p>
          <div
            className={`flex min-h-24 flex-wrap items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-3 sm:min-h-28 sm:p-4 transition-colors ${
              feedback === 'correct'
                ? 'border-emerald-400/40 bg-emerald-500/5'
                : feedback === 'incorrect'
                ? 'border-rose-400/40 bg-rose-500/5'
                : 'border-slate-800 bg-[#070A0F]'
            }`}
          >
            {assembledChips.length ? (
              assembledChips.map(chip => (
                <motion.button
                  key={chip.id}
                  layoutId={chip.id}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                  onClick={() => removeChip(chip)}
                  disabled={isAnswered}
                  className="rounded-2xl border-b-4 border-indigo-800 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-black text-white shadow-md active:translate-y-1 active:border-b-0 cursor-pointer"
                >
                  {chip.text}
                </motion.button>
              ))
            ) : (
              <span className="px-4 text-center text-xs font-semibold text-slate-500">
                Toca las palabras de abajo para armar la respuesta
              </span>
            )}
          </div>
        </section>

        {/* Word Bank (Remaining Tiles) */}
        <section className="relative mt-5 sm:mt-7">
          <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
            Banco de palabras
          </p>
          <div className="flex min-h-16 flex-wrap justify-center gap-2.5">
            {availableChips.map(chip => (
              <motion.button
                key={chip.id}
                layoutId={chip.id}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                onClick={() => addChip(chip)}
                disabled={isAnswered}
                className="rounded-2xl border-b-4 border-slate-900 bg-slate-800 px-4 py-2.5 text-sm font-black text-slate-100 shadow-md hover:border-indigo-600 hover:bg-slate-700 active:translate-y-1 active:border-b-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
              className="relative mt-6 flex items-start gap-3 rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-emerald-100"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 shadow-md">
                <CheckCircle2 className="h-6 w-6 stroke-[3]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-white">¡Correcto! Excelente sintaxis.</p>
                <p className="mt-1 text-sm font-bold text-emerald-200">{currentChallenge.targetSpanish}</p>
              </div>
              <button
                onClick={playChallengeAudio}
                className="rounded-xl bg-emerald-400/20 p-2.5 text-emerald-200 hover:bg-emerald-400/30"
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
              className="relative mt-6 rounded-3xl border border-rose-400/50 bg-rose-500/10 p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                  <X className="h-6 w-6 stroke-[3]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white">Casi — aquí tienes la respuesta correcta:</p>
                  <p className="mt-1.5 text-base font-black text-rose-200 sm:text-lg">
                    {currentChallenge.targetSpanish}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    No te preocupes. Esta frase se repetirá en una ronda posterior para que la domines.
                  </p>
                </div>
                <button
                  onClick={playChallengeAudio}
                  className="rounded-xl bg-rose-400/20 p-2.5 text-rose-200 hover:bg-rose-400/30"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-slate-800/80 pt-5">
          <button
            onClick={resetTiles}
            disabled={isAnswered || assembledChips.length === 0}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Resetear</span>
          </button>

          {isAnswered ? (
            <TactileButton
              variant={feedback === 'correct' ? 'emerald' : 'danger'}
              onClick={continueChallenge}
            >
              <span>Continuar</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </TactileButton>
          ) : (
            <TactileButton
              variant="amethyst"
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
