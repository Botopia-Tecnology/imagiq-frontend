"use client";

import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";

type SubMenuItem = {
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

type SubMenuLink = {
  title: string;
  href: string;
};

const ELECTRODOMESTICOS_ITEMS: SubMenuItem[] = [
  {
    name: "Neveras",
    href: "/productos/electrodomesticos?seccion=neveras",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773410/neveras_es7cui.webp",
    imageAlt: "Neveras",
  },
  {
    name: "Hornos",
    href: "/productos/electrodomesticos?seccion=hornos",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773406/hornos_rsgzpx.webp",
    imageAlt: "Hornos",
  },
  {
    name: "Hornos Microondas",
    href: "/productos/electrodomesticos?seccion=hornos-microondas",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773406/horno_microondas_askklu.webp",
    imageAlt: "Hornos Microondas",
  },
  {
    name: "Lavavajillas",
    href: "/productos/electrodomesticos?seccion=lavavajillas",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773409/lavavajillas_t1yvwa.webp",
    imageAlt: "Lavavajillas",
  },
  {
    name: "Cocinas",
    href: "/productos/electrodomesticos?seccion=cocinas",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773405/cocinas_cs0svj.webp",
    imageAlt: "Cocinas",
  },
  {
    name: "Lavadoras y Secadoras",
    href: "/productos/electrodomesticos?seccion=lavadoras-secadoras",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773409/lavadoras_y_secadoras_nn5seu.webp",
    imageAlt: "Lavadoras y Secadoras",
  },
  {
    name: "Aspiradoras",
    href: "/productos/electrodomesticos?seccion=aspiradoras",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773412/aspiradoras_rpk655.webp",
    imageAlt: "Aspiradoras",
  },
  {
    name: "Aires acondicionados",
    href: "/productos/electrodomesticos?seccion=aires-acondicionados",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773392/aires_acondicionados_pcm4pp.avif",
    imageAlt: "Aires acondicionados",
  },
  {
    name: "Accesorios",
    href: "/productos/electrodomesticos?seccion=accesorios",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773402/accesorios_electrodomesticos_kenfgx.webp",
    imageAlt: "Accesorios para electrodomésticos",
  },
];

const ELECTRODOMESTICOS_LINKS: SubMenuLink[] = [
  { title: "Bespoke AI", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773393/bespoke_ai_hulakk.webp" },
  { title: "Bespoke AI Smartthings", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773393/bespoke-ai-smartthings_v1lymp.webp" },
  { title: "Ahorro de energía con AI", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773402/ahorro-energia-ai_abghns.webp" },
  { title: "¿Por qué Electrodomésticos Samsung?", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773402/porque_elec_samsung_ftamj9.webp" },
  { title: "Guía de compra de neveras", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773405/guia_neveras_aickik.webp" },
  { title: "Guía de compra de lavadoras: Tamaño", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773394/guia_lavadoras_dijdpu.avif" },
  { title: "Pantallas Smart", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773412/pantallas_smart_y9mvb1.webp" },
];

type Props = {
  onClose: () => void;
};

export const ElectrodomesticosSubmenu: FC<Props> = ({ onClose }) => {
  const column1 = ELECTRODOMESTICOS_ITEMS.slice(0, 5);
  const column2 = ELECTRODOMESTICOS_ITEMS.slice(5, 9);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-x-8 mb-6">
        <div className="space-y-3">
          {column1.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <div className="w-12 h-12 flex-shrink-0 relative">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-gray-900 whitespace-pre-line leading-tight" style={{ fontWeight: 900 }}>
                {item.name}
              </p>
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          {column2.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <div className="w-12 h-12 flex-shrink-0 relative">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-gray-900 whitespace-pre-line leading-tight" style={{ fontWeight: 900 }}>
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4 mt-2">
        <nav className="space-y-1">
          {ELECTRODOMESTICOS_LINKS.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              onClick={onClose}
              className="block py-2 text-sm text-gray-900 hover:text-blue-600"
              style={{ fontWeight: 900 }}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
