import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useMensajesPrivadosFlow } from '../hooks/useMensajesPrivadosFlow';
import { MensajesPrivadosProps } from '../mensajes-privados';
import { useState, useRef, useEffect } from 'react';

export const InputMensajePrivado = ({
  chat,
  usuario,
}: MensajesPrivadosProps) => {
  const [desc, setDesc] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { handleSend } = useMensajesPrivadosFlow(chat, usuario);

  const enviarMensaje = async () => {
    const text = desc.trim();
    if (!text) return;
    setDesc('');
    await handleSend(text);
    ajustarAltura(); // resetea altura tras enviar
  };

  // ajusta automáticamente la altura del textarea según el contenido
  const ajustarAltura = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`; // hasta ~6 líneas
  };

  useEffect(() => {
    ajustarAltura();
  }, [desc]);

  return (
    <footer className="flex items-end gap-3 p-4 border-t border-gray-200 bg-white">
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
              enviarMensaje();
            }
          }}
          rows={1}
          className="w-full bg-gray-100 rounded-2xl px-4 py-2.5 resize-none 
            text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 
            max-h-40 leading-relaxed placeholder-gray-400 scrollbar-custom"
        />
      </div>

      <button
        onClick={enviarMensaje}
        disabled={!desc.trim()}
        className={`size-11 rounded-xl flex items-center justify-center transition-all
          shadow-md ${
            desc.trim()
              ? 'bg-indigo-500 hover:bg-indigo-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
      >
        <PaperAirplaneIcon className="size-4 text-white" />
      </button>
    </footer>
  );
};
