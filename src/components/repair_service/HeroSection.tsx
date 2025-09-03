"use client";

import { Wrench, Phone, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-[400px] bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <Wrench className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            Servicio Técnico Samsung
          </h1>
          
          <p className="text-xl mb-8 text-blue-100">
            Reserva tu cita para reparar tu dispositivo Samsung con técnicos certificados
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              Reservar Cita
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat en Vivo
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
    </section>
  );
}
