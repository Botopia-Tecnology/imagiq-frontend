"use client";

import Link from "next/link";
import type { FC } from "react";

type Props = {
  onClose: () => void;
};

export const MobileMenuPromo: FC<Props> = ({ onClose }) => (
  <div className="sticky top-[73px] bg-black text-white p-4 text-center z-10">
    <h2 className="text-base font-bold mb-1">¡Comenzó el festival de descuentos!</h2>
    <p className="text-sm mb-3">Hasta 50% de descuento en tu producto favorito</p>
    <Link
      href="/ofertas"
      onClick={onClose}
      className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100"
    >
      Ver Ofertas
    </Link>
  </div>
);
