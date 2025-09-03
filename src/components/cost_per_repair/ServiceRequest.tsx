"use client";

import Link from "next/link";

export default function ServiceRequest() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Solicita el servicio
          </h2>
          <p className="text-gray-600">
            Programa tu reparación de manera fácil y rápida
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Opción 1: Reserva tu servicio */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-semibold">Dispositivo Móvil</h3>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Reserva tu servicio de Samsung en 
                nuestros centros técnicos Samsung este 
                el de piezas de cambio de móvil.
              </h4>
              <Link 
                href="/soporte/reservar-reparar"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reservar cita
              </Link>
            </div>
          </div>

          {/* Opción 2: Soporte en casa */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-semibold">Servicio en Casa</h3>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Obtén un rata Samsung para soporte,
                brinda asistencia técnica de Samsung 
                centro desde casa garantía de la vida.
              </h4>
              <Link 
                href="/soporte/servicio-casa"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Solicitar visita
              </Link>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Técnicos Certificados</h4>
              <p className="text-sm text-gray-600">Personal capacitado y certificado por Samsung</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Repuestos Originales</h4>
              <p className="text-sm text-gray-600">Solo utilizamos partes y componentes originales Samsung</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Garantía Extendida</h4>
              <p className="text-sm text-gray-600">Todas las reparaciones incluyen garantía de hasta 6 meses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
