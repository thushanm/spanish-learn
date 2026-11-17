import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Clapperboard,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  FastForward,
  Award,
  Zap,
  Info,
  Flame,
  Globe2,
  Brain
} from 'lucide-react';
import { CINEMA_CLIPS, CinemaClip, CinemaWordBreakdown } from '../data/cinemaClipsData';
import { useApp } from '../context/AppContext';
import { speakSpanish } from '../utils/speech';
import { freeAIService, CinemaSceneAnalysis } from '../utils/freeAIProvider';
import { CartoonMascot } from './CartoonMascot';
import { TactileButton } from './ui/TactileButton';
import { soundEffects } from '../utils/useSoundEffects';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const STORAGE_CLIP_INDEX_KEY = 'jtm_cinema_clip_index';
const STORAGE_SHADOWED_CLIPS_KEY = 'jtm_cinema_shadowed_clips';

export const CinemaSpanishLab: React.FC = () => {
  const { stats, addXP, setMascotMood, triggerGameAction, setIsMediaPlaying, reportLearningActivity } = useApp();

  // Selected clip state (persisted in localStorage)
  const [clipIndex, setClipIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CLIP_INDEX_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < CINEMA_CLIPS.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved cinema clip index', e);
    }
    return 0;
  });

  const currentClip: CinemaClip = CINEMA_CLIPS[clipIndex] || CINEMA_CLIPS[0];

  // Track shadowed clips
  const [shadowedClips, setShadowedClips] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SHADOWED_CLIPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Player state
  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<number>(0.75); // 0.75x default for movie clarity
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(currentClip.startSeconds);
  const [playerHasError, setPlayerHasError] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Subtitle & Word Inspector
  const [showEnglish, setShowEnglish] = useState(true);
  const [selectedWord, setSelectedWord] = useState<CinemaWordBreakdown | null>(null);

  // Groq AI Scene Analysis
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<CinemaSceneAnalysis | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Speech Shadowing
  const [isRecording, setIsRecording] = useState(false);
  const [shadowTranscript, setShadowTranscript] = useState('');
  const [shadowScore, setShadowScore] = useState<number | null>(null);
  const [shadowFeedback, setShadowFeedback] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Save clip index
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLIP_INDEX_KEY, clipIndex.toString());
    } catch (e) {}
  }, [clipIndex]);

  // Sync video playing state to AppContext so active study time tracks while watching movie clips
  useEffect(() => {
    setIsMediaPlaying(isPlaying);
    if (isPlaying) {
      reportLearningActivity('cinema_watching');
    }
    return () => {
      setIsMediaPlaying(false);
    };
  }, [isPlaying, setIsMediaPlaying, reportLearningActivity]);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api-script';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
    }

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevReady) prevReady();
      setIsScriptLoaded(true);
    };

    // Fallback polling for script load in case callback missed
    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        setIsScriptLoaded(true);
        clearInterval(checkYT);
      }
    }, 300);

    return () => clearInterval(checkYT);
  }, []);

  // Initialize or re-cue player when clip or script changes
  useEffect(() => {
    if (!isScriptLoaded || typeof window === 'undefined' || !window.YT) return;

    setPlayerHasError(false);
    setIsPlayerReady(false);
    setSelectedWord(null);
    setAiAnalysis(null);
    setShadowScore(null);
    setShadowTranscript('');
    setShadowFeedback('');

    const targetId = 'yt-cinema-player-element';

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById({
          videoId: currentClip.youtubeId,
          startSeconds: currentClip.startSeconds,
          endSeconds: currentClip.endSeconds
        });
        playerRef.current.setPlaybackRate(playbackRate);
        setIsPlayerReady(true);
        setIsPlaying(true);
      } catch (err) {
        console.warn('Error loading video by ID, rebuilding player:', err);
        destroyAndRebuildPlayer(targetId);
      }
    } else {
      destroyAndRebuildPlayer(targetId);
    }

    function destroyAndRebuildPlayer(elementId: string) {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }

      try {
        playerRef.current = new window.YT.Player(elementId, {
          videoId: currentClip.youtubeId,
          playerVars: {
            autoplay: 1,
            start: currentClip.startSeconds,
            end: currentClip.endSeconds,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              setIsPlayerReady(true);
              try {
                event.target.setPlaybackRate(playbackRate);
                event.target.seekTo(currentClip.startSeconds, true);
                event.target.playVideo();
                setIsPlaying(true);
              } catch (e) {}
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop restart
                if (isLooping) {
                  event.target.seekTo(currentClip.startSeconds, true);
                  event.target.playVideo();
                  setIsPlaying(true);
                }
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Player error code:', err);
              setPlayerHasError(true);
            }
          }
        });
      } catch (err) {
        console.warn('YouTube Player init failed:', err);
        setPlayerHasError(true);
      }
    }
  }, [currentClip.id, isScriptLoaded]);

  // Seamless 5-10s Loop Interval: keeps playback inside [startSeconds, endSeconds]
  useEffect(() => {
    const loopInterval = setInterval(() => {
      if (!playerRef.current || !isPlaying || !isLooping) return;
      try {
        if (typeof playerRef.current.getCurrentTime === 'function') {
          const currentTime = playerRef.current.getCurrentTime();
          setCurrentVideoTime(currentTime);

          if (currentTime >= currentClip.endSeconds || currentTime < currentClip.startSeconds - 1) {
            playerRef.current.seekTo(currentClip.startSeconds, true);
          }
        }
      } catch (e) {}
    }, 250);

    return () => clearInterval(loopInterval);
  }, [currentClip.startSeconds, currentClip.endSeconds, isPlaying, isLooping]);

  // Handle Playback Speed change
  const handleSetSpeed = (rate: number) => {
    setPlaybackRate(rate);
    soundEffects.playSnap();
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      try {
        playerRef.current.setPlaybackRate(rate);
      } catch (e) {}
    }
  };

  // Handle Play/Pause
  const togglePlay = () => {
    soundEffects.playClick();
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.seekTo(currentClip.startSeconds, true);
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {}
  };

  // Replay slice
  const handleReplaySlice = () => {
    soundEffects.playClick();
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(currentClip.startSeconds, true);
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {}
    }
  };

  // Clip navigation
  const handleSelectClip = (index: number) => {
    soundEffects.playBubblePop();
    setClipIndex(index);
  };

  const handleNextClip = () => {
    const next = (clipIndex + 1) % CINEMA_CLIPS.length;
    handleSelectClip(next);
  };

  const handlePrevClip = () => {
    const prev = (clipIndex - 1 + CINEMA_CLIPS.length) % CINEMA_CLIPS.length;
    handleSelectClip(prev);
  };

  // Word Click Inspector
  const handleWordClick = (wordText: string) => {
    soundEffects.playSnap();
    const clean = wordText.toLowerCase().replace(/[¿?¡!.,;:"«»]/g, '').trim();
    const matched = currentClip.vocab.find(v => v.word.toLowerCase().includes(clean) || clean.includes(v.word.toLowerCase())) || {
      word: wordText.replace(/[¿?¡!.,;:"«»]/g, ''),
      meaning: 'Word from scene dialogue',
      phonetic: 'Tap audio to hear pronunciation'
    };
    setSelectedWord(matched);
  };

  // Pronounce word or entire line
  const handlePronounce = (text: string, rate: number = 0.85) => {
    if (stats.soundEnabled) {
      speakSpanish(text, { rate });
    }
  };

  // Groq AI Scene Analysis
  const handleAnalyzeWithGroq = async () => {
    soundEffects.playBoing();
    setIsAnalyzingAI(true);
    setShowAiModal(true);

    try {
      const analysis = await freeAIService.analyzeCinemaClip(currentClip);
      setAiAnalysis(analysis);
      setMascotMood('cheering');
    } catch (e) {
      console.warn('Cinema analysis failed:', e);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Speech Shadowing Voice Match
  const startSpeechShadowing = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please try Google Chrome or Edge.');
      return;
    }

    soundEffects.playClick();
    setShadowScore(null);
    setShadowTranscript('');
    setShadowFeedback('');
    setIsRecording(true);

    // Pause video while recording voice
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = currentClip.countryCode || 'es-ES';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalSpoken = '';

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpoken += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setShadowTranscript(finalSpoken || interim);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech Recognition error:', event.error);
      setIsRecording(false);
      setShadowFeedback('Microphone stopped. Tap again to record your line.');
    };

    recognition.onend = () => {
      setIsRecording(false);
      evaluateShadowing(finalSpoken);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const stopSpeechShadowing = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // Evaluate Shadowing match
  const evaluateShadowing = (userSpokenText: string) => {
    const spoken = userSpokenText.trim();
    if (!spoken) {
      setShadowFeedback('No speech detected. Make sure your microphone is unmuted and speak clearly.');
      return;
    }

    const target = currentClip.spanishDialogue;
    const cleanSpoken = spoken.toLowerCase().replace(/[¿?¡!.,;:"«»]/g, '').split(/\s+/).filter(Boolean);
    const cleanTarget = target.toLowerCase().replace(/[¿?¡!.,;:"«»]/g, '').split(/\s+/).filter(Boolean);

    let matchCount = 0;
    cleanTarget.forEach(word => {
      if (cleanSpoken.some(sp => sp.includes(word) || word.includes(sp))) {
        matchCount++;
      }
    });

    const score = Math.min(100, Math.round((matchCount / Math.max(1, cleanTarget.length)) * 100));
    setShadowScore(score);

    if (score >= 70) {
      // Success!
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 }
      });
      soundEffects.playFanfare();
      addXP(30);
      triggerGameAction('correct');
      setMascotMood('cheering');

      // Record shadowed clip
      if (!shadowedClips.includes(currentClip.id)) {
        const next = [...shadowedClips, currentClip.id];
        setShadowedClips(next);
        try {
          localStorage.setItem(STORAGE_SHADOWED_CLIPS_KEY, JSON.stringify(next));
        } catch (e) {}
      }

      setShadowFeedback(`¡Excelente! You matched ${score}% of ${currentClip.speaker}'s line! (+30 XP)`);
    } else {
      triggerGameAction('wrong');
      setMascotMood('sad');
      setShadowFeedback(`Good effort (${score}%)! Try slowing down to 0.75x and listen to the vowel stress before speaking.`);
    }
  };

  // Calculate slice loop progress percentage
  const sliceDuration = Math.max(1, currentClip.endSeconds - currentClip.startSeconds);
  const sliceProgress = Math.min(
    100,
    Math.max(0, ((currentVideoTime - currentClip.startSeconds) / sliceDuration) * 100)
  );

  return (
    <div className="mobile-page max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-7 space-y-5 sm:space-y-6 text-slate-100">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-[28px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-sky-400 p-[3px] shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-[#0B0F19] rounded-[13px] flex items-center justify-center">
                <Clapperboard className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Cinema Spanish Lab
                </h1>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Movie Clips
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                Loop authentic 5-10s scenes, slow them down, inspect subtitles & shadow actors!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-black">
              <Award className="w-4 h-4 text-purple-400" />
              <span>{shadowedClips.length}/{CINEMA_CLIPS.length} Shadowed</span>
            </span>
          </div>
        </div>

        {/* Horizontal Carousel Selector for 8 Curated Clips */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CINEMA_CLIPS.map((clip, idx) => {
            const isSelected = idx === clipIndex;
            const isShadowed = shadowedClips.includes(clip.id);

            return (
              <button
                key={clip.id}
                onClick={() => handleSelectClip(idx)}
                className={`group shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/80 border-sky-400 shadow-md shadow-sky-500/20 text-white font-black'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{clip.country.split(' ')[1] || '🎬'}</span>
                <div className="text-left">
                  <div className="text-xs font-black truncate max-w-[130px] sm:max-w-[170px]">
                    {clip.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[130px] flex items-center gap-1">
                    <span>{clip.speaker}</span>
                    {isShadowed && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Cinema Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: YouTube Video & Subtitle Studio (7 cols) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          {/* Movie Scene Header Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0E1524]/90 p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-black">
                  {currentClip.themeBadge}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-black">
                  Level {currentClip.level}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1.5">
                {currentClip.title} ({currentClip.year})
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                Character: <span className="text-slate-200">{currentClip.speaker}</span> ({currentClip.role}) · {currentClip.country}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevClip}
                title="Previous Clip"
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black text-slate-400 px-1">
                {clipIndex + 1}/{CINEMA_CLIPS.length}
              </span>
              <button
                onClick={handleNextClip}
                title="Next Clip"
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* YouTube IFrame Player Container */}
          <div className="relative rounded-[24px] overflow-hidden border-2 border-slate-700/80 bg-black shadow-2xl shadow-black/80 aspect-video group">
            {/* The Target Div for YouTube Player */}
            <div id="yt-cinema-player-element" className="w-full h-full" />

            {/* Offline or Error Fallback Banner if YouTube is blocked */}
            {playerHasError && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-20">
                <Clapperboard className="w-12 h-12 text-amber-400 mb-3" />
                <h3 className="text-base font-black text-white">Interactive Audio Mode Active</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  YouTube embed is playing in native audio mode. You can listen aloud, inspect words, and shadow the actor below!
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <TactileButton
                    variant="candy-green"
                    size="sm"
                    onClick={() => handlePronounce(currentClip.spanishDialogue, playbackRate)}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Native Spanish Audio</span>
                  </TactileButton>
                  <a
                    href={`https://www.youtube.com/watch?v=${currentClip.youtubeId}&t=${currentClip.startSeconds}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-sky-400 hover:bg-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open on YouTube</span>
                  </a>
                </div>
              </div>
            )}

            {/* Slice Loop Bar Overlay (top of video) */}
            <div className="absolute top-2 left-2 right-2 pointer-events-none z-10 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black">
              <span className="flex items-center gap-1 text-sky-400">
                <RotateCcw className="w-3 h-3 animate-spin" />
                Loop Slice: {currentClip.startSeconds}s - {currentClip.endSeconds}s ({sliceDuration}s)
              </span>
              <span className="text-slate-300">
                Speed: {playbackRate}x
              </span>
            </div>

            {/* Scrubber progress indicator at bottom of video */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800/80 z-10">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 transition-all duration-200"
                style={{ width: `${sliceProgress}%` }}
              />
            </div>
          </div>

          {/* Player Tactile Controls: Play/Pause, Replay, Speed Rate */}
          <div className="rounded-2xl border border-slate-800 bg-[#0E1524]/90 p-3 sm:p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
            {/* Playback action buttons */}
            <div className="flex items-center gap-2">
              <TactileButton
                variant={isPlaying ? 'cyan' : 'candy-green'}
                size="sm"
                onClick={togglePlay}
                className="min-w-[100px]"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </TactileButton>

              <button
                onClick={handleReplaySlice}
                title="Replay dialogue slice from start"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-slate-200 hover:bg-slate-800 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Replay</span>
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                title="Toggle continuous slice looping"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black transition-all ${
                  isLooping
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Loop {isLooping ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Speed Control Pill Buttons */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2 hidden sm:inline">
                Speed
              </span>
              {[
                { rate: 0.5, label: '0.5x' },
                { rate: 0.75, label: '0.75x' },
                { rate: 1.0, label: '1.0x' },
                { rate: 1.25, label: '1.25x' }
              ].map(s => (
                <button
                  key={s.rate}
                  onClick={() => handleSetSpeed(s.rate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    playbackRate === s.rate
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Subtitles & Tap-to-Inspect Words */}
          <div className="rounded-[24px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Interactive Spanish Subtitles (Tap any word)
                </h3>
              </div>
              <button
                onClick={() => setShowEnglish(!showEnglish)}
                className="text-[11px] font-black text-sky-400 hover:text-sky-300 transition-colors"
              >
                {showEnglish ? 'Hide English' : 'Show English'}
              </button>
            </div>

            {/* Spanish Dialogue Word Chips */}
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-lg sm:text-xl font-bold leading-relaxed">
                {currentClip.spanishDialogue.split(' ').map((word, wIdx) => {
                  const clean = word.toLowerCase().replace(/[¿?¡!.,;:"«»]/g, '');
                  const isWordSelected = selectedWord && selectedWord.word.toLowerCase().includes(clean);

                  return (
                    <button
                      key={wIdx}
                      onClick={() => handleWordClick(word)}
                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border-b-2 active:border-b-0 active:translate-y-0.5 ${
                        isWordSelected
                          ? 'bg-amber-400 border-amber-600 text-slate-950 font-black shadow-md shadow-amber-400/20'
                          : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}

                {/* Read aloud icon for the full phrase */}
                <button
                  onClick={() => handlePronounce(currentClip.spanishDialogue, playbackRate)}
                  title="Listen to full phrase spoken aloud"
                  className="p-1.5 rounded-xl bg-slate-800 text-sky-400 hover:bg-slate-700 transition-colors shrink-0 ml-1"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Phonetic guide */}
              <p className="mt-3 text-xs text-amber-300/80 font-mono italic">
                Phonetic: &ldquo;{currentClip.phoneticDialogue}&rdquo;
              </p>

              {/* English Translation */}
              <AnimatePresence>
                {showEnglish && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-slate-800/80 text-sm text-slate-300 font-medium"
                  >
                    &ldquo;{currentClip.englishTranslation}&rdquo;
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Word Detail Popup Card */}
            <AnimatePresence>
              {selectedWord && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#141E33] border-2 border-amber-500/40 shadow-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-amber-400">
                        {selectedWord.word}
                      </span>
                      <button
                        onClick={() => handlePronounce(selectedWord.word, 0.8)}
                        className="p-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedWord(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <p className="text-xs text-slate-200">
                    <span className="font-bold text-slate-400">Meaning: </span>
                    {selectedWord.meaning}
                  </p>
                  <p className="text-[11px] text-amber-300 font-mono">
                    <span className="font-bold text-slate-400 font-sans">Pronunciation: </span>
                    [{selectedWord.phonetic}]
                  </p>
                  {selectedWord.notes && (
                    <p className="text-[11px] text-slate-400 italic">
                      Tip: {selectedWord.notes}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: AI Analysis, Voice Shadowing & Mascot (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          {/* Expressive Mascot Companion */}
          <div className="rounded-[24px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-3 shadow-xl">
            <CartoonMascot compact={true} />
          </div>

          {/* Speech Shadowing Studio (Voice Match Challenge) */}
          <div className="rounded-[24px] border-2 border-emerald-500/40 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  Actor Voice Shadowing
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                +30 XP
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-bold">
              Repeat the line aloud like {currentClip.speaker}! Match their pitch, rhythm, and emotion.
            </p>

            {/* Recording Trigger */}
            <div className="flex flex-col items-center gap-3 py-2">
              <button
                onClick={isRecording ? stopSpeechShadowing : startSpeechShadowing}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isRecording
                    ? 'bg-rose-500 ring-8 ring-rose-500/30 scale-105 animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 ring-4 ring-emerald-500/20 active:scale-95'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-7 h-7 text-white" />
                ) : (
                  <Mic className="w-7 h-7 text-white" />
                )}
              </button>

              <span className="text-xs font-black text-slate-300">
                {isRecording ? 'Listening... Tap to finish' : 'Tap mic to shadow line'}
              </span>
            </div>

            {/* Live user transcript feedback */}
            {shadowTranscript && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  You said:
                </span>
                &ldquo;{shadowTranscript}&rdquo;
              </div>
            )}

            {/* Score & Feedback */}
            {shadowScore !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-3.5 rounded-xl border text-xs font-bold ${
                  shadowScore >= 70
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm">Accuracy: {shadowScore}%</span>
                  {shadowScore >= 70 && (
                    <span className="flex items-center gap-1 text-emerald-300 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5" /> +30 XP
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">{shadowFeedback}</p>
              </motion.div>
            )}
          </div>

          {/* Groq AI Scene Analyzer Trigger Card */}
          <div className="rounded-[24px] border-2 border-purple-500/40 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-purple-300">
                Groq AI Scene Intelligence
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-bold">
              Unpack slang, emotional delivery, and Peninsular/Latin cultural nuance powered by Meta Llama 3.3.
            </p>

            <TactileButton
              variant="amethyst"
              size="md"
              onClick={handleAnalyzeWithGroq}
              className="w-full shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="w-4 h-4 text-purple-200 animate-spin" />
              <span>Explain with Groq AI</span>
            </TactileButton>
          </div>
        </div>
      </div>

      {/* Groq AI Scene Explainer Modal / Bottom Sheet */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border-2 border-purple-500/60 bg-[#0E1524] p-5 sm:p-7 shadow-2xl space-y-5 text-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Groq AI Scene Analysis
                    </h3>
                    <p className="text-xs text-purple-300 font-bold">
                      Meta Llama 3.3 · {currentClip.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Loading State */}
              {isAnalyzingAI && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <p className="text-sm font-black text-purple-300">
                    Groq Llama 3.3 is analyzing scene slang, cadence & grammar...
                  </p>
                  <p className="text-xs text-slate-400">
                    Extracting native speaker cultural nuances in real-time
                  </p>
                </div>
              )}

              {/* Analysis Result */}
              {!isAnalyzingAI && aiAnalysis && (
                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Slang & Idioms */}
                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                    <span className="text-[11px] font-black uppercase text-purple-300 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Slang & Idiomatic Expressions
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-200 font-medium">
                      {aiAnalysis.slangAndIdioms.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Cultural Context */}
                  <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 space-y-1.5">
                    <span className="text-[11px] font-black uppercase text-sky-300 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                      Cultural Nuance & Dialect ({currentClip.country})
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {aiAnalysis.culturalNotes}
                    </p>
                  </div>

                  {/* Acting & Emotional Tone */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-black uppercase text-amber-300 flex items-center gap-1.5">
                      <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                      Actor Delivery & Tone
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {aiAnalysis.toneAndDelivery}
                    </p>
                  </div>

                  {/* Grammar Deep Dive */}
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
                    <span className="text-[11px] font-black uppercase text-emerald-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      Grammar Deep Dive
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {aiAnalysis.grammarDeepDive}
                    </p>
                  </div>

                  {/* Real-world conversation tip */}
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1.5">
                    <span className="text-[11px] font-black uppercase text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Everyday Conversation Takeaway
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {aiAnalysis.conversationPracticeTip}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <TactileButton
                      variant="cyan"
                      size="sm"
                      onClick={() => setShowAiModal(false)}
                    >
                      <span>Got It! Let&apos;s Practice</span>
                    </TactileButton>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
