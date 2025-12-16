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
    if (!isLoading) return; // Ya se verificó, no volver a verificar

    const token = localStorage.getItem("imagiq_token");
    
    // Si hay token, permitir acceso (usuario regular logueado)
    if (token) {
      console.log("✅ [STEP5] Token encontrado, permitiendo acceso");
    } else {
      // Intentar obtener usuario desde el hook o localStorage directamente
      const userToCheck = loggedUser || (() => {
        try {
          const userInfo = localStorage.getItem("imagiq_user");
          return userInfo ? JSON.parse(userInfo) : null;
        } catch {
          return null;
        }
      })();

      // Si hay usuario invitado (rol 3) con dirección, permitir acceso
      if (userToCheck && userToCheck.rol === 3) {
        const savedAddress = localStorage.getItem("checkout-address");
        if (savedAddress) {
          try {
            const address = JSON.parse(savedAddress);
            if (address && address.id) {
              console.log("✅ [STEP5] Usuario invitado con dirección, permitiendo acceso");
            } else {
              console.warn("⚠️ [STEP5] Acceso denegado: Usuario invitado sin dirección. Redirigiendo a step2...");
              router.push("/carrito/step2");
              return;
            }
          } catch (err) {
            console.error("❌ [STEP5] Error al parsear dirección:", err);
            router.push("/carrito/step2");
            return;
          }
        } else {
          console.warn("⚠️ [STEP5] Acceso denegado: Usuario invitado sin dirección. Redirigiendo a step2...");
          router.push("/carrito/step2");
          return;
        }
      } else {
        // Si no hay token ni usuario invitado con dirección, redirigir
        console.warn("⚠️ [STEP5] Acceso denegado: No hay sesión activa. Redirigiendo a step2...");
        router.push("/carrito/step2");
        return;
      }
    }

    // Verificar si el método de pago es tarjeta
    const paymentMethod = localStorage.getItem("checkout-payment-method");

    // Si no es pago con tarjeta, saltar este paso
    if (paymentMethod !== "tarjeta") {
      router.push("/carrito/step6");
    } else {
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
