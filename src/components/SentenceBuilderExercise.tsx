import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { SpanishWordPhrase } from '../types';
import { speakSpanish, normalizeSpanish } from '../utils/speech';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playLevelCompleteFanfare,
  playXpRewardSound
} from '../utils/soundEffects';
import { DuolingoMascot } from './DuolingoMascot';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Layers3,
  Puzzle,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BATCH_SIZE = 10;
const REPEAT_ROUNDS = 5;

type FeedbackState = 'idle' | 'correct' | 'incorrect';
type ChallengeStyle = 'translate' | 'everyday' | 'listen' | 'recall' | 'real-life';

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
  '💎 ¡Sublime! 🚀 ¡3 aciertos seguidos con pura fluidez!',
  '🥳 ¡Sensacional! 🎉 ¡Tu mente crea sinapsis de oro puro!'
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const chipsFor = (sentence: string) => shuffle(
  sentence
    .replace(/[Â¿?Â¡!.,;:]/g, '')
    .split(' ')
    .filter(Boolean)
);

function createChallenge(item: SpanishWordPhrase, round: number): BuildChallenge {
  const style = (['translate', 'everyday', 'listen', 'recall', 'real-life'] as ChallengeStyle[])[round];
  const useExample = style === 'everyday' || style === 'real-life';
  const targetSpanish = useExample ? item.exampleSpanish : item.spanish;

  switch (style) {
    case 'everyday':
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: item.exampleEnglish,
        helper: 'Build the natural everyday sentence',
        style
      };
    case 'listen':
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: 'Listen carefully, then put the Spanish words in order.',
        helper: 'Listening challenge · tap the speaker as often as you need',
        style
      };
    case 'recall':
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: `Quick recall: ${item.english}`,
        helper: 'Build it from memory',
        style
      };
    case 'real-life':
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: item.exampleEnglish,
        helper: 'How would you say this in a real conversation?',
        style
      };
    default:
      return {
        id: `${item.id}-${round}`,
        item,
        targetSpanish,
        prompt: item.english,
        helper: 'Put this idea into Spanish',
        style
      };
  }
}

export const SentenceBuilderExercise: React.FC = () => {
  const { stats, selectedUnitId, recordPracticeResult } = useApp();
  const currentUnit = SPANISH_UNITS.find(unit => unit.id === selectedUnitId) || SPANISH_UNITS[0];
  const topicItems = currentUnit.items;

  const [batchStart, setBatchStart] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [availableChips, setAvailableChips] = useState<string[]>([]);
  const [assembledChips, setAssembledChips] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [correctStreak, setCorrectStreak] = useState(0);
  const [praise, setPraise] = useState<string | null>(null);
  const [deckComplete, setDeckComplete] = useState(false);

  const batchItems = useMemo(
    () => topicItems.slice(batchStart, batchStart + BATCH_SIZE),
    [topicItems, batchStart]
  );

  // A compact phrase pack is repeated through five different prompts. This gives the
  // learner spaced, useful practice instead of a long list all at once.
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
    setAvailableChips(chipsFor(currentChallenge.targetSpanish));
    setAssembledChips([]);
    setFeedback('idle');
  }, [currentChallenge?.id]);

  const playChallengeAudio = () => {
    if (!currentChallenge) return;
    playClickSound(stats.soundEnabled);
    speakSpanish(currentChallenge.targetSpanish, {
      rate: stats.speechRate,
      preferredAccent: stats.preferredAccent
    });
  };

  const resetTiles = () => {
    if (!currentChallenge || feedback !== 'idle') return;
    playClickSound(stats.soundEnabled);
    setAvailableChips(chipsFor(currentChallenge.targetSpanish));
    setAssembledChips([]);
  };

  const addChip = (word: string, index: number) => {
    if (feedback !== 'idle') return;
    playClickSound(stats.soundEnabled);
    setAssembledChips(previous => [...previous, word]);
    setAvailableChips(previous => previous.filter((_, chipIndex) => chipIndex !== index));
  };

  const removeChip = (word: string, index: number) => {
    if (feedback !== 'idle') return;
    playClickSound(stats.soundEnabled);
    setAvailableChips(previous => [...previous, word]);
    setAssembledChips(previous => previous.filter((_, chipIndex) => chipIndex !== index));
  };

  const checkSentence = () => {
    if (!currentChallenge || !currentItem || feedback !== 'idle') return;
    const builtSentence = assembledChips.join(' ');
    const isCorrect = normalizeSpanish(builtSentence) === normalizeSpanish(currentChallenge.targetSpanish);

    if (isCorrect) {
      setFeedback('correct');
      playCorrectSound(stats.soundEnabled);
      recordPracticeResult(currentUnit.id, 100, currentItem);

      setCorrectStreak(previous => {
        const next = previous + 1;
        if (next % 3 === 0) {
          setPraise(PRAISE_LINES[(next / 3 - 1) % PRAISE_LINES.length]);
          playXpRewardSound(stats.soundEnabled, true);
          confetti({ particleCount: 58, spread: 58, startVelocity: 28, origin: { y: 0.72 } });
        }
        return next;
      });
    } else {
      // Save the mistake for a future review, show its solution, and move the learner on.
      setFeedback('incorrect');
      setCorrectStreak(0);
      playIncorrectSound(stats.soundEnabled);
      recordPracticeResult(currentUnit.id, 30, currentItem);
    }
  };

  const continueChallenge = () => {
    playClickSound(stats.soundEnabled);
    setPraise(null);
    if (questionIndex < challenges.length - 1) {
      setQuestionIndex(previous => previous + 1);
      return;
    }

    setDeckComplete(true);
    playLevelCompleteFanfare(stats.soundEnabled);
    confetti({ particleCount: 125, spread: 80, startVelocity: 35, origin: { y: 0.65 } });
  };

  const openNextDeck = () => {
    playClickSound(stats.soundEnabled);
    setBatchStart(previous => hasNextDeck ? previous + BATCH_SIZE : 0);
    setQuestionIndex(0);
    setCorrectStreak(0);
    setPraise(null);
    setDeckComplete(false);
  };

  if (!currentChallenge || !currentItem) return null;

  if (deckComplete) {
    return (
      <div className="mobile-page mx-auto max-w-3xl select-none px-4 py-5 sm:py-8">
        <section className="relative overflow-hidden rounded-[32px] border border-emerald-400/35 bg-gradient-to-br from-emerald-950 via-slate-900 to-cyan-950 p-6 text-center shadow-2xl sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative mx-auto mb-3 w-fit">
            <DuolingoMascot mood="celebrating" size="md" speechText="Awesome work! You finished this phrase pack!" />
          </div>
          <div className="relative mx-auto mt-1 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1.5 text-xs font-black text-amber-200">
            <Star className="h-4 w-4 fill-current" />
            {batchItems.length} phrases × {REPEAT_ROUNDS} playful challenges
          </div>
          <h1 className="relative mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">Great job, superstar!</h1>
          <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            Your brain has just met these phrases in several useful situations. Small, repeated wins make Spanish stick.
          </p>
          <button
            onClick={openNextDeck}
            className="relative mt-8 inline-flex min-h-14 items-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-7 py-3.5 text-sm font-black uppercase tracking-wide text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:bg-emerald-400 active:translate-y-1 active:border-b-0"
          >
            <Layers3 className="h-5 w-5" />
            {hasNextDeck ? 'Open next 10 phrases' : 'Play this phrase pack again'}
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="relative mt-4 text-xs font-bold text-emerald-200/75">Pack {deckNumber} of {totalDecks} · You choose the pace.</p>
        </section>
      </div>
    );
  }

  const isAnswered = feedback !== 'idle';
  const progress = challenges.length ? ((questionIndex + 1) / challenges.length) * 100 : 0;

  return (
    <div className="mobile-page mx-auto max-w-3xl select-none px-4 py-5 sm:py-8">
      <div className="mb-4 rounded-[26px] border border-slate-800 bg-slate-900/85 p-4 shadow-xl sm:mb-6 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/25"><Puzzle className="h-5 w-5" /></div>
            <div className="min-w-0"><h1 className="truncate text-base font-black text-white">Build a Spanish sentence</h1><p className="mt-0.5 text-xs text-slate-400">{currentUnit.subtitle || currentUnit.title}</p></div>
          </div>
          <div className="shrink-0 rounded-xl bg-indigo-500/10 px-2.5 py-1.5 text-right text-[10px] font-black uppercase tracking-wide text-indigo-200 ring-1 ring-indigo-400/20"><span className="block">Pack {deckNumber}/{totalDecks}</span><span className="text-indigo-300/70">Round {roundNumber}/{REPEAT_ROUNDS}</span></div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800 p-0.5"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-400 to-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500"><span>{questionIndex + 1} of {challenges.length} little wins</span><span>{batchItems.length} phrases, one at a time</span></div>
      </div>

      {praise && (
        <div className="builder-praise-burst mb-4 flex items-center gap-3 rounded-3xl border border-amber-300/45 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 p-3.5 text-slate-950 shadow-xl shadow-amber-500/25 sm:p-4 animate-royal-glow">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/45 text-2xl shadow-inner">👸</div>
          <div><p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-80">👑 Elogio Real de la Princesa</p><p className="text-sm sm:text-base font-black leading-tight">{praise}</p></div>
        </div>
      )}

      <main className={`relative overflow-hidden rounded-[30px] border bg-slate-900 p-4 shadow-2xl transition-colors sm:p-8 ${feedback === 'correct' ? 'border-emerald-400/60 ring-2 ring-emerald-400/15' : feedback === 'incorrect' ? 'border-rose-400/60 ring-2 ring-rose-400/15' : 'border-slate-800'}`}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-indigo-200">{currentChallenge.style === 'listen' ? <Volume2 className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}{currentChallenge.helper}</span>
          <h2 className="mx-auto mt-4 max-w-2xl text-xl font-black leading-snug text-white sm:text-3xl">“{currentChallenge.prompt}”</h2>
          <button onClick={playChallengeAudio} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-2 text-xs font-black text-cyan-200 transition-colors hover:bg-cyan-400/20"><Volume2 className="h-4 w-4" />Listen to Spanish</button>
        </div>

        <section className="relative mt-6 sm:mt-8">
          <p className="mb-2 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Your sentence</p>
          <div className={`flex min-h-24 flex-wrap items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-3 sm:min-h-28 sm:p-4 ${feedback === 'correct' ? 'border-emerald-400/35 bg-emerald-500/5' : feedback === 'incorrect' ? 'border-rose-400/35 bg-rose-500/5' : 'border-slate-700 bg-slate-950/65'}`}>
            {assembledChips.length ? assembledChips.map((word, index) => <button key={`${word}-${index}`} onClick={() => removeChip(word, index)} disabled={isAnswered} className="rounded-2xl border-b-4 border-indigo-800 bg-indigo-600 px-3.5 py-2.5 text-sm font-black text-white shadow-md transition-all hover:bg-indigo-500 disabled:cursor-default disabled:opacity-90 active:translate-y-0.5 active:border-b-2">{word}</button>) : <span className="px-4 text-center text-xs font-semibold text-slate-500">Tap word tiles below to build the answer</span>}
          </div>
        </section>

        <section className="relative mt-5 sm:mt-7">
          <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Word bank</p>
          <div className="flex min-h-16 flex-wrap justify-center gap-2.5">
            {availableChips.map((word, index) => <button key={`${word}-${index}`} onClick={() => addChip(word, index)} disabled={isAnswered} className="rounded-2xl border-b-4 border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm font-black text-slate-100 shadow-md transition-all hover:border-indigo-600 hover:bg-slate-700 disabled:cursor-default disabled:opacity-35 active:translate-y-0.5 active:border-b-2">{word}</button>)}
          </div>
        </section>

        {feedback === 'correct' && (
          <div className="builder-feedback-pop relative mt-6 flex items-start gap-3 rounded-3xl border border-emerald-400/35 bg-emerald-500/10 p-4 text-emerald-100">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950"><CheckCircle2 className="h-6 w-6 stroke-[3]" /></div>
            <div className="min-w-0 flex-1"><p className="font-black text-white">Correct! Beautiful Spanish.</p><p className="mt-1 text-sm font-bold text-emerald-200">{currentChallenge.targetSpanish}</p></div>
            <button onClick={playChallengeAudio} className="rounded-xl bg-emerald-400/15 p-2.5 text-emerald-200 hover:bg-emerald-400/25" aria-label="Listen to correct answer"><Volume2 className="h-4 w-4" /></button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="builder-feedback-pop relative mt-6 rounded-3xl border border-rose-400/40 bg-rose-500/10 p-4 text-left"><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white"><X className="h-6 w-6 stroke-[3]" /></div><div className="min-w-0 flex-1"><p className="font-black text-white">Not quite — here is the correct answer:</p><p className="mt-1.5 text-base font-black text-rose-200 sm:text-lg">{currentChallenge.targetSpanish}</p><p className="mt-1 text-xs leading-relaxed text-slate-300">No worries. You will meet this phrase again in a new, easier-to-remember situation.</p></div><button onClick={playChallengeAudio} className="rounded-xl bg-rose-400/15 p-2.5 text-rose-200 hover:bg-rose-400/25" aria-label="Listen to correct answer"><Volume2 className="h-4 w-4" /></button></div></div>
        )}

        <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-slate-800 pt-5">
          <button onClick={resetTiles} disabled={isAnswered || assembledChips.length === 0} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"><RotateCcw className="h-4 w-4" />Reset</button>
          {isAnswered ? <button onClick={continueChallenge} className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border-b-4 px-5 py-3 text-xs font-black uppercase tracking-wide shadow-lg transition-all active:translate-y-1 active:border-b-0 sm:px-7 ${feedback === 'correct' ? 'border-emerald-700 bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'border-rose-700 bg-rose-500 text-white hover:bg-rose-400'}`}><span>Continue</span><ArrowRight className="h-4 w-4 stroke-[3]" /></button> : <button onClick={checkSentence} disabled={assembledChips.length === 0} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-b-4 border-indigo-800 bg-indigo-500 px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none active:translate-y-1 active:border-b-0 sm:px-7"><Check className="h-4 w-4 stroke-[3]" />Check</button>}
        </div>
      </main>
    </div>
  );
};
