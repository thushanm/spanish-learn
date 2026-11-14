import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type GlowAccent = 'gold' | 'emerald' | 'amethyst' | 'cyan' | 'none';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  accent?: GlowAccent;
  interactive?: boolean;
  children: React.ReactNode;
}

const ACCENT_STYLES: Record<GlowAccent, { border: string; glow: string }> = {
  gold: {
    border: 'border-amber-400/35 hover:border-amber-400/60',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.12)]'
  },
  emerald: {
    border: 'border-emerald-400/35 hover:border-emerald-400/60',
    glow: 'shadow-[0_0_24px_rgba(16,185,129,0.12)]'
  },
  amethyst: {
    border: 'border-purple-400/35 hover:border-purple-400/60',
    glow: 'shadow-[0_0_24px_rgba(139,92,246,0.12)]'
  },
  cyan: {
    border: 'border-cyan-400/35 hover:border-cyan-400/60',
    glow: 'shadow-[0_0_24px_rgba(6,182,212,0.12)]'
  },
  none: {
    border: 'border-slate-800/80 hover:border-slate-700',
    glow: 'shadow-xl'
  }
};

export const GlassCard: React.FC<GlassCardProps> = ({
  accent = 'none',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const { border, glow } = ACCENT_STYLES[accent];

  return (
    <motion.div
      whileHover={interactive ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`relative overflow-hidden rounded-[28px] sm:rounded-3xl border bg-[#0B0F19]/90 backdrop-blur-xl p-5 sm:p-7 text-slate-100 ${border} ${glow} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
