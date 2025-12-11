"use client";
import Step4 from "../Step4";
import { useRouter } from "next/navigation";

export default function Step4Page() {
  const router = useRouter();
  const handleBack = () => router.push("/carrito/step3");

  const handleNext = () => {
    // CRÍTICO: Si es tarjeta de débito, saltar Step5 (cuotas) e ir directo a Step6 (facturación)
    // Las cuotas solo aplican para tarjetas de crédito

    // Verificar si hay una tarjeta guardada seleccionada
    const savedCardId = localStorage.getItem("checkout-saved-card-id");

    if (savedCardId) {
      // Si hay tarjeta guardada, verificar su tipo
      const cardsData = localStorage.getItem("checkout-cards-cache");
      if (cardsData) {
        try {
          const cards = JSON.parse(cardsData);
          const selectedCard = cards.find((c: { id: string }) => String(c.id) === savedCardId);

          if (selectedCard?.tipo_tarjeta) {
            // Si es débito, saltar a Step6
            if (selectedCard.tipo_tarjeta.toLowerCase().includes("debit")) {
              console.log("💳 [Step4] Tarjeta de débito detectada - Saltando Step5 (cuotas)");
              router.push("/carrito/step6");
              return;
            }
          }
        } catch (error) {
          console.error("Error parsing cards data:", error);
        }
      }
    }

    // Para tarjetas de crédito o cuando no se puede determinar, ir a Step5
    console.log("💳 [Step4] Tarjeta de crédito o tipo desconocido - Ir a Step5 (cuotas)");
    router.push("/carrito/step5");
  };

  return <Step4 onBack={handleBack} onContinue={handleNext} />;
}
