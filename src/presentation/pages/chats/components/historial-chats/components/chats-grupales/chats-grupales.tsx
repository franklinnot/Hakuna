import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { AppStore } from '../../../../../../../application/store/app.store';
import { useChatsGrupalesFlow } from './hooks/useChatsGrupalesFlow';
import { useCrearGrupo } from '../../../../../../../application/use-cases/chats/useCrearGrupo';
import { ChatGrupalCard } from './components/chat-grupal-card';
import { Modal } from '../../../../../../components/modal/modal';
import { Button } from '../../../../../../components/button';
import { CrearGrupoModal } from './components/crear-grupo-modal';
import type { IChatGrupalResponse } from '../../../../../../../domain/responses/chats.responses';

export const ChatsGrupales = () => {
  const sortedChatsGrupales = useChatsGrupalesFlow();
  const { setIdChatActivo } = AppStore();
  const { crearGrupo } = useCrearGrupo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChatClick = (chat: IChatGrupalResponse) => {
    setIdChatActivo(chat.id_chat);
  };

  const handleCrearGrupoSubmit = async (datosGrupo: {
    nombre: string;
    descripcion: string;
    foto?: string;
    integrantes: string[];
  }) => {
    const resultado = await crearGrupo(datosGrupo);
    if (resultado.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header con título y botón agregar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-semibold text-white">Grupos</h2>
        <Button
          onClick={handleOpenModal}
          className="size-8 p-0 flex items-center justify-center bg-[var(--green-primary)] 
          hover:bg-[var(--green-dark)] hover:scale-110 transition-all duration-200 ease-in-out"
          title="Crear nuevo grupo"
        >
          <PlusIcon className="size-4 stroke-2" />
        </Button>
      </div>

      {/* Lista de chats grupales */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {sortedChatsGrupales.length > 0 ? (
          <AnimatePresence>
            {sortedChatsGrupales.map((chat) => (
              <motion.div
                key={chat.id_chat}
                layout
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              >
                <ChatGrupalCard
                  chat={chat}
                  onClick={handleChatClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">No tienes grupos aún</p>
            <p className="text-xs mt-1">
              Crea tu primer grupo haciendo clic en +
            </p>
          </div>
        )}
      </div>

      {/* Modal para crear nuevo grupo */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nuevo grupo"
        variant="dark"
      >
        <CrearGrupoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCrearGrupo={handleCrearGrupoSubmit}
        />
      </Modal>
    </div>
  );
};
