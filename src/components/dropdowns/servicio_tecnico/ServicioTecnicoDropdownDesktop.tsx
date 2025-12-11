"use client";

import { useRouter } from "next/navigation";
import { SERVICIO_TECNICO_MENU_ITEMS } from "./constants";

export default function ServicioTecnicoDropdownDesktop() {
  const router = useRouter();

  const handleClick = (href: string) => {
    // Cerrar el dropdown primero
    window.dispatchEvent(new Event("close-dropdown"));
    // Navegar después de un pequeño delay para asegurar que el dropdown se cierra
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <div className="bg-white shadow-lg rounded-b-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-2 gap-4">
          {SERVICIO_TECNICO_MENU_ITEMS.map((item) => {
            const IconComponent = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => handleClick(item.href)}
                className="block text-left w-full"
              >
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
