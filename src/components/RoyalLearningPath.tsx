import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SPANISH_UNITS } from '../data/spanishData';
import { useSoundEffects } from '../utils/useSoundEffects';
import { Crown, Star, Check, Lock, Gift, Sparkles, Trophy, Play } from 'lucide-react';

export const RoyalLearningPath: React.FC = () => {
  const { stats, selectedUnitId, setSelectedUnitId, setActiveTab, addXP } = useApp();
  const sounds = useSoundEffects(stats.soundEnabled);
  const activeNodeRef = useRef<HTMLDivElement | null>(null);
  const [openedChests, setOpenedChests] = useState<number[]>([]);

  // Find index of active lesson
  const activeIndex = SPANISH_UNITS.findIndex(u => u.id === selectedUnitId);
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;

  // Auto-scroll to active node on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeClick = (unitId: string, isLocked: boolean) => {
    if (isLocked) {
      sounds.playIncorrect();
      return;
    }
    sounds.playClick();
    setSelectedUnitId(unitId);
    setActiveTab('practice');
  };

  const handleOpenChest = (chestId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openedChests.includes(chestId)) return;

    sounds.playFanfare();
    setOpenedChests(prev => [...prev, chestId]);
    addXP(50);

    confetti({
      particleCount: 80,
      spread: 70,
      colors: ['#FFD700', '#F59E0B', '#10B981', '#EC4899'],
      origin: { y: 0.6 }
    });
  };

  // Alternating horizontal winding offsets
  const getOffsetClass = (index: number) => {
    const pattern = [0, 48, 80, 48, 0, -48, -80, -48];
    const offset = pattern[index % pattern.length];
    return offset;
  };

  return (
    <div className="relative py-8 select-none">
      <div className="text-center mb-8 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Camino Real del Español</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">Your Royal Journey to Fluency</h2>
        <p className="text-xs text-slate-400">Step by step through CEFR levels A1 to B2</p>
      </div>

      {/* Winding Path Nodes List */}
      <div className="relative flex flex-col items-center gap-10 sm:gap-14 max-w-md mx-auto">
        {SPANISH_UNITS.map((unit, index) => {
          const isCompleted = stats.completedUnits.includes(unit.id);
          const isActive = index === currentIndex;
          const isLocked = index > currentIndex && !isCompleted;
          const offset = getOffsetClass(index);

          // Add a Mystery Treasure Chest node every 4 lessons
          const showChestBefore = index > 0 && index % 4 === 0;
          const chestId = index;
          const chestClaimed = openedChests.includes(chestId);

          return (
            <React.Fragment key={unit.id}>
              {/* Mystery Chest Reward Node */}
              {showChestBefore && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col items-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleOpenChest(chestId, e)}
                    disabled={chestClaimed || isLocked}
                    className={`relative p-4 rounded-3xl border-b-4 transition-all ${
                      chestClaimed
                        ? 'bg-slate-800 border-slate-900 text-slate-500 opacity-60'
                        : 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300 border-amber-600 text-slate-950 shadow-xl shadow-amber-500/25 animate-bounce'
                    }`}
                  >
                    <Gift className="w-7 h-7" />
                    {!chestClaimed && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider border border-[#0B0F19]">
                        +50 XP
                      </span>
                    )}
                  </motion.button>
                  <span className="mt-1 text-[10px] font-bold text-amber-300">
                    {chestClaimed ? '✓ Recompensa Reclamada' : '🎁 Cofre del Tesoro'}
                  </span>
                </motion.div>
              )}

              {/* Lesson Node */}
              <div
                ref={isActive ? activeNodeRef : undefined}
                style={{ transform: `translateX(${offset}px)` }}
                className="relative flex flex-col items-center transition-transform"
              >
                {/* Active Floating Start Tooltip */}
                {isActive && (
                  <motion.div
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: [0, -6, 0], opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute -top-11 z-20 whitespace-nowrap px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-lg uppercase tracking-wider flex items-center gap-1 border border-amber-300"
                  >
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>¡EMPEZAR!</span>
                  </motion.div>
                )}

                {/* 3D Circular Lesson Button */}
                <motion.button
                  whileHover={isLocked ? undefined : { scale: 1.08 }}
                  whileTap={isLocked ? undefined : { y: 4 }}
                  onClick={() => handleNodeClick(unit.id, isLocked)}
                  className={`relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-[26px] border-b-[5px] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300 border-amber-600 shadow-[0_0_28px_rgba(245,158,11,0.45)] text-slate-950 ring-4 ring-amber-400/30'
                      : isCompleted
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-700 shadow-lg shadow-emerald-500/20 text-slate-950'
                      : 'bg-slate-800 border-slate-950 text-slate-500 cursor-not-allowed opacity-75'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-8 h-8 stroke-[3]" />
                  ) : isActive ? (
                    <Crown className="w-8 h-8 stroke-[2.5]" />
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}

                  {/* Level Pill */}
                  <span
                    className={`absolute -bottom-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      isActive
                        ? 'bg-slate-950 border-amber-400 text-amber-300'
                        : isCompleted
                        ? 'bg-slate-950 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {unit.level}
                  </span>
                </motion.button>

                {/* Node Title & Star Rating */}
                <div className="mt-3 text-center max-w-[170px]">
                  <p className={`text-xs font-black truncate ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
                    {unit.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {unit.subtitle}
                  </p>

                  {/* 3 Golden Stars for completed lessons */}
                  {isCompleted && (
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
