import { useProductContext } from "@/features/products/ProductContext";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function useNavbarConfig(
  isScrolled: boolean,
  isHome: boolean,
  isLogin: boolean
) {
  const pathname = usePathname();
  const { isAppliance } = useProductContext();
  return useMemo(() => {
    const isProductDetail =
      pathname.startsWith("/productos/") &&
      !pathname.includes("/productos/dispositivos-moviles");
    const isDispositivosMoviles = pathname.startsWith(
      "/productos/dispositivos-moviles"
    );
    const isElectrodomesticos = pathname.startsWith(
      "/productos/Electrodomesticos"
    );
    const isOfertas = pathname === "/ofertas";
    const isMasInformacionProducto = pathname.startsWith("/productos/view/");
    

    const isNavbarItem =
      pathname.startsWith("/productos/") ||
      pathname.startsWith("/ofertas") ||
      pathname.startsWith("/tiendas");

    const isHeroScrolled = isHome && isScrolled;
    const isScrolledNavbar =
      (isScrolled && (isNavbarItem || isProductDetail)) || isHeroScrolled;
    const showWhiteLogo =
      isMasInformacionProducto && !isScrolled && !isAppliance
        ? true
        : isOfertas || (isHome && !isScrolled);

    const showWhiteItems = showWhiteLogo;
    const showWhiteItemsMobile =
      isMasInformacionProducto && !isScrolled && !isAppliance
        ? true
        : isOfertas ||
          (!isScrolledNavbar &&
            !isLogin &&
            (isProductDetail || (isHome && !isScrolled)));

    // Determinar estilos de fondo
    let backgroundStyle = "bg-white/60 shadow backdrop-blur-md";
    let boxShadow = "0 2px 8px 0 rgba(30, 64, 175, 0.12)";
    let background: string | undefined = undefined;
    if (isMasInformacionProducto && !isScrolled && !isAppliance) {
      backgroundStyle = "bg-transparent";
      boxShadow = "none";
      background = "transparent";
    }
    if (isOfertas && !isScrolled) {
      backgroundStyle = "bg-transparent";
      boxShadow = "none";
      background = "transparent";
    } else if (isOfertas && isScrolled) {
      backgroundStyle = "bg-white/60 shadow backdrop-blur-md";
      boxShadow = "0 2px 8px 0 rgba(30, 64, 175, 0.12)";
    } else if (
      isDispositivosMoviles ||
      isElectrodomesticos ||
      isScrolledNavbar
    ) {
      backgroundStyle = "bg-white/60 shadow backdrop-blur-md";
      boxShadow = "0 2px 8px 0 rgba(30, 64, 175, 0.12)";
    } else if (isHome && !isScrolled) {
      backgroundStyle = "bg-transparent";
      boxShadow = "none";
      background = "transparent";
    } else if (isProductDetail) {
      backgroundStyle = "bg-transparent";
      boxShadow = "none";
      background = "transparent";
    } else {
      backgroundStyle = "bg-white/60 shadow backdrop-blur-md";
      boxShadow = "0 2px 8px 0 rgba(30, 64, 175, 0.12)";
    }

    return {
      showWhiteLogo,
      showWhiteItems,
      showWhiteItemsMobile,
      backgroundStyle,
      boxShadow,
      background,
      isDispositivosMoviles,
      isElectrodomesticos,
      isOfertas,
    };
  }, [isScrolled, isHome, isLogin, pathname,isAppliance]);
}
