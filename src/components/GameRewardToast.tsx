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
        title: `Level ${currentLevel.level}: ${currentLevel.title}`,
        detail: `You unlocked a new speaker rank. Keep the streak alive!`,
        xp: xpEarned,
        kind: 'level'
      };
      playLevelUpSound(stats.soundEnabled);
      confetti({ particleCount: 110, spread: 72, startVelocity: 34, origin: { y: 0.72 } });
    } else if (completedNow) {
      const unit = SPANISH_UNITS.find(item => item.id === completedNow);
      nextReward = {
        title: 'Topic complete!',
        detail: `${unit?.title || 'Your lesson'} is now part of your Spanish toolkit.`,
        xp: xpEarned,
        kind: 'unit'
      };
      playLevelUpSound(stats.soundEnabled);
      confetti({ particleCount: 90, spread: 66, origin: { y: 0.72 } });
    } else if (completedMiniQuest) {
      nextReward = {
        title: 'Mini quest complete!',
        detail: 'Three new phrases are now in your active Spanish toolkit.',
        xp: xpEarned,
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
        title: xpEarned >= 25 ? 'Brilliant speaking!' : 'Nice Spanish win!',
        detail: xpEarned >= 25 ? 'That phrase is getting stronger.' : 'One small win at a time.',
        xp: xpEarned,
        kind: 'xp'
      };
      playXpRewardSound(stats.soundEnabled, xpEarned >= 25);
    }

    setReward(nextReward);
    const timeout = window.setTimeout(() => setReward(null), nextReward.kind === 'xp' ? 2500 : 4200);
    return () => window.clearTimeout(timeout);
  }, [stats.xp, stats.completedUnits, stats.soundEnabled]);

  if (!reward) return null;

  const Icon = reward.kind === 'level' ? Trophy : reward.kind === 'unit' ? Star : CheckCircle2;
  const accent = reward.kind === 'level'
    ? 'from-fuchsia-500 to-violet-500 border-fuchsia-300/50'
    : reward.kind === 'unit'
      ? 'from-amber-400 to-orange-500 border-amber-200/50'
      : 'from-cyan-400 to-emerald-400 border-cyan-200/50';

  return (
    <div className="reward-toast fixed inset-x-4 bottom-[calc(6.25rem+env(safe-area-inset-bottom))] z-[55] mx-auto max-w-sm md:inset-x-auto md:bottom-6 md:right-6">
      <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${accent} p-[1px] shadow-2xl`}>
        <div className="relative flex items-center gap-3 rounded-[23px] bg-[#0B0F17]/95 p-4 backdrop-blur-xl">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-slate-950 shadow-lg`}>
            <Icon className="h-6 w-6 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-white">{reward.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{reward.detail}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-black text-amber-300">
            <Zap className="h-3.5 w-3.5 fill-amber-300" />
            +{reward.xp}
          </div>
          <Sparkles className="absolute -right-1 -top-1 h-5 w-5 animate-pulse text-white/80" />
          <ChevronUp className="absolute bottom-1 right-3 h-3 w-3 animate-bounce text-white/30" />
        </div>
      </div>
    </div>
  );
};
