"use client";
import Step7 from "../Step7";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";

export default function Step7Page() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [loggedUser] = useSecureStorage<User | null>("imagiq_user", null);

  // Protección: Solo permitir acceso si hay usuario logueado (invitado o regular con token)
  useEffect(() => {
    if (!isChecking) return; // Ya se verificó, no volver a verificar

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

    console.log("🔍 [STEP7] Verificando acceso:", {
      hasToken: !!token,
      hasUser: !!userToCheck,
      userRol: userToCheck ? ((userToCheck as User & { rol?: number }).rol ?? (userToCheck as User).role) : null
    });

    // CASO 1: Usuario autenticado con token (rol 2 o rol 3) - SIEMPRE permitir acceso
    if (token && userToCheck) {
      const userRole = (userToCheck as User & { rol?: number }).rol ?? (userToCheck as User).role;
      console.log(`✅ [STEP7] Usuario autenticado (rol ${userRole}) con token, permitiendo acceso`);
      setIsChecking(false);
      return;
    }

    // CASO 2: Usuario invitado sin token pero CON dirección agregada
    const savedAddress = localStorage.getItem("checkout-address");
    if (savedAddress && savedAddress !== "null" && savedAddress !== "undefined") {
      try {
        const address = JSON.parse(savedAddress);
        // Validar que tenga los campos mínimos
        if (address && address.ciudad && address.linea_uno) {
          console.log("✅ [STEP7] Usuario invitado con dirección válida, permitiendo acceso");
          setIsChecking(false);
          return;
        }
      } catch (err) {
        console.error("❌ [STEP7] Error al parsear dirección:", err);
      }
    }

    // CASO 3: Sin sesión activa ni dirección - redirigir
    console.warn("⚠️ [STEP7] Acceso denegado: No hay sesión activa ni dirección. Redirigiendo a step2...");
    router.push("/carrito/step2");
  }, [router, loggedUser, isChecking]);

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
