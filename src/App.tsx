import { useTabControl } from './shared/application/hooks/useTabControl';
import { useAuthStore } from './application/auth/hooks/useAuthStore';
import { InactiveTab } from './shared/presentation/pages/inactive-tab.page';
import { PublicPage } from './presentation/public/public.page';
import { ChatsPage } from './presentation/chats/chats.page';
import { Paginas } from './shared/domain/enums';

function App() {
  const { isTabActive, claimSession } = useTabControl();
  const view = useAuthStore((state) => state.view);

  const renderContent = () => {
    if (view == Paginas.PUBLIC) {
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
