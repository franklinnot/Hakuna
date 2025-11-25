import {
  TrashIcon,
  PaperAirplaneIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';

export default function AudioRecordingBar({
  analyser,
  isRecording,
  isPaused,
  time,
  onCancel,
  onSend,
  onPauseResume,
}: {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  isPaused: boolean;
  time: number;
  onCancel: () => void;
  onSend: () => void;
  onPauseResume: () => void;
}) {
  const canvasRef = useRef(null);
  const duration = time > 0 ? time : 0;

  useEffect(() => {
    if (!analyser || !canvasRef.current || !isRecording || isPaused) return;

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const maxBars = 18; // Máximo de barras visibles
    const step = Math.ceil(bufferLength / maxBars);

    const draw = () => {
      if (!isRecording || isPaused) return;
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      const barWidth = 1; // Ancho fijo de la barra
      const space = 2; // Espacio entre barras
      let x = 0;

      for (let i = 0; i < maxBars; i++) {
        const frequencyIndex = i * step;
        const barHeightValue = data[frequencyIndex] || 0;

        // Calculamos la altura de la barra
        const h = (barHeightValue / 255) * canvas.height;

        // Dibujamos la barra
        ctx.fillRect(x, canvas.height - h, barWidth, h);

        // Movemos la posición de inicio para la siguiente barra
        x += barWidth + space;

        // Paramos si nos salimos del canvas (medida de seguridad)
        if (x > canvas.width) break;
      }
    };

    draw();
  }, [analyser, isRecording, isPaused]);

  if (!isRecording && duration === 0) return null;

  // Formato de tiempo MM:SS
  const mm = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0');
  const ss = (duration % 60).toString().padStart(2, '0');
  const timeDisplay = `${mm}:${ss}`;

  // Determinamos el icono de Pausa/Reproducir
  const PausePlayIcon = isPaused ? PlayIcon : PauseIcon;

  return (
    <div className="w-full bg-gray-800 px-3 py-2 flex items-center justify-end shadow-lg">
      <button
        onClick={onCancel}
        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
        aria-label="Delete recording"
      >
        <TrashIcon className="size-5" />
      </button>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-gray-200 font-mono text-sm min-w-[40px] text-left">
          {timeDisplay}
        </span>

        <canvas
          ref={canvasRef}
          width={400}
          height={30}
          className={`flex-1 h-[30px] ${
            isPaused || duration === 0 ? 'opacity-30' : ''
          }`}
        />
      </div>

      <button
        onClick={onPauseResume}
        className="p-1.5 mx-2 text-white bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
        aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
      >
        <PausePlayIcon className="size-5" />
      </button>

      <button
        onClick={onSend}
        disabled={duration === 0}
        className="ml-2 bg-emerald-500 text-white rounded-full p-2 disabled:bg-gray-600 disabled:opacity-50 hover:bg-emerald-400 transition-colors"
        aria-label="Send recording"
      >
        <PaperAirplaneIcon className="size-5" />
      </button>
    </div>
  );
}
