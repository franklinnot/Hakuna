import { useTabControl } from './useTabControl';
import { AppStore } from './application/store/app.store';
import { InactiveTab } from './presentation/pages/inactive/inactive-tab.page';
import { PublicPage } from './presentation/pages/public/public.page';
import { ChatsPage } from './presentation/pages/chats/chats.page';
import { Paginas } from './domain/enums';
import { useSocketListener } from './infraestructure/socket/useSocketListener';
import { useEffect } from 'react';
import { connectSocket } from './infraestructure/socket/socket.client';

function App() {
  const { isTabActive, claimSession } = useTabControl();
  const view = AppStore((state) => state.view);
  const usuario = AppStore((state) => state.usuario);


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
  useSocketListener();

  useEffect(() => {
    const token = AppStore.getState().token;
    // conectarse al socket
    connectSocket(token ?? '');
  }, []);

  useEffect(() => {
    const token = AppStore.getState().token;
    // conectarse al socket
    connectSocket(token ?? '');
  }, [usuario]);
  return <div className="h-full w-full">{renderContent()}</div>;
}

export default App;
