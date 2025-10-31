import { useCallback } from 'react';
import { AppStore } from '../../../../../../../application/store/app.store';
import { IUsuarioResponse } from '../../../../../../../domain/responses/usuarios.responses';
import { IChatPrivadoResponse } from '../../../../../../../domain/responses/chats.responses';
import { v4 as uuidv4 } from 'uuid';
import { useBuscarUsuarios } from '../../../../../../../application/use-cases/usuarios/useBuscarUsuarios';

export const useAddUserFlow = (
  handleCloseModal: () => void,
  setIsLoading: (v: boolean) => void,
) => {
  const { busqueda, setBusqueda, usuarios, limpiarBusqueda } =
    useBuscarUsuarios(setIsLoading);

  const handleSelectUser = useCallback(
    (user: IUsuarioResponse) => {
      const { chatsPrivados, setIdChatActivo, addChatPrivado } =
        AppStore.getState();

      // verificar si ya existe chat
      const existing = chatsPrivados.find(
        (c) => c.usuarioB?.id_usuario === user.id_usuario,
      );

      if (existing) {
        setIdChatActivo(existing.id_chat);
        handleCloseModal();
        return;
      }

      // crear chat temporal
      const tempChat: IChatPrivadoResponse = {
        id_chat: `temp-${uuidv4()}`,
        usuarioB: user,
        historial_mensajes: [],
        ultimo_mensaje: null,
        createdAt: new Date(),
        is_group: false,
        is_temp: true,
      };

      addChatPrivado(tempChat);
      setIdChatActivo(tempChat.id_chat);
      handleCloseModal();
    },
    [handleCloseModal],
  );

  return {
    busqueda,
    setBusqueda,
    usuarios,
    limpiarBusqueda,
    handleSelectUser,
  };
};