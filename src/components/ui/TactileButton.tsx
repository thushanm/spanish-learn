import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useSoundEffects } from '../../utils/useSoundEffects';
import { useApp } from '../../context/AppContext';

export type ButtonVariant = 'gold' | 'emerald' | 'amethyst' | 'cyan' | 'danger' | 'slate';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface TactileButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  soundType?: 'click' | 'snap';
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; border: string; text: string; shadow: string }> = {
  gold: {
    bg: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300',
    border: 'border-b-4 border-amber-600 active:border-b-0',
    text: 'text-slate-950 font-black',
    shadow: 'shadow-lg shadow-amber-500/25'
  },
  emerald: {
    bg: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    border: 'border-b-4 border-emerald-700 active:border-b-0',
    text: 'text-slate-950 font-black',
    shadow: 'shadow-lg shadow-emerald-500/25'
  },
  amethyst: {
    bg: 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500',
    border: 'border-b-4 border-purple-800 active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-lg shadow-purple-500/25'
  },
  cyan: {
    bg: 'bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300',
    border: 'border-b-4 border-cyan-700 active:border-b-0',
    text: 'text-slate-950 font-black',
    shadow: 'shadow-lg shadow-cyan-500/25'
  },
  danger: {
    bg: 'bg-gradient-to-r from-rose-500 to-red-500',
    border: 'border-b-4 border-rose-800 active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-lg shadow-rose-500/25'
  },
  slate: {
    bg: 'bg-slate-800 hover:bg-slate-700',
    border: 'border-b-4 border-slate-950 active:border-b-0',
    text: 'text-slate-200 font-bold',
    shadow: 'shadow-md shadow-black/40'
  }
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs rounded-xl min-h-[38px]',
  md: 'px-5 py-3 text-sm rounded-2xl min-h-[46px]',
  lg: 'px-7 py-4 text-base rounded-[22px] min-h-[54px]'
};

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'cyan',
  size = 'md',
  fullWidth = false,
  soundType = 'click',
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  const { stats } = useApp();
  const sounds = useSoundEffects(stats.soundEnabled);

  const style = VARIANT_STYLES[variant];
  const sizeClass = SIZE_STYLES[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (soundType === 'snap') {
      sounds.playSnap();
    } else {
      sounds.playClick();
    }
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.015 }}
      whileTap={disabled ? undefined : { y: 3 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 select-none uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none ${
        style.bg
      } ${style.border} ${style.text} ${style.shadow} ${sizeClass} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
