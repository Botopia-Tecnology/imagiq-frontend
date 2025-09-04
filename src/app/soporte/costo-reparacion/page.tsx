"use client";

import HeroSection from "../../../components/cost_per_repair/HeroSection";
import PriceCalculator from "../../../components/cost_per_repair/PriceCalculator";
import ServiceRequest from "../../../components/cost_per_repair/ServiceRequest";
import ServiceIcons from "../../../components/cost_per_repair/ServiceIcons";
import SamsungMembers from "../../../components/cost_per_repair/SamsungMembers";

export default function CostoReparacionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

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
