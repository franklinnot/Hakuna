import { AuthLayout } from "../../../../shared/infraestructure/components/layouts/auth-layout";

export const ChatsPage = () => {
  return (
    <AuthLayout>
      <div className="w-full h-full grid grid-rows-1 grid-cols-[64px_1fr_3fr] gap-4 p-4">
        <div className="bg-amber-500">Navbar</div>
        <div className="bg-green-500">Historial de chats (grupos y privados)</div>
        <div className="bg-red-500">Historial de mensajes de un chat en especifico</div>
      </div>
    </AuthLayout>
  );
};
