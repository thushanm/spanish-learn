import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DIALOGUE_SCENARIOS } from '../data/dialogues';
import { DialogueScenario, DialogueLine } from '../types';
import { speakSpanish, stopSpeaking, evaluateSpanishPronunciation } from '../utils/speech';
import { speechService, SpeechResultPayload } from '../utils/speechRecognitionService';
import { freeAIService } from '../utils/freeAIProvider';
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playLevelCompleteFanfare,
  playMicStartSound,
  playMicStopSound
} from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Award,
  ChevronRight
} from 'lucide-react';

export const DialogueRoleplay: React.FC = () => {
  const { stats, completeDialogue } = useApp();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DIALOGUE_SCENARIOS[0].id);
  const scenario: DialogueScenario =
    DIALOGUE_SCENARIOS.find(s => s.id === selectedScenarioId) || DIALOGUE_SCENARIOS[0];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const recognitionRef = useRef<any>(null);

  const currentLine: DialogueLine | undefined = scenario.lines[currentLineIndex];

  // Hook SpeechRecognitionService
  useEffect(() => {
    speechService.onTranscriptChange = async (payload: SpeechResultPayload) => {
      setInterimTranscript(payload.transcript);
      if (payload.isFinal && currentLine && currentLine.speaker === 'user') {
        let text = payload.transcript?.trim() || '';
        if (!text && payload.audioBlob && freeAIService.hasGroqKey()) {
          try {
            const aiTrans = await freeAIService.transcribeAudio(payload.audioBlob);
            if (aiTrans) text = aiTrans.trim();
          } catch (e) {}
        }
        if (text) {
          handleUserSpokenLine(text);
        }
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
      stopSpeaking();
    };
  }, [currentLineIndex, selectedScenarioId, currentLine, stats.preferredAccent, stats.soundEnabled]);

  // When scenario changes or step reaches an agent line, play agent audio
  useEffect(() => {
    setLastScore(null);
    setInterimTranscript('');
    setShowHint(false);

    if (currentLine && currentLine.speaker === 'agent') {
      const timer = setTimeout(() => {
        speakSpanish(currentLine.spanish, {
          rate: stats.speechRate,
          preferredAccent: stats.preferredAccent
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, selectedScenarioId]);

  const handleUserSpokenLine = (transcript: string) => {
    setIsListening(false);
    playMicStopSound(stats.soundEnabled);

    if (!currentLine) return;

    const evalResult = evaluateSpanishPronunciation(currentLine.spanish, transcript);
    setLastScore(evalResult.score);

    if (evalResult.score >= 55) {
      playCorrectSound(stats.soundEnabled);

      setTimeout(() => {
        if (currentLineIndex < scenario.lines.length - 1) {
          setCurrentLineIndex(prev => prev + 1);
        } else {
          // Completed the entire dialogue!
          setIsCompleted(true);
          completeDialogue(scenario.id);
          playLevelCompleteFanfare(stats.soundEnabled);
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }, 1200);
    } else {
      playIncorrectSound(stats.soundEnabled);
    }
  };

  const startListening = async () => {
    playClickSound(stats.soundEnabled);
    setInterimTranscript('');
    setLastScore(null);
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

  const advanceAgentLine = () => {
    playClickSound(stats.soundEnabled);
    if (currentLineIndex < scenario.lines.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    }
  };

  const restartDialogue = () => {
    playClickSound(stats.soundEnabled);
    setCurrentLineIndex(0);
    setIsCompleted(false);
    setLastScore(null);
    setInterimTranscript('');
  };

  return (
    <div className="mobile-page max-w-4xl mx-auto px-4 py-5 sm:py-8 space-y-4 sm:space-y-6">
      {/* Scenario Selection Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 sm:p-5 rounded-[28px] sm:rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{scenario.partnerAvatar}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Nivel {scenario.level}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">{scenario.title}</h2>
          <p className="text-xs text-slate-400">{scenario.partnerName} • {scenario.partnerRole}</p>
        </div>

        {/* Scenario Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedScenarioId}
            onChange={(e) => {
              setSelectedScenarioId(e.target.value);
              setCurrentLineIndex(0);
              setIsCompleted(false);
            }}
            className="w-full sm:w-auto bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl px-3 py-3 outline-none focus:border-indigo-500"
          >
            {DIALOGUE_SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>
                {s.partnerAvatar} {s.title} ({s.level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Context Setting Alert */}
      <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
        <span><strong>Situation:</strong> {scenario.context}</span>
      </div>

      {/* Conversational Chat Thread */}
      <div className="rounded-[28px] sm:rounded-3xl bg-slate-900/95 border border-slate-800 p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4">
          {scenario.lines.slice(0, currentLineIndex + 1).map((line, idx) => {
            const isAgent = line.speaker === 'agent';
            const isCurrent = idx === currentLineIndex;

            return (
              <div
                key={line.id}
                className={`flex gap-3 items-end transition-all duration-300 ${
                  isAgent ? 'justify-start' : 'justify-end'
                }`}
              >
                {isAgent && (
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0 shadow-md">
                    {scenario.partnerAvatar}
                  </div>
                )}

                <div
                    className={`max-w-[82%] sm:max-w-lg p-3.5 sm:p-4 rounded-2xl space-y-1.5 transition-all shadow-md ${
                    isAgent
                      ? 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                      : 'bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-br-none shadow-rose-600/20'
                  } ${isCurrent ? 'ring-2 ring-indigo-500/50' : 'opacity-90'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                      {isAgent ? scenario.partnerName : 'You (Speak)'}
                    </span>
                    {isAgent && (
                      <button
                        onClick={() =>
                          speakSpanish(line.spanish, {
                            rate: stats.speechRate,
                            preferredAccent: stats.preferredAccent
                          })
                        }
                        title="Replay Spanish audio"
                        className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-semibold leading-relaxed">
                    {line.spanish}
                  </p>

                  <p className="text-xs text-slate-300 font-medium italic">
                    "{line.english}"
                  </p>
                </div>

                {!isAgent && (
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold shrink-0">
                    🎙️
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Interactive Response Section */}
        {currentLine && !isCompleted && (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            {currentLine.speaker === 'user' ? (
              <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-4 h-4" />
                    <span>Your turn to speak:</span>
                  </span>

                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide hint' : 'Phonetic hint?'}</span>
                  </button>
                </div>

                {/* Target line to speak */}
                <div className="text-center space-y-2">
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {currentLine.spanish}
                  </p>
                  {showHint && (
                    <p className="text-xs text-amber-300 font-mono bg-amber-500/10 py-1 px-3 rounded-xl inline-block border border-amber-500/20">
                      {currentLine.phonetic}
                    </p>
                  )}
                </div>

                {/* Microphone Speaking Action Button */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all duration-300 shadow-xl ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/50'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:scale-105 shadow-rose-500/30'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        <span>Listening... Speak your sentence now</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span>Tap Microphone & Speak</span>
                      </>
                    )}
                  </button>

                  {interimTranscript && (
                    <p className="text-xs text-slate-300">
                      Heard: <strong className="text-rose-400 font-mono">"{interimTranscript}"</strong>
                    </p>
                  )}

                  {lastScore !== null && (
                    <div
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                        lastScore >= 55
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {lastScore >= 55
                        ? `Excellent! Accuracy: ${lastScore}%. Advancing...`
                        : `Accuracy: ${lastScore}%. Try pronouncing more clearly.`}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Agent Line Navigation Helper
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {scenario.partnerName} finished speaking.
                </span>
                <button
                  onClick={advanceAgentLine}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center gap-1.5 transition-all hover:translate-x-0.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scenario Completed Celebration Screen */}
        {isCompleted && (
          <div className="text-center py-8 space-y-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30 p-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto text-emerald-400">
              🎉
            </div>
            <h3 className="text-2xl font-black text-white">Conversation Completed Successfully!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              You held a fluent Spanish conversation with <strong>{scenario.partnerName}</strong>. Your spoken skills are progressing fast!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
              <Award className="w-4 h-4" />
              <span>+60 XP Earned for your streak</span>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={restartDialogue}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repeat Scenario</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
