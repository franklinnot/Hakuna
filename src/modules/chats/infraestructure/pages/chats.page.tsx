import { useState } from "react";
import { AuthLayout } from "../../../../shared/infraestructure/components/layouts/auth-layout";
import { Sidebar } from "../components/sidebar/sidebar";
import { useAuthStore } from "../../../../shared/infraestructure/hooks/useAuthStore";
import { ProfileModal } from "../components/perfil/profile-modal";
import { AddUserModal } from "../components/añadir-usuarios/add-user";


export const ChatsPage = () => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [activeChatType, setActiveChatType] = useState<"grupos" | "privados">("grupos");

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

        {/* Historial de chats */}
        <div className="bg-green-500 flex items-center justify-center text-white font-bold text-lg">
          {activeChatType === "grupos"
            ? "Hola! Aquí van los grupos"
            : "Hola! Aquí van los chats privados"}
        </div>

        <div className="bg-red-500">Historial de mensajes de un chat en específico</div>
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
