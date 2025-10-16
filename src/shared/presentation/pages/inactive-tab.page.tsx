import { Button } from "../components/ui/button";

export const InactiveTab = ({ claimSession }: { claimSession: () => void }) => (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm">
    <div className="p-8 text-center bg-white rounded-lg shadow-2xl">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Hay otra sesión abierta
      </h2>
      <p className="mb-6 text-gray-600">
        Hakuna se está ejecutando en otra pestaña. Puedes cerrar esta o usar la
        aplicación aquí.
      </p>
      <Button onClick={claimSession}>Usar aquí</Button>
    </div>
  </div>
);
