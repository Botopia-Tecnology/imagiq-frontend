"use client";

import { Wrench, BookOpen, Shield, Gift } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Wrench,
      title: "Soporte de reparaciones",
      description: "Acceso prioritario a servicios de reparación con técnicos certificados Samsung"
    },
    {
      icon: BookOpen,
      title: "Manuales de usuario y consejos sobre productos",
      description: "Acceso completo a documentación técnica y guías de uso para tu dispositivo"
    },
    {
      icon: Shield,
      title: "Comproba tu garantía",
      description: "Verificación instantánea del estado de garantía y cobertura de tu producto"
    },
    {
      icon: Gift,
      title: "Productos recomendados para ti",
      description: "Sugerencias personalizadas de productos y accesorios compatibles"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué debo registrar mis productos?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            El registro de tu producto Samsung te brinda acceso a servicios exclusivos, 
            soporte personalizado y una experiencia mejorada con tu dispositivo.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="bg-blue-50 p-6 rounded-2xl mb-4 group-hover:bg-blue-100 transition-colors">
                <benefit.icon className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              ¡Registra tu producto ahora!
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Únete a millones de usuarios que ya disfrutan de los beneficios exclusivos 
              del programa Samsung Members.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Comenzar Registro
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
