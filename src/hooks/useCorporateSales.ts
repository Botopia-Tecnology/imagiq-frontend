"use client";

import { useState, useCallback } from "react";
import { Industry, ContactFormData } from "@/types/corporate-sales";

interface UseCorporateSalesState {
  selectedIndustry: Industry | null;
  isFormSubmitting: boolean;
  formSubmissionStatus: "idle" | "success" | "error";
}

interface UseCorporateSalesActions {
  setSelectedIndustry: (industry: Industry) => void;
  submitContactForm: (formData: ContactFormData) => Promise<void>;
  resetFormStatus: () => void;
}

type UseCorporateSalesReturn = UseCorporateSalesState &
  UseCorporateSalesActions;

export function useCorporateSales(): UseCorporateSalesReturn {
  const [selectedIndustry, setSelectedIndustryState] =
    useState<Industry | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formSubmissionStatus, setFormSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const setSelectedIndustry = useCallback((industry: Industry) => {
    setSelectedIndustryState(industry);
  }, []);

  const submitContactForm = useCallback(
    async (formData: ContactFormData) => {
      setIsFormSubmitting(true);
      setFormSubmissionStatus("idle");

      try {
        // Aquí iría la llamada real a la API
        const requestData = {
          ...formData,
          industry: selectedIndustry?.id,
          timestamp: new Date().toISOString(),
        };

        // Simular llamada a API
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simular 90% de éxito
            if (Math.random() > 0.1) {
              resolve(requestData);
            } else {
              reject(new Error("Error simulado de red"));
            }
          }, 2000);
        });

        setFormSubmissionStatus("success");
      } catch (error) {
        console.error("Error al enviar formulario:", error);
        setFormSubmissionStatus("error");
        throw error;
      } finally {
        setIsFormSubmitting(false);
      }
    },
    [selectedIndustry]
  );

  const resetFormStatus = useCallback(() => {
    setFormSubmissionStatus("idle");
  }, []);

  return {
    selectedIndustry,
    isFormSubmitting,
    formSubmissionStatus,
    setSelectedIndustry,
    submitContactForm,
    resetFormStatus,
  };
}
