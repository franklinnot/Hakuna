export const LoadingScreen = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center items-center 
                 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
    >
      <img
        src="/logo.svg"
        alt="Hakuna logo"
        className="w-20 h-20 animate-pulse drop-shadow-lg"
      />

      <div className="flex space-x-2 mt-6">
        <div className="h-3 w-3 bg-[var(--green-primary)] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-3 w-3 bg-[var(--green-primary)] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-3 w-3 bg-[var(--green-primary)] rounded-full animate-bounce" />
      </div>

      <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
        Cargando...
      </p>
    </div>
  );
};
