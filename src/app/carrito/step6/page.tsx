"use client";
import Step6 from "../Step6";
import { useRouter } from "next/navigation";

export default function Step6Page() {
  const router = useRouter();

  const handleBack = () => {
    // Leer el método de pago desde localStorage
    const paymentMethod = localStorage.getItem("checkout-payment-method");

    // Si es addi o pse, volver a step4; si es tarjeta, volver a step5
    if (paymentMethod === "addi" || paymentMethod === "pse") {
      router.push("/carrito/step4");
    } else {
      router.push("/carrito/step5");
    }
  };

  const handleNext = () => router.push("/carrito/step7");
  return <Step6 onBack={handleBack} onContinue={handleNext} />;
}
