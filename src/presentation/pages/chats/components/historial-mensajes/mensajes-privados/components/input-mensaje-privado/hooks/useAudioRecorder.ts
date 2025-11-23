import { useState, useRef, useEffect } from 'react';
import { TipoArchivo } from '../../../../../../../../../domain/enums';

export const useAudioRecorder = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // refs internas reales
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // visualizer
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isRecording) {
      id = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(id);
  }, [isRecording]);


  const enableVisualizer = (stream: MediaStream) => {
    const ctx = new AudioContext();
    const analyserNode = ctx.createAnalyser();

    analyserNode.fftSize = 2048;

    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyserNode);

    setAudioContext(ctx);
    setAnalyser(analyserNode);
  };

  const startRecording = async () => {
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

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const clearAudio = () => {
    setAudioBlob(null);
    chunksRef.current = [];
  };

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
    audioBlob,
    analyser,
    startRecording,
    stopRecording,
    clearAudio,
    toArchivo,
    time
  };
};
