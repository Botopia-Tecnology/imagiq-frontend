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
    imageSrc: "/CATEGORIAS/ELEC/neveras.webp",
    imageAlt: "Neveras",
  },
  {
    name: "Hornos",
    href: "/productos/electrodomesticos?seccion=hornos",
    imageSrc: "/CATEGORIAS/ELEC/hornos.webp",
    imageAlt: "Hornos",
  },
  {
    name: "Hornos Microondas",
    href: "/productos/electrodomesticos?seccion=hornos-microondas",
    imageSrc: "/CATEGORIAS/ELEC/horno_microondas.webp",
    imageAlt: "Hornos Microondas",
  },
  {
    name: "Lavavajillas",
    href: "/productos/electrodomesticos?seccion=lavavajillas",
    imageSrc: "/CATEGORIAS/ELEC/lavavajillas.webp",
    imageAlt: "Lavavajillas",
  },
  {
    name: "Cocinas",
    href: "/productos/electrodomesticos?seccion=cocinas",
    imageSrc: "/CATEGORIAS/ELEC/cocinas.webp",
    imageAlt: "Cocinas",
  },
  {
    name: "Lavadoras y Secadoras",
    href: "/productos/electrodomesticos?seccion=lavadoras-secadoras",
    imageSrc: "/CATEGORIAS/ELEC/lavadoras_y_secadoras.webp",
    imageAlt: "Lavadoras y Secadoras",
  },
  {
    name: "Aspiradoras",
    href: "/productos/electrodomesticos?seccion=aspiradoras",
    imageSrc: "/CATEGORIAS/ELEC/aspiradoras.webp",
    imageAlt: "Aspiradoras",
  },
  {
    name: "Aires acondicionados",
    href: "/productos/electrodomesticos?seccion=aires-acondicionados",
    imageSrc: "/CATEGORIAS/ELEC/aires_acondicionados.webp",
    imageAlt: "Aires acondicionados",
  },
  {
    name: "Accesorios",
    href: "/productos/electrodomesticos?seccion=accesorios",
    imageSrc: "/CATEGORIAS/ELEC/accesorios_electrodomesticos.webp",
    imageAlt: "Accesorios para electrodomésticos",
  },
];

const ELECTRODOMESTICOS_LINKS: SubMenuLink[] = [
  { title: "Bespoke AI", href: "/productos/electrodomesticos?seccion=bespoke-ai" },
  { title: "Bespoke AI Smartthings", href: "/productos/electrodomesticos?seccion=bespoke-ai-smartthings" },
  { title: "Ahorro de energía con AI", href: "/productos/electrodomesticos?seccion=ahorro-energia-ai" },
  { title: "¿Por qué Electrodomésticos Samsung?", href: "/productos/electrodomesticos?seccion=por-que-samsung" },
  { title: "Guía de compra de neveras", href: "/productos/electrodomesticos?seccion=guia-neveras" },
  { title: "Guía de compra de lavadoras: Tamaño", href: "/productos/electrodomesticos?seccion=guia-lavadoras" },
  { title: "Pantallas Smart", href: "/productos/electrodomesticos?seccion=pantallas-smart" },
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
