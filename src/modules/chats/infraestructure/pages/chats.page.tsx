import { useState } from "react";
import { AuthLayout } from "../../../../shared/infraestructure/components/layouts/auth-layout";
import { Sidebar } from "../components/sidebar/sidebar";
import { useAuthStore } from "../../../../shared/infraestructure/hooks/useAuthStore";
import { ProfileModal } from "../components/perfil/profile-modal";
import { AddUserModal } from "../components/añadir-usuarios/add-user";
import { HistorialMensajes } from "../components/historial-mensajes/historial-mensajes";
import { HistorialChats } from "../components/historial-chats/historial-chats";
import { Input } from "../../../../shared/infraestructure/components/ui/input";

export const ChatsPage = () => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [activeChatType, setActiveChatType] = useState<"grupos" | "privados">("grupos");
  const [searchTerm, setSearchTerm] = useState("");




  const usuario = useAuthStore((state) => state.usuario);

  return (
    <AuthLayout>
      <div className="w-full h-full grid grid-rows-1 grid-cols-[64px_1fr_3fr] gap-4 p-4">
        {/* Sidebar */}
        <Sidebar
          profileImage={usuario?.id_fotoPerfil}
          onOpenProfileModal={() => setProfileModalOpen(true)}
          onOpenAddUserModal={() => setAddUserModalOpen(true)}
          onSelectGroupChats={() => setActiveChatType("grupos")}
          onSelectPrivateChats={() => setActiveChatType("privados")}
        />
        {/* Columna del medio */}
        <div className="flex flex-col h-full">
            {/* Título general */}
          <h1 className="text-4xl font-bold mb-2 text-green-500">Chats</h1>

          <Input
          placeholder="Buscar chats"
          className="mb-2 text-black placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}/>

          {/* Título / encabezado */}
          <div className="bg-green-500 flex items-center justify-center text-white font-bold text-lg p-2 rounded-t-md">
            {activeChatType === "grupos" ? "Grupos" : "Chats privados"}
          </div>

          {/* Historial de chats */}
          <HistorialChats
            activeChatType={activeChatType}
            searchTerm={searchTerm}
            onSelectChat={(chat) => console.log("Chat seleccionado:", chat)}
          />
        </div>

        <HistorialMensajes />
      </div>

      {/* Modales de prueba*/}
      {/* Aun no edita je je je */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      {/* Busca, no genera aún la creacion de un integrante para que salga un chat */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
      />
    </AuthLayout>
  );
};
