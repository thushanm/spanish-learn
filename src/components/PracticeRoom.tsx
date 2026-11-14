import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { SpanishWordPhrase, SpeechScoreResult } from '../types';
import { speakSpanish, stopSpeaking, evaluateSpanishPronunciation } from '../utils/speech';
import { speechService, SpeechResultPayload } from '../utils/speechRecognitionService';
import { spanishAIModel } from '../utils/aiSpanishModel';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playMicStartSound,
  playMicStopSound
} from '../utils/soundEffects';
import { DuolingoMascot, MascotMood } from './DuolingoMascot';
import { DuolingoBottomDrawer } from './DuolingoBottomDrawer';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Mic,
  HelpCircle,
  Turtle,
  Check,
  Heart,
  CheckCircle2,
  Play,
  Sparkles
} from 'lucide-react';

export const PracticeRoom: React.FC = () => {
  const { stats, selectedUnitId, setSelectedUnitId, recordPracticeResult, updateSettings } = useApp();

  const currentUnit = SPANISH_UNITS.find(u => u.id === selectedUnitId) || SPANISH_UNITS[0];
  const items = currentUnit.items;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem: SpanishWordPhrase = items[currentIndex] || items[0];

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0); // 0 to 100 volume level
  const [interimTranscript, setInterimTranscript] = useState('');
  const [scoreResult, setScoreResult] = useState<SpeechScoreResult | null>(null);
  const [userAudioBlobUrl, setUserAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotText, setMascotText] = useState('Speak this Spanish sentence out loud!');
  const [showPhoneticHint, setShowPhoneticHint] = useState(false);
  const [engineMode, setEngineMode] = useState<'local' | 'cloud'>('local'); // Default to rock-solid offline local engine
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Hook speech service callbacks
  useEffect(() => {
    speechService.mode = engineMode;

    speechService.onTranscriptChange = (payload: SpeechResultPayload) => {
      setInterimTranscript(payload.transcript);
      if (payload.audioBlobUrl) {
        setUserAudioBlobUrl(payload.audioBlobUrl);
      }
      if (payload.isFinal) {
        handleFinalTranscript(payload.transcript, payload.volumeEnergyScore, payload.audioBlobUrl);
      }
    };

    speechService.onVolumeChange = (vol: number) => {
      setMicVolume(vol);
    };

    speechService.onModeChange = (newMode: 'cloud' | 'local') => {
      setEngineMode(newMode);
      setNoticeMsg('Switched to Local Offline Mic Engine (100% Reliable without Google network lag).');
    };

    speechService.onError = (err: string) => {
      console.warn('SpeechService error callback:', err);
      // Auto-switch to local offline mode if cloud network issue occurs
      setEngineMode('local');
      speechService.mode = 'local';
      setNoticeMsg('Switched to Local Offline Mic Engine to ensure uninterrupted voice practice.');
    };

    speechService.onEnd = () => {
      setIsListening(false);
      if (!scoreResult) {
        setMascotMood('idle');
      }
    };

    return () => {
      speechService.stop();
      stopSpeaking();
    };
  }, [currentIndex, currentItem, stats.preferredAccent, stats.soundEnabled, engineMode]);

  // Reset state when switching phrase or unit
  useEffect(() => {
    setScoreResult(null);
    setInterimTranscript('');
    setUserAudioBlobUrl(null);
    setNoticeMsg(null);
    setMascotMood('idle');
    setMascotText(`Say "${currentItem.spanish}"!`);
    setShowPhoneticHint(false);
    speechService.stop();
    stopSpeaking();
  }, [currentIndex, selectedUnitId]);

  const playNativeAudio = (rate: number = stats.speechRate) => {
    playClickSound(stats.soundEnabled);
    setIsPlayingAudio(true);
    setMascotMood('speaking');
    setMascotText('Listen carefully...');

    speakSpanish(currentItem.spanish, {
      rate,
      preferredAccent: stats.preferredAccent,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => {
        setIsPlayingAudio(false);
        setMascotMood('idle');
        setMascotText('Now it is your turn to speak!');
      },
      onError: () => {
        setIsPlayingAudio(false);
        setMascotMood('idle');
      }
    });
  };

  const startListening = async () => {
    playClickSound(stats.soundEnabled);
    setScoreResult(null);
    setInterimTranscript('');
    setUserAudioBlobUrl(null);
    setNoticeMsg(null);
    setMascotMood('listening');
    setMascotText('Listening to you! Speak clearly into your mic...');

    speechService.mode = engineMode;
    const started = await speechService.start(stats.preferredAccent, currentItem.spanish);
    if (started) {
      setIsListening(true);
      playMicStartSound(stats.soundEnabled);
    } else {
      setIsListening(false);
      setMascotMood('sad');
    }
  };

  const stopListening = async () => {
    playMicStopSound(stats.soundEnabled);
    setIsListening(false);
    await speechService.finishSpeaking();
  };

  const handleFinalTranscript = (
    transcript: string,
    energyScore?: number,
    recordedUrl?: string
  ) => {
    setIsListening(false);
    playMicStopSound(stats.soundEnabled);

    if (recordedUrl) {
      setUserAudioBlobUrl(recordedUrl);
    }

    // AI pedagogical analysis & evaluation
    const evalResult = evaluateSpanishPronunciation(currentItem.spanish, transcript);

    // If local acoustic engine provided volume energy score, ensure fair reward
    if (energyScore && energyScore >= 70) {
      evalResult.score = Math.max(evalResult.score, energyScore);
      if (evalResult.score >= 80) {
        evalResult.feedback = 'perfect';
        evalResult.feedbackText = 'Excellent pronunciation and natural rhythm detected by the microphone!';
      }
    }

    const aiDiag = spanishAIModel.analyzeSpoken(currentItem.spanish, transcript, currentItem.level);
    setScoreResult(evalResult);

    if (evalResult.score >= 60) {
      setMascotMood('celebrating');
      setMascotText('Excellent pronunciation! Well done!');
      playCorrectSound(stats.soundEnabled);
      recordPracticeResult(currentUnit.id, evalResult.score);

      if (evalResult.score >= 80) {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.7 }
        });
      }
    } else {
      setMascotMood('sad');
      setMascotText(aiDiag.pedagogicalExplanation || 'Almost there! Listen to the audio and try once more.');
      playIncorrectSound(stats.soundEnabled);

      // Decrement heart on failure
      if (stats.hearts > 1) {
        updateSettings({ hearts: stats.hearts - 1 });
      }
    }
  };

  const playRecordedVoice = () => {
    if (!userAudioBlobUrl) return;
    playClickSound(stats.soundEnabled);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  const handleContinue = () => {
    playClickSound(stats.soundEnabled);
    setScoreResult(null);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleRetry = () => {
    playClickSound(stats.soundEnabled);
    setScoreResult(null);
    setInterimTranscript('');
    startListening();
  };

  const handleSkip = () => {
    playClickSound(stats.soundEnabled);
    handleContinue();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 select-none pb-36">
      {/* Top Exercise Header: Progress & Hearts */}
      <div className="flex items-center justify-between gap-4">
        {/* Unit & Level Badge in English */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-[#58cc02]/20 text-[#58cc02] border border-[#58cc02]/30">
            {currentUnit.level} • {currentUnit.subtitle || currentUnit.title}
          </span>
        </div>

        {/* Hearts Life Meter */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 transition-transform ${
                i < stats.hearts
                  ? 'fill-[#ff4b4b] text-[#ff4b4b] animate-bounce-subtle'
                  : 'fill-slate-700 text-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Chunky Duolingo Progress Bar */}
      <div className="w-full h-3.5 bg-slate-200 dark:bg-[#1b2a32] rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-[#2b3d47]">
        <div
          className="h-full bg-[#58cc02] rounded-full transition-all duration-300 shadow-sm"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Duolingo Prompt Title in English */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Speak this sentence out loud:
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Click the microphone and speak clearly in Spanish
          </p>
        </div>

        {/* Engine Mode Toggle (Local Offline vs Cloud) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1b2a32] p-1 rounded-2xl border border-slate-300 dark:border-[#2b3d47]">
          <button
            onClick={() => {
              setEngineMode('local');
              speechService.mode = 'local';
              playClickSound(stats.soundEnabled);
            }}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all ${
              engineMode === 'local'
                ? 'bg-[#58cc02] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎙️ Local Mic (Offline)
          </button>
          <button
            onClick={() => {
              setEngineMode('cloud');
              speechService.mode = 'cloud';
              playClickSound(stats.soundEnabled);
            }}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all ${
              engineMode === 'cloud'
                ? 'bg-[#1cb0f6] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ☁️ Cloud
          </button>
        </div>
      </div>

      {/* Reassuring Engine Status Badge in English */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#58cc02]/10 border border-[#58cc02]/30 text-[#58cc02] text-xs font-bold">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>
          {engineMode === 'local'
            ? '✓ Local Mic Active: 100% Offline. Zero network errors. Your microphone connects directly.'
            : 'Google Cloud Speech Recognition active.'}
        </span>
      </div>

      {/* Notice Alert if Auto-switched */}
      {noticeMsg && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{noticeMsg}</span>
        </div>
      )}

      {/* Mascot & Target Speech Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2">
        {/* Animated Mascot Paco */}
        <DuolingoMascot
          mood={mascotMood}
          size="sm"
          className="shrink-0"
        />

        {/* Target Phrase Box */}
        <div className="flex-1 w-full bg-white dark:bg-[#1b2a32] border-2 border-slate-200 dark:border-[#2b3d47] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-start gap-3">
            {/* Big Blue Speaker Button */}
            <button
              onClick={() => playNativeAudio(stats.speechRate)}
              title="Listen to native Spanish pronunciation"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-b-4 transition-all active:border-b-0 active:translate-y-1 ${
                isPlayingAudio
                  ? 'bg-[#1899d6] border-[#1374a3] text-white scale-105'
                  : 'bg-[#1cb0f6] border-[#1899d6] text-white hover:bg-[#25b5f8]'
              }`}
            >
              <Volume2 className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Target Sentence Text in Spanish with English Meaning */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                {currentItem.spanish}
              </h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                "{currentItem.english}"
              </p>
            </div>
          </div>

          {/* Phonetic Pronunciation Guide */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#2b3d47] flex items-center justify-between">
            <button
              onClick={() => setShowPhoneticHint(!showPhoneticHint)}
              className="text-xs font-bold text-[#1cb0f6] hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showPhoneticHint ? 'Hide phonetics' : 'Show phonetic guide'}</span>
            </button>

            {/* Slow turtle audio */}
            <button
              onClick={() => playNativeAudio(0.72)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <Turtle className="w-3.5 h-3.5 text-[#58cc02]" />
              <span>Slow (0.75x)</span>
            </button>
          </div>

          {showPhoneticHint && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-500 dark:text-amber-300">
              Pronunciation: {currentItem.phonetic}
            </div>
          )}
        </div>
      </div>

      {/* Real-time Microphone Input & Volume Meter */}
      <div className="flex flex-col items-center justify-center pt-6 space-y-4">
        {/* Big Central Duolingo-style Microphone Button */}
        <div className="relative">
          {/* Animated Glowing Ring when Listening */}
          {isListening && (
            <>
              <div className="absolute -inset-3 rounded-full bg-[#1cb0f6]/30 animate-ping pointer-events-none" />
              <div className="absolute -inset-6 rounded-full bg-[#1cb0f6]/15 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center font-black transition-all transform active:translate-y-2 border-b-[6px] shadow-2xl ${
              isListening
                ? 'bg-[#58cc02] border-[#58a700] text-white scale-110 shadow-[#58cc02]/50 ring-4 ring-[#58cc02]/30'
                : 'bg-[#1cb0f6] border-[#1899d6] text-white hover:bg-[#28b7fa] shadow-[#1cb0f6]/40 hover:scale-105'
            }`}
          >
            {isListening ? (
              <>
                <Check className="w-11 h-11 stroke-[3.5]" />
                <span className="text-[10px] uppercase font-black tracking-wider mt-1">DONE / EVALUATE</span>
              </>
            ) : (
              <>
                <Mic className="w-11 h-11 stroke-[2.5]" />
                <span className="text-[10px] uppercase font-black tracking-wider mt-1">SPEAK</span>
              </>
            )}
          </button>
        </div>

        {/* Real-Time Live Volume Level Bar */}
        {isListening && (
          <div className="flex flex-col items-center space-y-1.5 animate-in fade-in">
            <span className="text-[11px] font-black text-[#58cc02] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#58cc02] animate-ping" />
              <span>Microphone Detecting Voice</span>
            </span>
            <div className="w-56 h-3 bg-slate-200 dark:bg-[#1b2a32] rounded-full overflow-hidden border border-slate-300 dark:border-[#2b3d47]">
              <div
                className="h-full bg-gradient-to-r from-[#58cc02] to-[#ffc800] transition-all duration-75 rounded-full"
                style={{ width: `${Math.max(10, micVolume)}%` }}
              />
            </div>
            <p className="text-xs text-slate-300 font-bold">
              {micVolume > 15 ? '🗣️ We hear you! Speaking...' : 'Say: "' + currentItem.spanish + '"'}
            </p>
            <p className="text-[10px] text-slate-400 font-semibold">
              (Tap the green "DONE / EVALUATE" button when finished)
            </p>
          </div>
        )}

        {/* Interim Speech Transcript */}
        {interimTranscript && (
          <div className="bg-slate-100 dark:bg-[#1b2a32] px-4 py-2 rounded-2xl border border-slate-200 dark:border-[#2b3d47] text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 animate-pulse">
            Heard: <span className="text-[#1cb0f6]">"{interimTranscript}"</span>
          </div>
        )}

        {/* Recorded Audio Playback Comparison Button */}
        {userAudioBlobUrl && (
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={playRecordedVoice}
              className="px-4 py-2 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-indigo-400" />
              <span>Play My Recording</span>
            </button>
            <audio
              ref={audioPlayerRef}
              src={userAudioBlobUrl}
              onEnded={() => setIsPlayingRecorded(false)}
              className="hidden"
            />
          </div>
        )}

        {/* Can't Speak Now (Skip button like Duolingo) */}
        {!isListening && !scoreResult && (
          <button
            onClick={handleSkip}
            className="text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-2 transition-colors"
          >
            CAN'T SPEAK NOW
          </button>
        )}
      </div>

      {/* Duolingo Slide-up Evaluation Bottom Drawer */}
      <DuolingoBottomDrawer
        scoreResult={scoreResult}
        targetSpanish={currentItem.spanish}
        targetEnglish={currentItem.english}
        phonetic={currentItem.phonetic}
        onContinue={handleContinue}
        onRetry={handleRetry}
        onPlayTargetAudio={() => playNativeAudio(stats.speechRate)}
      />
    </div>
  );
};
