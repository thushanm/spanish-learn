import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SPANISH_WORDS, SPANISH_UNITS } from '../data/spanishData';
import { SpanishWordPhrase, CEFRLevel } from '../types';
import { speakSpanish } from '../utils/speech';
import { playClickSound } from '../utils/soundEffects';
import { Search, Volume2, Mic, Filter, BookOpen, Film, Lightbulb } from 'lucide-react';

export const DictionarySearch: React.FC = () => {
  const { stats, setSelectedUnitId, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(ALL_SPANISH_WORDS.map(w => w.category)));

  const filteredWords = ALL_SPANISH_WORDS.filter(w => {
    const matchesSearch =
      w.spanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.phonetic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || w.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  const playAudio = (text: string) => {
    playClickSound(stats.soundEnabled);
    speakSpanish(text, {
      rate: stats.speechRate,
      preferredAccent: stats.preferredAccent
    });
  };

  const jumpToPractice = (word: SpanishWordPhrase) => {
    playClickSound(stats.soundEnabled);
    // Find the unit containing this word
    const unit = SPANISH_UNITS.find(u => u.items.some(i => i.id === word.id));
    if (unit) {
      setSelectedUnitId(unit.id);
    }
    setActiveTab('practice');
  };

  return (
    <div className="mobile-page max-w-5xl mx-auto px-4 py-5 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Spanish-English Vocabulary (A1 - B2)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Spanish Dictionary & Phrase Bank
          </h1>
          <p className="text-sm text-slate-400">
            Explore {ALL_SPANISH_WORDS.length} key conversational phrases with native audio, phonetics, and instant voice practice
          </p>
        </div>
      </div>

      {/* Search Input & Filters */}
      <div className="space-y-3 bg-slate-900/90 p-4 sm:p-5 rounded-[28px] sm:rounded-3xl border border-slate-800 shadow-xl">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Spanish word, English translation, or phonetic pronunciation..."
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* CEFR Level Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Level:
            </span>
            {['all', 'A1', 'A2', 'B1', 'B2'].map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  playClickSound(stats.soundEnabled);
                  setSelectedLevel(lvl);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lvl === 'all' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-rose-500"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.length > 0 ? (
          filteredWords.map((word) => (
            <div
              key={word.id}
              className="p-4 sm:p-5 rounded-[24px] sm:rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {word.category}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      word.level === 'A1'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : word.level === 'A2'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : word.level === 'B1'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    Level {word.level}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                    {word.spanish}
                  </h3>
                  <p className="text-xs font-mono text-amber-300 mt-0.5 font-semibold">
                    [{word.phonetic}]
                  </p>
                  <p className="text-sm text-slate-300 mt-1 font-medium">
                    "{word.english}"
                  </p>

                  {/* Cinema Badge */}
                  {word.filmReference && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold mt-1">
                      <Film className="w-3 h-3 text-rose-400" />
                      <span>{word.filmReference}</span>
                    </div>
                  )}

                  {/* Creative Mnemonic Anchor */}
                  {word.mnemonic && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-left flex items-start gap-2 mt-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        <strong className="text-amber-400">Memory Anchor:</strong> {word.mnemonic}
                      </p>
                    </div>
                  )}
                </div>

                {word.exampleSpanish && (
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Example in Context:</span>
                    <p className="italic text-slate-300">{word.exampleSpanish}</p>
                    <p className="text-slate-500 text-[11px]">"{word.exampleEnglish}"</p>
                  </div>
                )}
              </div>

              {/* Action buttons on card */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => playAudio(word.spanish)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Listen</span>
                </button>

                <button
                  onClick={() => jumpToPractice(word)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Practice with Voice</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 space-y-2">
            <p className="text-base font-semibold">No phrases found matching your search.</p>
            <p className="text-xs text-slate-500">Try another search term or reset your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
