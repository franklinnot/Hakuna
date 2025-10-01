import React from "react";
import { useAuthStore } from "../../../../../shared/infraestructure/hooks/useAuthStore";
import { Modal } from "../../../../../shared/infraestructure/components/ui/modal/modal";
import { Input } from "../../../../../shared/infraestructure/components/ui/input";
import { Button } from "../../../../../shared/infraestructure/components/ui/button";
import { PencilIcon } from "@heroicons/react/24/solid";
import { Image } from "../../../../../shared/infraestructure/components/ui/img";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const usuario = useAuthStore((state) => state.usuario);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mi Perfil">
            <div className="flex flex-col items-center gap-6">
                {/* Foto de perfil */}
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative">
                    {usuario?.id_fotoPerfil ? (
                        <Image
                            src={usuario.id_fotoPerfil}
                            alt="Perfil"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-500 font-bold text-2xl">
                            <PencilIcon className="h-6 w-6 text-white" />
                        </div>
                    )}
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <Input
                            type="text"
                            defaultValue={usuario?.nombre || ""}
                            placeholder="Tu nombre"
                            className="mt-1"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                        <Input
                            type="text"
                            defaultValue={usuario?.username || ""}
                            placeholder="Tu usuario"
                            className="mt-1"

                        />
                    </div>
                </div>

                <Button >
                    Modificar
                </Button>
            </div>
        </Modal>
    );
};
