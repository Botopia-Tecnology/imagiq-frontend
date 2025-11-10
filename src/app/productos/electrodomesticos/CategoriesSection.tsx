"use client";

import Image from "next/image";
import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";
import { useAnalytics } from "@/lib/analytics/hooks/useAnalytics";
import refrigeradorImg from "../../../img/electrodomesticos/electrodomesticos1.png";
import lavadoraImg from "../../../img/electrodomesticos/electrodomesticos2.png";
import aspiradoraImg from "../../../img/electrodomesticos/electrodomesticos3.png";
import microondasImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import aireImg from "../../../img/electrodomesticos/electrodomesticos4.png";

const categories = [
  {
    id: "refrigeradores",
    title: "Refrigeradores",
    image: refrigeradorImg,
    href: "/productos/electrodomesticos?seccion=refrigeradores",
  },
  {
    id: "lavadoras",
    title: "Lavadoras",
    image: lavadoraImg,
    href: "/productos/electrodomesticos?seccion=lavadoras",
  },
  {
    id: "microondas",
    title: "Microondas",
    image: microondasImg,
    href: "/productos/electrodomesticos?seccion=microondas",
  },
  {
    id: "aspiradoras",
    title: "Aspiradoras",
    image: aspiradoraImg,
    href: "/productos/electrodomesticos?seccion=aspiradoras",
  },
  {
    id: "aire-acondicionado",
    title: "Aire Acondicionado",
    image: aireImg,
    href: "/productos/electrodomesticos?seccion=aire-acondicionado",
  },
];

export default function CategoriesSection() {
  const { trackCategoryClick } = useAnalytics();

  const handleCategoryClick = (cat: (typeof categories)[0]) => {
    // 🔥 Track Category Click Event para GA4
    trackCategoryClick(cat.id, cat.title);

    posthogUtils.capture("category_click", { category: cat.title });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Electrodomésticos Samsung
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 text-center"
            onClick={() => handleCategoryClick(cat)}
          >
            <div className="flex justify-center mb-4">
              <Image
                src={cat.image}
                alt={cat.title}
                width={180}
                height={180}
                className="object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {cat.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
