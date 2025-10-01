/**
 * 🪝 HOOK - INDUSTRY MODAL
 * Lógica compartida para manejar modales de contacto en páginas de industria
 */

"use client";

import { useState, useCallback } from "react";
import { SpecializedConsultationFormData } from "@/types/corporate-sales";

interface UseIndustryModalReturn {
  isModalOpen: boolean;
  isSubmitting: boolean;
  handleContactClick: () => void;
  handleModalClose: () => void;
  handleFormSubmit: (data: SpecializedConsultationFormData) => Promise<void>;
}

export function useIndustryModal(
  industryName?: string
): UseIndustryModalReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  }, [isSubmitting]);

  const handleFormSubmit = useCallback(
    async (data: SpecializedConsultationFormData) => {
      setIsSubmitting(true);

      try {
        console.log(
          `Formulario ${industryName || "corporativo"} enviado:`,
          data
        );

        // Simular delay de envío
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mostrar mensaje de éxito
        alert(
          "¡Gracias por tu interés! Nos pondremos en contacto contigo pronto."
        );

        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al enviar formulario:", error);
        alert(
          "Hubo un error al enviar el formulario. Por favor, intenta de nuevo."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [industryName]
  );

  return {
    isModalOpen,
    isSubmitting,
    handleContactClick,
    handleModalClose,
    handleFormSubmit,
  };
}
