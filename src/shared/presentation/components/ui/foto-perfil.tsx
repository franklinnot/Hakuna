import { EyeIcon } from '@heroicons/react/16/solid';
import { Image } from './img';

interface FotoPerfilProps {
  link_foto?: string | null;
  onClick: () => void;
  nombre: string;
  className?: string;
}

export const FotoPerfil = ({
  link_foto,
  onClick,
  nombre,
  className,
}: FotoPerfilProps) => {
  return (
    <div
      className={`relative size-16 rounded-full overflow-hidden cursor-pointer 
      group bg-indigo-500 flex items-center justify-center ${className}`}
      onClick={onClick}
      title="Ver perfil"
    >
      {link_foto ? (
        <Image
          src={link_foto}
          alt="Ver perfil"
          className="size-full rounded-full"
        />
      ) : (
        <span className="font-bold text-xl">
          {nombre?.[0]?.toUpperCase() || 'U'}
        </span>
      )}

      {/* Overlay gris con ícono */}
      <div
        className="absolute inset-0 bg-gray-700/50 opacity-0 
      group-hover:opacity-100 transition flex items-center justify-center"
      >
        <EyeIcon className="size-6 text-gray-300" />
      </div>
    </div>
  );
};
