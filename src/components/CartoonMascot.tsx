import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp, CartoonMascotMood } from '../context/AppContext';
import { speakSpanish } from '../utils/speech';
import { useCartoonAudio } from '../utils/useSoundEffects';
import { Sparkles, Volume2, CloudRain, Trophy, Flame } from 'lucide-react';

interface MascotSpeech {
  spanish: string;
  english: string;
  tag: string;
}

const MASCOT_PHRASES: Record<CartoonMascotMood, MascotSpeech[]> = {
  idle: [
    { spanish: '¡Hola amigo! ¿Listo para aprender hoy?', english: 'Hey friend! Ready to learn today?', tag: '¡Vamos!' },
    { spanish: '¡Toca una lección y subamos de nivel!', english: 'Tap a lesson and let\'s level up!', tag: '¡A jugar!' },
    { spanish: '¡El español es súper divertido!', english: 'Spanish is super fun!', tag: '¡Diversión!' },
  ],
  cheering: [
    { spanish: '¡¡HURRA!! ¡Lo hiciste increíble!', english: 'HURRAY!! You did incredible!', tag: '¡Increíble!' },
    { spanish: '¡¡GENIAL!! ¡Esa respuesta fue perfecta!', english: 'GENIUS!! That answer was perfect!', tag: '¡Genial!' },
    { spanish: '¡¡SÚPER BIEN!! ¡Eres un crack total!', english: 'SUPER GOOD!! You are a natural star!', tag: '¡Súper!' },
  ],
  party_dance: [
    { spanish: '¡¡FIESTA TOTAL!! ¡Estás que ardes!', english: 'TOTAL PARTY!! You are on fire!', tag: '🔥 COMBO' },
    { spanish: '¡¡RACHA ÉPICA!! ¡Nadie puede pararte!', english: 'EPIC STREAK!! Nobody can stop you!', tag: '🔥 FIESTA' },
    { spanish: '¡¡BAILE DE VICTORIA!! ¡A tope!', english: 'VICTORY DANCE!! Maximum power!', tag: '🔥 PODER' },
  ],
  sad: [
    { spanish: '¡Oh no! Casi lo tenías...', english: 'Oh no! You were so close...', tag: '¡Casi!' },
    { spanish: '¡Tranqui! De los fallos se aprende.', english: 'Don\'t worry! Mistakes help us learn.', tag: '¡Ánimo!' },
  ],
  crying: [
    { spanish: '¡Buaaa! ¡Pero no te rindas, inténtalo conmigo!', english: 'Waaah! But don\'t give up, let\'s try together!', tag: '¡Vamos!' },
    { spanish: '¡Sé que puedes hacerlo! ¡Una vez más!', english: 'I know you can do it! One more try!', tag: '¡Tú puedes!' },
  ],
  celebrate_finish: [
    { spanish: '¡¡CAMPEÓN ABSOLUTO!! ¡Misión cumplida!', english: 'ABSOLUTE CHAMPION!! Mission complete!', tag: '🏆 ¡VICTORIA!' },
  ],
};

export const CartoonMascot: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { stats, mascotMood, setMascotMood, comboStreak } = useApp();
  const audio = useCartoonAudio(stats.soundEnabled);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState(false);

  // Blinking eyes timer in idle state
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  const phrases = MASCOT_PHRASES[mascotMood] || MASCOT_PHRASES.idle;
  const currentPhrase = phrases[phraseIndex % phrases.length];

  // Sound triggers on mascot state transitions
  useEffect(() => {
    if (!stats.soundEnabled) return;
    if (mascotMood === 'cheering') {
      audio.playBoing();
      audio.shoutCartoonCheer();
    } else if (mascotMood === 'party_dance') {
      audio.playCorrect(comboStreak || 3);
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
    } else if (mascotMood === 'sad') {
      audio.playCartoonWhistleDown();
    } else if (mascotMood === 'crying') {
      audio.playSadTrombone();
    } else if (mascotMood === 'celebrate_finish') {
      audio.playFanfare();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }
  }, [mascotMood]);

  const handleMascotTap = () => {
    audio.playBoing();
    setPhraseIndex(prev => prev + 1);
    if (mascotMood === 'idle') {
      setMascotMood('cheering');
      setTimeout(() => setMascotMood('idle'), 2400);
    }
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
  };

  const handlePronouncePhrase = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSpeakingVoice(true);
    speakSpanish(currentPhrase.spanish, {
      rate: 1.05,
      pitch: 1.3,
      onEnd: () => setIsSpeakingVoice(false)
    });
  };

  return (
    <div
      onClick={handleMascotTap}
      className={`group relative cursor-pointer select-none rounded-[32px] border-4 border-white bg-white/95 backdrop-blur-xl shadow-[0_12px_0_rgba(0,0,0,0.08)] p-4 sm:p-6 transition-transform hover:-translate-y-1 ${
        compact ? 'max-w-md mx-auto' : 'w-full'
      }`}
    >
      {/* Background Decorative Halos */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-300/30 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-sky-300/30 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* ================= CHICO THE CARTOON MASCOT SVG ================= */}
        <div className="relative shrink-0 flex items-center justify-center">
          {/* Dynamic Raincloud in Sad State */}
          <AnimatePresence>
            {mascotMood === 'sad' && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.5 }}
                animate={{ opacity: 1, y: -26, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -top-6 z-20 flex flex-col items-center"
              >
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-300 border-2 border-slate-400 text-slate-700 shadow-md">
                  <CloudRain className="w-4 h-4 text-sky-500 animate-bounce" />
                  <span className="text-[10px] font-black uppercase">¡Casi!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dancing Disco Sparkle in Party State */}
          <AnimatePresence>
            {mascotMood === 'party_dance' && (
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.18, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 z-0 rounded-full border-4 border-dashed border-amber-400 bg-gradient-to-tr from-amber-400/20 via-pink-400/20 to-sky-400/20"
              />
            )}
          </AnimatePresence>

          {/* Multi-Part Cartoon Character Animation */}
          <motion.div
            animate={
              mascotMood === 'cheering'
                ? {
                    y: [0, -48, -48, 0],
                    scaleY: [0.88, 1.25, 1.15, 1],
                    scaleX: [1.12, 0.9, 0.95, 1],
                    rotate: [0, -12, 12, 0]
                  }
                : mascotMood === 'party_dance'
                ? {
                    rotate: [-14, 14, -14],
                    x: [-8, 8, -8],
                    scaleY: [1, 0.95, 1],
                    scaleX: [1, 1.05, 1]
                  }
                : mascotMood === 'sad'
                ? {
                    y: [0, 8, 8],
                    scaleY: [1, 0.94, 0.94],
                    rotate: [0, -4, -4]
                  }
                : mascotMood === 'crying'
                ? {
                    y: [0, 12, 8, 12],
                    scaleY: [1, 0.9, 0.92, 0.9],
                    rotate: [-2, 2, -2]
                  }
                : mascotMood === 'celebrate_finish'
                ? {
                    y: [0, -35, 0],
                    rotate: [0, 360],
                    scale: [1, 1.15, 1]
                  }
                : {
                    // Idle playful squat-and-stretch
                    scaleY: [1, 0.94, 1.04, 1],
                    scaleX: [1, 1.04, 0.96, 1],
                    y: [0, 3, -3, 0]
                  }
            }
            transition={
              mascotMood === 'cheering'
                ? { duration: 0.9, ease: 'easeOut' }
                : mascotMood === 'party_dance'
                ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
                : mascotMood === 'crying'
                ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
                : mascotMood === 'celebrate_finish'
                ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_0_rgba(0,0,0,0.12)]">
              {/* Ears */}
              <motion.g
                animate={
                  mascotMood === 'sad' || mascotMood === 'crying'
                    ? { rotate: -16, y: 5 }
                    : mascotMood === 'party_dance'
                    ? { rotate: [-6, 6, -6] }
                    : { rotate: [-2, 2, -2] }
                }
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Left Ear */}
                <path d="M 24 35 L 14 10 L 38 22 Z" fill="#F97316" stroke="#C2410C" strokeWidth="3" strokeLinejoin="round" />
                <path d="M 23 31 L 18 16 L 33 23 Z" fill="#FDA4AF" />
              </motion.g>

              <motion.g
                animate={
                  mascotMood === 'sad' || mascotMood === 'crying'
                    ? { rotate: 16, y: 5 }
                    : mascotMood === 'party_dance'
                    ? { rotate: [6, -6, 6] }
                    : { rotate: [2, -2, 2] }
                }
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Right Ear */}
                <path d="M 76 35 L 86 10 L 62 22 Z" fill="#F97316" stroke="#C2410C" strokeWidth="3" strokeLinejoin="round" />
                <path d="M 77 31 L 82 16 L 67 23 Z" fill="#FDA4AF" />
              </motion.g>

              {/* Head Body Base */}
              <circle cx="50" cy="52" r="34" fill="#F97316" stroke="#C2410C" strokeWidth="3.5" />

              {/* White Cream Cheeks/Muzzle */}
              <path
                d="M 24 58 C 24 76, 76 76, 76 58 C 66 50, 34 50, 24 58 Z"
                fill="#FFFFFF"
              />

              {/* Pink Cute Blush Circles */}
              <circle cx="28" cy="56" r="5" fill="#FB7185" opacity="0.75" />
              <circle cx="72" cy="56" r="5" fill="#FB7185" opacity="0.75" />

              {/* Eyes Expression Logic */}
              {mascotMood === 'cheering' || mascotMood === 'celebrate_finish' ? (
                // Happy curved eyes ^ ^
                <g stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none">
                  <path d="M 33 46 Q 38 38 43 46" />
                  <path d="M 57 46 Q 62 38 67 46" />
                </g>
              ) : mascotMood === 'sad' ? (
                // Sad puppy watery eyes
                <g>
                  <circle cx="38" cy="45" r="5" fill="#1E293B" />
                  <circle cx="62" cy="45" r="5" fill="#1E293B" />
                  <circle cx="36" cy="43" r="2.2" fill="#FFFFFF" />
                  <circle cx="60" cy="43" r="2.2" fill="#FFFFFF" />
                </g>
              ) : mascotMood === 'crying' ? (
                // Closed crying eyes > <
                <g stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none">
                  <path d="M 32 42 L 42 46 L 32 50" />
                  <path d="M 68 42 L 58 46 L 68 50" />
                </g>
              ) : mascotMood === 'party_dance' ? (
                // Cool Party Sunglasses
                <g>
                  <rect x="28" y="38" width="18" height="13" rx="3" fill="#18181B" stroke="#000000" strokeWidth="1.5" />
                  <rect x="54" y="38" width="18" height="13" rx="3" fill="#18181B" stroke="#000000" strokeWidth="1.5" />
                  <line x1="46" y1="43" x2="54" y2="43" stroke="#000000" strokeWidth="2.5" />
                  <line x1="30" y1="40" x2="42" y2="40" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
                  <line x1="56" y1="40" x2="68" y2="40" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
                </g>
              ) : (
                // Normal Cute Blinking Eyes
                <g>
                  <ellipse cx="38" cy="45" rx="4.5" ry={isBlinking ? 0.6 : 5.5} fill="#1E293B" />
                  <ellipse cx="62" cy="45" rx="4.5" ry={isBlinking ? 0.6 : 5.5} fill="#1E293B" />
                  {!isBlinking && (
                    <>
                      <circle cx="36.5" cy="43" r="2" fill="#FFFFFF" />
                      <circle cx="40" cy="47" r="1" fill="#FFFFFF" />
                      <circle cx="60.5" cy="43" r="2" fill="#FFFFFF" />
                      <circle cx="64" cy="47" r="1" fill="#FFFFFF" />
                    </>
                  )}
                </g>
              )}

              {/* Cute Black Button Nose */}
              <polygon points="50,53 46,49 54,49" fill="#1E293B" />

              {/* Mouth Expression Logic */}
              {mascotMood === 'cheering' || mascotMood === 'celebrate_finish' ? (
                // Big laughing mouth
                <g>
                  <path d="M 42 57 Q 50 70 58 57 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                  <path d="M 45 62 Q 50 67 55 62 Z" fill="#FDA4AF" />
                </g>
              ) : mascotMood === 'crying' ? (
                // Dramatic wobbly crying mouth
                <path d="M 42 63 Q 50 56 58 63" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : mascotMood === 'sad' ? (
                // Small downward sad mouth
                <path d="M 44 61 Q 50 57 56 61" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              ) : mascotMood === 'party_dance' ? (
                // Singing open mouth
                <ellipse cx="50" cy="60" rx="4.5" ry="6" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
              ) : (
                // Cute smiling cat/dog muzzle :3
                <path d="M 45 56 Q 48 59 50 56 Q 52 59 55 56" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              )}
            </svg>

            {/* Active Blue Tear Droplets Spraying When Crying */}
            {mascotMood === 'crying' && (
              <>
                <motion.div
                  animate={{ y: [0, 32], x: [-6, -24], opacity: [1, 0], scale: [0.8, 1.4] }}
                  transition={{ duration: 0.65, repeat: Infinity, ease: 'easeIn' }}
                  className="absolute left-3 top-10 w-3 h-4 rounded-full bg-sky-400 border border-sky-500 shadow-sm"
                />
                <motion.div
                  animate={{ y: [0, 32], x: [6, 24], opacity: [1, 0], scale: [0.8, 1.4] }}
                  transition={{ duration: 0.65, repeat: Infinity, ease: 'easeIn', delay: 0.15 }}
                  className="absolute right-3 top-10 w-3 h-4 rounded-full bg-sky-400 border border-sky-500 shadow-sm"
                />
              </>
            )}

            {/* Shooting Stars around head when Cheering */}
            {mascotMood === 'cheering' && (
              <>
                <motion.span
                  animate={{ scale: [0, 1.3, 0], rotate: [0, 180], y: [-10, -25] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="absolute -top-3 -left-2 text-xl"
                >
                  ⭐
                </motion.span>
                <motion.span
                  animate={{ scale: [0, 1.3, 0], rotate: [0, -180], y: [-10, -25] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
                  className="absolute -top-3 -right-2 text-xl"
                >
                  ✨
                </motion.span>
              </>
            )}
          </motion.div>
        </div>

        {/* ================= CHUNKY CARTOON SPEECH BUBBLE ================= */}
        <div className="min-w-0 flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-amber-400 bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-spin" />
              <span>Chico · Mascot</span>
            </span>

            <span className="rounded-full border-2 border-sky-300 bg-sky-100 px-2.5 py-0.5 text-[11px] font-black uppercase text-sky-800">
              {currentPhrase.tag}
            </span>

            {comboStreak >= 2 && (
              <span className="rounded-full border-2 border-orange-400 bg-orange-100 px-2.5 py-0.5 text-[11px] font-black uppercase text-orange-700 flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                <span>{comboStreak}x Streak</span>
              </span>
            )}
          </div>

          <div className="relative rounded-2xl border-3 border-slate-200 bg-slate-50 p-3 sm:p-4 text-slate-800 shadow-inner">
            <p className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-snug">
              &ldquo;{currentPhrase.spanish}&rdquo;
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              {currentPhrase.english}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              onClick={handlePronouncePhrase}
              disabled={isSpeakingVoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-b-4 border-sky-600 bg-sky-400 hover:bg-sky-500 active:border-b-0 active:translate-y-1 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeakingVoice ? 'Escuchando...' : 'Escuchar'}</span>
            </button>

            <span className="text-[11px] font-bold text-slate-400">
              ¡Toca a Chico para celebrar! 🎉
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
