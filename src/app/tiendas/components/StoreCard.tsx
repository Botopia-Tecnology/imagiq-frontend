"use client";

import Image from "next/image";
import type { FormattedStore } from "@/types/store";

interface StoreCardProps {
  store: FormattedStore;
  onSelect?: (store: FormattedStore) => void;
  isSelected?: boolean;
}

export default function StoreCard({ store, onSelect, isSelected }: StoreCardProps) {
  return (
    <div
      className={`bg-white rounded-[16px] border px-4 py-3 flex flex-col gap-2 transition-all duration-200 cursor-pointer ${
        isSelected ? 'border-[#1D8AFF] border-2 shadow-md' : 'border-black'
      }`}
      onClick={() => onSelect?.(store)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(store)}
      aria-pressed={isSelected}
    >
      <h2
        className="font-bold text-[17px] mb-1 flex items-center gap-2 text-gray-900"
        style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
      >
        {store.descripcion}
      </h2>

      {/* Botones de navegación */}
      <div className="flex gap-2 w-full">
        <button
          className="flex-1 bg-gray-400 text-white rounded-[12px] px-4 py-2 font-bold text-[14px] border-none shadow-sm hover:bg-gray-500 transition-all flex items-center justify-center gap-2"
          style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${store.latitud},${store.longitud}`,
              "_blank"
            );
          }}
        >
          <Image
            src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445116/Google_Maps_icon__2020.svg_r4s0ks.png"
            alt="Google Maps"
            width={14}
            height={16}
            className="w-3.5 h-4"
          />
          Maps
        </button>
        <button
          className="flex-1 bg-[#33CCFF] text-white rounded-[12px] px-4 py-2 font-bold text-[14px] border-none shadow-sm hover:bg-[#00B8E6] transition-all flex items-center justify-center gap-2"
          style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://waze.com/ul?ll=${store.latitud},${store.longitud}&navigate=yes`,
              "_blank"
            );
          }}
        >
          <Image
            src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445166/unnamed_jfcf46.png"
            alt="Waze"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          Waze
        </button>
      </div>

      {/* Información de la tienda */}
      <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-200">
        {/* Dirección */}
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1">
            <div className="text-[13px] text-gray-700 leading-relaxed">
              {store.direccion}
              {store.ubicacion_cc && ` - ${store.ubicacion_cc}`}
            </div>
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div className="text-[13px] text-gray-700">
            {store.telefono}
            {store.extension && ` Ext ${store.extension}`}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div className="text-[13px] text-gray-700 break-all">{store.email}</div>
        </div>

        {/* Ciudad */}
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div className="text-[13px] text-gray-700">
            {store.ciudad}, {store.departamento}
          </div>
        </div>

        {/* Horario */}
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div className="text-[13px] text-gray-700 leading-relaxed">
            {store.horario}
          </div>
        </div>
      </div>
    </div>
  );
}
