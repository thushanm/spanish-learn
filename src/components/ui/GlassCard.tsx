import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type GlowAccent = 'gold' | 'emerald' | 'amethyst' | 'cyan' | 'none';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  accent?: GlowAccent;
  interactive?: boolean;
  children: React.ReactNode;
}

const ACCENT_STYLES: Record<GlowAccent, { border: string; shadow: string }> = {
  gold: {
    border: 'border-amber-400/40',
    shadow: 'shadow-[0_0_24px_rgba(251,191,36,0.18)]'
  },
  emerald: {
    border: 'border-emerald-400/40',
    shadow: 'shadow-[0_0_24px_rgba(88,204,2,0.18)]'
  },
  amethyst: {
    border: 'border-purple-400/40',
    shadow: 'shadow-[0_0_24px_rgba(168,85,247,0.18)]'
  },
  cyan: {
    border: 'border-sky-400/40',
    shadow: 'shadow-[0_0_24px_rgba(28,176,246,0.18)]'
  },
  none: {
    border: 'border-slate-700/60',
    shadow: 'shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
  }
};

export const GlassCard: React.FC<GlassCardProps> = ({
  accent = 'none',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const { border, shadow } = ACCENT_STYLES[accent];

  return (
    <motion.div
      whileHover={interactive ? { y: -3, scale: 1.01, transition: { duration: 0.15 } } : undefined}
      className={`relative overflow-hidden rounded-[28px] sm:rounded-[32px] border-2 bg-[#121927]/90 backdrop-blur-xl p-5 sm:p-7 text-slate-100 ${border} ${shadow} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CartoonCard = GlassCard;
