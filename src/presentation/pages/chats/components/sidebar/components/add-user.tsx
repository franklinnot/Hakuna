import { useState, useEffect, useCallback } from 'react';
import { Input } from '../../../../../components/input';
import { Button } from '../../../../../components/button';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { Image } from '../../../../../components/img';
import { UsuariosService } from '../../../../../../infraestructure/rest/usuarios/usuarios.service';
import { IUsuarioResponse } from '../../../../../../domain/responses/usuarios.responses';
import { AppStore } from '../../../../../../application/store/app.store';
import { IChatPrivadoResponse } from '../../../../../../domain/responses/chats.responses';
import { v4 as uuidv4 } from 'uuid';

export const AddUser = ({
  handleCloseModal,
}: {
  handleCloseModal: () => void;
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IUsuarioResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar usuarios por nombre o username
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await UsuariosService.findAllByNombreOUsername(query);
        setResults(res.data || []);
      } catch (error) {
        console.error('Error buscando usuarios:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  // verificar si ya hay un chat con ese usuario
  const handleSelectUser = useCallback(
    (user: IUsuarioResponse) => {
      const existingChat = AppStore.getState().chatsPrivados.find(
        (c) => c.usuarioB?.id_usuario === user.id_usuario,
      );

      if (existingChat) {
        AppStore.getState().setIdChatActivo(existingChat.id_chat);
        return;
      }

      const tempChat: IChatPrivadoResponse = {
        id_chat: `temp-${uuidv4()}`,
        usuarioB: user,
        historial_mensajes: [],
        ultimo_mensaje: null,
        createdAt: new Date(),
        is_group: false,
        is_temp: true,
      };

      AppStore.getState().addChatPrivado(tempChat);
      AppStore.getState().setIdChatActivo(tempChat.id_chat);
      handleCloseModal();
    },
    [handleCloseModal],
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="flex flex-col gap-2 scroll-container">
        {loading && <p className="text-sm text-gray-500">Buscando...</p>}

        {results.map((user) => (
          <div
            key={user.id_usuario}
            className="flex items-center justify-between p-2.5 rounded-full hover:bg-teal-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {user.link_foto ? (
                  <Image src={user.link_foto} alt="Perfil" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center 
                  bg-gray-400 text-white font-bold"
                  >
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold">{user.nombre}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>

            <Button
              className="w-10 h-10 p-0 flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                handleSelectUser(user);
              }}
            >
              <ChatBubbleLeftIcon className="h-5 w-5 pointer-events-none" />
            </Button>
          </div>
        ))}

        {!loading && results.length === 0 && query.trim() && (
          <p className="text-sm text-gray-500">No se encontraron usuarios.</p>
        )}
      </div>
    </div>
  );
};
