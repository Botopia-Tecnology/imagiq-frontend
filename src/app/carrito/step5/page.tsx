"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Step5 from "../Step5";

export default function Step5Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Protección: Solo permitir acceso si hay usuario logueado
  useEffect(() => {
    const token = localStorage.getItem("imagiq_token");
    const userInfo = localStorage.getItem("imagiq_user");

    if (!token && !userInfo) {
      console.warn("⚠️ [STEP5] Acceso denegado: No hay sesión activa. Redirigiendo a step2...");
      router.push("/carrito/step2");
      return;
    }

    // Verificar si el método de pago es tarjeta
    const paymentMethod = localStorage.getItem("checkout-payment-method");

    // Si no es pago con tarjeta, saltar este paso
    if (paymentMethod !== "tarjeta") {
      router.push("/carrito/step6");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleBack = () => router.push("/carrito/step4");
  const handleNext = () => router.push("/carrito/step6");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return <Step5 onBack={handleBack} onContinue={handleNext} />;
}
