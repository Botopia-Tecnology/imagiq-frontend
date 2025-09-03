"use client";

import Image from "next/image";
import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";
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
    href: "/productos/Electrodomesticos?section=refrigeradores",
  },
  {
    id: "lavadoras",
    title: "Lavadoras",
    image: lavadoraImg,
    href: "/productos/Electrodomesticos?section=lavadoras",
  },
  {
    id: "microondas",
    title: "Microondas",
    image: microondasImg,
    href: "/productos/Electrodomesticos?section=microondas",
  },
  {
    id: "aspiradoras",
    title: "Aspiradoras",
    image: aspiradoraImg,
    href: "/productos/Electrodomesticos?section=aspiradoras",
  },
  {
    id: "aire-acondicionado",
    title: "Aire Acondicionado",
    image: aireImg,
    href: "/productos/Electrodomesticos?section=aire-acondicionado",
  },
];

export default function CategoriesSection() {
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
            onClick={() =>
              posthogUtils.capture("category_click", { category: cat.title })
            }
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
