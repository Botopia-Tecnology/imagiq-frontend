"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { FC } from "react";
import { FEATURED_PRODUCTS, MenuItem } from "./MobileMenuData";
import type { Menu } from "@/lib/api";

type NavItem = {
  name: string;
  href: string;
  category: string;
  categoryCode: string;
  dropdownName?: string;
  uuid: string;
  totalProducts: number;
  menus: Menu[];
  orden: number;
};

type Props = {
  onClose: () => void;
  onMenuItemClick: (item: MenuItem & { menus?: Menu[]; categoryCode?: string }) => void;
  menuRoutes: NavItem[];
  loading: boolean;
};

export const MobileMenuContent: FC<Props> = ({ onClose, onMenuItemClick, menuRoutes, loading }) => {
  // Rutas estáticas que siempre deben aparecer
  const staticRoutes = [
    { name: "Tienda Online", href: "/", hasDropdown: false },
    { name: "Soporte", href: "/soporte/inicio_de_soporte", hasDropdown: false },
    { name: "Para Empresas", href: "/ventas-corporativas", hasDropdown: false },
  ];

  // Categorías que vienen de la API (las 5 principales)
  const apiCategories = menuRoutes.filter(route =>
    ['IM', 'AV', 'DA', 'IT'].includes(route.categoryCode) || route.categoryCode === 'accesorios'
  );

  // Construir el menú completo: Tienda Online + API Categories + Soporte + Para Empresas
  const menuItems: (MenuItem & { menus?: Menu[]; categoryCode?: string })[] = [
    staticRoutes[0], // Tienda Online
    ...apiCategories.map(route => ({
      name: route.name,
      href: route.href,
      hasDropdown: true,
      menus: route.menus,
      categoryCode: route.categoryCode,
    })),
    staticRoutes[1], // Soporte
    staticRoutes[2], // Para Empresas
  ];

  return (
    <div className="p-4">
      {/* Sección NOVEDADES (estática) */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">NOVEDADES</h3>
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4">
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              onClick={onClose}
              className="flex-shrink-0 text-center"
              style={{ width: "100px" }}
            >
              <div className="mb-1">
                <div className="w-full aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                </div>
              </div>
              <p className="text-xs text-gray-900 leading-tight" style={{ fontWeight: 900 }}>
                {product.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Sección COMPRAR POR CATEGORÍA (dinámica + estática) */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">COMPRAR POR CATEGORÍA</h3>
        <nav>
          {loading ? (
            // Skeleton loader mientras carga
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="py-3 px-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </>
          ) : (
            menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => (item.hasDropdown ? onMenuItemClick(item) : (window.location.href = item.href))}
                className="w-full flex items-center justify-between py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg px-2 -mx-2"
              >
                <span>{item.name}</span>
                {item.hasDropdown && <ChevronRight className="w-5 h-5 text-gray-400" />}
              </button>
            ))
          )}
        </nav>
      </div>

      {/* Sección de usuario (estática) */}
      <div className="border-t pt-4">
        <Link href="/login" onClick={onClose} className="block text-base font-semibold text-blue-600 py-3">
          Iniciar sesión/Sign-Up
        </Link>
        <Link
          href="/productos/dispositivos-moviles"
          onClick={onClose}
          className="block text-base font-semibold text-gray-900 py-3"
        >
          ¿Por qué crear una Samsung Account?
        </Link>
        <Link href="/pedidos" onClick={onClose} className="block text-base font-semibold text-gray-900 py-3">
          Mis pedidos
        </Link>
      </div>
    </div>
  );
};
