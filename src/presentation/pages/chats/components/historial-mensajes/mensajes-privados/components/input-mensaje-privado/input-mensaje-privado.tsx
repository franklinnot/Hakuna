import { useRef, useState } from 'react';
import {
  PaperAirplaneIcon,
  CameraIcon,
  MicrophoneIcon,
  PaperClipIcon,
} from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/16/solid';

import { useInputMensajePrivadoFlow } from './hooks/useInputMensajePrivadoFlow';
import { useFileUploader } from './hooks/useFileUploader';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { IChatPrivadoResponse } from '../../../../../../../../domain/responses/chats.responses';
import { IUsuarioResponse } from '../../../../../../../../domain/responses/usuarios.responses';
import AudioRecordingBar from './components/audio-recording-bar';

export const InputMensajePrivado = ({
  chat,
  usuario,
}: {
  chat: IChatPrivadoResponse;
  usuario: IUsuarioResponse;
}) => {
  // ---------------------------------------
  //  HOOKS
  // ---------------------------------------

  const { setArchivos, handleSend } = useInputMensajePrivadoFlow(chat, usuario);

  const { imagenes, handleFiles, handlePaste, clearImagenes, toArchivos } =
    useFileUploader();

  const {
    isRecording,
    audioBlob,
    analyser,
    time,
    startRecording,
    stopRecording,
    clearAudio,
    toArchivo,
  } = useAudioRecorder();

  const [desc, setDesc] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ---------------------------------------
  //  AUTO-ALTURA DEL TEXTAREA
  // ---------------------------------------

  const ajustarAltura = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  // ---------------------------------------
  //  MANEJO DE ARCHIVOS
  // ---------------------------------------

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
  };

  const handleRemoveImage = (index: number) => {
    const nuevas = [...imagenes];
    nuevas.splice(index, 1);
    clearImagenes();
    if (nuevas.length > 0) handleFiles(nuevas);
  };

  // ---------------------------------------
  //  ENVIAR MENSAJE
  // ---------------------------------------

  const enviar = async () => {
    const trimmed = desc.trim();

    if (trimmed) {
      setDesc('');
    }

    const imagenArchivos = await toArchivos();
    const audioArchivo = await toArchivo();

    const adjuntos = [
      ...(imagenArchivos ?? []),
      ...(audioArchivo ? [audioArchivo] : []),
    ];

    if (!trimmed && !adjuntos.length) return;
    
    setArchivos(adjuntos);
    await handleSend(trimmed, adjuntos);

    clearImagenes();
    clearAudio();
  };

  const audioURL = audioBlob ? URL.createObjectURL(audioBlob) : null;

  const canSend =
    desc.trim().length > 0 || imagenes.length > 0 || audioBlob !== null;

  // ---------------------------------------
  //  RENDER
  // ---------------------------------------

  return (
    <footer className="flex flex-col border-t border-gray-600 bg-gray-800 p-2 px-3">
      {/* PREVIEW DE IMÁGENES */}
      {imagenes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="size-24 m-2 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(i)}
                className="absolute -top-0 -right-0 bg-black/80 rounded-full p-1
                cursor-pointer hover:bg-black/100"
              >
                <XMarkIcon className="size-5 text-gray-300" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW DE AUDIO */}
      {audioURL && (
        <div className="flex items-center gap-2 bg-gray-700 p-2 px-3 rounded-lg">
          <audio controls src={audioURL} className="flex-1" />
          <button onClick={clearAudio} className="bg-black/60 rounded-full p-1">
            <XMarkIcon className="size-3 text-white" />
          </button>
        </div>
      )}

      {isRecording ? (
        <AudioRecordingBar
          analyser={analyser}
          isRecording={isRecording}
          time={time}
          onCancel={clearAudio}
          onSend={() => {
            stopRecording();
            enviar();
          }}
        />
      ) : (
        // INPUT PRINCIPAL
        <div className="flex items-end gap-3 w-full" onPaste={handlePaste}>
          {/* IMÁGENES */}
          <label
            className="text-gray-400 hover:bg-emerald-400 hover:text-gray-900 
            p-1.5 rounded-xl transition-all cursor-pointer mb-1.5"
          >
            <CameraIcon className="size-6" />
            <input
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={handleSelectFiles}
            />
          </label>

          {/* ARCHIVOS */}
          <label
            className="text-gray-400 hover:bg-emerald-400 hover:text-gray-900
            p-1.5 rounded-xl transition-all cursor-pointer mb-1.5"
          >
            <PaperClipIcon className="size-6" />
            <input
              type="file"
              multiple
              hidden
              accept="video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
              onChange={handleSelectFiles}
            />
          </label>

          {/* TEXTAREA */}
          <div className="flex flex-grow relative p-3 pl-3.5">
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
              className="w-full resize-none text-gray-100 focus:outline-none max-h-24 
              leading-relaxed placeholder-gray-400 disabled:opacity-50 
            caret-gray-200 scrollbar-custom-auto"
            />
          </div>

          {/* MIC / ENVIAR */}
          {!desc.trim().length ? (
            <button
              onClick={startRecording}
              className="text-gray-400 hover:bg-emerald-400 hover:text-gray-900
            p-1.5 rounded-xl transition-all cursor-pointer mb-1.5 mr-1"
            >
              <MicrophoneIcon className="size-6" />
            </button>
          ) : (
            <button
              onClick={enviar}
              disabled={!canSend}
              className="text-gray-400 hover:bg-emerald-400 hover:text-gray-900
            p-1.5 rounded-xl transition-all cursor-pointer mb-1.5"
            >
              <PaperAirplaneIcon className="size-6" />
            </button>
          )}
        </div>
      )}
    </footer>
  );
};
