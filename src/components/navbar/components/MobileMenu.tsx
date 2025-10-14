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

export const MobileMenu: FC<Props> = ({ isOpen, onClose, searchQuery, onSearchChange, onSearchSubmit }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.hasDropdown && SUBMENU_COMPONENTS[item.name]) {
      setActiveSubmenu(item.name);
    } else {
      onClose();
    }
  };

  const SubmenuComponent = activeSubmenu ? SUBMENU_COMPONENTS[activeSubmenu] : null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} aria-hidden="true" />

      <div className="fixed inset-y-0 left-0 w-full max-w-md bg-white z-[101] overflow-y-auto">
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
          <SubmenuComponent onClose={onClose} />
        ) : (
          <MobileMenuContent onClose={onClose} onMenuItemClick={handleMenuItemClick} />
        )}
      </div>
    </>
  );
};