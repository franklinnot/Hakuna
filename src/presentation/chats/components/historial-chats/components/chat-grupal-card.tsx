import React from 'react';
import { IChatGrupalResponse } from '../../../../../application/chats/chats.responses';
import { formatLocalDate } from '../../../../../shared/application/mappers/utc-to-localdate';

export type CardChatGrupalProps = {
  onClick: (id_chat: string) => void;
} & IChatGrupalResponse;

const handleOnClik = (
  id_chat: string,
  onClick: (id_chat: string) => void,
  e: React.FormEvent<HTMLDivElement>,
) => {
  e.preventDefault();
  onClick(id_chat);
};

export const ChatPrivadoCard = ({
  id_chat,
  historial_mensajes,
  link_foto,
  nombre,
//   createdAt,
//   descripcion,
//   integrantes,
//   cantidad_integrantes,
  onClick,
}: CardChatGrupalProps) => {
  return (
    <div
      className="flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
      onClick={(e) => handleOnClik(id_chat, onClick, e)}
    >
      {/* Imagen de perfil */}
      <img
        src={link_foto ?? ''}
        alt={nombre}
        className="w-12 h-12 rounded-full mr-3 object-cover"
      />

      {/* Nombre y último mensaje */}
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{nombre}</p>
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
