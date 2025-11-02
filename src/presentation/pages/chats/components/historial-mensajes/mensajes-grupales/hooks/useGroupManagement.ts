import { useState } from 'react';
import { IChatGrupalResponse } from '../../../../../../../domain/responses/chats.responses';
import { ChatsService } from '../../../../../../../infraestructure/rest/chats/chats.service';
import { AppStore } from '../../../../../../../application/store/app.store';
import { useGetMensajes } from '../../../../../../../application/use-cases/mensajes/useGetMensajes';

interface GroupMember {
  id: string;
  name: string;
  avatar: string | null;
  isAdmin: boolean;
}

export const useGroupManagement = (chat: IChatGrupalResponse) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { getMensajes } = useGetMensajes();
  
  // Obtener función para actualizar chat del store
  const updateChatGrupal = AppStore((state) => state.updateChatGrupal);

  const handleInfoGrupo = () => {
    setIsConfigModalOpen(true);
  };

  const handleSalirGrupo = () => {
    // TODO: Implementar confirmación y lógica para salir del grupo
  };

  const handleCloseConfigModal = () => {
    setIsConfigModalOpen(false);
  };

  const handleUpdateGroup = async (
    name: string,
    description: string,
    photo?: string | null,
  ) => {
    try {
      const datosActualizacion: {
        nombre?: string;
        descripcion?: string;
        foto?: string | null;
      } = {};

      // Solo incluir los campos que han cambiado
      if (name !== chat.nombre) {
        datosActualizacion.nombre = name;
      }
      if (description !== chat.descripcion) {
        datosActualizacion.descripcion = description;
      }
      if (photo !== chat.link_foto) {
        datosActualizacion.foto = photo;
      }

      // Si no hay cambios, no hacer nada
      if (Object.keys(datosActualizacion).length === 0) {
        return;
      }

      const response = await ChatsService.updateChatGrupal(
        chat.id_chat,
        datosActualizacion,
      );

      if (response.success && response.data) {
        // Actualizar el store con los nuevos datos
        updateChatGrupal(response.data);
      } else {
        console.error('Error al actualizar el grupo:', response.error);
      }
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await ChatsService.removeMemberFromGroup(chat.id_chat, memberId);
      
      if (response.success && response.data) {
        // Actualizar el store con los nuevos datos del chat
        updateChatGrupal(response.data);
        
        // Los eventos de socket se encargan de las actualizaciones necesarias
        // No es necesario recargar mensajes manualmente
        console.log('Miembro eliminado exitosamente');
      } else {
        console.error('Error al quitar miembro:', response.error);
        alert('Error al eliminar el miembro del grupo: ' + response.error);
      }
    } catch (error) {
      console.error('Error al quitar miembro:', error);
      alert('Error al eliminar el miembro del grupo. Inténtalo de nuevo.');
    }
  };

  const handleAddMember = async (memberOrUserId: GroupMember | string): Promise<void> => {
    try {
      // Determinar si es un objeto GroupMember o un string id_usuario
      const id_usuario = typeof memberOrUserId === 'string' ? memberOrUserId : memberOrUserId.id;
      
      const response = await ChatsService.addMemberToGroup(chat.id_chat, id_usuario);
      
      if (response.success && response.data) {
        // Actualizar el chat en el store con los nuevos datos
        updateChatGrupal(response.data);
        
        // Los eventos de socket se encargan de las actualizaciones necesarias
        // El nuevo miembro recibirá el historial completo a través del backend
        console.log('Miembro agregado exitosamente');
      } else {
        console.error('Error al agregar miembro:', response.error);
        alert('Error al agregar el miembro al grupo: ' + response.error);
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error al agregar el miembro al grupo. Inténtalo de nuevo.');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      // Confirmar la eliminación del grupo
      const confirmDelete = window.confirm(
        '¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.'
      );
      
      if (!confirmDelete) {
        return;
      }

      const response = await ChatsService.deleteGroup(chat.id_chat);
      
      if (response.success) {
        // Cerrar el modal
        setIsConfigModalOpen(false);
        
        // TODO: Redirigir a la lista de chats o actualizar el store
        console.log('Grupo eliminado exitosamente');
        alert('Grupo eliminado exitosamente');
      } else {
        console.error('Error al eliminar grupo:', response.error);
        alert('Error al eliminar el grupo: ' + response.error);
      }
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      alert('Error al eliminar el grupo. Inténtalo de nuevo.');
    }
  };

  return {
    isConfigModalOpen,
    handleInfoGrupo,
    handleSalirGrupo,
    handleCloseConfigModal,
    handleUpdateGroup,
    handleRemoveMember,
    handleAddMember,
    handleDeleteGroup,
  };
};