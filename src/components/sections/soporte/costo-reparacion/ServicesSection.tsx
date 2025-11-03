"use client";

import Image from "next/image";

const services = [
  {
    name: "Servicio remoto",
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122631/icon_remoto_1_v5yncm.jpg",
  },
  {
    name: "Chat en vivo",
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122396/icon_chat_kjdffp.jpg",
  },
  {
    name: "#726 Samsung",
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122680/icon_telefono_hbzfcj.jpg",
  },
  {
    name: "Servicio a domicilio",
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122716/icon_domicilio_orkfa4.jpg",
  },
  {
    name: "Samsung Members",
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122383/icon_members_klzwia.jpg",
  },
  {
    name: "Centro de servicio",
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122369/icon_servicios_hhfkvk.jpg",
  },
  {
    name: "Servicio de recolección",
    icon: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762122356/icon_recoleccion_mwjz9d.jpg",
  },
];

export function ServicesSection() {
  return (
    <div className="bg-white pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black text-center mb-12">
          Descubre nuestros servicios
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 mb-2 relative">
                <Image
                  src={service.icon}
                  alt={service.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs md:text-sm text-black font-normal">
                {service.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

