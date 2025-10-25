"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import type { Menu } from "@/lib/api";
import { useMenusLazy } from "@/hooks/useMenusLazy";

type Props = {
  categoryUuid: string;
  categoryCode: string;
  onClose: () => void;
  // Deprecated: usar categoryUuid en su lugar
  menus?: Menu[];
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
export const DynamicMobileSubmenu: FC<Props> = ({
  categoryUuid,
  categoryCode,
  onClose,
  menus: deprecatedMenus,
  loading: deprecatedLoading = false
}) => {
  const { loadMenus } = useMenusLazy();
  const [menus, setMenus] = useState<Menu[]>(deprecatedMenus || []);
  const [loading, setLoading] = useState(deprecatedLoading);

  useEffect(() => {
    // Si ya tenemos menus (modo legacy), no cargar
    if (deprecatedMenus && deprecatedMenus.length > 0) {
      setMenus(deprecatedMenus);
      setLoading(false);
      return;
    }

    // Cargar menús de forma lazy
    const fetchMenus = async () => {
      setLoading(true);
      const loadedMenus = await loadMenus(categoryUuid);
      setMenus(loadedMenus);
      setLoading(false);
    };

    fetchMenus();
  }, [categoryUuid, deprecatedMenus, loadMenus]);

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div className="px-6 pt-2 pb-6 min-h-screen flex flex-col">

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={`sk1-${i}`} className="flex items-center gap-2">
                <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
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


  // Función para generar la URL del menú
  const getMenuHref = (menu: Menu): string => {
    const categorySlug = getCategorySlug(categoryCode);
    const seccionSlug = menuNameToSlug(menu.nombreVisible || menu.nombre);

    return `/productos/${categorySlug}?seccion=${seccionSlug}`;
  };

  return (
    <div className="px-6 pt-2 pb-6 min-h-screen flex flex-col">
      <div className="space-y-6">
        {activeMenus.map((menu) => (
          <Link
            key={menu.uuid}
            href={getMenuHref(menu)}
            onClick={onClose}
            className="flex items-center gap-4"
          >
            {menu.imagen && (
              <div className="w-20 h-20 flex-shrink-0 relative">
                <Image
                  src={menu.imagen}
                  alt={menu.nombreVisible || menu.nombre}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className="text-base text-gray-900 whitespace-pre-line leading-tight" style={{ fontWeight: 900 }}>
              {menu.nombreVisible || menu.nombre}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
