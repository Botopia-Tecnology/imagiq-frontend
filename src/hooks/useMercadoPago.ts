import { useEffect, useState } from 'react';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export const useMercadoPago = (publicKey: string) => {
  const [mp, setMp] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if public key is provided
    if (!publicKey) {
      setError('Mercado Pago public key is not configured');
      return;
    }

    // Check if SDK is already loaded
    if (window.MercadoPago) {
      try {
        const mercadopago = new window.MercadoPago(publicKey, {
          locale: 'es-CO',
        });
        setMp(mercadopago);
        setIsLoaded(true);
      } catch (err) {
        setError('Failed to initialize Mercado Pago SDK');
        console.error(err);
      }
      return;
    }

    // Load Mercado Pago SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;

    script.onload = () => {
      try {
        const mercadopago = new window.MercadoPago(publicKey, {
          locale: 'es-CO',
        });
        setMp(mercadopago);
        setIsLoaded(true);
      } catch (err) {
        setError('Failed to initialize Mercado Pago SDK');
        console.error(err);
      }
    };

    script.onerror = () => {
      setError('Failed to load Mercado Pago SDK');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [publicKey]);

  /**
   * Create a card token using Mercado Pago SDK
   * This should be called from the frontend before sending to backend
   */
  const createCardToken = async (cardData: {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }) => {
    if (!mp) {
      throw new Error('Mercado Pago SDK not loaded');
    }

    try {
      const token = await mp.createCardToken(cardData);
      return token;
    } catch (error) {
      console.error('Mercado Pago tokenization error:', error);
      throw error;
    }
  };

  return { mp, isLoaded, error, createCardToken };
};
