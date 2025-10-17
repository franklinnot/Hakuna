import { IChatGrupalResponse } from '../../../../../application/chats/chats.responses';
import { IMensajeResponse } from '../../../../../application/mensajes/mensajes.responses';
import { IUsuarioResponse } from '../../../../../application/usuarios/usuarios.responses';

interface MensajesGrupalesProps {
  chat: IChatGrupalResponse;
  usuario: IUsuarioResponse;
  mensajesIniciales: IMensajeResponse[];
}

export const MensajesGrupales = ({
  chat,
  usuario,
  mensajesIniciales,
}: MensajesGrupalesProps) => {
  return (
    <div>
      <p>Mensajes grupales</p>
    </div>
  );
};
