import { EyeIcon } from '@heroicons/react/16/solid';
import { Image } from './img';
import { mixStyle } from '../../../application/lib/mix-style';

interface FotoPerfilProps {
  nombre: string;
  link_foto?: string | null;
  onClick?: () => void;
  className?: string;
  verPerfil?: boolean;
}

export const FotoPerfil = ({
  link_foto,
  onClick,
  nombre,
  className,
  verPerfil,
}: FotoPerfilProps) => {
  return (
    <div
      className={mixStyle(
        `relative size-10 flex-shrink-0 rounded-full overflow-hidden 
        cursor-pointer group bg-indigo-500 flex items-center 
        justify-center`,
        className,
      )}
      onClick={verPerfil ? onClick : undefined}
      title="Ver perfil"
    >
      {link_foto ? (
        <Image
          src={link_foto}
          alt="Ver perfil"
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <span className="font-bold text-sm">
          {nombre?.[0]?.toUpperCase() || 'U'}
        </span>
      )}

      {verPerfil && (
        <div
          className="absolute inset-0 bg-gray-700/50 opacity-0 
      group-hover:opacity-100 transition flex items-center 
      justify-center"
        >
          <EyeIcon className="size-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};
