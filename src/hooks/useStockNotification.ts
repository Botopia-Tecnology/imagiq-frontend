'use client';

import { useState } from 'react';
import { useAuthContext } from '@/features/auth/context';
import { toast } from 'sonner';

interface StockNotificationData {
  productName: string;
  productId?: string;
  email: string;
  color?: string;
  storage?: string;
}

export function useStockNotification() {
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const requestNotification = async (data: StockNotificationData) => {
    try {
      // TODO: Implementar llamada al backend cuando esté disponible
      // Por ahora, simulamos una petición exitosa
      console.log('📧 Solicitud de notificación de stock:', {
        ...data,
        userId: user?.id,
        requestedAt: new Date().toISOString(),
      });

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mostrar mensaje de éxito
      toast.success('¡Notificación registrada!', {
        description: `Te avisaremos a ${data.email} cuando ${data.productName} esté disponible.`,
        duration: 5000,
      });

      return { success: true };
    } catch (error) {
      console.error('Error al registrar notificación:', error);
      toast.error('Error al registrar la notificación', {
        description: 'Por favor intenta nuevamente más tarde.',
      });
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
