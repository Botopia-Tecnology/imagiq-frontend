"use client";
import Step7 from "../Step7";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Step7Page() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Protección: Solo permitir acceso si hay usuario logueado
  useEffect(() => {
    const token = localStorage.getItem("imagiq_token");
    const userInfo = localStorage.getItem("imagiq_user");

    if (!token && !userInfo) {
      console.warn("⚠️ [STEP7] Acceso denegado: No hay sesión activa. Redirigiendo a step2...");
      router.push("/carrito/step2");
      return;
    }

    setIsChecking(false);
  }, [router]);

  const handleBack = () => {
    // Leer el método de pago desde localStorage para determinar a dónde volver
    const paymentMethod = localStorage.getItem("checkout-payment-method");

    // Si es addi o pse, volver a step6 (se saltó step5)
    if (paymentMethod === "addi" || paymentMethod === "pse") {
      router.push("/carrito/step6");
      return;
    }

    // Si es tarjeta, verificar si es débito para saber si se saltó step5
    if (paymentMethod === "tarjeta") {
      const savedCardId = localStorage.getItem("checkout-saved-card-id");
      if (savedCardId) {
        const cardsData = localStorage.getItem("checkout-cards-cache");
        if (cardsData) {
          try {
            const cards = JSON.parse(cardsData);
            const selectedCard = cards.find((c: { id: string }) => String(c.id) === savedCardId);
            if (selectedCard?.tipo_tarjeta?.toLowerCase().includes("debit")) {
              // Tarjeta de débito - volver a step6
              router.push("/carrito/step6");
              return;
            }
          } catch (error) {
            console.error("Error parsing cards data:", error);
          }
        }
      }
    }

    // Default: volver a step6
    router.push("/carrito/step6");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return <Step7 onBack={handleBack} />;
}
