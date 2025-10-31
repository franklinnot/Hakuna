import { useRef, useEffect, useState } from 'react';
import {
  PaperAirplaneIcon,
  PhotoIcon,
  MicrophoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useInputMensajePrivadoFlow } from './hooks/useInputMensajePrivadoFlow';
import { useFileUploader } from './hooks/useFileUploader';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { IChatPrivadoResponse } from '../../../../../../../../domain/responses/chats.responses';
import { IUsuarioResponse } from '../../../../../../../../domain/responses/usuarios.responses';

export const InputMensajePrivado = ({
  chat,
  usuario,
}: {
  chat: IChatPrivadoResponse;
  usuario: IUsuarioResponse;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ---- hooks de negocio ----
  const { setArchivos, handleSend, isSending } = useInputMensajePrivadoFlow(
    chat,
    usuario,
  );
  const { imagenes, handleFiles, handlePaste, clearImagenes, toArchivos } =
    useFileUploader();
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearAudio,
    toArchivo,
  } = useAudioRecorder();

  const [desc, setDesc] = useState('');

  // ---- ajustar altura dinámica del textarea ----
  const ajustarAltura = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  useEffect(() => {
    ajustarAltura();
  }, [desc]);

  // ---- manejar selección de imágenes ----
  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
  };

  // ---- quitar imagen del preview ----
  const handleRemoveImage = (index: number) => {
    const nuevas = [...imagenes];
    nuevas.splice(index, 1);
    clearImagenes();
    if (nuevas.length > 0) handleFiles(nuevas);
  };

  // ---- preparar y enviar mensaje ----
  const enviar = async () => {
    if (isSending) return;
    const trimmed = desc.trim();

    // convertir imágenes y audio a base64 (solo si existen)
    const imagenArchivos = await toArchivos();
    const audioArchivo = await toArchivo();
    const adjuntos = [
      ...(imagenArchivos ?? []),
      ...(audioArchivo ? [audioArchivo] : []),
    ];

    // si no hay texto ni adjuntos, no enviar nada
    if (!trimmed && !adjuntos.length) return;

    setArchivos(adjuntos);
    await handleSend(trimmed, adjuntos);

    // limpiar estados
    setDesc('');
    clearImagenes();
    clearAudio();
  };

  // ---- preview de audio grabado ----
  const audioURL = audioBlob ? URL.createObjectURL(audioBlob) : null;

  const canSend =
    desc.trim().length > 0 ||
    imagenes.length > 0 ||
    audioBlob !== null ||
    isRecording;

  return (
    <footer className="flex flex-col gap-2 p-3 border-t border-gray-200 bg-white">
      {/* preview de imágenes */}
      {imagenes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(i)}
                className="absolute -top-1 -right-1 bg-black/60 rounded-full p-1"
              >
                <XMarkIcon className="size-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* preview de audio grabado */}
      {audioURL && (
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
          <audio controls src={audioURL} className="flex-1" />
          <button
            onClick={clearAudio}
            className="bg-black/60 rounded-full p-1"
            title="Eliminar audio"
          >
            <XMarkIcon className="size-3 text-white" />
          </button>
        </div>
      )}

      {/* input de texto + botones */}
      <div className="flex items-end gap-3" onPaste={handlePaste}>
        {/* botón de imagen */}
        <label className="cursor-pointer">
          <PhotoIcon className="size-6 text-gray-500 hover:text-indigo-500" />
          <input
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={handleSelectFiles}
          />
        </label>

        {/* botón de audio */}
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="text-gray-500 hover:text-indigo-500"
            title="Grabar audio"
          >
            <MicrophoneIcon className="size-6" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="text-red-500 animate-pulse"
            title="Detener grabación"
          >
            <MicrophoneIcon className="size-6" />
          </button>
        )}

        {/* textarea */}
        <div className="flex-grow relative">
          <textarea
            ref={textareaRef}
            placeholder="Escribe un mensaje..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onInput={ajustarAltura}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviar();
              }
            }}
            rows={1}
            disabled={isSending || isRecording}
            className="w-full bg-gray-100 rounded-2xl px-4 py-2.5 resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 max-h-40 leading-relaxed placeholder-gray-400 disabled:opacity-50"
          />
        </div>

        {/* botón enviar */}
        <button
          onClick={enviar}
          disabled={!canSend || isSending}
          className={`size-10 rounded-xl flex items-center justify-center transition-all shadow-md ${
            canSend
              ? 'bg-indigo-500 hover:bg-indigo-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <PaperAirplaneIcon className="size-4 text-white" />
        </button>
      </div>
    </footer>
  );
};
