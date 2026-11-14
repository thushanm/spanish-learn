import React from 'react';

export type MascotMood = 'idle' | 'speaking' | 'listening' | 'celebrating' | 'sad';

interface DuolingoMascotProps {
  mood?: MascotMood;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DuolingoMascot: React.FC<DuolingoMascotProps> = ({
  mood = 'idle',
  speechText,
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44'
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Duolingo Speech Bubble */}
      {speechText && (
        <div className="relative mb-3 max-w-xs animate-bounce-subtle">
          <div className="bg-white dark:bg-[#1b2a32] text-slate-800 dark:text-white px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-[#2b3d47] shadow-lg text-xs sm:text-sm font-bold text-center">
            {speechText}
          </div>
          {/* Bubble Pointer Triangle */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-[#1b2a32]" />
        </div>
      )}

      {/* SVG Cartoon Character Mascot (Paco the Spanish Parrot / Duo) */}
      <div className={`relative ${sizeMap[size]} transition-transform duration-300 ${mood === 'celebrating' ? 'scale-110' : ''}`}>
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Glow / Halo for celebrating */}
          {mood === 'celebrating' && (
            <circle cx="80" cy="80" r="75" fill="#FFC800" opacity="0.25" className="animate-pulse" />
          )}

          {/* Headphones when Listening */}
          {mood === 'listening' && (
            <g className="animate-pulse">
              <path
                d="M 28 80 A 52 52 0 0 1 132 80"
                stroke="#1CB0F6"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <rect x="20" y="65" width="16" height="30" rx="8" fill="#1899D6" />
              <rect x="124" y="65" width="16" height="30" rx="8" fill="#1899D6" />
            </g>
          )}

          {/* Party Hat when Celebrating */}
          {mood === 'celebrating' && (
            <g transform="translate(62, 5)">
              <polygon points="18,0 0,40 36,40" fill="#FF4B4B" />
              <circle cx="18" cy="0" r="6" fill="#FFC800" />
              <circle cx="12" cy="20" r="3" fill="#FFF" />
              <circle cx="22" cy="30" r="3" fill="#58CC02" />
            </g>
          )}

          {/* Main Body (Vibrant Duolingo Green) */}
          <ellipse cx="80" cy="95" rx="55" ry="50" fill="#58CC02" />
          {/* Belly Patch (Lighter Green) */}
          <ellipse cx="80" cy="105" rx="38" ry="32" fill="#8EE000" />

          {/* Wings */}
          {/* Left Wing */}
          <ellipse
            cx="28"
            cy="95"
            rx="12"
            ry="25"
            fill="#46A302"
            transform={mood === 'celebrating' ? 'rotate(-25 28 95)' : 'rotate(8 28 95)'}
            className="transition-transform duration-300"
          />
          {/* Right Wing */}
          <ellipse
            cx="132"
            cy="95"
            rx="12"
            ry="25"
            fill="#46A302"
            transform={mood === 'celebrating' ? 'rotate(25 132 95)' : 'rotate(-8 132 95)'}
            className="transition-transform duration-300"
          />

          {/* Face Elements */}
          {/* Left Big Eye White */}
          <ellipse cx="60" cy="72" rx="18" ry="20" fill="white" stroke="#2B3D47" strokeWidth="2.5" />
          {/* Right Big Eye White */}
          <ellipse cx="100" cy="72" rx="18" ry="20" fill="white" stroke="#2B3D47" strokeWidth="2.5" />

          {/* Eyeballs / Pupils */}
          {mood === 'sad' ? (
            // Sad droopy eyes
            <g>
              <ellipse cx="60" cy="76" rx="8" ry="6" fill="#2B3D47" />
              <ellipse cx="100" cy="76" rx="8" ry="6" fill="#2B3D47" />
              {/* Tear drop */}
              <circle cx="68" cy="85" r="4" fill="#1CB0F6" className="animate-bounce" />
            </g>
          ) : mood === 'celebrating' ? (
            // Star Eyes for victory!
            <g fill="#FFC800">
              <polygon points="60,65 63,73 70,73 64,77 66,85 60,80 54,85 56,77 50,73 57,73" />
              <polygon points="100,65 103,73 110,73 104,77 106,85 100,80 94,85 96,77 90,73 97,73" />
            </g>
          ) : (
            // Normal Big Pupils with shine
            <g>
              <ellipse cx="62" cy="73" rx="9" ry="11" fill="#2B3D47" />
              <ellipse cx="98" cy="73" rx="9" ry="11" fill="#2B3D47" />
              {/* Eye sparkle reflection */}
              <circle cx="59" cy="69" r="3.5" fill="white" />
              <circle cx="95" cy="69" r="3.5" fill="white" />
            </g>
          )}

          {/* Beak / Mouth (Warm Orange / Amber) */}
          {mood === 'speaking' ? (
            // Open beak when speaking
            <g className="animate-pulse">
              <path d="M 68 85 Q 80 75 92 85 Q 80 108 68 85 Z" fill="#FF9600" />
              <ellipse cx="80" cy="94" rx="8" ry="6" fill="#D83A56" />
              {/* Soundwaves */}
              <path d="M 100 88 A 12 12 0 0 1 100 100" stroke="#FFC800" strokeWidth="3" strokeLinecap="round" />
              <path d="M 108 84 A 18 18 0 0 1 108 104" stroke="#FFC800" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            // Cute triangle beak
            <path d="M 70 86 Q 80 80 90 86 Q 80 100 70 86 Z" fill="#FF9600" stroke="#E58500" strokeWidth="1.5" />
          )}

          {/* Cheerful Red Cheeks */}
          <ellipse cx="42" cy="85" rx="6" ry="4" fill="#FF7878" opacity="0.6" />
          <ellipse cx="118" cy="85" rx="6" ry="4" fill="#FF7878" opacity="0.6" />

          {/* Cute Orange Feet */}
          <ellipse cx="65" cy="142" rx="14" ry="6" fill="#FF9600" />
          <ellipse cx="95" cy="142" rx="14" ry="6" fill="#FF9600" />
        </svg>
      </div>
    </div>
  );
};
