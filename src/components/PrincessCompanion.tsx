import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { speakSpanish } from '../utils/speech';
import { useSoundEffects } from '../utils/useSoundEffects';
import { Sparkles, Crown, Volume2, Flame, Heart, Zap } from 'lucide-react';

export type PrincessMood = 'idle' | 'happy' | 'thinking' | 'encouraging';

interface PrincessCheer {
  spanish: string;
  english: string;
  mood: PrincessMood;
  emoji: string;
  royalRank: string;
}

const PRINCESS_CHEERS: PrincessCheer[] = [
  {
    spanish: '¡Eres la realeza del español! Cada palabra te corona de sabiduría.',
    english: 'You are Spanish royalty! Every word crowns you with wisdom.',
    mood: 'happy',
    emoji: '👑',
    royalRank: 'Corona de Oro'
  },
  {
    spanish: '¡Mmm, déjame pensar! Tu acento está sonando cada vez más natural...',
    english: 'Hmm, let me think! Your accent is sounding more and more natural...',
    mood: 'thinking',
    emoji: '✨',
    royalRank: 'Mente Sabia'
  },
  {
    spanish: '¡No te rindas jamás! Un verdadero noble conquista cada desafío con valentía.',
    english: 'Never give up! A true noble conquers every challenge with bravery.',
    mood: 'encouraging',
    emoji: '🌹',
    royalRank: 'Corazón Valiente'
  },
  {
    spanish: '¡Magnífico! Tu pronunciación brilla con la gracia de un palacio real.',
    english: 'Magnificent! Your pronunciation shines with royal palace grace.',
    mood: 'happy',
    emoji: '👸',
    royalRank: 'Gracia Real'
  },
  {
    spanish: '¡Sublime, mi campeón! Tu cerebro crea sinapsis de oro puro hoy.',
    english: 'Sublime, my champion! Your brain creates synapses of pure gold today.',
    mood: 'encouraging',
    emoji: '💎',
    royalRank: 'Joya Lingüística'
  }
];

// Typewriter text effect component
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

export const PrincessCompanion: React.FC = () => {
  const { stats } = useApp();
  const sounds = useSoundEffects(stats.soundEnabled);
  const [cheerIndex, setCheerIndex] = useState(0);
  const [currentMood, setCurrentMood] = useState<PrincessMood>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [taps, setTaps] = useState(0);

  const cheer = PRINCESS_CHEERS[cheerIndex % PRINCESS_CHEERS.length];

  // Framer Motion Keyframes for Princess States
  const moodVariants: Variants = {
    idle: {
      y: [0, -8, 0],
      rotate: [-1, 1, -1],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const }
    },
    happy: {
      y: [0, -24, 0, -12, 0],
      scale: [1, 1.2, 0.96, 1.08, 1],
      rotate: [-4, 6, -4, 2, 0],
      transition: { duration: 0.85, ease: 'easeOut' as const }
    },
    thinking: {
      rotate: [0, 14, -6, 0],
      y: [0, -4, 0],
      transition: { duration: 1.8, ease: 'easeInOut' as const }
    },
    encouraging: {
      y: [0, -5, 0, -5, 0],
      scale: [1, 1.06, 1, 1.04, 1],
      transition: { duration: 1.2, ease: 'easeInOut' as const }
    }
  };

  const handlePrincessClick = () => {
    sounds.playCorrect(taps + 1);
    const nextIdx = cheerIndex + 1;
    const nextCheer = PRINCESS_CHEERS[nextIdx % PRINCESS_CHEERS.length];
    setCheerIndex(nextIdx);
    setCurrentMood('happy');
    setTaps(prev => prev + 1);

    confetti({
      particleCount: 45,
      spread: 70,
      startVelocity: 26,
      colors: ['#FFD700', '#F59E0B', '#EC4899', '#8B5CF6', '#10B981'],
      origin: { y: 0.65 }
    });

    setTimeout(() => {
      setCurrentMood(nextCheer.mood);
    }, 950);
  };

  const handleSpeakCheer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) return;
    sounds.playClick();
    setIsSpeaking(true);
    speakSpanish(cheer.spanish, {
      rate: 0.95,
      preferredAccent: stats.preferredAccent,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handlePrincessClick}
      className="group relative cursor-pointer overflow-hidden rounded-[30px] border border-amber-400/40 bg-gradient-to-r from-[#0F1422] via-[#161B2E] to-[#1A1325] p-5 sm:p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] select-none"
    >
      {/* Decorative ambient glowing radial circles */}
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {/* Dynamic Animated Princess Avatar */}
        <div className="relative shrink-0">
          <motion.div
            variants={moodVariants}
            animate={currentMood}
            className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[28px] bg-gradient-to-tr from-amber-400 via-rose-400 to-purple-600 p-[3px] shadow-2xl"
          >
            <div className="flex h-full w-full items-center justify-center rounded-[25px] bg-[#0B0F19] text-4xl sm:text-5xl">
              👸
            </div>

            {/* Pulsing Royal Golden Crown */}
            <motion.div
              animate={{ rotate: [-6, 6, -6], scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="absolute -top-3.5 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 text-sm shadow-lg border-2 border-[#0B0F19]"
            >
              👑
            </motion.div>
          </motion.div>

          {/* Dynamic Mood Label Pill */}
          <div className="mt-2 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
              {currentMood === 'happy' ? '🎉 Festejando' : currentMood === 'thinking' ? '🤔 Pensando' : currentMood === 'encouraging' ? '💖 Alentando' : '👑 Guía Real'}
            </span>
          </div>
        </div>

        {/* Speech Bubble with Typewriter reveal */}
        <div className="min-w-0 flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" />
              <span>Princesa Sofía</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[10px] font-bold text-purple-200">
              <span>{cheer.emoji}</span>
              <span>{cheer.royalRank}</span>
            </span>

            {stats.streak > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/30 bg-orange-500/15 px-2.5 py-0.5 text-[10px] font-black text-amber-300">
                <Flame className="h-3 w-3 fill-amber-400" />
                <span>{stats.streak}d Racha</span>
              </span>
            )}
          </div>

          {/* Typewriter speech text */}
          <div className="min-h-[50px] space-y-1">
            <p className="text-sm sm:text-base font-black text-white leading-relaxed">
              &ldquo;<TypewriterText text={cheer.spanish} />&rdquo;
            </p>
            <p className="text-xs text-slate-300 font-medium italic">
              &ldquo;{cheer.english}&rdquo;
            </p>
          </div>

          {/* Controls */}
          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={handleSpeakCheer}
              disabled={isSpeaking}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3.5 py-1.5 text-xs font-bold text-cyan-200 hover:bg-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-ping text-cyan-400' : 'text-cyan-300'}`} />
              <span>{isSpeaking ? 'Hablando…' : 'Escuchar pronunciación'}</span>
            </button>

            <span className="text-[11px] text-amber-300/80 font-bold group-hover:text-amber-200 transition-colors">
              ✨ Toca a Sofía para celebrar ({taps > 0 ? `${taps} honores` : '¡Toca aquí!'})
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
