import { useState, useEffect } from 'react';
import { Input } from '../../../../../shared/presentation/components/ui/input';
import { Button } from '../../../../../shared/presentation/components/ui/button';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { Image } from '../../../../../shared/presentation/components/ui/img';
import { UsuariosService } from '../../../../../application/usuarios/usuarios.service';
import { IUsuarioResponse } from '../../../../../application/usuarios/usuarios.responses';
import { useAuthStore } from '../../../../../application/auth/hooks/useAuthStore';
import { IChatPrivadoResponse } from '../../../../../application/chats/chats.responses';

type IChatPrivadoResponseTemp = {
  isPending: boolean;
} & Partial<IChatPrivadoResponse>;

export const AddUser = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IUsuarioResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const addChatPrivadoTemporal = useAuthStore((s) => s.addChatPrivadoTemporal);
  const setChatPrivadoActivo = useAuthStore((s) => s.setChatPrivadoActivo);

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

  const handleCreateTempChat = (user: IUsuarioResponse) => {
    // temp id único
    const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const tempChat: Partial<IChatPrivadoResponseTemp> = {
      id_chat: tempId,
      usuarioB: user,
      historial_mensajes: [],
      ultimo_mensaje: null,
      isPending: true,
    };

    addChatPrivadoTemporal(tempChat);
    setChatPrivadoActivo(tempChat as IChatPrivadoResponse);
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="flex flex-col gap-2 max-h-64 overflow-auto">
        {loading && <p className="text-sm text-gray-500">Buscando...</p>}

        {results.map((user) => (
          <div
            key={user.id_usuario}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {user.link_foto ? (
                  <Image src={user.link_foto} alt="Perfil" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white font-bold">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold">{user.nombre}</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>

            <Button
              className="w-10 h-10 p-0 flex items-center justify-center"
              onClick={() => handleCreateTempChat(user)}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
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
