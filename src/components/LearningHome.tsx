import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Headphones,
  MessageCircle,
  Mic,
  Puzzle,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  Zap
} from 'lucide-react';
import { getDailyQuest, getPlayerLevel } from '../utils/progression';
import { CartoonMascot } from './CartoonMascot';
import { RoyalLearningPath } from './RoyalLearningPath';
import { TactileButton } from './ui/TactileButton';

const OUTCOMES: Record<string, string> = {
  'unit-1': 'Greet someone, introduce yourself, and be polite.',
  'unit-2': 'Talk about numbers, time, and simple plans.',
  'unit-3': 'Order food and handle a restaurant conversation.',
  'unit-4': 'Ask for directions and use public transport.',
  'unit-5': 'Talk about your routine, feelings, and hobbies.',
  'unit-6': 'Share a short story about a past experience.',
  'unit-7': 'Give an opinion, hope, and recommendation.',
  'unit-8': 'Sound more natural in everyday conversations.'
};

const LEVEL_STYLES: Record<string, string> = {
  A1: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  A2: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
  B1: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
  B2: 'bg-rose-500/10 border-rose-500/30 text-rose-300'
};

export const LearningHome: React.FC = () => {
  const { stats, selectedUnitId, setSelectedUnitId, setActiveTab } = useApp();

  const selectedUnit = SPANISH_UNITS.find(unit => unit.id === selectedUnitId)
    || SPANISH_UNITS.find(unit => !stats.completedUnits.includes(unit.id))
    || SPANISH_UNITS[0];
  const masteredInSelectedUnit = selectedUnit.items.filter(item => stats.masteredItemIds.includes(item.id)).length;
  const lessonProgress = Math.round((masteredInSelectedUnit / selectedUnit.items.length) * 100);
  const reviewCount = stats.mistakeWordList.length;
  const totalMastered = stats.masteredItemIds.length;
  const playerLevel = getPlayerLevel(stats.xp);
  const dailyQuest = getDailyQuest(stats);
  const journeyStage = stats.completedUnits.length >= 7 ? 3 : stats.completedUnits.length >= 5 ? 2 : stats.completedUnits.length >= 2 ? 1 : 0;

  const openActivity = (tab: ActiveTab, unitId = selectedUnit.id) => {
    setSelectedUnitId(unitId);
    setActiveTab(tab);
  };

  const chooseUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
  };

  const missionSteps: Array<{
    title: string;
    minutes: string;
    description: string;
    action: string;
    tab: ActiveTab;
    icon: React.ReactNode;
    tone: string;
  }> = [
    {
      title: reviewCount > 0 ? `Repair ${reviewCount} tricky phrase${reviewCount === 1 ? '' : 's'}` : 'Wake up what you know',
      minutes: '2 min',
      description: reviewCount > 0
        ? 'A short repeat of phrases that need one more successful try.'
        : 'A quick listening task gets Spanish into your ears before you speak.',
      action: reviewCount > 0 ? 'Review aloud' : 'Listen first',
      tab: reviewCount > 0 ? 'practice' : 'listening',
      icon: reviewCount > 0 ? <RefreshIcon /> : <Headphones className="w-5 h-5" />,
      tone: 'text-violet-300 bg-violet-500/10 border-violet-500/25'
    },
    {
      title: 'Build one useful sentence',
      minutes: '3 min',
      description: 'Put words in order, then notice the pattern instead of memorising a rule list.',
      action: 'Build a sentence',
      tab: 'builder',
      icon: <Puzzle className="w-5 h-5" />,
      tone: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25'
    },
    {
      title: 'Say it like you would outside',
      minutes: '5 min',
      description: 'Listen, speak, get a gentle score, and repeat only the phrases that need it.',
      action: 'Start speaking',
      tab: 'practice',
      icon: <Mic className="w-5 h-5" />,
      tone: 'text-amber-300 bg-amber-500/10 border-amber-500/25'
    }
  ];

  return (
    <div className="mobile-page max-w-6xl mx-auto px-4 py-5 sm:py-8 space-y-5 sm:space-y-6">
      {/* Chunky Cartoon Hero Card */}
      <section className="mobile-hero relative overflow-hidden rounded-[32px] border-4 border-white bg-white/95 backdrop-blur-xl p-5 sm:p-8 shadow-[0_12px_0_rgba(0,0,0,0.08)]">
        <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-sky-300 bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
              <Sparkles className="h-3.5 w-3.5 text-sky-600 animate-spin" />
              <span>Daily Spanish Win · Arcade</span>
            </div>
            <h1 className="mt-3 text-[29px] leading-[1.1] font-black tracking-tight text-slate-900 sm:mt-4 sm:text-4xl">
              ¡Hola! Let&apos;s make Spanish fun & useful.
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-slate-600 font-bold sm:text-base">
              One short dopamine loop works better than a boring lesson: understand it, build it, say it, and level up!
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] sm:mt-5 sm:gap-3 sm:text-xs font-black text-slate-700">
              <span className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-slate-100 px-3 py-2">
                <Clock className="h-4 w-4 text-sky-500" />
                About 10 minutes
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-amber-300 bg-amber-100 px-3 py-2 text-amber-800">
                <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
                {stats.streak > 0 ? `${stats.streak}-day streak!` : 'Start streak today!'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <TactileButton
              variant="candy-green"
              size="lg"
              onClick={() => openActivity('practice')}
              className="w-full sm:w-auto shadow-lg shadow-emerald-500/25"
            >
              <Mic className="h-5 w-5" />
              <span>Begin today&apos;s lesson</span>
              <ChevronRight className="h-4 w-4" />
            </TactileButton>
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5 text-left shadow-inner">
              <div className="flex items-center justify-between gap-4 text-xs font-black">
                <span className="flex items-center gap-1.5 text-amber-600"><Trophy className="h-4 w-4" /> Level {playerLevel.level}</span>
                <span className="text-slate-700">{playerLevel.title}</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 transition-all duration-700" style={{ width: `${playerLevel.progress}%` }} />
              </div>
              <p className="mt-1.5 text-[10px] font-bold text-slate-500">{stats.xp}/{playerLevel.nextXp} XP · next: {playerLevel.nextTitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expressive Cartoon Mascot Chico */}
      <CartoonMascot />

      {/* Cartoon Winding Learning Path with Pulsing Nodes & Chest Rewards */}
      <RoyalLearningPath />

      {/* Chunky Path to Spanish Pro */}
      <section className="game-journey rounded-[32px] border-4 border-white bg-white/95 backdrop-blur-xl p-4 sm:p-6 shadow-[0_12px_0_rgba(0,0,0,0.08)] text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-600">Your path to Spanish Pro</p>
            <h2 className="mt-1 text-base font-black text-slate-900 sm:text-lg">Tiny wins become real conversations.</h2>
          </div>
          <span className="rounded-2xl border-2 border-purple-300 bg-purple-100 px-3 py-1.5 text-[11px] font-black text-purple-800">Rank {playerLevel.level}</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5 sm:gap-3">
          {[
            ['A1', 'Start'],
            ['A2', 'Explore'],
            ['B1', 'Stories'],
            ['B2', 'Fluency']
          ].map(([level, label], index) => {
            const unlocked = index <= journeyStage;
            return (
              <div key={level} className={`rounded-2xl border-3 p-2 sm:p-3 text-center ${unlocked ? 'border-sky-300 bg-sky-100 shadow-sm' : 'border-slate-200 bg-slate-100 opacity-60'}`}>
                <p className={`text-sm sm:text-base font-black ${unlocked ? 'text-sky-800' : 'text-slate-400'}`}>{level}</p>
                <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] font-black leading-tight text-slate-600 truncate">{label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[32px] border-4 border-white bg-white/95 p-5 sm:p-7 shadow-[0_12px_0_rgba(0,0,0,0.08)] text-slate-800">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sky-600">Today&apos;s path</p>
              <h2 className="mt-1 text-lg sm:text-xl font-black text-slate-900">Three small steps, one real outcome</h2>
            </div>
            <span className="rounded-2xl border-2 border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700">10 min total</span>
          </div>

          <div className="space-y-3">
            {missionSteps.map((step, index) => (
              <div key={step.title} className="mobile-step-card flex gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5 sm:p-4 transition hover:border-sky-300">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 ${step.tone}`}>
                  {step.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-black text-slate-900">{index + 1}. {step.title}</span>
                    <span className="text-[11px] font-bold text-slate-400">{step.minutes}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 font-bold">{step.description}</p>
                </div>
                <button
                  onClick={() => openActivity(step.tab)}
                  className="self-center whitespace-nowrap rounded-2xl px-3 py-2 text-[11px] sm:text-xs font-black text-sky-700 border-2 border-sky-300 bg-sky-100 hover:bg-sky-200 transition-colors"
                >
                  {step.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[32px] border-4 border-white bg-white/95 p-5 sm:p-7 shadow-[0_12px_0_rgba(0,0,0,0.08)] text-slate-800">
          <div className="flex items-center gap-2 text-amber-700 font-black">
            <Target className="h-5 w-5 text-amber-600" />
            <span className="text-xs uppercase tracking-wider">Real-life goal</span>
          </div>
          <h2 className="mt-3 text-xl font-black text-slate-900">{selectedUnit.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 font-bold">{OUTCOMES[selectedUnit.id] || selectedUnit.description}</p>
          <div className="mt-5 border-t-2 border-slate-200 pt-4">
            <p className="text-xs font-black text-amber-800">Aim to be understood, not to be perfect.</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 font-bold">Mistakes become a short review list, so you get another friendly chance instead of starting over.</p>
          </div>
          <button
            onClick={() => openActivity('dialogue')}
            className="mt-5 inline-flex items-center gap-2 text-xs font-black text-amber-700 hover:text-amber-900 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Try a mini conversation
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </aside>
      </section>

      <section className="rounded-[32px] border-4 border-white bg-white/95 p-5 sm:p-7 shadow-[0_12px_0_rgba(0,0,0,0.08)] text-slate-800">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border-2 border-sky-300 bg-sky-100 px-3 py-1 text-xs font-black uppercase text-sky-800">
                {selectedUnit.level}
              </span>
              <span className="text-xs font-black text-slate-400">Current lesson</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">{selectedUnit.title}</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">{selectedUnit.subtitle}</p>
          </div>
          <TactileButton
            variant="candy-green"
            size="md"
            onClick={() => openActivity('practice')}
            className="self-start sm:self-center"
          >
            <Mic className="h-4 w-4" />
            <span>Practice this topic</span>
          </TactileButton>
        </div>

        <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3 text-xs font-black">
            <span className="text-slate-700">{masteredInSelectedUnit} of {selectedUnit.items.length} phrases mastered</span>
            <span className="text-emerald-600">{lessonProgress}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500" style={{ width: `${lessonProgress}%` }} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button onClick={() => openActivity('listening')} className="rounded-2xl border-3 border-purple-200 bg-purple-50 p-4 text-left transition active:scale-[0.98] hover:bg-purple-100 cursor-pointer shadow-sm">
            <Headphones className="h-5 w-5 text-purple-600" />
            <p className="mt-2 text-sm font-black text-slate-900">Hear it first</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Catch a missing word by ear.</p>
          </button>
          <button onClick={() => openActivity('builder')} className="rounded-2xl border-3 border-sky-200 bg-sky-50 p-4 text-left transition active:scale-[0.98] hover:bg-sky-100 cursor-pointer shadow-sm">
            <Puzzle className="h-5 w-5 text-sky-600" />
            <p className="mt-2 text-sm font-black text-slate-900">Put it together</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Build sentences in Spanish order.</p>
          </button>
          <button onClick={() => openActivity('practice')} className="rounded-2xl border-3 border-emerald-200 bg-emerald-50 p-4 text-left transition active:scale-[0.98] hover:bg-emerald-100 cursor-pointer shadow-sm">
            <Mic className="h-5 w-5 text-emerald-600" />
            <p className="mt-2 text-sm font-black text-slate-900">Say it out loud</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Practice speech with feedback.</p>
          </button>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.55fr]">
        <div className="rounded-[32px] border-4 border-white bg-white/95 p-5 sm:p-7 shadow-[0_12px_0_rgba(0,0,0,0.08)] text-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-black text-slate-900">Your Arcade Score</h2>
            </div>
            <span className="text-xs font-black text-slate-400">Real practice only</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xl font-black text-emerald-700">{totalMastered}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-slate-500">Mastered</p>
            </div>
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
              <p className="text-xl font-black text-amber-700">{reviewCount}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-slate-500">To review</p>
            </div>
            <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-3">
              <p className="text-xl font-black text-sky-700">{stats.xp}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-slate-500">XP</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-800"><Sparkles className="h-4 w-4" /> Daily Mini Quest</span>
              <span className="text-[11px] font-black text-emerald-800">{dailyQuest.completed}/{dailyQuest.target}</span>
            </div>
            <div className="mt-2 flex gap-1.5">
              {Array.from({ length: dailyQuest.target }).map((_, index) => (
                <span key={index} className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${index < dailyQuest.completed ? 'bg-emerald-500 shadow-sm' : 'bg-slate-200'}`} />
              ))}
            </div>
            <p className="mt-2 text-[11px] font-bold text-slate-600">{dailyQuest.label}</p>
          </div>
          <div className="mt-4 rounded-2xl border-2 border-purple-300 bg-purple-50 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-purple-900">Level {playerLevel.level} · {playerLevel.title}</span>
              <span className="text-[11px] font-black text-purple-700">{playerLevel.progress}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-sky-400 transition-all duration-700" style={{ width: `${playerLevel.progress}%` }} />
            </div>
            <p className="mt-2 text-[11px] font-bold text-slate-600">Next rank: <span className="font-black text-purple-900">{playerLevel.nextTitle}</span> at {playerLevel.nextXp} XP.</p>
          </div>
          <button onClick={() => setActiveTab('analytics')} className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-sky-700 hover:text-sky-900 cursor-pointer">
            See learning details <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="rounded-[32px] border-4 border-white bg-white/95 p-5 sm:p-7 shadow-[0_12px_0_rgba(0,0,0,0.08)] text-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-sky-600" />
              <div>
                <h2 className="text-lg font-black text-slate-900">Adventure Topic Map</h2>
                <p className="text-xs font-bold text-slate-500">Pick any topic to jump in.</p>
              </div>
            </div>
            <span className="text-xs font-black text-slate-500">{stats.completedUnits.length}/{SPANISH_UNITS.length} topics done</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {SPANISH_UNITS.map((unit, index) => {
              const done = stats.completedUnits.includes(unit.id);
              const active = unit.id === selectedUnit.id;
              const completeInUnit = unit.items.filter(item => stats.masteredItemIds.includes(item.id)).length;
              return (
                <button
                  key={unit.id}
                  onClick={() => chooseUnit(unit.id)}
                  className={`rounded-2xl border-3 p-4 text-left transition cursor-pointer ${active ? 'border-sky-400 bg-sky-50 shadow-md ring-2 ring-sky-300' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${done ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-700'}`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </span>
                    <span className="rounded-full border-2 border-slate-300 bg-white px-2 py-0.5 text-[10px] font-black text-slate-700">{unit.level}</span>
                  </div>
                  <p className="mt-3 text-sm font-black text-slate-900">{unit.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-500">{OUTCOMES[unit.id] || unit.description}</p>
                  <p className="mt-3 text-[11px] font-bold text-slate-400">{completeInUnit}/{unit.items.length} phrases mastered</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

const RefreshIcon: React.FC = () => <Zap className="w-5 h-5" />;
