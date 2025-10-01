/**
 * 📌 SECONDARY NAVBAR - VENTAS CORPORATIVAS
 * Barra de navegación secundaria sticky reutilizable
 */

"use client";

import React, { useState, useEffect } from "react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface SecondaryNavbarProps {
  items: NavItem[];
  onContactClick?: () => void;
  brandLabel?: string;
}

export default function SecondaryNavbar({
  items,
  onContactClick,
  brandLabel = "Educativo",
}: SecondaryNavbarProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Se vuelve sticky apenas el usuario empieza a scrollear
      // Esto hace que aparezca inmediatamente cuando las categorías se ocultan
      setIsSticky(window.scrollY > 1);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      // Altura del navbar principal (64px) + altura de este navbar (64px) = 128px
      const offset = 128;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`bg-black text-white transition-all duration-300 ${
        isSticky
          ? "fixed top-[64px] left-0 right-0 shadow-lg z-[45]"
          : "relative"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="text-lg font-semibold">{brandLabel}</div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm hover:text-gray-300 transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}

            {/* Contact Button */}
            {onContactClick && (
              <button
                onClick={onContactClick}
                className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Contáctanos
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={onContactClick}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold"
            >
              Contáctanos
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4 space-y-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block text-sm hover:text-gray-300 transition-colors py-2"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
