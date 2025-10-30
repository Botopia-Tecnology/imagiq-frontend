"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { FC } from "react";
import { MenuItem } from "./MobileMenuData";
import { hasDropdownMenu } from "../utils/helpers";
import type { NavItem } from "../types";
import type { Menu } from "@/lib/api";

type Props = {
  onClose: () => void;
  onMenuItemClick: (item: MenuItem & { menus?: Menu[]; categoryCode?: string; uuid?: string; dropdownName?: string; categoryVisibleName?: string }) => void;
  menuRoutes: NavItem[];
  loading: boolean;
};

export const MobileMenuContent: FC<Props> = ({ onClose, onMenuItemClick, menuRoutes, loading }) => {
  // Usar todas las rutas del navbar en el mismo orden que desktop
  // Cada item ya viene con toda la información necesaria (uuid, categoryCode, etc.)
  const menuItems: (MenuItem & { menus?: Menu[]; categoryCode?: string; uuid?: string; dropdownName?: string; categoryVisibleName?: string })[] = menuRoutes.map(route => {
    const dropdownKey = route.dropdownName || route.name;
    const hasDropdown = hasDropdownMenu(dropdownKey, route);
    
    return {
      name: route.name,
      href: route.href,
      hasDropdown,
      categoryCode: route.categoryCode,
      uuid: route.uuid,
      dropdownName: route.dropdownName,
      categoryVisibleName: route.categoryVisibleName,
    };
  });

  return (
    <div className="p-4">
      {/* Sección COMPRAR POR CATEGORÍA (dinámica + estática) */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">COMPRAR POR CATEGORÍA</h3>
        <nav>
          {loading ? (
            // Skeleton loader mientras carga - similar al de desktop
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-full flex items-center justify-between py-3 px-2">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            menuItems.map((item) => (
              item.hasDropdown ? (
                <button
                  key={item.name}
                  onClick={() => onMenuItemClick(item)}
                  className="w-full flex items-center justify-between py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg px-2 -mx-2"
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="w-full flex items-center justify-between py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg px-2 -mx-2"
                >
                  <span>{item.name}</span>
                </Link>
              )
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
