import { useState, useRef } from 'react';
import { TipoArchivo } from '../../../../../../../domain/enums';

export const useAudioRecorder = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];
    setIsRecording(true);

    mediaRecorderRef.current.ondataavailable = (e) =>
      chunksRef.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      setIsRecording(false);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const clearAudio = () => setAudioBlob(null);

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
    startRecording,
    stopRecording,
    clearAudio,
    toArchivo,
  };
};