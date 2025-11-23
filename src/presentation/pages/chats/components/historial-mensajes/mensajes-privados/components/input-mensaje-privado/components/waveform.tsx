import { useEffect, useRef } from 'react';

export const Waveform = ({
  analyser,
}: {
  analyser: AnalyserNode | null;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const buffer = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(buffer);

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const barWidth = 4;
      const gap = 2;
      let x = 0;

      for (let i = 0; i < buffer.length; i += 8) {
        const v = buffer[i] / 255;
        const barHeight = v * H * 0.9;

        const y = (H - barHeight) / 2;

        ctx.fillStyle = '#4ade80';
        ctx.fillRect(x, y, barWidth, barHeight);

        x += barWidth + gap;
        if (x > W) break;
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={80}
      style={{ width: '100%', height: '80px' }}
    />
  );
};
