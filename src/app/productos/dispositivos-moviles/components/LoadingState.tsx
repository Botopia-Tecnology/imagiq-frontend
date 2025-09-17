/**
 * 🔄 LOADING STATE COMPONENT
 *
 * Estado de carga para la sección Galaxy Buds
 */

import LoadingSpinner from "@/components/LoadingSpinner";
import CategorySlider, { type Category } from "../../components/CategorySlider";

interface LoadingStateProps {
  categories: Category[];
  trackingPrefix: string;
}

export default function LoadingState({
  categories,
  trackingPrefix,
}: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-white">
      <CategorySlider categories={categories} trackingPrefix={trackingPrefix} />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
}
