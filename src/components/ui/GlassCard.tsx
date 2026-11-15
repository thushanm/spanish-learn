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
    border: 'border-amber-300',
    shadow: 'shadow-[0_8px_0_rgba(251,191,36,0.5)]'
  },
  emerald: {
    border: 'border-emerald-300',
    shadow: 'shadow-[0_8px_0_rgba(110,231,183,0.5)]'
  },
  amethyst: {
    border: 'border-purple-300',
    shadow: 'shadow-[0_8px_0_rgba(216,180,254,0.5)]'
  },
  cyan: {
    border: 'border-sky-300',
    shadow: 'shadow-[0_8px_0_rgba(125,211,252,0.5)]'
  },
  none: {
    border: 'border-white',
    shadow: 'shadow-[0_8px_0_rgba(0,0,0,0.08)]'
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
      className={`relative overflow-hidden rounded-[28px] sm:rounded-[32px] border-4 bg-white/95 backdrop-blur-xl p-5 sm:p-7 text-slate-800 ${border} ${shadow} shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CartoonCard = GlassCard;
