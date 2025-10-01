import React, { useState, useEffect } from "react";
import { Modal } from "../../../../../shared/infraestructure/components/ui/modal/modal";
import { Input } from "../../../../../shared/infraestructure/components/ui/input";
import { Button } from "../../../../../shared/infraestructure/components/ui/button";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { Image } from "../../../../../shared/infraestructure/components/ui/img";
import { UsuariosService } from "../../../../usuarios/application/usuarios.service"; // tu servicio de backend
import type { Usuario } from "../../../../usuarios/domain/usuario.interface";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await UsuariosService.search(query);
                setResults(res.data || []);
            } catch (error) {
                console.error("Error buscando usuarios:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [query]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Añadir Usuario">
            <div className="flex flex-col gap-4">
                <Input
                    type="text"
                    placeholder="Buscar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="flex flex-col gap-2 max-h-64 overflow-auto">
                    {loading && <p className="text-sm text-gray-500">Buscando...</p>}

                    {results.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center justify-between p-2 rounded hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {user.id_fotoPerfil ? (
                                        <Image src={user.id_fotoPerfil} alt="Perfil" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white font-bold">
                                            {user.username[0].toUpperCase()}
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
                                onClick={() => console.log("Crear chat con:", user._id)}
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
        </Modal>
    );
};
