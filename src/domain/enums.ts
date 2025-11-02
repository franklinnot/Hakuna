export enum Estado {
  HABILITADO = 'Habilitado',
  DESHABILITADO = 'Deshabilitado',
}

export enum TipoArchivo {
  DOCUMENTO = 'Documento',
  AUDIO = 'Audio',
  IMAGEN = 'Imagen',
  VIDEO = 'Video',
}

export enum DocumentoExtension {
  PDF = 'pdf',
  DOCX = 'docx',
}

export enum Paginas {
  PUBLIC = 'public',
  CHATS = 'chats',
}

export enum TipoChats {
  PRIVADO = 'privado',
  GRUPAL = 'grupal',
}

export enum TipoEvento {
  USUARIO_ACTUALIZADO = 'usuarioConectado',
  //
  NUEVO_MENSAJE_PRIVADO = 'nuevoMensajePrivado',
  NUEVO_MENSAJE_GRUPAL = 'nuevoMensajeGrupal',
  MENSAJE_ACTUALIZADO = 'mensajeActualizado',
  MENSAJE_ELIMINADO = 'mensajeEliminado',
  MENSAJE_LEIDO = 'mensajeLeido',
  //
  NUEVO_CHAT_GRUPAL = 'nuevoChatGrupal',
  CHAT_GRUPAL_ACTUALIZADO = 'chatGrupalActualizado',
  NUEVO_INTEGRANTE = 'nuevoIntegrante',
  INTEGRANTE_ACTUALIZADO = 'integranteActualizado',
  INTEGRANTE_ELIMINADO = 'integranteEliminado',
  GRUPO_ELIMINADO = 'grupoEliminado',
}

export enum EstadoEnvioMensaje {
  SENDING = 'sending',
  SENT = 'sent',
  ERROR = 'error',
}
