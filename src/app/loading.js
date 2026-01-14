export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white dark:bg-gray-900">
      {/* Animated Book Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">📖</span>
        </div>
      </div>

      <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
        Loading Library...
      </p>
    </div>
  );
}
