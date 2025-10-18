import {
  UserPlusIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../../../../shared/presentation/components/ui/button';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../../../../application/auth/hooks/useAuthStore';
import { Profile } from './components/profile';
import { AddUser } from './components/add-user';
import { Modal } from '../../../../shared/presentation/components/ui/modal/modal';
import { TipoChats } from '../../../../shared/domain/enums';
import { useState, useRef } from 'react';
import { FotoPerfil } from '../../../../shared/presentation/components/ui/foto-perfil';

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const setTipoChatsActivo = useAuthStore((state) => state.setTipoChatsActivo);
  const tipoChatsActivo = useAuthStore((state) => state.tipoChatsActivo);
  const usuario = useAuthStore((state) => state.usuario);

  const [modalContent, setModalContent] = useState<
    'profile' | 'add-user' | null
  >(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const addUserRef = useRef<HTMLButtonElement>(null);

  const handleOpenProfile = () => setModalContent('profile');
  const handleOpenAddUser = () => setModalContent('add-user');

  const handleOpenChatsPrivados = () => {
    if (tipoChatsActivo != TipoChats.PRIVADO) {
      setTipoChatsActivo(TipoChats.PRIVADO);
    }
  };

  const handleOpenChatsGrupales = () => {
    if (tipoChatsActivo != TipoChats.GRUPAL) {
      setTipoChatsActivo(TipoChats.GRUPAL);
    }
  };

  const handleCloseModal = () => setModalContent(null);

  const obtenerTituloModal = () => {
    switch (modalContent) {
      case 'profile':
        return 'Mi perfil';
      case 'add-user':
        return 'Buscar usuarios';
      default:
        return '';
    }
  };

  const obtenerParentRef = () => {
    if (modalContent === 'profile') return profileRef;
    if (modalContent === 'add-user') return addUserRef;
    return undefined;
  };

  return (
    <div
      className="h-full w-[68px] bg-[var(--green-secondary)] flex flex-col
      items-center py-5 gap-6 rounded-2xl relative"
    >
      {/* Perfil */}
      <FotoPerfil
        link_foto={usuario!.link_foto}
        onClick={handleOpenProfile}
        nombre={usuario!.nombre}
        className="hover:scale-110 transition-transform duration-200 
          ease-in-out size-[48px] cursor-pointer"
        verPerfil={true}
        ref={profileRef}
      />

      {/* Añadir usuarios */}
      <Button
        ref={addUserRef}
        className="size-12 p-2 flex items-center justify-center 
        bg-[var(--green-primary)] hover:bg-[var(--green-dark)] hover:scale-125
        transition-transform duration-200 ease-in-out"
        onClick={handleOpenAddUser}
        title="Buscar usuarios"
      >
        <UserPlusIcon className="size-[24px] stroke-[1.5]" />
      </Button>

      {/* Chats privados */}
      <Button
        className="size-12 p-2 flex items-center justify-center 
        bg-[var(--green-primary)] hover:bg-[var(--green-dark)] hover:scale-125
        transition-transform duration-200 ease-in-out"
        onClick={handleOpenChatsPrivados}
        title="Chats privados"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="size-[24px] stroke-[1.5]" />
      </Button>

      {/* Chats grupales */}
      <Button
        className="size-12 p-2 flex items-center justify-center 
        bg-[var(--green-primary)] hover:bg-[var(--green-dark)] hover:scale-125
        transition-transform duration-200 ease-in-out"
        onClick={handleOpenChatsGrupales}
        title="Chats grupales"
      >
        <UserGroupIcon className="size-[24px] stroke-[1.5]" />
      </Button>

      {/* Cerrar sesión */}
      <Button
        className="size-12 p-2 flex items-center justify-center 
        mt-auto bg-[var(--green-primary)] hover:bg-[var(--green-dark)] hover:scale-125
        transition-transform duration-200 ease-in-out"
        onClick={logout}
        title="Cerrar sesión"
      >
        <ArrowLeftEndOnRectangleIcon className="size-[24px] stroke-[1.5]" />
      </Button>

      {/* MODAL */}
      <Modal
        isOpen={modalContent !== null}
        onClose={handleCloseModal}
        title={obtenerTituloModal()}
        relativeToParent={!!obtenerParentRef()}
        parentRef={
          obtenerParentRef() as React.RefObject<HTMLElement> | undefined
        }
        position="left" // 👈 aparece a la izquierda del ancla
      >
        {modalContent === 'profile' && <Profile />}
        {modalContent === 'add-user' && <AddUser />}
      </Modal>
    </div>
  );
};
