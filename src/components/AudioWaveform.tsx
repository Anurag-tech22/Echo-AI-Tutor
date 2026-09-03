import React, { useRef, useEffect } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  isSpeaking: boolean;
  color?: string;
  className?: string;
}

export function AudioWaveform({
  isActive,
  isSpeaking,
  color = '#818cf8', // Indigo-400
  className = '',
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const bars = 32;
      const barWidth = width / bars;
      const centerY = height / 2;

      for (let i = 0; i < bars; i++) {
        // Multi-frequency sine superposition to create quantum neural waveform look
        const freq1 = Math.sin(phase + i * 0.25);
        const freq2 = Math.cos(phase * 1.5 + i * 0.4);
        const freq3 = Math.sin(phase * 0.8 + i * 0.15);

        let amplitude = 0.15; // idle baseline
        if (isSpeaking) {
          amplitude = 0.75 + 0.25 * Math.sin(phase * 4 + i);
        } else if (isActive) {
          amplitude = 0.45 + 0.15 * Math.cos(phase * 2 + i);
        }

        const combinedWave = Math.abs(freq1 * 0.5 + freq2 * 0.3 + freq3 * 0.2) * amplitude;
        const barHeight = Math.max(4, combinedWave * (height - 8));

        const x = i * barWidth + barWidth / 4;
        const y = centerY - barHeight / 2;

        // Gradient for OpenAI / Gemini Live aesthetic
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#c084fc'); // Purple-400
        gradient.addColorStop(0.5, color);   // Indigo-400
        gradient.addColorStop(1, '#38bdf8'); // Sky-400

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth / 2, barHeight, 3);
        ctx.fill();
      }

      phase += isSpeaking ? 0.12 : isActive ? 0.06 : 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, isSpeaking, color]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={36}
      className={`rounded-lg ${className}`}
    />
  );
}
