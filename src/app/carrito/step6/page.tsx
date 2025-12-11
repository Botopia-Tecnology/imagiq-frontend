"use client";
import Step6 from "../Step6";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Step6Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si el método de pago es tarjeta
  useEffect(() => {
    const paymentMethod = localStorage.getItem("checkout-payment-method");

    // Si no es pago con tarjeta, saltar este paso
    if (paymentMethod !== "tarjeta") {
      router.push("/carrito/step7");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleBack = () => router.push("/carrito/step5");
  const handleNext = () => router.push("/carrito/step7");

  if (isLoading) {
    return null;
  }

  return <Step6 onBack={handleBack} onContinue={handleNext} />;
}
