import "./public.page.css";
import { PublicLayout } from "../../../../shared/infraestructure/components/layouts/public-layout";
import { useState } from "react";
import { LoginForm } from "./components/login-form";
import { RegisterForm } from "./components/register-form";
import { PublicHeader } from "./components/public-header";
import { PublicFooter } from "./components/public-footer";
import { PublicMain } from "./components/public-main";
import { Modal } from "../../../../shared/infraestructure/components/ui/modal/modal";

export const PublicPage = () => {
  const [modalContent, setModalContent] = useState<"login" | "register" | null>(
    null
  );

  const handleOpenLogin = () => setModalContent("login");
  const handleOpenRegister = () => setModalContent("register");
  const handleCloseModal = () => setModalContent(null);

  return (
    <PublicLayout>
      <div className="public-container">
        <PublicHeader
          onLoginClick={handleOpenLogin}
          onRegisterClick={handleOpenRegister}
        />
        <PublicMain
          onLoginClick={handleOpenLogin}
          onRegisterClick={handleOpenRegister}
        />
        <PublicFooter />
      </div>
      <Modal
        isOpen={modalContent !== null}
        onClose={handleCloseModal}
        title={modalContent == "login" ? "Iniciar Sesión" : "Crear Cuenta"}
      >
        {modalContent == "login" && (
          <LoginForm switchTo={() => setModalContent("register")} />
        )}
        {modalContent == "register" && (
          <RegisterForm switchTo={() => setModalContent("login")} />
        )}
      </Modal>
    </PublicLayout>
  );
};
