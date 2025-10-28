import { Input } from '../../../../../../components/input';
import { UploadFotoPerfil } from '../../../../../../components/upload-foto-perfil/upload-foto-perfi';
import { Button } from '../../../../../../components/button';
import { ErrorDisplay } from '../../../../../../components/errors/error-display';
import { useProfileFlow } from './useProfileFlow';

export const Profile = () => {
  const {
    nuevoNombre,
    setNombre,
    nuevoUsername,
    setUsername,
    setNuevaFoto,
    error,
    loading,
    hayCambios,
    handleSubmit,
    usuario,
  } = useProfileFlow();

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-6 w-full"
    >
      <UploadFotoPerfil
        initialUrl={usuario?.link_foto}
        onChange={setNuevaFoto}
      />

      <div className="w-full flex flex-col gap-4">
        <label className="block text-sm font-medium text-gray-700">
          Nombre
          <Input
            value={nuevoNombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1"
            autoFocus
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Usuario
          <Input
            value={nuevoUsername}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className="mt-1"
          />
        </label>
      </div>

      {error && <ErrorDisplay error={error} />}

      <Button type="submit" disabled={!hayCambios || loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </Button>
    </form>
  );
};
