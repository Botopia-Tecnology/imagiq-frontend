"use client";

import React, { useState } from "react";
import SpecializedConsultationModal from "./SpecializedConsultationModal";
import { SpecializedConsultationFormData } from "@/types/corporate-sales";
import { SalesIcon, SupportIcon } from "@/components/icons/IndustryIcons";

export default function SalesConsultationSection() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (
    data: SpecializedConsultationFormData
  ): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Aquí iría la lógica para enviar el formulario
      console.log("Consulta especializada:", data);

      // Simular delay de envío
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Cerrar modal y mostrar éxito
      setIsModalOpen(false);
      alert("¡Consulta enviada exitosamente! Te contactaremos pronto.");
    } catch (error) {
      console.error("Error al enviar consulta:", error);
      alert(
        "Hubo un error al enviar la consulta. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Sales Consultation */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <SalesIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Consultas de ventas
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Ponte en contacto con nuestro equipo de ventas para conocer las
          mejores opciones para tu negocio.
        </p>
        <button
          onClick={handleOpenModal}
          className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full transition-colors"
        >
          Contáctanos
        </button>
      </div>

      {/* Technical Support */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <SupportIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Soporte técnico</h3>
        </div>
        <p className="text-gray-600 mb-6">
          ¿Necesitas ayuda? Ponte en contacto con nuestros expertos para obtener
          asistencia técnica y soporte específicos para cada producto.
        </p>
        <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full transition-colors flex items-center space-x-2">
          <span>Solicitar asistencia</span>
          <span>→</span>
        </button>
      </div>

      {/* Modal */}
      <SpecializedConsultationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
