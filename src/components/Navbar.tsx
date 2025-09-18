"use client";
/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 */

import { useAuthContext } from "@/features/auth/context";
import { useCartContext } from "@/features/cart/CartContext";
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";
import { useDebounce } from "@/hooks/useDebounce";
import { posthogUtils } from "@/lib/posthogClient";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { RefCallback, useEffect, useRef, useState } from "react";
import DispositivosMovilesDropdown from "./dropdowns/dispositivos_moviles";
import ElectrodomesticosDropdown from "./dropdowns/electrodomesticos";
import TelevisionesDropdown from "./dropdowns/televisiones";
import NavbarLogo from "./navbar/NavbarLogo";
import NavbarDesktopActions from "./navbar/NavbarDesktopActions";
import NavbarMobileActions from "./navbar/NavbarMobileActions";
import NavbarNavigation from "./navbar/NavbarNavigation";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import { useNavbarConfig } from "./navbar/useNavbarConfig";


// Dropdown item type literals
type DropdownItemType =
  | "Dispositivos móviles"
  | "Televisores y AV"
  | "Electrodomésticos";

interface SearchResult {
  id: number;
  name: string;
  category: string;
}

export default function Navbar() {
  // Estados
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs
  const navItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hooks
  const pathname = usePathname();
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { itemCount } = useCartContext();
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const { hideNavbar } = useNavbarVisibility();

  // Configuración del navbar
  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const navbarConfig = useNavbarConfig(isScrolled, isHome, isLogin);

  // Efectos
  useEffect(() => setIsClient(true), []);

  // Efecto de scroll optimizado
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const shouldBeScrolled = scrollY > 100;
          setIsScrolled((prev) =>
            prev !== shouldBeScrolled ? shouldBeScrolled : prev
          );
          ticking = false;
        });
      }
    };

    const throttledScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(handleScroll, 16);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [pathname]);

  // Efecto de búsqueda
  useEffect(() => {
    if (debouncedSearch.length > 2) {
      posthogUtils.capture("navbar_search", {
        query: debouncedSearch,
        query_length: debouncedSearch.length,
        user_authenticated: isAuthenticated,
      });
      setSearchResults([
        {
          id: 1,
          name: `Resultado para "${debouncedSearch}"`,
          category: "Productos",
        },
      ]);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, isAuthenticated]);

  // Funciones
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      posthogUtils.capture("search_submit", {
        query: searchQuery.trim(),
        source: "navbar",
        results_count: searchResults.length,
      });
      window.location.href = `/productos?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const handleCartClick = () => {
    posthogUtils.capture("cart_icon_click", {
      cart_items: itemCount,
      user_authenticated: isAuthenticated,
    });
    router.push("/carrito");
  };

  // Funciones de dropdown
  const handleDropdownEnter = (dropdownName: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(dropdownName);
    const navItem = navItemRefs.current[dropdownName];
    if (navItem) {
      const rect = navItem.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setDropdownCoords(null);
    }, 350);
  };

  const handleDropdownContainerEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
  };

  const handleDropdownContainerLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setDropdownCoords(null);
    }, 350);
  };

  const setNavItemRef: RefCallback<HTMLDivElement> = (el) => {
    if (el) {
      const itemName = el.getAttribute("data-item-name");
      if (itemName && navItemRefs.current) {
        navItemRefs.current[itemName] = el;
      }
    }
  };

  const renderDropdown = (itemName: string) => {
    if (activeDropdown !== itemName || !dropdownCoords) return null;
    let DropdownComponent = null;
    switch (itemName as DropdownItemType) {
      case "Dispositivos móviles":
        DropdownComponent = <DispositivosMovilesDropdown />;
        break;
      case "Televisores y AV":
        DropdownComponent = <TelevisionesDropdown />;
        break;
      case "Electrodomésticos":
        DropdownComponent = <ElectrodomesticosDropdown />;
        break;
      default:
        return null;
    }
    return (
      <div
        onMouseEnter={handleDropdownContainerEnter}
        onMouseLeave={handleDropdownContainerLeave}
        style={{
          position: "fixed",
          top: dropdownCoords.top,
          left: dropdownCoords.left,
          minWidth: dropdownCoords.width,
          zIndex: 1000000,
        }}
        className="animate-dropdown-enter"
      >
        {DropdownComponent}
      </div>
    );
  };

  return (
    <>
      <header
        data-navbar="true"
        className={cn(
          "w-full z-50 backdrop-blur-md sticky top-0 left-0 md:static",
          "transition-all duration-300 ease-in-out",
          navbarConfig.backgroundStyle,
          hideNavbar
            ? "transform -translate-y-full opacity-0"
            : "transform translate-y-0 opacity-100"
        )}
        style={{
          boxShadow: navbarConfig.boxShadow,
          background: navbarConfig.background,
          transition: hideNavbar
            ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
            : "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: hideNavbar
            ? "transform, opacity"
            : "background, box-shadow",
        }}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="flex items-center justify-between h-16 px-8 max-w-full">
          <NavbarLogo showWhiteLogo={navbarConfig.showWhiteLogo} />

          <NavbarDesktopActions
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showWhiteItems={navbarConfig.showWhiteItems}
            isClient={isClient}
            handleSearchSubmit={handleSearchSubmit}
          />

          <NavbarMobileActions
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showWhiteItemsMobile={navbarConfig.showWhiteItemsMobile}
            isClient={isClient}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            handleSearchSubmit={handleSearchSubmit}
            handleCartClick={handleCartClick}
          />
        </div>
      </header>

      <NavbarNavigation
        isScrolled={isScrolled}
        showWhiteItems={navbarConfig.showWhiteItems}
        handleDropdownEnter={handleDropdownEnter}
        handleDropdownLeave={handleDropdownLeave}
        setNavItemRef={setNavItemRef}
      />

      <NavbarMobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Renderizar dropdowns */}
      {["Dispositivos móviles", "Televisores y AV", "Electrodomésticos"].map(
        (item) => renderDropdown(item)
      )}
    </>
  );
}
