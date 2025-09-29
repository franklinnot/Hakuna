import { Button } from "../../../../../shared/infraestructure/components/ui/button";
import {
  UserGroupIcon,
  LockClosedIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/16/solid";
import { PublicCard } from "./public-card";

export const PublicMain = ({
  onLoginClick,
  onRegisterClick,
}: {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}) => {
  return (
    <main className="flex w-full items-center justify-center p-4 md:p-14">
      <div className="flex w-full max-w-screen-lg flex-col items-center gap-16 md:gap-20">
        {/* saludo */}
        <div className="flex flex-col items-start gap-6 text-left mr-auto">
          <div className="text-white text-shadow-lg">
            <h1 className="text-5xl font-bold md:text-6xl">
              Tu mensajería, <br />
              reinventada.
            </h1>
            <p className="mt-4 text-lg md:text-xl">
              Conéctate y comparte en conversaciones fluidas y seguras.
            </p>
          </div>
          <div className="flex gap-5">
            <Button onClick={onLoginClick} className="shadow-lg">
              Iniciar sesión
            </Button>
            <Button
              onClick={onRegisterClick}
              className="bg-white text-[var(--black-secondary)] hover:bg-[var(--gray-primary)] 
              focus:outline-white shadow-lg"
            >
              Registrarme
            </Button>
          </div>
        </div>

        {/* cards */}
        <div className="grid w-full grid-cols-1 gap-8 text-[var(--black-primary)] md:grid-cols-3">
          <PublicCard
            icon={ChatBubbleBottomCenterIcon}
            title="Mensajes instantáneos"
          >
            Envía y recibe mensajes tus amigos, con fotos, videos y archivos.
          </PublicCard>

          <PublicCard icon={LockClosedIcon} title="Privacidad garantizada">
            Tus conversaciones están cifradas de extremo a extremo para mayor
            seguridad.
          </PublicCard>

          <PublicCard icon={UserGroupIcon} title="Conexión sin límites">
            Únete a grupos, crea comunidades y conéctate con amigos y
            familiares.
          </PublicCard>
        </div>
      </div>
    </main>
  );
};
