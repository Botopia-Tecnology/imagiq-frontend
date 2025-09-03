"use client";

import Link from "next/link";

export default function ProductRegistrationSection() {
  return (
    <section className="py-16 bg-gray-50 min-h-[400px]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Registro de productos
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          El registro con un clic está disponible para productos no registrados. Si tu producto no está en la lista, registra manualmente el producto.
        </p>
        
        <Link href="/soporte/reservar-reparar/registro">
          <button className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
            Registrar
          </button>
        </Link>
      </div>
    </section>
  );
}
