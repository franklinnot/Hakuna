import { PublicLayout } from "../../../../shared/infraestructure/components/layouts/public-layout";
import { LoginForm } from "../components/login-form";

export const LoginPage = () => {
  return (
    <PublicLayout>
      <LoginForm />
    </PublicLayout>
  );
};
