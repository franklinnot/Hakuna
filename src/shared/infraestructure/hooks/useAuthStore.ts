import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionState } from "../../../modules/auth/application/types/session-state.interface";
import { Paginas } from "../../domain/enums/paginas.enum";

export const useAuthStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      view: Paginas.PUBLIC,
      isAuthenticated: false,

      setView: (view) => set({ view }),

      setSession: ({ usuario, token }) =>
        set({
          usuario,
          token: token,
          isAuthenticated: true,
          view: Paginas.CHATS,
        }),

      logout: () =>
        set({
          token: null,
          usuario: null,
          isAuthenticated: false,
          view: Paginas.PUBLIC,
        }),
    }),
    {
      name: "hakuna-auth-storage",
    }
  )
);

// un listener cada que se actualiza el local storgae
window.addEventListener("storage", (e) => {
  // verificamos que el cambio fue en la clave de nuestro store
  if (e.key == "hakuna-auth-storage") {
    // forzamos al store a releer los datos desde local Storage
    useAuthStore.persist.rehydrate();
  }
});
