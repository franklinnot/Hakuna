import { AppStore } from '../../../../../application/store/app.store';
import { MensajesPrivados } from './mensajes-privados/mensajes-privados';
import { MensajesGrupales } from './mensajes-grupales/mensajes-grupales';
import {
  IChatGrupalResponse,
  IChatPrivadoResponse,
} from '../../../../../domain/responses/chats.responses';
import { useEffect } from 'react';

export const HistorialMensajes = () => {
  const getChatActivo = AppStore((s) => s.getChatActivo);
  const id_chatActivo = AppStore((s) => s.id_chatActivo);
  const usuario = AppStore((s) => s.usuario);
  let chatActivo = getChatActivo();

  useEffect(() => {
    chatActivo = getChatActivo();
  }, [id_chatActivo]);

  return (
    <div className="flex flex-col size-full rounded-2xl overflow-hidden bg-gray-800">
      {!chatActivo && (
        <div className="flex items-center justify-center flex-1 text-gray-400">
          <p>Selecciona un chat para comenzar</p>
        </div>
      )}

      {chatActivo && !chatActivo.is_group && (
        <MensajesPrivados
          key={chatActivo.id_chat}
          chat={chatActivo as IChatPrivadoResponse}
          usuario={usuario!}
        />
      )}

      {chatActivo && chatActivo.is_group && (
        <MensajesGrupales
          key={chatActivo.id_chat}
          chat={chatActivo as IChatGrupalResponse}
          usuario={usuario!}
        />
      )}
    </div>
  );
};
