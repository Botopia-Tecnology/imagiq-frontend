"use client";

import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    title: "Renueva Contigo",
    subtitle: "Tu producto Samsung es nuevo otra vez",
    image: "/soporte/renueva-contigo.jpg",
    href: "#",
    size: "large", // ocupa 2 columnas
  },
  {
    title: "Localizar un Centro de Servicio Autorizado",
    image: "/soporte/centro-servicio.jpg",
    href: "#",
    size: "small",
  },
  {
    title: "Información sobre la garantía",
    image: "/soporte/garantia.jpg",
    href: "#",
    size: "small",
  },
  {
    title: "Soluciones para pequeñas y medianas empresas",
    image: "/soporte/soluciones-empresas.jpg",
    href: "#",
    size: "small",
  },
  {
    title: "¿Cómo transferir la información a mi nuevo celular?",
    image: "/soporte/transferir-info.jpg",
    href: "#",
    size: "small",
  },
];

export function InfoCardsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            href={card.href}
            className={`group relative overflow-hidden rounded-3xl ${
              card.size === "large" ? "lg:col-span-2 lg:row-span-2" : ""
            }`}
          >
            <div className="relative h-64 lg:h-full min-h-[300px] overflow-hidden">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col items-center justify-center">
                <h3 className={`font-bold mb-2 text-center ${card.size === 'large' ? 'text-lg' : 'text-base'}`}>
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="text-xs mb-3 text-center">{card.subtitle}</p>
                )}

                {/* Button - slides in from bottom on hover */}
                <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300">
                  <button className="bg-black text-white hover:bg-white hover:text-black px-5 py-2 rounded-full font-medium text-xs translate-y-10 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
                    Más información
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
