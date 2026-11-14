import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { speakSpanish } from '../utils/speech';
import { playClickSound, playLevelUpSound } from '../utils/soundEffects';
import { getPlayerLevel } from '../utils/progression';
import { Sparkles, Crown, Heart, Volume2, Flame, Award } from 'lucide-react';

interface PrincessCheer {
  spanish: string;
  english: string;
  emoji: string;
  royalRank: string;
}

const PRINCESS_CHEERS: PrincessCheer[] = [
  {
    spanish: '¡Eres la realeza del español! Cada palabra te corona de sabiduría.',
    english: 'You are Spanish royalty! Every word crowns you with wisdom.',
    emoji: '👑',
    royalRank: 'Corona de Oro'
  },
  {
    spanish: '¡Magnífico! Tu pronunciación brilla con la gracia de un palacio real.',
    english: 'Magnificent! Your pronunciation shines with royal palace grace.',
    emoji: '✨',
    royalRank: 'Gracia Real'
  },
  {
    spanish: '¡Sublime, mi campeón! Tu cerebro crea sinapsis de oro puro hoy.',
    english: 'Sublime, my champion! Your brain creates synapses of pure gold today.',
    emoji: '💎',
    royalRank: 'Joya Lingüística'
  },
  {
    spanish: '¡Qué elegancia! Hablas con la melodía y el ritmo de los reyes y reinas.',
    english: 'What elegance! You speak with the melody and rhythm of kings and queens.',
    emoji: '👸',
    royalRank: 'Voz Majestuosa'
  },
  {
    spanish: '¡Poder y persistencia! Un verdadero noble nunca se rinde con su español.',
    english: 'Power and persistence! A true noble never gives up on their Spanish.',
    emoji: '🌹',
    royalRank: 'Corazón Valiente'
  },
  {
    spanish: '¡Brillante! Estás conquistando cada frase como un emperador de la fluidez.',
    english: 'Brilliant! You are conquering every phrase like an emperor of fluency.',
    emoji: '🌟',
    royalRank: 'Estrella Real'
  }
];

export const PrincessCompanion: React.FC = () => {
  const { stats } = useApp();
  const playerLevel = getPlayerLevel(stats.xp);
  const [cheerIndex, setCheerIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [taps, setTaps] = useState(0);

  const currentCheer = PRINCESS_CHEERS[cheerIndex % PRINCESS_CHEERS.length];

  const handlePrincessClick = () => {
    playClickSound(stats.soundEnabled);
    const nextIndex = cheerIndex + 1;
    setCheerIndex(nextIndex);
    setTaps(prev => prev + 1);

    // Play golden sparkles confetti
    confetti({
      particleCount: 35,
      spread: 60,
      startVelocity: 25,
      colors: ['#F59E0B', '#EC4899', '#38BDF8', '#10B981'],
      origin: { y: 0.65 }
    });

    if (taps > 0 && taps % 5 === 0) {
      playLevelUpSound(stats.soundEnabled);
    }
  };

  const handleSpeakCheer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) return;
    playClickSound(stats.soundEnabled);
    setIsSpeaking(true);
    speakSpanish(currentCheer.spanish, {
      rate: 0.95,
      preferredAccent: stats.preferredAccent,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  return (
    <div
      onClick={handlePrincessClick}
      className="group relative cursor-pointer overflow-hidden rounded-[28px] sm:rounded-3xl border border-amber-400/35 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-rose-950/40 p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:border-amber-300/60 hover:shadow-amber-500/10 select-none animate-princess-pop"
      title="Click Princess Sofía for a royal cheer and Spanish encouragement!"
    >
      {/* Decorative ambient glowing circles */}
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 h-36 w-36 rounded-full bg-rose-400/10 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
        {/* Animated Royal Princess Avatar */}
        <div className="relative shrink-0">
          <div className="animate-float-gently relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-400 to-fuchsia-500 p-[3px] shadow-lg animate-royal-glow">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#0F1420] text-3xl sm:text-4xl">
              👸
            </div>
            {/* Golden Tiara Crown Badge */}
            <div className="absolute -top-2.5 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 text-xs shadow-md border-2 border-[#0F1420] animate-bounce">
              👑
            </div>
          </div>
        </div>

        {/* Speech Bubble & Motivation Content */}
        <div className="min-w-0 flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-200">
              <Sparkles className="h-3 w-3 text-amber-300 animate-sparkle-spin" />
              <span>Princesa Sofía • Compañera Real</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-200">
              <span>{currentCheer.emoji}</span>
              <span>{currentCheer.royalRank}</span>
            </span>

            {stats.streak > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/30 bg-orange-500/15 px-2 py-0.5 text-[10px] font-black text-amber-300">
                <Flame className="h-3 w-3 fill-amber-400" />
                <span>{stats.streak}d Racha</span>
              </span>
            )}
          </div>

          <div className="space-y-0.5">
            <p className="text-sm sm:text-base font-black text-white leading-snug">
              &ldquo;{currentCheer.spanish}&rdquo;
            </p>
            <p className="text-xs text-slate-300 font-medium">
              &ldquo;{currentCheer.english}&rdquo;
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={handleSpeakCheer}
              disabled={isSpeaking}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-[11px] font-bold text-cyan-200 hover:bg-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Volume2 className={`h-3.5 w-3.5 ${isSpeaking ? 'animate-ping text-cyan-400' : 'text-cyan-300'}`} />
              <span>{isSpeaking ? 'Escuchando…' : 'Escuchar pronunciación'}</span>
            </button>

            <span className="text-[10px] text-slate-400 font-semibold group-hover:text-amber-300 transition-colors">
              ✨ Toca para más palabras de la princesa ({taps > 0 ? `${taps} honores` : 'Toca aquí'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
