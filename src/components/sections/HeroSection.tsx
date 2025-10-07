/**
 * 🦸 hero SECTION - IMAGIQ ECOMMERCE
 */

"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

// hero slides data matching Samsung style
const heroSlides = [
  {
    id: 1,
    title: "",
    subtitle: "",
    description: "",
    price: "",
    originalPrice: "",
    offerText: "",
    buttonText: "Descubre más",
    gifSrc: "https://images.samsung.com/is/image/samsung/assets/co/home/HOME_TS11_Hero-KV_1920x1080_pc_1.jpg?$1920_N_JPG$",
    gifSrcMobile: "https://images.samsung.com/is/image/samsung/assets/co/home/HOME_TS11_Hero-KV_720x1248_mo.jpg?$720_N_JPG$",
    bgColor: "#000000",
    isFullImage: true,
  },
];

export default function HeroSection() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const currentSlideData = heroSlides[0]; // Solo hay un slide ahora

  // Producto actual mostrado en el hero
  const productoActual = {
    sku: `SKU${currentSlideData.id}`,
    name: currentSlideData.title,
    quantity: "1",
    unitPrice: currentSlideData.price.replace(/[^\d]/g, ""), // Solo números
  };

  // Handler para el botón
  const handleAddiPayment = async () => {
    try {
      const token = localStorage.getItem("imagiq_token");
      if (!token) {
        alert("No se encontró el token");
        return;
      }
      // Body con el producto actual
      const body = {
        totalAmount: productoActual.unitPrice,
        shippingAmount: "0",
        currency: "COP",
        item: [productoActual],
        userInfo: {
          email: "aristizabalsantiago482@gmail.com",
          nombre: "Santiago",
          apellido: "Aristizabal",
          direccion_linea_uno: "Calle 123 #45-67",
          direccion_ciudad: "Bogotá",
          direccion_pais: "CO",
          numero_documento: "1001812664",
          tipo_documento: "CC",
        },
      };
      const response = await fetch(
        "https://imagiq-backend-production.up.railway.app/api/payments/addi/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("No se recibió la URL de redirección");
      }
    } catch (error) {
      alert("Hubo un error al procesar el pago");
      console.error(error);
    }
  };

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center mt-[-34%] md:mt-[-17%] md:pt-64 overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{
        zIndex: 1,
        backgroundColor: currentSlideData.bgColor
      }}
      data-hero="true"
    >
      {/* Imagen de fondo para slides con isFullImage */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {/* Desktop image */}
        <Image
          src={currentSlideData.gifSrc}
          alt={currentSlideData.title || "Banner"}
          fill
          className="object-cover hidden md:block transition-opacity duration-1000 ease-in-out"
          sizes="100vw"
          priority
        />
        {/* Mobile image */}
        {currentSlideData.gifSrcMobile && (
          <Image
            src={currentSlideData.gifSrcMobile}
            alt={currentSlideData.title || "Banner"}
            fill
            className="object-contain md:hidden transition-opacity duration-1000 ease-in-out"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-1000 ease-in-out" />
      </div>
      {/* MOBILE: layout vertical, centrado, sin margen derecho, igual a la imagen */}
      <div className="md:hidden w-full flex flex-col items-center justify-center py-12 px-4 transition-opacity duration-1000 ease-in-out">
        {/* Botón para fullImage en mobile */}
        <button className="bg-white hover:bg-gray-100 text-black px-7 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-xl w-full max-w-xs mb-2">
          {currentSlideData.buttonText}
        </button>
      </div>
      {/* DESKTOP: layout horizontal original restaurado */}
      <div className="hidden md:flex relative z-10 w-full max-w-6xl mx-auto flex-row items-center justify-center py-8">
        {/* Layout para fullImage: solo botón */}
        <div className="w-full flex items-start justify-start pl-12 pt-20">
          <button
            className="bg-white hover:bg-gray-100 text-black px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            {currentSlideData.buttonText}
          </button>
        </div>
      </div>
      {/* Navegación y logo Samsung */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center">
        {/* Logo Samsung */}
        <div className="flex items-center justify-center">
          <img
            src="/img/Samsung_black.svg"
            alt="Samsung"
            width={110}
            height={32}
            className="h-7 w-auto opacity-80"
            style={{ filter: isHome ? "invert(1) brightness(2)" : "none" }}
          />
        </div>
      </div>
    </section>
  );
}
