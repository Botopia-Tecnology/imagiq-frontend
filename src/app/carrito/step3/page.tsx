"use client";
import Step3 from "../Step3";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";

export default function Step3Page() {
  const router = useRouter();
  const [loggedUser] = useSecureStorage<User | null>("imagiq_user", null);
  const [isChecking, setIsChecking] = useState(true);

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
    
    console.log("🔍 [STEP3] Verificando acceso:", { 
      hasToken: !!token, 
      hasUser: !!userToCheck,
      userRol: userToCheck?.rol,
      userEmail: userToCheck?.email
    });

    // Si hay token, permitir acceso (usuario regular logueado)
    if (token) {
      console.log("✅ [STEP3] Token encontrado, permitiendo acceso");
      setIsChecking(false);
      return;
    }

    // Si hay usuario, verificar si es invitado
    if (userToCheck) {
      // Si es usuario invitado (rol 3), verificar que tenga dirección guardada
      if (userToCheck.rol === 3) {
        const savedAddress = localStorage.getItem("checkout-address");
        if (savedAddress) {
          try {
            const address = JSON.parse(savedAddress);
            if (address && address.id) {
              console.log("✅ [STEP3] Usuario invitado con dirección, permitiendo acceso", {
                addressId: address.id,
                userId: userToCheck.id || userToCheck.email
              });
              setIsChecking(false);
              return;
            }
          } catch (err) {
            console.error("❌ [STEP3] Error al parsear dirección:", err);
          }
        }
        console.warn("⚠️ [STEP3] Usuario invitado sin dirección. Redirigiendo a step2...");
        router.push("/carrito/step2");
        return;
      }
      
      // Si no es invitado y no tiene token, redirigir
      console.warn("⚠️ [STEP3] Usuario sin token y no es invitado. Redirigiendo a step2...");
      router.push("/carrito/step2");
      return;
    }

    // Si no hay token ni usuario, redirigir a step2
    console.warn("⚠️ [STEP3] No hay sesión activa. Redirigiendo a step2...");
    router.push("/carrito/step2");
  }, [router, loggedUser, isChecking]);

  const handleBack = () => router.push("/carrito/step1");
  const handleNext = () => router.push("/carrito/step4");

  // Mostrar loading mientras verifica
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

  return <Step3 onBack={handleBack} onContinue={handleNext} />;
}
