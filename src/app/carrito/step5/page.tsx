"use client";
import { useRouter } from "next/navigation";
import Step5 from "../Step5";

export default function Step5Page() {
  const router = useRouter();

  const handleBack = () => router.push("/carrito/step4");

  const handleNext = () => {
    // Step5 ahora es método de pago
    // CRÍTICO: Si es tarjeta de débito, saltar Step6 (cuotas) e ir directo a Step7
    // Las cuotas solo aplican para tarjetas de crédito

    const savedCardId = localStorage.getItem("checkout-saved-card-id");

    if (savedCardId) {
      const cardsData = localStorage.getItem("checkout-cards-cache");
      if (cardsData) {
        try {
          const cards = JSON.parse(cardsData);
          const selectedCard = cards.find((c: { id: string }) => String(c.id) === savedCardId);

          if (selectedCard?.tipo_tarjeta) {
            if (selectedCard.tipo_tarjeta.toLowerCase().includes("debit")) {
              console.log("💳 [Step5] Tarjeta de débito detectada - Saltando Step6 (cuotas)");
              router.push("/carrito/step7");
              return;
            }
          }
        } catch (error) {
          console.error("Error parsing cards data:", error);
        }
      }
    }

    // Para tarjetas de crédito o cuando no se puede determinar, ir a Step6
    console.log("💳 [Step5] Tarjeta de crédito o tipo desconocido - Ir a Step6 (cuotas)");
    router.push("/carrito/step6");
  };

  return <Step5 onBack={handleBack} onContinue={handleNext} />;
}
