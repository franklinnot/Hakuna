import { useTabControl } from './shared/application/hooks/useTabControl';
import { useAuthStore } from './application/auth/hooks/useAuthStore';
import { InactiveTab } from './shared/presentation/pages/inactive-tab.page';
import { PublicPage } from './presentation/public/public.page';
import { ChatsPage } from './presentation/chats/chats.page';

function App() {
  const { isTabActive, claimSession } = useTabControl();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  const renderContent = () => {
    if (!isAuthenticated || !token) {
      return <PublicPage />;
    }

    return <ChatsPage />;
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
