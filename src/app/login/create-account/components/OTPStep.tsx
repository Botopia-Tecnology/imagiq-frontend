import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

interface OTPStepProps {
  email: string;
  otpCode: string;
  otpSent: boolean;
  onOTPChange: (code: string) => void;
  onSendOTP: () => void;
  disabled?: boolean;
}

export function OTPStep({
  email,
  otpCode,
  otpSent,
  onOTPChange,
  onSendOTP,
  disabled,
}: OTPStepProps) {
  const [sendMethod, setSendMethod] = useState<'email' | 'whatsapp'>('email');

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-gray-600">
        {otpSent
          ? `Enviamos un código de 6 dígitos vía ${sendMethod === 'email' ? 'correo electrónico' : 'WhatsApp'}`
          : "Selecciona cómo deseas recibir tu código de verificación"}
      </p>

      {!otpSent && (
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setSendMethod('email')}
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
            onClick={() => setSendMethod('whatsapp')}
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
            onClick={onSendOTP}
            disabled={disabled}
            className="text-sm"
          >
            Reenviar código
          </Button>
        </div>
      )}
    </div>
  );
}
