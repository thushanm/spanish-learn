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
  const { stats, addXP, selectedUnitId, triggerGameAction } = useApp();

  const currentUnit = SPANISH_UNITS.find(u => u.id === selectedUnitId) || SPANISH_UNITS[0];
  const items = currentUnit.items;

  // Regular listening progression index - restored from localStorage
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`jtm_listen_pos_${currentUnit.id}`);
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < items.length) return idx;
      }
    } catch {}
    return 0;
  });

  // Automatically save listening phrase position
  useEffect(() => {
    try {
      localStorage.setItem(`jtm_listen_pos_${currentUnit.id}`, currentIndex.toString());
    } catch {}
  }, [currentUnit.id, currentIndex]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`jtm_listen_pos_${currentUnit.id}`);
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < items.length) {
          setCurrentIndex(idx);
          return;
        }
      }
    } catch {}
    setCurrentIndex(0);
  }, [currentUnit.id]);
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
      triggerGameAction('correct');
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
      triggerGameAction('wrong');
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
    <div className="mobile-page max-w-4xl mx-auto px-4 py-5 sm:py-8 space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[28px] sm:rounded-[32px] border-2 border-slate-700/60 bg-[#121927]/90 shadow-xl text-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-sm">
            <Headphones className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">Acoustic Audio Lab</h1>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/40 uppercase">
                Auditory Cloze
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-0.5">
              Listen to native Spanish pronunciation and train your auditory recognition.
            </p>
          </div>
        </div>

        {/* Progress & Score */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-black">
            Item <span className="text-purple-400">{currentIndex + 1}</span> of {items.length}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-black shadow-sm">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Mastery: {scoreCount}</span>
          </div>
        </div>
      </div>

      {/* Main Acoustic Interaction Chamber */}
      <div className="rounded-[28px] sm:rounded-[32px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-5 sm:p-10 shadow-xl relative overflow-hidden text-slate-100">
        {/* Audio Player Hub */}
        <div className="flex flex-col items-center justify-center py-4 text-center space-y-4">
          <div className="relative">
            <button
              onClick={() => handlePlayAudio(1.0)}
              disabled={isPlayingAudio}
              className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-b-[6px] active:translate-y-1.5 active:border-b-0 cursor-pointer ${
                isPlayingAudio
                  ? 'border-[#8B2BE2] bg-[#A855F7] text-white scale-105 shadow-purple-500/40'
                  : 'border-[#8B2BE2] bg-[#A855F7] hover:bg-[#B66BFC] text-white shadow-purple-500/30 hover:scale-105'
              }`}
            >
              <Volume2 className={`w-9 h-9 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-wider mt-1">
                {isPlayingAudio ? 'Playing...' : 'Play Audio'}
              </span>
            </button>
          </div>

          {/* Secondary Controls: Slow Speed & Phonetic hint */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayAudio(0.75)}
              disabled={isPlayingAudio}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border-2 border-slate-700 text-slate-200 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Turtle className="w-3.5 h-3.5 text-purple-400" />
              <span>Slow Audio</span>
            </button>
          </div>
        </div>

        {/* Masked Sentence Display */}
        <div className="my-5 sm:my-6 p-4 sm:p-6 rounded-2xl border-2 border-slate-700 bg-slate-900/80 text-center">
          <div className="text-xl sm:text-2xl font-black text-white tracking-wide leading-relaxed">
            {maskedSentence.split('__________').map((part, idx, arr) => (
              <React.Fragment key={idx}>
                <span>{part}</span>
                {idx < arr.length - 1 && (
                  <span className={`inline-block mx-2 px-4 py-1 rounded-2xl border-2 font-mono text-base sm:text-xl transition-all shadow-sm ${
                    isAnswerChecked
                      ? isCorrect
                        ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300 font-black'
                        : 'border-rose-400 bg-rose-950/60 text-rose-300 font-black'
                      : selectedOption
                        ? 'border-purple-400 bg-purple-950/60 text-purple-300 font-black'
                        : 'border-dashed border-slate-600 bg-slate-800 text-slate-400'
                  }`}>
                    {selectedOption || '???'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="mt-3 text-sm text-slate-400 font-bold italic">
            "{currentItem.english}"
          </p>
        </div>

        {/* Multiple Choice Options Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 my-6">
          {options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isTarget = option.toLowerCase() === clozeTargetWord.toLowerCase();

            let btnStyle = 'border-b-[5px] border-slate-950 bg-slate-800 text-slate-100 hover:bg-slate-750 shadow-md';

            if (isAnswerChecked) {
              if (isTarget) {
                btnStyle = 'border-b-[5px] border-[#46A302] bg-[#58CC02] text-white shadow-lg';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'border-b-[5px] border-[#EA2B2B] bg-[#FF4B4B] text-white shadow-lg';
              } else {
                btnStyle = 'border-2 border-slate-800 bg-slate-900/40 text-slate-500 opacity-40';
              }
            } else if (isSelected) {
              btnStyle = 'border-b-[5px] border-[#1899D6] bg-[#1CB0F6] text-white shadow-lg ring-2 ring-sky-300';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswerChecked}
                className={`py-4 px-5 rounded-2xl text-base sm:text-lg font-black text-center transition-all active:translate-y-1 active:border-b-0 cursor-pointer ${btnStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Verification Result Banner */}
        {isAnswerChecked && (
          <div className={`p-4 sm:p-5 rounded-3xl border-2 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn shadow-xl ${
            isCorrect
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-100'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-100'
          }`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <p className="font-black text-sm sm:text-base">
                  {isCorrect ? '¡Reconocimiento Auditivo Correcto! (+15 XP)' : '¡Inténtalo de nuevo!'}
                </p>
                <p className="text-xs font-bold text-slate-300 mt-0.5">
                  The spoken word was <strong className="text-white underline">{clozeTargetWord}</strong>.
                  {currentItem.pronunciationTip && (
                    <span className="block text-[11px] text-slate-400 mt-0.5 font-medium">
                      💡 Tip: {currentItem.pronunciationTip}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-[5px] border-[#388E00] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:translate-y-1 active:border-b-0 shrink-0 cursor-pointer"
            >
              <span>Next Phrase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer Action Bar */}
        {!isAnswerChecked && (
          <div className="flex justify-end items-center pt-4 border-t border-slate-700/60">
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-md active:translate-y-1 active:border-b-0 ${
                selectedOption
                  ? 'bg-[#1CB0F6] hover:bg-[#1899D6] border-b-[5px] border-[#1374A6] text-white cursor-pointer shadow-sky-500/25'
                  : 'bg-slate-800 border-b-[5px] border-slate-950 text-slate-500 cursor-not-allowed'
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
