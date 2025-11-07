'use client';

import { useState } from 'react';
import { useAuthContext } from '@/features/auth/context';
import { toast } from 'sonner';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface StockNotificationData {
  productName: string; // Solo para mostrar en el toast
  email: string;
  sku?: string;
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

      // Preparar datos según la especificación del backend
      const payload = {
        sku: data.sku,
        email: data.email,
        userId: user?.id || null,
      };

      console.log('📧 Enviando solicitud de notificación de stock:', payload);

      // Construir URL completa con la base del API
      const url = `${API_BASE_URL}/api/messaging/notification`;

      console.log('🌐 URL completa:', url);

      // Llamar al endpoint del backend
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Manejar respuestas según la especificación del backend
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          statusCode: response.status,
          message: 'Error al registrar la notificación',
          error: 'Error desconocido'
        }));

        // Caso 1: Email ya registrado para este producto (400)
        if (response.status === 400 &&
            (errorData.message === 'Ya existe una notificación registrada para este producto y email' ||
             errorData.message?.includes('Ya existe'))) {
          toast.info('Ya registramos tu email', {
            description: 'Ya te notificaremos cuando este producto esté disponible.',
            duration: 5000,
          });
          return { success: true, duplicate: true };
        }

        // Caso 2: Email inválido (400)
        if (response.status === 400 &&
            (Array.isArray(errorData.message) && errorData.message.includes('email must be an email'))) {
          throw new Error('Por favor ingresa un email válido');
        }

        // Caso 3: SKU vacío (400)
        if (response.status === 400 &&
            (Array.isArray(errorData.message) && errorData.message.includes('sku should not be empty'))) {
          throw new Error('No se pudo identificar el producto seleccionado');
        }

        // Caso 4: Otros errores de validación (400)
        if (response.status === 400 && Array.isArray(errorData.message)) {
          throw new Error(errorData.message.join(', '));
        }

        // Caso 5: Error del servidor (500)
        if (response.status === 500) {
          throw new Error('Error del servidor. Por favor intenta nuevamente más tarde.');
        }

        // Otros errores
        throw new Error(
          typeof errorData.message === 'string'
            ? errorData.message
            : 'Error al registrar la notificación'
        );
      }

      const result = await response.json();

      // Mostrar mensaje de éxito según respuesta del backend
      toast.success('¡Notificación registrada!', {
        description: `Te avisaremos a ${data.email} cuando ${data.productName} esté disponible.`,
        duration: 5000,
      });

      return { success: true, data: result };
    } catch (error) {
      console.error('Error al registrar notificación:', error);

      // No mostrar toast si ya se mostró uno (caso de duplicado)
      if (error instanceof Error && !error.message.includes('Ya existe')) {
        toast.error('Error al registrar la notificación', {
          description: error.message || 'Por favor intenta nuevamente más tarde.',
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
