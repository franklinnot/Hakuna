import { IChatPrivadoResponse } from '../../../../../../../application/chats/chats.responses';
import { IUsuarioResponse } from '../../../../../../../application/usuarios/usuarios.responses';
import { formatLocalDate } from '../../../../../../../shared/application/mappers/utc-to-localdate';
import { FotoPerfil } from '../../../../../../../shared/presentation/components/ui/foto-perfil';

export interface CardChatPrivadoProps {
  chat: IChatPrivadoResponse;
  onClick: (chat: IChatPrivadoResponse) => void;
  usuarioA: IUsuarioResponse;
}

export const ChatPrivadoCard = ({
  chat,
  onClick,
  usuarioA,
}: CardChatPrivadoProps) => {
  const historial_mensajes = chat.historial_mensajes;
  const usuarioB = chat.usuarioB;
  const today = new Date();

  let hora: Date | string | null = null;
  let fecha: Date | string | null = null;
  let fecha_mensaje: Date = new Date();
  let mensaje = null;
  let descripcion: string | null = '';
  if (historial_mensajes && historial_mensajes.length > 0) {
    mensaje = historial_mensajes[0];
    descripcion = mensaje.descripcion;
    fecha_mensaje = new Date(mensaje.createdAt);
    hora = formatLocalDate(fecha_mensaje, 'time')!;
    fecha = formatLocalDate(fecha_mensaje, 'date')!;
  }

  return (
    <div
      className="w-full h-[60px] flex items-center p-3 mb-2 bg-white 
      rounded-full shadow-sm cursor-pointer hover:bg-gray-100 flex-row 
      gap-3 px-4"
      onClick={(e) => {
        e.preventDefault();
        onClick(chat);
      }}
      title={descripcion || ''}
    >
      {/* Imagen de perfil */}
      <FotoPerfil
        link_foto={usuarioB.link_foto}
        className="size-[42px]"
        nombre={usuarioB.nombre}
      />

      {/* Nombre y último mensaje */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {usuarioB.nombre}
        </p>
        {mensaje?.id_usuario == usuarioA.id_usuario ? (
          <div
            className="text-sm text-gray-500 flex flex-row gap-1 
          overflow-hidden"
          >
            <span className="shrink-0">Tú:</span>
            <p
              className="truncate whitespace-nowrap overflow-hidden 
            text-ellipsis"
            >
              {descripcion}
            </p>
          </div>
        ) : (
          <p
            className="text-sm text-gray-500 truncate whitespace-nowrap 
          overflow-hidden text-ellipsis"
          >
            {descripcion}
          </p>
        )}
      </div>

      {/* Hora del último mensaje */}
      {fecha && hora && (
        <div className="flex flex-col justify-end text-right">
          <span className="text-xs text-gray-400">{hora.toString()}</span>
          {fecha_mensaje.getDay() != today.getDay() && (
            <span className="text-xs text-gray-400">{fecha.toString()}</span>
          )}
        </div>
      )}
    </div>
  );
};
