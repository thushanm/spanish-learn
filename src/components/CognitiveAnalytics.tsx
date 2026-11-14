import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS, ALL_SPANISH_WORDS } from '../data/spanishData';
import { speakSpanish } from '../utils/speech';
import { playClickSound, playCorrectSound } from '../utils/soundEffects';
import {
  BarChart3,
  TrendingUp,
  Award,
  Flame,
  Brain,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Trash2,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CognitiveAnalytics: React.FC = () => {
  const { stats, resetProgress, removeMistakeWord, setActiveTab } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mistakes'>('all');

  const playWordAudio = (text: string) => {
    playClickSound(stats.soundEnabled);
    speakSpanish(text, {
      rate: stats.speechRate,
      preferredAccent: stats.preferredAccent
    });
  };

  const handleReset = () => {
    playClickSound(stats.soundEnabled);
    resetProgress();
    setShowResetConfirm(false);
  };

  const handleWordClear = (id: string) => {
    playCorrectSound(stats.soundEnabled);
    removeMistakeWord(id);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  // Calculate CEFR level breakdown
  const cefrCounts = {
    A1: ALL_SPANISH_WORDS.filter(w => w.level === 'A1').length,
    A2: ALL_SPANISH_WORDS.filter(w => w.level === 'A2').length,
    B1: ALL_SPANISH_WORDS.filter(w => w.level === 'B1').length,
    B2: ALL_SPANISH_WORDS.filter(w => w.level === 'B2').length
  };

  const maxChartAccuracy = 100;
  const hasPractice = stats.wordsPracticedCount > 0;

  return (
    <div className="mobile-page max-w-6xl mx-auto px-4 py-5 sm:py-8 space-y-5 sm:space-y-8 select-none">
      {/* Top Banner */}
      <div className="rounded-[28px] sm:rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Your learning progress</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Your Spanish progress
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              See what you have practised, what needs another try, and how your accuracy changes over time.
            </p>
          </div>

          {/* Quick Action: Reset Progress Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Reset progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Words Learned */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F17] border border-emerald-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Words Mastered
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-mono">{stats.wordsLearnedCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Phrases you have completed successfully
          </span>
        </div>

        {/* Mistake Words */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F17] border border-amber-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Words Needing Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">{stats.mistakeWordsCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            These will return for a gentle repeat
          </span>
        </div>

        {/* Average Accuracy */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F17] border border-cyan-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Average Accuracy
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-cyan-300 font-mono">{hasPractice ? `${stats.averageAccuracy}%` : '—'}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {hasPractice ? 'Across your completed practice attempts' : 'Complete an activity to see this'}
          </span>
        </div>

        {/* Total Synaptic XP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F17] border border-indigo-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Practice XP
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-indigo-300 font-mono">{stats.xp} XP</p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Streak: <strong className="text-amber-400">{stats.streak} day{stats.streak === 1 ? '' : 's'}</strong>
          </span>
        </div>
      </div>

      {/* Accuracy Progression Chart & Visual Retention Curve */}
      <div className="rounded-[28px] sm:rounded-3xl bg-[#0B0F17] border border-slate-800 p-4 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Accuracy over time</span>
            </h2>
            <p className="text-xs text-slate-400">
              This becomes useful after a few short practice sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Target: 75%+</span>
            </span>
          </div>
        </div>

        {/* SVG Bar / Trend Chart */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850">
          {hasPractice ? <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-6 px-4">
            {stats.accuracyHistory.map((session, idx) => {
              const heightPercent = Math.max(10, Math.min(100, session.accuracy));
              const isToday = session.date === 'Today';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <span className="text-[10px] font-mono font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {session.accuracy}%
                  </span>

                  {/* Visual Bar with Gradient */}
                  <div className="w-full max-w-[48px] bg-slate-900 rounded-xl overflow-hidden h-full flex items-end p-1">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ${
                        isToday
                          ? 'bg-gradient-to-t from-cyan-500 via-indigo-500 to-emerald-400'
                          : 'bg-gradient-to-t from-slate-700 to-cyan-500/70'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-[11px] font-bold ${isToday ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {session.date}
                  </span>
                </div>
              );
            })}
          </div> : (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <TrendingUp className="h-8 w-8 text-slate-600" />
              <p className="mt-3 text-sm font-bold text-slate-300">Your first practice result will appear here.</p>
              <p className="mt-1 text-xs text-slate-500">Try a listening, sentence-building, or speaking activity.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mistake Clinic / Weak Words Drill Down */}
      <div className="rounded-[28px] sm:rounded-3xl bg-[#0B0F17] border border-slate-800 p-4 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Review list</span>
            </h2>
            <p className="text-xs text-slate-400">
              Phrases that need another successful try. Repeating them later makes them easier to recall.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              {stats.mistakeWordList.length} words in review queue
            </span>
          </div>
        </div>

        {stats.mistakeWordList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-850 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Nothing waiting for review</h4>
            <p className="text-xs text-slate-400">
              When a phrase needs another try, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.mistakeWordList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{item.spanish}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      Missed {item.failedCount}x
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">"{item.english}"</p>
                  {item.phonetic && (
                    <p className="text-[11px] font-mono text-cyan-400/80">/{item.phonetic}/</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => playWordAudio(item.spanish)}
                    title="Listen to native pronunciation"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleWordClear(item.id)}
                    title="Remove from review list"
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[28px] sm:rounded-3xl bg-[#0B0F17] border border-slate-800 p-4 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Course content by level</span>
          </h2>
          <p className="text-xs text-slate-400">
            Explore the phrases currently available in each CEFR level.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 block">CEFR A1 (Beginner)</span>
            <p className="text-2xl font-black text-white font-mono mt-1">{cefrCounts.A1}</p>
            <span className="text-[10px] text-slate-500">Core survival, numbers & greetings</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-indigo-400 block">CEFR A2 (Elementary)</span>
            <p className="text-2xl font-black text-white font-mono mt-1">{cefrCounts.A2}</p>
            <span className="text-[10px] text-slate-500">Dining, transit, habits & emotion</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-purple-400 block">CEFR B1 (Intermediate)</span>
            <p className="text-2xl font-black text-white font-mono mt-1">{cefrCounts.B1}</p>
            <span className="text-[10px] text-slate-500">Past tenses, opinions & cinema drama</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-rose-400 block">CEFR B2 (Vantage)</span>
            <p className="text-2xl font-black text-white font-mono mt-1">{cefrCounts.B2}</p>
            <span className="text-[10px] text-slate-500">Subjunctive, slang & debate</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0B0F17] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white">Reset Learning Progress?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will clear your practiced word count, mistake history, and reset your XP and streak back to the initial baseline. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Reset All Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
