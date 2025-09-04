"use client";

import Link from "next/link";
import Image from "next/image";
import servicio1 from "@/img/costo-reparacion/servicio1.png";
import servicio2 from "@/img/costo-reparacion/servicio2.png";

export default function ServiceRequest() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* Título centrado y simple */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Solicita el servicio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Programa tu reparación de manera fácil y rápida
          </p>
        </div>

        {/* Dos imágenes principales - diseño simple y elegante */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Imagen 1: Dispositivo móvil */}
          <div className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]">
              <div className="aspect-[4/3] relative">
                <Image
                  src={servicio1}
                  alt="Reparación de dispositivo móvil Samsung"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                {/* Overlay más oscuro y siempre visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Contenido sobre la imagen */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">Dispositivo Móvil</h3>
                  <p className="text-sm mb-4 drop-shadow-md">
                    Reserva tu servicio en nuestros centros técnicos autorizados
                  </p>
                  <Link 
                    href="/soporte/reservar-reparar"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium text-sm shadow-lg"
                  >
                    Reservar cita
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Imagen 2: Servicio en casa */}
          <div className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]">
              <div className="aspect-[4/3] relative">
                <Image
                  src={servicio2}
                  alt="Servicio técnico Samsung en casa"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                {/* Overlay más oscuro y siempre visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Contenido sobre la imagen */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">Servicio en Casa</h3>
                  <p className="text-sm mb-4 drop-shadow-md">
                    Obtén asistencia técnica Samsung desde la comodidad de tu hogar
                  </p>
                  <Link 
                    href="/soporte/servicio-casa"
                    className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors font-medium text-sm shadow-lg"
                  >
                    Solicitar visita
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
