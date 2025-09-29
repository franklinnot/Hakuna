import { AuthLayout } from "../../../../shared/infraestructure/components/layouts/auth-layout";
import { useAuthStore } from "../../../../shared/infraestructure/hooks/useAuthStore";

export const ProfilePage = () => {
  const { usuario, logout } = useAuthStore();
  return (
    <AuthLayout>
      <p className="text-[var(--black-primary)]">Hola {usuario?.nombre}</p>
    </AuthLayout>
  );
};
