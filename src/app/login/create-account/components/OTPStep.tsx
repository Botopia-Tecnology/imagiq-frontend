import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";

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
}: OTPStepProps) {
  const [editMode, setEditMode] = useState<'email' | 'phone' | null>(null);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(telefono);

  // Sincronizar valores temporales cuando cambien las props
  useEffect(() => {
    setTempEmail(email);
  }, [email]);

  useEffect(() => {
    setTempPhone(telefono);
  }, [telefono]);

  const handleSaveEdit = () => {
    if (editMode === 'email') {
      onChangeEmail(tempEmail);
    } else if (editMode === 'phone') {
      onChangePhone(tempPhone);
    }
    setEditMode(null);
  };

  const handleCancelEdit = () => {
    setTempEmail(email);
    setTempPhone(telefono);
    setEditMode(null);
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
                onChange={(e) => setTempEmail(e.target.value)}
                disabled={disabled}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={disabled}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={disabled || !tempEmail}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  Guardar
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
                onChange={(e) => setTempPhone(e.target.value.replace(/\D/g, ""))}
                disabled={disabled}
                maxLength={10}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={disabled}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={disabled || !tempPhone || tempPhone.length !== 10}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  Guardar
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
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
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
        )}

        {otpSent && (
          <div className="max-w-xs mx-auto space-y-4">
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
            <Button
              type="button"
              variant="ghost"
              onClick={() => onSendOTP(sendMethod)}
              disabled={disabled}
              className="text-sm"
            >
              Reenviar código
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
