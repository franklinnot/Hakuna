import { useState } from 'react';
import { IChatGrupalResponse } from '../../../../../../../../domain/responses/chats.responses';
import { MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useSendMensajeGrupal } from '../../../../../../../../application/use-cases/mensajes/useSendMensajeGrupal';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useFileHandling } from './hooks/useFileHandling';

interface InputMensajeGrupalProps {
  chat: IChatGrupalResponse;
}

export const InputMensajeGrupal = ({
  chat,
}: InputMensajeGrupalProps) => {
  const [descripcion, setDescripcion] = useState('');

  // Hooks personalizados
  const { sendMensajeGrupal, isLoading } = useSendMensajeGrupal();
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearAudio,
    toArchivo,
  } = useAudioRecorder();
  const {
    archivos,
    fileInputRef,
    handleAttachClick,
    handleFilesSelected,
    clearArchivos,
  } = useFileHandling();

  const handleSend = async () => {
    if (isLoading) return;
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

  return (
    <footer className="flex flex-col gap-2 p-3 border-t border-gray-200 bg-white">
      {/* preview de audio grabado */}
      {audioBlob && (
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
          <audio controls src={URL.createObjectURL(audioBlob)} className="flex-1" />
          <button
            onClick={clearAudio}
            className="bg-black/60 rounded-full p-1"
            title="Eliminar audio"
          >
            <XMarkIcon className="size-3 text-white" />
          </button>
        </div>
      )}
      
      <div className="flex items-center flex-grow bg-gray-100 rounded-xl py-2 px-4">
        <button
          className="text-xl text-gray-500 mr-2"
          title="Adjuntar archivo"
          onClick={handleAttachClick}
        >
          📎
        </button>

        {/* botón de audio */}
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="text-gray-500 hover:text-indigo-500 mr-2"
            title="Grabar audio"
          >
            <MicrophoneIcon className="size-5" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="text-red-500 animate-pulse mr-2"
            title="Detener grabación"
          >
            <MicrophoneIcon className="size-5" />
          </button>
        )}

        {/* input oculto para selección de archivos */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
          onChange={handleFilesSelected}
          className="hidden"
        />

        {archivos?.length ? (
          <span className="mr-2 text-xs text-gray-600 bg-gray-200 rounded-md px-2 py-1 flex items-center gap-1">
            {archivos.length} archivo{archivos.length > 1 ? 's' : ''} listo(s)
            <button
              className="ml-1 text-gray-500 hover:text-gray-700"
              title="Quitar adjuntos"
              onClick={clearArchivos}
            >
              ✖
            </button>
          </span>
        ) : null}

        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading || isRecording}
          className="flex-grow bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
        />

        <button
          className="text-xl text-gray-500 ml-2"
          title="Enviar emoji"
          onClick={() => {/* TODO: Implementar selector de emojis */}}
        >
          🙂
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={isLoading || (!descripcion.trim() && !archivos?.length && !audioBlob && !isRecording)}
        className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-colors ${
          isLoading || (!descripcion.trim() && !archivos?.length && !audioBlob && !isRecording)
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-500 hover:bg-indigo-600'
        }`}
      >
        <span className="text-xl text-white">
          {isLoading ? '⏳' : '➡️'}
        </span>
      </button>
    </footer>
  );
};