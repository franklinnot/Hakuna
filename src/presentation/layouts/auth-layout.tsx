import { useSocketListener } from '../../infraestructure/socket/useSocketListener';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  useSocketListener();
  return <div className="w-full h-full">{children}</div>;
};
