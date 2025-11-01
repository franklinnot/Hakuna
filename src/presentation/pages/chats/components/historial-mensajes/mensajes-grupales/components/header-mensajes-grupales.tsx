import { useRef, useState } from 'react';
import { IChatGrupalResponse } from '../../../../../../../domain/responses/chats.responses';
import { FotoPerfil } from '../../../../../../components/foto-perfil';
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ModalRelativo } from '../../../../../../components/modal/modal-relativo';

interface HeaderMensajesGrupalesProps {
  chat: IChatGrupalResponse;
  onInfoGrupo: () => void;
  onSalirGrupo: () => void;
}

export const HeaderMensajesGrupales = ({
  chat,
  onInfoGrupo,
  onSalirGrupo,
}: HeaderMensajesGrupalesProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleInfoGrupo = () => {
    handleCloseMenu();
    onInfoGrupo();
  };

  const handleSalirGrupo = () => {
    handleCloseMenu();
    onSalirGrupo();
  };

  return (
    <>
      <header className="flex items-center gap-3 p-4 border-b border-gray-600 bg-gray-800 flex-shrink-0">
        <FotoPerfil
          link_foto={chat.link_foto}
          nombre={chat.nombre}
          verPerfil={false}
          className="size-10 flex-shrink-0"
        />
        <div className="flex flex-col flex-1">
          <span className="font-semibold text-white text-lg">
            {chat.nombre || 'Grupo sin nombre'}
          </span>
          <span className="text-sm text-gray-300">
            {chat.cantidad_integrantes} integrantes
          </span>
        </div>

        {/* Botón de menú de tres puntos */}
        <button
          ref={menuButtonRef}
          onClick={handleToggleMenu}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
          title="Opciones del grupo"
        >
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
        </button>
      </header>

      {/* Modal del menú de opciones */}
      <ModalRelativo
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        parentRef={menuButtonRef as React.RefObject<HTMLElement>}
        position="right"
      >
        <div className="py-2 min-w-[200px]">
          <button
            onClick={handleInfoGrupo}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <InformationCircleIcon className="h-5 w-5 text-gray-600" />
            <span className="text-gray-800 font-medium">Info del grupo</span>
          </button>

          <button
            onClick={handleSalirGrupo}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-500 font-medium">Salir del grupo</span>
          </button>
        </div>
      </ModalRelativo>
    </>
  );
};