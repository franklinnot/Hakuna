import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useMensajesPrivadosFlow } from '../hooks/useMensajesPrivadosFlow';
import { MensajesPrivadosProps } from '../mensajes-privados';
import { useState } from 'react';

export const InputMensaje = ({ chat, usuario }: MensajesPrivadosProps) => {
  const [desc, setDesc] = useState('');

  const { handleSend } = useMensajesPrivadosFlow(chat, usuario);

  const enviarMensaje = async () => {
    const text = desc.trim();
    if (!text) return;
    setDesc('');
    await handleSend(text);
  };

  return (
    <footer className="flex items-center gap-3 p-4 border-t border-gray-200 bg-white">
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
        className="flex-grow bg-gray-100 rounded-xl px-4 py-2 focus:outline-none text-gray-800"
      />
      <button
        onClick={enviarMensaje}
        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md bg-indigo-500 hover:bg-indigo-600 transition-colors"
      >
        <PaperAirplaneIcon className="size-4 text-indigo-50" />
      </button>
    </footer>
  );
};
