"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { navbarRoutes } from "@/routes/navbarRoutes";

interface NavbarNavigationProps {
  isScrolled: boolean;
  showWhiteItems: boolean;
  handleDropdownEnter: (dropdownName: string) => void;
  handleDropdownLeave: () => void;
  setNavItemRef: (el: HTMLDivElement | null) => void;
}

export default function NavbarNavigation({
  isScrolled,
  showWhiteItems,
  handleDropdownEnter,
  handleDropdownLeave,
  setNavItemRef,
}: NavbarNavigationProps) {
  const pathname = usePathname();

  const handleNavClick = (item: (typeof navbarRoutes)[0]) => {
    posthogUtils.capture("navbar_click", {
      nav_item: item.name,
      nav_category: item.category,
      nav_href: item.href,
    });
  };

  return (
    <nav
      className={cn(
        "hidden md:block relative overflow-hidden",
        "transition-all duration-300 ease-in-out",
        isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
      )}
      style={{ willChange: "max-height, opacity" }}
    >
      <ul className="flex items-center justify-center space-x-6 lg:space-x-12 py-4 px-4 md:px-8 min-w-max">
        {navbarRoutes.map((item) => {
          let isActive = false;
          if (item.name === "Electrodomésticos") {
            isActive = pathname.startsWith("/productos/electrodomesticos");
          } else {
            isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
          }

          const itemTextColor = showWhiteItems ? "text-white" : "text-gray-800";
          const activeIndicatorColor =
            showWhiteItems && isActive
              ? "bg-white"
              : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600";

          const ofertasHoverClass = showWhiteItems
            ? "hover:scale-110"
            : "hover:text-blue-700";

          return (
            <li key={item.name} className="relative group">
              <div
                ref={setNavItemRef}
                data-item-name={item.name}
                onMouseEnter={() => handleDropdownEnter(item.name)}
                onMouseLeave={handleDropdownLeave}
                className="relative"
              >
                <Link
                  href={item.href}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    "font-semibold text-base px-4 py-2 rounded-lg transition-all duration-300 ease-out relative overflow-hidden",
                    itemTextColor,
                    ofertasHoverClass,
                    "hover:bg-white/10 hover:backdrop-blur-sm",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400/20 before:to-purple-400/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <div
                      className={cn(
                        "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full animate-pulse",
                        activeIndicatorColor
                      )}
                    />
                  )}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
