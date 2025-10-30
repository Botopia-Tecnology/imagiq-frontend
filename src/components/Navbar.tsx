"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Menu, Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbarLogic } from "@/hooks/navbarLogic";
import { posthogUtils } from "@/lib/posthogClient";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import { menusEndpoints, type Menu as MenuType } from "@/lib/api";
import OfertasDropdown from "./dropdowns/ofertas";
import SoporteDropdown from "./dropdowns/soporte";
import DynamicDropdown from "./dropdowns/dynamic";
import UserOptionsDropdown from "@/components/dropdowns/user_options";
import { useAuthContext } from "@/features/auth/context";
import {
  MobileMenu,
  CartIcon,
  SearchBar,
  NavbarLogo,
} from "./navbar/components";
import { hasDropdownMenu, getDropdownPosition } from "./navbar/utils/helpers";
import { isStaticCategoryUuid } from "@/constants/staticCategories";
import type { DropdownName, NavItem } from "./navbar/types";

export default function Navbar() {
  const navbar = useNavbarLogic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getNavbarRoutes, loading } = useVisibleCategories();
  const { user, isAuthenticated } = useAuthContext();

  const [isIntermediateScreen, setIsIntermediateScreen] = useState(false);

  // Estado para carga bajo demanda de menús
  const [loadedMenus, setLoadedMenus] = useState<Record<string, MenuType[]>>({});
  const [loadingMenus, setLoadingMenus] = useState<Record<string, boolean>>({});

  // Función para cargar menús bajo demanda
  const loadMenusForCategory = async (categoryUuid: string) => {
    // Si ya están cargados o están cargando, no hacer nada
    if (loadedMenus[categoryUuid] || loadingMenus[categoryUuid]) return;

    setLoadingMenus(prev => ({ ...prev, [categoryUuid]: true }));
    try {
      const response = await menusEndpoints.getMenusByCategory(categoryUuid);
      if (response.success && response.data) {
        setLoadedMenus(prev => ({ ...prev, [categoryUuid]: response.data }));
      }
    } catch (error) {
      console.error('Error loading menus:', error);
    } finally {
      setLoadingMenus(prev => ({ ...prev, [categoryUuid]: false }));
    }
  };

  // Función para obtener el componente dropdown apropiado
  const getDropdownComponent = (name: DropdownName, item?: NavItem) => {
    const props = { isMobile: false };

    // Si el item tiene uuid de categoría y NO es una categoría estática, usar DynamicDropdown
    if (item?.uuid && !isStaticCategoryUuid(item.uuid)) {
      const categoryUuid = item.uuid;
      const cachedMenus = loadedMenus[categoryUuid];
      const isLoading = loadingMenus[categoryUuid] || false;

      // Siempre usar DynamicDropdown para categorías dinámicas
      // Muestra loading mientras cargan los menús o los menús si ya están cargados
      return (
        <DynamicDropdown
          menus={cachedMenus || []}
          categoryName={item.name}
          categoryCode={item.categoryCode || ''}
          categoryVisibleName={item.categoryVisibleName}
          isMobile={false}
          loading={isLoading}
        />
      );
    }

    // Fallback a dropdowns estáticos solo para categorías especiales
    switch (name) {
      case "Ofertas":
        return <OfertasDropdown {...props} />;
      case "Soporte":
        return <SoporteDropdown {...props} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setMobileMenuOpen(false);
      }
      // Detectar pantallas entre 1280px (xl) y 1536px (2xl) - más pequeño que desktop pero más grande que tablet
      setIsIntermediateScreen(width >= 1280 && width < 1536);
    };

    // Listener para cerrar dropdown cuando se dispara el evento personalizado
    const handleCloseDropdown = () => {
      navbar.setActiveDropdown(null);
    };

    // Ejecutar una vez al montar
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener(
      "close-dropdown",
      handleCloseDropdown as EventListener
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener(
        "close-dropdown",
        handleCloseDropdown as EventListener
      );
    };
  }, [navbar]);

  const getIconColorClasses = (forMobile = false): string => {
    if (
      navbar.isElectrodomesticos ||
      navbar.isDispositivosMoviles ||
      navbar.isMasInformacionProducto
    ) {
      return "text-black";
    }
    if (forMobile) {
      return navbar.showWhiteItemsMobile ? "text-white" : "text-black";
    }
    return navbar.showWhiteItems ? "text-white" : "text-black";
  };

  // Obtener las rutas dinámicas desde el hook
  const menuRoutes: NavItem[] = getNavbarRoutes();

  // Determinar si debe mostrar fondo transparente o blanco
  const showTransparentBg =
    (navbar.isOfertas || navbar.isHome) &&
    !navbar.activeDropdown &&
    !navbar.isScrolled;

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
          !navbar.showNavbar ? "-translate-y-full" : "translate-y-0"
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
            onClick={(e) => {
              e.preventDefault();
              posthogUtils.capture("logo_click", { source: "navbar" });
              navbar.router.push("/");
            }}
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
              colorClass={
                navbar.showWhiteItemsMobile ? "text-white" : "text-black"
              }
            />
            <button className="p-2" aria-label="Usuario">
              <User
                className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  navbar.showWhiteItemsMobile ? "text-white" : "text-black"
                )}
              />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2"
              aria-label="Abrir menú"
            >
              <Menu
                className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  navbar.showWhiteItemsMobile ? "text-white" : "text-black"
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
                        onMouseEnter={() => {
                          if (hasDropdownMenu(dropdownKey, item)) {
                            navbar.handleDropdownEnter(dropdownKey as DropdownName);
                            // Cargar menús bajo demanda si el item tiene uuid
                            if (item.uuid && !isStaticCategoryUuid(item.uuid)) {
                              loadMenusForCategory(item.uuid);
                            }
                          }
                        }}
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
                          {item.name}
                        </Link>

                        {navbar.activeDropdown === dropdownKey &&
                          hasDropdownMenu(dropdownKey, item) && (
                            <div
                              className="fixed left-0 right-0 z-[9999] bg-white shadow-xl"
                              style={{
                                top: `${getDropdownPosition(dropdownKey).top}px`,
                              }}
                            >
                              <div className="mx-auto max-w-screen-2xl">
                                {getDropdownComponent(
                                  dropdownKey as DropdownName,
                                  item
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </li>
                  );
                })
                )}
              </ul>
            </nav>
          </div>

          <div className="hidden lg:flex flex-col items-end justify-between gap-2 flex-none min-w-[320px] xl:min-w-[340px] 2xl:min-w-[380px]">
            <div className="flex items-center gap-4 leading-none">
              {/* Dirección predeterminada del usuario */}
              {isAuthenticated && user?.defaultAddress && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium max-w-[200px] truncate",
                    navbar.showWhiteItems ? "text-white/90" : "text-black/80"
                  )}
                  title={user.defaultAddress.direccionFormateada}
                >
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {user.defaultAddress.ciudad || user.defaultAddress.nombreDireccion}
                  </span>
                </div>
              )}

              <Link
                href="/ventas-corporativas"
                className={cn(
                  "text-[13px] md:text-[13.5px] font-bold whitespace-nowrap",
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
                colorClass={getIconColorClasses()}
              />
              <Link
                href="/favoritos"
                className={cn(
                  "flex items-center justify-center w-10 h-10",
                  getIconColorClasses()
                )}
                aria-label="Favoritos"
              >
                <Heart className={cn("w-5 h-5", getIconColorClasses())} />
              </Link>
              {navbar.isAuthenticated && navbar.user?.nombre ? (
                <UserOptionsDropdown showWhiteItems={navbar.showWhiteItems} />
              ) : (
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center w-10 h-10",
                    getIconColorClasses()
                  )}
                  onClick={() => window.location.replace("/login")}
                  aria-label="Ingresar"
                >
                  <User className={cn("w-5 h-5", getIconColorClasses())} />
                </button>
              )}
            </div>
          </div>
        </div>
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
