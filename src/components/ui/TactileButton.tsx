import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useSoundEffects } from '../../utils/useSoundEffects';
import { useApp } from '../../context/AppContext';

export type ButtonVariant =
  | 'gold'
  | 'emerald'
  | 'amethyst'
  | 'cyan'
  | 'danger'
  | 'slate'
  | 'candy-green'
  | 'sun-yellow'
  | 'sky-blue'
  | 'bubblegum-pink'
  | 'grape-purple'
  | 'coral-red'
  | 'cloud-white';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface TactileButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  soundType?: 'click' | 'snap' | 'pop';
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; border: string; text: string; shadow: string }> = {
  // Vibrant Arcade Candy Colors (Duolingo / Candy Crush style)
  'candy-green': {
    bg: 'bg-[#58CC02] hover:bg-[#61E002]',
    border: 'border-b-[6px] border-[#46A302] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(70,163,2,0.4)]'
  },
  'sun-yellow': {
    bg: 'bg-[#FFC800] hover:bg-[#FFD21A]',
    border: 'border-b-[6px] border-[#E5A400] active:border-b-0',
    text: 'text-slate-900 font-black',
    shadow: 'shadow-[0_6px_0_rgba(229,164,0,0.4)]'
  },
  'sky-blue': {
    bg: 'bg-[#1CB0F6] hover:bg-[#25B8FC]',
    border: 'border-b-[6px] border-[#1899D6] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(24,153,214,0.4)]'
  },
  'bubblegum-pink': {
    bg: 'bg-[#FF6492] hover:bg-[#FF7A9F]',
    border: 'border-b-[6px] border-[#E54877] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(229,72,119,0.4)]'
  },
  'grape-purple': {
    bg: 'bg-[#A855F7] hover:bg-[#B66BFC]',
    border: 'border-b-[6px] border-[#8B2BE2] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(139,43,226,0.4)]'
  },
  'coral-red': {
    bg: 'bg-[#FF4B4B] hover:bg-[#FF5C5C]',
    border: 'border-b-[6px] border-[#EA2B2B] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(234,43,43,0.4)]'
  },
  'cloud-white': {
    bg: 'bg-slate-800 hover:bg-slate-750',
    border: 'border-b-[6px] border-slate-950 active:border-b-0',
    text: 'text-slate-100 font-black',
    shadow: 'shadow-[0_6px_0_rgba(2,6,23,0.7)]'
  },
  // Legacy aliases seamlessly mapped to chunky arcade jelly style
  gold: {
    bg: 'bg-[#FFC800] hover:bg-[#FFD21A]',
    border: 'border-b-[6px] border-[#E5A400] active:border-b-0',
    text: 'text-slate-900 font-black',
    shadow: 'shadow-[0_6px_0_rgba(229,164,0,0.4)]'
  },
  emerald: {
    bg: 'bg-[#58CC02] hover:bg-[#61E002]',
    border: 'border-b-[6px] border-[#46A302] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(70,163,2,0.4)]'
  },
  amethyst: {
    bg: 'bg-[#A855F7] hover:bg-[#B66BFC]',
    border: 'border-b-[6px] border-[#8B2BE2] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(139,43,226,0.4)]'
  },
  cyan: {
    bg: 'bg-[#1CB0F6] hover:bg-[#25B8FC]',
    border: 'border-b-[6px] border-[#1899D6] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(24,153,214,0.4)]'
  },
  danger: {
    bg: 'bg-[#FF4B4B] hover:bg-[#FF5C5C]',
    border: 'border-b-[6px] border-[#EA2B2B] active:border-b-0',
    text: 'text-white font-black',
    shadow: 'shadow-[0_6px_0_rgba(234,43,43,0.4)]'
  },
  slate: {
    bg: 'bg-slate-800/90 hover:bg-slate-700',
    border: 'border-b-[6px] border-slate-950 active:border-b-0',
    text: 'text-slate-200 font-bold',
    shadow: 'shadow-[0_6px_0_rgba(2,6,23,0.7)]'
  }
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs rounded-2xl min-h-[40px]',
  md: 'px-6 py-3.5 text-sm rounded-[22px] min-h-[50px]',
  lg: 'px-8 py-4.5 text-base rounded-[26px] min-h-[58px]'
};

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'cyan',
  size = 'md',
  fullWidth = false,
  soundType = 'pop',
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
    } else if (soundType === 'pop') {
      sounds.playBubblePop();
    } else {
      sounds.playClick();
    }
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { y: 6, scaleX: 1.05, scaleY: 0.95 }}
      transition={{ type: 'spring', stiffness: 550, damping: 22 }}
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
