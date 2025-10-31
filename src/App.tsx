import { useTabControl } from './useTabControl';
import { AppStore } from './application/store/app.store';
import { InactiveTab } from './presentation/pages/inactive/inactive-tab.page';
import { PublicPage } from './presentation/pages/public/public.page';
import { ChatsPage } from './presentation/pages/chats/chats.page';
import { Paginas } from './domain/enums';
import { useSocketListenerFlow } from './useSocketListenerFlow';

function App() {
  const { isTabActive, claimSession } = useTabControl();
  const view = AppStore((state) => state.view);

  useSocketListenerFlow();

  const renderContent = () => {
    if (!isTabActive) {
      return <InactiveTab claimSession={claimSession} />;
    } else {
      if (view == Paginas.PUBLIC) {
        return <PublicPage />;
      }
      return <ChatsPage />;
    }
  };

  return <div className="h-full w-full">{renderContent()}</div>;
}

export default App;
