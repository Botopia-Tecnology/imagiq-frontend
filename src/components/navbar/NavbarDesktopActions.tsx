"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context";
import { useCartContext } from "@/features/cart/CartContext";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { Search } from "lucide-react";
import carritoIconBlack from "@/img/navbar-icons/carrito-icon-black.png";
import carritoIconWhite from "@/img/navbar-icons/carrito-icon-white.png";
import userIconBlack from "@/img/navbar-icons/user-icon-black.png";
import userIconWhite from "@/img/navbar-icons/user-icon-white.png";
import favoritoIconBlack from "@/img/navbar-icons/favoritos-icon-black.png";
import favoritoIconWhite from "@/img/navbar-icons/favorito-icon-white.png";

interface NavbarDesktopActionsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showWhiteItems: boolean;
  isClient: boolean;
  handleSearchSubmit: (e: React.FormEvent) => void;
}

export default function NavbarDesktopActions({
  searchQuery,
  setSearchQuery,
  showWhiteItems,
  isClient,
  handleSearchSubmit,
}: NavbarDesktopActionsProps) {
  const { isAuthenticated } = useAuthContext();
  const { itemCount } = useCartContext();
  const router = useRouter();

  const handleCartClick = () => {
    posthogUtils.capture("cart_icon_click", {
      cart_items: itemCount,
      user_authenticated: isAuthenticated,
    });
    router.push("/carrito");
  };

  return (
    <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
      {/* Buscador */}
      <div
        className="relative flex items-center group"
        onMouseEnter={() => setSearchQuery("focus")}
        onMouseLeave={() => setSearchQuery("")}
      >
        <form
          onSubmit={handleSearchSubmit}
          className={cn(
            "flex items-center transition-all duration-500 bg-[#17407A] rounded-full px-4 h-12",
            searchQuery === "focus" ? "w-72 opacity-100" : "w-0 opacity-0 px-0"
          )}
          style={{ zIndex: 1000, overflow: "hidden" }}
        >
          <input
            type="text"
            className="w-full bg-transparent text-white placeholder-white/80 border-none focus:outline-none text-lg"
            placeholder="Buscar..."
            value={searchQuery !== "focus" ? searchQuery : ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <button
          className={cn(
            "flex items-center justify-center w-10 h-10 transition-colors absolute right-0",
            showWhiteItems ? "text-white" : "text-black"
          )}
          title="Buscar"
          onClick={() =>
            posthogUtils.capture("search_icon_click", { source: "navbar" })
          }
          style={{ zIndex: 1001 }}
        >
          <Search
            className={
              showWhiteItems ? "w-6 h-6 text-white" : "w-6 h-6 text-black"
            }
          />
        </button>
      </div>

      {/* Login */}
      <button
        type="button"
        className={cn(
          "flex items-center justify-center w-10 h-10",
          showWhiteItems ? "text-white" : "text-black"
        )}
        title={isAuthenticated ? "Dashboard" : "Ingresar"}
        onClick={() => {
          posthogUtils.capture("user_icon_click", {
            user_authenticated: isAuthenticated,
            destination: "login",
          });
          window.location.replace("/login");
        }}
      >
        <Image
          src={showWhiteItems ? userIconWhite : userIconBlack}
          alt="Usuario"
          width={28}
          height={28}
          priority
        />
      </button>

      {/* Carrito */}
      <Link
        href="/carrito"
        className={cn(
          "flex items-center justify-center w-10 h-10 relative",
          showWhiteItems ? "text-white" : "text-black"
        )}
        title="Carrito de compras"
        onClick={handleCartClick}
      >
        <Image
          src={showWhiteItems ? carritoIconWhite : carritoIconBlack}
          alt="Carrito"
          width={34}
          height={34}
          priority
        />
        {isClient && itemCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
            aria-label={`Carrito: ${itemCount} productos`}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Link>

      {/* Favoritos */}
      <button
        type="button"
        className={cn(
          "flex items-center justify-center w-10 h-10",
          showWhiteItems ? "text-white" : "text-black"
        )}
        title="Favoritos"
        onClick={() => router.push("/product-favoritos")}
      >
        <Image
          src={showWhiteItems ? favoritoIconWhite : favoritoIconBlack}
          alt="Favoritos"
          width={20}
          height={21}
          priority
        />
      </button>
    </div>
  );
}
