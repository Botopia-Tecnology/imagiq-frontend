"use client";
/**
 * 🧭 NAVBAR PRINCIPAL - IMAGIQ ECOMMERCE
 * Limpio, escalable y con animaciones suaves en hover
 */
import { cn } from "@/lib/utils";
import { useNavbarLogic } from "@/hooks/navbarLogic";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { posthogUtils } from "@/lib/posthogClient";
import DispositivosMovilesDropdown from "./dropdowns/dispositivos_moviles";
import TelevisionesDropdown from "./dropdowns/televisiones";
import ElectrodomesticosDropdown from "./dropdowns/electrodomesticos";
import { navbarRoutes } from "../routes/navbarRoutes";
import logoSamsungWhite from "@/img/logo_Samsung.png";
import logoSamsungBlack from "@/img/Samsung_black.png";
import carritoIconWhite from "@/img/navbar-icons/carrito-icon-white.png";
import carritoIconBlack from "@/img/navbar-icons/carrito-icon-black.png";
import favoritoIconWhite from "@/img/navbar-icons/favorito-icon-white.png";
import favoritoIconBlack from "@/img/navbar-icons/favoritos-icon-black.png";
import searchIconWhite from "@/img/navbar-icons/search-icon-white.png";
import searchIconBlack from "@/img/navbar-icons/search-icon-black.png";
import userIconWhite from "@/img/navbar-icons/user-icon-white.png";
import userIconBlack from "@/img/navbar-icons/user-icon-black.png";

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
        className={cn(
          "w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/60",
          "sticky top-0 left-0 md:static",
          navbar.isOfertas && !navbar.isScrolled
            ? "bg-transparent"
            : navbar.isOfertas && navbar.isScrolled
            ? "bg-white/60 shadow backdrop-blur-md"
            : navbar.isDispositivosMoviles ||
              navbar.isElectrodomesticos ||
              navbar.isScrolledNavbar
            ? "bg-white/60 shadow backdrop-blur-md"
            : navbar.isHome && !navbar.isScrolled
            ? "bg-transparent"
            : navbar.isProductDetail
            ? "bg-transparent"
            : "bg-white/60 shadow backdrop-blur-md"
        )}
        style={{
          boxShadow:
            navbar.isOfertas && !navbar.isScrolled
              ? "none"
              : navbar.isScrolled
              ? "0 2px 8px 0 rgba(30, 64, 175, 0.12)"
              : "none",
          background:
            navbar.isOfertas && !navbar.isScrolled ? "transparent" : undefined,
          transition:
            "background 0.6s cubic-bezier(.4,0,.2,1), box-shadow 0.6s cubic-bezier(.4,0,.2,1)",
        }}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Logo principal */}
        <div className="flex items-center justify-between h-16 px-8 max-w-full">
          <div className="flex items-center flex-shrink-0 gap-1 md:gap-2">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                posthogUtils.capture("logo_click", { source: "navbar" });
                navbar.router.push("/");
              }}
              aria-label="Inicio"
              className="flex items-center gap-0 md:gap-0 cursor-pointer"
              style={{ padding: 0 }}
            >
              <Image
                src={
                  navbar.showWhiteLogo
                    ? "/frame_311_white.png"
                    : "/frame_311_black.png"
                }
                alt="Q Logo"
                height={22}
                width={22}
                className="h-[22px] w-[22px] min-w-[22px] md:h-[24px] md:w-[24px] md:min-w-[24px]"
                priority
              />
              <Image
                src={navbar.showWhiteLogo ? logoSamsungWhite : logoSamsungBlack}
                alt="Samsung Logo"
                height={28}
                className="h-7 min-w-[80px] md:h-8 md:min-w-[120px]"
                priority
              />
              <span
                className={
                  navbar.showWhiteLogo
                    ? "ml-2 text-base font-bold tracking-wide text-white select-none"
                    : "ml-2 text-base font-bold tracking-wide text-black select-none"
                }
                style={{
                  marginLeft: 8,
                  marginRight: 0,
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                Store
              </span>
            </Link>
          </div>
          {/* Iconos desktop */}
          <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
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
                className="flex items-center justify-center w-10 h-10"
                title="Buscar"
                style={{ zIndex: 1001 }}
              >
                <Image
                  src={
                    navbar.showWhiteItems ? searchIconWhite : searchIconBlack
                  }
                  alt="Buscar"
                  width={26}
                  height={26}
                  priority
                />
              </button>
            </form>
            {/* Icono login */}
            <button
              type="button"
              className={cn(
                "flex items-center justify-center w-10 h-10 text-black",
                navbar.isDispositivosMoviles || navbar.isElectrodomesticos
                  ? "text-black"
                  : navbar.showWhiteItems
                  ? "text-white"
                  : "text-black"
              )}
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
              <Image
                src={navbar.showWhiteItems ? userIconWhite : userIconBlack}
                alt="Usuario"
                width={28}
                height={28}
                priority
              />
            </button>
            {/* Icono carrito */}
            <Link
              href="/carrito"
              className={cn(
                "flex items-center justify-center w-10 h-10 relative text-black",
                navbar.isDispositivosMoviles || navbar.isElectrodomesticos
                  ? "text-black"
                  : navbar.showWhiteItems
                  ? "text-white"
                  : "text-black"
              )}
              title="Carrito de compras"
              onClick={navbar.handleCartClick}
            >
              <Image
                src={
                  navbar.showWhiteItems ? carritoIconWhite : carritoIconBlack
                }
                alt="Carrito"
                width={34}
                height={34}
                priority
              />
              {navbar.isClient && navbar.cartCount > 0 && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold transition-transform duration-150 ease-out",
                    navbar.bump ? "scale-110" : "scale-100"
                  )}
                  aria-label={`Carrito: ${navbar.cartCount} productos`}
                  aria-live="polite"
                >
                  {navbar.cartCount > 99 ? "99+" : navbar.cartCount}
                </span>
              )}
            </Link>
            {/* Icono favoritos */}
            <button
              type="button"
              className={cn(
                "flex items-center justify-center w-10 h-10",
                navbar.isDispositivosMoviles || navbar.isElectrodomesticos
                  ? "text-black"
                  : navbar.showWhiteItems
                  ? "text-white"
                  : "text-black"
              )}
              title="Favoritos"
              aria-label="Favoritos"
              style={{ position: "relative" }}
              onClick={() => navbar.router.push("/product-favoritos")}
            >
              <Image
                src={
                  navbar.showWhiteItems ? favoritoIconWhite : favoritoIconBlack
                }
                alt="Favoritos"
                width={20}
                height={21}
                priority
              />
            </button>
          </div>
          {/* Navbar móvil */}
          <div className="absolute right-0 top-0 flex md:hidden items-center h-16 space-x-4 pr-2 md:static md:w-auto">
            {/* Icono buscar */}
            <button
              className={cn(
                "flex items-center justify-center w-10 h-10 text-2xl font-bold",
                navbar.showWhiteItemsMobile ? "text-white" : "text-black"
              )}
              title={
                navbar.searchQuery === "focus" ? "Cerrar buscador" : "Buscar"
              }
              aria-label={
                navbar.searchQuery === "focus" ? "Cerrar buscador" : "Buscar"
              }
              onClick={() => {
                if (navbar.searchQuery === "focus") navbar.setSearchQuery("");
                else {
                  navbar.setSearchQuery("focus");
                  posthogUtils.capture("search_icon_click", {
                    source: "navbar_mobile",
                  });
                }
              }}
            >
              {navbar.searchQuery === "focus" ? (
                <span className="text-2xl">&#10005;</span>
              ) : (
                <Image
                  src={
                    navbar.showWhiteItemsMobile
                      ? searchIconWhite
                      : searchIconBlack
                  }
                  alt="Buscar"
                  width={26}
                  height={26}
                  priority
                />
              )}
            </button>
            {/* Icono carrito */}
            <Link
              href="/carrito"
              className={cn(
                "flex items-center justify-center w-10 h-10 relative",
                navbar.showWhiteItemsMobile ? "text-white" : "text-black"
              )}
              title="Carrito"
              onClick={navbar.handleCartClick}
            >
              <Image
                src={
                  navbar.showWhiteItemsMobile
                    ? carritoIconWhite
                    : carritoIconBlack
                }
                alt="Carrito"
                width={34}
                height={34}
                priority
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
                navbar.showWhiteItemsMobile ? "text-white" : "text-black"
              )}
              aria-label="Abrir menú"
              onClick={() => navbar.setIsMobileMenuOpen((open) => !open)}
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Input animado */}
            {navbar.searchQuery === "focus" && (
              <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-md z-[10000] animate-fade-in">
                <form
                  onSubmit={navbar.handleSearchSubmit}
                  className="bg-[#17407A] rounded-full flex items-center px-6 py-4 shadow-lg"
                >
                  <input
                    type="text"
                    className="w-full bg-transparent text-white placeholder-white/80 border-none focus:outline-none text-lg"
                    placeholder="Buscar..."
                    autoFocus
                    value={
                      navbar.searchQuery !== "focus" ? navbar.searchQuery : ""
                    }
                    onChange={(e) => navbar.setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="ml-2">
                    <Image
                      src={searchIconWhite}
                      alt="Buscar"
                      width={26}
                      height={26}
                      priority
                    />
                  </button>
                  <button
                    type="button"
                    className="ml-4 text-white text-2xl font-bold focus:outline-none"
                    aria-label="Cerrar buscador"
                    onClick={() => navbar.setSearchQuery("")}
                  ></button>
                </form>
              </div>
            )}
          </div>
        </div>
        {/* Menú de navegación principal - animación hover suave */}
        <nav
          className={cn(
            "hidden md:block transition-all duration-500 relative",
            navbar.isScrolled
              ? "max-h-0 opacity-0 overflow-hidden"
              : "max-h-20 opacity-100"
          )}
        >
          <ul className="flex items-center justify-center space-x-6 lg:space-x-12 py-4 px-4 md:px-8 min-w-max">
            {navbarRoutes.map((item) => {
              // Indicador activo
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
              // Clases animación hover suave mejorada SOLO Tailwind
              const itemTextColor = navbar.showWhiteItems
                ? "text-white"
                : "text-gray-800";
              const activeIndicatorColor =
                navbar.showWhiteItems && isActive
                  ? "bg-white"
                  : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600";
              // Animación hover: fade + slide + escala, curva personalizada
              const hoverClass = cn(
                "transition-all duration-900 ease-[cubic-bezier(.4,0,.2,1)] will-change-transform will-change-opacity transform-gpu",
                navbar.showWhiteItems
                  ? "hover:scale-110 hover:opacity-90 hover:-translate-y-1"
                  : "hover:text-blue-700 hover:scale-105 hover:opacity-90 hover:-translate-y-1"
              );
              return (
                <li
                  key={item.name}
                  className="relative"
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    data-item-name={item.name}
                    ref={navbar.setNavItemRef}
                    onMouseEnter={() => navbar.handleDropdownEnter(item.name)}
                    onMouseLeave={navbar.handleDropdownLeave}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "text-lg font-normal whitespace-nowrap block py-3 px-2 lg:px-4 rounded-lg focus:outline-none",
                        itemTextColor,
                        hoverClass,
                        isActive && navbar.showWhiteItems && "text-white",
                        isActive && !navbar.showWhiteItems && "text-gray-900"
                      )}
                      aria-label={item.name}
                    >
                      <span className="relative flex flex-col items-center">
                        {item.name}
                        {/* Indicador activo con animación fade/slide */}
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
                    {/* Dropdown con animación fade + slide */}
                    {navbar.activeDropdown === item.name &&
                      getDropdownComponent(item.name)}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Overlay menú móvil */}
        {navbar.isMobileMenuOpen && (
          <>
            {/* Overlay oscuro, clickeable para cerrar */}
            <div
              className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-black/60 z-40 animate-fade-in transition-opacity duration-500"
              onClick={() => navbar.setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú móvil"
            />
            {/* Menú hamburguesa animado */}
            <div
              className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-50 shadow-2xl border-t border-gray-200 flex flex-col animate-slide-in transition-all duration-500 overflow-y-auto rounded-b-2xl"
              style={{ minHeight: "60vh", maxHeight: "calc(100vh - 4rem)" }}
              role="menu"
              aria-label="Menú móvil"
            >
              {/* Botón de cierre grande y visible */}
              <button
                className="absolute top-4 right-6 text-gray-700 hover:text-blue-700 text-3xl font-bold focus:outline-none bg-white/80 rounded-full p-2 shadow-md transition-colors duration-300"
                aria-label="Cerrar menú"
                onClick={() => navbar.setIsMobileMenuOpen(false)}
                tabIndex={0}
              >
                &#10005;
              </button>
              {/* Ítems del menú con padding y área de toque mejorada */}
              <div
                className="flex flex-col py-10 px-8 space-y-3"
                role="menu"
                aria-label="Opciones de navegación"
              >
                {navbarRoutes.map((item) => {
                  const isActive =
                    navbar.pathname === item.href ||
                    navbar.pathname.startsWith(item.href + "/") ||
                    navbar.pathname.startsWith(item.href + "?") ||
                    navbar.cleanPath === item.href ||
                    navbar.cleanPath.startsWith(item.href + "/") ||
                    navbar.cleanPath.startsWith(item.href + "?");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "text-xl font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-gray-900 active:bg-blue-100 focus:bg-blue-100",
                        isActive && "bg-blue-50 text-blue-700 shadow"
                      )}
                      aria-label={item.name}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => navbar.handleNavClick(item)}
                      tabIndex={0}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
