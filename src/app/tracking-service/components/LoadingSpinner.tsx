interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = "Cargando...",
}: Readonly<LoadingSpinnerProps>) {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-6 md:py-12">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-700">{message}</p>
      </div>
    </div>
  );
}
