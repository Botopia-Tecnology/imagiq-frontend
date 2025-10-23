"use client";

import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import type { Menu } from "@/lib/api";

type Props = {
  menus: Menu[];
  categoryCode: string;
  onClose: () => void;
  loading?: boolean;
};

/**
 * Mapea el código de categoría de la API al slug de URL
 */
const getCategorySlug = (categoryCode: string): string => {
  const mapping: Record<string, string> = {
    'IM': 'dispositivos-moviles',
    'AV': 'televisores',
    'DA': 'electrodomesticos',
    'IT': 'monitores',
    'accesorios': 'accesorios',
  };
  return mapping[categoryCode] || categoryCode.toLowerCase();
};

/**
 * Convierte un nombre de menú a slug amigable para URL
 */
const menuNameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/[^\w-]/g, '') // Remover caracteres especiales
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-|-$/g, ''); // Remover guiones al inicio/final
};

/**
 * Componente dinámico de submenú mobile que consume datos de la API
 * Se usa para las categorías que vienen desde el backend
 */
export const DynamicMobileSubmenu: FC<Props> = ({ menus, categoryCode, onClose, loading = false }) => {
  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-8 mb-6">
          {/* Columna 1 - Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={`sk1-${i}`} className="flex items-center gap-2">
                <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          {/* Columna 2 - Skeleton */}
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={`sk2-${i}`} className="flex items-center gap-2">
                <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filtrar solo menús activos
  const activeMenus = menus.filter(menu => menu.activo);

  if (activeMenus.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center py-8 text-gray-500">
          No hay menús disponibles
        </p>
      </div>
    );
  }

  // Dividir en dos columnas
  const midpoint = Math.ceil(activeMenus.length / 2);
  const column1 = activeMenus.slice(0, midpoint);
  const column2 = activeMenus.slice(midpoint);

  // Función para generar la URL del menú
  const getMenuHref = (menu: Menu): string => {
    const categorySlug = getCategorySlug(categoryCode);
    const seccionSlug = menuNameToSlug(menu.nombreVisible || menu.nombre);

    return `/productos/${categorySlug}?seccion=${seccionSlug}`;
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-x-8 mb-6">
        {/* Columna 1 */}
        <div className="space-y-3">
          {column1.map((menu) => (
            <Link
              key={menu.uuid}
              href={getMenuHref(menu)}
              onClick={onClose}
              className="flex items-center gap-2"
            >
              {menu.imagen && (
                <div className="w-12 h-12 flex-shrink-0 relative">
                  <Image
                    src={menu.imagen}
                    alt={menu.nombreVisible || menu.nombre}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <p className="text-xs text-gray-900 whitespace-pre-line leading-tight" style={{ fontWeight: 900 }}>
                {menu.nombreVisible || menu.nombre}
              </p>
            </Link>
          ))}
        </div>

        {/* Columna 2 */}
        {column2.length > 0 && (
          <div className="space-y-3">
            {column2.map((menu) => (
              <Link
                key={menu.uuid}
                href={getMenuHref(menu)}
                onClick={onClose}
                className="flex items-center gap-2"
              >
                {menu.imagen && (
                  <div className="w-12 h-12 flex-shrink-0 relative">
                    <Image
                      src={menu.imagen}
                      alt={menu.nombreVisible || menu.nombre}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-900 whitespace-pre-line leading-tight" style={{ fontWeight: 900 }}>
                  {menu.nombreVisible || menu.nombre}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
