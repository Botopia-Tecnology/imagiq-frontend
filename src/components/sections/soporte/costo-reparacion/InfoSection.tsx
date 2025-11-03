"use client";

export function InfoSection() {
  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-4xl">
          <p className="text-sm md:text-base text-gray-700 mb-4">
            Precios sugeridos para servicios fuera de garantía. Los precios incluyen IVA*.
          </p>
          <p className="text-sm md:text-base text-gray-700 mb-4">
            Selecciona el modelo de tu smartphone y verifica el costo aproximado por cada tipo de reparación fuera de garantía en nuestros Centros de Servicio Autorizados.
          </p>
          <p className="text-sm md:text-base text-gray-700 mb-2">
            Consulta Términos y Condiciones en los siguientes apartados:
          </p>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm md:text-base">
              Reparación de Equipos Fuera de Garantía
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm md:text-base">
              Reparación de Display (Pantalla sin marco)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

