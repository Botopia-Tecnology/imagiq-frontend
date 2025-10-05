"use client";

/**
 * Página de demostración para comparar:
 * - ProductCard (diseño actual)
 * - ProductCardNew (diseño estilo Samsung Colombia)
 */

import ProductCard from "../components/ProductCard";
import ProductCardNew from "../components/ProductCardNew";
import { ProductColor } from "../components/ProductCard";

// Datos de ejemplo para las cards
const exampleColors: ProductColor[] = [
  {
    name: "black",
    hex: "#000000",
    label: "Negro Medianoche",
    sku: "SM-S921BZKALTA",
    price: "$4.299.900",
    originalPrice: "$4.799.900",
    discount: "-10%",
  },
  {
    name: "purple",
    hex: "#A77BCA",
    label: "Violeta Cobalto",
    sku: "SM-S921BZVALTA",
    price: "$4.299.900",
    originalPrice: "$4.799.900",
    discount: "-10%",
  },
  {
    name: "gray",
    hex: "#5A5A5A",
    label: "Gris Mármol",
    sku: "SM-S921BZAALTA",
    price: "$4.299.900",
    originalPrice: "$4.799.900",
    discount: "-10%",
  },
  {
    name: "yellow",
    hex: "#FFE58F",
    label: "Amarillo Ámbar",
    sku: "SM-S921BZYALTA",
    price: "$4.299.900",
    originalPrice: "$4.799.900",
    discount: "-10%",
  },
];

export default function DemoCardsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Comparación de Diseños de Product Card
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Diseño actual vs. Diseño inspirado en Samsung Colombia
        </p>

        {/* Diseño Actual */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Diseño Actual
            </h2>
            <p className="text-gray-600">
              Card actual del proyecto con layout horizontal en mobile
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard
              id="s24-ultra-demo"
              name="Samsung Galaxy S24 Ultra 256GB 5G"
              image="https://images.samsung.com/co/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg"
              colors={exampleColors}
              price="$4.299.900"
              originalPrice="$4.799.900"
              discount="-10%"
              isNew={true}
              sku="SM-S921BZKALTA"
              puntos_q={4}
            />
          </div>
        </section>

        {/* Nuevo Diseño */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nuevo Diseño - Estilo Samsung Colombia
            </h2>
            <p className="text-gray-600 mb-4">
              Estructura siguiendo el patrón de Samsung Colombia:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Título en la parte superior</li>
              <li>Imagen del producto centrada</li>
              <li>Selector de colores con características</li>
              <li>Información de financiamiento con Addi</li>
              <li>Precio original tachado + ahorro + precio final</li>
              <li>Aviso de términos y condiciones</li>
              <li>
                Dos CTAs: "Comprar ahora" (principal) y "Más información"
                (secundario)
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCardNew
              id="s24-ultra-demo-new"
              name="Samsung Galaxy S24 Ultra 256GB 5G"
              image="https://images.samsung.com/co/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg"
              colors={exampleColors}
              price="$4.299.900"
              originalPrice="$4.799.900"
              discount="-10%"
              isNew={true}
              sku="SM-S921BZKALTA"
              puntos_q={4}
              addiMonthlyPayment="$358.325"
              addiMonths={12}
              features={["256GB", "5G", "Pantalla 6.8\""]}
            />

            <ProductCardNew
              id="s24-demo-new"
              name="Samsung Galaxy S24 128GB 5G"
              image="https://images.samsung.com/co/smartphones/galaxy-s24/images/galaxy-s24-highlights-color-onyx-black-back-mo.jpg"
              colors={exampleColors.slice(0, 3)}
              price="$3.199.900"
              originalPrice="$3.599.900"
              discount="-11%"
              sku="SM-S921BZKALTA"
              puntos_q={3}
              addiMonthlyPayment="$266.658"
              addiMonths={12}
              features={["128GB", "5G", "IA Avanzada"]}
            />

            <ProductCardNew
              id="a54-demo-new"
              name="Samsung Galaxy A54 5G 128GB"
              image="https://images.samsung.com/co/smartphones/galaxy-a54-5g/images/galaxy-a54-5g-highlights-color-awesome-graphite-back-mo.jpg"
              colors={[
                { ...exampleColors[0], price: "$1.299.900" },
                { ...exampleColors[2], price: "$1.299.900" },
              ]}
              price="$1.299.900"
              originalPrice="$1.699.900"
              discount="-24%"
              sku="SM-A546BZKACOO"
              puntos_q={1}
              addiMonthlyPayment="$108.325"
              addiMonths={12}
              features={["128GB", "5G", "Cámara 50MP"]}
            />

            <ProductCardNew
              id="zflip5-demo-new"
              name="Samsung Galaxy Z Flip5 256GB 5G"
              image="https://images.samsung.com/co/smartphones/galaxy-z-flip5/images/galaxy-z-flip5-highlights-color-mint-back-mo.jpg"
              colors={[
                exampleColors[0],
                { ...exampleColors[1], label: "Menta" },
                exampleColors[2],
              ]}
              price="$3.999.900"
              originalPrice="$4.599.900"
              discount="-13%"
              isNew={true}
              sku="SM-F731BLGALTA"
              puntos_q={4}
              addiMonthlyPayment="$333.325"
              addiMonths={12}
              features={["256GB", "Plegable", "Pantalla Flex"]}
            />
          </div>
        </section>

        {/* Comparison Notes */}
        <section className="mt-16 bg-white rounded-lg p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Principales Diferencias
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Diseño Actual
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc ml-5">
                <li>Layout horizontal en mobile</li>
                <li>Botón favorito en esquina superior</li>
                <li>Selector de colores simple</li>
                <li>Un solo CTA: "Añadir al carrito"</li>
                <li>Precio con descuento badge</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Nuevo Diseño
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc ml-5">
                <li>Layout vertical consistente</li>
                <li>Estructura jerárquica clara (título → imagen → datos)</li>
                <li>Información de financiamiento destacada</li>
                <li>Dos CTAs: principal y secundario</li>
                <li>Mayor énfasis en ahorro y beneficios</li>
                <li>Características del producto visibles</li>
                <li>Aviso de T&C integrado</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
