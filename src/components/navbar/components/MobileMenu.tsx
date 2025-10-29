"use client";

import { useState } from "react";
import type { FC, FormEvent } from "react";
import { MenuItem } from "./MobileMenuData";
import { MobileMenuHeader } from "./MobileMenuHeader";
import { MobileMenuPromo } from "./MobileMenuPromo";
import { MobileMenuContent } from "./MobileMenuContent";
import { DynamicMobileSubmenu } from "./DynamicMobileSubmenu";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import { menusEndpoints, type Menu } from "@/lib/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
};

// SUBMENU_COMPONENTS eliminado - todas las categorías dinámicas usan DynamicMobileSubmenu

export const MobileMenu: FC<Props> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeMenus, setActiveMenus] = useState<Menu[] | null>(null);
  const [activeCategoryCode, setActiveCategoryCode] = useState<string | null>(null);

  // Estado para carga bajo demanda de menús
  const [loadedMenus, setLoadedMenus] = useState<Record<string, Menu[]>>({});
  const [loadingMenus, setLoadingMenus] = useState<Record<string, boolean>>({});

  const { getNavbarRoutes, loading } = useVisibleCategories();
  const menuRoutes = getNavbarRoutes();

  if (!isOpen) return null;

  // Función para cargar menús bajo demanda
  const loadMenusForCategory = async (categoryUuid: string) => {
    // Si ya están cargados o están cargando, no hacer nada
    if (loadedMenus[categoryUuid] || loadingMenus[categoryUuid]) return;

    setLoadingMenus(prev => ({ ...prev, [categoryUuid]: true }));
    try {
      const response = await menusEndpoints.getMenusByCategory(categoryUuid);
      if (response.success && response.data) {
        setLoadedMenus(prev => ({ ...prev, [categoryUuid]: response.data }));
      }
    } catch (error) {
      console.error('Error loading menus:', error);
    } finally {
      setLoadingMenus(prev => ({ ...prev, [categoryUuid]: false }));
    }
  };

  const handleMenuItemClick = (item: MenuItem & { menus?: Menu[]; categoryCode?: string; uuid?: string }) => {
    if (item.hasDropdown) {
      // Si el item tiene uuid, cargar menús bajo demanda
      if (item.uuid) {
        const categoryUuid = item.uuid;
        const cachedMenus = loadedMenus[categoryUuid];
        const isLoading = loadingMenus[categoryUuid];

        // Cargar menús si no están en caché
        if (!cachedMenus && !isLoading) {
          loadMenusForCategory(categoryUuid);
        }

        // Mostrar submenú con menús cargados o en estado de carga
        setActiveMenus(cachedMenus || []);
        setActiveCategoryCode(item.categoryCode || '');
        setActiveSubmenu(item.name);
      }
    } else {
      onClose();
    }
  };

  // Determinar qué componente de submenú renderizar
  let SubmenuComponent = null;
  if (activeSubmenu) {
    // Buscar el item activo para obtener su uuid
    const activeItem = menuRoutes.find(route => route.name === activeSubmenu);
    const isLoadingCategory = activeItem?.uuid ? loadingMenus[activeItem.uuid] || false : false;

    if (activeCategoryCode) {
      // Usar DynamicMobileSubmenu para categorías con datos de API
      SubmenuComponent = (
        <DynamicMobileSubmenu
          menus={activeMenus || []}
          categoryCode={activeCategoryCode}
          onClose={onClose}
          loading={isLoadingCategory}
        />
      );
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[10000]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[10001] overflow-y-auto">
        <MobileMenuHeader
          activeSubmenu={activeSubmenu}
          onClose={onClose}
          onBack={() => setActiveSubmenu(null)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
        />

        <MobileMenuPromo onClose={onClose} />

        {SubmenuComponent || (
          <MobileMenuContent
            onClose={onClose}
            onMenuItemClick={handleMenuItemClick}
            menuRoutes={menuRoutes}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};