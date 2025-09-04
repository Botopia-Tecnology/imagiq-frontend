"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, Gift, Shield, Users } from "lucide-react";
import celularImage from "@/img/costo-reparacion/celular.png";

export default function SamsungMembers() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600">
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
                className="bg-white text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
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

          {/* Imagen real de Samsung Members */}
          <div className="lg:text-right">
            <div className="relative">
              <div className="inline-block transform hover:scale-105 transition-transform duration-300">
                <Image
                  src={celularImage}
                  alt="Samsung Members App en teléfono Galaxy"
                  width={500}
                  height={1000}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
