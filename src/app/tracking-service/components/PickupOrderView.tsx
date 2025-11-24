import { OrderInfoCard } from "./OrderInfoCard";
import { InstructionsBox } from "./InstructionsBox";
import { useState, useEffect, useCallback } from "react";
import { apiPost } from "@/lib/api-client";

interface OrderData {
  id?: string;
  tienda?: {
    descripcion?: string;
    nombre?: string;
  };
}

interface PickupOrderViewProps {
  orderNumber: string;
  token: string;
  horaRecogida: string;
  orderData?: OrderData;
  formatDate: (
    dateString: string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
}

export function PickupOrderView({
  orderNumber,
  token,
  horaRecogida,
  orderData,
  formatDate,
}: Readonly<PickupOrderViewProps>) {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error' | 'limit-reached'>('idle');
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  // Clave para localStorage basada en el orderNumber
  const storageKey = `resend_attempts_${orderNumber}`;

  const checkRemainingAttempts = useCallback(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        const hoursPassed = (now - data.timestamp) / (1000 * 60 * 60);
        
        if (hoursPassed >= 1) {
          // Ha pasado más de 1 hora, resetear intentos
          localStorage.removeItem(storageKey);
          setAttemptsLeft(5);
        } else {
          // Aún dentro del período de 1 hora
          const remaining = Math.max(0, 5 - data.attempts);
          setAttemptsLeft(remaining);
          if (remaining === 0) {
            setResendStatus('limit-reached');
          }
        }
      } catch {
        // Error al parsear, resetear
        localStorage.removeItem(storageKey);
        setAttemptsLeft(5);
      }
    }
  }, [storageKey]);

  // Verificar intentos restantes al cargar
  useEffect(() => {
    checkRemainingAttempts();
  }, [checkRemainingAttempts]);

  const handleResendCredentials = async () => {
    if (attemptsLeft <= 0) {
      setResendStatus('limit-reached');
      return;
    }

    setIsResending(true);
    setResendStatus('idle');

    try {
      // Obtener datos del usuario desde localStorage
      const userData = localStorage.getItem("imagiq_user");
      let userInfo = null;

      if (userData) {
        try {
          userInfo = JSON.parse(userData);
        } catch (e) {
          console.error("Error al parsear datos del usuario:", e);
        }
      }

      if (!userInfo || !userInfo.email || !userInfo.telefono) {
        throw new Error("No se encontraron datos del usuario");
      }

      // Formatear teléfono
      let telefono = userInfo.telefono.toString().replace(/[\s+\-()]/g, "");
      if (!telefono.startsWith("57")) {
        telefono = "57" + telefono;
      }

      // Obtener order ID desde orderData
      const orderId = orderData?.id || orderNumber;

      // Payload para email
      const emailPayload = {
        to: userInfo.email,
        orderId: orderId,
        customerName: `${userInfo.nombre} ${userInfo.apellido || ""}`.trim(),
        pickupToken: token,
        orderNumber: orderNumber
      };

      // Payload para WhatsApp
      const whatsappPayload = {
        to: telefono,
        nombre: userInfo.nombre.charAt(0).toUpperCase() + userInfo.nombre.slice(1).toLowerCase(),
        numeroPedido: orderNumber,
        nombreTienda: orderData?.tienda?.descripcion || "Tienda IMAGIQ",
        producto: "Token",
        horarioRecogida: token,
        resumen: "Token",
        ordenId: orderId
      };

      // Enviar email
      const emailResponse = await apiPost('/api/messaging/email/store-pickup', emailPayload) as { success: boolean };
      
      // Enviar WhatsApp
      const whatsappResponse = await apiPost('/api/messaging/pickup', whatsappPayload) as { success: boolean };

      if (emailResponse.success || whatsappResponse.success) {
        setResendStatus('success');
        
        // Actualizar intentos en localStorage
        const stored = localStorage.getItem(storageKey);
        let attempts = 1;
        
        if (stored) {
          try {
            const data = JSON.parse(stored);
            attempts = data.attempts + 1;
          } catch {
            attempts = 1;
          }
        }

        localStorage.setItem(storageKey, JSON.stringify({
          attempts,
          timestamp: Date.now()
        }));

        setAttemptsLeft(Math.max(0, 5 - attempts));

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setResendStatus('idle');
        }, 5000);
      } else {
        throw new Error("Error al enviar credenciales");
      }
    } catch (error) {
      console.error("Error al reenviar credenciales:", error);
      setResendStatus('error');
      
      // Ocultar mensaje de error después de 5 segundos
      setTimeout(() => {
        setResendStatus('idle');
      }, 5000);
    } finally {
      setIsResending(false);
    }
  };

  const orderInfoItems = [
    { label: "Orden #", value: orderNumber },
    { label: "Token", value: "******", highlight: true }, // Token enmascarado
    {
      label: "Fecha de creación",
      value: formatDate(new Date().toISOString()),
    },
    {
      label: "Hora de recogida",
      value: horaRecogida || "Pendiente por asignar",
    },
    {
      label: "Estado",
      value: horaRecogida ? "Listo para recoger" : "Pendiente",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-black mb-2">
          Pedido listo para recoger
        </h1>
        <p className="text-gray-600">
          Tu pedido está preparado y esperando por ti en la tienda
        </p>
      </div>

      <OrderInfoCard title="Información del pedido" items={orderInfoItems} />

      {/* Botón de reenviar credenciales */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={handleResendCredentials}
          disabled={isResending || attemptsLeft <= 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isResending || attemptsLeft <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isResending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </div>
          ) : (
            `Reenviar credenciales ${attemptsLeft > 0 ? `(${attemptsLeft} intentos restantes)` : '(Sin intentos)'}`
          )}
        </button>

        {/* Mensajes de estado */}
        {resendStatus === 'success' && (
          <div className="mt-3 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            ✅ Credenciales enviadas exitosamente por email y WhatsApp
          </div>
        )}
        
        {resendStatus === 'error' && (
          <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            ❌ Error al enviar credenciales. Inténtalo de nuevo más tarde.
          </div>
        )}
        
        {resendStatus === 'limit-reached' && (
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm">
            ⚠️ Límite de reenvíos alcanzado. Inténtalo en 1 hora.
          </div>
        )}
      </div>

      <InstructionsBox
        title="Instrucciones para recoger"
        instructions="Presenta tu identificación, el número de orden y el token al personal de la tienda para recoger tu pedido. Si no recuerdas tu token, usa el botón de reenviar credenciales."
      />
    </div>
  );
}
