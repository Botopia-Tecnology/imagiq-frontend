"use client";

/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 * Refactorizado para máxima legibilidad, escalabilidad y limpieza
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShoppingCart, Heart, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbarLogic } from "@/hooks/navbarLogic";
import { posthogUtils } from "@/lib/posthogClient";
import { navbarRoutes } from "../routes/navbarRoutes";
import DispositivosMovilesDropdown from "./dropdowns/dispositivos_moviles";
import ElectrodomesticosDropdown from "./dropdowns/electrodomesticos";
import TelevisionesDropdown from "./dropdowns/televisiones";
import UserOptionsDropdown from "@/components/dropdowns/user_options";
import { PointsQCard } from "@/components/ui/PointsQCard";

// Imports de imágenes de logos de marca
import logoSamsungWhite from "@/img/logo_Samsung.png";
import logoSamsungBlack from "@/img/Samsung_black.png";

// Clases reutilizables
const iconButtonClass = "flex items-center justify-center w-10 h-10";
const badgeClass =
  "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold transition-transform duration-150 ease-out";

// Helper para verificar si un item tiene dropdown
const hasDropdownMenu = (name: string): boolean => {
  return (
    name === "Dispositivos móviles" ||
    name === "Televisores y AV" ||
    name === "Electrodomésticos"
  );
};

// Helper para dropdowns con soporte móvil
const getDropdownComponent = (
  name: string,
  isMobile = false,
  onItemClick?: () => void
) => {
  const props = { isMobile, onItemClick };
  switch (name) {
    case "Dispositivos móviles":
      return <DispositivosMovilesDropdown {...props} />;
    case "Televisores y AV":
      return <TelevisionesDropdown {...props} />;
    case "Electrodomésticos":
      return <ElectrodomesticosDropdown {...props} />;
    default:
      return null;
  }
};

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navbar = useNavbarLogic();

  // Helper para determinar colores de iconos basado en contexto (legacy para Image components)
  const getIconColors = (variant: "desktop" | "tablet" | "mobile") => {
    if (variant === "mobile") {
      return navbar.showWhiteItemsMobile ? "white" : "black";
    }
    return navbar.isDispositivosMoviles ||
      navbar.isElectrodomesticos ||
      navbar.isMasInformacionProducto
      ? "black"
      : navbar.showWhiteItems
      ? "white"
      : "black";
  };

  // Helper para obtener clases CSS de color para íconos Lucide
  const getIconColorClasses = (variant: "desktop" | "tablet" | "mobile") => {
    // Forzar iconos negros en secciones específicas con fondo claro
    if (
      navbar.isElectrodomesticos ||
      navbar.isDispositivosMoviles ||
      navbar.isMasInformacionProducto
    ) {
      console.log(
        "Forcing black icons for electrodomesticos/dispositivos/masInfo"
      );
      return "text-black";
    }

    // Para móvil
    if (variant === "mobile") {
      return navbar.showWhiteItemsMobile ? "text-white" : "text-black";
    }

    // Default basado en showWhiteItems
    return navbar.showWhiteItems ? "text-white" : "text-black";
  };

  // Helper para renderizar iconos de usuario
  const renderUserIcon = (variant: "desktop" | "tablet") => (
    <button
      type="button"
      className={cn(iconButtonClass, `text-${getIconColors(variant)}`)}
      title={navbar.isAuthenticated ? "Dashboard" : "Ingresar"}
      aria-label={navbar.isAuthenticated ? "Dashboard" : "Ingresar"}
      onClick={() => {
        posthogUtils.capture("user_icon_click", {
          user_authenticated: navbar.isAuthenticated,
          destination: "login",
        });
        window.location.replace("/login");
      }}
    >
      <User
        className={`w-7 h-7 ${getIconColorClasses(variant)}`}
        aria-label="Usuario"
      />
    </button>
  );

  // Helper para renderizar icono de carrito
  const renderCartIcon = (variant: "desktop" | "tablet" | "mobile") => {
    const colorScheme = getIconColors(variant);
    const cartCount =
      variant === "mobile" ? navbar.itemCount : navbar.cartCount;

    return (
      <Link
        href="/carrito"
        className={cn(iconButtonClass, `text-${colorScheme}`, "relative")}
        title={variant === "mobile" ? "Carrito" : "Carrito de compras"}
        onClick={navbar.handleCartClick}
      >
        <ShoppingCart
          className={`w-7 h-7 ${getIconColorClasses(variant)}`}
          aria-label="Carrito"
        />
        {navbar.isClient && cartCount > 0 && (
          <span
            className={cn(
              badgeClass,
              variant === "mobile"
                ? cartCount > 0
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0"
                : navbar.bump
                ? "scale-110"
                : "scale-100"
            )}
            aria-label={`Carrito: ${cartCount} productos`}
            aria-live="polite"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>
    );
  };

  // Helper para renderizar icono de favoritos
  const renderFavoritesIcon = (variant: "desktop" | "tablet") => (
    <button
      type="button"
      className={cn(iconButtonClass, `text-${getIconColors(variant)}`)}
      title="Favoritos"
      aria-label="Favoritos"
      style={{ position: "relative" }}
      onClick={() => navbar.router.push("/favoritos")}
    >
      <Heart
        className={`w-6 h-6 ${getIconColorClasses(variant)}`}
        aria-label="Favoritos"
      />
    </button>
  );

  // Clases dinámicas para el header
  const headerClasses = cn(
    "w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/60 sticky top-0 left-0 md:static",
    navbar.isOfertas && !navbar.isScrolled
      ? "bg-transparent"
      : navbar.isOfertas && navbar.isScrolled
      ? "bg-white/60 shadow backdrop-blur-md"
      : navbar.isDispositivosMoviles ||
        navbar.isElectrodomesticos ||
        navbar.isMasInformacionProducto ||
        navbar.isScrolledNavbar
      ? "bg-white/60 shadow backdrop-blur-md"
      : navbar.isHome && !navbar.isScrolled
      ? "bg-transparent"
      : navbar.isProductDetail
      ? "bg-transparent"
      : "bg-white/60 shadow backdrop-blur-md"
  );

  // Estilos dinámicos para el header
  const headerStyles = {
    boxShadow:
      navbar.isOfertas && !navbar.isScrolled
        ? "none"
        : navbar.isScrolled ||
          navbar.isDispositivosMoviles ||
          navbar.isElectrodomesticos ||
          navbar.isMasInformacionProducto
        ? "0 2px 8px 0 rgba(30, 64, 175, 0.12)"
        : "none",
    background:
      navbar.isOfertas && !navbar.isScrolled ? "transparent" : undefined,
    transition:
      "background 0.6s cubic-bezier(.4,0,.2,1), box-shadow 0.6s cubic-bezier(.4,0,.2,1)",
  };

  // Helper para renderizar mini card de puntos Q
  const renderPointsQCard = (variant: "desktop" | "tablet") => {
    const isDark = getIconColors(variant) === "white";
    return (
      <PointsQCard
        variant={variant}
        isDark={isDark}
        className="flex-shrink-0"
      />
    );
  };

  // Helper para renderizar saludo o icono de usuario (solo desktop/tablet)
  const renderUserGreetingOrIcon = (variant: "desktop" | "tablet") => {
    if (navbar.isAuthenticated && navbar.user && navbar.user.nombre) {
      // Reemplaza el saludo por el dropdown de usuario
      return <UserOptionsDropdown />;
    }
    return renderUserIcon(variant);
  };

  // Helper para calcular posición del dropdown
  const getDropdownPosition = (itemName: string) => {
    if (typeof window === "undefined") return { left: 0, top: 120 };

    const element = document.querySelector(
      `[data-item-name="${itemName}"]`
    ) as HTMLElement;
    if (!element) return { left: 0, top: 120 };

    const rect = element.getBoundingClientRect();
    return {
      left: rect.left, // Alineado al borde izquierdo del filtro
      top: rect.bottom - 2, // Conectado directamente (sin gap)
    };
  };

  return (
    <>
      {/* Sentinel para IntersectionObserver (scroll detection) */}
      <div
        ref={navbar.sentinelRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <header
        data-navbar="true"
        className={headerClasses}
        style={headerStyles}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Logo principal */}
        <div className="flex items-center justify-between h-16 px-8 max-w-full">
          <div className="flex items-end flex-shrink-0 gap-2 md:gap-4">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                posthogUtils.capture("logo_click", { source: "navbar" });
                navbar.router.push("/");
              }}
              aria-label="Inicio"
              className="flex items-end gap-2 cursor-pointer"
              style={{ padding: 0 }}
            >
              <Image
                src={
                  navbar.showWhiteLogo ? "/frame_white.png" : "/frame_black.png"
                }
                alt="Q Logo"
                height={40}
                style={{ display: "block", marginBottom: "5px" }}
                width={40}
                className="h-[40px] w-[40px] min-w-[40px] md:h-[48px] md:w-[48px] md:min-w-[40px]"
                priority
              />
              <Image
                src={navbar.showWhiteLogo ? logoSamsungWhite : logoSamsungBlack}
                alt="Samsung Logo"
                height={80}
                width={70}
                className="h-10 md:h-12 w-auto"
                priority
                style={{ display: "block" }}
              />
              <span
                className={
                  navbar.showWhiteLogo
                    ? "text-xs font-bold tracking-wide text-white select-none"
                    : "text-xs font-bold tracking-wide text-black select-none"
                }
                style={{
                  letterSpacing: "0.08em",
                  marginBottom: "11px",
                  lineHeight: "normal",
                  alignSelf: "flex-end",
                }}
              >
                Store
              </span>
            </Link>
          </div>

          {/* Iconos desktop */}
          <div className="hidden lg:flex items-center space-x-8 flex-shrink-0">
            {/* Buscador */}
            <form
              onSubmit={navbar.handleSearchSubmit}
              className="flex items-center bg-white/70 backdrop-blur-md rounded-full px-4 h-12 shadow-sm border border-white/30 transition-all duration-300 w-72"
              style={{ zIndex: 1000, overflow: "hidden" }}
            >
              <input
                type="text"
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-none focus:outline-none text-lg px-2"
                placeholder="Buscar productos..."
                value={navbar.searchQuery}
                onChange={(e) => navbar.setSearchQuery(e.target.value)}
                aria-label="Buscar productos"
                autoComplete="off"
              />
              <button
                type="submit"
                className={iconButtonClass}
                title="Buscar"
                style={{ zIndex: 1001 }}
              >
                <Search
                  className={`w-6 h-6 ${getIconColorClasses("desktop")}`}
                  aria-label="Buscar"
                />
              </button>
            </form>
            {renderPointsQCard("desktop")}
            {renderUserGreetingOrIcon("desktop")}
            {renderCartIcon("desktop")}
            {renderFavoritesIcon("desktop")}
          </div>

          {/* Navbar móvil */}
          <div className="flex lg:hidden items-center h-16 space-x-4  align-end">
            {/* Icono carrito */}
            <Link
              href="/carrito"
              className={cn(
                "flex items-center justify-center w-10 h-10 relative",
                getIconColorClasses("mobile")
              )}
              title="Carrito"
              onClick={navbar.handleCartClick}
            >
              <ShoppingCart
                className={`w-7 h-7 ${getIconColorClasses("mobile")}`}
                aria-label="Carrito"
              />
              {navbar.isClient && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold transition-all duration-200",
                    navbar.itemCount > 0
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0"
                  )}
                  aria-label={`Carrito: ${navbar.itemCount} productos`}
                >
                  {navbar.itemCount > 99 ? "99+" : navbar.itemCount}
                </span>
              )}
            </Link>
            {/* Icono menú hamburguesa */}
            <button
              className={cn(
                "flex items-center justify-center w-10 h-10",
                getIconColorClasses("mobile")
              )}
              aria-label={
                navbar.isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"
              }
              aria-expanded={navbar.isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => navbar.setIsMobileMenuOpen((open) => !open)}
            >
              {navbar.isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Menú de navegación principal - animación hover suave */}
        <nav
          className={cn(
            "hidden lg:block transition-all duration-500 relative z-[9999]",
            navbar.isScrolled && !navbar.isMasInformacionProducto
              ? "max-h-0 opacity-0 overflow-hidden"
              : "max-h-20 opacity-100"
          )}
        >
          <ul className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 2xl:gap-3 py-1.5 sm:py-2 md:py-2.5 lg:py-3 px-0.5 sm:px-1 md:px-2 lg:px-3 xl:px-4 2xl:px-6 w-full overflow-x-auto scrollbar-hide">
            {navbarRoutes.map((item) => {
              const isActive =
                item.name === "Electrodomésticos"
                  ? navbar.pathname.startsWith("/productos/Electrodomesticos")
                  : navbar.pathname === item.href ||
                    navbar.pathname.startsWith(item.href + "/") ||
                    navbar.pathname.startsWith(item.href + "?") ||
                    navbar.pathname.startsWith(item.href + "#") ||
                    navbar.cleanPath === item.href ||
                    navbar.cleanPath.startsWith(item.href + "/") ||
                    navbar.cleanPath.startsWith(item.href + "?") ||
                    navbar.cleanPath.startsWith(item.href + "#");

              const itemTextColor = navbar.showWhiteItems
                ? "text-white"
                : "text-gray-800";
              const activeIndicatorColor =
                navbar.showWhiteItems && isActive
                  ? "bg-white"
                  : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600";
              const hoverClass = cn(
                "transition-all duration-900 ease-[cubic-bezier(.4,0,.2,1)] will-change-transform will-change-opacity transform-gpu",
                navbar.showWhiteItems
                  ? "hover:scale-110 hover:opacity-90 hover:-translate-y-1"
                  : "hover:text-blue-700 hover:scale-105 hover:opacity-90 hover:-translate-y-1"
              );
              return (
                <li
                  key={item.name}
                  className="relative z-[9999]"
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    data-item-name={item.name}
                    ref={navbar.setNavItemRef}
                    onMouseEnter={() => navbar.handleDropdownEnter(item.name)}
                    onMouseLeave={navbar.handleDropdownLeave}
                    className="relative z-[9999]"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "font-normal whitespace-nowrap block py-0.5 sm:py-1 md:py-1.5 lg:py-2 xl:py-2.5 px-0.5 sm:px-1 md:px-1.5 lg:px-2 xl:px-3 2xl:px-4 rounded-lg focus:outline-none flex-shrink-0 text-center min-w-fit",
                        itemTextColor,
                        hoverClass,
                        isActive && navbar.showWhiteItems && "text-white",
                        isActive && !navbar.showWhiteItems && "text-gray-900",
                        "text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-lg"
                      )}
                      aria-label={item.name}
                    >
                      <span className="relative flex flex-col items-center">
                        {item.name}
                        <span
                          className={cn(
                            "hidden md:block w-full mt-1 rounded-full transition-all duration-900 ease-[cubic-bezier(.4,0,.2,1)] will-change-transform will-change-opacity transform-gpu",
                            isActive
                              ? `h-[4px] ${activeIndicatorColor} shadow-md scale-x-105 opacity-100 translate-y-0`
                              : "h-[2px] bg-transparent opacity-0 -translate-y-2"
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                    {navbar.activeDropdown === item.name &&
                      hasDropdownMenu(item.name) && (
                        <div
                          className="fixed z-[9999] dropdown-bubble"
                          style={{
                            zIndex: 9999,
                            left: `${getDropdownPosition(item.name).left}px`,
                            top: `${getDropdownPosition(item.name).top}px`,
                          }}
                        >
                          {/* Triángulo de conexión */}
                          <div
                            className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"
                            style={{
                              filter: "drop-shadow(0 -2px 4px rgba(0,0,0,0.1))",
                            }}
                          />
                          {/* Contenido del dropdown */}
                          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                            {getDropdownComponent(item.name)}
                          </div>
                        </div>
                      )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Overlay menú móvil */}
        {navbar.isMobileMenuOpen && (
          <>
            {/* Overlay oscuro */}
            <div
              className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-black/60 z-40 animate-fade-in transition-opacity duration-500"
              onClick={() => navbar.setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú móvil"
            />
            {/* Panel del menú móvil */}
            <div
              id="mobile-menu"
              className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-50 shadow-2xl border-t border-gray-200 flex flex-col animate-slide-in transition-all duration-500 overflow-y-auto rounded-b-2xl"
              style={{ minHeight: "60vh", maxHeight: "calc(100vh - 4rem)" }}
              role="menu"
              aria-label="Menú móvil"
            >
              {/* 🔧 QUITADO el botón “X” interno para evitar duplicado */}

              {/* 🔧 Contenido ahora ocupa todo el ancho (sin max-w) */}
              <div className="flex flex-col items-start px-4 sm:px-6 mt-5 space-y-8 w-full">
                {/* 🔧 Buscador más largo: w-full dentro de contenedor ancho */}
                <form
                  onSubmit={navbar.handleSearchSubmit}
                  className="flex items-center bg-white/70 backdrop-blur-md  mb-10 rounded-full px-4 h-12 shadow-sm border border-white/30 transition-all duration-300 w-full"
                  style={{ zIndex: 1000, overflow: "hidden" }}
                >
                  <input
                    type="text"
                    className="w-full bg-transparent text-gray-900 placeholder-gray-500 border-none focus:outline-none text-lg px-2"
                    placeholder="Buscar productos..."
                    value={navbar.searchQuery}
                    onChange={(e) => navbar.setSearchQuery(e.target.value)}
                    aria-label="Buscar productos"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className={iconButtonClass}
                    title="Buscar"
                    style={{ zIndex: 1001 }}
                  >
                    <Search
                      className={`w-6 h-6 ${getIconColorClasses("mobile")}`}
                      aria-label="Buscar"
                    />
                  </button>
                </form>

                {/* Ítems del menú móvil */}
                <div
                  className="flex flex-col space-y-3 w-full"
                  role="menu"
                  aria-label="Opciones de navegación"
                >
                  {navbarRoutes.map((item) => {
                    const hasDropdown =
                      item.name === "Dispositivos móviles" ||
                      item.name === "Televisores y AV" ||
                      item.name === "Electrodomésticos";

                    const isDropdownOpen = activeDropdown === item.name;

                    const someDropdownOpen = Boolean(activeDropdown);

                    const matchesUrl =
                      navbar.pathname === item.href ||
                      navbar.pathname.startsWith(item.href + "/") ||
                      navbar.pathname.startsWith(item.href + "?") ||
                      navbar.cleanPath === item.href ||
                      navbar.cleanPath.startsWith(item.href + "/") ||
                      navbar.cleanPath.startsWith(item.href + "?");

                    const isActive = hasDropdown
                      ? activeDropdown === item.name || matchesUrl // dropdown activo si está abierto o la URL coincide
                      : someDropdownOpen
                      ? false // si hay dropdown abierto, no resaltar los links normales
                      : matchesUrl; // si no hay dropdown abierto, marcar por URL
                    return (
                      <div key={item.name} className="flex flex-col">
                        {hasDropdown ? (
                          <button
                            onClick={() => {
                              setActiveDropdown((prev) =>
                                prev === item.name ? null : item.name
                              );
                            }}
                            className={cn(
                              "text-left text-xl font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-gray-900 active:bg-blue-100 focus:bg-blue-100 w-full flex items-center justify-between",
                              isActive && "bg-blue-50 text-blue-700 shadow"
                            )}
                            aria-label={item.name}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            className={cn(
                              "text-left text-xl font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-gray-900 active:bg-blue-100 focus:bg-blue-100",
                              isActive && "bg-blue-50 text-blue-700 shadow"
                            )}
                            aria-label={item.name}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => {
                              navbar.setIsMobileMenuOpen(false);
                              setActiveDropdown(null); // Cierra cualquier dropdown
                              // También podrías cerrar menú móvil aquí si lo tenés
                            }}
                          >
                            {item.name}
                          </Link>
                        )}

                        {/* Dropdown si aplica */}
                        {hasDropdown && isDropdownOpen && (
                          <div className="ml-4 mt-2">
                            {item.name === "Dispositivos móviles" && (
                              <DispositivosMovilesDropdown
                                isMobile
                                onItemClick={() => {
                                  setActiveDropdown(null);
                                  navbar.setIsMobileMenuOpen(false);
                                }}
                              />
                            )}
                            {item.name === "Televisores y AV" && (
                              <TelevisionesDropdown
                                isMobile
                                onItemClick={() => {
                                  setActiveDropdown(null);
                                  navbar.setIsMobileMenuOpen(false);
                                }}
                              />
                            )}
                            {item.name === "Electrodomésticos" && (
                              <ElectrodomesticosDropdown
                                isMobile
                                onItemClick={() => {
                                  setActiveDropdown(null);
                                  navbar.setIsMobileMenuOpen(false);
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
