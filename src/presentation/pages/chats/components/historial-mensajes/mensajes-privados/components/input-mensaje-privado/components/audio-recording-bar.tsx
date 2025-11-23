import { TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';

export default function AudioRecordingBar({
  analyser,
  isRecording,
  time,
  onCancel,
  onSend,
}: {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  time: number;
  onCancel: () => void;
  onSend: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(data);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff33';
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const h = (data[i] / 255) * canvas.height;
        ctx.fillRect(x, canvas.height - h, barWidth, h);
        x += barWidth + 1;
      }
    };

    draw();
  }, [analyser, isRecording]);

  if (!isRecording) return null;

  const mm = Math.floor(time / 60);
  const ss = String(time % 60).padStart(2, '0');

  return (
    <div className="w-full bg-gray-900 px-4 py-3 flex items-center gap-4">
      <span className="text-gray-200 w-10 text-center">
        {mm}:{ss}
      </span>

      <canvas ref={canvasRef} width={400} height={40} className="flex-1 h-10" />

      <button onClick={onCancel} className="text-gray-400 px-2">
        <TrashIcon className="size-6" />
      </button>

      <button
        onClick={onSend}
        className="bg-emerald-500 text-white rounded-xl px-3 py-1"
      >
        <PaperAirplaneIcon className="size-5" />
      </button>
    </div>
  );
}
