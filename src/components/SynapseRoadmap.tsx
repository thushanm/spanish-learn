import React, { useState } from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { LearningUnit } from '../types';
import { playClickSound } from '../utils/soundEffects';
import {
  Brain,
  Sparkles,
  Lock,
  CheckCircle2,
  Mic,
  Puzzle,
  Headphones,
  Zap,
  ChevronRight,
  Flame,
  Layers,
  ArrowUpRight,
  BookOpen,
  Activity
} from 'lucide-react';

export const SynapseRoadmap: React.FC = () => {
  const { stats, selectedUnitId, setSelectedUnitId, setActiveTab } = useApp();
  const [activeTier, setActiveTier] = useState<'ALL' | 'A1' | 'A2' | 'B1' | 'B2'>('ALL');

  const tiers: { level: 'A1' | 'A2' | 'B1' | 'B2'; title: string; subtitle: string; color: string }[] = [
    {
      level: 'A1',
      title: 'Foundational Synapses',
      subtitle: 'Core Greetings, Numbers, Daily Survival & Acoustic Basics',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
    },
    {
      level: 'A2',
      title: 'Conversational Pathways',
      subtitle: 'Dining, Travel, Routine Actions & Navigational Spanish',
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10'
    },
    {
      level: 'B1',
      title: 'Structural Fluency Conduits',
      subtitle: 'Professional Scenarios, Past Memories & Emergency Response',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10'
    },
    {
      level: 'B2',
      title: 'Cognitive Nuance & Nuance',
      subtitle: 'Debate, Idiomatic Subtlety, Emotional Depth & Abstract Ideas',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    }
  ];

  const handleSelectUnit = (unitId: string) => {
    playClickSound(stats.soundEnabled);
    setSelectedUnitId(unitId);
  };

  const handleLaunchActivity = (unitId: string, tab: ActiveTab) => {
    playClickSound(stats.soundEnabled);
    setSelectedUnitId(unitId);
    setActiveTab(tab);
  };

  const selectedUnit = SPANISH_UNITS.find(u => u.id === selectedUnitId) || SPANISH_UNITS[0];

  // Helper for simulated Ebbinghaus memory retention score
  const getMemoryRetention = (unitId: string, isCompleted: boolean) => {
    if (!isCompleted) return { percent: 0, status: 'Not Formed', badge: 'bg-slate-800 text-slate-500' };
    if (unitId === 'unit-1') return { percent: 94, status: 'Consolidated', badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
    return { percent: 86, status: 'Reinforced', badge: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' };
  };

  const filteredUnits = activeTier === 'ALL'
    ? SPANISH_UNITS
    : SPANISH_UNITS.filter(u => u.level === activeTier);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero: Cognitive Synaptic Overview */}
      <div className="mb-8 rounded-3xl bg-[#0B0F17] border border-slate-800/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cognitive Architecture</span>
              <span className="text-slate-500">•</span>
              <span>Ebbinghaus Spaced Repetition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Synaptic Spanish Roadmap
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Designed around neuroscience: instead of passive memorization, your brain builds synaptic reflex loops through speaking, syntax reconstruction, and auditory phoneme training.
            </p>
          </div>

          {/* Quick Mastery Metrics Card */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shrink-0">
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Mastery Index</span>
              <p className="text-xl font-black text-cyan-400 mt-1 font-mono">
                {Math.round((stats.completedUnits.length / SPANISH_UNITS.length) * 100)}%
              </p>
            </div>
            <div className="text-center px-3 border-x border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total XP</span>
              <p className="text-xl font-black text-amber-400 mt-1 font-mono">{stats.xp}</p>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Reflex Streak</span>
              <p className="text-xl font-black text-orange-400 mt-1 font-mono">{stats.streak}d</p>
            </div>
          </div>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">CEFR Filter:</span>
          {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => {
                playClickSound(stats.soundEnabled);
                setActiveTier(tier);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTier === tier
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {tier === 'ALL' ? 'All Synaptic Nodes' : `Level ${tier}`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Roadmap Grid: Neural Clusters */}
      <div className="space-y-10">
        {tiers
          .filter(t => activeTier === 'ALL' || activeTier === t.level)
          .map(tier => {
            const unitsInTier = filteredUnits.filter(u => u.level === tier.level);
            if (unitsInTier.length === 0) return null;

            return (
              <div key={tier.level} className="space-y-4">
                {/* Cluster Header */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${tier.color}`}>
                    CEFR {tier.level}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white">{tier.title}</h2>
                    <p className="text-xs text-slate-400">{tier.subtitle}</p>
                  </div>
                </div>

                {/* Node Cards in this Tier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unitsInTier.map((unit, index) => {
                    const isSelected = unit.id === selectedUnitId;
                    const isCompleted = stats.completedUnits.includes(unit.id);
                    const retention = getMemoryRetention(unit.id, isCompleted);

                    return (
                      <div
                        key={unit.id}
                        onClick={() => handleSelectUnit(unit.id)}
                        className={`rounded-2xl border p-5 transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-500/80 ring-2 ring-cyan-500/20 shadow-xl shadow-cyan-500/10'
                            : 'bg-[#0B0F17]/90 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        {/* Top Node Indicator & Retention Pill */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105 ${
                              isCompleted
                                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                                : 'bg-slate-800 border border-slate-700 text-slate-300'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-base text-white group-hover:text-cyan-300 transition-colors">
                                {unit.title}
                              </h3>
                              <p className="text-xs text-slate-400">{unit.subtitle}</p>
                            </div>
                          </div>

                          <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${retention.badge}`}>
                            {retention.percent > 0 ? `${retention.percent}% Retention` : 'Unexplored'}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {unit.description}
                        </p>

                        {/* Modality Fast Action Buttons */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleLaunchActivity(unit.id, 'practice');
                              }}
                              title="Voice Lab (Strict Speech Recognition)"
                              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Mic className="w-3.5 h-3.5" />
                              <span>Speak</span>
                            </button>

                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleLaunchActivity(unit.id, 'builder');
                              }}
                              title="Syntax Architecture Builder"
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Puzzle className="w-3.5 h-3.5" />
                              <span>Syntax</span>
                            </button>

                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleLaunchActivity(unit.id, 'listening');
                              }}
                              title="Acoustic Audio Lab"
                              className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Headphones className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </button>
                          </div>

                          <span className="text-[11px] font-bold text-slate-500 group-hover:text-cyan-400 flex items-center gap-1">
                            <span>{unit.items.length} phrases</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Selected Unit Active Synapse Spotlight Card */}
      {selectedUnit && (
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
              Active Focus Synapse: Level {selectedUnit.level}
            </span>
            <h3 className="text-xl font-black text-white">{selectedUnit.title}</h3>
            <p className="text-xs text-slate-400 max-w-xl">{selectedUnit.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleLaunchActivity(selectedUnit.id, 'practice')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Mic className="w-4 h-4" />
              <span>Launch Voice Lab</span>
            </button>
            <button
              onClick={() => handleLaunchActivity(selectedUnit.id, 'sprint')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Sprint Drill</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
