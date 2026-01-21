"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Step5 from "../Step5";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";

export default function Step5Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loggedUser] = useSecureStorage<User | null>("imagiq_user", null);

  // Protección: Solo permitir acceso si hay usuario logueado (invitado o regular con token)
  useEffect(() => {
    // Limpiar cuotas seleccionadas para que siempre inicie sin selección previa
    localStorage.removeItem("checkout-installments");

    if (!isLoading) return; // Ya se verificó, no volver a verificar

    const token = localStorage.getItem("imagiq_token");

    // Intentar obtener usuario desde el hook o localStorage directamente
    const userToCheck = loggedUser || (() => {
      try {
        const userInfo = localStorage.getItem("imagiq_user");
        return userInfo ? JSON.parse(userInfo) : null;
      } catch {
        return null;
      }
    })();

    console.log("🔍 [STEP5] Verificando acceso:", {
      hasToken: !!token,
      hasUser: !!userToCheck,
      userRol: userToCheck ? ((userToCheck as User & { rol?: number }).rol ?? (userToCheck as User).role) : null
    });

    // CASO 1: Usuario autenticado con token (rol 2 o rol 3) - SIEMPRE permitir acceso
    if (token && userToCheck) {
      const userRole = (userToCheck as User & { rol?: number }).rol ?? (userToCheck as User).role;
      console.log(`✅ [STEP5] Usuario autenticado (rol ${userRole}) con token, permitiendo acceso`);
      // Continuar para verificar si debe mostrar este step o saltar
    } else {
      // CASO 2: Usuario invitado sin token pero CON dirección agregada
      const savedAddress = localStorage.getItem("checkout-address");
      if (savedAddress && savedAddress !== "null" && savedAddress !== "undefined") {
        try {
          const address = JSON.parse(savedAddress);
          // Validar que tenga los campos mínimos
          if (address && address.ciudad && address.linea_uno) {
            console.log("✅ [STEP5] Usuario invitado con dirección válida, permitiendo acceso");
            // Continuar para verificar si debe mostrar este step o saltar
          } else {
            console.warn("⚠️ [STEP5] checkout-address existe pero no tiene campos válidos");
            router.push("/carrito/step2");
            return;
          }
        } catch (err) {
          console.error("❌ [STEP5] Error al parsear dirección:", err);
          router.push("/carrito/step2");
          return;
        }
      } else {
        // CASO 3: Sin sesión activa ni dirección - redirigir
        console.warn("⚠️ [STEP5] Acceso denegado: No hay sesión activa ni dirección. Redirigiendo a step2...");
        router.push("/carrito/step2");
        return;
      }
    }

    // Verificar si el método de pago es tarjeta
    const paymentMethod = localStorage.getItem("checkout-payment-method");
    console.log("🔍 [STEP5] Payment Method:", paymentMethod);

    // Si no es pago con tarjeta, saltar este paso
    if (paymentMethod !== "tarjeta") {
      console.log("⚠️ [STEP5] Payment method is NOT tarjeta, redirecting to Step6");
      router.push("/carrito/step6");
    } else {
      console.log("✅ [STEP5] Payment method IS tarjeta, staying in Step5");
      setIsLoading(false);
    }
  }, [router, loggedUser, isLoading]);

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
