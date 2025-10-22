"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Menu, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbarLogic } from "@/hooks/navbarLogic";
import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import OfertasDropdown from "./dropdowns/ofertas";
import DispositivosMovilesDropdown from "./dropdowns/dispositivos_moviles";
import ElectrodomesticosDropdown from "./dropdowns/electrodomesticos";
import TelevisoresDropdown from "./dropdowns/televisores";
import MonitoresDropdown from "./dropdowns/monitores";
import AccesoriosDropdown from "./dropdowns/accesorios";
import SoporteDropdown from "./dropdowns/soporte";
import UserOptionsDropdown from "@/components/dropdowns/user_options";
import {
  MobileMenu,
  CartIcon,
  SearchBar,
  NavbarLogo,
} from "./navbar/components";
import { hasDropdownMenu, getDropdownPosition } from "./navbar/utils/helpers";
import type { DropdownName, NavItem } from "./navbar/types";

const getDropdownComponent = (
  name: DropdownName
): React.ReactElement | null => {
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
    default:
      return null;
  }
};

// Constantes para evitar magic numbers
const BREAKPOINT_XL = 1280;
const BREAKPOINT_2XL = 1536;
const SOPORTE_DROPDOWN_TOP = 104;

export default function Navbar() {
  const navbar = useNavbarLogic();
  const { logout } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
<<<<<<< Updated upstream
  const { getNavbarRoutes, loading } = useVisibleCategories();
=======
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
>>>>>>> Stashed changes

  const [isIntermediateScreen, setIsIntermediateScreen] = useState(false);

  // Extraer la función para evitar problemas de dependencias
  const { setActiveDropdown } = navbar;

  useEffect(() => {
    const handleResize = () => {
      const width = globalThis.innerWidth;
      if (width >= BREAKPOINT_XL) {
        setMobileMenuOpen(false);
        setMobileUserDropdownOpen(false);
      }
      // Detectar pantallas entre 1280px (xl) y 1536px (2xl) - más pequeño que desktop pero más grande que tablet
      setIsIntermediateScreen(width >= BREAKPOINT_XL && width < BREAKPOINT_2XL);
    };

    // Listener para cerrar dropdown cuando se dispara el evento personalizado
    const handleCloseDropdown = () => {
      setActiveDropdown(null);
    };

    // Ejecutar una vez al montar
    handleResize();

    globalThis.addEventListener("resize", handleResize);
    globalThis.addEventListener(
      "close-dropdown",
      handleCloseDropdown as EventListener
    );

    return () => {
      globalThis.removeEventListener("resize", handleResize);
      globalThis.removeEventListener(
        "close-dropdown",
        handleCloseDropdown as EventListener
      );
    };
  }, [setActiveDropdown]);

  const getIconColorClasses = (forMobile = false): string => {
    // Rutas especiales que siempre usan texto negro
    const isAlwaysBlack =
      navbar.isElectrodomesticos ||
      navbar.isDispositivosMoviles ||
      navbar.isMasInformacionProducto;

    if (isAlwaysBlack) {
      return "text-black";
    }

    const shouldShowWhite = forMobile
      ? navbar.showWhiteItemsMobile
      : navbar.showWhiteItems;
    return shouldShowWhite ? "text-white" : "text-black";
  };

<<<<<<< Updated upstream
  // Obtener las rutas dinámicas desde el hook
  const menuRoutes: NavItem[] = getNavbarRoutes();
=======
  const menuRoutes: NavItem[] = MENU_ORDER.map((name) =>
    navbarRoutes.find((r) => r.name === name)
  ).filter(
    (r): r is NavItem =>
      r?.name !== undefined &&
      r?.href !== undefined &&
      r?.category !== undefined
  );
>>>>>>> Stashed changes

  // Determinar si debe mostrar fondo transparente o blanco
  const showTransparentBg =
    (navbar.isOfertas || navbar.isHome) &&
    !navbar.activeDropdown &&
    !navbar.isScrolled;

  // Determinar color del logo móvil
  const mobileLogoColor = getIconColorClasses(true);
  const desktopIconColor = getIconColorClasses(false);

  // Event handlers
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    posthogUtils.capture("logo_click", { source: "navbar" });
    navbar.router.push("/");
  };

  const handleMobileUserClick = () => {
    if (navbar.isAuthenticated && navbar.user?.nombre) {
      setMobileUserDropdownOpen(!mobileUserDropdownOpen);
    } else {
      navbar.router.push("/login");
    }
  };

  const handleMobileProfileClick = () => {
    setMobileUserDropdownOpen(false);
    navbar.router.push("/perfil");
  };

  const handleMobileLogoutClick = () => {
    setMobileUserDropdownOpen(false);
    logout();
  };

  const headerStyles: CSSProperties = {
    fontFamily:
      '"SamsungOne","Samsung Sharp Sans","Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial',
    boxShadow: navbar.isScrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
    background: showTransparentBg ? "transparent" : "white",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <>
      <div
        ref={navbar.sentinelRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      <header
        data-navbar="true"
        className={cn(
          "w-full z-50 transition-all duration-300 fixed",
          navbar.showNavbar ? "translate-y-0" : "-translate-y-full"
        )}
        style={{
          ...headerStyles,
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* Mobile/Tablet Header con hamburguesa - Mostrar en pantallas < 1280px */}
        <div
          className={cn(
            "xl:hidden px-4 py-3 flex items-center justify-between transition-colors duration-300 min-h-[64px]",
            mobileMenuOpen && "hidden"
          )}
        >
          <Link
            href="/"
            onClick={handleLogoClick}
            aria-label="Inicio"
            className="flex items-center gap-2"
          >
            <Image
              src={
                navbar.showWhiteItemsMobile
                  ? "/frame_white.png"
                  : "/frame_black.png"
              }
              alt="Q Logo"
              height={40}
              width={40}
              className="h-10 w-10 transition-all duration-300"
              priority
            />
            <img
              src="https://res.cloudinary.com/dnglv0zqg/image/upload/v1760575601/Samsung_black_ec1b9h.svg"
              alt="Samsung"
              className={cn(
                "h-8 w-auto transition-all duration-300",
                navbar.showWhiteItemsMobile ? "brightness-0 invert" : ""
              )}
            />
          </Link>

          <div className="flex items-center gap-2">
            <CartIcon
              count={navbar.itemCount}
              showBump={false}
              isClient={navbar.isClient}
              onClick={navbar.handleCartClick}
              colorClass={mobileLogoColor}
            />
            <div className="relative">
              <button
                onClick={handleMobileUserClick}
                className="p-2"
                aria-label={
                  navbar.isAuthenticated ? "Perfil" : "Iniciar sesión"
                }
              >
                <User
                  className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    mobileLogoColor
                  )}
                />
              </button>

              {/* Dropdown de usuario en mobile */}
              {mobileUserDropdownOpen &&
                navbar.isAuthenticated &&
                navbar.user?.nombre && (
                  <>
                    {/* Overlay para cerrar el dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMobileUserDropdownOpen(false)}
                      aria-hidden="true"
                    />

                    {/* Dropdown menu */}
                    <div
                      className="fixed right-4 top-[72px] w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                      role="menu"
                      aria-label="Menú de usuario"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-900">
                          Hola, {navbar.user.nombre.split(" ")[0]}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Gestiona tu cuenta
                        </p>
                      </div>

                      <button
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
                        role="menuitem"
                        onClick={handleMobileProfileClick}
                      >
                        <span className="block font-medium">Ver perfil</span>
                        <span className="block text-sm text-gray-500">
                          Configuración de cuenta
                        </span>
                      </button>

                      <button
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                        role="menuitem"
                        onClick={handleMobileLogoutClick}
                      >
                        <span className="block font-medium text-red-600">
                          Cerrar sesión
                        </span>
                        <span className="block text-sm text-gray-500">
                          Salir de tu cuenta
                        </span>
                      </button>
                    </div>
                  </>
                )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2"
              aria-label="Abrir menú"
            >
              <Menu
                className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  mobileLogoColor
                )}
              />
            </button>
          </div>
        </div>

        {/* Desktop Header completo - Mostrar en pantallas >= 1280px */}
        <div className="hidden xl:flex px-4 sm:px-6 lg:px-8 py-4 min-h-[100px] items-end justify-between gap-4 2xl:gap-8">
          <div className="flex items-center gap-3 xl:gap-4 2xl:gap-6 min-w-0 flex-1">
            <NavbarLogo
              showWhiteLogo={navbar.showWhiteLogo}
              onNavigate={() => navbar.router.push("/")}
            />

            <nav className="min-w-0 flex-1">
              <ul className="flex items-center gap-2 xl:gap-3 2xl:gap-6">
<<<<<<< Updated upstream
                {loading ? (
                  // Skeleton loader
                  <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <li key={i} className="shrink-0">
                        <div className="h-6 w-20 xl:w-24 2xl:w-28 bg-gray-200 rounded animate-pulse" />
                      </li>
                    ))}
                  </>
                ) : (
                  menuRoutes.map((item) => {
                  const dropdownKey = item.dropdownName || item.name;

                  return (
                    <li key={item.name} className="relative shrink-0">
                      <div
                        data-item-name={dropdownKey}
                        ref={navbar.setNavItemRef}
                        onMouseEnter={() =>
                          hasDropdownMenu(dropdownKey) &&
                          navbar.handleDropdownEnter(dropdownKey as DropdownName)
                        }
                        onMouseLeave={navbar.handleDropdownLeave}
                        className="relative inline-block"
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "whitespace-nowrap px-0.5 py-1 pb-2 text-[13px] xl:text-[13.5px] 2xl:text-[15.5px] leading-6 font-semibold  tracking-tight relative inline-block",
                            navbar.showWhiteItems
                              ? "text-white hover:opacity-90"
                              : "text-black hover:text-blue-600",
                            !navbar.showWhiteItems &&
                              "after:absolute after:left-0 after:right-0 after:-bottom-0 after:h-1 after:bg-blue-500 after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                          )}
                        >
                          {dropdownKey === "Televisores y AV" &&
                          isIntermediateScreen
                            ? "TV y AV"
                            : item.name}
                        </Link>

                        {navbar.activeDropdown === dropdownKey &&
                          hasDropdownMenu(dropdownKey) && (
                            <div
                              className="fixed left-0 right-0 z-[9999] bg-white shadow-xl"
                              style={{
                                top: `${getDropdownPosition(dropdownKey).top}px`,
                              }}
                            >
                              <div className="mx-auto max-w-screen-2xl">
                                {getDropdownComponent(
                                  dropdownKey as DropdownName
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </li>
                  );
                })
                )}
=======
                {menuRoutes.map((item) => (
                  <li key={item.name} className="relative shrink-0">
                    <div
                      data-item-name={item.name}
                      ref={navbar.setNavItemRef}
                      onMouseEnter={() =>
                        hasDropdownMenu(item.name) &&
                        navbar.handleDropdownEnter(item.name)
                      }
                      onMouseLeave={navbar.handleDropdownLeave}
                      className="relative inline-block"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "whitespace-nowrap px-0.5 py-1 pb-2 text-[13px] xl:text-[13.5px] 2xl:text-[15.5px] leading-6 font-black tracking-tight relative inline-block",
                          navbar.showWhiteItems
                            ? "text-white hover:opacity-90"
                            : "text-black hover:text-blue-600",
                          !navbar.showWhiteItems &&
                            "after:absolute after:left-0 after:right-0 after:-bottom-0 after:h-1 after:bg-blue-500 after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                        )}
                      >
                        {item.name === "Televisores y AV" &&
                        isIntermediateScreen
                          ? "TV y AV"
                          : item.name}
                      </Link>

                      {navbar.activeDropdown === item.name &&
                        hasDropdownMenu(item.name) && (
                          <div
                            className="fixed left-0 right-0 z-[9999] bg-white shadow-xl"
                            style={{
                              top: `${getDropdownPosition(item.name).top}px`,
                            }}
                          >
                            <div className="mx-auto max-w-screen-2xl">
                              {getDropdownComponent(item.name)}
                            </div>
                          </div>
                        )}
                    </div>
                  </li>
                ))}
>>>>>>> Stashed changes
              </ul>
            </nav>
          </div>

          <div className="hidden lg:flex flex-col items-end justify-between gap-2 flex-none min-w-[320px] xl:min-w-[340px] 2xl:min-w-[380px]">
            <div className="flex items-center gap-6 leading-none">
              <Link
                href="/soporte/inicio_de_soporte"
                className={cn(
                  "text-[13px] md:text-[13.5px] font-bold",
                  navbar.showWhiteItems
                    ? "text-white/90 hover:text-white"
                    : "text-black"
                )}
                onMouseEnter={() => navbar.handleDropdownEnter("Soporte")}
                onMouseLeave={navbar.handleDropdownLeave}
              >
                Soporte
              </Link>
              <Link
                href="/ventas-corporativas"
                className={cn(
                  "text-[13px] md:text-[13.5px] font-bold",
                  navbar.showWhiteItems
                    ? "text-white/90 hover:text-white"
                    : "text-black"
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
                colorClass={desktopIconColor}
              />
              <Link
                href="/favoritos"
                className={cn(
                  "flex items-center justify-center w-10 h-10",
                  desktopIconColor
                )}
                aria-label="Favoritos"
              >
                <Heart className={cn("w-5 h-5", desktopIconColor)} />
              </Link>
              {navbar.isAuthenticated && navbar.user?.nombre ? (
                <UserOptionsDropdown showWhiteItems={navbar.showWhiteItems} />
              ) : (
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center w-10 h-10",
                    desktopIconColor
                  )}
                  onClick={() => navbar.router.push("/login")}
                  aria-label="Ingresar"
                >
                  <User className={cn("w-5 h-5", desktopIconColor)} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown de Soporte - Full Width */}
        {navbar.activeDropdown === "Soporte" && (
          <section
            className="fixed left-0 right-0 z-[9999] bg-white shadow-xl"
            style={{ top: `${SOPORTE_DROPDOWN_TOP}px` }}
            onMouseEnter={() => navbar.handleDropdownEnter("Soporte")}
            onMouseLeave={navbar.handleDropdownLeave}
            aria-label="Soporte Dropdown"
          >
            <div className="mx-auto max-w-screen-2xl">
              <SoporteDropdown
                isMobile={false}
                onClose={() => navbar.setActiveDropdown(null)}
              />
            </div>
          </section>
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
