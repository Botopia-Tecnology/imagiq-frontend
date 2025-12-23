"use client";

import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { apiPost } from "@/lib/api-client";
import { toast } from "sonner";
import { useAuthContext } from "@/features/auth/context";

interface RegisterGuestPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
  userName?: string;
  userLastName?: string;
}

export default function RegisterGuestPasswordModal({
  isOpen,
  onClose,
  onSuccess,
  userEmail,
  userName,
  userLastName,
}: RegisterGuestPasswordModalProps) {
  const { login } = useAuthContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Validar requisitos de seguridad de la contraseña (igual que en create account)
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validar todos los requisitos de contraseña
    if (!password || password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!passwordRequirements.hasUpperCase) {
      newErrors.password = "La contraseña debe tener al menos una letra mayúscula";
    } else if (!passwordRequirements.hasLowerCase) {
      newErrors.password = "La contraseña debe tener al menos una letra minúscula";
    } else if (!passwordRequirements.hasNumber) {
      newErrors.password = "La contraseña debe tener al menos un número";
    } else if (!passwordRequirements.hasSpecialChar) {
      newErrors.password = "La contraseña debe tener al menos un carácter especial";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Por favor confirma tu contraseña";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && allRequirementsMet;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Registrar la contraseña
      await apiPost<{ 
        message: string; 
        user: any;
      }>(
        "/api/auth/register-guest-password",
        {
          email: userEmail,
          contrasena: password,
        }
      );

      toast.success("Cuenta creada con éxito");

      // 2. Iniciar sesión automáticamente con las nuevas credenciales
      try {
        console.log("🔄 [Modal] Iniciando sesión automática...");
        const loginResponse = await apiPost<{
          access_token: string;
          user: any;
        }>("/api/auth/login", {
          email: userEmail,
          contrasena: password,
        });

        if (loginResponse.access_token && loginResponse.user) {
          // Guardar token y usuario del login real
          localStorage.setItem("imagiq_token", loginResponse.access_token);
          
          const user = loginResponse.user;
          // Asegurar formato de rol si es necesario, aunque el login debería traerlo bien
          // loginResponse suele traer el usuario bien formateado
          
          login(user);
          console.log("✅ [Modal] Sesión iniciada correctamente vía /api/auth/login");
        } else {
          throw new Error("Respuesta de login incompleta");
        }
      } catch (loginError) {
        console.warn("⚠️ [Modal] Falló el login automático, intentando fallback manual:", loginError);
        
        // Fallback: Si el login explícito falla, intentamos armar la sesión con lo que tenemos
        const currentUser = localStorage.getItem("imagiq_user");
        if (currentUser) {
          try {
            const user = JSON.parse(currentUser);
            user.rol = 2; // Cambiar a usuario regular
            user.role = 2;
            
            if (userName && !user.nombre) user.nombre = userName;
            if (userLastName && !user.apellido) user.apellido = userLastName;
            
            login(user);
            console.log("✅ [Modal] Sesión actualizada (fallback manual)");
          } catch (err) {
            console.error("Error en fallback de sesión:", err);
          }
        }
      }

      // Llamar callback de éxito
      onSuccess();
    } catch (error: any) {
      console.error("Error registrando contraseña:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al registrar la contraseña. Por favor intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      console.log("✅ [Modal] Modal de registro de contraseña abierto");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-2">Registra tu cuenta</h2>
        <p className="text-gray-600 mb-6">
          Crea una contraseña para acceder a beneficios exclusivos y gestionar tus compras
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined });
                }}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Indicadores de requisitos de contraseña */}
            {(password || isPasswordFocused) && (
              <div className="space-y-1 text-xs mt-2">
                <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="font-bold">{passwordRequirements.minLength ? '✓' : '○'}</span>
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="font-bold">{passwordRequirements.hasUpperCase ? '✓' : '○'}</span>
                  <span>Una letra mayúscula</span>
                </div>
                <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="font-bold">{passwordRequirements.hasLowerCase ? '✓' : '○'}</span>
                  <span>Una letra minúscula</span>
                </div>
                <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="font-bold">{passwordRequirements.hasNumber ? '✓' : '○'}</span>
                  <span>Un número</span>
                </div>
                <div className={`flex items-center gap-1 transition-colors ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className="font-bold">{passwordRequirements.hasSpecialChar ? '✓' : '○'}</span>
                  <span>Un carácter especial (!@#$%...)</span>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Indicador de coincidencia de contraseñas */}
            {confirmPassword && (
              <div className="text-xs mt-2">
                {password === confirmPassword ? (
                  <div className="flex items-center gap-1 text-green-600 transition-colors">
                    <span className="font-bold">✓</span>
                    <span>Las contraseñas coinciden</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 transition-colors">
                    <span className="font-bold">✗</span>
                    <span>Las contraseñas no coinciden</span>
                  </div>
                )}
              </div>
            )}
            
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Continuar como invitado
            </button>
            <button
              type="submit"
              disabled={loading || !allRequirementsMet || password !== confirmPassword}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Registrar cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


