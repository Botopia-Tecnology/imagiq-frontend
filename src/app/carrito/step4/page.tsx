"use client";
import Step4 from "../Step4";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";

export default function Step4Page() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [loggedUser] = useSecureStorage<User | null>("imagiq_user", null);

  // Protección: Solo permitir acceso si hay usuario logueado (invitado o regular con token)
  useEffect(() => {
    if (!isChecking) return; // Ya se verificó, no volver a verificar

    const token = localStorage.getItem("imagiq_token");
    
    // Si hay token, permitir acceso (usuario regular logueado)
    if (token) {
      console.log("✅ [STEP4] Token encontrado, permitiendo acceso");
      setIsChecking(false);
      return;
    }

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
    // Verificar tanto 'rol' (backend) como 'role' (frontend) para compatibilidad
    const userRole = (userToCheck as any)?.rol ?? (userToCheck as any)?.role;
    if (userToCheck && userRole === 3) {
      const savedAddress = localStorage.getItem("checkout-address");
      if (savedAddress) {
        try {
          const address = JSON.parse(savedAddress);
          if (address && address.id) {
            console.log("✅ [STEP4] Usuario invitado con dirección, permitiendo acceso");
            setIsChecking(false);
            return;
          }
        } catch (err) {
          console.error("❌ [STEP4] Error al parsear dirección:", err);
        }
      }
    }

    // Si no hay token ni usuario invitado con dirección, redirigir
    console.warn("⚠️ [STEP4] Acceso denegado: No hay sesión activa. Redirigiendo a step2...");
    router.push("/carrito/step2");
  }, [router, loggedUser, isChecking]);

  const handleBack = () => router.push("/carrito/step3");

  const handleNext = () => {
    // CRÍTICO: Si es tarjeta de débito, saltar Step5 (cuotas) e ir directo a Step6 (facturación)
    // Las cuotas solo aplican para tarjetas de crédito

    // Verificar si hay una tarjeta guardada seleccionada
    const savedCardId = localStorage.getItem("checkout-saved-card-id");

    if (savedCardId) {
      // Si hay tarjeta guardada, verificar su tipo
      const cardsData = localStorage.getItem("checkout-cards-cache");
      if (cardsData) {
        try {
          const cards = JSON.parse(cardsData);
          const selectedCard = cards.find((c: { id: string }) => String(c.id) === savedCardId);

          if (selectedCard?.tipo_tarjeta) {
            // Si es débito, saltar a Step6
            if (selectedCard.tipo_tarjeta.toLowerCase().includes("debit")) {
              console.log("💳 [Step4] Tarjeta de débito detectada - Saltando Step5 (cuotas)");
              router.push("/carrito/step6");
              return;
            }
          }
        } catch (error) {
          console.error("Error parsing cards data:", error);
        }
      }
    }

    // Para tarjetas de crédito o cuando no se puede determinar, ir a Step5
    console.log("💳 [Step4] Tarjeta de crédito o tipo desconocido - Ir a Step5 (cuotas)");
    router.push("/carrito/step5");
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

  return <Step4 onBack={handleBack} onContinue={handleNext} />;
}
