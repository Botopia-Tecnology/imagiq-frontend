"use client";

import Link from "next/link";
import { ChevronRight, Star, Gift, Shield, Users } from "lucide-react";

export default function SamsungMembers() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido izquierdo */}
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">Samsung Members</h2>
            <p className="text-xl mb-8 opacity-90">
              Descarga nuestra App, para descubrir nuestras herramientas
              de diagnóstico y realizar todas las consultas en nuestros expertos.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-300" />
                <span>Diagnósticos gratuitos</span>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-yellow-300" />
                <span>Ofertas exclusivas</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-yellow-300" />
                <span>Soporte prioritario</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-yellow-300" />
                <span>Comunidad de expertos</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link 
                href="/samsung-members"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                Descargar App
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/soporte/diagnostico"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Diagnóstico gratuito
              </Link>
            </div>
          </div>

          {/* Imagen/Mockup derecho */}
          <div className="lg:text-right">
            <div className="relative">
              {/* Phone mockup */}
              <div className="inline-block bg-white rounded-3xl p-2 shadow-2xl">
                <div className="w-64 h-96 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl relative overflow-hidden">
                  {/* Screen content */}
                  <div className="p-6 text-white">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold">Samsung Members</h3>
                      <p className="text-sm opacity-80">Tu centro de soporte</p>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="h-4 w-4" />
                          <span className="font-medium">Diagnóstico</span>
                        </div>
                        <p className="text-xs opacity-80">Verifica el estado de tu dispositivo</p>
                      </div>
                      
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Gift className="h-4 w-4" />
                          <span className="font-medium">Ofertas</span>
                        </div>
                        <p className="text-xs opacity-80">Descuentos exclusivos para miembros</p>
                      </div>
                      
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">Soporte</span>
                        </div>
                        <p className="text-xs opacity-80">Chat directo con expertos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-16 grid md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div className="text-3xl font-bold mb-2">5M+</div>
            <div className="text-sm opacity-80">Usuarios activos</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-sm opacity-80">Soporte disponible</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-sm opacity-80">Satisfacción del cliente</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">150+</div>
            <div className="text-sm opacity-80">Centros de servicio</div>
          </div>
        </div>
      </div>
    </section>
  );
}
