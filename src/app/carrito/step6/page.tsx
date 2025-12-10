"use client";
import Step6 from "../Step6";
import { useRouter } from "next/navigation";

export default function Step6Page() {
  const router = useRouter();

  const handleBack = () => {
    // Leer el método de pago desde localStorage
    const paymentMethod = localStorage.getItem("checkout-payment-method");

    // Si es addi o pse, volver a step4
    if (paymentMethod === "addi" || paymentMethod === "pse") {
      router.push("/carrito/step4");
      return;
    }

    // Si es tarjeta, verificar si es débito o crédito
    if (paymentMethod === "tarjeta") {
      const savedCardId = localStorage.getItem("checkout-saved-card-id");

      if (savedCardId) {
        // Verificar tipo de tarjeta
        const cardsData = localStorage.getItem("checkout-cards-cache");
        if (cardsData) {
          try {
            const cards = JSON.parse(cardsData);
            const selectedCard = cards.find((c: { id: string }) => String(c.id) === savedCardId);

            if (selectedCard?.tipo_tarjeta) {
              // Si es débito, volver a Step4 (se saltó Step5)
              if (selectedCard.tipo_tarjeta.toLowerCase().includes("debit")) {
                console.log("💳 [Step6] Tarjeta de débito - Volver a Step4");
                router.push("/carrito/step4");
                return;
              }
            }
          } catch (error) {
            console.error("Error parsing cards data:", error);
          }
        }
      }

      // Para tarjetas de crédito o cuando no se puede determinar, volver a Step5
      console.log("💳 [Step6] Tarjeta de crédito - Volver a Step5");
      router.push("/carrito/step5");
    } else {
      // Fallback: volver a step4
      router.push("/carrito/step4");
    }
  };

  const handleNext = () => router.push("/carrito/step7");
  return <Step6 onBack={handleBack} onContinue={handleNext} />;
}
