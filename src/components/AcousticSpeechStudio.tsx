import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { SpanishWordPhrase, SpeechScoreResult } from '../types';
import { speakSpanish, stopSpeaking, evaluateSpanishPronunciation } from '../utils/speech';
import { strictSpeechService, StrictSpeechResult } from '../utils/speechRecognitionService';
import { freeAIService } from '../utils/freeAIProvider';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playMicStartSound,
  playMicStopSound
} from '../utils/soundEffects';
import {
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Turtle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Headphones,
  RefreshCw,
  Film,
  Lightbulb,
  Globe,
  Flame,
  Zap,
  ArrowLeft,
  Trophy,
  ListRestart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AcousticSpeechStudio: React.FC = () => {
  const {
    stats,
    selectedUnitId,
    setSelectedUnitId,
    setActiveTab,
    recordPracticeResult,
    removeMistakeWord,
    updateSettings
  } = useApp();

  const currentUnitIndex = SPANISH_UNITS.findIndex(u => u.id === selectedUnitId);
  const safeUnitIndex = currentUnitIndex >= 0 ? currentUnitIndex : 0;
  const currentUnit = SPANISH_UNITS[safeUnitIndex] || SPANISH_UNITS[0];
  const items = currentUnit.items;

  // Regular practice progression index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Smart Spaced Repetition Review Queue (missed phrases in current unit session)
  const [missedQueue, setMissedQueue] = useState<SpanishWordPhrase[]>([]);
  const [isReviewQueueActive, setIsReviewQueueActive] = useState(false);
  const [reviewQueueIndex, setReviewQueueIndex] = useState(0);

  // Unit completion celebratory modal
  const [showUnitMasteredCelebration, setShowUnitMasteredCelebration] = useState(false);

  // Active current item based on whether we are in review queue or normal flow
  const currentItem: SpanishWordPhrase = isReviewQueueActive
    ? (missedQueue[reviewQueueIndex] || items[0])
    : (items[currentIndex] || items[0]);

  const [isListening, setIsListening] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [liveVolume, setLiveVolume] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [scoreResult, setScoreResult] = useState<SpeechScoreResult | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingBytes, setRecordingBytes] = useState<number | null>(null);
  const [recordingPeak, setRecordingPeak] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPhoneticBreakdown, setShowPhoneticBreakdown] = useState(true);
  const [isAcousticModeActive, setIsAcousticModeActive] = useState(false);
  const [isAcousticEvaluation, setIsAcousticEvaluation] = useState(false);
  const [isTranscribingAI, setIsTranscribingAI] = useState(false);
  const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState<number | null>(null);
  const [showDopamineCelebration, setShowDopamineCelebration] = useState(false);
  const [celebrationXP, setCelebrationXP] = useState(25);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Auto-advance countdown
  useEffect(() => {
    if (autoAdvanceSeconds === null) return;
    if (autoAdvanceSeconds <= 0) {
      setAutoAdvanceSeconds(null);
      setShowDopamineCelebration(false);
      handleNext();
      return;
    }
    const timer = setTimeout(() => {
      setAutoAdvanceSeconds(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoAdvanceSeconds]);

  const triggerDopamineCelebration = (score: number) => {
    playCorrectSound(stats.soundEnabled);
    const bonus = score >= 90 ? 35 : 25;
    setCelebrationXP(bonus);
    setShowDopamineCelebration(true);

    // Double confetti cannons
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.25, y: 0.65 }
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.75, y: 0.65 }
    });

    if (stats.autoAdvance) {
      setAutoAdvanceSeconds(2);
    }
  };

  // Unit Mastered Level-Up Celebration
  const handleCompleteUnit = () => {
    setShowUnitMasteredCelebration(true);
    playCorrectSound(stats.soundEnabled);
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.45 }
    });
  };

  const advanceToNextUnit = () => {
    setShowUnitMasteredCelebration(false);
    setIsReviewQueueActive(false);
    setMissedQueue([]);
    setReviewQueueIndex(0);
    setCurrentIndex(0);

    if (safeUnitIndex < SPANISH_UNITS.length - 1) {
      const nextUnit = SPANISH_UNITS[safeUnitIndex + 1];
      setSelectedUnitId(nextUnit.id);
    } else {
      setSelectedUnitId(SPANISH_UNITS[0].id);
    }
  };

  // Hook strict speech service
  useEffect(() => {
    strictSpeechService.onVolumeChange = (vol: number) => {
      setLiveVolume(vol);
    };

    strictSpeechService.onInterimResult = (text: string) => {
      setInterimTranscript(text);
    };

    strictSpeechService.onAcousticModeActivated = () => {
      setIsAcousticModeActive(true);
      setErrorMessage(null);
    };

    strictSpeechService.onFinalResult = async (result: StrictSpeechResult) => {
      setIsListening(false);
      setIsEvaluating(false);
      setRecordedAudioUrl(result.audioBlobUrl || null);
      setRecordingBytes(result.audioByteLength ?? null);
      setRecordingPeak(result.audioPeak ?? null);
      setErrorMessage(null);

      // Honest voice-detection check error
      if (result.error && !result.transcript && !result.isOfflineAcoustic) {
        setErrorMessage(result.error);
        playIncorrectSound(stats.soundEnabled);
        recordPracticeResult(currentUnit.id, 0, currentItem);

        // Queue to missed items
        setMissedQueue(prev => {
          if (!prev.some(m => m.id === currentItem.id)) {
            return [...prev, currentItem];
          }
          return prev;
        });

        setScoreResult({
          rawTranscript: '',
          score: 0,
          feedback: 'retry',
          feedbackText: result.error,
          wordMatches: currentItem.spanish.split(' ').map(w => ({ expected: w, match: false }))
        });
        return;
      }

      // If user is in local acoustic mode or Chrome speech server was blocked
      if (result.isOfflineAcoustic) {
        if (result.audioBlob) {
          setIsTranscribingAI(true);
          const aiTrans = await freeAIService.transcribeAudio(result.audioBlob);
          setIsTranscribingAI(false);
          if (aiTrans) {
            result.transcript = aiTrans;
            const evalResult = evaluateSpanishPronunciation(currentItem.spanish, result.transcript);
            setScoreResult(evalResult);
            if (evalResult.score >= 75) {
              handleItemSuccess(evalResult.score);
            } else {
              handleItemMistake(evalResult);
            }
            return;
          }
        }

        // A recording can be useful for self-review, but it is never a pass without a transcript.
        setIsAcousticEvaluation(true);
        setErrorMessage(result.transcriptionUnavailableReason || 'Your voice was recorded, but the browser did not provide a transcript. This attempt is not scored or marked as correct.');
        return;
      }

      // STRICT HONEST EVALUATION: evaluate what the user ACTUALLY spoke!
      const evalResult = evaluateSpanishPronunciation(currentItem.spanish, result.transcript);
      setScoreResult(evalResult);

      if (evalResult.score >= 75) {
        handleItemSuccess(evalResult.score);
      } else {
        handleItemMistake(evalResult);
      }
    };

    strictSpeechService.onError = (err: string) => {
      if (err.toLowerCase().includes('network')) {
        // Graceful acoustic fallback without showing red crash alert
        setIsAcousticModeActive(true);
        return;
      }
      setIsListening(false);
      setIsEvaluating(false);
      setErrorMessage(err);
      playMicStopSound(stats.soundEnabled);
    };

    strictSpeechService.onEnd = () => {
      setIsListening(false);
    };

    return () => {
      strictSpeechService.stop();
      stopSpeaking();
    };
  }, [currentIndex, isReviewQueueActive, reviewQueueIndex, currentItem, stats.preferredAccent, stats.soundEnabled]);

  // Handle successful pronunciation pass
  const handleItemSuccess = (score: number) => {
    recordPracticeResult(currentUnit.id, score, currentItem);
    triggerDopamineCelebration(score);

    if (isReviewQueueActive) {
      removeMistakeWord(currentItem.id);
      const remaining = missedQueue.filter(m => m.id !== currentItem.id);
      setMissedQueue(remaining);

      if (remaining.length === 0) {
        // All missed items in review queue conquered!
        setTimeout(() => {
          handleCompleteUnit();
        }, 1200);
      }
    }
  };

  // Handle incorrect or failed pronunciation
  const handleItemMistake = (evalResult: SpeechScoreResult) => {
    playIncorrectSound(stats.soundEnabled);
    recordPracticeResult(currentUnit.id, evalResult.score, currentItem);

    // Add to missedQueue if not already queued
    setMissedQueue(prev => {
      if (!prev.some(m => m.id === currentItem.id)) {
        return [...prev, currentItem];
      }
      return prev;
    });
  };

  // Reset states when item or unit changes
  useEffect(() => {
    setScoreResult(null);
    setInterimTranscript('');
    setRecordedAudioUrl(null);
    setRecordingBytes(null);
    setRecordingPeak(null);
    setErrorMessage(null);
    setIsAcousticEvaluation(false);
    setIsAcousticModeActive(false);
    setIsTranscribingAI(false);
    setIsEvaluating(false);
    strictSpeechService.stop();
    stopSpeaking();
  }, [currentIndex, isReviewQueueActive, reviewQueueIndex, selectedUnitId]);

  // When changing units, reset review queue
  useEffect(() => {
    setMissedQueue([]);
    setIsReviewQueueActive(false);
    setReviewQueueIndex(0);
    setCurrentIndex(0);
  }, [selectedUnitId]);

  const playNativeAudio = (rate: number = stats.speechRate) => {
    playClickSound(stats.soundEnabled);
    setIsPlayingAudio(true);
    speakSpanish(currentItem.spanish, {
      rate,
      preferredAccent: stats.preferredAccent,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const startListening = async () => {
    if (isEvaluating) return;
    playClickSound(stats.soundEnabled);
    setIsEvaluating(false);
    setScoreResult(null);
    setInterimTranscript('');
    setErrorMessage(null);

    strictSpeechService.setTargetExpected(currentItem.spanish);
    const ok = await strictSpeechService.start(
      stats.preferredAccent,
      currentItem.spanish,
      stats.microphoneDeviceId
    );
    if (ok) {
      setIsListening(true);
      playMicStartSound(stats.soundEnabled);
    } else {
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    playMicStopSound(stats.soundEnabled);
    setIsListening(false);
    setIsEvaluating(true);
    await strictSpeechService.manualStopAndEvaluate();
  };

  const handleAcousticRetry = () => {
    setIsAcousticEvaluation(false);
    setScoreResult(null);
    setRecordedAudioUrl(null);
    setRecordingBytes(null);
    setRecordingPeak(null);
    startListening();
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    playClickSound(stats.soundEnabled);
    const player = audioPlayerRef.current;
    if (player) {
      player.pause();
      player.currentTime = 0;
      player.muted = false;
      player.volume = 1;
      setIsPlayingUserAudio(true);
      player.onended = () => setIsPlayingUserAudio(false);
      player.onerror = () => {
        setIsPlayingUserAudio(false);
        setErrorMessage('Your recording could not be played in this browser. Please try recording again.');
      };
      player.play().catch(() => {
        setIsPlayingUserAudio(false);
        setErrorMessage('Your recording could not be played in this browser. Please try recording again.');
      });
    } else {
      setErrorMessage('The recording player is not ready yet. Please wait a moment and try again.');
    }
  };

  const handleNext = () => {
    playClickSound(stats.soundEnabled);
    setAutoAdvanceSeconds(null);
    setShowDopamineCelebration(false);
    setIsAcousticEvaluation(false);
    setScoreResult(null);
    setRecordedAudioUrl(null);
    setRecordingBytes(null);
    setRecordingPeak(null);
    setErrorMessage(null);

    if (!isReviewQueueActive) {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // End of main phrases for this topic!
        if (missedQueue.length > 0) {
          // Switch automatically to Spaced Review Queue!
          setIsReviewQueueActive(true);
          setReviewQueueIndex(0);
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.5 }
          });
        } else {
          // Perfect run without mistakes! Complete unit!
          handleCompleteUnit();
        }
      }
    } else {
      // We are in review queue mode
      if (missedQueue.length === 0) {
        handleCompleteUnit();
      } else if (reviewQueueIndex < missedQueue.length - 1) {
        setReviewQueueIndex(reviewQueueIndex + 1);
      } else {
        setReviewQueueIndex(0);
      }
    }
  };

  const handlePrev = () => {
    playClickSound(stats.soundEnabled);
    if (!isReviewQueueActive) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        setCurrentIndex(items.length - 1);
      }
    } else {
      if (reviewQueueIndex > 0) {
        setReviewQueueIndex(reviewQueueIndex - 1);
      } else {
        setReviewQueueIndex(missedQueue.length - 1);
      }
    }
  };

  // Helper to skip a difficult item and queue it directly for end-of-unit review
  const handleSkipToReview = () => {
    playClickSound(stats.soundEnabled);
    recordPracticeResult(currentUnit.id, 0, currentItem);

    setMissedQueue(prev => {
      if (!prev.some(m => m.id === currentItem.id)) {
        return [...prev, currentItem];
      }
      return prev;
    });

    handleNext();
  };

  const isCurrentItemMissed = missedQueue.some(m => m.id === currentItem.id);

  return (
    <div className="mobile-page max-w-4xl mx-auto px-4 py-5 sm:py-8 space-y-4 sm:space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation & Context Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => {
            playClickSound(stats.soundEnabled);
            setActiveTab('roadmap');
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white transition-all shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to Today</span>
          <span className="sm:hidden">Today</span>
        </button>

        {/* Real-time stats badge */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => updateSettings({ autoAdvance: !stats.autoAdvance })}
            className={`px-2.5 sm:px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
              stats.autoAdvance
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Automatically advance to the next phrase and next topic upon successful pronunciation"
          >
            <Zap className={`w-3.5 h-3.5 ${stats.autoAdvance ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">Auto-Flow: {stats.autoAdvance ? 'ON' : 'OFF'}</span>
            <span className="sm:hidden">Auto</span>
          </button>
        </div>
      </div>

      {/* Unit Context & Auto-Progression Status Header */}
      <div className="bg-slate-900/90 p-4 sm:p-5 rounded-[28px] sm:rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {currentUnit.level} • Topic {safeUnitIndex + 1} of {SPANISH_UNITS.length}
              </span>

              {isReviewQueueActive ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                  <RotateCcw className="w-3 h-3" />
                  <span>Review Queue ({reviewQueueIndex + 1} of {missedQueue.length})</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400">
                  Phrase {currentIndex + 1} of {items.length}
                </span>
              )}

              {missedQueue.length > 0 && !isReviewQueueActive && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  {missedQueue.length} queued for end-review
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-xl font-black text-white leading-snug">
              {currentUnit.title} <span className="hidden sm:inline text-slate-400 font-semibold">— {currentUnit.subtitle}</span>
            </h2>
          </div>

          {/* Quick Jump Dropdown (Optional convenience) */}
          <div className="w-full sm:w-auto shrink-0">
            <select
              value={currentUnit.id}
              onChange={(e) => {
                setSelectedUnitId(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full sm:w-auto bg-slate-950 border border-slate-700 text-xs font-bold text-slate-300 rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500 cursor-pointer sm:max-w-[200px] truncate shadow-sm"
              title="Switch curriculum topic"
            >
              {SPANISH_UNITS.map((u, idx) => (
                <option key={u.id} value={u.id}>
                  {idx + 1}. {u.level} - {u.subtitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Bar for the Unit */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isReviewQueueActive
                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
            }`}
            style={{
              width: `${
                isReviewQueueActive
                  ? Math.round(((missedQueue.length - reviewQueueIndex) / missedQueue.length) * 100)
                  : Math.round(((currentIndex + 1) / items.length) * 100)
              }%`
            }}
          />
        </div>
      </div>

      {/* Review Queue Banner if in Review Mode */}
      {isReviewQueueActive && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <strong className="text-white block font-bold">End-of-Topic Reinforcement Round</strong>
              <span>
                Master the phrases you struggled with earlier ({missedQueue.length} remaining) to complete this topic and unlock the next unit!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Target Card */}
      <div className="mobile-speaking-card relative rounded-[30px] sm:rounded-3xl bg-slate-900/95 border border-slate-800 p-4 sm:p-10 shadow-2xl space-y-5 sm:space-y-6 overflow-hidden">
        {/* Subtle Cognitive Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges: Honesty Guarantee & Cinema Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] sm:text-[11px] font-bold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Real voice check · 75% to pass</span>
          </div>

          {/* Cinema & Pop Culture Reference */}
          {currentItem.filmReference && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold shadow-sm">
              <Film className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentItem.filmReference}</span>
            </div>
          )}
        </div>

        {/* Target Phrase Typography */}
        <div className="text-center space-y-3">
          <h1 className="text-[30px] sm:text-5xl font-black text-white tracking-tight leading-tight break-words">
            {currentItem.spanish}
          </h1>

          {/* Phonetic Syllable Stress Breakdown */}
          {showPhoneticBreakdown && (
            <div className="inline-flex max-w-full items-center gap-2 bg-slate-950 px-3 sm:px-4 py-2 rounded-2xl border border-slate-800 font-mono text-[12px] sm:text-base text-amber-300 font-bold overflow-x-auto">
              <span>{currentItem.phonetic}</span>
            </div>
          )}

          <p className="text-base sm:text-lg text-slate-300 font-medium">
            "{currentItem.english}"
          </p>

          {/* Creative Mnemonic Memory Anchor */}
          {currentItem.mnemonic && (
            <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left flex items-start gap-3 mt-3 shadow-md">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-300 block tracking-wider">
                  Creative Mnemonic Memory Anchor:
                </span>
                <p className="text-xs text-slate-200 mt-0.5 font-medium leading-relaxed">
                  {currentItem.mnemonic}
                </p>
              </div>
            </div>
          )}

          {/* Cultural & Real-World Usage */}
          {currentItem.culturalContext && (
            <div className="max-w-xl mx-auto p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-left flex items-start gap-2.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Context:</strong> {currentItem.culturalContext}
              </p>
            </div>
          )}
        </div>

        {/* Audio Listen Buttons */}
        <div className="grid w-full grid-cols-2 items-center justify-center gap-2 sm:flex sm:w-auto sm:gap-3">
          <button
            onClick={() => playNativeAudio(stats.speechRate)}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-3 rounded-2xl font-bold text-[11px] sm:text-sm transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-cyan-500 text-slate-950 scale-105 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-md'
            }`}
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Listen Native (1.0x)</span>
          </button>

          <button
            onClick={() => playNativeAudio(0.72)}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] sm:text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Turtle className="w-4 h-4 text-emerald-400" />
            <span>Slow Syllables (0.75x)</span>
          </button>
        </div>

        {/* Central Strict Microphone Studio Action */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-2">
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute -inset-3 rounded-full bg-cyan-500/30 animate-ping pointer-events-none" />
                <div className="absolute -inset-6 rounded-full bg-cyan-500/15 animate-pulse pointer-events-none" />
              </>
            )}

            <button
              onClick={isEvaluating ? undefined : (isListening ? stopListening : startListening)}
              disabled={isEvaluating}
              className={`mobile-mic-button relative z-10 w-28 h-28 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center font-black transition-all shadow-xl ${
                isListening
                  ? 'bg-rose-600 text-white scale-110 shadow-rose-600/40 animate-pulse'
                  : isEvaluating
                    ? 'bg-indigo-500 text-white shadow-indigo-500/30 cursor-wait'
                  : 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-cyan-500/30 hover:scale-105'
              }`}
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="text-[10px] uppercase font-black mt-1">CHECKING</span>
                </>
              ) : isListening ? (
                <>
                  <MicOff className="w-8 h-8" />
                  <span className="text-[10px] uppercase font-black mt-1">STOP</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8" />
                  <span className="text-[10px] uppercase font-black mt-1">SPEAK</span>
                </>
              )}
            </button>
          </div>

          {/* Real Live Volume Meter */}
          {isListening && (
            <div className="flex flex-col items-center space-y-1.5 animate-in fade-in">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Microphone Activity:
              </span>
              <div className="w-64 max-w-[76vw] h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-75 rounded-full"
                  style={{ width: `${Math.max(10, liveVolume)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 font-semibold">
                {liveVolume > 15 ? '🗣️ Voice detected! Speaking Spanish...' : 'Speak into your microphone now...'}
              </p>
            </div>
          )}

          {isEvaluating && (
            <p className="text-xs font-semibold text-indigo-300 animate-pulse">
              Checking the recording and what the browser heard…
            </p>
          )}

          {/* Acoustic Mode notice */}
          {isAcousticModeActive && isListening && (
            <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-xs font-bold text-cyan-300 flex items-center gap-2 max-w-md animate-pulse">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Local Acoustic Mode Active — Speak clearly, then tap STOP to evaluate.
              </span>
            </div>
          )}

          {/* Real Interim Transcript */}
          {interimTranscript && (
            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs sm:text-sm font-semibold text-slate-200">
              Recognized: <span className="text-cyan-400 font-mono font-bold">"{interimTranscript}"</span>
            </div>
          )}

          {errorMessage && !isAcousticEvaluation && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-start gap-2 max-w-md">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* TRANSCRIBING VIA AI SPINNER */}
        {isTranscribingAI && (
          <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center gap-3 animate-pulse">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="text-xs font-bold text-cyan-300">
              Transcribing audio via Free AI Whisper model...
            </span>
          </div>
        )}

        {/* LOCAL ACOUSTIC COMPARISON STUDIO */}
        {isAcousticEvaluation && recordedAudioUrl && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border-2 border-cyan-500/40 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Headphones className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>Voice Recording Captured!</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      Local Acoustic Mode
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Your microphone captured your pronunciation. Compare it directly with the native speaker below:
                  </p>
                  {recordingBytes !== null && (
                    <p className="mt-1 text-[11px] font-semibold text-cyan-300">
                      Recording saved: {Math.max(1, Math.round(recordingBytes / 1024))} KB
                    </p>
                  )}
                  {recordingPeak !== null && (
                    <p className={`mt-1 text-[11px] font-semibold ${recordingPeak > 0.003 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {recordingPeak > 0.003 ? 'Audio signal detected' : 'No clear sound signal detected — check the selected microphone.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Side-by-Side Playback Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Native Spanish Player */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Reference: Native Speaker
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playNativeAudio(1.0)}
                    disabled={isPlayingAudio}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Native (1.0x)</span>
                  </button>
                  <button
                    onClick={() => playNativeAudio(0.75)}
                    disabled={isPlayingAudio}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Turtle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>0.75x</span>
                  </button>
                </div>
              </div>

              {/* User Voice Recording Player */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                  Your Recording: Playback
                </span>
                <button
                  onClick={playRecordedAudio}
                  disabled={isPlayingUserAudio}
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform active:scale-98 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{isPlayingUserAudio ? 'Playing Your Voice...' : 'Listen to Your Recording'}</span>
                </button>
              </div>
            </div>

            {/* Syllable Stress Guide */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Phonetic Syllable Stress Reference:
              </span>
              <p className="font-mono text-amber-400 font-bold text-base mt-1">
                /{currentItem.phonetic}/
              </p>
              {currentItem.pronunciationTip && (
                <p className="text-xs text-slate-300 mt-1">
                  💡 {currentItem.pronunciationTip}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-100">
              Automatic transcription is unavailable, so this recording cannot receive a score or XP yet. You can still listen back, then retry after restoring browser speech-to-text or adding a Whisper key in Settings.
            </div>
            {errorMessage && (
              <p className="text-xs font-semibold text-amber-200">{errorMessage}</p>
            )}

            {/* Retry remains available; there is deliberately no self-mark-as-correct option. */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleAcousticRetry}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Speaking</span>
              </button>

              <span className="text-[11px] font-semibold text-slate-500">A pass requires a real transcript.</span>
            </div>
          </div>
        )}

        {/* Native controls make the captured recording directly playable and expose format errors clearly. */}
        {recordedAudioUrl && (
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Play className="w-4 h-4 fill-cyan-300" />
              <span>Your recorded voice</span>
            </div>
            <audio
              ref={audioPlayerRef}
              controls
              preload="auto"
              src={recordedAudioUrl}
              onEnded={() => setIsPlayingUserAudio(false)}
              onError={() => {
                setIsPlayingUserAudio(false);
                setErrorMessage('The browser could not decode this recording. Please retry after choosing a microphone in Settings.');
              }}
              className="w-full accent-cyan-400"
            >
              Your browser cannot play this recording format.
            </audio>
          </div>
        )}

        {/* DOPAMINE BURST CELEBRATION OVERLAY */}
        {showDopamineCelebration && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border-2 border-emerald-400/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-xl shadow-emerald-500/20 animate-bounce">
                <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex flex-col items-center justify-center">
                  <Flame className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-black text-amber-400 font-mono">+{celebrationXP}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">¡Sensacional! Synapse Consolidated</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    +{celebrationXP} XP
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your neural pronunciation pathway has been reinforced!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {stats.autoAdvance && autoAdvanceSeconds !== null && (
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/30 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>Next in {autoAdvanceSeconds}s</span>
                </div>
              )}
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* RIGOROUS EVALUATION SCORECARD */}
        {scoreResult && (
          <div
            className={`p-6 rounded-3xl border transition-all space-y-4 ${
              scoreResult.score >= 75
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black border shadow-lg ${
                    scoreResult.score >= 75
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {scoreResult.score}%
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {scoreResult.score >= 75 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>Genuine Pronunciation Pass!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-rose-400" />
                        <span>Pronunciation Needs Tuning</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {scoreResult.feedbackText}
                  </p>
                </div>
              </div>

              {/* What was heard vs expected */}
              {scoreResult.rawTranscript && (
                <div className="text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">What was heard:</span>
                  <span className="font-mono font-bold text-amber-300">"{scoreResult.rawTranscript}"</span>
                </div>
              )}
            </div>

            {/* Word by word breakdown */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Target Word Alignment:</span>
              <div className="flex flex-wrap gap-2">
                {scoreResult.wordMatches.map((w, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      w.match
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {w.match ? '✓ ' : '✗ '}
                    {w.expected}
                  </span>
                ))}
              </div>
            </div>

            {/* Smart review queue notification when failing */}
            {scoreResult.score < 75 && (
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                  <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Queued for end-of-topic review so you keep learning flow!</span>
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Skip to Next Phrase</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Side-by-side Audio Comparison */}
            {recordedAudioUrl && (
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400">Audio Comparison:</span>
                <button
                  onClick={() => playNativeAudio(stats.speechRate)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Native Model</span>
                </button>
                <button
                  onClick={playRecordedAudio}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-xs font-bold text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-400" />
                  <span>Play My Recording</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {!isReviewQueueActive && (
              <button
                onClick={handleSkipToReview}
                title="Skip phrase for now and master it in the end-of-topic review queue"
                className="px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
              >
                <span>Skip to Review</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>{isReviewQueueActive ? 'Next Review Phrase' : 'Next Phrase'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* UNIT MASTERED CELEBRATION MODAL */}
      {showUnitMasteredCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-lg w-full bg-[#0B0F17] border-2 border-cyan-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-emerald-400 p-0.5 shadow-2xl shadow-cyan-500/30 animate-bounce">
              <div className="w-full h-full bg-[#0B0F17] rounded-[22px] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-cyan-400" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {currentUnit.level} Mastery Achieved
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                ¡Enhorabuena! Topic Complete!
              </h2>
              <p className="text-sm text-slate-300">
                You have successfully mastered all phrases in <strong>{currentUnit.title}</strong>, including reinforcement review items!
              </p>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-2 gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Mastery XP</span>
                <p className="text-xl font-black text-amber-400 mt-0.5 font-mono">+100 XP</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Next Topic</span>
                <p className="text-sm font-bold text-cyan-300 mt-1 truncate">
                  {safeUnitIndex < SPANISH_UNITS.length - 1
                    ? SPANISH_UNITS[safeUnitIndex + 1].subtitle
                    : 'Curriculum Mastered!'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  playClickSound(stats.soundEnabled);
                  setShowUnitMasteredCelebration(false);
                  setActiveTab('roadmap');
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                Return to Synapse Map
              </button>

              <button
                onClick={() => {
                  playClickSound(stats.soundEnabled);
                  advanceToNextUnit();
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>Advance to Next Topic</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
