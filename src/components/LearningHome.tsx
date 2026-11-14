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
    <div className="mobile-page max-w-6xl mx-auto px-4 py-5 sm:py-10 space-y-5 sm:space-y-7">
      <section className="mobile-hero relative overflow-hidden rounded-[28px] sm:rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/50 via-[#0B0F17] to-indigo-950/40 p-5 sm:p-9 shadow-2xl">
        <div className="hero-orbit absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Your small Spanish win for today</span>
            </div>
            <h1 className="mt-3 text-[29px] leading-[1.1] font-black tracking-tight text-white sm:mt-4 sm:text-4xl">
              Hola! Let&apos;s make Spanish useful.
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-slate-300 sm:text-base">
              One short loop works better than a long, tiring lesson: understand it, recall it, say it, then use it in a real situation.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] sm:mt-5 sm:gap-3 sm:text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                About 10 minutes
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2">
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                {stats.streak > 0 ? `${stats.streak}-day streak` : 'Start your streak today'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => openActivity('practice')}
              className="mobile-primary-cta group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:scale-[1.02] hover:bg-cyan-300"
            >
              <Mic className="h-5 w-5" />
              Begin today&apos;s lesson
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-3 text-left backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-black text-amber-300"><Trophy className="h-4 w-4" /> Level {playerLevel.level}</span>
                <span className="font-bold text-slate-300">{playerLevel.title}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-700" style={{ width: `${playerLevel.progress}%` }} />
              </div>
              <p className="mt-1.5 text-[10px] font-semibold text-slate-500">{stats.xp}/{playerLevel.nextXp} XP · next: {playerLevel.nextTitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="game-journey rounded-[28px] border border-indigo-400/20 bg-gradient-to-r from-indigo-950/35 via-slate-900 to-fuchsia-950/30 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-300">Your path to Spanish Pro</p>
            <h2 className="mt-1 text-base font-black text-white sm:text-lg">Tiny wins become real conversations.</h2>
          </div>
          <span className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1.5 text-[11px] font-black text-fuchsia-200">Rank {playerLevel.level}</span>
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
              <div key={level} className={`rounded-2xl border p-1.5 sm:p-3 text-center ${unlocked ? 'border-cyan-400/30 bg-cyan-400/10' : 'border-slate-700/70 bg-slate-950/40 opacity-65'}`}>
                <p className={`text-sm font-black ${unlocked ? 'text-cyan-200' : 'text-slate-500'}`}>{level}</p>
                <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] font-bold leading-tight text-slate-400 truncate">{label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[28px] sm:rounded-3xl border border-slate-800 bg-[#0B0F17] p-4 sm:p-6 shadow-xl">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Today&apos;s path</p>
              <h2 className="mt-1 text-lg sm:text-xl font-black text-white">Three small steps, one real outcome</h2>
            </div>
            <span className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300">10 min total</span>
          </div>

          <div className="space-y-3">
            {missionSteps.map((step, index) => (
              <div key={step.title} className="mobile-step-card flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 sm:p-4 transition hover:border-slate-700">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${step.tone}`}>
                  {step.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-bold text-white">{index + 1}. {step.title}</span>
                    <span className="text-[11px] font-bold text-slate-500">{step.minutes}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.description}</p>
                </div>
                <button
                  onClick={() => openActivity(step.tab)}
                  className="self-center whitespace-nowrap rounded-xl px-2 py-2 text-[11px] sm:px-3 sm:text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/10 hover:text-cyan-200"
                >
                  {step.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] sm:rounded-3xl border border-amber-500/25 bg-gradient-to-b from-amber-950/35 to-[#0B0F17] p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 text-amber-300">
            <Target className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Real-life goal</span>
          </div>
          <h2 className="mt-3 text-xl font-black text-white">{selectedUnit.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{OUTCOMES[selectedUnit.id] || selectedUnit.description}</p>
          <div className="mt-5 border-t border-amber-500/15 pt-4">
            <p className="text-xs font-semibold text-amber-100">Aim to be understood, not to be perfect.</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">Mistakes become a short review list, so you get another friendly chance instead of starting over.</p>
          </div>
          <button
            onClick={() => openActivity('dialogue')}
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-amber-300 transition hover:text-amber-200"
          >
            <MessageCircle className="h-4 w-4" />
            Try a mini conversation
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </aside>
      </section>

      <section className="rounded-[28px] sm:rounded-3xl border border-slate-800 bg-[#0B0F17] p-4 sm:p-7 shadow-xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${LEVEL_STYLES[selectedUnit.level]}`}>
                {selectedUnit.level}
              </span>
              <span className="text-xs font-bold text-slate-500">Current lesson</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-black text-white">{selectedUnit.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{selectedUnit.subtitle}</p>
          </div>
          <button
            onClick={() => openActivity('practice')}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-slate-950 transition hover:bg-cyan-100"
          >
            <Volume2 className="h-4 w-4" />
            Listen and speak
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between gap-3 text-xs font-bold">
            <span className="text-slate-300">{masteredInSelectedUnit} of {selectedUnit.items.length} phrases practised successfully</span>
            <span className="text-cyan-300">{lessonProgress}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500" style={{ width: `${lessonProgress}%` }} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button onClick={() => openActivity('listening')} className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 text-left transition active:scale-[0.98] hover:bg-violet-500/10">
            <Headphones className="h-5 w-5 text-violet-300" />
            <p className="mt-2 text-sm font-bold text-white">Hear it first</p>
            <p className="mt-1 text-xs text-slate-400">Catch a missing word by ear.</p>
          </button>
          <button onClick={() => openActivity('builder')} className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-left transition active:scale-[0.98] hover:bg-indigo-500/10">
            <Puzzle className="h-5 w-5 text-indigo-300" />
            <p className="mt-2 text-sm font-bold text-white">Put it together</p>
            <p className="mt-1 text-xs text-slate-400">Build the sentence in Spanish order.</p>
          </button>
          <button onClick={() => openActivity('practice')} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-left transition active:scale-[0.98] hover:bg-cyan-500/10">
            <Mic className="h-5 w-5 text-cyan-300" />
            <p className="mt-2 text-sm font-bold text-white">Make it yours</p>
            <p className="mt-1 text-xs text-slate-400">Say the phrase and get useful feedback.</p>
          </button>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.55fr]">
        <div className="rounded-[28px] sm:rounded-3xl border border-slate-800 bg-[#0B0F17] p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Your progress</h2>
            </div>
            <span className="text-xs font-bold text-slate-500">Real practice only</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-slate-900 p-3">
              <p className="text-xl font-black text-emerald-300">{totalMastered}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Mastered</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-3">
              <p className="text-xl font-black text-amber-300">{reviewCount}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">To review</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-3">
              <p className="text-xl font-black text-cyan-300">{stats.xp}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">XP</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-200"><Sparkles className="h-4 w-4" /> Today&apos;s mini quest</span>
              <span className="text-[11px] font-black text-emerald-300">{dailyQuest.completed}/{dailyQuest.target}</span>
            </div>
            <div className="mt-2 flex gap-1.5">
              {Array.from({ length: dailyQuest.target }).map((_, index) => (
                <span key={index} className={`h-2 flex-1 rounded-full transition-all duration-500 ${index < dailyQuest.completed ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]' : 'bg-slate-800'}`} />
              ))}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-400">{dailyQuest.label}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-fuchsia-200">Level {playerLevel.level} · {playerLevel.title}</span>
              <span className="text-[11px] font-bold text-fuchsia-300">{playerLevel.progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-700" style={{ width: `${playerLevel.progress}%` }} />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Next rank: <span className="font-bold text-slate-200">{playerLevel.nextTitle}</span> at {playerLevel.nextXp} XP.</p>
          </div>
          <button onClick={() => setActiveTab('analytics')} className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-200">
            See learning details <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="rounded-[28px] sm:rounded-3xl border border-slate-800 bg-[#0B0F17] p-5 sm:p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <div>
                <h2 className="text-lg font-black text-white">Your adventure map</h2>
                <p className="text-xs text-slate-400">Beginner survival Spanish → confident pro conversations.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">{stats.completedUnits.length}/{SPANISH_UNITS.length} topics complete</span>
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
                  className={`rounded-2xl border p-4 text-left transition ${active ? 'border-cyan-400/60 bg-cyan-500/10 ring-1 ring-cyan-400/20' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${LEVEL_STYLES[unit.level]}`}>{unit.level}</span>
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">{unit.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">{OUTCOMES[unit.id] || unit.description}</p>
                  <p className="mt-3 text-[11px] font-semibold text-slate-500">{completeInUnit}/{unit.items.length} phrases mastered</p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-slate-500">Every path is open. Pick what excites you, then strengthen it with speaking and review.</p>
        </div>
      </section>
    </div>
  );
};

const RefreshIcon: React.FC = () => <Zap className="w-5 h-5" />;
