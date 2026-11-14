import React from 'react';
import { Check, X, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { SpeechScoreResult } from '../types';

interface DuolingoBottomDrawerProps {
  scoreResult: SpeechScoreResult | null;
  targetSpanish: string;
  targetEnglish: string;
  phonetic: string;
  onContinue: () => void;
  onRetry: () => void;
  onPlayTargetAudio: () => void;
}

export const DuolingoBottomDrawer: React.FC<DuolingoBottomDrawerProps> = ({
  scoreResult,
  targetSpanish,
  targetEnglish,
  phonetic,
  onContinue,
  onRetry,
  onPlayTargetAudio
}) => {
  if (!scoreResult) return null;

  const isSuccess = scoreResult.score >= 60;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 transition-all duration-300 transform translate-y-0 shadow-2xl border-t-2 animate-in slide-in-from-bottom duration-200 ${
        isSuccess
          ? 'bg-[#d7ffb8] dark:bg-[#132a13] border-[#58cc02] text-[#2b5900] dark:text-[#a5f36e]'
          : 'bg-[#ffdfe0] dark:bg-[#2b1416] border-[#ff4b4b] text-[#ea2b2b] dark:text-[#ff8585]'
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Status & Details */}
        <div className="flex items-start gap-4">
          {/* Big Circular Icon */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-md ${
              isSuccess
                ? 'bg-[#58cc02] text-white animate-bounce-subtle'
                : 'bg-[#ff4b4b] text-white'
            }`}
          >
            {isSuccess ? <Check className="w-8 h-8 stroke-[3.5]" /> : <X className="w-8 h-8 stroke-[3.5]" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {isSuccess
                  ? scoreResult.score >= 85
                    ? 'Excellent pronunciation!'
                    : 'Good attempt, well understood!'
                  : 'Correct solution:'}
              </h3>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                  isSuccess
                    ? 'bg-[#58cc02]/20 border-[#58cc02] text-[#3c7a02] dark:text-[#58cc02]'
                    : 'bg-[#ff4b4b]/20 border-[#ff4b4b] text-[#ea2b2b] dark:text-[#ff8585]'
                }`}
              >
                {scoreResult.score}% Accuracy
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold opacity-90">
              {scoreResult.feedbackText}
            </p>

            {!isSuccess && (
              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  [{phonetic}]
                </span>
                <button
                  onClick={onPlayTargetAudio}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#ff4b4b] hover:underline"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Chunky 3D Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {!isSuccess && (
            <button
              onClick={onRetry}
              className="px-5 py-3 rounded-2xl font-extrabold text-sm uppercase tracking-wider bg-slate-200 dark:bg-[#1b2a32] text-slate-700 dark:text-slate-200 border-b-4 border-slate-300 dark:border-[#2b3d47] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          )}

          <button
            onClick={onContinue}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-lg ${
              isSuccess
                ? 'bg-[#58cc02] border-[#58a700] hover:bg-[#61e002]'
                : 'bg-[#ff4b4b] border-[#ea2b2b] hover:bg-[#ff5e5e]'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
