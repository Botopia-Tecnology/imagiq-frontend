"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Menu, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbarLogic } from "@/hooks/navbarLogic";
import { posthogUtils } from "@/lib/posthogClient";
import { useVisibleCategories } from "@/hooks/useVisibleCategories";
import { usePreloadCategoryMenus } from "@/hooks/usePreloadCategoryMenus";
import { usePrefetchProducts } from "@/hooks/usePrefetchProducts";
import { useHeroContext } from "@/contexts/HeroContext";
import OfertasDropdown from "./dropdowns/ofertas";
import DynamicDropdown from "./dropdowns/dynamic";
import UserOptionsDropdown from "@/components/dropdowns/user_options";
import { useAuthContext } from "@/features/auth/context";
import AddressDropdown from "./navbar/AddressDropdown";
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
  const { theme } = useHeroContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getNavbarRoutes, loading } = useVisibleCategories();
  const { isAuthenticated } = useAuthContext();

  // Pre-cargar menús de todas las categorías dinámicas al cargar la página
  // La función prioritizeCategory permite priorizar la carga cuando el usuario hace hover
  const { getMenus, isLoading, prioritizeCategory } = usePreloadCategoryMenus();

  // Hook para prefetch de productos cuando el usuario hace hover sobre categorías
  const { prefetchWithDebounce, cancelPrefetch, prefetchProducts } = usePrefetchProducts();

  // Ref para rastrear timers de prefetch de menús por categoría
  const menuPrefetchTimersRef = useRef<Map<string, Array<ReturnType<typeof setTimeout>>>>(new Map());
  
  // Ref para rastrear qué categorías ya se están precargando automáticamente
  const autoPrefetchingRef = useRef<Set<string>>(new Set());
  
  // Ref para rastrear qué categorías ya fueron precargadas automáticamente
  const autoPrefetchedRef = useRef<Set<string>>(new Set());
  
  // Ref para el timer de inicio de precarga automática
  const autoPrefetchStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Función para obtener el componente dropdown apropiado
  const getDropdownComponent = (name: DropdownName, item?: NavItem) => {
    const props = { isMobile: false };

    // Si el item tiene uuid de categoría y NO es una categoría estática, usar DynamicDropdown
    if (item?.uuid && !isStaticCategoryUuid(item.uuid)) {
      const categoryUuid = item.uuid;
      // Usar menús precargados en lugar de estado local
      const cachedMenus = getMenus(categoryUuid) || [];
      const menusLoading = isLoading(categoryUuid);

      // Siempre usar DynamicDropdown para categorías dinámicas
      // Muestra loading mientras cargan los menús o los menús si ya están cargados
      return (
        <DynamicDropdown
          menus={cachedMenus}
          categoryName={item.name}
          categoryCode={item.categoryCode || ""}
          categoryVisibleName={item.categoryVisibleName}
          isMobile={false}
          loading={menusLoading}
        />
      );
    }

    // Fallback a dropdowns estáticos solo para categorías especiales
    switch (name) {
      case "Ofertas":
        return <OfertasDropdown {...props} />;
      default:
        return null;
    }
  };

  // Sistema de precarga automática de productos de categoría + menús
  // Se ejecuta después de un delay inicial para no interferir con la carga inicial
  // Si el usuario hace hover, se prioriza/acelera esa categoría específica
  useEffect(() => {
    // Esperar 3 segundos después de que la página cargue para iniciar precarga automática
    // Esto da tiempo a que los menús se carguen y no interfiere con la carga inicial
    autoPrefetchStartTimerRef.current = setTimeout(() => {
      const startAutoPrefetch = () => {
        const menuRoutes = getNavbarRoutes();
        
        // Obtener todas las categorías dinámicas
        const dynamicCategories = menuRoutes.filter(
          (item) => item.categoryCode && item.uuid && !isStaticCategoryUuid(item.uuid)
        );

        // Precargar productos de categoría + menús para cada categoría
        // Con un delay escalonado más largo para evitar demasiadas peticiones simultáneas
        dynamicCategories.forEach((item, categoryIndex) => {
          if (!item.categoryCode || !item.uuid) return;

          // Delay escalonado por categoría: 0ms, 2000ms, 4000ms, etc. (aumentado para evitar 429)
          setTimeout(() => {
            // Verificar si ya se precargó o se está precargando (por hover o automático)
            if (autoPrefetchedRef.current.has(item.uuid!) || autoPrefetchingRef.current.has(item.uuid!)) {
              return;
            }

            autoPrefetchingRef.current.add(item.uuid!);

            // Esperar un poco para que los menús se carguen si aún no están disponibles
            setTimeout(() => {
              const menus = getMenus(item.uuid!) || [];
              
              // Si no hay menús aún, marcar como en proceso pero no hacer nada
              // Se reintentará cuando se haga hover o en la siguiente iteración
              if (menus.length === 0) {
                autoPrefetchingRef.current.delete(item.uuid!);
                return;
              }

              // Precargar productos de la categoría base
              prefetchProducts({
                categoryCode: item.categoryCode!,
              }).finally(() => {
                // Precargar productos de cada menú activo con delay escalonado más largo
                menus.forEach((menu, menuIndex) => {
                  if (menu.activo && menu.uuid && item.categoryCode) {
                    // Delay escalonado por menú: 0ms, 500ms, 1000ms, etc. (aumentado para evitar 429)
                    setTimeout(() => {
                      prefetchProducts({
                        categoryCode: item.categoryCode!,
                        menuUuid: menu.uuid,
                      }).catch(() => {
                        // Silenciar errores
                      });
                    }, menuIndex * 500);
                  }
                });

                // Marcar como precargado
                autoPrefetchedRef.current.add(item.uuid!);
                autoPrefetchingRef.current.delete(item.uuid!);
              });
            }, 500); // Esperar 500ms para que los menús se carguen
          }, categoryIndex * 2000); // Escalonar cada categoría cada 2000ms (2 segundos)
        });
      };

      startAutoPrefetch();
    }, 3000); // Iniciar después de 3 segundos

    return () => {
      if (autoPrefetchStartTimerRef.current) {
        clearTimeout(autoPrefetchStartTimerRef.current);
      }
    };
  }, [getNavbarRoutes, getMenus, prefetchProducts]);

  useEffect(() => {
    const handleResize = () => {
      const width = globalThis.innerWidth;
      if (width >= 1280) {
        setMobileMenuOpen(false);
      }
    };

    // Listener para cerrar dropdown cuando se dispara el evento personalizado
    const handleCloseDropdown = () => {
      navbar.setActiveDropdown(null);
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
  }, [navbar]);

  // Variables derivadas para sincronizar con HeroContext
  const useHeroTheme =
    (navbar.isOfertas || navbar.isHome) && !navbar.isScrolled;

  // Si hay un dropdown activo, forzar todo a negro
  const shouldShowWhiteLogo = navbar.activeDropdown
    ? false
    : useHeroTheme
    ? theme === "light"
    : navbar.showWhiteLogo;

  const shouldShowWhiteItems = navbar.activeDropdown
    ? false
    : useHeroTheme
    ? theme === "light"
    : navbar.showWhiteItems;

  const shouldShowWhiteItemsMobile = useHeroTheme
    ? theme === "light"
    : navbar.showWhiteItemsMobile;

  const getIconColorClasses = (forMobile = false): string => {
    // Si hay un dropdown activo, siempre negro
    if (navbar.activeDropdown) {
      return "text-black";
    }

    // Siempre negro en páginas de productos
    if (
      navbar.isElectrodomesticos ||
      navbar.isDispositivosMoviles ||
      navbar.isMasInformacionProducto
    ) {
      return "text-black";
    }

    // Si estamos en home u ofertas sin scroll, usar tema del Hero
    if (useHeroTheme) {
      return theme === "light" ? "text-white" : "text-black";
    }

    // Fallback a comportamiento por defecto
    if (forMobile) {
      return shouldShowWhiteItemsMobile ? "text-white" : "text-black";
    }
    return shouldShowWhiteItems ? "text-white" : "text-black";
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
            "xl:hidden px-4 py-3 flex items-center justify-between transition-colors duration-300 min-h-16",
            mobileMenuOpen && "hidden"
          )}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                posthogUtils.capture("logo_click", { source: "navbar" });
                navbar.router.push("/");
              }}
              aria-label="Inicio"
              className="shrink-0"
            >
              <Image
                src={
                  shouldShowWhiteItemsMobile
                    ? "/frame_white.png"
                    : "/frame_black.png"
                }
                alt="Q Logo"
                height={40}
                width={40}
                className="h-10 w-10 transition-all duration-300"
                priority
              />
            </Link>

            {/* Mostrar dirección si el usuario está autenticado, sino mostrar logo Samsung */}
            {isAuthenticated ? (
              <AddressDropdown showWhiteItems={shouldShowWhiteItemsMobile} />
            ) : (
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  posthogUtils.capture("logo_click", { source: "navbar_mobile_samsung" });
                  navbar.router.push("/");
                }}
                aria-label="Inicio"
                className="shrink-0"
              >
                <Image
                  src="https://res.cloudinary.com/dnglv0zqg/image/upload/v1760575601/Samsung_black_ec1b9h.svg"
                  alt="Samsung"
                  width={100}
                  height={32}
                  className={cn(
                    "h-8 w-auto transition-all duration-300",
                    shouldShowWhiteItemsMobile ? "brightness-0 invert" : ""
                  )}
                />
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <CartIcon
              count={navbar.itemCount}
              showBump={false}
              isClient={navbar.isClient}
              onClick={navbar.handleCartClick}
              colorClass={
                shouldShowWhiteItemsMobile ? "text-white" : "text-black"
              }
            />
            {navbar.isAuthenticated && navbar.user?.nombre ? (
              <UserOptionsDropdown
                showWhiteItems={shouldShowWhiteItemsMobile}
              />
            ) : (
              <button
                className="p-2 cursor-pointer active:scale-95 transition-transform duration-150 ease-out"
                aria-label="Usuario"
                onClick={() => globalThis.location.replace("/login")}
              >
                <User
                  className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    shouldShowWhiteItemsMobile ? "text-white" : "text-black"
                  )}
                />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2"
              aria-label="Abrir menú"
            >
              <Menu
                className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  shouldShowWhiteItemsMobile ? "text-white" : "text-black"
                )}
              />
            </button>
          </div>
        </div>

        {/* Desktop Header completo - Mostrar en pantallas >= 1280px */}
        <div className="hidden xl:flex px-4 sm:px-6 lg:px-8 py-4 min-h-[100px] items-end justify-between gap-4 2xl:gap-8">
          <div className="flex items-center gap-2.5 xl:gap-3.5 2xl:gap-5 min-w-0 flex-1">
            <NavbarLogo
              showWhiteLogo={shouldShowWhiteLogo}
              onNavigate={() => navbar.router.push("/")}
            />

            <nav className="min-w-0 flex-1">
              <ul className="flex items-center gap-1.5 xl:gap-2.5 2xl:gap-5">
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
                              navbar.handleDropdownEnter(
                                dropdownKey as DropdownName
                              );
                              // Priorizar la carga del menú si es una categoría dinámica
                              // Esto asegura que el menú se cargue inmediatamente al hacer hover
                              if (
                                item.uuid &&
                                !isStaticCategoryUuid(item.uuid)
                              ) {
                                prioritizeCategory(item.uuid);
                              }
                            }

                            // Prefetch productos de la categoría base cuando hay categoryCode
                            // Esto mejora la velocidad percibida al hacer clic en la categoría
                            // Al hacer hover, se PRIORIZA esta categoría (se acelera el prefetch)
                            if (item.categoryCode && item.uuid) {
                              // Marcar que esta categoría se está precargando por hover (priorizada)
                              // Esto evita que el sistema automático la procese si ya se está precargando
                              autoPrefetchingRef.current.add(item.uuid);
                              
                              // Prefetch de la categoría base (priorizado - sin delay adicional)
                              prefetchProducts({
                                categoryCode: item.categoryCode,
                              });

                              // Prefetch de todos los menús de esta categoría (priorizado)
                              // Esperar un poco para que los menús se carguen si aún no están disponibles
                              const categoryKey = item.uuid || item.categoryCode;
                              const timers: Array<ReturnType<typeof setTimeout>> = [];
                              
                              // Limpiar timers anteriores si existen
                              const existingTimers = menuPrefetchTimersRef.current.get(categoryKey);
                              if (existingTimers) {
                                existingTimers.forEach(timer => clearTimeout(timer));
                              }

                              const initialTimer = setTimeout(() => {
                                if (item.uuid && !isStaticCategoryUuid(item.uuid)) {
                                  const menus = getMenus(item.uuid) || [];
                                  
                                  // Hacer prefetch de cada menú activo con un delay escalonado
                                  // para evitar demasiadas peticiones simultáneas
                                  // Pero más rápido que el sistema automático (priorizado)
                                  menus.forEach((menu, index) => {
                                    if (menu.activo && menu.uuid && item.categoryCode) {
                                      // Delay escalonado para hover: 200ms, 400ms, 600ms, etc. (aumentado para evitar 429)
                                      const menuTimer = setTimeout(() => {
                                        prefetchProducts({
                                          categoryCode: item.categoryCode!,
                                          menuUuid: menu.uuid,
                                        }).catch(() => {
                                          // Silenciar errores
                                        });
                                      }, 200 + (index * 200)); // Escalonar cada 200ms (más rápido que automático pero seguro)
                                      
                                      timers.push(menuTimer);
                                    }
                                  });
                                  
                                  // Guardar timers para poder cancelarlos
                                  menuPrefetchTimersRef.current.set(categoryKey, timers);
                                  
                                  // Marcar como precargado por hover
                                  autoPrefetchedRef.current.add(item.uuid);
                                }
                              }, 50); // Esperar solo 50ms (más rápido que automático)
                              
                              timers.push(initialTimer);
                              menuPrefetchTimersRef.current.set(categoryKey, timers);
                            }
                          }}
                          onMouseLeave={() => {
                            navbar.handleDropdownLeave();

                            // Cancelar prefetch cuando el usuario deja de hacer hover
                            if (item.categoryCode) {
                              const categoryKey = item.uuid || item.categoryCode;
                              
                              // Cancelar prefetch de la categoría base
                              cancelPrefetch({
                                categoryCode: item.categoryCode,
                              });

                              // Cancelar todos los timers de prefetch de menús
                              const timers = menuPrefetchTimersRef.current.get(categoryKey);
                              if (timers) {
                                timers.forEach(timer => clearTimeout(timer));
                                menuPrefetchTimersRef.current.delete(categoryKey);
                              }

                              // Cancelar prefetches de todos los menús de esta categoría
                              if (item.uuid && !isStaticCategoryUuid(item.uuid)) {
                                const menus = getMenus(item.uuid) || [];
                                menus.forEach((menu) => {
                                  if (menu.activo && menu.uuid && item.categoryCode) {
                                    cancelPrefetch({
                                      categoryCode: item.categoryCode,
                                      menuUuid: menu.uuid,
                                    });
                                  }
                                });
                              }
                            }
                          }}
                          className="relative inline-block"
                        >
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              // Prevenir navegación por defecto del Link
                              e.preventDefault();
                              // 🔥 Disparar analytics antes de navegar
                              navbar.handleNavClick(item);
                              // Cerrar dropdown inmediatamente
                              navbar.setActiveDropdown(null);
                              // Navegar de forma programática (instantáneo)
                              navbar.router.push(item.href);
                            }}
                            className={cn(
                              "whitespace-nowrap px-0.5 py-1 pb-2 text-[13px] xl:text-[13.5px] 2xl:text-[15.5px] leading-6 font-semibold  tracking-tight relative inline-block transition-colors duration-200",
                              shouldShowWhiteItems
                                ? navbar.activeDropdown
                                  ? "text-black hover:text-blue-600"
                                  : "text-white hover:opacity-90"
                                : "text-black hover:text-blue-600",
                              !shouldShowWhiteItems &&
                                "after:absolute after:left-0 after:right-0 after:bottom-0 after:h-1 after:bg-blue-500 after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                            )}
                          >
                            {item.name}
                          </Link>

                          {navbar.activeDropdown === dropdownKey &&
                            hasDropdownMenu(dropdownKey, item) && (
                              <div
                                className="fixed left-0 right-0 z-[9999] bg-white shadow-xl"
                                style={{
                                  top: `${
                                    getDropdownPosition(dropdownKey).top
                                  }px`,
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

          <div className="hidden lg:flex flex-col items-start justify-between flex-none min-w-[320px] xl:min-w-[340px] 2xl:min-w-[380px]">
            <div className="w-full flex items-center justify-end gap-4">
              {/* Dirección predeterminada del usuario con dropdown */}
              {isAuthenticated && (
                <div className="flex-1 min-w-0">
                  <AddressDropdown showWhiteItems={shouldShowWhiteItems} />
                </div>
              )}

              <Link
                href="/ventas-corporativas"
                className={cn(
                  "text-[13px] md:text-[13.5px] font-bold whitespace-nowrap shrink-0",
                  shouldShowWhiteItems
                    ? "text-white/90 hover:text-white"
                    : "text-black"
                )}
                title="Para Empresas"
              >
                Para Empresas ↗
              </Link>
            </div>

            <div className="w-full flex items-center justify-end gap-2">
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
              <div className="flex items-center justify-end">
                {navbar.isAuthenticated && navbar.user?.nombre ? (
                  <UserOptionsDropdown showWhiteItems={shouldShowWhiteItems} />
                ) : (
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center w-10 h-10 cursor-pointer active:scale-95 transition-transform duration-150 ease-out",
                      getIconColorClasses()
                    )}
                    onClick={() => globalThis.location.replace("/login")}
                    aria-label="Ingresar"
                  >
                    <User className={cn("w-5 h-5", getIconColorClasses())} />
                  </button>
                )}
              </div>
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

