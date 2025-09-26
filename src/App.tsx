import { useTabControl } from "./shared/infraestructure/hooks/useTabControl";
import { useAuthStore } from "./modules/auth/application/store/auth.store";
import { Paginas } from "./shared/domain/enums/paginas.enum";
import { LoginPage } from "./modules/auth/infraestructure/pages/login.page";
import { RegisterPage } from "./modules/auth/infraestructure/pages/register.page";
import { ProfilePage } from "./modules/usuarios/infraestructure/pages/profile.page";
import { Button } from "./shared/infraestructure/components/ui/button";

const InactiveTabOverlay = ({ claimSession }: { claimSession: () => void }) => (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm">
    <div className="p-8 text-center bg-white rounded-lg shadow-2xl">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Hay otra sesión abierta
      </h2>
      <p className="mb-6 text-gray-600">
        Hakuna se está ejecutando en otra pestaña. Puedes cerrar esta o usar la
        aplicación aquí.
      </p>
      <Button onClick={claimSession}>Usar aquí</Button>
    </div>
  </div>
);

function App() {
  const { isTabActive, claimSession } = useTabControl();
  const { view, isAuthenticated } = useAuthStore();

  const renderContent = () => {
    if (!isAuthenticated) {
      switch (view) {
        case Paginas.LOGIN:
          return <LoginPage />;
        case Paginas.REGISTER:
          return <RegisterPage />;
        default:
          return <LoginPage />;
      }
    }

    // Si está autenticado, renderiza las vistas protegidas
    switch (view) {
      case Paginas.PROFILE:
        return <ProfilePage />;
      // Aquí irían más vistas como Paginas.CHATS, etc.
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {!isTabActive ? (
        <InactiveTabOverlay claimSession={claimSession} />
      ) : (
        renderContent()
      )}
    </div>
  );
}

export default App;
