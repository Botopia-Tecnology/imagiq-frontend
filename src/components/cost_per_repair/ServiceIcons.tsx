"use client";

import { 
  Phone, 
  MessageSquare, 
  Headphones, 
  Home, 
  Download, 
  Calendar,
  Shield
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Phone,
    title: "Servicio Telefónico",
    description: "Consultas por teléfono",
    href: "/soporte/telefono"
  },
  {
    icon: MessageSquare,
    title: "Chat en línea",
    description: "Soporte en línea 24/7",
    href: "/soporte/chat"
  },
  {
    icon: Headphones,
    title: "Foro Samsung",
    description: "Comunidad de usuarios",
    href: "/soporte/foro"
  },
  {
    icon: Home,
    title: "Servicio a domicilio",
    description: "Técnico en tu hogar",
    href: "/soporte/domicilio"
  },
  {
    icon: Download,
    title: "Descargas Móviles",
    description: "Apps y software",
    href: "/soporte/descargas"
  },
  {
    icon: Calendar,
    title: "Centro de Servicios",
    description: "Encuentra centros cercanos",
    href: "/soporte/centros"
  },
  {
    icon: Shield,
    title: "Servicio Prioritario",
    description: "Atención preferencial",
    href: "/soporte/prioritario"
  }
];

export default function ServiceIcons() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Descubre nuestros servicios
          </h2>
          <p className="text-gray-600">
            Múltiples formas de obtener el soporte que necesitas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="group flex flex-col items-center p-6 bg-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-500 text-center leading-tight">
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
