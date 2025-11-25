"use client";

import { Package } from "lucide-react";

interface BundleBadgeProps {
  /** Variante del badge */
  variant?: "default" | "compact" | "inline";
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Badge minimalista que indica que un producto pertenece a un bundle
 */
export function BundleBadge({
  variant = "default",
  className = "",
}: BundleBadgeProps) {
  if (variant === "compact") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded ${className}`}
      >
        <Package className="w-2.5 h-2.5" />
        Bundle
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <span
        className={`inline-flex items-center gap-1 text-gray-500 text-xs ${className}`}
      >
        <Package className="w-3 h-3" />
        Parte de un bundle
      </span>
    );
  }

  // Default variant
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 ${className}`}
    >
      <Package className="w-3 h-3" />
      <span className="font-medium">Bundle</span>
    </div>
  );
}
