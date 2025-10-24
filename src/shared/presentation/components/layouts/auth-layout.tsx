import { useSocketListener } from '../../../../infraestructure/hooks/useSocketListener';
export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  useSocketListener();
  return <div className="w-full h-full">{children}</div>;
};
