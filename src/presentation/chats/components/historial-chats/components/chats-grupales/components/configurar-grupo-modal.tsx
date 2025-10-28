import { Button } from '../../../../../../../shared/presentation/components/ui/button';
import { Input } from '../../../../../../../shared/presentation/components/ui/input';
import { FotoPerfil } from '../../../../../../../shared/presentation/components/ui/foto-perfil';
import { UploadFotoPerfil } from '../../../../../../../shared/presentation/components/ui/upload-foto-perfi';
import { 
  ArrowLeftIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { IUsuarioResponse } from '../../../../../../../application/usuarios/usuarios.responses';
import { useAuthStore } from '../../../../../../../application/auth/hooks/useAuthStore';

interface ConfigurarGrupoModalProps {
  isOpen: boolean;
  usuarios: IUsuarioResponse[];
  onClose: () => void;
  onVolver: () => void;
  onCrearGrupo: (datosGrupo: {
    nombre: string;
    descripcion: string;
    foto?: string;
    integrantes: string[];
  }) => void;
  nombreGrupo: string;
  setNombreGrupo: (nombre: string) => void;
  descripcionGrupo: string;
  setDescripcionGrupo: (descripcion: string) => void;
  fotoGrupo: string | null | undefined;
  setFotoGrupo: (foto: string | null | undefined) => void;
}

export const ConfigurarGrupoModal = ({ 
  isOpen, 
  usuarios,
  onVolver, 
  onCrearGrupo,
  nombreGrupo,
  setNombreGrupo,
  descripcionGrupo,
  setDescripcionGrupo,
  fotoGrupo,
  setFotoGrupo
}: ConfigurarGrupoModalProps) => {
  const usuario = useAuthStore((state) => state.usuario);

  const handleCrearGrupo = () => {
    if (!nombreGrupo.trim()) {
      alert('Por favor ingresa un nombre para el grupo');
      return;
    }

    const datosGrupo = {
      nombre: nombreGrupo.trim(),
      descripcion: descripcionGrupo.trim(),
      ...(fotoGrupo && { foto: fotoGrupo }),
      integrantes: usuarios.map(u => u.id_usuario),
    };

    onCrearGrupo(datosGrupo);
  };

  const handleFotoChange = (fotoBase64: string | null | undefined) => {
    setFotoGrupo(fotoBase64);
  };

  if (!isOpen) return null;

  return (
    <div className="h-[500px] flex flex-col">
      {/* Configuración del grupo */}
      <div className="flex-1 overflow-y-auto">
          {/* Botón volver */}
          <div className="p-4 border-b border-gray-100">
            <button
              onClick={onVolver}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">Volver</span>
            </button>
          </div>

          {/* Foto y datos del grupo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col items-center space-y-6">
              {/* Foto del grupo centrada */}
              <div className="relative">
                <UploadFotoPerfil
                  onChange={handleFotoChange}
                  size={100}
                />
              </div>

              {/* Campos de texto debajo de la foto */}
              <div className="w-full max-w-sm flex flex-col gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del grupo
                  <Input
                    type="text"
                    value={nombreGrupo}
                    onChange={(e) => setNombreGrupo(e.target.value)}
                    maxLength={50}
                    className="mt-1"
                    autoFocus
                  />
                </label>
                
                <label className="block text-sm font-medium text-gray-700">
                  Descripción del grupo
                  <Input
                    type="text"
                    value={descripcionGrupo}
                    onChange={(e) => setDescripcionGrupo(e.target.value)}
                    maxLength={100}
                    className="mt-1"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Participantes */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <UserGroupIcon className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">
                Participantes: {usuarios.length + 1}
              </h3>
            </div>

            <div className="space-y-2">
              {/* Tú (usuario actual) */}
              <div className="flex items-center gap-3 p-2">
                <FotoPerfil
                  link_foto={usuario?.link_foto}
                  nombre={usuario?.nombre || "Tú"}
                  className="w-10 h-10"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{usuario?.nombre || "Tú"}</p>
                  <p className="text-sm text-gray-600">Admin del grupo</p>
                </div>
              </div>

              {/* Usuarios seleccionados */}
              {usuarios.map((usuario) => (
                <div key={usuario.id_usuario} className="flex items-center gap-3 p-2">
                  <FotoPerfil
                    link_foto={usuario.link_foto}
                    nombre={usuario.nombre}
                    className="w-10 h-10"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{usuario.nombre}</p>
                    <p className="text-sm text-gray-600">@{usuario.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botón crear grupo */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleCrearGrupo}
            disabled={!nombreGrupo.trim()}
            className="w-full bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear grupo
          </Button>
        </div>
      </div>
  );
};