"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { MAIN_ITEMS, SIZES } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export function DesktopView({ onItemClick }: Props) {
  return (
    <div className="bg-white py-4 px-6 relative">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("close-dropdown"))}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Cerrar menú"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex justify-center items-end">
        <div className="flex items-end" style={{ height: `${SIZES.large.image + 60}px` }}>
          {MAIN_ITEMS.map((item, index) => {
            // Determinar el tamaño según el item
            let size: typeof SIZES.main | typeof SIZES.medium | typeof SIZES.large | typeof SIZES.mediumSmall = SIZES.main;
            let isSpecialSize = false;

            if (item.name === "Accesorios para los Galaxy Watch") {
              size = SIZES.medium;
              isSpecialSize = true;
            } else if (item.name === "Accesorios para las Galaxy Tab") {
              size = SIZES.large;
              isSpecialSize = true;
            } else if (item.name === "Accesorios Galaxy Buds") {
              size = SIZES.mediumSmall;
              isSpecialSize = true;
            }

            // Determinar el margen derecho según el contexto
            let marginRight = "24px"; // gap-x-6 por defecto

            // Si es Tab, Watch o Buds (items especiales), usar menos espacio
            if (isSpecialSize && index < MAIN_ITEMS.length - 1) {
              const nextItem = MAIN_ITEMS[index + 1];
              const nextIsSpecial = [
                "Accesorios para las Galaxy Tab",
                "Accesorios para los Galaxy Watch",
                "Accesorios Galaxy Buds"
              ].includes(nextItem.name);

              // Si el siguiente también es especial, usar espacio reducido
              if (nextIsSpecial) {
                marginRight = "12px"; // Más cerca entre Tab, Watch y Buds
              }
            }

            // Calcular el padding superior para ajustar verticalmente
            let paddingTop = 0;
            if (item.name === "Accesorios para Smartphones" ||
                item.name === "Accesorios de audio" ||
                item.name === "Accesorios para proyector") {
              paddingTop = 30; // Subir estas imágenes
            } else if (item.name === "Accesorios para las Galaxy Tab") {
              paddingTop = -10; // Bajar un poco la Tab
            }

            return (
              <div
                key={item.name}
                className="flex flex-col justify-end"
                style={{ width: `${size.container}px`, marginRight: index < MAIN_ITEMS.length - 1 ? marginRight : '0' }}
              >
                <Link
                  href={item.href}
                  onClick={() => onItemClick(item.name, item.href)}
                  className="flex flex-col text-center group"
                >
                  <div
                    className="relative transition-transform group-hover:scale-105 mx-auto"
                    style={{
                      width: `${size.image}px`,
                      height: `${size.image}px`,
                      marginBottom: '4px',
                      marginTop: `${paddingTop}px`
                    }}
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div style={{ height: '52px' }} className="flex items-start justify-center">
                    <span className="text-xs font-semibold text-gray-900 leading-tight line-clamp-3">
                      {item.name}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
