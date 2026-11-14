import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { freeAIService, AIModelProvider, SpanishPedagogicalFeedback } from '../utils/freeAIProvider';
import { strictSpeechService, StrictSpeechResult } from '../utils/speechRecognitionService';
import { speakSpanish, stopSpeaking } from '../utils/speech';
import {
  playClickSound,
  playCorrectSound,
  playMicStartSound,
  playMicStopSound
} from '../utils/soundEffects';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Send,
  RotateCcw,
  Key,
  Brain,
  ShieldCheck,
  Bot,
  Layers,
  ChevronRight,
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user';
  spanish: string;
  english: string;
  phonetic?: string;
  timestamp: string;
  pedagogical?: SpanishPedagogicalFeedback;
}

export const AITutorChat: React.FC = () => {
  const { stats, addXP } = useApp();

  const [providerConfig, setProviderConfig] = useState(freeAIService.getConfig());
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState(providerConfig.groqApiKey || '');
  const [geminiKeyInput, setGeminiKeyInput] = useState(providerConfig.geminiApiKey || '');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'tutor',
      spanish: '¡Hola! Soy tu compañero cognitivo de español con IA. ¿De qué te gustaría hablar hoy?',
      english: 'Hello! I am your AI Spanish cognitive partner. What would you like to speak about today?',
      phonetic: 'OH-lah! soy too kohm-pah-NYEH-roh kohg-nee-TEE-voh...',
      timestamp: 'Now'
    }
  ]);

  const [isListening, setIsListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Hook speech service
  useEffect(() => {
    strictSpeechService.onVolumeChange = (vol: number) => {
      setMicVolume(vol);
    };

    strictSpeechService.onInterimResult = (text: string) => {
      setInterimTranscript(text);
    };

    strictSpeechService.onFinalResult = async (result: StrictSpeechResult) => {
      setIsListening(false);
      let text = result.transcript?.trim() || '';
      if (!text && result.audioBlob && freeAIService.hasGroqKey()) {
        try {
          const aiTrans = await freeAIService.transcribeAudio(result.audioBlob);
          if (aiTrans) text = aiTrans.trim();
        } catch (e) {}
      }
      if (text) {
        handleUserTurn(text);
      } else {
        playMicStopSound(stats.soundEnabled);
      }
    };

    strictSpeechService.onError = () => {
      setIsListening(false);
      playMicStopSound(stats.soundEnabled);
    };

    return () => {
      strictSpeechService.stop();
      stopSpeaking();
    };
  }, [stats.preferredAccent, stats.soundEnabled]);

  const handleUserTurn = async (userText: string) => {
    if (!userText.trim()) return;

    playClickSound(stats.soundEnabled);
    setTextInput('');
    setInterimTranscript('');
    setIsGenerating(true);

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      spanish: userText,
      english: 'Your Spanish phrase',
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      // Analyze with configured AI model (Meta Llama 3, Gemini, or Cortex Local)
      const aiResponse = await freeAIService.analyzeAndRespond(
        userText,
        'Conversational practice with user',
        'A2'
      );

      const tutorReply: ChatMessage = {
        id: 'tut-' + Date.now(),
        sender: 'tutor',
        spanish: aiResponse.suggestedReplyInSpanish,
        english: aiResponse.englishTranslationOfReply,
        timestamp: 'Now',
        pedagogical: aiResponse
      };

      setMessages(prev => [...prev, tutorReply]);
      setIsGenerating(false);

      if (aiResponse.isCorrect) {
        playCorrectSound(stats.soundEnabled);
        addXP(15);
      }

      // Automatically speak AI tutor reply
      speakSpanish(aiResponse.suggestedReplyInSpanish, {
        rate: stats.speechRate,
        preferredAccent: stats.preferredAccent
      });
    } catch (e) {
      console.warn('AI turn error:', e);
      setIsGenerating(false);
    }
  };

  const startListening = async () => {
    playMicStartSound(stats.soundEnabled);
    setIsListening(true);
    setInterimTranscript('');
    await strictSpeechService.start(stats.preferredAccent, 'Spanish conversation');
  };

  const stopListening = () => {
    strictSpeechService.stop();
    setIsListening(false);
    playMicStopSound(stats.soundEnabled);
  };

  const playMessageAudio = (text: string) => {
    playClickSound(stats.soundEnabled);
    speakSpanish(text, {
      rate: stats.speechRate,
      preferredAccent: stats.preferredAccent
    });
  };

  const clearChat = () => {
    playClickSound(stats.soundEnabled);
    setMessages([
      {
        id: 'init-1',
        sender: 'tutor',
        spanish: '¡Nueva conversación! ¿De qué tema te gustaría hablar hoy?',
        english: 'New conversation! What topic would you like to speak about today?',
        timestamp: 'Now'
      }
    ]);
  };

  const saveConfig = (provider: AIModelProvider) => {
    freeAIService.setConfig({
      provider,
      groqApiKey: groqKeyInput.trim(),
      geminiApiKey: geminiKeyInput.trim()
    });
    setProviderConfig(freeAIService.getConfig());
    setShowConfigModal(false);
    playClickSound(stats.soundEnabled);
  };

  return (
    <div className="mobile-page max-w-4xl mx-auto px-4 py-5 sm:py-8 select-none">
      {/* Top Header Card */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">Cortex AI Conversational Partner</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {providerConfig.provider === 'groq-llama3'
                  ? 'Meta Llama 3.3 (Groq)'
                  : providerConfig.provider === 'gemini-flash'
                    ? 'Google Gemini 1.5'
                    : 'Cortex Linguistic Model'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Speak or write in Spanish. The AI model analyzes your syntax, phonetics, and replies naturally.
            </p>
          </div>
        </div>

        {/* Action Controls: Model Switcher & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            title="Configure AI Models (Meta Llama 3 / Google Gemini)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Model Engine</span>
          </button>

          <button
            onClick={clearChat}
            title="Reset conversation"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="bg-[#0B0F17] rounded-[28px] sm:rounded-3xl border border-slate-800/80 p-3 sm:p-6 min-h-[420px] sm:min-h-[460px] max-h-[58dvh] sm:max-h-[520px] overflow-y-auto space-y-4 shadow-2xl">
        {messages.map((msg) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <Brain className="w-5 h-5 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[86%] sm:max-w-lg p-3.5 sm:p-5 rounded-[22px] sm:rounded-3xl space-y-2 shadow-lg transition-all ${
                  isTutor
                    ? 'bg-slate-900/90 border border-slate-800 text-white rounded-tl-none'
                    : 'bg-cyan-600 text-slate-950 font-semibold rounded-tr-none shadow-cyan-600/20'
                }`}
              >
                {/* Spanish Text + Audio Button */}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base sm:text-lg font-bold leading-relaxed">
                    {msg.spanish}
                  </p>
                  {isTutor && (
                    <button
                      onClick={() => playMessageAudio(msg.spanish)}
                      title="Listen in native Spanish"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* English Translation */}
                <p className={`text-xs ${isTutor ? 'text-slate-400' : 'text-slate-900/80'} italic`}>
                  "{msg.english}"
                </p>

                {/* Pedagogical AI Breakdown Badge */}
                {msg.pedagogical && (
                  <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-cyan-400">Cognitive Feedback:</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        msg.pedagogical.score >= 75
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        Score: {msg.pedagogical.score}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      💡 {msg.pedagogical.grammarExplanation}
                    </p>

                    {msg.pedagogical.phoneticSyllableTip && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        🔊 Tip: {msg.pedagogical.phoneticSyllableTip}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* AI Typing / Analyzing Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-cyan-400 font-bold">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Cortex AI is evaluating syntax & preparing reply...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Hub: Voice Microphone & Text Composer */}
      <div className="mt-4 p-3 sm:p-4 rounded-[24px] sm:rounded-3xl bg-[#0B0F17] border border-slate-800/80 shadow-2xl">
        {/* Live Audio / Interim display when recording */}
        {isListening && (
          <div className="mb-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-semibold">
              <Mic className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>Listening to your Spanish... ({interimTranscript || 'Speak clearly into mic'})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-4 rounded-full bg-cyan-400" style={{ height: `${Math.max(8, micVolume * 0.8)}px` }} />
              <span className="w-2 h-6 rounded-full bg-cyan-400" style={{ height: `${Math.max(12, micVolume * 1.2)}px` }} />
              <span className="w-2 h-3 rounded-full bg-cyan-400" style={{ height: `${Math.max(6, micVolume * 0.6)}px` }} />
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (textInput.trim() && !isGenerating) {
              handleUserTurn(textInput);
            }
          }}
          className="flex items-center gap-2"
        >
          {/* Mic Button */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
            }`}
            title={isListening ? 'Stop listening' : 'Speak Spanish via microphone'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isGenerating}
            placeholder="Type your response in Spanish (e.g. 'Me gustaría pedir una paella y agua')..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!textInput.trim() || isGenerating}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
              textInput.trim() && !isGenerating
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Model Selection Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="mobile-sheet max-h-[88dvh] overflow-y-auto bg-[#0B0F17] border border-slate-800 rounded-t-[30px] sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <h2 className="text-xl font-black text-white mb-2">Configure Free AI Models</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Cortex Spanish connects with free powerful AI models. Select your desired engine below:
            </p>

            <div className="space-y-4 mb-6">
              {/* Option 1: Meta Llama 3 via Groq Free API */}
              <div
                onClick={() => saveConfig('groq-llama3')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  providerConfig.provider === 'groq-llama3'
                    ? 'border-cyan-500 bg-cyan-950/30'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🦙</span>
                    <h3 className="text-sm font-bold text-white">Meta Llama 3.3 70B (Global Groq AI)</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active by Default
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Pre-configured globally for ultra-fast Spanish dialogue and Whisper speech recognition. Zero manual setup needed!
                </p>
              </div>

              {/* Option 2: Google Gemini Flash Free Tier */}
              <div
                onClick={() => saveConfig('gemini-flash')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  providerConfig.provider === 'gemini-flash'
                    ? 'border-indigo-500 bg-indigo-950/30'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">♊</span>
                    <h3 className="text-sm font-bold text-white">Google Gemini 1.5 Flash (Free Tier)</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    Google AI Studio
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  Free tier available from Google AI Studio (aistudio.google.com).
                </p>
                <input
                  type="password"
                  placeholder="Paste Gemini API Key (AIza...)"
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Option 3: Built-in Local Linguistic Model */}
              <div
                onClick={() => saveConfig('local')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  providerConfig.provider === 'local'
                    ? 'border-emerald-500 bg-emerald-950/30'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Cortex Linguistic Engine</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Zero Setup / Offline
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Instant offline grammar parsing, phonetic analysis, and dialogue state management without any external keys.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
