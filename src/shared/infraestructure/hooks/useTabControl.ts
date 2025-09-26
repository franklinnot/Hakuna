import { useState, useEffect, useCallback } from "react";

// se usa un canal para que las pestañas se comuniquen entre sí.
const CHANNEL_NAME = "hakuna_app_channel";
const channel = new BroadcastChannel(CHANNEL_NAME);

// ID para cada pestaña
const TAB_ID = Date.now().toString();

export const useTabControl = () => {
  // estado que nos dice si esta es la pestaña activa.
  const [isTabActive, setIsTabActive] = useState(true);

  // reclamar la sesión para la pestaña actual.
  const claimSession = useCallback(() => {
    // avisa a las otras pestañas que esta se ha convertido en la activa
    channel.postMessage({ type: "SESSION_CLAIMED", tabId: TAB_ID });
    // se marca a sí misma como activa
    setIsTabActive(true);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, tabId } = event.data;

      // si otra pestaña reclama la sesión, esta se desactiva.
      if (type == "SESSION_CLAIMED" && tabId !== TAB_ID) {
        setIsTabActive(false);
      }
      // si se abre una nueva pestaña, la nueva toma el control
      if (type == "NEW_TAB_OPENED" && tabId !== TAB_ID) {
        // la pestaña actual deja de ser la activa
        setIsTabActive(false);
      }
    };

    // escuchar mensajes de otras pestañas
    channel.addEventListener("message", handleMessage);

    // al cargar, esta pestaña se anuncia como la nueva y reclama la sesión
    channel.postMessage({ type: "NEW_TAB_OPENED", tabId: TAB_ID });
    claimSession();

    // limpieza al desmontar el componente
    return () => {
      channel.removeEventListener("message", handleMessage);
    };
  }, [claimSession]);

  return { isTabActive, claimSession };
};
