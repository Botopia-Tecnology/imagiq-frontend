/**
 * Componente de verificación OTP
 * - Selección de canal de verificación (WhatsApp, SMS, Email)
 * - Input de código OTP con formato automático
 * - Funciones mock para envío de código
 * - Reenvío de código con temporizador
 */

"use client";

import { useState, useEffect } from "react";
import { Mail, Smartphone, RefreshCw, CheckCircle2, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { VerificationChannel } from "@/types/registration";

interface VerificationStepProps {
  email: string;
  phone: string;
  preferredChannel: VerificationChannel['type'];
  verificationCode?: string;
  isVerified: boolean;
  onChange: (data: {
    preferredChannel: VerificationChannel['type'];
    verificationCode?: string;
    isVerified: boolean;
  }) => void;
  onSendCode: (channel: VerificationChannel['type']) => Promise<void>;
  errors: Record<string, string>;
  disabled?: boolean;
}

const VERIFICATION_CHANNELS: VerificationChannel[] = [
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    icon: 'WhatsApp',
    description: 'Código por WhatsApp'
  },
  {
    type: 'sms',
    label: 'SMS',
    icon: 'Smartphone',
    description: 'Mensaje de texto'
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    description: 'Correo electrónico'
  }
];

export default function VerificationStep({
  email,
  phone,
  preferredChannel,
  verificationCode = '',
  isVerified,
  onChange,
  onSendCode,
  errors,
  disabled = false
}: VerificationStepProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // Countdown para reenvío
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleChannelSelect = (channel: VerificationChannel['type']) => {
    onChange({
      preferredChannel: channel,
      verificationCode: '',
      isVerified: false
    });
    setIsCodeSent(false);
  };

  const handleSendCode = async () => {
    if (isSending || resendCountdown > 0) return;

    setIsSending(true);
    try {
      await onSendCode(preferredChannel);
      setIsCodeSent(true);
      setResendCountdown(60); // 60 segundos para reenvío
    } catch (error) {
      console.error('Error sending code:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCodeChange = (code: string) => {
    // Solo números, máximo 6 dígitos
    const numericCode = code.replace(/\D/g, '').substring(0, 6);

    // Verificar automáticamente si el código tiene 6 dígitos
    const verified = numericCode.length === 6;

    onChange({
      preferredChannel,
      verificationCode: numericCode,
      isVerified: verified
    });
  };

  const getChannelIcon = (iconName: string) => {
    const icons = {
      WhatsApp: () => <SiWhatsapp className="w-5 h-5 text-[#25D366]" />,
      Smartphone: () => <Smartphone className="w-5 h-5" />,
      Mail: () => <Mail className="w-5 h-5" />
    };
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent /> : null;
  };

  const getDestinationText = () => {
    switch (preferredChannel) {
      case 'whatsapp':
      case 'sms':
        return phone;
      case 'email':
        return email;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-[300px] sm:min-h-[400px] flex flex-col justify-center">
      {/* Header con diseño moderno */}
      <div className="text-center mb-3 sm:mb-4 lg:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-[#002142] to-[#003366] rounded-full flex items-center justify-center shadow-lg">
          <SiWhatsapp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#002142] mb-1.5 sm:mb-2">
          Verificar tu información
        </h3>
        <p className="text-[#4a5a6a] text-xs sm:text-sm max-w-md mx-auto px-2">
          ¿Cómo prefieres recibir tu código de verificación?
        </p>
      </div>

      {/* Selección de canal con diseño flotante */}
      <div className="space-y-2.5 sm:space-y-3 mb-3 sm:mb-4 lg:mb-6">
        <div className="grid gap-3 sm:gap-4 max-w-lg mx-auto px-2">
          {VERIFICATION_CHANNELS.map((channel) => {
            const isSelected = preferredChannel === channel.type;
            return (
              <div
                key={channel.type}
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                  isSelected ? 'shadow-xl shadow-[#002142]/20' : 'shadow-lg hover:shadow-xl'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
                    isSelected
                      ? 'from-[#002142] to-[#003366] opacity-100'
                      : 'from-gray-50 to-white opacity-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleChannelSelect(channel.type)}
                  disabled={disabled}
                  className={`relative w-full p-4 sm:p-6 text-left transition-all duration-200 ${
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'bg-white/20 backdrop-blur text-white'
                        : 'bg-[#002142]/10 text-[#002142]'
                    }`}>
                      {getChannelIcon(channel.icon)}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-base sm:text-lg ${
                        isSelected ? 'text-white' : 'text-[#002142]'
                      }`}>
                        {channel.label}
                      </div>
                      <div className={`text-xs sm:text-sm ${
                        isSelected ? 'text-white/80' : 'text-[#4a5a6a]'
                      }`}>
                        {channel.description}
                      </div>
                      {isSelected && (
                        <div className="text-xs text-white/90 mt-2 font-medium bg-white/10 rounded-full px-3 py-1 inline-block">
                          {getDestinationText()}
                        </div>
                      )}
                    </div>
                    <div className={`transition-all duration-200 ${
                      isSelected ? 'text-white scale-110' : 'text-[#4a5a6a] scale-100'
                    }`}>
                      {isSelected ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-current opacity-30" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón para enviar código con diseño moderno */}
      {!isCodeSent && (
        <div className="text-center px-4">
          <button
            type="button"
            onClick={handleSendCode}
            disabled={disabled || isSending}
            className={`relative overflow-hidden px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 ${
              disabled || isSending
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#002142] to-[#003366] text-white shadow-lg hover:shadow-xl active:scale-95'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {isSending ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Enviando código...</span>
                </>
              ) : (
                <>
                  {getChannelIcon(VERIFICATION_CHANNELS.find(ch => ch.type === preferredChannel)?.icon || 'Mail')}
                  <span>Enviar código por {VERIFICATION_CHANNELS.find(ch => ch.type === preferredChannel)?.label}</span>
                </>
              )}
            </div>
            {!disabled && !isSending && (
              <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        </div>
      )}

      {/* Input de código OTP con diseño moderno */}
      {isCodeSent && (
        <div className="space-y-4 sm:space-y-6">
          {/* Contenedor del input con diseño flotante */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-2xl border border-gray-100 mx-1 sm:mx-2">
            <div className="text-center mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-[#002142] mb-2">
                Ingresa tu código
              </h4>
              <p className="text-xs sm:text-sm text-[#4a5a6a] px-4">
                Código enviado a <span className="font-semibold text-[#002142]">{getDestinationText()}</span>
              </p>
            </div>

            {/* Input del código con diseño especial */}
            <div className="relative mb-4 sm:mb-6">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="000000"
                disabled={disabled || isVerified}
                maxLength={6}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-3 rounded-xl sm:rounded-2xl text-center text-lg sm:text-xl lg:text-2xl font-bold tracking-[0.3em] sm:tracking-[0.5em] focus:outline-none transition-all duration-300 ${
                  errors.verificationCode ? 'border-red-300 bg-red-50' :
                  isVerified ? 'border-green-300 bg-green-50 text-green-700' :
                  verificationCode.length === 6 ? 'border-blue-300 bg-blue-50' :
                  'border-gray-200 bg-white focus:border-[#002142] focus:bg-[#f7fafd]'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  letterSpacing: '0.2em',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace'
                }}
              />

              {/* Indicador de progreso */}
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      i < verificationCode.length
                        ? isVerified ? 'bg-green-500' : 'bg-[#002142]'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Estados de feedback */}
            {errors.verificationCode && (
              <div className="text-center mb-4">
                <p className="text-red-500 text-sm font-medium flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  {errors.verificationCode}
                </p>
              </div>
            )}

            {isVerified && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  ¡Código verificado correctamente!
                </div>
              </div>
            )}

            {/* Botón de reenvío moderno */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={disabled || isSending || resendCountdown > 0 || isVerified}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  disabled || isSending || resendCountdown > 0 || isVerified
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[#002142] hover:text-white hover:bg-[#002142] border border-[#002142] hover:shadow-lg'
                }`}
              >
                {resendCountdown > 0 ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Reenviar en {resendCountdown}s
                  </>
                ) : isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Reenviando...
                  </>
                ) : isVerified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Verificado
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    ¿No recibiste el código?
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}