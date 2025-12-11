"use client";
import Step7 from "../Step7";
import { useRouter } from "next/navigation";

export default function Step7Page() {
  const router = useRouter();

  const handleBack = () => {
    // Leer el método de pago desde localStorage
    const paymentMethod = localStorage.getItem("checkout-payment-method");

    // Si es addi o pse, volver a step5 (método de pago)
    if (paymentMethod === "addi" || paymentMethod === "pse") {
      router.push("/carrito/step5");
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
              // Si es débito, volver a Step5 (se saltó Step6)
              if (selectedCard.tipo_tarjeta.toLowerCase().includes("debit")) {
                console.log("💳 [Step7] Tarjeta de débito - Volver a Step5");
                router.push("/carrito/step5");
                return;
              }
            }
          } catch (error) {
            console.error("Error parsing cards data:", error);
          }
        }
      }

      // Para tarjetas de crédito o cuando no se puede determinar, volver a Step6
      console.log("💳 [Step7] Tarjeta de crédito - Volver a Step6");
      router.push("/carrito/step6");
    } else {
      // Fallback: volver a step5
      router.push("/carrito/step5");
    }
  };

  return <Step7 onBack={handleBack} />;
}
