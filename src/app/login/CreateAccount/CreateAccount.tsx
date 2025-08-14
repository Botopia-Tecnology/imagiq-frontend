/**
 * Componente de registro de usuario por pasos
 * Paso 1: Ingresar correo
 * Paso 2: Información básica
 * Paso 3: Definir contraseña
 * Conexión a microservicio de auth vía API Gateway
 * UX moderna, escalable y notificaciones limpias
 */

"use client";

import { useState } from "react";
import { notifyRegisterSuccess, notifyError } from "../notifications";
import { useRouter } from "next/navigation";

// API endpoint para registro (ajusta la URL según tu API Gateway)
const REGISTER_API_URL = "http://localhost:3001/api/auth/register";

interface RegisterStep1 {
  email: string;
}
interface RegisterStep2 {
  nombre: string;
}
interface RegisterStep3 {
  password: string;
}

export function CreateAccountForm() {
  // Estado para feedback visual
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states

  const [step1, setStep1] = useState<RegisterStep1>({ email: "" });
  const [step2, setStep2] = useState<RegisterStep2>({ nombre: "" });
  const [step3, setStep3] = useState<RegisterStep3>({ password: "" });

  // Validaciones

  const validateStep1 = () => {
    if (!step1.email.trim()) return "El correo es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email))
      return "Formato de correo inválido";
    return null;
  };
  const validateStep2 = () => {
    if (!step2.nombre.trim()) return "El nombre es requerido";
    return null;
  };
  const validateStep3 = () => {
    if (!step3.password.trim()) return "La contraseña es requerida";
    if (step3.password.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    return null;
  };

  // Manejo de pasos
  const handleNext = async () => {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        setModalContent({ type: "error", message: err });
        setShowModal(true);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setError(err);
        setModalContent({ type: "error", message: err });
        setShowModal(true);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) {
        setError(err);
        setModalContent({ type: "error", message: err });
        setShowModal(true);
        return;
      }
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        console.log("[Registro] Enviando datos al backend...");
        const response = await fetch(REGISTER_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: step1.email,
            nombre: step2.nombre,
            contrasena: step3.password,
            rol: "usuario",
          }),
        });
        console.log("[Registro] Respuesta recibida:", response);
        // Si la respuesta no es válida, mostrar error
        if (!response || typeof response.status !== "number") {
          const msg =
            "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
          setModalContent({ type: "error", message: msg });
          setShowModal(true);
          await notifyError(msg, "Registro fallido");
          setError(msg);
          setSuccess(null);
          setIsLoading(false);
          return;
        }
        if (!response.ok) {
          let errorMsg = "Error al registrar";
          try {
            const result = await response.json();
            console.log("[Registro] Error recibido del backend:", result);
            if (
              result.message &&
              result.message.toLowerCase().includes("correo") &&
              result.message.toLowerCase().includes("existe")
            ) {
              errorMsg = "Ya existe un usuario con ese correo electrónico.";
            } else {
              errorMsg = result.message || errorMsg;
            }
          } catch (jsonErr) {
            console.log("[Registro] Error al parsear JSON de error:", jsonErr);
          }
          setModalContent({ type: "error", message: errorMsg });
          setShowModal(true);
          await notifyError(errorMsg, "Registro fallido");
          setError(errorMsg);
          setSuccess(null);
          setIsLoading(false);
          return;
        }
        setSuccess("¡Cuenta creada exitosamente!");
        setError(null);
        setIsLoading(false);
        setModalContent({
          type: "success",
          message: `¡Cuenta creada exitosamente para ${step1.email}!`,
        });
        setShowModal(true);
        await notifyRegisterSuccess(step1.email);
        setTimeout(() => {
          router.push("/login");
        }, 500);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error de conexión";
        setModalContent({ type: "error", message: msg });
        setShowModal(true);
        console.log("[Registro] Error en catch:", err);
        await notifyError(msg, "Registro fallido");
        setError(msg);
        setSuccess(null);
        setIsLoading(false);
      }
    }
  };

  // UI de pasos
  return (
    <>
      {/* Título y login link */}
      <h2 className="text-center text-2xl font-semibold mb-2 text-gray-900">
        Crear una cuenta
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        ¿Ya tienes una cuenta?{" "}
        <button
          className="underline text-blue-700"
          type="button"
          onClick={() => router.push("/login")}
        >
          Inicia sesión
        </button>
      </p>
      {/* Stepper barra igual a la imagen */}
      <div className="flex flex-col items-center w-full mb-8">
        <div
          className="relative w-full flex flex-col items-center"
          style={{ maxWidth: "400px" }}
        >
          {/* Línea horizontal */}
          <div
            className="absolute top-4 left-0 right-0 h-[3px] bg-[#e5e5e5]"
            style={{ zIndex: 0 }}
          />
          <div
            className="flex w-full justify-between items-center relative"
            style={{ zIndex: 1 }}
          >
            {/* Paso 1 */}
            <div className="flex flex-col items-center flex-1">
              <button
                type="button"
                className={`rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm focus:outline-none transition-colors duration-150
                  ${
                    step === 1
                      ? "bg-[#222] text-white"
                      : "bg-[#e5e5e5] text-[#bdbdbd] hover:bg-[#d1d1d1]"
                  }
                `}
                disabled={step === 1}
                onClick={() => step > 1 && setStep(1)}
                aria-label="Ir al paso 1"
              >
                1
              </button>
            </div>
            {/* Paso 2 */}
            <div className="flex flex-col items-center flex-1">
              <button
                type="button"
                className={`rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm focus:outline-none transition-colors duration-150
                  ${
                    step === 2
                      ? "bg-[#222] text-white"
                      : "bg-[#e5e5e5] text-[#bdbdbd] hover:bg-[#d1d1d1]"
                  }
                `}
                disabled={step === 2 || step < 2}
                onClick={() => step > 2 && setStep(2)}
                aria-label="Ir al paso 2"
              >
                2
              </button>
            </div>
            {/* Paso 3 */}
            <div className="flex flex-col items-center flex-1">
              <button
                type="button"
                className={`rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm focus:outline-none transition-colors duration-150
                  ${
                    step === 3
                      ? "bg-[#222] text-white"
                      : "bg-[#e5e5e5] text-[#bdbdbd] hover:bg-[#d1d1d1]"
                  }
                `}
                disabled={step === 3 || step < 3}
                onClick={() => {}}
                aria-label="Ir al paso 3"
              >
                3
              </button>
            </div>
          </div>
          {/* Textos debajo alineados */}
          <div className="flex w-full justify-between items-center mt-2">
            <div className="flex-1 text-xs text-center text-[#bdbdbd]">
              Ingresa tu correo
            </div>
            <div className="flex-1 text-xs text-center text-[#bdbdbd]">
              Información básica
            </div>
            <div className="flex-1 text-xs text-center text-[#bdbdbd]">
              Define tu contraseña
            </div>
          </div>
        </div>
      </div>
      {/* Notificaciones y feedback visual */}
      {error && (
        <div className="w-full mb-4 p-2 bg-red-100 text-red-700 rounded text-center text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="w-full mb-4 p-2 bg-green-100 text-green-700 rounded text-center text-sm">
          {success}
        </div>
      )}
      {showModal && modalContent && (
        <div className="w-full flex items-center justify-center mt-2">
          {modalContent.type === "success" ? (
            <span className="text-green-600 text-sm font-semibold">
              {modalContent.message}
            </span>
          ) : (
            <span className="text-red-500 text-sm font-semibold">
              {modalContent.message}
            </span>
          )}
        </div>
      )}
      {/* Formulario por paso */}
      {step === 1 && (
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#222] mb-2"
          >
            ¿Cuál es tu correo?
          </label>
          <input
            id="email"
            type="email"
            value={step1.email}
            onChange={(e) => setStep1({ email: e.target.value })}
            className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg text-[#222] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#222] font-normal mb-6 bg-[#fafbfc]"
            placeholder="Ingresa tu correo electrónico"
            autoComplete="email"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className={`w-full py-3 rounded-full font-semibold mt-2 transition-colors duration-150
              ${
                isLoading
                  ? "bg-[#f3f3f3] text-[#d1d1d1] cursor-not-allowed"
                  : "bg-[#002142] text-white hover:bg-[#003366] active:bg-[#00152a] shadow-md"
              }
            `}
          >
            {isLoading ? "Procesando..." : "Siguiente"}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="w-full">
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={step2.nombre}
            onChange={(e) =>
              setStep2((s) => ({ ...s, nombre: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal mb-4"
            placeholder="Ingresa tu nombre"
            autoComplete="given-name"
            disabled={isLoading}
          />
          {/* ...el resto del diseño y botones permanece igual... */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className={`w-full py-3 rounded-full font-semibold mt-2 transition-colors duration-150
              ${
                isLoading
                  ? "bg-[#f3f3f3] text-[#d1d1d1] cursor-not-allowed"
                  : "bg-[#002142] text-white hover:bg-[#003366] active:bg-[#00152a] shadow-md"
              }
            `}
          >
            {isLoading ? "Procesando..." : "Siguiente"}
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Define una contraseña
          </label>
          <input
            id="password"
            type="password"
            value={step3.password}
            onChange={(e) => setStep3({ password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal mb-6"
            placeholder="Crea una contraseña segura"
            autoComplete="new-password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className={`w-full py-3 rounded-full font-semibold mt-2 transition-colors duration-150
              ${
                isLoading
                  ? "bg-[#f3f3f3] text-[#d1d1d1] cursor-not-allowed"
                  : "bg-[#002142] text-white hover:bg-[#003366] active:bg-[#00152a] shadow-md"
              }
            `}
          >
            {isLoading ? "Procesando..." : "Crear cuenta"}
          </button>
        </div>
      )}
    </>
  );
}
