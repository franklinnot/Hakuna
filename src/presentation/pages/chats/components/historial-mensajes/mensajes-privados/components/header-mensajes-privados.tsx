import { IChatPrivadoResponse } from '../../../../../../../domain/responses/chats.responses';
import { FotoPerfil } from '../../../../../../components/foto-perfil';

export const HeaderMensajesPrivados = ({
  chat,
}: {
  chat: IChatPrivadoResponse;
}) => {
  return (
    <header
      className="flex items-center gap-3 p-4 relative border-b 
    border-gray-600 flex-shrink-0"
    >
      <FotoPerfil
        link_foto={chat.usuarioB.link_foto}
        nombre={chat.usuarioB.nombre}
        verPerfil={false}
        className="size-14 flex-shrink-0 border-2 border-gray-700"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-100 text-lg">
          {chat.usuarioB.nombre}
        </span>
        <span className="text-sm text-gray-300 relative bottom-1">@{chat.usuarioB.username}</span>
      </div>
    </header>
  );
};
