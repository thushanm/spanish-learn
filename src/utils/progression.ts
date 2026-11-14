import { UserStats } from '../types';

export interface PlayerLevel {
  level: number;
  title: string;
  nextTitle: string;
  minXp: number;
  nextXp: number;
  progress: number;
}

const LEVELS = [
  { title: 'Hola Starter', nextTitle: 'Phrase Explorer', minXp: 0, nextXp: 80 },
  { title: 'Phrase Explorer', nextTitle: 'Conversation Builder', minXp: 80, nextXp: 220 },
  { title: 'Conversation Builder', nextTitle: 'Story Seeker', minXp: 220, nextXp: 450 },
  { title: 'Story Seeker', nextTitle: 'Confident Speaker', minXp: 450, nextXp: 760 },
  { title: 'Confident Speaker', nextTitle: 'Spanish Pro', minXp: 760, nextXp: 1150 },
  { title: 'Spanish Pro', nextTitle: 'Spanish Pro', minXp: 1150, nextXp: 1500 }
];

export function getPlayerLevel(xp: number): PlayerLevel {
  let safeIndex = 0;
  LEVELS.forEach((level, index) => {
    if (xp >= level.minXp) safeIndex = index;
  });
  const current = LEVELS[safeIndex];
  const span = Math.max(1, current.nextXp - current.minXp);

  return {
    level: safeIndex + 1,
    title: current.title,
    nextTitle: current.nextTitle,
    minXp: current.minXp,
    nextXp: current.nextXp,
    progress: Math.max(0, Math.min(100, Math.round(((xp - current.minXp) / span) * 100)))
  };
}

export function getDailyQuest(stats: UserStats) {
  const todayAttempts = stats.accuracyHistory.find(entry => entry.date === 'Today')?.wordsCount || 0;
  const completed = Math.min(3, todayAttempts);
  return {
    completed,
    target: 3,
    progress: Math.round((completed / 3) * 100),
    label: completed >= 3 ? 'Daily quest complete — great work!' : `${3 - completed} short practice round${3 - completed === 1 ? '' : 's'} to complete today’s quest`
  };
}
