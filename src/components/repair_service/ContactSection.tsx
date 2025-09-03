"use client";

import { Phone, MessageCircle, Mail, Clock, MapPin, Headphones } from "lucide-react";

export default function ContactSection() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Línea de Atención",
      description: "Llámanos las 24 horas, los 7 días de la semana",
      contact: "01 8000 112 112",
      action: "Llamar ahora",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Chat en Vivo",
      description: "Chatea con nuestros especialistas en tiempo real",
      contact: "Disponible 24/7",
      action: "Iniciar chat",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Mail,
      title: "Correo Electrónico",
      description: "Escríbenos y te responderemos en 24 horas",
      contact: "soporte@samsung.com",
      action: "Enviar email",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Headphones,
      title: "Samsung Members",
      description: "Soporte exclusivo a través de la app",
      contact: "Descarga gratis",
      action: "Abrir app",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Contacto y Soporte
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contacta nuestro equipo de soporte especializado 
            a través del canal que prefieras.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-2xl ${method.bgColor} w-16 h-16 flex items-center justify-center mb-4`}>
                <method.icon className={`h-8 w-8 ${method.iconColor}`} />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3">
                {method.description}
              </p>
              
              <div className="text-sm font-medium text-gray-900 mb-4">
                {method.contact}
              </div>
              
              <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                index === 0 ? "bg-blue-600 text-white hover:bg-blue-700" :
                index === 1 ? "bg-green-600 text-white hover:bg-green-700" :
                index === 2 ? "bg-purple-600 text-white hover:bg-purple-700" :
                "bg-orange-600 text-white hover:bg-orange-700"
              }`}>
                {method.action}
              </button>
            </div>
          ))}
        </div>

        {/* Business Hours */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Horarios de Atención
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Línea telefónica:</span>
                  <span className="font-medium text-gray-900">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chat en vivo:</span>
                  <span className="font-medium text-gray-900">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Centros de servicio:</span>
                  <span className="font-medium text-gray-900">Lun - Sáb: 8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">Respuesta en 24h</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Cobertura Nacional
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Centros autorizados:</span>
                  <span className="font-medium text-gray-900">50+ ubicaciones</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Servicio a domicilio:</span>
                  <span className="font-medium text-gray-900">Principales ciudades</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiempo de respuesta:</span>
                  <span className="font-medium text-gray-900">Inmediato</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            ¿Necesitas asistencia urgente?
          </h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Para emergencias relacionadas con dispositivos Samsung o problemas críticos 
            que afecten la seguridad, contáctanos inmediatamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              Línea de Emergencia
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
              Reportar Problema Crítico
            </button>
          </div>
        </div>

        {/* Social Media & Resources */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Síguenos para tips, noticias y soporte
          </h3>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
