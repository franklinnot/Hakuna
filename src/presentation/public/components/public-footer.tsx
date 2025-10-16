import { Image } from "../../../shared/presentation/components/ui/img";

export const PublicFooter = () => {
  return (
    <footer className="w-full p-4 md:p-6 lg:p-8">
      <div
        className="mx-auto flex w-full max-w-screen-xl items-center justify-between 
        rounded-xl bg-black/40 p-4 px-6 backdrop-blur-sm"
      >
        <Image src="logo-name.svg" className="h-8 w-auto" />
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <a href="">Términos y condiciones</a>
          <a href="">Política de Privacidad</a>
          <a href="">Cookies</a>
          <a href="">Contacto</a>
          <div className="flex gap-5">
            <Image className="icon-social-media" src="./icons/facebook.png" />
            <Image className="icon-social-media" src="./icons/instagram.png" />
            <Image className="icon-social-media" src="./icons/github.png" />
          </div>
        </div>
      </div>
    </footer>
  );
};
