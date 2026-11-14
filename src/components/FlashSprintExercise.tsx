import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { SpanishWordPhrase } from '../types';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playLevelCompleteFanfare
} from '../utils/soundEffects';
import {
  Zap,
  Clock,
  Flame,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SprintQuestion {
  item: SpanishWordPhrase;
  prompt: string;
  expectedAnswer: string;
  options: string[];
  mode: 'es-to-en' | 'en-to-es';
}

export const FlashSprintExercise: React.FC = () => {
  const { stats, addXP, selectedUnitId } = useApp();

  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<SprintQuestion | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  const currentUnit = SPANISH_UNITS.find(unit => unit.id === selectedUnitId) || SPANISH_UNITS[0];
  const allItems = useMemo<SpanishWordPhrase[]>(() => {
    const missedIds = new Set(stats.mistakeWordList.map(item => item.id));
    const missedItems = SPANISH_UNITS.flatMap(unit => unit.items).filter(item => missedIds.has(item.id));
    const localItems = [...missedItems, ...currentUnit.items];
    return localItems.filter((item, index, items) => items.findIndex(candidate => candidate.id === item.id) === index);
  }, [currentUnit, stats.mistakeWordList]);

  // Generate a random question
  const generateQuestion = (): SprintQuestion => {
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    const isEsToEn = Math.random() > 0.4; // 60% Spanish -> English, 40% English -> Spanish

    const prompt = isEsToEn ? randomItem.spanish : randomItem.english;
    const expectedAnswer = isEsToEn ? randomItem.english : randomItem.spanish;

    // Distractor pool
    const otherItems = allItems.filter(i => i.id !== randomItem.id);
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 3);
    const distractorAnswers = shuffledOthers.map(i =>
      isEsToEn ? i.english : i.spanish
    );

    const options = [expectedAnswer, ...distractorAnswers].sort(() => 0.5 - Math.random());

    return {
      item: randomItem,
      prompt,
      expectedAnswer,
      options,
      mode: isEsToEn ? 'es-to-en' : 'en-to-es'
    };
  };

  const handleStartGame = () => {
    playClickSound(stats.soundEnabled);
    setTimeLeft(60);
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setTotalAnswered(0);
    setCorrectCount(0);
    setFeedback(null);
    setCurrentQuestion(generateQuestion());
    setGameState('running');
    startTimeRef.current = Date.now();
  };

  // Timer countdown
  useEffect(() => {
    if (gameState === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('finished');
            playLevelCompleteFanfare(stats.soundEnabled);
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleAnswer = (selectedOption: string) => {
    if (gameState !== 'running' || !currentQuestion) return;

    setTotalAnswered(prev => prev + 1);
    const isCorrect = selectedOption.toLowerCase() === currentQuestion.expectedAnswer.toLowerCase();

    if (isCorrect) {
      playCorrectSound(stats.soundEnabled);
      const points = 10 * combo;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      addXP(5 * combo);
      setFeedback('correct');
    } else {
      playIncorrectSound(stats.soundEnabled);
      setCombo(1);
      setFeedback('wrong');
    }

    // Flash next question after brief moment
    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestion(generateQuestion());
    }, 280);
  };

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const avgResponseTime = totalAnswered > 0 ? ((60 - timeLeft) / totalAnswered).toFixed(1) : '0.0';

  return (
    <div className="mobile-page max-w-4xl mx-auto px-4 py-5 sm:py-8">
      {/* Top Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[26px] sm:rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border border-amber-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">60-Second Recall Game</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Quick memory warm-up
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              A fast, low-pressure review of your current topic. Tricky phrases return until they feel easier.
            </p>
          </div>
        </div>

        {/* Live HUD when running */}
        {gameState === 'running' && (
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-base ${
              timeLeft <= 10
                ? 'bg-rose-950/60 border-rose-500 text-rose-400 animate-bounce'
                : 'bg-slate-900 border-slate-800 text-amber-400'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-bold">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{combo}x Combo</span>
            </div>
          </div>
        )}
      </div>

      {/* Game Stages */}
      {gameState === 'idle' && (
        <div className="bg-[#0B0F17] rounded-[28px] sm:rounded-3xl border border-slate-800/80 p-5 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-2xl shadow-amber-500/30 mb-6">
            <div className="w-full h-full bg-[#0B0F17] rounded-[22px] flex items-center justify-center">
              <Zap className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ready for a quick Spanish warm-up?
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            You will have <strong className="text-white">60 seconds</strong> to recall phrases from <strong className="text-amber-300">{currentUnit.title}</strong>.
            Consecutive correct answers trigger <strong className="text-amber-400">Combo Multipliers (up to 5x XP)</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <Brain className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recall</h4>
              <p className="text-[11px] text-slate-400 mt-1">Bring a phrase to mind without reading a study list.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <Flame className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Momentum</h4>
              <p className="text-[11px] text-slate-400 mt-1">A short game is easier to start than a long drill.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Useful review</h4>
              <p className="text-[11px] text-slate-400 mt-1">Your current lesson stays the focus.</p>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-xl shadow-amber-500/25 transform hover:scale-105 transition-all cursor-pointer"
          >
            Start 60s Sprint
          </button>
        </div>
      )}

      {gameState === 'running' && currentQuestion && (
        <div className={`bg-[#0B0F17] rounded-[28px] sm:rounded-3xl border p-5 sm:p-12 shadow-2xl relative transition-all duration-200 ${
          feedback === 'correct'
            ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
            : feedback === 'wrong'
              ? 'border-rose-500/60 ring-2 ring-rose-500/20'
              : 'border-slate-800/80'
        }`}>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>

          {/* Prompt card */}
          <div className="text-center py-6">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
              {currentQuestion.mode === 'es-to-en' ? 'Spanish ➔ Select English' : 'English ➔ Select Spanish'}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white mt-4 tracking-wide leading-tight">
              {currentQuestion.prompt}
            </h2>

            {currentQuestion.item.phonetic && currentQuestion.mode === 'es-to-en' && (
              <p className="text-xs text-amber-400/80 font-mono mt-2">
                /{currentQuestion.item.phonetic}/
              </p>
            )}
          </div>

          {/* 4 Choices Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="p-4 sm:p-5 min-h-[72px] rounded-2xl bg-slate-900/90 border-2 border-slate-800 hover:border-amber-500/60 hover:bg-slate-850 text-white font-bold text-sm sm:text-lg text-left transition-all transform active:scale-98 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Real-time score ticker */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>Score: </span>
              <strong className="text-amber-400 font-mono text-sm">{score} pts</strong>
            </div>
            <div>
              <span>Processed: </span>
              <strong className="text-white font-mono">{totalAnswered}</strong>
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="bg-[#0B0F17] rounded-[28px] sm:rounded-3xl border border-slate-800/80 p-5 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl mb-6">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Recall game complete!
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Here is what you remembered in this short round.
          </p>

          {/* Metrics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Sprint Score</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">{score}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{accuracy}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Max Combo</span>
              <p className="text-2xl font-black text-orange-400 font-mono mt-1">{maxCombo}x</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg Speed</span>
              <p className="text-2xl font-black text-cyan-400 font-mono mt-1">{avgResponseTime}s</p>
            </div>
          </div>

          {/* Fluency Reflex Classification */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto mb-8 text-left flex items-center gap-4">
            <Brain className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Recall result:{' '}
                <span className="text-amber-400">
                  {score >= 200 ? 'Flying!' : score >= 100 ? 'Getting quicker' : 'A solid start'}
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {score >= 200
                  ? 'Great energy. Keep using the phrases out loud to make them feel natural.'
                  : 'A few quick rounds across the week will make recall easier.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transform hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sprint Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
