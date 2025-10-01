/**
 * 📞 CONTACT SECTION - COMPARTIDO
 * Componente genérico de contacto reutilizable para todas las industrias
 */

"use client";

import React from "react";

interface ContactSectionProps {
  onContactClick: () => void;
  title: string;
  description: string;
  buttonText?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  buttonTextColor?: string;
}

export default function ContactSection({
  onContactClick,
  title,
  description,
  buttonText = "Contáctanos",
  gradientFrom = "from-purple-600",
  gradientVia = "via-purple-600",
  gradientTo = "to-blue-600",
  buttonTextColor = "text-purple-600",
}: ContactSectionProps) {
  return (
    <section
      className={`relative py-20 md:py-32 overflow-hidden`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo}`}
      ></div>

      <div className="relative container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 leading-relaxed">
          {description}
        </p>
        <button
          onClick={onContactClick}
          className={`inline-flex items-center px-8 md:px-10 py-4 bg-white ${buttonTextColor} font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl text-base md:text-lg`}
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}
