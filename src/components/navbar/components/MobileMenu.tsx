"use client";

import { useState, useEffect } from "react";
import type { FC, FormEvent, ReactNode } from "react";
import { MenuItem } from "./MobileMenuData";
import { MobileMenuHeader } from "./MobileMenuHeader";
import { MobileMenuPromo } from "./MobileMenuPromo";
import { MobileMenuContent } from "./MobileMenuContent";
import { DynamicMobileSubmenu } from "./DynamicMobileSubmenu";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import { usePreloadCategoryMenus } from "@/hooks/usePreloadCategoryMenus";
import type { Menu } from "@/lib/api";
import { isStaticCategoryUuid } from "@/constants/staticCategories";
import OfertasDropdown from "@/components/dropdowns/ofertas";
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
  const [activeCategoryCode, setActiveCategoryCode] = useState<string | null>(
    null
  );
  const [activeCategoryVisibleName, setActiveCategoryVisibleName] = useState<
    string | null
  >(null);
  const [activeDropdownName, setActiveDropdownName] =
    useState<DropdownName | null>(null);

  // Pre-cargar menús de todas las categorías dinámicas al cargar la página
  const { getMenus, isLoading } = usePreloadCategoryMenus();

  const { getNavbarRoutes, loading } = useVisibleCategories();
  const menuRoutes = getNavbarRoutes();

  // Sincronizar activeMenus cuando los menús precargados estén disponibles
  useEffect(() => {
    if (activeSubmenu && activeCategoryCode) {
      const activeItem = menuRoutes.find(
        (route) => route.name === activeSubmenu
      );
      if (activeItem?.uuid) {
        const categoryUuid = activeItem.uuid;
        const menus = getMenus(categoryUuid);
        // Actualizar activeMenus cuando los menús estén disponibles
        if (menus && menus.length > 0) {
          setActiveMenus(menus);
        }
      }
    }
  }, [activeSubmenu, activeCategoryCode, menuRoutes, getMenus]);

  if (!isOpen) return null;

  const handleMenuItemClick = (
    item: MenuItem & {
      menus?: Menu[];
      categoryCode?: string;
      uuid?: string;
      dropdownName?: string;
      categoryVisibleName?: string;
    }
  ) => {
    if (item.hasDropdown) {
      const dropdownKey = item.dropdownName || item.name;
      // Si es una categoría estática (Ofertas, Soporte)
      if (isStaticCategoryUuid(item.uuid)) {
        setActiveDropdownName(dropdownKey as DropdownName);
        setActiveSubmenu(item.name);
        return;
      }

      // Si el item tiene uuid (categoría dinámica), usar menús precargados
      if (item.uuid) {
        const categoryUuid = item.uuid;
        const cachedMenus = getMenus(categoryUuid);
        const menusLoading = isLoading(categoryUuid);

        // Primero establecer el estado del submenú activo
        setActiveCategoryCode(item.categoryCode || "");
        setActiveCategoryVisibleName(item.categoryVisibleName || null);
        setActiveSubmenu(item.name);

        // Si ya hay menús precargados, establecerlos inmediatamente
        if (cachedMenus && cachedMenus.length > 0) {
          setActiveMenus(cachedMenus);
        } else {
          // Si aún están cargando, mantener activeMenus como null
          // El useEffect actualizará activeMenus cuando los menús se carguen
          setActiveMenus(null);
        }
      }
    } else {
      onClose();
    }
  };

  // Función para obtener el componente de submenú apropiado (igual que desktop pero móvil)
  const getSubmenuComponent = (): ReactNode | null => {
    if (!activeSubmenu) return null;

    // Si es un dropdown estático (Ofertas)
    if (activeDropdownName) {
      switch (activeDropdownName) {
        case "Ofertas":
          return (
            <div className="flex-1 overflow-y-auto">
              <OfertasDropdown isMobile={true} onItemClick={() => onClose()} />
            </div>
          );
        default:
          return null;
      }
    }

    // Si es una categoría dinámica con menús de API
    if (activeCategoryCode) {
      const activeItem = menuRoutes.find(
        (route) => route.name === activeSubmenu
      );
      const categoryUuid = activeItem?.uuid;
      const menusToPass = activeMenus || [];
      // Verificar si están cargando usando el hook de precarga
      const isStillLoading = categoryUuid ? isLoading(categoryUuid) : false;

      return (
        <DynamicMobileSubmenu
          menus={menusToPass}
          categoryCode={activeCategoryCode}
          categoryVisibleName={activeCategoryVisibleName || undefined}
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
