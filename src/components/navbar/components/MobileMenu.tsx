"use client";

import { useState, useEffect } from "react";
import type { FC, FormEvent, ReactNode } from "react";
import { MenuItem } from "./MobileMenuData";
import { MobileMenuHeader } from "./MobileMenuHeader";
import { MobileMenuPromo } from "./MobileMenuPromo";
import { MobileMenuContent } from "./MobileMenuContent";
import { DynamicMobileSubmenu } from "./DynamicMobileSubmenu";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import { menusEndpoints, type Menu } from "@/lib/api";
import OfertasDropdown from "@/components/dropdowns/ofertas";
import SoporteDropdown from "@/components/dropdowns/soporte";
import type { DropdownName } from "../types";

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
  const [activeDropdownName, setActiveDropdownName] = useState<DropdownName | null>(null);

  // Estado para carga bajo demanda de menús
  const [loadedMenus, setLoadedMenus] = useState<Record<string, Menu[]>>({});
  const [loadingMenus, setLoadingMenus] = useState<Record<string, boolean>>({});

  const { getNavbarRoutes, loading } = useVisibleCategories();
  const menuRoutes = getNavbarRoutes();

  // Sincronizar activeMenus cuando los menús se cargan en loadedMenus
  useEffect(() => {
    if (activeSubmenu && activeCategoryCode) {
      const activeItem = menuRoutes.find(route => route.name === activeSubmenu);
      if (activeItem?.uuid) {
        const categoryUuid = activeItem.uuid;
        const menus = loadedMenus[categoryUuid];
        // Actualizar activeMenus cuando los menús estén disponibles
        if (menus && menus.length > 0) {
          setActiveMenus(menus);
        } else if (!loadingMenus[categoryUuid] && menus === undefined) {
          // Si no hay menús y no está cargando, podría ser que aún no se haya iniciado la carga
          // En este caso, mantener el estado actual
        }
      }
    }
  }, [loadedMenus, activeSubmenu, activeCategoryCode, menuRoutes, loadingMenus]);

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

  const handleMenuItemClick = (item: MenuItem & { menus?: Menu[]; categoryCode?: string; uuid?: string; dropdownName?: string }) => {
    if (item.hasDropdown) {
      const dropdownKey = item.dropdownName || item.name;
      const STATIC_CATEGORIES = ['ofertas', 'tiendas', 'soporte'];
      
      // Si es una categoría estática (Ofertas, Soporte)
      if (STATIC_CATEGORIES.includes(item.uuid || '')) {
        setActiveDropdownName(dropdownKey as DropdownName);
        setActiveSubmenu(item.name);
        return;
      }

      // Si el item tiene uuid (categoría dinámica), cargar menús bajo demanda
      if (item.uuid) {
        const categoryUuid = item.uuid;
        const cachedMenus = loadedMenus[categoryUuid];
        const isLoading = loadingMenus[categoryUuid];

        // Primero establecer el estado del submenú activo
        setActiveCategoryCode(item.categoryCode || '');
        setActiveSubmenu(item.name);
        
        // Si ya hay menús en caché, establecerlos inmediatamente
        if (cachedMenus) {
          setActiveMenus(cachedMenus);
        } else {
          // Si no hay menús en caché, NO establecer activeMenus a []
          // Esto evita que se muestre "no hay menús disponibles" mientras cargan
          // El useEffect actualizará activeMenus cuando los menús se carguen
          // Cargar menús si no están cargando ya
          if (!isLoading) {
            loadMenusForCategory(categoryUuid);
          }
        }
      }
    } else {
      onClose();
    }
  };

  // Función para obtener el componente de submenú apropiado (igual que desktop pero móvil)
  const getSubmenuComponent = (): ReactNode | null => {
    if (!activeSubmenu) return null;

    // Si es un dropdown estático (Ofertas, Soporte)
    if (activeDropdownName) {
      switch (activeDropdownName) {
        case "Ofertas":
          return (
            <div className="flex-1 overflow-y-auto">
              <OfertasDropdown
                isMobile={true}
                onItemClick={() => onClose()}
              />
            </div>
          );
        case "Soporte":
          return (
            <div className="flex-1 overflow-y-auto">
              <SoporteDropdown
                isMobile={true}
                onClose={onClose}
              />
            </div>
          );
        default:
          return null;
      }
    }

    // Si es una categoría dinámica con menús de API
    if (activeCategoryCode) {
      const activeItem = menuRoutes.find(route => route.name === activeSubmenu);
      const categoryUuid = activeItem?.uuid;
      const isLoadingCategory = categoryUuid ? (loadingMenus[categoryUuid] ?? false) : false;
      
      // Determinar qué menús pasar:
      // 1. Si hay activeMenus (ya cargados), usarlos
      // 2. Si está cargando, pasar array vacío para mostrar skeleton
      // 3. Si hay menús en loadedMenus pero no en activeMenus, el useEffect los actualizará
      const menusToPass = activeMenus || (isLoadingCategory ? [] : []);

      // Determinar si está cargando: está explícitamente cargando O si no hay menús en activeMenus ni en loadedMenus
      const isStillLoading = isLoadingCategory || (categoryUuid ? (!activeMenus && !loadedMenus[categoryUuid]) : false);

      return (
        <DynamicMobileSubmenu
          menus={menusToPass}
          categoryCode={activeCategoryCode}
          onClose={onClose}
          loading={isStillLoading}
        />
      );
    }

    return null;
  };

  const SubmenuComponent = getSubmenuComponent();

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
          onBack={() => {
            setActiveSubmenu(null);
            setActiveDropdownName(null);
            setActiveMenus(null);
            setActiveCategoryCode(null);
          }}
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