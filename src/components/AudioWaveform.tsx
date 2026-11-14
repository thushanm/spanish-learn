import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  color?: string;
  barCount?: number;
  height?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  color = '#E63946',
  barCount = 24,
  height = 48
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const centerY = canvas.height / 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isActive) {
          // Dynamic sine wave with noise simulation
          const wave1 = Math.sin(phase + i * 0.4);
          const wave2 = Math.cos(phase * 1.5 + i * 0.2);
          const combined = Math.abs(wave1 * 0.6 + wave2 * 0.4);
          barHeight = Math.max(6, combined * (canvas.height * 0.85));
        } else {
          barHeight = 4 + Math.sin(i * 0.5) * 2;
        }

        const x = i * barWidth + barWidth * 0.15;
        const w = barWidth * 0.7;
        const y = centerY - barHeight / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isActive) {
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, '#FFB703');
        } else {
          gradient.addColorStop(0, '#475569');
          gradient.addColorStop(1, '#334155');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, barHeight, 4);
        ctx.fill();
      }

      phase += isActive ? 0.14 : 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, color, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 10}
      height={height}
      className="w-full max-w-xs h-12 rounded-lg"
    />
  );
};
