"use client";
/**
 * Página de Login de Usuario
 * - Formulario de autenticación con email/password
 * - Integración con microservicio de auth
 * - Redirección después de login exitoso
 * - Manejo de errores de autenticación
 * - Tracking de eventos de login con PostHog
 */


import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import { Usuario } from "@/types/user";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { notifyError, notifyLoginSuccess } from "./notifications";

// API endpoint for authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Login success response
interface LoginSuccessResponse {
  access_token: string;
  user: Omit<Usuario, "contrasena" | "tipo_documento" | "numero_documento">;
}

// Login error response
interface LoginErrorResponse {
  status: number;
  message: string;
}

interface LoginError {
  field?: string;
  message: string;
}

export default function LoginPage() {
  // ...existing code...
  const router = useRouter();
  const { login, isAuthenticated } = useAuthContext();

  // Detectar redirect a CreateAccount y navegar automáticamente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      if (redirect === "/login/create-account") {
        // Usar setTimeout para asegurar que router esté inicializado
        setTimeout(() => {
          router.replace("/login/create-account");
        }, 0);
      }
    }
  }, [router]);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginError[]>([]);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /**
   * Si el usuario ya está autenticado, mostrar mensaje y opciones.
   * No redirigir automáticamente, para permitir acceso a la página de login.
   */
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e6eef5] via-white to-[#b3c7db] relative mb-10">
        <div className="w-full max-w-md mx-auto bg-white border border-[#002142]/20 rounded-2xl shadow-lg p-8 flex flex-col items-center animate-fade-in">
          <h2
            className="text-center text-2xl font-semibold mb-6"
            style={{ color: "#002142" }}
          >
            Ya tienes sesión iniciada
          </h2>
          <p className="text-center text-[#002142] mb-6">
            Si deseas acceder a tu panel, haz click en el botón de abajo.
            <br />
            Si quieres cerrar sesión, usa el menú superior.
          </p>
          <button
            type="button"
            className="w-full py-2 rounded-full bg-[#002142] text-white text-base font-semibold mt-3 shadow hover:bg-[#003366] transition-all duration-200"
            onClick={() => router.push("/dashboard")}
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: LoginError[] = [];

    if (!formData.email.trim()) {
      newErrors.push({
        field: "email",
        message: "El correo electrónico o móvil es requerido",
      });
    } else {
      // Permitir email o número móvil (10 dígitos, solo números)
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      const isMobile = /^\d{10}$/.test(formData.email);
      if (!isEmail && !isMobile) {
        newErrors.push({
          field: "email",
          message: "Ingresa un correo válido o un número móvil de 10 dígitos",
        });
      }
    }

    if (!formData.password.trim()) {
      newErrors.push({
        field: "password",
        message: "La contraseña es requerida",
      });
    } else if (formData.password.length < 6) {
      newErrors.push({
        field: "password",
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      posthogUtils.capture("login_validation_error", {
        email: formData.email,
        error_count: errors.length,
      });
      setModalContent({
        type: "error",
        message: "Verifica los datos ingresados.",
      });
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // API call to authentication microservice
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          contrasena: formData.password,
        }),
      });
      // Si la respuesta no es válida, mostrar error
      if (!response || typeof response.status !== "number") {
        const msg =
          "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
        setModalContent({ type: "error", message: msg });
        setShowModal(true);
        await notifyError(msg, "Login fallido");
        setErrors([{ message: msg }]);
        setIsLoading(false);
        return;
      }
      if (!response.ok) {
        let errorMsg = "Error de autenticación";
        try {
          const errorResult: LoginErrorResponse = await response.json();
          if (
            errorResult.message &&
            errorResult.message.toLowerCase().includes("correo") &&
            errorResult.message.toLowerCase().includes("no existe")
          ) {
            errorMsg = "No existe una cuenta con ese correo electrónico.";
          } else {
            errorMsg = errorResult.message || errorMsg;
          }
        } catch {
          // Error al parsear JSON
        }
        setModalContent({ type: "error", message: errorMsg });
        setShowModal(true);
        await notifyError(errorMsg, "Login fallido");
        setErrors([{ message: errorMsg }]);
        setIsLoading(false);
        return;
      }
      // Handle success response
      const result: LoginSuccessResponse = await response.json();
      if (!result.access_token || !result.user) {
        const msg = "Respuesta de servidor inválida";
        setModalContent({ type: "error", message: msg });
        setShowModal(true);
        await notifyError(msg, "Login fallido");
        setErrors([{ message: msg }]);
        setIsLoading(false);
        return;
      }
      const { user, access_token } = result;
      posthogUtils.capture("login_attempt", {
        email: formData.email,
        user_role: user.rol,
        success: true,
      });
      setLoginSuccess(true);
      setModalContent({
        type: "success",
        message: `¡Bienvenido, ${user.nombre}! Has iniciado sesión correctamente.`,
      });
      setShowModal(true);
      await notifyLoginSuccess(user.nombre);
      localStorage.setItem("imagiq_token", access_token);
      login({
        id: user.id,
        email: user.email,
        name: user.nombre,
        last_name: user.apellido,
      });
      posthogUtils.capture("login_success", {
        user_id: user.id,
        user_role: user.rol,
        email: user.email,
      });
      setTimeout(() => {
        router.push(user.rol === "admin" ? "/dashboard" : "/tienda");
      }, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de conexión";
      setModalContent({ type: "error", message: msg });
      setShowModal(true);
      await notifyError(msg, "Login fallido");
      setErrors([{ message: msg }]);
      setIsLoading(false);
      posthogUtils.capture("login_error", {
        email: formData.email,
        error: msg,
      });
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  // Get field error
  const getFieldError = (field: string) => {
    return errors.find((error) => error.field === field);
  };

  // Get general errors
  const getGeneralErrors = () => {
    return errors.filter((error) => !error.field);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e6eef5] via-white to-[#b3c7db] relative mb-10 animate-fade-in">
      {/* Card container con efecto glass y sombra */}
      <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur border border-[#002142]/10 rounded-2xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
        {/* Title */}
        <h2 className="text-center text-3xl font-bold mb-4 text-[#002142] drop-shadow-sm tracking-tight animate-fade-in">
          Iniciar sesión
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6 animate-fade-in"
        >
          {/* Email field */}
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-base font-semibold text-[#002142] mb-2 tracking-tight"
            >
              Correo electrónico o número móvil
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal mb-2 bg-[#f7fafd] transition-all duration-200 shadow-sm ${
                getFieldError("email") ? "border-red-400" : "border-[#e5e5e5]"
              }`}
              placeholder="Ingresa tu correo o móvil"
              disabled={isLoading || loginSuccess}
              autoComplete="username"
            />
            {getFieldError("email") && (
              <p className="text-red-500 text-xs mt-1 animate-fade-in">
                {getFieldError("email")?.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-base font-semibold text-[#002142] mb-2 tracking-tight"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal mb-2 bg-[#f7fafd] transition-all duration-200 shadow-sm ${
                  getFieldError("password")
                    ? "border-red-400"
                    : "border-[#e5e5e5]"
                }`}
                placeholder="Ingresa tu contraseña"
                disabled={isLoading || loginSuccess}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5a6a] hover:text-[#002142]"
                disabled={isLoading || loginSuccess}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {getFieldError("password") && (
              <p className="text-red-500 text-xs mt-1 animate-fade-in">
                {getFieldError("password")?.message}
              </p>
            )}
          </div>

          {/* General errors */}
          {getGeneralErrors().map((error, index) => (
            <div
              key={index}
              className="w-full flex items-center text-red-500 text-sm gap-2 animate-fade-in"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error.message}</span>
            </div>
          ))}
          {/* Modal feedback (SweetAlert2) */}
          {showModal && modalContent && (
            <div className="w-full flex items-center justify-center mt-2 animate-fade-in">
              {modalContent.type === "success" ? (
                <span className="text-green-600 text-base font-bold px-4 py-2 rounded-lg bg-green-50 border border-green-200 shadow animate-fade-in">
                  {modalContent.message}
                </span>
              ) : (
                <span className="text-red-500 text-base font-bold px-4 py-2 rounded-lg bg-red-50 border border-red-200 shadow animate-fade-in">
                  {modalContent.message}
                </span>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || loginSuccess}
            className={`w-full py-3 rounded-full font-semibold transition-all duration-200 shadow-lg ${
              isLoading || loginSuccess
                ? "bg-[#f3f3f3] text-[#d1d1d1] cursor-not-allowed"
                : "bg-gradient-to-r from-[#002142] to-[#003366] text-white hover:from-[#003366] hover:to-[#002142] active:bg-[#00152a]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-[#003366]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Verificando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {/* Terms and links */}
        <div className="w-full text-xs text-[#002142] text-center mt-6 animate-fade-in">
          Al continuar, aceptas los{" "}
          <a href="#" className="underline text-[#002142]">
            Términos de uso
          </a>{" "}
          y la{" "}
          <a href="#" className="underline text-[#002142]">
            Política de privacidad
          </a>
          .<br />
          <div className="flex justify-between mt-3">
            <a href="#" className="underline text-[#002142]">
              ¿Problemas para iniciar sesión?
            </a>
            <a href="#" className="underline text-[#002142]">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>

      {/* Divider and create account button */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center mt-8 animate-fade-in">
        <div className="w-full flex items-center gap-3 mb-4">
          <hr className="flex-1 border-[#002142]/30" />
          <span className="text-xs text-[#002142]">
            ¿Nuevo en la comunidad?
          </span>
          <hr className="flex-1 border-[#002142]/30" />
        </div>
        <button
          type="button"
          className="w-full py-3 rounded-full border-2 border-[#002142] text-[#002142] text-base font-semibold bg-white hover:bg-[#e6eef5] transition-all duration-200 shadow-lg"
          onClick={() => router.push("/login/create-account")}
        >
          Crear una cuenta
        </button>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) both;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-avatar-pop {
          animation: avatarPop 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) both;
        }
        @keyframes avatarPop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
