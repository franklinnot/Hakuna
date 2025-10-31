import './public.page.css';
import { PublicLayout } from '../../layouts/public-layout';
import { useState } from 'react';
import { LoginForm } from './components/forms/login-form';
import { RegisterForm } from './components/forms/register-form';
import { PublicHeader } from './components/structure/public-header';
import { PublicFooter } from './components/structure/public-footer';
import { PublicMain } from './components/structure/public-main';
import { Modal } from '../../components/modal/modal';

export const PublicPage = () => {
  const [modalContent, setModalContent] = useState<'login' | 'register' | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenLogin = () => setModalContent('login');
  const handleOpenRegister = () => setModalContent('register');
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
        title={modalContent == 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        preventClose={isLoading}
      >
        {modalContent == 'login' && (
          <LoginForm
            switchTo={() => setModalContent('register')}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {modalContent == 'register' && (
          <RegisterForm
            switchTo={() => setModalContent('login')}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </Modal>
    </PublicLayout>
  );
};
