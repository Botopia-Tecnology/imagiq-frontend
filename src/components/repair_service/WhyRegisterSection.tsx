"use client";

import { Wrench, BookOpen, ShieldCheck, Gift } from "lucide-react";

export default function WhyRegisterSection() {
  const benefits = [
    {
      icon: Wrench,
      title: "Soporte de reparaciones",
      description: "Acceso prioritario a servicios técnicos especializados"
    },
    {
      icon: BookOpen,
      title: "Manuales de usuario y consejos sobre productos",
      description: "Documentación completa y guías de uso personalizadas"
    },
    {
      icon: ShieldCheck,
      title: "Comprueba tu garantía",
      description: "Verificación inmediata del estado de cobertura"
    },
    {
      icon: Gift,
      title: "Productos recomendados para ti",
      description: "Sugerencias personalizadas basadas en tus dispositivos"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          ¿Por qué debo registrar mis productos?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <benefit.icon className="h-16 w-16 text-gray-800" strokeWidth={1} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
