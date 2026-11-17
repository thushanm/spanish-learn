import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Volume2,
  Trash2,
  Search,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Clock,
  Zap,
  GraduationCap,
  HardDrive,
  ShieldCheck,
  TrendingUp,
  History,
  Activity,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakSpanish, stopSpeaking } from '../utils/speech';
import { CartoonMascot } from './CartoonMascot';
import { TactileButton } from './ui/TactileButton';
import { soundEffects } from '../utils/useSoundEffects';

function formatStudyTime(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

function formatStudyTimeShort(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

export const RemindersVault: React.FC = () => {
  const { reminderWords, removeReminderWord, clearReminderWords, stats, addXP, isActivelyPracticing } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredWords = reminderWords.filter(item => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      item.spanish.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      (item.exampleSentence && item.exampleSentence.toLowerCase().includes(q))
    );
  });

  const handlePronounce = (word: string, _phonetic?: string) => {
    soundEffects.playSnap();
    if (stats.soundEnabled) {
      speakSpanish(word, { rate: 0.8 });
    }
  };

  const playAllReminders = () => {
    if (filteredWords.length === 0) return;
    soundEffects.playClick();
    setIsPlayingAll(true);
    let index = 0;

    const playNext = () => {
      if (index >= filteredWords.length) {
        setIsPlayingAll(false);
        setActivePlayingIndex(null);
        soundEffects.playFanfare();
        addXP(15);
        return;
      }

      setActivePlayingIndex(index);
      const current = filteredWords[index];
      if (stats.soundEnabled) {
        speakSpanish(current.spanish, {
          rate: 0.8,
          onEnd: () => {
            index++;
            setTimeout(playNext, 600);
          },
          onError: () => {
            setIsPlayingAll(false);
            setActivePlayingIndex(null);
          }
        });
      } else {
        index++;
        setTimeout(playNext, 600);
      }
    };

    playNext();
  };

  const stopPlayingAll = () => {
    stopSpeaking();
    setIsPlayingAll(false);
    setActivePlayingIndex(null);
  };

  return (
    <div className="mobile-page max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-7 space-y-5 sm:space-y-6 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-[28px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-400 p-[3px] shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-[#0B0F19] rounded-[13px] flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Reminders Vault & Memory Tracker
                </h1>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vocabulario & Actividad
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                Every long-pressed word and your daily study time are securely tracked and saved in phone memory!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Device Memory Stored</span>
            </span>

            {reminderWords.length > 0 && (
              <button
                onClick={clearReminderWords}
                title="Clear all saved reminders"
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            DAILY LEARNING ACTIVITY & MEMORY METER (DASHBOARD)
            Answers user request:
            1. kochara wela dawsat mee app eka use da (Active time today & all-time)
            2. wachana keeyak igena genada (Learned & Mastered words count)
            3. practice karada (Words practiced today & overall)
            4. hama ekak ma phone eka memory eka save wenna onaa (100% LocalStorage status)
        ========================================================================= */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Daily App Usage Time */}
          <div className="rounded-2xl border border-sky-500/30 bg-[#0B0F19]/80 p-3.5 sm:p-4 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-sky-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Active Time</span>
              </span>
              {isActivelyPracticing ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Counting
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Paused (Idle)
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {formatStudyTime(stats.dailyStudySecondsToday || 0)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              All-Time: <span className="text-sky-300 font-bold">{formatStudyTimeShort(stats.totalStudySeconds || 0)}</span>
            </p>
          </div>

          {/* Card 2: Learned & Mastered Words */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0B0F19]/80 p-3.5 sm:p-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Words Learned</span>
              </span>
              <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                Mastered
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {stats.wordsLearnedCount || stats.masteredItemIds?.length || 0}
              </span>
              <span className="text-xs text-slate-400 font-bold">words</span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              CEFR Mastery: <span className="text-emerald-300 font-bold">{stats.masteredItemIds?.length || 0} / 5,000</span>
            </p>
          </div>

          {/* Card 3: Words Practiced Today & Total */}
          <div className="rounded-2xl border border-amber-500/30 bg-[#0B0F19]/80 p-3.5 sm:p-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Practiced Today</span>
              </span>
              <span className="text-[10px] font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                ⚡ Drills
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {stats.wordsPracticedToday || 0}
              </span>
              <span className="text-xs text-slate-400 font-bold">today</span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Total Drills: <span className="text-amber-300 font-bold">{stats.wordsPracticedCount || 0}</span>
            </p>
          </div>

          {/* Card 4: Words Saved in Reminders Vault */}
          <div className="rounded-2xl border border-purple-500/30 bg-[#0B0F19]/80 p-3.5 sm:p-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-purple-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Vault Saved</span>
              </span>
              <span className="text-[10px] font-black text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                1.5s Hold
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {reminderWords.length}
              </span>
              <span className="text-xs text-slate-400 font-bold">saved</span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Status: <span className="text-purple-300 font-bold">Ready to Play</span>
            </p>
          </div>
        </div>

        {/* Device Memory & Active Learning Guarantee Bar */}
        <div className="mt-4 p-3 rounded-2xl bg-[#090D16] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Smart Active Time & Phone Memory:</strong> නිකන් App එක open කර තිබීමෙන් කාලය ගණන් නොගනී. ඔබ Stories කියවන විට, Cinema clips නරඹන විට, හෝ වචන හදන / පුහුණු වෙන විට පමණක් සැබෑ කාලය ගණනය වේ! (තත්පර 35ක් idle වුවහොත් timer එක pause වේ). සියලුම දත්ත phone මතකයේ (LocalStorage) ස්ථිරව සුරැකේ.
            </span>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sky-300 text-xs font-bold transition-all"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistory ? 'Hide Past Days' : 'View Past Days'}</span>
          </button>
        </div>

        {/* Collapsible Past Days History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-2xl bg-[#0A0F1A] border border-slate-800 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Daily Usage History (පසුගිය දිනවල භාවිතය)</span>
                </h4>
                <span className="text-[10px] text-slate-500">Auto-archived at midnight</span>
              </div>

              {stats.dailyUsageHistory && stats.dailyUsageHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {stats.dailyUsageHistory.map((rec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex justify-between items-center">
                      <span className="font-bold text-slate-300">{rec.date}</span>
                      <div className="text-right">
                        <div className="text-sky-300 font-bold">{formatStudyTimeShort(rec.seconds)}</div>
                        <div className="text-[10px] text-amber-400">{rec.wordsPracticed} words practiced</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Daily tracking started today! Every day at midnight, your study minutes and practiced words are permanently archived here.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Reminders Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action bar: Search & Play All */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0E1524]/90 border border-slate-800">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search words by Spanish or English..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <TactileButton
                variant={isPlayingAll ? 'coral-red' : 'candy-green'}
                size="sm"
                onClick={isPlayingAll ? stopPlayingAll : playAllReminders}
                className="shadow-sm"
              >
                {isPlayingAll ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Stop Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Listen All Words</span>
                  </>
                )}
              </TactileButton>
            </div>
          </div>

          {/* Structured Dark Arcade Table (වගුවක්) */}
          {filteredWords.length > 0 ? (
            <div className="rounded-[24px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Spanish Word (වචනය)</th>
                      <th className="py-3.5 px-4">Pronunciation (ශබ්දය)</th>
                      <th className="py-3.5 px-4">English Meaning (තේරුම)</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Context / Sentence</th>
                      <th className="py-3.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredWords.map((item, idx) => {
                      const isPlayingThis = activePlayingIndex === idx;

                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isPlayingThis
                              ? 'bg-amber-950/40 text-amber-200'
                              : 'hover:bg-slate-900/50 text-slate-200'
                          }`}
                        >
                          {/* Spanish Word with Audio */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handlePronounce(item.spanish, item.phonetic)}
                                title="Listen to pronunciation"
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isPlayingThis
                                    ? 'bg-amber-400 text-slate-950 border-amber-500 scale-110 shadow-md'
                                    : 'bg-slate-900 border-slate-700 text-sky-400 hover:bg-slate-800'
                                }`}
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-black text-sm text-white">
                                {item.spanish}
                              </span>
                            </div>
                          </td>

                          {/* Pronunciation / Phonetic guide */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-amber-300">
                            [{item.phonetic || item.spanish}]
                          </td>

                          {/* English Meaning */}
                          <td className="py-3.5 px-4 font-bold text-slate-300">
                            {item.english}
                          </td>

                          {/* Context / Sentence */}
                          <td className="py-3.5 px-4 hidden md:table-cell text-slate-400 italic text-[11px] max-w-xs truncate">
                            {item.exampleSentence || '—'}
                          </td>

                          {/* Delete action */}
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => removeReminderWord(item.id)}
                              title="Delete word from reminders"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border-2 border-slate-800 bg-[#121927]/60 p-8 text-center space-y-3">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-black text-white">No reminder words found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {searchTerm
                  ? 'No words match your search term. Try typing something else!'
                  : 'Your Reminders Vault is ready! Whenever you see a Spanish word in a story or lesson, hold it down for 1.5–2 seconds to save it right here.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Mascot Chico & Flash Practice (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-[24px] border-2 border-slate-700/60 bg-[#121927]/90 backdrop-blur-xl p-3 shadow-xl">
            <CartoonMascot compact={true} />
          </div>

          <div className="rounded-[24px] border-2 border-amber-500/40 bg-[#121927]/90 backdrop-blur-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
                Retention Challenge
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-bold">
              Reviewing your saved reminders regularly locks these words permanently into long-term memory!
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Total Saved:</span>
              <span className="text-amber-400 font-black">{reminderWords.length} Words</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
