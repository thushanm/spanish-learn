import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronUp, Sparkles, Star, Trophy, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playLevelUpSound, playXpRewardSound } from '../utils/soundEffects';
import { getPlayerLevel } from '../utils/progression';
import { SPANISH_UNITS } from '../data/spanishData';

type Reward = {
  title: string;
  detail: string;
  xp: number;
  emoji: string;
  kind: 'xp' | 'unit' | 'level';
};

export const GameRewardToast: React.FC = () => {
  const { stats } = useApp();
  const previous = useRef<{ xp: number; completedUnits: string[]; wordsLearnedCount: number } | null>(null);
  const lastSmallRewardAt = useRef(0);
  const [reward, setReward] = useState<Reward | null>(null);

  useEffect(() => {
    const snapshot = { xp: stats.xp, completedUnits: stats.completedUnits, wordsLearnedCount: stats.wordsLearnedCount };
    if (!previous.current) {
      previous.current = snapshot;
      return;
    }

    const xpEarned = stats.xp - previous.current.xp;
    const completedNow = stats.completedUnits.find(id => !previous.current?.completedUnits.includes(id));
    const completedMiniQuest = stats.wordsLearnedCount > previous.current.wordsLearnedCount && stats.wordsLearnedCount % 3 === 0;
    const previousLevel = getPlayerLevel(previous.current.xp);
    const currentLevel = getPlayerLevel(stats.xp);
    previous.current = snapshot;

    if (xpEarned <= 0) return;

    let nextReward: Reward;
    if (currentLevel.level > previousLevel.level) {
      nextReward = {
        title: `🎉 ¡Nivel ${currentLevel.level}: ${currentLevel.title}!`,
        detail: `¡Nuevo rango arcade desbloqueado! Tu fluidez avanza con poder.`,
        xp: xpEarned,
        emoji: '⭐',
        kind: 'level'
      };
      playLevelUpSound(stats.soundEnabled);
      confetti({ particleCount: 110, spread: 72, startVelocity: 34, colors: ['#FFC800', '#58CC02', '#1CB0F6', '#FF6492'], origin: { y: 0.72 } });
    } else if (completedNow) {
      const unit = SPANISH_UNITS.find(item => item.id === completedNow);
      nextReward = {
        title: '🏆 ¡Tema Completado!',
        detail: `${unit?.title || 'Esta lección'} ya es parte de tu tesoro de español.`,
        xp: xpEarned,
        emoji: '🏆',
        kind: 'unit'
      };
      playLevelUpSound(stats.soundEnabled);
      confetti({ particleCount: 90, spread: 66, colors: ['#FFC800', '#58CC02', '#1CB0F6'], origin: { y: 0.72 } });
    } else if (completedMiniQuest) {
      nextReward = {
        title: '💎 ¡Mini Misión Conquistada!',
        detail: 'Tres nuevas frases grabadas en tu memoria para siempre.',
        xp: xpEarned,
        emoji: '✨',
        kind: 'unit'
      };
      playXpRewardSound(stats.soundEnabled, true);
      confetti({ particleCount: 65, spread: 54, origin: { y: 0.74 } });
    } else {
      const now = Date.now();
      // Fast games can award XP every few hundred milliseconds; keep their feedback celebratory, not noisy.
      if (now - lastSmallRewardAt.current < 1400) return;
      lastSmallRewardAt.current = now;
      nextReward = {
        title: xpEarned >= 25 ? '🎉 ¡Pronunciación Estelar!' : '🌟 ¡Triunfo Español!',
        detail: xpEarned >= 25 ? '¡Ese acento suena genial y natural!' : '¡Paso a paso hacia la fluidez!',
        xp: xpEarned,
        emoji: xpEarned >= 25 ? '🌟' : '🎉',
        kind: 'xp'
      };
      playXpRewardSound(stats.soundEnabled, xpEarned >= 25);
    }

    setReward(nextReward);
    const timeout = window.setTimeout(() => setReward(null), nextReward.kind === 'xp' ? 2600 : 4200);
    return () => window.clearTimeout(timeout);
  }, [stats.xp, stats.completedUnits, stats.soundEnabled]);

  if (!reward) return null;

  const accent = reward.kind === 'level'
    ? 'from-fuchsia-500 via-rose-500 to-amber-400 border-amber-300/60 shadow-amber-500/20'
    : reward.kind === 'unit'
      ? 'from-amber-400 to-orange-500 border-amber-200/50 shadow-amber-500/20'
      : 'from-cyan-400 via-rose-400 to-amber-300 border-cyan-200/50 shadow-cyan-500/20';

  return (
    <div className="reward-toast fixed inset-x-4 bottom-[calc(6.25rem+env(safe-area-inset-bottom))] z-[55] mx-auto max-w-sm md:inset-x-auto md:bottom-6 md:right-6 animate-princess-pop">
      <div className="relative overflow-hidden rounded-[28px] border-4 border-white bg-white/95 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl text-slate-800">
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 border-2 border-amber-300 text-2xl shadow-md">
            {reward.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-slate-900 leading-tight">{reward.title}</p>
            <p className="mt-0.5 text-xs font-bold leading-relaxed text-slate-500">{reward.detail}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-amber-100 border-2 border-amber-300 px-2.5 py-1.5 text-xs font-black text-amber-800 shadow-sm">
            <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            +{reward.xp}
          </div>
          <Sparkles className="absolute -right-1 -top-1 h-5 w-5 animate-sparkle-spin text-amber-500" />
        </div>
      </div>
    </div>
  );
};
