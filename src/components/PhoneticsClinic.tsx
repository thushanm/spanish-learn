import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TRICKY_SOUNDS } from '../data/phonetics';
import { TrickySound, SpanishWordPhrase } from '../types';
import { speakSpanish, evaluateSpanishPronunciation } from '../utils/speech';
import { speechService, SpeechResultPayload } from '../utils/speechRecognitionService';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playMicStartSound,
  playMicStopSound
} from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Zap
} from 'lucide-react';

export const PhoneticsClinic: React.FC = () => {
  const { stats, addXP } = useApp();

  const [selectedSoundId, setSelectedSoundId] = useState<string>(TRICKY_SOUNDS[0].id);
  const currentSound: TrickySound =
    TRICKY_SOUNDS.find(s => s.id === selectedSoundId) || TRICKY_SOUNDS[0];

  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const challenge = currentSound.challengeWords[activeChallengeIdx] || currentSound.challengeWords[0];

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [challengeScore, setChallengeScore] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    speechService.onTranscriptChange = (payload: SpeechResultPayload) => {
      setInterimTranscript(payload.transcript);
      if (payload.isFinal && challenge) {
        handleChallengeEval(payload.transcript);
      }
    };

    speechService.onError = () => {
      setIsListening(false);
      playMicStopSound(stats.soundEnabled);
    };

    speechService.onEnd = () => {
      setIsListening(false);
    };

    return () => {
      speechService.stop();
    };
  }, [selectedSoundId, activeChallengeIdx, challenge, stats.preferredAccent, stats.soundEnabled]);

  const handleChallengeEval = (transcript: string) => {
    setIsListening(false);
    playMicStopSound(stats.soundEnabled);

    const evalResult = evaluateSpanishPronunciation(challenge.spanish, transcript);
    setChallengeScore(evalResult.score);

    if (evalResult.score >= 70) {
      playCorrectSound(stats.soundEnabled);
      addXP(30);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } else {
      playIncorrectSound(stats.soundEnabled);
    }
  };

  const startListening = async () => {
    playClickSound(stats.soundEnabled);
    setInterimTranscript('');
    setChallengeScore(null);
    const started = await speechService.start(stats.preferredAccent);
    if (started) {
      setIsListening(true);
      playMicStartSound(stats.soundEnabled);
    } else {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    speechService.stop();
    setIsListening(false);
    playMicStopSound(stats.soundEnabled);
  };

  const playWordAudio = (word: string) => {
    playClickSound(stats.soundEnabled);
    speakSpanish(word, {
      rate: stats.speechRate,
      preferredAccent: stats.preferredAccent
    });
  };

  return (
    <div className="mobile-page max-w-4xl mx-auto px-4 py-5 sm:py-8 space-y-5 sm:space-y-8">
      {/* Clinic Header Banner */}
      <div className="rounded-[28px] sm:rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 p-5 sm:p-8 space-y-3 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Key Spanish Sounds Gym</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Spanish Pronunciation Clinic
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Master the distinct phonemes of native Spanish: vibrant trilled RR, throat J, nasal Ñ, and soft B/V.
        </p>
      </div>

      {/* Sound Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TRICKY_SOUNDS.map(sound => {
          const isSelected = sound.id === selectedSoundId;
          return (
            <button
              key={sound.id}
              onClick={() => {
                playClickSound(stats.soundEnabled);
                setSelectedSoundId(sound.id);
                setActiveChallengeIdx(0);
                setChallengeScore(null);
                setInterimTranscript('');
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30 scale-102'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <span className="text-2xl font-black font-mono">{sound.symbol}</span>
              <span className="text-xs font-bold mt-2 truncate">{sound.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sound Guide & Anatomy Details */}
      <div className="rounded-[28px] sm:rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xl">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Phoneme: {currentSound.symbol}
          </span>
          <h2 className="text-2xl font-bold text-white mt-2">{currentSound.name}</h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {currentSound.description}
          </p>
        </div>

        {/* Step by step vocal instruction */}
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Anatomical Technique & Tongue Placement:</span>
          </h3>
          <ul className="space-y-2">
            {currentSound.howToProduce.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Audio Examples Pills */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Listen and repeat these model words:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentSound.audioExamples.map((ex, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{ex.spanish}</span>
                    <span className="text-xs text-amber-300 font-mono">[{ex.phonetic}]</span>
                  </div>
                  <span className="text-xs text-slate-400">{ex.english}</span>
                </div>

                <button
                  onClick={() => playWordAudio(ex.spanish)}
                  className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 transition-transform hover:scale-105"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Tongue Twister / Sentence Challenge with Mic */}
        {challenge && (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Fluency Challenge & Tongue Twister:</span>
              </span>
              <span className="text-xs text-slate-400">Level {challenge.level}</span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-purple-500/30 text-center space-y-3">
              <p className="text-xl sm:text-2xl font-black text-white">
                "{challenge.spanish}"
              </p>
              <p className="text-xs font-mono text-amber-300">{challenge.phonetic}</p>
              <p className="text-xs text-slate-400 italic">"{challenge.english}"</p>

              {/* Action buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => playWordAudio(challenge.spanish)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>Listen to Model</span>
                </button>

                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/40'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 hover:scale-105'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop Microphone</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Test My Pronunciation (+30 XP)</span>
                    </>
                  )}
                </button>
              </div>

              {interimTranscript && (
                <div className="pt-2 text-xs text-slate-300">
                  Heard: <strong className="text-purple-300 font-mono">"{interimTranscript}"</strong>
                </div>
              )}

              {challengeScore !== null && (
                <div
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${
                    challengeScore >= 70
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {challengeScore >= 70 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Magnificent! Score: {challengeScore}%. Sound mastered accurately.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>Score: {challengeScore}%. Keep practicing the tongue position.</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
