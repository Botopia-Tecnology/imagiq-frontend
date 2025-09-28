"use client";

import React, { useState } from "react";
import {
  IndustrySelector,
  ProductShowcase,
  ContactForm,
} from "@/components/sections/ventas-corporativas";
import { Industry, ContactFormData } from "@/types/corporate-sales";

export default function VentasCorporativasPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(industry);
  };

  const handleFormSubmit = async (formData: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Aquí iría la lógica para enviar el formulario
      console.log("Formulario enviado:", {
        ...formData,
        selectedIndustry: selectedIndustry?.id,
      });

      // Simular delay de envío
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mostrar mensaje de éxito (aquí podrías usar un toast o modal)
      alert(
        "¡Formulario enviado exitosamente! Nos pondremos en contacto contigo pronto."
      );
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert(
        "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Industry Selection Section */}
      <IndustrySelector
        onIndustrySelect={handleIndustrySelect}
        selectedIndustry={selectedIndustry?.id}
      />

      {/* Product Showcase Section */}
      <ProductShowcase selectedIndustry={selectedIndustry?.id} />

      {/* Contact Form Section */}
      <ContactForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />
    </main>
  );
}
