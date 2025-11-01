import { IChatGrupalResponse } from '../../../../../../domain/responses/chats.responses';
import { InformacionGrupoModal } from './informacion-grupo-modal';
import { HeaderMensajesGrupales } from './components/header-mensajes-grupales';
import { BodyMensajesGrupales } from './components/body-mensajes-grupales';
import { InputMensajeGrupal } from './components/input-mensaje-grupal/input-mensaje-grupal';
import { useGroupManagement } from './hooks/useGroupManagement';
import { AppStore } from '../../../../../../application/store/app.store';

interface MensajesGrupalesProps {
  chat: IChatGrupalResponse;
}

export const MensajesGrupales = ({
  chat,
}: MensajesGrupalesProps) => {
  // Obtener usuario del store
  const usuario = AppStore((s) => s.usuario);

  // Hook para gestión del grupo
  const {
    isConfigModalOpen,
    handleInfoGrupo,
    handleSalirGrupo,
    handleCloseConfigModal,
    handleUpdateGroup,
    handleRemoveMember,
    handleAddMember,
  } = useGroupManagement(chat);

  return (
    <section className="flex flex-col h-full">
      <HeaderMensajesGrupales
        chat={chat}
        onInfoGrupo={handleInfoGrupo}
        onSalirGrupo={handleSalirGrupo}
      />
      
      <BodyMensajesGrupales
        chat={chat}
        usuario={usuario!}
      />
      
      <InputMensajeGrupal
        chat={chat}
      />

      {/* Modal de configuración del grupo */}
      {isConfigModalOpen && (
        <InformacionGrupoModal
          isOpen={isConfigModalOpen}
          onClose={handleCloseConfigModal}
          groupName={chat.nombre}
          groupDescription={chat.descripcion || ''}
          groupPhoto={chat.link_foto}
          members={chat.integrantes.map((integrante) => ({
            id: integrante.id_usuario,
            name: integrante.nombre,
            avatar: integrante.link_foto,
            isAdmin: integrante.is_admin,
          }))}
          onUpdateGroup={handleUpdateGroup}
          onRemoveMember={handleRemoveMember}
          onAddMember={handleAddMember}
        />
      )}
    </section>
  );
};
