import { useTabControl } from "./shared/infraestructure/hooks/useTabControl";
import { useAuthStore } from "./shared/infraestructure/hooks/useAuthStore";
import { Paginas } from "./shared/domain/enums/paginas.enum";
import { ProfilePage } from "./modules/usuarios/infraestructure/pages/profile.page";
import { InactiveTab } from "./shared/infraestructure/pages/inactive-tab.page";
import { PublicPage } from "./modules/auth/infraestructure/public-page/public.page";
import { ChatsPage } from "./modules/chats/infraestructure/pages/chats.page";

function App() {
  const { isTabActive, claimSession } = useTabControl();
  const { view, isAuthenticated } = useAuthStore();

  const renderContent = () => {
    if (!isAuthenticated) {
      return <PublicPage />;
    }

    // si está autenticado, renderiza las vistas protegidas
    switch (view) {
      case Paginas.PROFILE:
        return <ProfilePage />;
      case Paginas.CHATS:
        return <ChatsPage />;
      default:
        return <ChatsPage />;
    }
  };

  return (
    <div className="h-full w-full">
      {!isTabActive ? (
        <InactiveTab claimSession={claimSession} />
      ) : (
        renderContent()
      )}
    </div>
  );
}

export default App;
