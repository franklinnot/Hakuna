export const SOCKET_EVENTS = {
  MENSAJE_PRIVADO: 'nuevo_mensaje_privado',
  MENSAJE_GRUPAL: 'mensaje_grupal',
  USUARIO_CONECTADO: 'usuario_conectado',
  USUARIO_DESCONECTADO: 'usuario_desconectado',
} as const;

export type SocketEventKeys = keyof typeof SOCKET_EVENTS;
