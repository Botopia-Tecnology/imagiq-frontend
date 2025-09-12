// Mock global de productos para desarrollo
import smartphonesImg from "@/img/categorias/Smartphones.png";
import { ProductColor } from "./ProductCard";
import refrigeradorImg from "../../../img/electrodomesticos/electrodomesticos1.png";

export const productsMock = [
  {
    id: "galaxy-a16",
    name: "Samsung Galaxy A16",
    image: smartphonesImg,
    colors: [
      { name: "navy", hex: "#1E3A8A", label: "Azul Marino" },
      { name: "black", hex: "#000000", label: "Negro" },
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
    ],
    price: "$ 812.900",
    originalPrice: "$ 999.000",
    discount: "-19%",
    description: "Smartphone gama media con gran batería y cámara avanzada.",
    specs: [
      { label: "Pantalla", value: '6.5" FHD+' },
      { label: "Procesador", value: "Exynos" },
      { label: "RAM", value: "4GB" },
      { label: "Almacenamiento", value: "128GB" },
    ],
  },
  {
    id: "galaxy-a25",
    name: "Samsung Galaxy A25",
    image: smartphonesImg,
    colors: [
      { name: "navy", hex: "#1E3A8A", label: "Azul Marino" },
      { name: "black", hex: "#000000", label: "Negro" },
      { name: "silver", hex: "#C0C0C0", label: "Plateado" },
    ],
    price: "$ 1.250.000",
    description: "Smartphone con pantalla AMOLED y cámara triple.",
    specs: [
      { label: "Pantalla", value: '6.6" AMOLED' },
      { label: "Procesador", value: "Snapdragon" },
      { label: "RAM", value: "6GB" },
      { label: "Almacenamiento", value: "128GB" },
    ],
  },
  {
    id: "galaxy-a26",
    name: "Samsung Galaxy A26",
    image: smartphonesImg,
    colors: [
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
      { name: "black", hex: "#000000", label: "Negro" },
      { name: "mint", hex: "#10B981", label: "Menta" },
    ],
    price: "$ 1.450.000",
    originalPrice: "$ 1.600.000",
    discount: "-9%",
    description: "Smartphone con diseño moderno y batería de larga duración.",
    specs: [
      { label: "Pantalla", value: '6.7" FHD+' },
      { label: "Procesador", value: "MediaTek" },
      { label: "RAM", value: "8GB" },
      { label: "Almacenamiento", value: "256GB" },
    ],
  },
  {
    id: "galaxy-a15-256gb",
    name: "Samsung Galaxy A15 256 GB",
    image: smartphonesImg,
    colors: [
      { name: "white", hex: "#FFFFFF", label: "Blanco" },
      { name: "black", hex: "#000000", label: "Negro" },
    ],
    price: "$ 999.000",
    description: "Smartphone con gran almacenamiento y rendimiento.",
    specs: [
      { label: "Pantalla", value: '6.5" FHD+' },
      { label: "Procesador", value: "Exynos" },
      { label: "RAM", value: "4GB" },
      { label: "Almacenamiento", value: "256GB" },
    ],
  },
  {
    id: "galaxy-a15-4gb",
    name: "Samsung Galaxy A15 4GB 128GB",
    image: smartphonesImg,
    colors: [
      { name: "yellow", hex: "#FCD34D", label: "Amarillo" },
      { name: "black", hex: "#000000", label: "Negro" },
    ],
    price: "$ 750.000",
    isNew: true,
    description: "Smartphone económico con buen rendimiento.",
    specs: [
      { label: "Pantalla", value: '6.5" FHD+' },
      { label: "Procesador", value: "Exynos" },
      { label: "RAM", value: "4GB" },
      { label: "Almacenamiento", value: "128GB" },
    ],
  },
  {
    id: "galaxy-a15-128gb",
    name: "Samsung Galaxy A15 4GB 128GB",
    image: smartphonesImg,
    colors: [
      { name: "blue", hex: "#3B82F6", label: "Azul" },
      { name: "black", hex: "#000000", label: "Negro" },
    ],
    price: "$ 799.000",
    description: "Smartphone compacto y eficiente.",
    specs: [
      { label: "Pantalla", value: '6.5" FHD+' },
      { label: "Procesador", value: "Exynos" },
      { label: "RAM", value: "4GB" },
      { label: "Almacenamiento", value: "128GB" },
    ],
  },
      {
      id: "rf28r7351sr",
      name: "Samsung Refrigerador French Door 27.4 pies RF28R7351SR",
      image: refrigeradorImg,
      colors: [
        { name: "steel", hex: "#71717A", label: "Acero Inoxidable" },
      ] as ProductColor[],
      rating: 4.8,
      reviewCount: 452,
      price: "$ 4.499.000",
      originalPrice: "$ 4.999.000",
      discount: "-10%",
      isNew: true,
    },
];
