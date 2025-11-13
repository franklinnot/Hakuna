import React from 'react';
import { IChatGrupalResponse } from '../../../../../../../../domain/responses/chats.responses';
import { formatLocalDate } from '../../../../../../../../application/lib/mappers/utc-to-localdate';
import { FotoPerfil } from '../../../../../../../components/foto-perfil';
import { Estado } from '../../../../../../../../domain/enums';

export type CardChatGrupalProps = {
  chat: IChatGrupalResponse;
  onClick: (chat: IChatGrupalResponse) => void;
};

const handleOnClik = (
  chat: IChatGrupalResponse,
  onClick: (chat: IChatGrupalResponse) => void,
  e: React.FormEvent<HTMLDivElement>,
) => {
  e.preventDefault();
  onClick(chat);
};

export const ChatGrupalCard = ({
  chat,
  onClick,
}: CardChatGrupalProps) => {
  const { ultimo_mensaje, link_foto, nombre, estado_miembro } = chat;
  const ultimoMensaje = ultimo_mensaje;
  const tieneHistorial = ultimoMensaje !== null;
  const isDisabled = estado_miembro === Estado.DESHABILITADO;

  return (
    <div
      className={`w-full h-[60px] flex items-center p-3 mb-2 bg-white 
      rounded-full shadow-sm cursor-pointer hover:bg-gray-100 flex-row 
      gap-3 px-4 ${isDisabled ? 'opacity-60 bg-gray-50' : ''}`}
      onClick={(e) => handleOnClik(chat, onClick, e)}
      title={isDisabled ? 'Has sido eliminado de este grupo' : (tieneHistorial ? (ultimoMensaje.descripcion || 'Sin descripción') : 'Sin mensajes aún')}
    >
      {/* Imagen de perfil */}
      <FotoPerfil
        link_foto={link_foto}
        nombre={nombre}
        verPerfil={false}
        className="size-[42px] flex-shrink-0"
      />

      {/* Nombre y último mensaje */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-800 truncate">{nombre}</p>
          {isDisabled && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex-shrink-0">
              Eliminado
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {isDisabled 
            ? 'Has sido eliminado de este grupo' 
            : (tieneHistorial ? ultimoMensaje.descripcion : 'Sin mensajes aún')
          }
        </p>
      </div>

      {/* Hora del último mensaje */}
      {tieneHistorial && (
        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
          {formatLocalDate(ultimoMensaje.createdAt, 'time-date')}
        </span>
      )}
    </div>
  );
};
