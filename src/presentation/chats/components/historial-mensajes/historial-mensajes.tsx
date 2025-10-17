import { useAuthStore } from '../../../../application/auth/hooks/useAuthStore';
import { TipoChats } from '../../../../shared/domain/enums';
import { MensajesPrivados } from './mensajes-privados/mensajes-privados';
import { MensajesGrupales } from './mensajes-grupales/mensajes-grupales';

export const HistorialMensajes = () => {
  const tipoChatsActivo = useAuthStore((s) => s.tipoChatsActivo);
  const chatPrivadoActivo = useAuthStore((s) => s.chatPrivadoActivo);
  const chatGrupalActivo = useAuthStore((s) => s.chatGrupalActivo);
  const usuario = useAuthStore((s) => s.usuario);

  const noChatSeleccionado = !chatPrivadoActivo && !chatGrupalActivo;

  return (
    <div className="flex flex-col size-full rounded-2xl overflow-hidden bg-gray-800">
      {noChatSeleccionado && (
        <div className="flex items-center justify-center flex-1 text-gray-400">
          <p>Selecciona un chat para comenzar</p>
        </div>
      )}

      {tipoChatsActivo === TipoChats.PRIVADO && chatPrivadoActivo && (
        <MensajesPrivados
          key={chatPrivadoActivo.id_chat}
          chat={chatPrivadoActivo}
          usuario={usuario!}
          mensajesIniciales={chatPrivadoActivo.historial_mensajes ?? []}
        />
      )}

      {tipoChatsActivo === TipoChats.GRUPAL && chatGrupalActivo && (
        <MensajesGrupales
          key={chatGrupalActivo.id_chat}
          chat={chatGrupalActivo}
          usuario={usuario!}
          mensajesIniciales={chatGrupalActivo.historial_mensajes ?? []}
        />
      )}
    </div>
  );
};
