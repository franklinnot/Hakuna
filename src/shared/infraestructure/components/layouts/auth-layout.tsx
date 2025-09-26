import { useAuthStore } from "../../../../modules/auth/application/store/auth.store";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { usuario, logout } = useAuthStore();
  return (
    <div>
      <h1>Bienvenido a Hakuna, {usuario?.nombre}!</h1>
      {children}
      <button
        onClick={logout}
        className="p-2 mt-4 text-white bg-red-500 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};
