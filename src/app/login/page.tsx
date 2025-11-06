"use client";

import { useAuthContext } from "@/features/auth/context";
import { posthogUtils } from "@/lib/posthogClient";
import { Usuario } from "@/types/user";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { notifyError, notifyLoginSuccess } from "./notifications";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface LoginSuccessResponse {
  access_token: string;
  user: Omit<Usuario, "contrasena" | "tipo_documento">;
  skus: string[] | { sku: string }[];
  defaultAddress?: {
    id: string;
    nombreDireccion: string;
    direccionFormateada: string;
    ciudad?: string;
    departamento?: string;
    esPredeterminada: boolean;
  } | null;
}

interface LoginErrorResponse {
  status: number;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthContext();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      if (redirect === "/login/create-account") {
        setTimeout(() => router.replace("/login/create-account"), 0);
      }
    }
  }, [router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Ya iniciaste sesión</h1>
          <p className="text-sm text-gray-600">
            Si deseas acceder a tu panel, haz clic en el botón.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Ir al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          contrasena: formData.password,
        }),
      });

      if (!response || typeof response.status !== "number") {
        throw new Error("No se pudo conectar con el servidor");
      }

      if (!response.ok) {
        const errorResult: LoginErrorResponse = await response.json();
        throw new Error(errorResult.message || "Error de autenticación");
      }

      const result: LoginSuccessResponse = await response.json();

      if (!result.access_token || !result.user) {
        throw new Error("Respuesta de servidor inválida");
      }

      const { user, access_token, skus, defaultAddress } = result;

      posthogUtils.capture("login_success", {
        user_id: user.id,
        user_role: user.rol,
      });

      if (skus && Array.isArray(skus)) {
        const skuStrings = skus.map(item => typeof item === 'string' ? item : item.sku);
        localStorage.setItem("imagiq_favorites", JSON.stringify(skuStrings));
      }

      localStorage.setItem("imagiq_token", access_token);

      login({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        numero_documento: user.numero_documento,
        telefono: user.telefono,
        role: user.rol,
        defaultAddress: defaultAddress || null,
      });

      await notifyLoginSuccess(user.nombre);

      setTimeout(() => {
        router.push(user.rol === 1 ? "/dashboard" : "/");
      }, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de conexión";
      setError(msg);
      await notifyError(msg, "Login fallido");
      posthogUtils.capture("login_error", {
        email: formData.email,
        error: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-4 pt-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="text-sm text-gray-600">
            Ingresa tus datos para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Forgot password & Submit button in same row */}
          <div className="flex items-center justify-between gap-4">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 underline whitespace-nowrap">
              ¿Olvidaste tu contraseña?
            </a>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white hover:bg-gray-800 rounded-lg px-8"
            >
              {isLoading ? "Verificando..." : "Entrar"}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-gray-500">
            ¿No tienes cuenta?
          </span>
        </div>

        {/* Create account button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/login/create-account")}
          className="w-full"
        >
          Crear una cuenta
        </Button>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            Al continuar, aceptas los{" "}
            <a href="#" className="underline hover:text-gray-900">
              Términos de uso
            </a>{" "}
            y la{" "}
            <a href="#" className="underline hover:text-gray-900">
              Política de privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
