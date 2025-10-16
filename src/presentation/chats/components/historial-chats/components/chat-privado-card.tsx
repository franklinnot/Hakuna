import { IChatPrivadoResponse } from '../../../../../application/chats/chats.responses';
import { formatLocalDate } from '../../../../../shared/application/mappers/utc-to-localdate';

export type CardChatPrivadoProps = {
  onClick: (id_chat: string) => void;
} & IChatPrivadoResponse;

export const ChatPrivadoCard = ({
  id_chat,
  historial_mensajes,
  // createdAt,
  // id_integranteA,
  integranteB,
  onClick,
}: CardChatPrivadoProps) => {
  return (
    <div
      className="flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
      onClick={() => onClick(id_chat)}
    >
      {/* Imagen de perfil */}
      <img
        src={integranteB.link_foto ?? ''}
        alt={integranteB.username}
        className="w-12 h-12 rounded-full mr-3 object-cover"
      />

      {/* Nombre y último mensaje */}
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{integranteB.nombre}</p>
        <p className="text-sm text-gray-500 truncate">
          {historial_mensajes![0].descripcion ?? '...'}
        </p>
      </div>

      {/* Hora del último mensaje */}
      <span className="text-xs text-gray-400">
        {formatLocalDate(historial_mensajes![0].createdAt, 'time-date')}
      </span>
    </div>
  );
};
