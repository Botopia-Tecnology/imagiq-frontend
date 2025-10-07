"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Menu, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbarLogic } from "@/hooks/navbarLogic";
import { posthogUtils } from "@/lib/posthogClient";
import { navbarRoutes } from "../routes/navbarRoutes";
import OfertasDropdown from "./dropdowns/ofertas";
import DispositivosMovilesDropdown from "./dropdowns/dispositivos_moviles";
import ElectrodomesticosDropdown from "./dropdowns/electrodomesticos";
import TelevisoresDropdown from "./dropdowns/televisores";
import MonitoresDropdown from "./dropdowns/monitores";
import AccesoriosDropdown from "./dropdowns/accesorios";
import SoporteDropdown from "./dropdowns/soporte";
import UserOptionsDropdown from "@/components/dropdowns/user_options";
import { MobileMenu, CartIcon, SearchBar, NavbarLogo } from "./navbar/components";
import { hasDropdownMenu, getDropdownPosition } from "./navbar/utils/helpers";
import { MENU_ORDER } from "./navbar/constants";
import type { DropdownName, NavItem } from "./navbar/types";
import logoSamsungBlack from "@/img/Samsung_black.png";

const getDropdownComponent = (name: DropdownName) => {
  const props = { isMobile: false };
  switch (name) {
    case "Ofertas":
      return <OfertasDropdown {...props} />;
    case "Dispositivos móviles":
      return <DispositivosMovilesDropdown {...props} />;
    case "Televisores y AV":
      return <TelevisoresDropdown {...props} />;
    case "Electrodomésticos":
      return <ElectrodomesticosDropdown {...props} />;
    case "Monitores":
      return <MonitoresDropdown {...props} />;
    case "Accesorios":
      return <AccesoriosDropdown {...props} />;
    case "Soporte":
      return <SoporteDropdown {...props} />;
  }
};

export default function Navbar() {
  const navbar = useNavbarLogic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setMobileMenuOpen(false);
      }
    };

    // Listener para cerrar dropdown cuando se dispara el evento personalizado
    const handleCloseDropdown = () => {
      navbar.setActiveDropdown(null);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('close-dropdown', handleCloseDropdown as EventListener);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('close-dropdown', handleCloseDropdown as EventListener);
    };
  }, [navbar]);

  const getIconColorClasses = (forMobile = false): string => {
    if (navbar.isElectrodomesticos || navbar.isDispositivosMoviles || navbar.isMasInformacionProducto) {
      return "text-black";
    }
    if (forMobile) {
      return navbar.showWhiteItemsMobile ? "text-white" : "text-black";
    }
    return navbar.showWhiteItems ? "text-white" : "text-black";
  };

  const menuRoutes: NavItem[] = MENU_ORDER
    .map((name) => navbarRoutes.find((r) => r.name === name))
    .filter((r): r is NavItem => Boolean(r?.name && r?.href && r?.category));

  // Determinar si debe mostrar fondo transparente o blanco
  const showTransparentBg = (navbar.isOfertas || navbar.isHome) && !navbar.activeDropdown && !navbar.isScrolled;

  const headerStyles: CSSProperties = {
    fontFamily: '"SamsungOne","Samsung Sharp Sans","Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial',
    boxShadow: navbar.isScrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
    background: showTransparentBg ? "transparent" : "white",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <>
      <div
        ref={navbar.sentinelRef}
        style={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, pointerEvents: "none" }}
        aria-hidden="true"
      />

      <header
        data-navbar="true"
        className={cn(
          "w-full z-50 transition-all duration-300 fixed top-0",
          !navbar.showNavbar ? "-translate-y-full" : "translate-y-0"
        )}
        style={headerStyles}
      >
        {/* Mobile/Tablet Header con hamburguesa - Mostrar en pantallas < 1536px */}
        <div className={cn(
          "2xl:hidden px-4 py-3 flex items-center justify-between transition-colors duration-300",
          mobileMenuOpen && "hidden"
        )}>
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              posthogUtils.capture("logo_click", { source: "navbar" });
              navbar.router.push("/");
            }}
            aria-label="Inicio"
            className="flex items-center gap-2"
          >
            <Image 
              src={navbar.isScrolled ? "/frame_black.png" : "/frame_white.png"}
              alt="Q Logo" 
              height={32} 
              width={32} 
              className="h-8 w-8 transition-all duration-300" 
              priority 
            />
            <Image 
              src="/img/Samsung_black.svg" 
              alt="Samsung" 
              height={28} 
              width={80} 
              className={cn(
                "h-7 w-auto transition-all duration-300",
                navbar.isScrolled ? "" : "brightness-0 invert"
              )}
              priority 
            />
          </Link>

          <div className="flex items-center gap-2">
            <CartIcon
              count={navbar.itemCount}
              showBump={false}
              isClient={navbar.isClient}
              onClick={navbar.handleCartClick}
              colorClass={navbar.isScrolled ? "text-black" : "text-white"}
            />
            <button className="p-2" aria-label="Usuario">
              <User className={cn(
                "w-6 h-6 transition-colors duration-300",
                navbar.isScrolled ? "text-black" : "text-white"
              )} />
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2" aria-label="Abrir menú">
              <Menu className={cn(
                "w-6 h-6 transition-colors duration-300",
                navbar.isScrolled ? "text-black" : "text-white"
              )} />
            </button>
          </div>
        </div>

        {/* Desktop Header completo - Mostrar solo en pantallas >= 1536px */}
        <div className="hidden 2xl:flex px-4 sm:px-6 lg:px-8 py-6 min-h-[104px] items-center justify-between gap-8">
          <div className="flex items-center gap-6 min-w-0 flex-1">
            <NavbarLogo showWhiteLogo={navbar.showWhiteLogo} onNavigate={() => navbar.router.push("/")} />

            <nav className="min-w-0 flex-1" style={{ marginTop: '4px' }}>
              <ul className="flex items-center gap-4 md:gap-5 lg:gap-6">
                {menuRoutes.map((item) => {
                  const isActive =
                    item.name === "Electrodomésticos"
                      ? navbar.pathname?.startsWith("/productos/Electrodomesticos") ?? false
                      : navbar.pathname === item.href || navbar.pathname?.startsWith(item.href + "/");

                  const isDropdownOpen = navbar.activeDropdown === item.name;
                  const textBase = navbar.showWhiteItems ? "text-white" : "text-black";

                  return (
                    <li key={item.name} className="relative shrink-0">
                      <div
                        data-item-name={item.name}
                        ref={navbar.setNavItemRef}
                        onMouseEnter={() => hasDropdownMenu(item.name) && navbar.handleDropdownEnter(item.name as DropdownName)}
                        onMouseLeave={navbar.handleDropdownLeave}
                        className="relative inline-block"
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "whitespace-nowrap px-0.5 py-1 pb-2 text-[13px] md:text-[13.5px] leading-6 font-black tracking-tight relative inline-block",
                            navbar.showWhiteItems ? "text-white hover:opacity-90" : "text-black hover:text-blue-600",
                            !navbar.showWhiteItems && "after:absolute after:left-0 after:right-0 after:-bottom-0 after:h-1 after:bg-blue-500 after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                          )}
                        >
                          {item.name}
                        </Link>

                        {navbar.activeDropdown === item.name && hasDropdownMenu(item.name) && (
                          <div
                            className="fixed left-0 right-0 z-[9999] bg-white shadow-xl"
                            style={{ top: `${getDropdownPosition(item.name).top}px` }}
                          >
                            <div className="mx-auto max-w-screen-2xl">{getDropdownComponent(item.name as DropdownName)}</div>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="hidden lg:flex flex-col items-end justify-between gap-2 flex-none min-w-[380px]">
            <div className="flex items-center gap-6 leading-none">
              <div
                onMouseEnter={() => navbar.handleDropdownEnter("Soporte")}
                onMouseLeave={navbar.handleDropdownLeave}
              >
                <Link
                  href="/soporte"
                  className={cn(
                    "text-[11.5px] md:text-[12px] font-bold",
                    navbar.showWhiteItems ? "text-white/90 hover:text-white" : "text-black"
                  )}
                >
                  Soporte
                </Link>
              </div>
              <Link
                href="/ventas-corporativas"
                className={cn(
                  "text-[11.5px] md:text-[12px] font-bold",
                  navbar.showWhiteItems ? "text-white/90 hover:text-white" : "text-black"
                )}
                title="Para Empresas"
              >
                Para Empresas ↗
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <SearchBar
                value={navbar.searchQuery}
                onChange={navbar.setSearchQuery}
                onSubmit={navbar.handleSearchSubmit}
              />
              <CartIcon
                count={navbar.itemCount}
                showBump={navbar.bump}
                isClient={navbar.isClient}
                onClick={navbar.handleCartClick}
                colorClass={getIconColorClasses()}
              />
              <Link
                href="/favoritos"
                className={cn("flex items-center justify-center w-10 h-10", getIconColorClasses())}
                aria-label="Favoritos"
              >
                <Heart className={cn("w-5 h-5", getIconColorClasses())} />
              </Link>
              {navbar.isAuthenticated && navbar.user?.nombre ? (
                <UserOptionsDropdown />
              ) : (
                <button
                  type="button"
                  className={cn("flex items-center justify-center w-10 h-10", getIconColorClasses())}
                  onClick={() => window.location.replace("/login")}
                  aria-label="Ingresar"
                >
                  <User className={cn("w-5 h-5", getIconColorClasses())} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown de Soporte - Full Width */}
        {navbar.activeDropdown === "Soporte" && (
          <div
            className="fixed left-0 right-0 z-[9999] bg-white shadow-xl"
            style={{ top: "104px" }}
            onMouseEnter={() => navbar.handleDropdownEnter("Soporte")}
            onMouseLeave={navbar.handleDropdownLeave}
          >
            <div className="mx-auto max-w-screen-2xl">
              <SoporteDropdown isMobile={false} onClose={() => navbar.setActiveDropdown(null)} />
            </div>
          </div>
        )}
      </header>

      <MobileMenu
  isOpen={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
  searchQuery={navbar.searchQuery}
  onSearchChange={navbar.setSearchQuery}
  onSearchSubmit={navbar.handleSearchSubmit}
/>

    </>
  );
}
