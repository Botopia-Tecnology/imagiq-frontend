"use client";
/**
 * 📱 COMPARATION PRODUCT COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente para comparar dispositivos, fiel al diseño adjunto.
 * - Layout grid responsivo, sin scroll lateral en mobile
 * - Tipografías, colores y espaciados ajustados a la referencia
 * - Accesibilidad y semántica mejoradas
 * - Lógica y handlers intactos
 */

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import samsungS25 from "@/img/dispositivosmoviles/cel1.png";
import samsungS24 from "@/img/dispositivosmoviles/cel2.png";

// --- Tipos para claridad y escalabilidad ---
interface Product {
  name: string;
  image: StaticImageData;
  specs: {
    camera: string[];
  };
}

const products: Product[] = [
  {
    name: "Galaxy S25 Ultra 5G",
    image: samsungS25,
    specs: {
      camera: [
        "Cámara ultraancha 50 MP",
        "Cámara de ángulo amplio 200 MP",
        "Teleobjetivo 50/10 MP",
      ],
    },
  },
  {
    name: "Galaxy S24 Ultra 5G",
    image: samsungS24,
    specs: {
      camera: [
        "Cámara ultraancha 12 MP",
        "Cámara de ángulo amplio 200 MP",
        "Teleobjetivo 50/10 MP",
      ],
    },
  },
];

// --- Clases base reutilizables ---
const baseSelect =
  "bg-transparent text-[#222] px-4 py-2 rounded-full font-bold text-sm border border-[#E5E7EB] shadow focus:outline-none focus:ring-2 focus:ring-[#0099FF] transition-all duration-200 hover:border-[#0099FF] cursor-pointer appearance-none pr-8 w-full";
const baseCell =
  "text-[15px] md:text-base text-[#222] font-normal py-3 px-2 md:px-4 border-b border-[#E5E7EB] text-center align-middle truncate";
const baseHeader =
  "text-xs md:text-sm font-semibold text-[#8A8A8A] bg-[#F7FAFD] py-2 px-2 md:px-4 border-b border-[#E5E7EB] text-center align-middle uppercase tracking-wide";

export default function ComparationProduct() {
  // Estado para producto seleccionado
  const [selectedLeft, setSelectedLeft] = useState(products[0]);

  // --- Layout principal ---
  return (
    <section
      className="w-full min-h-screen bg-white flex flex-col items-center justify-start py-8 px-2 md:px-6 lg:px-0"
      aria-label="Comparación de dispositivos"
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      {/* Título y subtítulo */}
      <header className="w-full max-w-6xl mx-auto mb-2 md:mb-4 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#222] mb-1 md:mb-2 tracking-tight">
          Compara dispositivos
        </h1>
        <p className="text-[#8A8A8A] text-sm md:text-base font-normal mb-4 md:mb-8">
          Ve cómo se compara el Galaxy Z Fold7 con otros dispositivos
        </p>
      </header>

      {/* --- Tabla comparativa --- */}
      <div className="w-full max-w-6xl overflow-x-auto rounded-2xl shadow bg-white">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th
                className={
                  baseHeader + " w-[120px] md:w-[180px] lg:w-[220px] bg-white"
                }
              ></th>
              <th
                className={
                  baseHeader +
                  " min-w-[120px] md:min-w-[180px] lg:min-w-[220px] bg-[#F7FAFD]"
                }
              >
                <div className="flex flex-col items-center justify-center gap-2 py-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-1">
                    <Image
                      src={selectedLeft.image}
                      alt={selectedLeft.name}
                      className="object-contain rounded-xl border border-[#E5E7EB] bg-white"
                      width={80}
                      height={80}
                    />
                  </div>
                  <span
                    className="text-[#222] text-xs md:text-base font-semibold truncate"
                    title={selectedLeft.name}
                  >
                    {selectedLeft.name}
                  </span>
                </div>
              </th>
              <th
                className={
                  baseHeader +
                  " min-w-[120px] md:min-w-[180px] lg:min-w-[220px] bg-white/60"
                }
              >
                <span className="inline-block text-[#8A8A8A] text-xs md:text-base font-semibold py-2 px-1 rounded-lg bg-[#F7FAFD]">
                  Galaxy S25
                </span>
              </th>
              <th
                className={
                  baseHeader +
                  " min-w-[120px] md:min-w-[180px] lg:min-w-[220px] bg-white/60"
                }
              >
                <span className="inline-block text-[#8A8A8A] text-xs md:text-base font-semibold py-2 px-1 rounded-lg bg-[#F7FAFD]">
                  Galaxy S24 Ultra
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Pantalla */}
            <tr>
              <td className={baseCell + " font-semibold text-left"}>
                Pantalla
              </td>
              <td
                className={
                  baseCell + " text-[#0099FF] underline cursor-pointer"
                }
              >
                7.6&quot; plegable + 6.5&quot; externa
              </td>
              <td className={baseCell}>6.7&quot;</td>
              <td className={baseCell}>6.8&quot;</td>
            </tr>
            {/* Procesador */}
            <tr>
              <td className={baseCell + " font-semibold text-left"}>
                Procesador
              </td>
              <td
                className={
                  baseCell + " text-[#0099FF] underline cursor-pointer"
                }
              >
                Snapdragon 8 Gen 4
              </td>
              <td className={baseCell}>A17 Pro</td>
              <td className={baseCell}>Snapdragon 8 Gen 3</td>
            </tr>
            {/* RAM */}
            <tr>
              <td className={baseCell + " font-semibold text-left"}>RAM</td>
              <td
                className={
                  baseCell + " text-[#0099FF] underline cursor-pointer"
                }
              >
                12GB / 16GB
              </td>
              <td className={baseCell}>8GB</td>
              <td className={baseCell}>12GB</td>
            </tr>
            {/* Cámara principal */}
            <tr>
              <td className={baseCell + " font-semibold text-left"}>
                Cámara principal
              </td>
              <td
                className={
                  baseCell + " text-[#0099FF] underline cursor-pointer"
                }
              >
                200MP
              </td>
              <td className={baseCell}>48MP</td>
              <td className={baseCell}>200MP</td>
            </tr>
            {/* Batería */}
            <tr>
              <td className={baseCell + " font-semibold text-left"}>Batería</td>
              <td
                className={
                  baseCell + " text-[#0099FF] underline cursor-pointer"
                }
              >
                5000mAh
              </td>
              <td className={baseCell}>4444mAh</td>
              <td className={baseCell}>5000mAh</td>
            </tr>
            {/* Característica única */}
            <tr>
              <td className={baseCell + " font-semibold text-left"}>
                Característica única
              </td>
              <td
                className={
                  baseCell + " text-[#0099FF] underline cursor-pointer"
                }
              >
                Pantalla plegable + S Pen integrado
              </td>
              <td className={baseCell}>Action Button</td>
              <td className={baseCell}>S Pen incluido</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- Selector de dispositivos (solo para el primer dispositivo, como en la imagen) --- */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-start gap-4 mt-6">
        <div className="flex flex-col items-center md:items-start w-full md:w-auto">
          <label
            htmlFor="device-select"
            className="text-xs text-[#8A8A8A] font-semibold mb-1 ml-1"
          >
            Cambiar dispositivo principal
          </label>
          <select
            id="device-select"
            className={baseSelect + " max-w-xs"}
            value={selectedLeft.name}
            onChange={(e) => {
              const prod = products.find((p) => p.name === e.target.value);
              if (prod) setSelectedLeft(prod);
            }}
            aria-label="Seleccionar dispositivo principal para comparar"
          >
            {products.map((p) => (
              <option
                key={p.name}
                value={p.name}
                className="bg-white text-[#222]"
              >
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Botón de comparación completa (solo desktop/tablet) --- */}
      <div className="hidden md:flex w-full max-w-6xl justify-center mt-8">
        <button
          className="bg-[#0099FF] hover:bg-[#007ACC] text-white font-bold py-3 px-8 rounded-full shadow-lg text-base transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
          aria-label="Ver comparación completa"
        >
          Ver comparación completa
        </button>
      </div>
    </section>
  );
}
