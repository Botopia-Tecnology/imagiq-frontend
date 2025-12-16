import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import { apiPost } from "@/lib/api-client";

interface OTPStepProps {
  email: string;
  telefono: string;
  otpCode: string;
  otpSent: boolean;
  sendMethod: 'email' | 'whatsapp';
  onOTPChange: (code: string) => void;
  onSendOTP: (method?: 'email' | 'whatsapp') => void;
  onMethodChange: (method: 'email' | 'whatsapp') => void;
  onChangeEmail: (newEmail: string) => void;
  onChangePhone: (newPhone: string) => void;
  disabled?: boolean;
  showSendButton?: boolean; // Para mostrar botón de enviar en Step2
  onVerifyOTP?: () => void; // Para verificar el código
  loading?: boolean; // Estado de carga
}

export function OTPStep({
  email,
  telefono,
  otpCode,
  otpSent,
  sendMethod,
  onOTPChange,
  onSendOTP,
  onMethodChange,
  onChangeEmail,
  onChangePhone,
  disabled,
  showSendButton = false,
  onVerifyOTP,
  loading = false,
}: OTPStepProps) {
  const [editMode, setEditMode] = useState<'email' | 'phone' | null>(null);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(telefono);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  // Sincronizar valores temporales cuando cambien las props
  useEffect(() => {
    setTempEmail(email);
  }, [email]);

  useEffect(() => {
    setTempPhone(telefono);
  }, [telefono]);

  // Limpiar error cuando cambie el modo de edición
  useEffect(() => {
    setValidationError("");
  }, [editMode]);

  const handleSaveEdit = async () => {
    setIsValidating(true);
    setValidationError("");

    try {
      if (editMode === 'email') {
        // Validar que el email sea diferente al actual
        if (tempEmail.toLowerCase() === email.toLowerCase()) {
          setValidationError("El email es el mismo que el actual");
          setIsValidating(false);
          return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(tempEmail)) {
          setValidationError("Formato de email inválido");
          setIsValidating(false);
          return;
        }

        // Verificar si el email ya está registrado
        try {
          const response = await apiPost<{ exists: boolean; message?: string }>("/api/auth/check-email", {
            email: tempEmail.toLowerCase(),
          });

          if (response.exists) {
            setValidationError("Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.");
            setIsValidating(false);
            return;
          }
        } catch (error) {
          console.log("⚠️ No se pudo validar el email, permitiendo cambio:", error);
        }

        // Si pasa las validaciones, guardar el cambio
        onChangeEmail(tempEmail);
        setEditMode(null);
        setValidationError("");
      } else if (editMode === 'phone') {
        // Validar que el teléfono sea diferente al actual
        if (tempPhone === telefono) {
          setValidationError("El teléfono es el mismo que el actual");
          setIsValidating(false);
          return;
        }

        // Validar longitud del teléfono
        if (tempPhone.length !== 10) {
          setValidationError("El teléfono debe tener 10 dígitos");
          setIsValidating(false);
          return;
        }

        // Verificar si el teléfono ya está registrado
        try {
          const response = await apiPost<{ exists: boolean; message?: string }>("/api/auth/check-phone", {
            telefono: tempPhone,
            codigo_pais: "57", // Colombia por defecto
          });

          if (response.exists) {
            setValidationError("Este número de teléfono ya está registrado. Por favor, usa otro o inicia sesión.");
            setIsValidating(false);
            return;
          }
        } catch (error) {
          console.log("⚠️ No se pudo validar el teléfono, permitiendo cambio:", error);
        }

        // Si pasa las validaciones, guardar el cambio
        onChangePhone(tempPhone);
        setEditMode(null);
        setValidationError("");
      }
    } catch (error) {
      console.error("Error al validar cambio:", error);
      setValidationError("Error al validar. Intenta de nuevo.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancelEdit = () => {
    setTempEmail(email);
    setTempPhone(telefono);
    setEditMode(null);
    setValidationError("");
  };

  return (
    <div className="space-y-4">
      {/* Mostrar datos actuales con opción de editar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <p className="text-xs text-gray-600 font-medium">Datos de verificación</p>

        {/* Email */}
        <div className="space-y-2">
          {editMode === 'email' ? (
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-xs">Correo electrónico</Label>
              <Input
                id="edit-email"
                type="email"
                value={tempEmail}
                onChange={(e) => {
                  setTempEmail(e.target.value);
                  setValidationError(""); // Limpiar error al escribir
                }}
                disabled={disabled || isValidating}
                className="text-sm"
              />
              {validationError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span className="font-bold">✗</span>
                  {validationError}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={disabled || isValidating}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={disabled || !tempEmail || isValidating}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  {isValidating ? "Validando..." : "Guardar"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">Email:</span>{" "}
                <span className="font-medium">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditMode('email')}
                disabled={disabled}
                className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-3 h-3" />
                Cambiar
              </button>
            </div>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          {editMode === 'phone' ? (
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-xs">Número de teléfono</Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="3001234567"
                value={tempPhone}
                onChange={(e) => {
                  setTempPhone(e.target.value.replace(/\D/g, ""));
                  setValidationError(""); // Limpiar error al escribir
                }}
                disabled={disabled || isValidating}
                maxLength={10}
                className="text-sm"
              />
              {validationError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span className="font-bold">✗</span>
                  {validationError}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={disabled || isValidating}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={disabled || !tempPhone || tempPhone.length !== 10 || isValidating}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  {isValidating ? "Validando..." : "Guardar"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">Teléfono:</span>{" "}
                <span className="font-medium">+57 {telefono}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditMode('phone')}
                disabled={disabled}
                className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-3 h-3" />
                Cambiar
              </button>
            </div>
          )}
        </div>

        {editMode && (
          <p className="text-xs text-gray-800 bg-gray-100 p-2 rounded">
            Si cambias estos datos, deberás reenviar un nuevo código de verificación.
          </p>
        )}
      </div>

      {/* Sección de verificación OTP */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          {otpSent
            ? `Enviamos un código de 6 dígitos vía ${sendMethod === 'email' ? 'correo electrónico' : 'WhatsApp'}`
            : "Selecciona cómo deseas recibir tu código de verificación"}
        </p>

        {!otpSent && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => onMethodChange('email')}
                disabled={disabled}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                  sendMethod === 'email'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email</span>
              </button>
              <button
                type="button"
                onClick={() => onMethodChange('whatsapp')}
                disabled={disabled}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                  sendMethod === 'whatsapp'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">WhatsApp</span>
              </button>
            </div>
            
            {/* Botón de enviar código (solo en Step2) */}
            {showSendButton && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={() => onSendOTP(sendMethod)}
                  disabled={disabled}
                  className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 font-bold py-3 px-8 text-base rounded-lg"
                >
                  Enviar código
                </Button>
              </div>
            )}
          </div>
        )}

        {otpSent && (
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Código de verificación</Label>
              <Input
                id="otp"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => onOTPChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={disabled}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
            
            {/* Botones en la misma fila */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                onClick={() => onSendOTP(sendMethod)}
                disabled={disabled || loading}
                className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 font-bold py-3 px-8 text-base rounded-lg"
              >
                Reenviar código
              </Button>
              
              {onVerifyOTP && (
                <Button
                  type="button"
                  onClick={onVerifyOTP}
                  disabled={disabled || loading || otpCode.length !== 6}
                  className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 font-bold py-3 px-8 text-base rounded-lg"
                >
                  {loading ? "Verificando..." : "Verificar código"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
