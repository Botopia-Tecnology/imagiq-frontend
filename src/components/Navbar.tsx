"use client";
/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 * Limpio, escalable y con animaciones suaves en hover
 */
import { useNavbarLogic } from "@/hooks/navbarLogic";
import logoSamsungWhite from "@/img/logo_Samsung.png";
import carritoIconBlack from "@/img/navbar-icons/carrito-icon-black.png";
import carritoIconWhite from "@/img/navbar-icons/carrito-icon-white.png";
import favoritoIconWhite from "@/img/navbar-icons/favorito-icon-white.png";
import favoritoIconBlack from "@/img/navbar-icons/favoritos-icon-black.png";
import searchIconBlack from "@/img/navbar-icons/search-icon-black.png";
import searchIconWhite from "@/img/navbar-icons/search-icon-white.png";
import userIconBlack from "@/img/navbar-icons/user-icon-black.png";
import userIconWhite from "@/img/navbar-icons/user-icon-white.png";
import logoSamsungBlack from "@/img/Samsung_black.png";
import { posthogUtils } from "@/lib/posthogClient";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { navbarRoutes } from "../routes/navbarRoutes";
import DispositivosMovilesDropdown from "./dropdowns/dispositivos_moviles";
import ElectrodomesticosDropdown from "./dropdowns/electrodomesticos";
import TelevisionesDropdown from "./dropdowns/televisiones";

// Helper para dropdown
const getDropdownComponent = (name: string) => {
  switch (name) {
    case "Dispositivos móviles":
      return <DispositivosMovilesDropdown />;
    case "Televisores y AV":
      return <TelevisionesDropdown />;
    case "Electrodomésticos":
      return <ElectrodomesticosDropdown />;
    default:
      return null;
  }
};

export default function Navbar() {
  const navbar = useNavbarLogic();

  // --- Render principal ---
  return (
    <>
      {/* Sentinel para IntersectionObserver (scroll detection) */}
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
