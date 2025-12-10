/**
 * Skeleton de carga para el FilterSidebar
 * Se muestra mientras se cargan los filtros dinámicos
 */

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

export default function FilterSidebarSkeleton() {
  return (
    <div className="bg-white rounded-none border-0 shadow-none">
      <div>
        {/* Header skeleton */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        {/* Filtros skeleton */}
        <div className="overflow-hidden">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="border-b border-gray-300">
              {/* Header del filtro */}
              <div className="p-4 flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {/* Opciones del filtro */}
              <div className="px-4 pb-4 space-y-3">
                {[1, 2, 3].map((optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

