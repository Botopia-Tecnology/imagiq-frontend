/**
 * 📄 PAGINATION COMPONENT
 *
 * Componente de paginación reutilizable con navegación completa
 */

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
}: PaginationProps) {
  // Calcular el rango de páginas a mostrar
  const getPageNumbers = () => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-6", className)}>
      {/* Información de resultados */}
      <div className="text-sm text-gray-700">
        Mostrando {startItem} - {endItem} de {totalItems} productos
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors min-w-[40px]",
                page === "..."
                  ? "text-gray-400 cursor-default"
                  : page === currentPage
                  ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          )}
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
