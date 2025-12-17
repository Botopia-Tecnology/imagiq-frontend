"use client";
import Step3 from "../Step3";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useSecureStorage from "@/hooks/useSecureStorage";
import { User } from "@/types/user";

export default function Step3Page() {
  const router = useRouter();
  const [loggedUser] = useSecureStorage<User | null>("imagiq_user", null);
  const [isChecking, setIsChecking] = useState(true);
  const checkExecuted = useRef(false);

  // Protección: Solo permitir acceso si hay usuario logueado (invitado o regular con token)
  useEffect(() => {
    // Prevenir múltiples ejecuciones
    if (checkExecuted.current) {
      return;
    }

    const performCheck = () => {
      checkExecuted.current = true;

      const token = localStorage.getItem("imagiq_token");
      
      // Intentar obtener usuario desde localStorage directamente (más confiable)
      let userToCheck = null;
      try {
        const userInfo = localStorage.getItem("imagiq_user");
        if (userInfo) {
          userToCheck = JSON.parse(userInfo);
        }
      } catch {
        userToCheck = null;
      }
      
      console.log("🔍 [STEP3] Verificando acceso:", { 
        hasToken: !!token, 
        hasUser: !!userToCheck,
        userRol: userToCheck ? ((userToCheck as User & { rol?: number }).rol ?? (userToCheck as User).role) : null,
        userEmail: userToCheck?.email
      });

      // CASO 1: Usuario autenticado con token (rol 2 o rol 3) - SIEMPRE permitir acceso
      // Step3 es para TODOS los usuarios autenticados, pueden agregar/seleccionar dirección aquí
      if (token && userToCheck) {
        const userRole = (userToCheck as User & { rol?: number }).rol ?? (userToCheck as User).role;
        console.log(`✅ [STEP3] Usuario autenticado (rol ${userRole}) con token, permitiendo acceso`);
        setIsChecking(false);
        return;
      }

      // CASO 2: Usuario invitado sin token pero CON dirección agregada en step2
      // Permitir acceso si hay checkout-address (ya completó step2)
      // IMPORTANTE: También verificar imagiq_default_address como fallback
      let savedAddress = localStorage.getItem("checkout-address");
      
      // Si no hay checkout-address, intentar usar imagiq_default_address
      if (!savedAddress || savedAddress === "null" || savedAddress === "undefined") {
        console.log("⚠️ [STEP3] No hay checkout-address, intentando con imagiq_default_address...");
        const defaultAddress = localStorage.getItem("imagiq_default_address");
        if (defaultAddress && defaultAddress !== "null" && defaultAddress !== "undefined") {
          // Copiar imagiq_default_address a checkout-address
          localStorage.setItem("checkout-address", defaultAddress);
          savedAddress = defaultAddress;
          console.log("✅ [STEP3] imagiq_default_address copiado a checkout-address");
        }
      }
      
      if (savedAddress && savedAddress !== "null" && savedAddress !== "undefined") {
        try {
          const address = JSON.parse(savedAddress);
          // Validar que tenga los campos mínimos (ciudad y linea_uno)
          if (address && address.ciudad && address.linea_uno) {
            console.log("✅ [STEP3] Usuario invitado con dirección válida en checkout-address, permitiendo acceso");
            console.log("📍 Dirección:", { ciudad: address.ciudad, linea_uno: address.linea_uno });
            setIsChecking(false);
            return;
          } else {
            console.warn("⚠️ [STEP3] checkout-address existe pero no tiene campos válidos:", address);
          }
        } catch (err) {
          console.error("❌ [STEP3] Error al parsear checkout-address:", err);
        }
      } else {
        console.log("⚠️ [STEP3] No hay checkout-address válido");
      }

      // CASO 3: Sin sesión activa Y sin dirección - redirigir a step2
      console.warn("⚠️ [STEP3] No hay sesión activa ni dirección. Redirigiendo a step2...");
      router.push("/carrito/step2");
    };

    performCheck();
  }, [router]);

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
