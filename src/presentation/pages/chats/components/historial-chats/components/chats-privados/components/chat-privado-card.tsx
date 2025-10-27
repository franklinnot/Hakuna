import { IChatPrivadoResponse } from '../../../../../../../../domain/responses/chats.responses';
import { IUsuarioResponse } from '../../../../../../../../domain/responses/usuarios.responses';
import { formatLocalDate } from '../../../../../../../../application/lib/mappers/utc-to-localdate';
import { FotoPerfil } from '../../../../../../../components/foto-perfil';
import { SkeletonText } from '../../../../../../../components/skeleton-text';

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
  const usuarioB = chat.usuarioB;
  const mensaje = chat.ultimo_mensaje;

  const isLoading = !mensaje;
  let hora: string | null = null;
  let fecha: string | null = null;
  let descripcion: string | null = '';

  if (mensaje) {
    const fecha_mensaje = new Date(mensaje.createdAt);
    hora = formatLocalDate(fecha_mensaje, 'time')!;
    fecha = formatLocalDate(fecha_mensaje, 'date')!;
    descripcion = mensaje.descripcion;

    // --- Mostrar fecha solo si el mensaje NO es de hoy ---
    const hoy = new Date();
    const esMismoDia =
      fecha_mensaje.getFullYear() === hoy.getFullYear() &&
      fecha_mensaje.getMonth() === hoy.getMonth() &&
      fecha_mensaje.getDate() === hoy.getDate();

    if (esMismoDia) {
      fecha = null; // no mostrar fecha
    }
  }

  return (
    <div
      className="w-full h-[60px] flex items-center p-3 mb-2 bg-white 
      rounded-full shadow-sm cursor-pointer hover:bg-gray-100 flex-row gap-3 px-4"
      onClick={(e) => {
        e.preventDefault();
        onClick(chat);
      }}
    >
      <FotoPerfil
        link_foto={usuarioB.link_foto}
        className="size-[42px]"
        nombre={usuarioB.nombre}
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {usuarioB.nombre}
        </p>

        {isLoading ? (
          <SkeletonText width="70%" height={14} className="mt-1" />
        ) : mensaje?.id_usuario === usuarioA.id_usuario ? (
          <div className="text-sm text-gray-500 flex flex-row gap-1 overflow-hidden">
            <span className="shrink-0">Tú:</span>
            <p className="truncate">{descripcion}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 truncate">{descripcion}</p>
        )}
      </div>

      {!isLoading && hora && (
        <div className="flex flex-col justify-end text-right">
          <span className="text-xs text-gray-400">{hora}</span>
          {fecha && <span className="text-xs text-gray-400">{fecha}</span>}
        </div>
      )}
    </div>
  );
};
