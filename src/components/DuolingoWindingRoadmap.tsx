import React from 'react';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { DuolingoMascot } from './DuolingoMascot';
import {
  Star,
  Check,
  Crown,
  Gift,
  Play,
  Smile,
  Clock,
  Utensils,
  Compass,
  Sun,
  BookOpen,
  Sparkles,
  Flame
} from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

const UNIT_ICONS: Record<string, React.ReactNode> = {
  'unit-1': <Smile className="w-8 h-8 stroke-[2.5]" />,
  'unit-2': <Clock className="w-8 h-8 stroke-[2.5]" />,
  'unit-3': <Utensils className="w-8 h-8 stroke-[2.5]" />,
  'unit-4': <Compass className="w-8 h-8 stroke-[2.5]" />,
  'unit-5': <Sun className="w-8 h-8 stroke-[2.5]" />,
  'unit-6': <BookOpen className="w-8 h-8 stroke-[2.5]" />,
  'unit-7': <Sparkles className="w-8 h-8 stroke-[2.5]" />,
  'unit-8': <Flame className="w-8 h-8 stroke-[2.5]" />
};

export const DuolingoWindingRoadmap: React.FC = () => {
  const { stats, selectedUnitId, setSelectedUnitId, setActiveTab } = useApp();

  const handleStartNode = (unitId: string) => {
    playClickSound(stats.soundEnabled);
    setSelectedUnitId(unitId);
    setActiveTab('practice');
  };

  // Horizontal offsets for the classic zigzag Duolingo winding snake path
  const getOffsetClass = (index: number) => {
    const pattern = [
      'translate-x-0',        // Center
      '-translate-x-12 sm:-translate-x-16', // Left
      '-translate-x-20 sm:-translate-x-28', // Far Left
      '-translate-x-10 sm:-translate-x-14', // Left Center
      'translate-x-0',        // Center
      'translate-x-12 sm:translate-x-16',  // Right
      'translate-x-20 sm:translate-x-28',  // Far Right
      'translate-x-0'         // Center Final
    ];
    return pattern[index % pattern.length];
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-12 select-none">
      {/* Top Duo Greeting with Mascot in English */}
      <div className="flex flex-col items-center text-center space-y-2">
        <DuolingoMascot
          mood="celebrating"
          speechText="Hello! Ready to speak Spanish like a native today?"
          size="md"
        />
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight pt-2">
          Spanish Fluency Learning Path
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
          Complete each stepping stone to unlock crowns and advance from A1 to B2
        </p>
      </div>

      {/* Winding Stepping Stones Path */}
      <div className="relative flex flex-col items-center space-y-14 py-4">
        {SPANISH_UNITS.map((unit, index) => {
          const isCompleted = stats.completedUnits.includes(unit.id);
          const isActive = (selectedUnitId === unit.id) || (!selectedUnitId && index === 0);
          const offsetClass = getOffsetClass(index);

          return (
            <div
              key={unit.id}
              className={`relative flex flex-col items-center ${offsetClass} transition-transform duration-300`}
            >
              {/* Floating Start Tooltip above active node */}
              {isActive && (
                <div className="absolute -top-12 z-20 animate-bounce-subtle">
                  <div className="bg-[#1cb0f6] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl border-b-2 border-[#1899d6] shadow-lg flex items-center gap-1">
                    <Play className="w-3 h-3 fill-white" />
                    <span>START!</span>
                  </div>
                  <div className="w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-[#1cb0f6] mx-auto" />
                </div>
              )}

              {/* Node Outer Ring & 3D Chunky Stepping Stone Button */}
              <div className="relative group">
                {/* SVG Progress Ring */}
                <svg className="absolute -inset-2.5 w-24 h-24 pointer-events-none transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke={isCompleted ? '#58cc02' : '#2b3d47'}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={276}
                    strokeDashoffset={isCompleted ? 0 : 90}
                    className="transition-all duration-700"
                  />
                </svg>

                {/* Main Stepping Stone Button */}
                <button
                  onClick={() => handleStartNode(unit.id)}
                  title={`${unit.title} (${unit.level})`}
                  className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center font-black transition-all transform active:translate-y-1.5 duration-150 ${
                    isCompleted
                      ? 'bg-[#ffc800] border-b-[6px] border-[#e5b400] text-amber-950 shadow-lg shadow-amber-500/20 active:border-b-0'
                      : isActive
                      ? 'bg-[#58cc02] border-b-[6px] border-[#58a700] text-white shadow-xl shadow-[#58cc02]/30 scale-105 active:border-b-0'
                      : 'bg-[#1b2a32] border-b-[6px] border-[#2b3d47] text-slate-300 hover:text-white hover:bg-[#23353f] active:border-b-0'
                  }`}
                >
                  {isCompleted ? (
                    <Crown className="w-9 h-9 fill-amber-950 stroke-[2.5]" />
                  ) : (
                    UNIT_ICONS[unit.id] || <Star className="w-8 h-8 fill-current" />
                  )}

                  {/* Level Tag under icon */}
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-90 mt-0.5">
                    {unit.level}
                  </span>
                </button>
              </div>

              {/* Unit Title and English Subtitle underneath */}
              <div className="text-center mt-3 max-w-[190px] space-y-0.5">
                <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-tight">
                  {unit.subtitle || unit.title}
                </h4>
                <p className="text-[11px] text-amber-500 dark:text-amber-400 font-bold truncate">
                  {unit.title}
                </p>
                {isCompleted && (
                  <div className="inline-flex items-center gap-1 text-[10px] font-black text-[#58cc02]">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>MASTERED</span>
                  </div>
                )}
              </div>

              {/* Intermittent Reward Chest every 3 nodes */}
              {(index === 2 || index === 5) && (
                <div className="mt-8 flex flex-col items-center animate-bounce-subtle">
                  <div className="w-14 h-14 rounded-2xl bg-[#ff9600] border-b-4 border-[#e58500] flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                    <Gift className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider mt-1">
                    Reward Chest
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Final Trophy Node at the End of the Road */}
        <div className="flex flex-col items-center pt-6 space-y-2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ffc800] to-amber-300 border-b-[8px] border-[#e5b400] flex items-center justify-center shadow-2xl text-amber-950">
            <Crown className="w-12 h-12 fill-amber-950 stroke-[2]" />
          </div>
          <h3 className="text-base font-black text-amber-500 uppercase tracking-wider">
            B2 Fluency Trophy!
          </h3>
          <p className="text-xs text-slate-400 font-bold max-w-xs text-center">
            Complete all units to unlock your certificate as a Fluent Spanish Speaker
          </p>
        </div>
      </div>
    </div>
  );
};
