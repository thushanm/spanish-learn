import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { SpanishWordPhrase } from '../types';
import { speakSpanish, stopSpeaking } from '../utils/speech';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playLevelCompleteFanfare
} from '../utils/soundEffects';
import {
  Headphones,
  Volume2,
  Turtle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ListeningLabExercise: React.FC = () => {
  const { stats, addXP, selectedUnitId } = useApp();

  const currentUnit = SPANISH_UNITS.find(u => u.id === selectedUnitId) || SPANISH_UNITS[0];
  const items = currentUnit.items;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [mode, setMode] = useState<'cloze' | 'meaning'>('cloze');
  const [clozeTargetWord, setClozeTargetWord] = useState('');
  const [maskedSentence, setMaskedSentence] = useState('');
  const [scoreCount, setScoreCount] = useState(0);

  const currentItem: SpanishWordPhrase = items[currentIndex] || items[0];

  // Set up current challenge
  useEffect(() => {
    if (!currentItem) return;

    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);

    // Prepare Cloze Mode: pick a meaningful word from currentItem.spanish
    const words = currentItem.spanish
      .replace(/[¡!¿?,.]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);

    const chosenWord = words.length > 0
      ? words[Math.floor(Math.random() * words.length)]
      : currentItem.spanish.split(' ')[0] || 'hola';

    setClozeTargetWord(chosenWord);

    // Replace first occurrence of chosenWord in the sentence with ______
    const regex = new RegExp(`\\b${chosenWord}\\b`, 'i');
    setMaskedSentence(currentItem.spanish.replace(regex, '__________'));

    // Generate 4 plausible Spanish options (including correct one)
    const allWords = SPANISH_UNITS.flatMap(u =>
      u.items.flatMap(item =>
        item.spanish.replace(/[¡!¿?,.]/g, '').split(/\s+/).filter(w => w.length > 2)
      )
    );
    const uniquePool = Array.from(new Set(allWords)).filter(
      w => w.toLowerCase() !== chosenWord.toLowerCase()
    );

    // Shuffle pool
    const distractors = uniquePool.sort(() => 0.5 - Math.random()).slice(0, 3);
    const shuffledOptions = [chosenWord, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(shuffledOptions);

    // Auto-play native audio once after brief delay for acoustic habituation
    const timer = setTimeout(() => {
      handlePlayAudio(1.0);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentIndex, selectedUnitId]);

  const handlePlayAudio = (rate: number = 1.0) => {
    setIsPlayingAudio(true);
    speakSpanish(currentItem.spanish, {
      rate,
      preferredAccent: stats.preferredAccent,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    playClickSound(stats.soundEnabled);
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswerChecked) return;

    const correct = selectedOption.toLowerCase() === clozeTargetWord.toLowerCase();
    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound(stats.soundEnabled);
      addXP(15);
      setScoreCount(prev => {
        const next = prev + 1;
        if (next > 0 && next % 5 === 0) {
          playLevelCompleteFanfare(stats.soundEnabled);
          confetti({ particleCount: 85, spread: 68, origin: { y: 0.68 } });
        }
        return next;
      });
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 }
      });
    } else {
      playIncorrectSound(stats.soundEnabled);
    }
  };

  const handleNext = () => {
    playClickSound(stats.soundEnabled);
    stopSpeaking();
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="mobile-page max-w-4xl mx-auto px-4 py-5 sm:py-8">
      {/* Top Header Card */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[26px] sm:rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
            <Headphones className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">Acoustic Audio Lab</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Auditory Cloze
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Listen to native Spanish pronunciation and train your auditory phoneme recognition.
            </p>
          </div>
        </div>

        {/* Progress & Score */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold">
            Item <span className="text-purple-400 font-bold">{currentIndex + 1}</span> of {items.length}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Mastery: {scoreCount}</span>
          </div>
        </div>
      </div>

      {/* Main Acoustic Interaction Chamber */}
      <div className="bg-[#0B0F17] rounded-[28px] sm:rounded-3xl border border-slate-800/80 p-4 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow ambient backdrops */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Audio Player Hub */}
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="relative">
            {/* Visual soundwave ripple effect */}
            {isPlayingAudio && (
              <span className="absolute -inset-4 rounded-full bg-purple-500/20 animate-ping opacity-75" />
            )}
            <button
              onClick={() => handlePlayAudio(1.0)}
              disabled={isPlayingAudio}
            className={`relative z-10 w-28 h-28 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 ${
                isPlayingAudio
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-purple-500/40 scale-105'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 hover:scale-105'
              }`}
            >
              <Volume2 className={`w-10 h-10 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                {isPlayingAudio ? 'Playing...' : 'Play Audio'}
              </span>
            </button>
          </div>

          {/* Secondary Controls: Slow Speed & Phonetic hint */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlayAudio(0.75)}
              disabled={isPlayingAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <Turtle className="w-3.5 h-3.5 text-purple-400" />
              <span>Slow (0.75x)</span>
            </button>
            <button
              onClick={() => handlePlayAudio(1.0)}
              disabled={isPlayingAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Replay</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            Listen carefully to the audio and identify the missing word in the sentence below.
          </p>
        </div>

        {/* Masked Sentence Display */}
          <div className="my-5 sm:my-6 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white tracking-wide leading-relaxed">
            {maskedSentence.split('__________').map((part, idx, arr) => (
              <React.Fragment key={idx}>
                <span>{part}</span>
                {idx < arr.length - 1 && (
                  <span className={`inline-block mx-2 px-4 py-1 rounded-xl border-2 font-mono text-base sm:text-xl transition-all ${
                    isAnswerChecked
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'border-rose-500 bg-rose-500/20 text-rose-300 font-bold'
                      : selectedOption
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 font-bold'
                        : 'border-dashed border-slate-600 bg-slate-800 text-slate-400'
                  }`}>
                    {selectedOption || '???'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* English Meaning Hint */}
          <p className="mt-3 text-sm text-slate-400 italic">
            "{currentItem.english}"
          </p>
        </div>

        {/* Multiple Choice Options Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 my-6">
          {options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isTarget = option.toLowerCase() === clozeTargetWord.toLowerCase();

            let btnStyle = 'border-slate-800 bg-slate-900/70 hover:border-purple-500/40 hover:bg-slate-850 text-white';

            if (isAnswerChecked) {
              if (isTarget) {
                btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/20';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-300';
              } else {
                btnStyle = 'border-slate-800/40 bg-slate-900/30 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              btnStyle = 'border-purple-500 bg-purple-950/40 text-purple-200 shadow-md shadow-purple-500/20';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswerChecked}
                className={`py-4 px-5 rounded-2xl border-2 text-base sm:text-lg font-bold text-center transition-all transform active:scale-98 ${btnStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Verification Result Banner */}
        {isAnswerChecked && (
          <div className={`p-4 rounded-2xl border mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <p className="font-extrabold text-sm sm:text-base">
                  {isCorrect ? 'Accurate Auditory Recognition! (+15 XP)' : 'Auditory Misinterpretation'}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  The spoken word was <strong className="text-white underline">{clozeTargetWord}</strong>.
                  {currentItem.pronunciationTip && (
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      💡 Tip: {currentItem.pronunciationTip}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all shrink-0"
            >
              <span>Next Phrase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer Action Bar */}
        {!isAnswerChecked && (
          <div className="flex justify-end items-center pt-4 border-t border-slate-800">
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg ${
                selectedOption
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 cursor-pointer transform hover:scale-102'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Verify Auditory Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
