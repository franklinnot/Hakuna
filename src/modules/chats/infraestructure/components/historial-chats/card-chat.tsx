import React from "react";

type CardChatProps = {
  id: string;
  nombre: string;
  ultimoMensaje: string;
  hora: string;
  fotoPerfil?: string; // ahora es opcional
  onClick: (id: string) => void;
};

export const CardChat: React.FC<CardChatProps> = ({
  id,
  nombre,
  ultimoMensaje,
  hora,
  fotoPerfil,
  onClick,
}) => {
  return (
    <div
      className="flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
      onClick={() => onClick(id)}
    >
      {/* Imagen de perfil */}
      <img
        src={fotoPerfil || "/img/default-avatar.png"} // imagen por defecto si no hay
        alt={nombre}
        className="w-12 h-12 rounded-full mr-3 object-cover"
      />

      {/* Nombre y último mensaje */}
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{nombre}</p>
        <p className="text-sm text-gray-500 truncate">{ultimoMensaje}</p>
      </div>

      {/* Hora del último mensaje */}
      <span className="text-xs text-gray-400">{hora}</span>
    </div>
  );
};
