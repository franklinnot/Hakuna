export const SkeletonChatsList = () => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 bg-gray-700 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-gray-600" />
          <div className="flex flex-col flex-1 gap-2">
            <div className="h-4 bg-gray-600 rounded w-3/4" />
            <div className="h-3 bg-gray-600 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
