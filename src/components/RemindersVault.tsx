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
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakSpanish, stopSpeaking } from '../utils/speech';
import { CartoonMascot } from './CartoonMascot';
import { TactileButton } from './ui/TactileButton';
import { soundEffects } from '../utils/useSoundEffects';

export const RemindersVault: React.FC = () => {
  const { reminderWords, removeReminderWord, clearReminderWords, stats, addXP } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);

  const filteredWords = reminderWords.filter(item => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      item.spanish.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      (item.exampleSentence && item.exampleSentence.toLowerCase().includes(q))
    );
  });

  const handlePronounce = (word: string, phonetic?: string) => {
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
                  Reminders Vault
                </h1>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Vocabulario Guardado
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                Every word you long-press (for ~1.5s) anywhere in the app is neatly archived here in your vocabulary table!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-black">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{reminderWords.length} Saved Words</span>
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

        {/* Tip banner */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300 font-medium">
          <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Hold down any Spanish word in stories or lessons for 1.5 seconds. It vibrates and instantly lands in this table!
          </span>
        </div>
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
