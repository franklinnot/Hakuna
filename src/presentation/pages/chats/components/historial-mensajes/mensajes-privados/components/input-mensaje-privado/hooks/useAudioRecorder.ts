import { useState, useRef, useEffect } from 'react';
import { TipoArchivo } from '../../../../../../../../../domain/enums';

export const useAudioRecorder = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // 👈 NUEVO ESTADO PARA PAUSA

  // refs internas reales
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // visualizer
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [time, setTime] = useState(0);

  // ---------------------------------------
  // CONTROL DEL TIEMPO
  // ---------------------------------------
  useEffect(() => {
    let id: NodeJS.Timeout;
    // Solo incrementamos el tiempo si está grabando Y NO está pausado
    if (isRecording && !isPaused) {
      id = setInterval(() => setTime((t) => t + 1), 1000);
    } else if (!isRecording && !audioBlob) {
      // Si no hay grabación ni blob (grabación limpia/cancelada), reseteamos el tiempo
      setTime(0);
    }
    return () => clearInterval(id);
  }, [isRecording, isPaused, audioBlob]); // 👈 Añadimos isPaused como dependencia

  // ---------------------------------------
  // VISUALIZER (Sin cambios)
  // ---------------------------------------

  const enableVisualizer = (stream: MediaStream) => {
    const ctx = new AudioContext();
    const analyserNode = ctx.createAnalyser();

    analyserNode.fftSize = 2048;

    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyserNode);

    setAudioContext(ctx);
    setAnalyser(analyserNode);
  };

  // ---------------------------------------
  // INICIAR GRABACIÓN (Sin cambios)
  // ---------------------------------------

  const startRecording = async () => {
    // Limpiamos cualquier audio previo antes de empezar
    clearAudio();
    setIsPaused(false); // Aseguramos que no esté pausado al iniciar

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // guardar stream
    streamRef.current = mediaStream;

    // preparar visualizer
    enableVisualizer(mediaStream);

    // preparar MediaRecorder
    const recorder = new MediaRecorder(mediaStream);
    mediaRecorderRef.current = recorder;

    chunksRef.current = []; // limpiar chunks previos

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);

      // detener tracks del stream
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      // cerrar audioContext
      audioContext?.close().catch(() => {});
    };

    recorder.start();
    setIsRecording(true);
  };

  // ---------------------------------------
  // DETENER GRABACIÓN (Sin cambios en lógica, solo reubicación)
  // ---------------------------------------

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false); // Aseguramos que el estado de pausa se limpie al detener
  };

  // ---------------------------------------
  // PAUSA Y REANUDACIÓN 👈 NUEVAS FUNCIONES
  // ---------------------------------------

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'paused'
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  // ---------------------------------------
  // LIMPIAR AUDIO
  // ---------------------------------------

  const clearAudio = () => {
    // Si estamos grabando, detenemos primero la grabación (para limpiar recursos)
    if (isRecording) {
      stopRecording();
    }
    setAudioBlob(null);
    chunksRef.current = [];
    setTime(0); // Aseguramos el reseteo del tiempo
    setIsPaused(false);
  };

  // ---------------------------------------
  // CONVERSIÓN A ARCHIVO (Sin cambios)
  // ---------------------------------------

  const toArchivo = async () => {
    if (!audioBlob) return null;

    const b64 = await blobToBase64(audioBlob);
    return {
      tipoArchivo: TipoArchivo.AUDIO,
      b64,
      nombre: `audio-${Date.now()}.webm`,
    };
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  return {
    isRecording,
    isPaused,
    audioBlob,
    analyser,
    time,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearAudio,
    toArchivo,
  };
};
