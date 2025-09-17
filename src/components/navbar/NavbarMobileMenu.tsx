"use client";

import Link from "next/link";
import { navbarRoutes } from "@/routes/navbarRoutes";
import { posthogUtils } from "@/lib/posthogClient";

interface NavbarMobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function NavbarMobileMenu({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavbarMobileMenuProps) {
  const handleNavClick = (item: (typeof navbarRoutes)[0]) => {
    posthogUtils.capture("navbar_click", {
      nav_item: item.name,
      nav_category: item.category,
      nav_href: item.href,
    });
    setIsMobileMenuOpen(false);
  };

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-black/50 z-30 animate-fade-in"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Menú */}
      <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-50 shadow-lg border-t border-gray-200 flex flex-col animate-slide-in overflow-y-auto">
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-900 text-2xl font-bold focus:outline-none"
          aria-label="Cerrar menú"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          &#10005;
        </button>

        <div className="flex flex-col py-8 px-6 space-y-2" role="menu">
          {navbarRoutes.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item)}
              className="text-gray-900 hover:text-blue-600 font-medium text-lg py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              role="menuitem"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
