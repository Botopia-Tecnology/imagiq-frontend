import React, { useState } from "react";
import { useCartContext } from "@/features/cart/CartContext";
import { usePointsContext } from "@/contexts/PointsContext";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";

interface SpecificationsProps {
  product: ProductCardProps;
}

// --- DATOS MOCK para visualización UX ---
type SpecCategoryKey = keyof typeof MOCK_SPECS;
type SpecItem = { label: string; value: string };

const MOCK_SPECS: Record<string, SpecItem[]> = {
  Pantalla: [
    { label: "Tipo", value: "Dynamic AMOLED 2X" },
    { label: "Tamaño", value: "7.6 pulgadas" },
    { label: "Resolución", value: "2176 x 1812 px" },
    { label: "Frecuencia", value: "120 Hz" },
  ],
  Rendimiento: [
    { label: "Procesador", value: "Snapdragon 8 Gen 2" },
    { label: "RAM", value: "12 GB" },
    { label: "Almacenamiento", value: "512 GB" },
  ],
  Cámaras: [
    { label: "Principal", value: "50 MP + 12 MP + 10 MP" },
    { label: "Frontal", value: "10 MP" },
    { label: "Video", value: "8K UHD" },
  ],
  "Batería y Carga": [
    { label: "Capacidad", value: "4400 mAh" },
    { label: "Carga rápida", value: "25W" },
    { label: "Carga inalámbrica", value: "Sí" },
  ],
  Conectividad: [
    { label: "5G", value: "Sí" },
    { label: "WiFi", value: "6E" },
    { label: "Bluetooth", value: "5.3" },
    { label: "SIM", value: "Dual SIM" },
  ],
  "Diseño y Características": [
    { label: "Color", value: "Phantom Black" },
    { label: "Peso", value: "253 g" },
    { label: "Resistencia", value: "IPX8" },
    { label: "Puntos Q", value: "4" },
  ],
};

// Categorías visuales y sus campos (solo los que existen en ProductCardProps)
const SPEC_CATEGORIES = [
  { key: "Pantalla" },
  { key: "Rendimiento" },
  { key: "Cámaras" },
  { key: "Batería y Carga" },
  { key: "Conectividad" },
  { key: "Diseño y Características" },
];

const Specifications: React.FC<SpecificationsProps> = ({ product }) => {
  const { addProduct } = useCartContext();
  const { recalculatePoints } = usePointsContext();
  const [activeTab, setActiveTab] = useState(0);

  // --- VISUAL: Precio formateado y mostrado dentro del botón ---
  // Usar el precio real del producto, formateado
  const priceNumber =
    typeof product.price === "number"
      ? product.price
      : parseInt((product.price || "0").toString().replace(/[^\d]/g, ""));
  const displayPrice = priceNumber.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  // Handler para añadir al carrito y actualizar puntos Q (no cambia lógica)
  const handleAddToCart = () => {
    const image =
      typeof product.image === "string"
        ? product.image
        : product.image?.src || "";
    addProduct({
      id: product.id,
      name: product.name,
      image,
      price: priceNumber,
      sku: product.sku || "SKU",
      quantity: 1,
      puntos_q: product.puntos_q ?? 4,
    });
    recalculatePoints();
  };

  // --- VISUAL: UX mejorada, tabs y contenido ---
  return (
    <section
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-8 md:py-12"
      aria-label="Especificaciones técnicas"
    >
      {/* Título y subtítulo con jerarquía visual */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 text-gray-800 tracking-tight">
        Especificaciones técnicas
      </h2>
      <p className="text-gray-400 text-center mb-8 text-base sm:text-lg font-light max-w-xl mx-auto">
        Tecnología de vanguardia en cada detalle
      </p>

      {/* Tabs horizontales con fondo que cubre solo los tabs en desktop, y todo el ancho en mobile */}
      <div className="w-full flex justify-center mb-8">
        <div className="inline-flex lg:inline-flex w-full max-w-[calc(100vw-24px)] sm:max-w-[calc(100vw-48px)] lg:w-auto lg:max-w-max bg-[#f7fafd] rounded-xl lg:rounded-2xl py-3 sm:py-4 px-1 sm:px-2 shadow-sm items-center justify-center transition-all">
          <nav
            className="flex flex-nowrap gap-3 lg:gap-5 overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory px-0 sm:px-1 w-full lg:w-auto"
            aria-label="Categorías de especificaciones"
            tabIndex={0}
          >
            {SPEC_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.key}
                type="button"
                /*
                  Responsive: ancho más grande en mobile, layout desktop intacto
                */
                className={`flex items-center justify-center min-w-[180px] max-w-[260px] sm:min-w-[200px] sm:max-w-[320px] px-2 sm:px-2 py-3 sm:py-4 rounded-3xl sm:rounded-4xl border transition-all duration-200 text-sm sm:text-base md:text-lg font-semibold whitespace-pre-line break-words text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2 select-none shadow-sm snap-start
                  ${
                    activeTab === idx
                      ? "bg-[#0099FF] text-white border-[#0099FF] shadow-xl scale-105 z-10"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
                  }
                `}
                aria-pressed={activeTab === idx}
                tabIndex={0}
                onClick={() => setActiveTab(idx)}
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                  textAlign: "center",
                }}
              >
                <span
                  className={`inline-block w-3 h-3 mr-2 rounded-full border-2 transition-all duration-200 ${
                    activeTab === idx
                      ? "bg-white border-white"
                      : "bg-gray-300 border-gray-300"
                  }`}
                  aria-hidden="true"
                />
                {cat.key}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido de la categoría activa, con datos mock y jerarquía visual */}
      <div className="w-full flex flex-col items-center min-h-[120px] animate-fadeInContent">
        <ul className="w-full max-w-full sm:max-w-2xl mx-auto divide-y divide-gray-100 mb-8 px-0 sm:px-2">
          {MOCK_SPECS[SPEC_CATEGORIES[activeTab].key].map((spec: SpecItem) => (
            <li
              key={spec.label}
              className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 px-1 sm:px-2 md:px-6 transition-colors duration-200 hover:bg-blue-50 rounded-lg sm:rounded-xl group"
            >
              <span className="font-semibold text-gray-700 text-base sm:text-lg md:text-xl mb-1 sm:mb-0 group-hover:text-[#0099FF] transition-colors duration-200">
                {spec.label}
              </span>
              <span className="text-gray-900 text-base sm:text-lg md:text-xl font-medium group-hover:text-[#0099FF] transition-colors duration-200">
                {spec.value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón grande con feedback visual y animación */}
      <div className="flex flex-col items-center w-full mt-2 px-0 sm:px-0">
        <button
          type="button"
          className="w-full max-w-xs sm:max-w-md bg-[#0099FF] hover:bg-[#007ACC] active:scale-95 text-white font-bold py-3 sm:py-4 rounded-full shadow-lg text-base sm:text-lg lg:text-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2 mb-2"
          onClick={handleAddToCart}
          aria-label={`Añadir al carrito por ${displayPrice}`}
        >
          Añadir al carrito – {displayPrice}
        </button>
        <span className="text-xs text-gray-400 mt-1 text-center">
          Envío gratuito · Devolución gratuita en 30 días
        </span>
      </div>
    </section>
  );
};

export default Specifications;
