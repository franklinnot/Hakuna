import { IChatPrivadoResponse } from '../../../../../../domain/responses/chats.responses';
import { IUsuarioResponse } from '../../../../../../domain/responses/usuarios.responses';
import { InputMensaje } from './components/input-mensaje';
import { HeaderMensajesPrivados } from './components/header-mensajes-privados';
import { BodyMensajesPrivados } from './components/body-mensajes-privados';

export interface MensajesPrivadosProps {
  chat: IChatPrivadoResponse;
  usuario: IUsuarioResponse;
}

export const MensajesPrivados = ({ chat, usuario }: MensajesPrivadosProps) => {
  return (
    <section className="flex flex-col w-full h-full rounded-3xl overflow-hidden shadow-xl bg-white">
      {/* HEADER */}
      <HeaderMensajesPrivados chat={chat} />

      {/* BODY */}
      <BodyMensajesPrivados chat={chat} usuario={usuario} />

      {/* FOOTER */}
      <InputMensaje chat={chat} usuario={usuario} />
    </section>
  );
};
