import React from "react";
import { Industry, ProductCategory } from "@/types/corporate-sales";
import {
  EducativoIcon,
  RetailIcon,
  FinancieroIcon,
  GobiernoIcon,
  HoteleroIcon,
} from "@/components/icons/IndustryIcons";

export const INDUSTRIES: Industry[] = [
  {
    id: "educativo",
    name: "Educativo",
    icon: <EducativoIcon />,
    description: "Soluciones tecnológicas para instituciones educativas",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    id: "retail",
    name: "Retail",
    icon: <RetailIcon />,
    description: "Tecnología para comercio y retail",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  {
    id: "financiero",
    name: "Financiero",
    icon: <FinancieroIcon />,
    description: "Soluciones para sector financiero y bancario",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    id: "gobierno",
    name: "Gobierno",
    icon: <GobiernoIcon />,
    description: "Tecnología para entidades gubernamentales",
    color: "text-blue-800",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    id: "hotelero",
    name: "Hotelero",
    icon: <HoteleroIcon />,
    description: "Soluciones para industria hotelera y turismo",
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "ofertas",
    name: "Ofertas",
    products: [
      {
        id: "galaxy-s25-ultra",
        name: "Galaxy S25 Ultra de 256 GB",
        description: "Entre más unidades compres mayor es tu Dto.",
        image: "/productos/galaxy-s25-ultra.jpg",
        category: "smartphones",
        features: [
          "256GB almacenamiento",
          "Cámara profesional",
          "S Pen incluido",
        ],
        price: "Consultar precio",
      },
    ],
  },
  {
    id: "productos-galaxy",
    name: "Productos Galaxy",
    products: [
      {
        id: "galaxy-a36-5g",
        name: "Galaxy A36 5G 256GB",
        description: "Aprovecha porque más unidades es más ahorro",
        image: "/productos/galaxy-a36.jpg",
        category: "smartphones",
        features: ["5G connectivity", "256GB storage", "Batería duradera"],
      },
    ],
  },
  {
    id: "audio-video",
    name: "Audio y video",
    products: [
      {
        id: "tv-crystal-4k",
        name: "Televisor Smart 50″ Crystal 4K U8200F",
        description: "Imperdible. Entre más compras, más ahorras",
        image: "/productos/tv-crystal-4k.jpg",
        category: "televisores",
        features: ["50 pulgadas", "4K Crystal", "Smart TV"],
      },
    ],
  },
  {
    id: "electrodomesticos",
    name: "Electrodomésticos",
    products: [
      {
        id: "nevera-congelador",
        name: "Nevera Congelador Superior 236 L",
        description: "Más descuento si llevas más unidades",
        image: "/productos/nevera-congelador.jpg",
        category: "electrodomesticos",
        features: [
          "236 litros",
          "Congelador superior",
          "Eficiencia energética",
        ],
      },
    ],
  },
  {
    id: "monitores",
    name: "Monitores",
    products: [
      {
        id: "pantalla-industrial-4k",
        name: "Pantalla Industrial UHD 4K QBC Crystal 43″",
        description: "Dto. por cantidad. Compra más y ahorra",
        image: "/productos/pantalla-industrial.jpg",
        category: "monitores",
        features: [
          "43 pulgadas",
          "4K UHD",
          "Uso industrial",
          "Crystal display",
        ],
      },
    ],
  },
];
