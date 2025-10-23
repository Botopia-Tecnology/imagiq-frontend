"use client";

import { useState } from "react";
import type { FC, FormEvent } from "react";
import { MenuItem } from "./MobileMenuData";
import { MobileMenuHeader } from "./MobileMenuHeader";
import { MobileMenuPromo } from "./MobileMenuPromo";
import { MobileMenuContent } from "./MobileMenuContent";
import { DispositivosMovilesSubmenu } from "./DispositivosMovilesSubmenu";
import { TelevisoresSubmenu } from "./TelevisoresSubmenu";
import { ElectrodomesticosSubmenu } from "./ElectrodomesticosSubmenu";
import { MonitoresSubmenu } from "./MonitoresSubmenu";
import { AccesoriosSubmenu } from "./AccesoriosSubmenu";
import { DynamicMobileSubmenu } from "./DynamicMobileSubmenu";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import type { Menu } from "@/lib/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
};

const SUBMENU_COMPONENTS: Record<string, FC<{ onClose: () => void }>> = {
  "Dispositivos móviles": DispositivosMovilesSubmenu,
  "Televisores y AV": TelevisoresSubmenu,
  Electrodomésticos: ElectrodomesticosSubmenu,
  Monitores: MonitoresSubmenu,
  Accesorios: AccesoriosSubmenu,
};

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

  const { getNavbarRoutes, loading } = useVisibleCategories();
  const menuRoutes = getNavbarRoutes();

  if (!isOpen) return null;

  const handleMenuItemClick = (item: MenuItem & { menus?: Menu[]; categoryCode?: string }) => {
    if (item.hasDropdown) {
      // Si el item tiene menus de la API, usar DynamicMobileSubmenu
      if (item.menus && item.menus.length > 0) {
        setActiveMenus(item.menus);
        setActiveCategoryCode(item.categoryCode || '');
        setActiveSubmenu(item.name);
      } else if (SUBMENU_COMPONENTS[item.name]) {
        // Fallback a componente estático
        setActiveMenus(null);
        setActiveCategoryCode(null);
        setActiveSubmenu(item.name);
      }
    } else {
      onClose();
    }
  };

  // Determinar qué componente de submenú renderizar
  let SubmenuComponent = null;
  if (activeSubmenu) {
    if (activeMenus && activeMenus.length > 0 && activeCategoryCode) {
      // Usar DynamicMobileSubmenu para categorías con datos de API
      SubmenuComponent = (
        <DynamicMobileSubmenu
          menus={activeMenus}
          categoryCode={activeCategoryCode}
          onClose={onClose}
        />
      );
    } else if (SUBMENU_COMPONENTS[activeSubmenu]) {
      // Usar componente estático (fallback)
      const StaticComponent = SUBMENU_COMPONENTS[activeSubmenu];
      SubmenuComponent = <StaticComponent onClose={onClose} />;
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

        {SubmenuComponent ? (
          SubmenuComponent
        ) : (
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