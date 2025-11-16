'use client';

import { useState } from 'react';
import { useAuthContext } from '@/features/auth/context';
import { toast } from 'sonner';
import { apiPost } from '@/lib/api-client';

interface StockNotificationData {
  productName: string; // Solo para mostrar en el toast
  email: string;
  sku?: string;
  codigoMarket: string; // Código de mercado del producto (OBLIGATORIO)
}

export function useStockNotification() {
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const requestNotification = async (data: StockNotificationData) => {
    try {
      // Validar que el SKU esté presente
      if (!data.sku) {
        throw new Error('No se pudo identificar el producto seleccionado');
      }

      // Validar que el codigoMarket esté presente
      if (!data.codigoMarket) {
        throw new Error('No se pudo identificar el código de mercado del producto');
      }

      // Preparar datos según la especificación del backend
      const payload = {
        sku: data.sku,
        email: data.email,
        codigoMarket: data.codigoMarket,
        userId: user?.id || null,
      };

      console.log('📧 Enviando solicitud de notificación de stock:', payload);

      // Llamar al endpoint del backend usando apiPost
      const result = await apiPost('/api/messaging/notification', payload);

      // Mostrar mensaje de éxito según respuesta del backend
      toast.success('¡Notificación registrada!', {
        description: `Te avisaremos a ${data.email} cuando ${data.productName} esté disponible.`,
        duration: 5000,
      });

      return { success: true, data: result };
    } catch (error) {
      console.error('Error al registrar notificación:', error);

      // Manejar casos específicos de error
      if (error instanceof Error) {
        const errorMessage = error.message;

        // Caso 1: Email ya registrado para este producto
        if (errorMessage.includes('Ya existe una notificación registrada') ||
            errorMessage.includes('Ya existe')) {
          toast.info('Ya registramos tu email', {
            description: 'Ya te notificaremos cuando este producto esté disponible.',
            duration: 5000,
          });
          return { success: true, duplicate: true };
        }

        // Caso 2: Email inválido
        if (errorMessage.includes('email must be an email')) {
          toast.error('Error al registrar la notificación', {
            description: 'Por favor ingresa un email válido',
          });
          throw new Error('Por favor ingresa un email válido');
        }

        // Caso 3: SKU vacío
        if (errorMessage.includes('sku should not be empty')) {
          toast.error('Error al registrar la notificación', {
            description: 'No se pudo identificar el producto seleccionado',
          });
          throw new Error('No se pudo identificar el producto seleccionado');
        }

        // Otros errores
        toast.error('Error al registrar la notificación', {
          description: errorMessage || 'Por favor intenta nuevamente más tarde.',
        });
      }

      throw error;
    }
  };

  return {
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    requestNotification,
  };
}
