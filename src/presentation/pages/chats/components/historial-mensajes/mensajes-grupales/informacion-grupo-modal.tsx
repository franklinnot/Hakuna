import React, { useState } from 'react';
import { Modal } from '../../../../../components/modal/modal';
import { Button } from '../../../../../components/button';
import { Input } from '../../../../../components/input';
import { FotoPerfil } from '../../../../../components/foto-perfil';
import { UploadFotoPerfil } from '../../../../../components/upload-foto-perfil/upload-foto-perfi';
import { SeleccionarUsuarios } from '../../historial-chats/components/chats-grupales/components/seleccionar-usuarios/seleccionar-usuarios';
import { 
  UserGroupIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { IUsuarioResponse } from '../../../../../../domain/responses/usuarios.responses';

interface GroupMember {
  id: string;
  name: string;
  avatar: string | null;
  isAdmin: boolean;
}

interface InformacionGrupoModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupDescription: string;
  groupPhoto?: string | null;
  members: GroupMember[];
  currentUserId: string; // ID del usuario actual
  onUpdateGroup: (name: string, description: string, photo?: string | null) => void;
  onRemoveMember: (memberId: string) => void;
  onAddMember: (member: GroupMember) => void;
  onDeleteGroup?: () => void; // Nueva prop para eliminar grupo
}

export const InformacionGrupoModal: React.FC<InformacionGrupoModalProps> = ({
  isOpen,
  onClose,
  groupName,
  groupDescription,
  groupPhoto,
  members,
  currentUserId,
  onUpdateGroup,
  onRemoveMember,
  onAddMember,
  onDeleteGroup,
}) => {
  const [editedName, setEditedName] = useState(groupName);
  const [editedDescription, setEditedDescription] = useState(groupDescription);
  const [editedPhoto, setEditedPhoto] = useState<string | null | undefined>(undefined);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<IUsuarioResponse[]>([]);

  // Verificar si el usuario actual es administrador del grupo
  const isCurrentUserAdmin = members.find(member => member.id === currentUserId)?.isAdmin || false;

  const handleSave = () => {
    // Solo enviar la foto si se cambió (editedPhoto !== undefined)
    const fotoParaEnviar = editedPhoto !== undefined ? editedPhoto : groupPhoto;
    onUpdateGroup(editedName, editedDescription, fotoParaEnviar);
    onClose();
  };



  const handleUsuariosSeleccionados = (usuarios: IUsuarioResponse[]) => {
    // Convertir usuarios seleccionados al formato de miembros
    const nuevosIntegrantes = usuarios.map(usuario => ({
      id: usuario.id_usuario,
      name: usuario.nombre,
      avatar: usuario.link_foto || null,
      isAdmin: false
    }));

    // Filtrar usuarios que ya están en el grupo
    const integrantesExistentes = members.map(m => m.id);
    const integrantesNuevos = nuevosIntegrantes.filter(
      integrante => !integrantesExistentes.includes(integrante.id)
    );

    // Agregar nuevos integrantes
    integrantesNuevos.forEach(integrante => onAddMember(integrante));
    setShowSearchModal(false);
    setUsuariosSeleccionados([]);
  };

  const handleFotoChange = (fotoBase64: string | null | undefined) => {
    setEditedPhoto(fotoBase64);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Información del Grupo"
      >
        <div className="h-[500px] flex flex-col">
          {/* Configuración del grupo */}
          <div className="flex-1 overflow-y-auto">
            {/* Foto y datos del grupo */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col items-center space-y-6">
                {/* Foto del grupo centrada */}
                <div className="relative">
                  <UploadFotoPerfil
                    onChange={handleFotoChange}
                    size={100}
                    initialUrl={groupPhoto}
                  />
                </div>

                {/* Campos de texto debajo de la foto */}
                <div className="w-full max-w-sm flex flex-col gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del grupo
                    <Input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      maxLength={50}
                      className="mt-1"
                    />
                  </label>
                  
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción del grupo
                    <Input
                      type="text"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      maxLength={100}
                      className="mt-1"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Participantes */}
            <div className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5" />
                  Participantes
                </h3>

                {/* Botón Añadir arriba del listado - Solo visible para administradores */}
                {isCurrentUserAdmin && (
                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-[var(--green-primary)] hover:bg-[var(--green-primary)]/90 rounded-full flex items-center justify-center">
                      <PlusIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Agregar participante</span>
                  </button>
                )}

                {/* Información de cantidad de participantes */}
                <p className="text-sm text-gray-600">{members.length} participantes</p>

                <div className="space-y-2">
                  {/* Mostrar miembros */}
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 relative">
                      <FotoPerfil
                        link_foto={member.avatar}
                        nombre={member.name}
                        className="w-10 h-10"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        {member.isAdmin && (
                          <p className="text-sm text-gray-600">Admin del grupo</p>
                        )}
                      </div>
                      {/* Solo mostrar botón de eliminar si el usuario actual es admin y el miembro NO es admin */}
                      {isCurrentUserAdmin && !member.isAdmin && (
                        <button
                          onClick={() => onRemoveMember(member.id)}
                          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                          title="Eliminar miembro"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* Botón eliminar grupo - solo para administradores */}
            {isCurrentUserAdmin && onDeleteGroup && (
              <Button
                onClick={onDeleteGroup}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <TrashIcon className="h-5 w-5" />
                Eliminar Grupo
              </Button>
            )}
            
            {/* Botón guardar con ícono de check */}
            <Button
              onClick={handleSave}
              className="w-full bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de búsqueda de usuarios */}
      <Modal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        title="Agregar participantes"
      >
        <div className="h-96">
          <SeleccionarUsuarios
            onSiguiente={handleUsuariosSeleccionados}
            usuariosSeleccionados={usuariosSeleccionados}
            setUsuariosSeleccionados={setUsuariosSeleccionados}
            miembrosExistentes={members.map(member => member.id)}
          />
        </div>
      </Modal>
    </>
  );
};