"use client";

import Image from "next/image";
import Link from "next/link";

const serviceCards = [
  {
    title: "Repara la pantalla",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122200/xBoton1_klimyt.webp",
    description: "Repara la pantalla de tu Galaxy sin marco metálico con hasta 30% de descuento, sin costos de envío.",
    href: "#",
  },
  {
    title: "Quédate en casa",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122196/xBoton2_yfn0if.webp",
    description: "Quédate en casa, Samsung está contigo. Vamos por tu Galaxy y llevamos tu equipo reparado hasta la puerta de tu casa.",
    href: "#",
  },
];

export function ServiceRequestSection() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black text-center mb-12">
          Solicita el servicio
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {serviceCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group relative overflow-hidden rounded-3xl bg-white"
            >
              <div className="relative w-full h-[400px] overflow-hidden rounded-t-3xl">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6 pt-8">
                <p className="text-base md:text-lg text-black">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

