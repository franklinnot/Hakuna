import React, { useState, useEffect } from 'react';
import type { Message } from '../../../domain/message.interface';
import { MessageService } from '../../../application/chats.service';

const initialMessages: Message[] = [
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: 'Buenos días, necesito una cotización para 10 pollos a la brasa.', has_files: false },
  { id_integrante: 'polleria_ronny_01', descripcion: '¡Hola! Para un pedido tan grande, podemos ofrecerle un descuento. ¿Para qué fecha lo requiere?', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: 'Sería para este sábado al mediodía. ¿Pueden manejar esa cantidad?', has_files: false },
  { id_integrante: 'polleria_ronny_01', descripcion: 'Sí, confirmamos la disponibilidad para 10 unidades el sábado. El costo por unidad sería S/. 50.00.', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: '¡Perfecto! El total es S/. 500.00 entonces.', has_files: false },
  { id_integrante: 'polleria_ronny_01', descripcion: 'Correcto. ¿Necesitaría algún comprobante o factura?', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: 'Sí, requiero factura. Adjunto la razón social en un momento.', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: 'Acabo de enviar el RUC en el PDF adjunto.', has_files: true },
  { id_integrante: 'polleria_ronny_01', descripcion: 'PDF recibido. Procesaremos la factura.', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: '¿El pedido incluye alguna bebida de cortesía?', has_files: false },
  { id_integrante: 'polleria_ronny_01', descripcion: 'Por la cantidad, le obsequiaremos 5 botellas de Coca-Cola de 1.5L.', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: '¡Fantástico, muchas gracias!', has_files: false },
  { id_integrante: 'polleria_ronny_01', descripcion: 'Le enviaremos un resumen del pedido en un momento.', has_files: false },
  { id_integrante: 'polleria_ronny_01', descripcion: 'Aquí está el resumen final de su pedido.', has_files: true },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: 'Todo claro por mi parte. ¿Cuál sería el método de pago?', has_files: false },
  { id_integrante: 'polleria_ronny_01', descripcion: 'Puede ser transferencia bancaria (BCP) o Yape/Plin por el 50% como adelanto.', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: 'Entendido. Haré el depósito del adelanto ahora mismo. Les confirmo cuando esté hecho.', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: 'Adjunto el voucher de S/. 250.00 (50% del total).', has_files: true },
  { id_integrante: 'polleria_ronny_01', descripcion: 'Adelanto recibido. Su pedido para el sábado está 100% confirmado. ¡Gracias!', has_files: false },
  { id_integrante: '68dc9a0f3992ab16f5a094ee', descripcion: 'A ustedes, ¡nos vemos el sábado!', has_files: false },
];

// 3. Componente Principal
export const HistorialMensajes = () => {
  const [messages] = useState<Message[]>(initialMessages);
  const [id_integrante, setId] = useState('');
  const [has_files, setFiles] = useState(false);
  const [descripcion, setDescription] = useState('');

  useEffect(() => {
    try {
        const rawData = localStorage.getItem('hakuna-auth-storage');

      if (!rawData) {
        console.warn(`No se encontró ningún dato en localStorage bajo la clave: ${'hakuna-auth-storage'}`);
        return setId(''); // Si no hay datos, establecer id como cadena vacía
      }

      // El contenido de 'hakuna' es un string JSON que contiene el objeto {state: { ... }}
      const fullState = JSON.parse(rawData);

      // Navegar a la ruta: state.usuario._id
      // Usamos el encadenamiento opcional (?.) para evitar errores si la estructura no existe
      const userId = fullState?.state?.usuario?._id;

      setId(userId);

    } catch (error) {
      console.error("Error al leer o parsear localStorage:", error);
      setId('');
    }
  }, [id_integrante, setId]);

  const handleSend = async () => {
    try {
      const response = await MessageService.registerRequest({
        id_integrante,
        has_files,
        descripcion,
      });
      if (response.success != true) {
        console.log(response.error);
      }
      
    } catch {
      console.log("Hubo un error al enviar el mensaje");
    }finally {
      setDescription('');
    }
  };

  return (
    <div className="flex flex-col w-full h-full rounded-3xl overflow-hidden shadow-xl">

      {/* HEADER: Encabezado del Contacto */}
      <header className="flex items-center p-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-yellow-400 mr-3 flex items-center justify-center text-xl">
          🐔
        </div>
        <span className="font-semibold text-lg flex-grow text-black">Polleria Ronny</span>
        <div className="text-2xl cursor-pointer text-gray-500">⋮</div>
      </header>

      {/* BODY: Área de Mensajes con Scroll */}
      <main className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => {

          // Lógica de MessageBubble APLICADA DIRECTAMENTE:
          const isMine = message.id_integrante === id_integrante;

          const containerClasses = isMine
            ? 'flex justify-end'
            : 'flex justify-start';

          const bubbleClasses = isMine
            ? 'bg-green-500 text-white rounded-tr-none' // Verde para el usuario
            : 'bg-gray-200 text-gray-800 rounded-tl-none'; // Gris para el contacto

          return (
            // Contenedor de la burbuja
            <div key={index} className={`mb-2 w-full ${containerClasses}`}>
              {/* Burbuja de mensaje */}
              <div
                className={`p-2 px-3 max-w-[300px] inline-block rounded-xl shadow-sm ${bubbleClasses}`}
              >
                <p>{message.descripcion}</p>

                {/* Indicador de archivo adjunto */}
                {message.has_files && (
                  <div className={`mt-1 pt-1 ${isMine ? 'border-t border-green-400' : 'border-t border-gray-300'}`}>
                    <span className="text-xs font-semibold">📎 Archivo Adjunto</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>


      {/* FOOTER: Barra de Entrada de Texto */}
      <footer className="flex items-center p-4 bg-white flex-shrink-0">
        {/* Input Box: Archivo, Texto, Emoji */}
        <div className="flex items-center flex-grow bg-gray-100 rounded-xl py-2 px-4 mr-2">
          <span className="text-xl text-gray-500 mr-2">📎</span>

          <input
            type="text"
            placeholder="Escribe algo..."
            value={descripcion}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-grow bg-transparent focus:outline-none text-gray-800"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />

          <span className="text-xl text-gray-500 ml-2">🙂</span>
        </div>

        {/* Botón del Micrófono (o Enviar) */}
        <button
          className="w-11 h-11 bg-green-500 rounded-xl items-center justify-center shadow-md hover:bg-green-600 transition duration-150 flex-shrink-0"
          onClick={handleSend}
          aria-label="Enviar mensaje de voz o texto"
        >
          <span className="text-xl text-white">🎤</span>
        </button>
      </footer>
    </div>
  );
};