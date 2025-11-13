"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Step5 from "../Step5";

export default function Step5Page() {
  const router = useRouter();

  // Verificar si el método de pago es tarjeta
  useEffect(() => {
    const paymentMethod = localStorage.getItem("checkout-payment-method");

    // Si no es pago con tarjeta, saltar este paso
    if (paymentMethod !== "tarjeta") {
      router.push("/carrito/step6");
    }
  }, [router]);

  const handleBack = () => router.push("/carrito/step4");
  const handleNext = () => router.push("/carrito/step6");

  return <Step5 onBack={handleBack} onContinue={handleNext} />;
}
