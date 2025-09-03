"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Phone, MessageCircle } from "lucide-react";
import HeroSection from "../../../components/cost_per_repair/HeroSection";
import PriceCalculator from "../../../components/cost_per_repair/PriceCalculator";
import ServiceRequest from "../../../components/cost_per_repair/ServiceRequest";
import ServiceIcons from "../../../components/cost_per_repair/ServiceIcons";
import SamsungMembers from "../../../components/cost_per_repair/SamsungMembers";

export default function CostoReparacionPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Sección Principal - Precios de reparación */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Precios de reparación
          </h1>
          <p className="text-gray-600 mb-8">
            Escribe el modelo de tu dispositivo y consulta los costos de reparación con Samsung
          </p>

          {/* Buscador */}
          <div className="relative max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Escribe tu consulta"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="text-left space-y-4 text-sm text-gray-600">
            <p>• Precios válidos para servicios técnicos de garantía, con precios vigentes hoy*</p>
            <p>• Servicios de reparación de smartphone - centro técnico autorizado con cada tipo de reparación tanto de garantía o fuera de Garantía</p>
            <p>• Garantía Terminal y Accesorios en los siguientes productos:</p>
            <p>• Autorizado del Grupo Ante de Garantía</p>
            <p>• Autorizado del Grupo Después de Garantía</p>
          </div>
        </div>
      </section>

      {/* Calculadora de precios */}
      <PriceCalculator />

      {/* Solicita el servicio */}
      <ServiceRequest />

      {/* Iconos de servicios */}
      <ServiceIcons />

      {/* Samsung Members */}
      <SamsungMembers />
    </div>
  );
}
