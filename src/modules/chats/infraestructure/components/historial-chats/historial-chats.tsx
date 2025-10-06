import React, { useState, useEffect } from "react";
import { CardChat } from "../historial-chats/card-chat";

type Chat = {
  id: string;
  nombre: string;
  ultimoMensaje: string;
  hora: string;
  tipo: "grupos" | "privados";
  fotoPerfil?: string;
};

type HistorialChatsProps = {
  activeChatType: "grupos" | "privados";
  searchTerm: string;
  onSelectChat: (chat: Chat) => void;
};

export const HistorialChats: React.FC<HistorialChatsProps> = ({
  activeChatType,
  searchTerm,
  onSelectChat,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);

  // Mock de datos mientras llega la API
  useEffect(() => {
    const mockChats: Chat[] = [
      { id: "1", nombre: "Usuario B", ultimoMensaje: "Hola!", hora: "10:30", tipo: "privados" },
      { id: "2", nombre: "Usuario C", ultimoMensaje: "Qué tal?", hora: "09:45", tipo: "privados" },
      { id: "3", nombre: "Grupo React", ultimoMensaje: "Vamos al sprint", hora: "08:20", tipo: "grupos" },
      { id: "4", nombre: "Grupo NestJS", ultimoMensaje: "Revisen la documentación", hora: "07:10", tipo: "grupos" },
    ];
    setChats(mockChats);
  }, []);

  // Filtrar chats según activeChatType
  const filteredChats = chats.filter(
    (chat) => chat.tipo === activeChatType && chat.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="overflow-y-auto h-full bg-gray-100 p-2 rounded-md">
      {filteredChats.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No hay chats aún</p>
      ) : (
        filteredChats.map(chat => (
          <CardChat
            key={chat.id}
            id={chat.id}
            nombre={chat.nombre}
            ultimoMensaje={chat.ultimoMensaje}
            hora={chat.hora}
            fotoPerfil={chat.fotoPerfil}
            onClick={() => onSelectChat(chat)}
          />
        ))
      )}
    </div>
  );
};
