import React from "react";

import { UserPlusIcon, UserGroupIcon, ChatBubbleOvalLeftEllipsisIcon, } from "@heroicons/react/24/outline";
import { Button } from "../../../../../shared/infraestructure/components/ui/button";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../../../../../shared/infraestructure/hooks/useAuthStore";
import { Image } from "../../../../../shared/infraestructure/components/ui/img";

interface SidebarProps {
    profileImage?: string; 
    onOpenProfileModal?: () => void;
    onOpenAddUserModal?: () => void;
    onSelectGroupChats?: () => void;
    onSelectPrivateChats?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    profileImage,
    onOpenProfileModal,
    onOpenAddUserModal,
    onSelectGroupChats,
    onSelectPrivateChats,
}) => {
    const logout = useAuthStore((state) => state.logout);
    const usuario = useAuthStore((state) => state.usuario);

    return (
        <div className="h-full w-20 bg-[var(--green-primary)] flex flex-col items-center py-4 gap-4 rounded-2xl">

            {/* Perfil */}
            <Button
                className="w-14 h-14 p-0 rounded-full overflow-hidden relative"
                onClick={onOpenProfileModal}
            >
                {profileImage ? (
                    <Image
                        src={profileImage}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                    />) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {usuario?.username?.[0]?.toUpperCase() || "P"}
                    </div>
                )}
            </Button>

            {/* Añadir usuarios */}
            <Button
                className="w-12 h-12 p-0 flex items-center justify-center"
                onClick={onOpenAddUserModal}
            >
                <UserPlusIcon className="h-6 w-6 text-white" />
            </Button>

            {/* Chats Grupales */}
            <Button
                className="w-12 h-12 p-0 flex items-center justify-center"
                onClick={() => {
                    onSelectGroupChats?.();
                }}
            >
                <UserGroupIcon className="h-6 w-6 text-white" />

            </Button>

            {/* Chats privados */}
            <Button
                className="w-12 h-12 p-0 flex items-center justify-center"
                onClick={() => {
                    onSelectPrivateChats?.();
                }}
            >
                <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-white" />

            </Button>

            {/* Cerrar Sesion */}
            <Button
                className="w-12 h-12 p-0 flex items-center justify-center mt-auto"
                onClick={logout}
            >
                <ArrowLeftEndOnRectangleIcon className="h-6 w-6 text-white" />
            </Button>
        </div>
    );
};
