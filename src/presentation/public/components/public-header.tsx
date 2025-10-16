import { Image } from "../../../shared/presentation/components/ui/img";
import { Button } from "../../../shared/presentation/components/ui/button";


export const PublicHeader = ({
  onLoginClick,
  onRegisterClick,
}: {onLoginClick: () => void; onRegisterClick: () => void}) => {
  return (
    <header className="w-full p-4 md:p-6 lg:p-8">
      <div
        className="mx-auto flex w-full max-w-screen-xl items-center justify-between 
        rounded-xl bg-black/40 p-4 px-6 backdrop-blur-sm"
      >
        <Image src="logo-name.svg" className="h-8 w-auto" />
        <div className="flex items-center gap-6 md:gap-10">
          <a href="">Nosotros</a>
          <a href="">Soporte</a>
          <div className="flex items-center gap-3 md:gap-5">
            <Button onClick={onLoginClick}>Iniciar sesión</Button>
            <Button
              onClick={onRegisterClick}
              className="bg-white text-[var(--black-secondary)] hover:bg-[var(--gray-primary)] 
                          focus:outline-white"
            >
              Registrarme
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};