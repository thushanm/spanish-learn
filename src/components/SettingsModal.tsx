import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSpanishVoiceStatus, speakSpanish } from '../utils/speech';
import { playClickSound } from '../utils/soundEffects';
import { freeAIService } from '../utils/freeAIProvider';
import { X, Volume2, Globe, Sliders, RotateCcw, Check, KeyRound } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { stats, updateSettings, resetProgress } = useApp();
  const [groqApiKey, setGroqApiKey] = useState('');
  const [voiceKeySaved, setVoiceKeySaved] = useState(false);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [spanishVoice, setSpanishVoice] = useState({ available: false, label: 'Checking Spanish voice…' });

  useEffect(() => {
    if (isOpen) {
      setGroqApiKey(freeAIService.getConfig().groqApiKey || '');
      setVoiceKeySaved(false);
      if (navigator.mediaDevices?.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices()
          .then(devices => setMicrophones(devices.filter(device => device.kind === 'audioinput')))
          .catch(() => setMicrophones([]));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const refreshVoiceStatus = () => setSpanishVoice(getSpanishVoiceStatus(stats.preferredAccent));
    refreshVoiceStatus();
    // Chrome and Edge sometimes publish their Natural voices shortly after the settings panel opens.
    const quickRefresh = window.setTimeout(refreshVoiceStatus, 250);
    const finalRefresh = window.setTimeout(refreshVoiceStatus, 1100);
    return () => {
      window.clearTimeout(quickRefresh);
      window.clearTimeout(finalRefresh);
    };
  }, [isOpen, stats.preferredAccent]);

  if (!isOpen) return null;

  const testVoice = (accent: 'es-ES' | 'es-MX', speed: number) => {
    playClickSound(stats.soundEnabled);
    const sample = accent === 'es-ES'
      ? '¡Hola! Esta es la pronunciación de España.'
      : '¡Hola! Esta es la pronunciación de México y Latinoamérica.';
    speakSpanish(sample, {
      rate: speed,
      preferredAccent: accent
    });
  };

  const handleAccentChange = (accent: 'es-ES' | 'es-MX') => {
    playClickSound(stats.soundEnabled);
    updateSettings({ preferredAccent: accent });
    testVoice(accent, stats.speechRate);
  };

  const handleSpeedChange = (rate: number) => {
    updateSettings({ speechRate: rate });
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas reiniciar tu progreso y puntos XP?')) {
      resetProgress();
      playClickSound(stats.soundEnabled);
      onClose();
    }
  };

  const saveVoiceTranscriptionKey = () => {
    freeAIService.setConfig({ groqApiKey: groqApiKey.trim() });
    setVoiceKeySaved(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="mobile-sheet relative w-full max-w-md max-h-[88dvh] overflow-y-auto rounded-t-[30px] sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-rose-500" />
            <span>Voice & App Settings</span>
          </h2>
          <button
            onClick={() => {
              playClickSound(stats.soundEnabled);
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accent Preference */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Globe className="w-4 h-4 text-rose-400" />
            <span>Spanish Accent & Dialect:</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAccentChange('es-ES')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                stats.preferredAccent === 'es-ES'
                  ? 'bg-rose-500/10 border-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🇪🇸</span>
                {stats.preferredAccent === 'es-ES' && <Check className="w-4 h-4 text-rose-400" />}
              </div>
              <p className="text-sm font-bold text-white mt-1">Spain (Castilian)</p>
              <p className="text-[11px] text-slate-400">European Spanish dialect</p>
            </button>

            <button
              onClick={() => handleAccentChange('es-MX')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                stats.preferredAccent === 'es-MX'
                  ? 'bg-rose-500/10 border-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🇲🇽</span>
                {stats.preferredAccent === 'es-MX' && <Check className="w-4 h-4 text-rose-400" />}
              </div>
              <p className="text-sm font-bold text-white mt-1">Mexico (LatAm)</p>
              <p className="text-[11px] text-slate-400">Latin American neutral</p>
            </button>
          </div>
        </div>

        <div className={`rounded-2xl border p-3 ${
          spanishVoice.available
            ? 'border-emerald-400/25 bg-emerald-500/10'
            : 'border-amber-400/25 bg-amber-500/10'
        }`}>
          <div className="flex items-start gap-2">
            <Volume2 className={`mt-0.5 h-4 w-4 shrink-0 ${spanishVoice.available ? 'text-emerald-300' : 'text-amber-300'}`} />
            <div>
              <p className="text-xs font-black text-white">Clear Spanish voice</p>
              <p className={`mt-0.5 break-words text-[11px] font-semibold ${spanishVoice.available ? 'text-emerald-200' : 'text-amber-200'}`}>
                {spanishVoice.label}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                {spanishVoice.available
                  ? 'The app automatically chooses the clearest available Spanish/Natural voice for Listen buttons.'
                  : 'For the clearest pronunciation, install a Spanish voice in your device or browser speech settings, then reopen this panel.'}
              </p>
            </div>
          </div>
        </div>

        {/* Speech Rate Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Pronunciation Speed:</span>
            </span>
            <span className="text-amber-400">{stats.speechRate}x</span>
          </div>

          <input
            type="range"
            min="0.7"
            max="1.2"
            step="0.05"
            value={stats.speechRate}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
            <span>0.7x (Beginner Slow)</span>
            <span>0.95x (Natural Flow)</span>
            <span>1.2x (Fast Fluent)</span>
          </div>
        </div>

        {/* Microphone selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Microphone for speaking:</span>
          </label>
          <select
            value={stats.microphoneDeviceId || 'default'}
            onChange={(event) => updateSettings({ microphoneDeviceId: event.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="default">System default microphone</option>
            {microphones.map((microphone, index) => (
              <option key={microphone.deviceId} value={microphone.deviceId}>
                {microphone.label || `Microphone ${index + 1}`}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500">
            If you see a silent recording, choose the microphone you actually use. Device names appear after microphone permission has been granted.
          </p>
        </div>

        {/* Audio Effects Toggle */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white">App Sound Effects</p>
            <p className="text-xs text-slate-400">Chimes, victory fanfare, and feedback taps</p>
          </div>
          <button
            onClick={() => {
              const next = !stats.soundEnabled;
              playClickSound(next);
              updateSettings({ soundEnabled: next });
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              stats.soundEnabled ? 'bg-rose-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                stats.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Voice transcription fallback */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Voice-to-text fallback (optional)</p>
              <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                If browser speech recognition is blocked, a Groq Whisper key can transcribe your saved Spanish recording for scoring.
              </p>
            </div>
          </div>
          <input
            type="password"
            value={groqApiKey}
            onChange={(event) => {
              setGroqApiKey(event.target.value);
              setVoiceKeySaved(false);
            }}
            placeholder="Groq API key (gsk_...)"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] leading-relaxed text-slate-500">
              Your key stays in this browser. When used, the audio recording is sent to Groq only for transcription.
            </p>
            <button
              onClick={saveVoiceTranscriptionKey}
              className="shrink-0 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              {voiceKeySaved ? 'Saved' : 'Save key'}
            </button>
          </div>
        </div>

        {/* Reset Progress Action */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-rose-400">Reset Learning Progress</p>
            <p className="text-xs text-slate-500">Reset XP points, hearts, and unlocked units</p>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound(stats.soundEnabled);
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-[#58cc02] border-b-4 border-[#58a700] hover:bg-[#61e002] active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider transition-all"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
