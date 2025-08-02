/**
 * Página de Login de Usuario
 * - Formulario de autenticación con email/password
 * - Integración con microservicio de auth
 * - Redirección después de login exitoso
 * - Manejo de errores de autenticación
 * - Tracking de eventos de login con PostHog
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import Logo from "@/components/Logo";

// Hardcoded users for testing - will be replaced with microservice
const DEMO_USERS = [
  {
    id: 1,
    email: "superadmin@imagiq.com",
    password: "superadmin123",
    role: "superadmin" as const,
    name: "Super Administrador",
    avatar: "/avatars/superadmin.jpg",
  },
  {
    id: 2,
    email: "admin@imagiq.com",
    password: "admin123",
    role: "admin" as const,
    name: "Administrador",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: 3,
    email: "user@imagiq.com",
    password: "user123",
    role: "user" as const,
    name: "Usuario",
    avatar: "/avatars/user.jpg",
  },
];

interface LoginError {
  field?: string;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthContext();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginError[]>([]);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [fieldFocus, setFieldFocus] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: LoginError[] = [];

    if (!formData.email.trim()) {
      newErrors.push({ field: "email", message: "El email es requerido" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({ field: "email", message: "Formato de email inválido" });
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
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Find user in demo data
      const user = DEMO_USERS.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        throw new Error("Credenciales inválidas");
      }

      // Track successful login attempt
      posthogUtils.capture("login_attempt", {
        email: formData.email,
        user_role: user.role,
        success: true,
      });

      // Show success animation
      setLoginSuccess(true);

      // Login user
      await login({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      });

      // Track successful login
      posthogUtils.capture("login_success", {
        user_id: user.id,
        user_role: user.role,
        email: user.email,
      });

      // Redirect after success animation
      setTimeout(() => {
        router.push(user.role === "user" ? "/tienda" : "/dashboard");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error de conexión";
      setErrors([{ message: errorMessage }]);

      posthogUtils.capture("login_error", {
        email: formData.email,
        error: errorMessage,
      });
    } finally {
      setIsLoading(false);
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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-16 md:py-24"
      style={{
        background: "linear-gradient(135deg, #14182A 0%, #0c4da2 100%)",
      }}
    >
      {/* Minimal animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-minimal"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse-minimal delay-1000"></div>
      </div>

      {/* Main container */}
      <div
        className={cn(
          "relative z-10 w-full max-w-sm mx-4 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Login card - minimalist design */}
        <div className="bg-white/8 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Logo width={148} height={148} />
              </div>
            </div>
            <h1 className="text-2xl font-light text-white mb-2">Bienvenido</h1>
            <p className="text-blue-200/70 text-sm font-light">
              Accede a tu cuenta
            </p>
          </div>

          {/* Success message - minimal */}
          {loginSuccess && (
            <div className="mb-6 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
              <div className="flex items-center justify-center text-blue-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-light">Acceso exitoso</span>
              </div>
            </div>
          )}

          {/* General errors - minimal */}
          {getGeneralErrors().map((error, index) => (
            <div
              key={index}
              className="mb-6 p-3 bg-red-500/10 border border-red-400/20 rounded-lg"
            >
              <div className="flex items-center justify-center text-red-200">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-light">{error.message}</span>
              </div>
            </div>
          ))}

          {/* Login form - clean and minimal */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFieldFocus("email")}
                  onBlur={() => setFieldFocus(null)}
                  className={cn(
                    "w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-blue-200/50 transition-all duration-200 focus:outline-none focus:ring-1 backdrop-blur-sm font-light",
                    getFieldError("email")
                      ? "border-red-400/40 focus:ring-red-400/30 focus:border-red-400/40"
                      : "border-white/10 hover:border-white/20 focus:ring-blue-400/30 focus:border-blue-400/40"
                  )}
                  placeholder="Email"
                  disabled={isLoading || loginSuccess}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-200/40" />
              </div>
              {getFieldError("email") && (
                <p className="text-red-300/80 text-xs font-light">
                  {getFieldError("email")?.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onFocus={() => setFieldFocus("password")}
                  onBlur={() => setFieldFocus(null)}
                  className={cn(
                    "w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-blue-200/50 transition-all duration-200 focus:outline-none focus:ring-1 backdrop-blur-sm font-light",
                    getFieldError("password")
                      ? "border-red-400/40 focus:ring-red-400/30 focus:border-red-400/40"
                      : "border-white/10 hover:border-white/20 focus:ring-blue-400/30 focus:border-blue-400/40"
                  )}
                  placeholder="Contraseña"
                  disabled={isLoading || loginSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200/40 hover:text-blue-200/70 transition-colors duration-200"
                  disabled={isLoading || loginSuccess}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {getFieldError("password") && (
                <p className="text-red-300/80 text-xs font-light">
                  {getFieldError("password")?.message}
                </p>
              )}
            </div>

            {/* Submit button - minimal */}
            <button
              type="submit"
              disabled={isLoading || loginSuccess}
              className={cn(
                "w-full py-3 mt-6 rounded-lg font-light text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40",
                isLoading || loginSuccess
                  ? "bg-blue-600/30 cursor-not-allowed"
                  : "bg-blue-600/80 hover:bg-blue-600 active:bg-blue-700"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Verificando</span>
                </div>
              ) : loginSuccess ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Acceso exitoso
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Footer - minimal */}
          <div className="mt-6 text-center">
            <p className="text-blue-200/50 text-xs font-light">
              ¿Necesitas acceso? Contacta al administrador
            </p>
          </div>
        </div>

        {/* Demo credentials - minimal card */}
        <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="text-blue-200/80 font-light mb-2 text-xs text-center">
            Credenciales de prueba
          </h3>
          <div className="space-y-1 text-xs text-blue-200/60 font-light">
            <div className="text-center">
              superadmin@imagiq.com / superadmin123
            </div>
            <div className="text-center">admin@imagiq.com / admin123</div>
            <div className="text-center">user@imagiq.com / user123</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-minimal {
          0%,
          100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.02);
          }
        }

        .animate-pulse-minimal {
          animation: pulse-minimal 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
