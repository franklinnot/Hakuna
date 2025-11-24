/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useRef, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

export const NotaDeVoz = ({ url, esMio }: { url: string; esMio: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duracion, setDuracion] = useState('0:00');
  const [progress, setProgress] = useState(0);

  const animate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.duration && !isNaN(audio.duration)) {
      const newProgress = (audio.currentTime / audio.duration) * 100;

      // interpolación suave
      const smooth =
        progressRef.current + (newProgress - progressRef.current) * 0.15;

      progressRef.current = smooth;
      setProgress(smooth);
    }

    rafRef.current = requestAnimationFrame(animate);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.paused ? audio.play() : audio.pause();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => {
      if (audio.duration) {
        const min = Math.floor(audio.duration / 60);
        const sec = Math.floor(audio.duration % 60)
          .toString()
          .padStart(2, '0');
        setDuracion(`${min}:${sec}`);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(animate);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      progressRef.current = 0;
      setProgress(0);
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-xl shadow-sm w-60 mb-1',
        esMio ? 'bg-indigo-600' : 'bg-gray-300',
      )}
    >
      <audio ref={audioRef} src={url} preload="metadata" className="hidden" />

      <button
        onClick={togglePlay}
        className={clsx(
          'w-9 h-9 rounded-full flex items-center justify-center',
          esMio ? 'bg-indigo-500' : 'bg-gray-400',
        )}
      >
        {isPlaying ? (
          <PauseIcon className="w-5 h-5 text-white" />
        ) : (
          <PlayIcon className="w-5 h-5 text-white" />
        )}
      </button>

      <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
        <div
          style={{ width: `${progress}%` }}
          className={clsx('h-full', esMio ? 'bg-white' : 'bg-indigo-600')}
        />
      </div>
      <span
        className={clsx(
          'text-[10px] block mt-1',
          esMio ? 'text-indigo-200' : 'text-gray-700',
        )}
      >
        {duracion}
      </span>
    </div>
  );
};