"use client";

import { useEffect, useState } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import { useMenusLazy } from "@/hooks/useMenusLazy";
import type { DynamicDropdownProps } from "./types";
import type { Menu } from "@/lib/api";
import { MobileView } from "./MobileView";
import { DesktopView } from "./DesktopView";
import { transformMenusToItems } from "./utils";

export default function DynamicDropdown({
  categoryUuid,
  categoryName,
  categoryCode,
  isMobile = false,
  onItemClick,
  menus: deprecatedMenus,
}: DynamicDropdownProps) {
  const { loadMenus } = useMenusLazy();
  const [menus, setMenus] = useState<Menu[]>(deprecatedMenus || []);

  useEffect(() => {
    // Si ya tenemos menus (modo legacy), no cargar
    if (deprecatedMenus && deprecatedMenus.length > 0) {
      setMenus(deprecatedMenus);
      return;
    }

    // Cargar menús de forma lazy
    const fetchMenus = async () => {
      const loadedMenus = await loadMenus(categoryUuid);
      setMenus(loadedMenus);
    };

    fetchMenus();
  }, [categoryUuid, deprecatedMenus, loadMenus]);

  const handleClick = (label: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: categoryName,
      item: label,
      href,
    });
    onItemClick?.();
  };

  // Si está cargando, mostrar skeleton o los items vacíos
  const items = transformMenusToItems(menus, categoryCode);

  return isMobile ? (
    <MobileView items={items} categoryName={categoryName} onItemClick={handleClick} />
  ) : (
    <DesktopView items={items} categoryName={categoryName} categoryCode={categoryCode} onItemClick={handleClick} />
  );
}
