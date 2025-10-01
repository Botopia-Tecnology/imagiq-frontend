import React from "react";
import { Industry } from "@/types/corporate-sales";
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
    href: "/ventas-corporativas/education",
  },
  {
    id: "retail",
    name: "Retail",
    icon: <RetailIcon />,
    description: "Tecnología para comercio y retail",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    href: "/ventas-corporativas/retail",
  },
  {
    id: "financiero",
    name: "Financiero",
    icon: <FinancieroIcon />,
    description: "Soluciones para sector financiero y bancario",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    href: "/ventas-corporativas/finance",
  },
  {
    id: "gobierno",
    name: "Gobierno",
    icon: <GobiernoIcon />,
    description: "Tecnología para entidades gubernamentales",
    color: "text-blue-800",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    href: "/ventas-corporativas/government",
  },
  {
    id: "hotelero",
    name: "Hotelero",
    icon: <HoteleroIcon />,
    description: "Soluciones para industria hotelera y turismo",
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    href: "/ventas-corporativas/hotels",
  },
];
