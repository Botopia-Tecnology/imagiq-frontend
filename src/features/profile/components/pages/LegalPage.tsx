/**
 * @module LegalPage
 * @description Temporary stub for Legal/Terms page - to be completed later
 */

import React from "react";
import PageHeader from "../layouts/PageHeader";

interface LegalPageProps {
  onBack?: () => void;
  className?: string;
  documentType?: "terms" | "privacy" | "data-processing" | "relevant-info";
}

const LegalPage: React.FC<LegalPageProps> = ({ onBack, className, documentType = "terms" }) => {
  // Map document type to title and content
  const documentConfig = {
    terms: {
      title: "Términos y Condiciones",
      subtitle: "Última actualización: Enero 2025",
    },
    privacy: {
      title: "Política de Privacidad",
      subtitle: "Última actualización: Enero 2025",
    },
    "data-processing": {
      title: "Autorización para Tratamiento de Datos",
      subtitle: "Última actualización: Enero 2025",
    },
    "relevant-info": {
      title: "Información Relevante",
      subtitle: "Última actualización: Enero 2025",
    },
  };

  const config = documentConfig[documentType];
  return (
    <div className={`min-h-screen bg-white ${className ?? ""}`}>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        onBack={onBack}
      />

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">{config.title} - Borrador</h2>
        <p className="text-gray-700 mb-4">
          Este es un contenido de prueba temporal para la página legal. Aquí
          añadiremos el contenido real en una siguiente iteración.
        </p>

        <section className="mb-6">
          <h3 className="font-bold mb-2">Información (Borrador)</h3>
          <p className="text-gray-600">
            Información de ejemplo: en esta sección se detallará el contenido específico
            para este tipo de documento legal.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2">Contacto</h3>
          <p className="text-gray-600">
            Para consultas legales, contactar a legal@example.com (mock).
          </p>
        </section>
      </div>
    </div>
  );
};

LegalPage.displayName = "LegalPage";

export default LegalPage;
