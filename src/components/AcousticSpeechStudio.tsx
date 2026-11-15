import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { CartoonMascot } from './CartoonMascot';
import { soundEffects, shoutCartoonCheer } from '../utils/useSoundEffects';

const ROYAL_PRAISE_LINES = [
  { title: '¡Corona de Oro! 👑', desc: '¡Pronunciación digna de la realeza española!', emoji: '👸' },
  { title: '¡Magnífico y Sublime! ✨', desc: 'Tu acento y entonación brillan como una joya.', emoji: '💎' },
  { title: '¡Pura Gracia Real! 🌹', desc: 'Dominas la cadencia nativa con elegancia total.', emoji: '🌟' },
  { title: '¡Triunfo Majestuoso! 🏆', desc: 'Tu cerebro acaba de forjar una sinapsis de oro puro.', emoji: '👑' }
];

export const AcousticSpeechStudio: React.FC = () => {
  const {
    stats,
    selectedUnitId,
    setSelectedUnitId,
    setActiveTab,
    recordPracticeResult,
    removeMistakeWord,
    updateSettings,
    triggerGameAction,
    consecutiveMistakes
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
  const [royalPraise, setRoyalPraise] = useState(ROYAL_PRAISE_LINES[0]);

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
    setRoyalPraise(ROYAL_PRAISE_LINES[Math.floor(Math.random() * ROYAL_PRAISE_LINES.length)]);
    setShowDopamineCelebration(true);

    // Double confetti cannons with royal colors
    confetti({
      particleCount: 65,
      spread: 65,
      colors: ['#F59E0B', '#EC4899', '#38BDF8', '#10B981'],
      origin: { x: 0.25, y: 0.65 }
    });
    confetti({
      particleCount: 65,
      spread: 65,
      colors: ['#F59E0B', '#EC4899', '#38BDF8', '#10B981'],
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

      // 1. If Groq Whisper is configured or if browser transcript is empty / offline,
      // transcribe the recorded audio directly via Groq Whisper for 100% accuracy.
      let transcript = (result.transcript || '').trim();

      if ((!transcript || freeAIService.hasGroqKey() || result.isOfflineAcoustic) && result.audioBlob && result.audioBlob.size > 200) {
        if (freeAIService.hasGroqKey()) {
          setIsTranscribingAI(true);
          try {
            const aiTrans = await freeAIService.transcribeAudio(result.audioBlob);
            if (aiTrans && aiTrans.trim()) {
              transcript = aiTrans.trim();
              result.transcript = transcript;
              result.error = undefined;
              result.isOfflineAcoustic = false;
            }
          } catch (e) {
            console.warn('Groq Whisper transcription attempt failed:', e);
          } finally {
            setIsTranscribingAI(false);
          }
        }
      }

      // If we now have a valid transcript (from Groq Whisper or Web Speech API)
      if (transcript) {
        const evalResult = evaluateSpanishPronunciation(currentItem.spanish, transcript);
        setScoreResult(evalResult);

        if (evalResult.score >= 75) {
          handleItemSuccess(evalResult.score);
        } else {
          handleItemMistake(evalResult);
        }
        return;
      }

      // If in offline acoustic mode and no transcript was produced
      if (result.isOfflineAcoustic) {
        setIsAcousticEvaluation(true);
        setErrorMessage(
          freeAIService.hasGroqKey()
            ? 'Audio recorded, but could not transcribe clear Spanish speech. Please try speaking closer to your mic.'
            : (result.transcriptionUnavailableReason || 'Your voice was recorded. Add a free Groq API key in Settings to enable instant AI speech scoring!')
        );
        return;
      }

      // Voice-detection check error (true silence / zero mic input)
      if (result.error && !transcript) {
        setErrorMessage(result.error);
        playIncorrectSound(stats.soundEnabled);
        recordPracticeResult(currentUnit.id, 0, currentItem);

        // Queue to missed items for smart repetition
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

      // Fallback evaluation
      const evalResult = evaluateSpanishPronunciation(currentItem.spanish, transcript);
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
    triggerGameAction('correct');
    shoutCartoonCheer(stats.soundEnabled);
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
    triggerGameAction('wrong');
    if (consecutiveMistakes >= 1) {
      soundEffects.playSadTrombone();
    } else {
      soundEffects.playCartoonWhistleDown();
    }
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
      {/* Expressive Cartoon Mascot responding to your voice practice */}
      <CartoonMascot compact />

      {/* Top Navigation & Context Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => {
            playClickSound(stats.soundEnabled);
            setActiveTab('roadmap');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sky-500 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to Today</span>
          <span className="sm:hidden">Today</span>
        </button>

        {/* Real-time stats badge */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => updateSettings({ autoAdvance: !stats.autoAdvance })}
            className={`px-3 py-2 rounded-2xl border-2 font-black flex items-center gap-1.5 transition-colors cursor-pointer ${
              stats.autoAdvance
                ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="Automatically advance to the next phrase and next topic upon successful pronunciation"
          >
            <Zap className={`w-3.5 h-3.5 ${stats.autoAdvance ? 'text-amber-500 fill-amber-500' : ''}`} />
            <span className="hidden sm:inline">Auto-Flow: {stats.autoAdvance ? 'ON' : 'OFF'}</span>
            <span className="sm:hidden">Auto</span>
          </button>
        </div>
      </div>

      {/* Unit Context & Auto-Progression Status Header */}
      <div className="bg-white/95 p-4 sm:p-5 rounded-[32px] border-4 border-white shadow-[0_12px_0_rgba(0,0,0,0.08)] space-y-3 text-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border-2 border-sky-300">
                {currentUnit.level} • Topic {safeUnitIndex + 1} of {SPANISH_UNITS.length}
              </span>

              {isReviewQueueActive ? (
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border-2 border-amber-300 flex items-center gap-1 animate-pulse">
                  <RotateCcw className="w-3 h-3" />
                  <span>Review Queue ({reviewQueueIndex + 1} of {missedQueue.length})</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500">
                  Phrase {currentIndex + 1} of {items.length}
                </span>
              )}

              {missedQueue.length > 0 && !isReviewQueueActive && (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                  {missedQueue.length} queued for end-review
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
              {currentUnit.title} <span className="hidden sm:inline text-slate-500 font-bold">— {currentUnit.subtitle}</span>
            </h2>
          </div>

          {/* Quick Jump Dropdown */}
          <div className="w-full sm:w-auto shrink-0">
            <select
              value={currentUnit.id}
              onChange={(e) => {
                setSelectedUnitId(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full sm:w-auto bg-slate-50 border-2 border-slate-200 text-xs font-black text-slate-800 rounded-2xl px-3 py-2 outline-none focus:border-sky-400 cursor-pointer sm:max-w-[200px] truncate shadow-sm"
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
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden border border-slate-300 p-0.5">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isReviewQueueActive
                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                : 'bg-gradient-to-r from-sky-400 to-emerald-400'
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
        <div className="p-4 rounded-3xl bg-amber-100 border-3 border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-amber-600 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <strong className="text-amber-950 block font-black text-sm">End-of-Topic Reinforcement Round</strong>
              <span className="font-bold">
                Master the phrases you struggled with earlier ({missedQueue.length} remaining) to complete this topic!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Target Card */}
      <div className="mobile-speaking-card relative rounded-[32px] border-4 border-white bg-white/95 p-5 sm:p-10 shadow-[0_12px_0_rgba(0,0,0,0.08)] space-y-5 sm:space-y-6 overflow-hidden text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-[10px] sm:text-[11px] font-black text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Voice Challenge · 75% to pass</span>
          </div>

          {currentItem.filmReference && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-800 text-xs font-black shadow-sm">
              <Film className="w-3.5 h-3.5 text-rose-600" />
              <span>{currentItem.filmReference}</span>
            </div>
          )}
        </div>

        {/* Target Phrase Typography */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight break-words">
            {currentItem.spanish}
          </h1>

          {/* Phonetic Syllable Stress Breakdown */}
          {showPhoneticBreakdown && (
            <div className="inline-flex max-w-full items-center gap-2 bg-amber-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 border-amber-200 font-mono text-xs sm:text-base text-amber-800 font-black overflow-x-auto">
              <span>{currentItem.phonetic}</span>
            </div>
          )}

          <p className="text-base sm:text-xl text-slate-600 font-black">
            "{currentItem.english}"
          </p>

          {/* Creative Mnemonic Memory Anchor */}
          {currentItem.mnemonic && (
            <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-purple-50 border-2 border-purple-200 text-left flex items-start gap-3 mt-3 shadow-sm">
              <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-black text-purple-800 block tracking-wider">
                  Mnemonic Memory Anchor:
                </span>
                <p className="text-xs text-slate-700 mt-0.5 font-bold leading-relaxed">
                  {currentItem.mnemonic}
                </p>
              </div>
            </div>
          )}
        </div>

          {/* Cultural & Real-World Usage */}
          {currentItem.culturalContext && (
            <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-left flex items-start gap-2.5 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed font-bold">
                <strong className="text-slate-900 font-black">Context:</strong> {currentItem.culturalContext}
              </p>
            </div>
          )}

        {/* Audio Listen Buttons */}
        <div className="grid w-full grid-cols-2 items-center justify-center gap-2 sm:flex sm:w-auto sm:gap-3">
          <button
            onClick={() => playNativeAudio(stats.speechRate)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer shadow-sm ${
              isPlayingAudio
                ? 'bg-sky-400 border-sky-600 text-white scale-105'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
            }`}
          >
            <Volume2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="truncate">Native (1.0x)</span>
          </button>

          <button
            onClick={() => playNativeAudio(0.72)}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border-2 border-slate-200 transition-colors cursor-pointer shadow-sm"
          >
            <Turtle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Slow (0.75x)</span>
          </button>
        </div>

        {/* Central Strict Microphone Studio Action */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-2">
          <div className="relative">
            {isListening && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.25, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                  className="absolute -inset-4 rounded-full bg-rose-400/35 pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1, 1.25, 1.5], opacity: [0.7, 0.35, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.45, ease: 'easeOut' }}
                  className="absolute -inset-8 rounded-full bg-amber-400/25 pointer-events-none"
                />
              </>
            )}

            <button
              onClick={isEvaluating ? undefined : (isListening ? stopListening : startListening)}
              disabled={isEvaluating}
              className={`mobile-mic-button relative z-10 w-28 h-28 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center font-black transition-all shadow-xl cursor-pointer ${
                isListening
                  ? 'border-b-[6px] border-[#EA2B2B] bg-[#FF4B4B] text-white scale-105 shadow-rose-500/40 animate-pulse active:translate-y-1.5 active:border-b-0'
                  : isEvaluating
                  ? 'border-b-[6px] border-purple-700 bg-purple-500 text-white cursor-wait'
                  : 'border-b-[6px] border-[#46A302] bg-[#58CC02] text-white shadow-emerald-500/40 hover:scale-105 active:translate-y-1.5 active:border-b-0'
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
                  <Mic className="w-8 h-8 stroke-[2.5]" />
                  <span className="text-[10px] uppercase font-black mt-1">SPEAK</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Glowing Waveform Oscilloscope */}
          {isListening && (
            <div className="flex flex-col items-center space-y-2 animate-in fade-in pt-1">
              <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Web Audio Waveform Oscilloscope</span>
              </span>

              {/* 20-bar glowing responsive waveform visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-12 px-5 py-2 rounded-2xl bg-slate-950/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                {Array.from({ length: 20 }).map((_, barIdx) => {
                  const waveFactor = Math.sin((barIdx / 20) * Math.PI);
                  const barHeight = Math.max(6, Math.min(42, (liveVolume * 0.45 * waveFactor) + 6));
                  return (
                    <motion.div
                      key={barIdx}
                      animate={{ height: `${barHeight}px` }}
                      transition={{ duration: 0.08, ease: 'easeOut' }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 via-teal-400 to-emerald-400"
                    />
                  );
                })}
              </div>

              <p className="text-xs text-slate-400 font-semibold">
                {liveVolume > 15 ? '🗣️ Voice detected! Speaking Spanish...' : 'Speak clearly into your microphone now...'}
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

        {/* ROYAL PRINCESS DOPAMINE CELEBRATION OVERLAY */}
        {showDopamineCelebration && (
          <div className="animate-princess-pop p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/60 border-2 border-amber-400/50 shadow-2xl animate-royal-glow flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/25 animate-float-gently">
                  <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex flex-col items-center justify-center text-3xl">
                    {royalPraise.emoji}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs shadow-md border-2 border-[#0B0F17] animate-bounce">
                  👑
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">{royalPraise.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    +{celebrationXP} XP Oro Real
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                  {royalPraise.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {stats.autoAdvance && autoAdvanceSeconds !== null && (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle-spin" />
                  <span>Siguiente {autoAdvanceSeconds}s</span>
                </div>
              )}
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>¡Continuar!</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* RIGOROUS EVALUATION SCORECARD WITH ANIMATED RADIAL GAUGE */}
        {scoreResult && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`p-6 rounded-3xl border-3 transition-all space-y-4 shadow-md ${
              scoreResult.score >= 75
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                {/* AAA Animated Circular Radial Progress Gauge */}
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 44 44">
                    {/* Background track circle */}
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      className="text-slate-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Glowing Animated Radial Progress Arc */}
                    <motion.circle
                      cx="22"
                      cy="22"
                      r="18"
                      strokeWidth="4"
                      strokeDasharray={113.1}
                      initial={{ strokeDashoffset: 113.1 }}
                      animate={{
                        strokeDashoffset: 113.1 - (113.1 * (Math.min(100, Math.max(0, scoreResult.score)) / 100))
                      }}
                      transition={{ duration: 1.0, ease: [0.34, 1.56, 0.64, 1] }}
                      strokeLinecap="round"
                      className={
                        scoreResult.score >= 75
                          ? 'text-[#58CC02]'
                          : 'text-[#FF4B4B]'
                      }
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  {/* Gauge Center Percentage */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                      className={`text-lg font-black tracking-tight leading-none ${
                        scoreResult.score >= 75 ? 'text-emerald-900' : 'text-rose-900'
                      }`}
                    >
                      {scoreResult.score}%
                    </motion.span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 mt-0.5">
                      {scoreResult.score >= 75 ? '¡Genial!' : 'Casi'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    {scoreResult.score >= 75 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>¡Pronunciación Aprobada!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                        <span>Buen intento · Vamos a ajustar</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {scoreResult.feedbackText}
                  </p>
                </div>
              </div>

              {/* What was heard vs expected */}
              {scoreResult.rawTranscript && (
                <div className="text-xs bg-white p-3.5 rounded-2xl border-2 border-slate-200 text-slate-800 shadow-sm">
                  <span className="text-slate-400 block text-[10px] uppercase font-black tracking-wider">What was heard:</span>
                  <span className="font-mono font-black text-amber-700 text-sm">"{scoreResult.rawTranscript}"</span>
                </div>
              )}
            </div>

            {/* Word by word breakdown */}
            <div className="pt-2 border-t-2 border-slate-200/80 space-y-2">
              <span className="text-[11px] font-black text-slate-600 uppercase">Target Word Alignment:</span>
              <div className="flex flex-wrap gap-2">
                {scoreResult.wordMatches.map((w, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-xl text-xs font-black border-2 ${
                      w.match
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
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
          </motion.div>
        )}

        {/* Navigation Arrows */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex items-center gap-2">
            {!isReviewQueueActive && (
              <button
                onClick={handleSkipToReview}
                title="Skip phrase for now and master it in the end-of-topic review queue"
                className="px-2.5 sm:px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Skip to Review</span>
                <span className="sm:hidden">Skip</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span className="hidden sm:inline">{isReviewQueueActive ? 'Next Review Phrase' : 'Next Phrase'}</span>
              <span className="sm:hidden">{isReviewQueueActive ? 'Next Review' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* UNIT MASTERED CELEBRATION MODAL */}
      {showUnitMasteredCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-lg w-full max-h-[90dvh] overflow-y-auto bg-[#0B0F17] border-2 border-cyan-500/50 rounded-[28px] sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-center space-y-5 sm:space-y-6">
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
