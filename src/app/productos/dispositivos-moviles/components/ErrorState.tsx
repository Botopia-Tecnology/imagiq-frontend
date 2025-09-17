/**
 * ❌ ERROR STATE COMPONENT
 *
 * Estado de error para la sección Galaxy Buds
 */

import CategorySlider, { type Category } from "../../components/CategorySlider";

interface ErrorStateProps {
  categories: Category[];
  trackingPrefix: string;
  error: string;
  onRetry: () => void;
}

export default function ErrorState({
  categories,
  trackingPrefix,
  error,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-white">
      <CategorySlider categories={categories} trackingPrefix={trackingPrefix} />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error al cargar Galaxy Buds
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}
