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
import { useState } from 'react';
import { FotoPerfil } from '../../../../shared/presentation/components/ui/foto-perfil';

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const setTipoChatsActivo = useAuthStore((state) => state.setTipoChatsActivo);
  const tipoChatsActivo = useAuthStore((state) => state.tipoChatsActivo);
  const usuario = useAuthStore((state) => state.usuario);

  const [modalContent, setModalContent] = useState<
    'profile' | 'add-user' | 'chats-privados' | 'chats-grupales' | null
  >(null);

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
      case 'chats-privados':
        return 'Chats privados';
      case 'chats-grupales':
        return 'Chats grupales';
      default:
        return '';
    }
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
      />

      {/* Añadir usuarios */}
      <Button
        className="size-12 p-2 flex items-center justify-center 
        bg-[var(--green-primary)] hover:bg-[var(--green-dark)]"
        onClick={() => {
          handleOpenAddUser();
        }}
        title="Buscar usuarios"
      >
        <UserPlusIcon className="size-[24px] stroke-[1.5]]" />
      </Button>

      {/* Chats privados */}
      <Button
        className="size-12 p-2 flex items-center justify-center 
        bg-[var(--green-primary)] hover:bg-[var(--green-dark)]"
        onClick={() => {
          handleOpenChatsPrivados();
        }}
        title="Chats privados"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="size-[24px] stroke-[1.5]" />
      </Button>

      {/* Chats Grupales */}
      <Button
        className="size-12 p-2 flex items-center justify-center 
        bg-[var(--green-primary)] hover:bg-[var(--green-dark)]"
        onClick={() => {
          handleOpenChatsGrupales();
        }}
        title="Chats grupales"
      >
        <UserGroupIcon className="size-[24px] stroke-[1.5]" />
      </Button>

      {/* Cerrar Sesion */}
      <Button
        className="size-12 p-2 flex items-center justify-center 
        mt-auto bg-[var(--green-primary)] hover:bg-[var(--green-dark)]"
        onClick={logout}
        title='Cerrar sesión'
      >
        <ArrowLeftEndOnRectangleIcon className="size-[24px] stroke-[1.5]" />
      </Button>

      <Modal
        isOpen={modalContent !== null}
        onClose={handleCloseModal}
        title={obtenerTituloModal()}
      >
        {modalContent == 'profile' && <Profile />}
        {modalContent == 'add-user' && <AddUser />}
      </Modal>
    </div>
  );
};
