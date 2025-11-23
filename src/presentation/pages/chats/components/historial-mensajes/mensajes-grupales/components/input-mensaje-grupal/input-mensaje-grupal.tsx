import { useState } from 'react';
import { IChatGrupalResponse } from '../../../../../../../../domain/responses/chats.responses';
import {
  MicrophoneIcon,
  XMarkIcon,
  PhotoIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import { useSendMensajeGrupal } from '../../../../../../../../application/use-cases/mensajes/useSendMensajeGrupal';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import AudioRecordingBar from '../../../mensajes-privados/components/input-mensaje-privado/components/audio-recording-bar';
import { useFileHandling } from './hooks/useFileHandling';
import { Estado } from '../../../../../../../../domain/enums';

interface InputMensajeGrupalProps {
  chat: IChatGrupalResponse;
}

export const InputMensajeGrupal = ({
  chat,
}: InputMensajeGrupalProps) => {
  const [descripcion, setDescripcion] = useState('');
  
  // Verificar si el usuario actual está deshabilitado en el grupo
  const isUserDisabled = chat.estado_miembro === Estado.DESHABILITADO;

  // Hooks personalizados
  const { sendMensajeGrupal, isLoading } = useSendMensajeGrupal();
  const {
    isRecording,
    audioBlob,
    analyser,
    startRecording,
    stopRecording,
    clearAudio,
    toArchivo,
    time,
  } = useAudioRecorder();
  const {
    archivos,
    fileInputRef,
    handleAttachClick,
    handleFilesSelected,
    clearArchivos,
  } = useFileHandling();

  const handleSend = async () => {
    if (isLoading || isUserDisabled) return;
    const trimmed = descripcion.trim();

    // convertir audio a base64 (solo si existe)
    const audioArchivo = await toArchivo();
    const adjuntos = [
      ...(archivos ?? []),
      ...(audioArchivo ? [audioArchivo] : []),
    ];

    // si no hay texto ni adjuntos, no enviar nada
    if (!trimmed && !adjuntos.length) return;

    await sendMensajeGrupal({
      id_chat: chat.id_chat,
      descripcion: trimmed,
      archivos: adjuntos.length > 0 ? adjuntos : undefined,
    });

    // Limpiar campos
    setDescripcion('');
    clearArchivos();
    clearAudio();
  };

  // Si el usuario está deshabilitado, mostrar mensaje informativo
  if (isUserDisabled) {
    return (
      <footer className="flex items-center justify-center p-3 border-t border-gray-600 bg-gray-800">
        <div className="text-center text-gray-300">
          <p className="text-sm">No puedes enviar mensajes en este grupo</p>
          <p className="text-xs text-gray-400">Has sido eliminado del grupo</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="flex flex-col border-t border-gray-600 bg-gray-800 p-2">
      {isRecording ? (
        <AudioRecordingBar
          analyser={analyser}
          isRecording={isRecording}
          time={time}
          onCancel={clearAudio}
          onSend={() => {
            stopRecording();
            handleSend();
          }}
        />
      ) : (
        <>
          {audioBlob && (
            <div className="flex items-center gap-2 bg-gray-700 p-2 px-3 rounded-lg">
              <audio controls src={URL.createObjectURL(audioBlob)} className="flex-1" />
              <button onClick={clearAudio} className="bg-black/60 rounded-full p-1" title="Eliminar audio">
                <XMarkIcon className="size-3 text-white" />
              </button>
            </div>
          )}

      <div className="flex items-end gap-3 w-full">
        <button
          className="text-gray-400 hover:bg-emerald-400 hover:text-gray-900 p-1.5 rounded-xl transition-all cursor-pointer ml-2 mb-1.5"
          title="Adjuntar imagen"
          onClick={handleAttachClick}
        >
          <PhotoIcon className="size-6" />
        </button>

        <button
          className="text-gray-400 hover:bg-emerald-400 hover:text-gray-900 p-1.5 rounded-xl transition-all cursor-pointer mb-1.5"
          title="Adjuntar archivo"
          onClick={handleAttachClick}
        >
          <PaperClipIcon className="size-6" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
          onChange={handleFilesSelected}
          className="hidden"
        />

        <div className="flex flex-grow relative p-3 pl-3.5">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading || isRecording}
            className="w-full text-gray-100 focus:outline-none leading-relaxed placeholder-gray-400 disabled:opacity-50 caret-gray-200"
          />
        </div>

        {!descripcion.trim().length ? (
          <button
            onClick={startRecording}
            className="text-gray-400 hover:bg-emerald-400 hover:text-gray-900 p-1.5 rounded-xl transition-all cursor-pointer"
            title="Grabar audio"
          >
            <MicrophoneIcon className="size-6" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="text-gray-400 hover:bg-emerald-400 hover:text-gray-900 p-1.5 rounded-xl transition-all cursor-pointer"
            title="Enviar"
          >
            <PaperAirplaneIcon className="size-6" />
          </button>
        )}
      </div>
        </>
      )}
    </footer>
  );
};
