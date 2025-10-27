import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { AppStore } from '../../../../../../../application/store/app.store';
import { ChatGrupalCard } from './components/chat-grupal-card';
import { Modal } from '../../../../../../components/modal/modal';
import { Button } from '../../../../../../components/button';
import { CrearGrupoModal } from './components/crear-grupo-modal';
import { ChatsService } from '../../../../../../../infraestructure/rest/chats/chats.service';
import { IChatGrupalResponse } from '../../../../../../../domain/responses/chats.responses';

export const ChatsGrupales = () => {
  const chatsGrupales = AppStore((state) => state.chatsGrupales);
  const addChatGrupal = AppStore((state) => state.addChatGrupal);
  const setIdChatActivo = AppStore((state) => state.setIdChatActivo);
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
    try {
      // Transformar los integrantes al formato que espera el backend
      const integrantesFormateados = datosGrupo.integrantes.map(id => ({ id_usuario: id }));
      
      const datosParaAPI = {
        nombre: datosGrupo.nombre,
        descripcion: datosGrupo.descripcion,
        foto: datosGrupo.foto,
        integrantes: integrantesFormateados
      };

      console.log('Creando grupo con datos:', datosParaAPI);
      
      const respuesta = await ChatsService.createChatGrupal(datosParaAPI);
      
      if (respuesta.success && respuesta.data) {
        console.log('Grupo creado exitosamente:', respuesta.data);
        // Agregar el nuevo grupo a la lista
        addChatGrupal(respuesta.data);
        setIsModalOpen(false);
      } else {
        console.error('Error al crear el grupo:', respuesta.error);
      }
    } catch (error) {
      console.error('Error al crear el grupo:', error);
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
        {chatsGrupales && chatsGrupales.length > 0 ? (
          chatsGrupales.map((chat) => (
            <ChatGrupalCard
              key={chat.id_chat}
              chat={chat}
              onClick={handleChatClick}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">No tienes grupos aún</p>
            <p className="text-xs mt-1">Crea tu primer grupo haciendo clic en +</p>
          </div>
        )}
      </div>

      {/* Modal para crear nuevo grupo */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Nuevo grupo">
        <CrearGrupoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCrearGrupo={handleCrearGrupoSubmit}
        />
      </Modal>
    </div>
  );
};
