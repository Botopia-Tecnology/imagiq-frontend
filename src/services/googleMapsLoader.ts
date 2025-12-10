/**
 * @module GoogleMapsLoader
 * @description Servicio singleton para cargar Google Maps una sola vez
 * Evita duplicados y gestiona la carga de forma centralizada
 */

import { apiGet } from '@/lib/api-client';
import { decryptGoogleMapsScript } from '@/utils/mapsDecryption';

// Declaraciones de tipos para Google Maps
type GoogleMapsNamespace = {
  maps?: Record<string, unknown>;
};

declare global {
  interface Window {
    google?: GoogleMapsNamespace;
    googleMapsPromise?: Promise<void>; // Promesa global para evitar cargas múltiples
  }
}

// Estado del loader
interface GoogleMapsLoaderState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  promise: Promise<void> | null;
}

class GoogleMapsLoaderService {
  private state: GoogleMapsLoaderState = {
    isLoaded: false,
    isLoading: false,
    error: null,
    promise: null
  };

  private listeners: Array<{
    onLoad?: () => void;
    onError?: (error: string) => void;
  }> = [];

  /**
   * Obtiene el script de Google Maps desde el backend
   * IMPORTANTE: La clave SIEMPRE debe venir encriptada desde el backend
   * La clave de Directions API está en el backend y no se expone al frontend
   */
  private async getGoogleMapsScript(): Promise<{ data: string; key: string }> {
    try {
      // Obtener script del backend (OBLIGATORIO)
      const scriptData = await apiGet<{ data: string; key: string }>('/api/addresses/maps/script');
      
      if (!scriptData.data || !scriptData.key) {
        throw new Error('El backend no retornó los datos requeridos');
      }

      return {
        data: scriptData.data,
        key: scriptData.key,
      };
    } catch (error) {
      console.error('❌ Error obteniendo script del backend:', error);
      throw new Error(
        `No se pudo obtener el script de Google Maps desde el backend. ` +
        `Verifica que el endpoint /api/addresses/maps/script esté disponible. ` +
        `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Carga Google Maps script de forma singleton
   */
  async load(): Promise<void> {
    // Si ya está cargado, retornar inmediatamente
    if (this.state.isLoaded && window.google && window.google.maps) {
      return Promise.resolve();
    }

    // Si ya hay una carga en progreso, retornar la promesa existente
    if (this.state.isLoading && this.state.promise) {
      return this.state.promise;
    }

    // Si hay un error previo, limpiar estado
    if (this.state.error) {
      this.state.error = null;
    }

    // Marcar como cargando
    this.state.isLoading = true;

    // Crear nueva promesa de carga
    this.state.promise = new Promise<void>(async (resolve, reject) => {
      try {
        // Verificar si Google Maps ya está disponible
        if (window.google && window.google.maps) {
          this.state.isLoaded = true;
          this.state.isLoading = false;
          this.notifyListeners('load');
          resolve();
          return;
        }

        // Verificar si ya hay un script cargándose
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          // Si ya existe un script, esperar a que se cargue
          existingScript.addEventListener('load', () => {
            this.state.isLoaded = true;
            this.state.isLoading = false;
            this.notifyListeners('load');
            resolve();
          });

          existingScript.addEventListener('error', () => {
            const error = 'Error cargando Google Maps desde script existente';
            this.state.error = error;
            this.state.isLoading = false;
            this.notifyListeners('error', error);
            reject(new Error(error));
          });

          return;
        }

        // Obtener script del backend (OBLIGATORIO)
        const { data, key } = await this.getGoogleMapsScript();
        
        let script: HTMLScriptElement;

        try {
          // Desencriptar el script
          const decryptedScript = decryptGoogleMapsScript(data, key);

          // Parsear el HTML y extraer el script tag
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = decryptedScript;
          const scriptElement = tempDiv.querySelector('script');

          if (!scriptElement || !scriptElement.src) {
            throw new Error('No se encontró un script tag válido en el HTML desencriptado');
          }

          script = document.createElement('script');
          script.src = scriptElement.src;
          script.async = scriptElement.async !== undefined ? scriptElement.async : true;
          script.defer = scriptElement.defer !== undefined ? scriptElement.defer : true;
        } catch (decryptError) {
          const error = `Error desencriptando script: ${(decryptError as Error).message}`;
          console.error('❌', error);
          this.state.error = error;
          this.state.isLoading = false;
          this.notifyListeners('error', error);
          reject(new Error(error));
          return;
        }

        script.onload = () => {
          if (window.google && window.google.maps) {
            this.state.isLoaded = true;
            this.state.isLoading = false;
            this.notifyListeners('load');
            resolve();
          } else {
            const error = 'Google Maps script cargado pero API no disponible';
            console.error('❌', error);
            this.state.error = error;
            this.state.isLoading = false;
            this.notifyListeners('error', error);
            reject(new Error(error));
          }
        };

        script.onerror = (event) => {
          console.error('❌ Error al cargar script de Google Maps:', event);
          const error = 'Error cargando Google Maps script. Verifica:\n' +
                       '• Conexión a internet\n' +
                       '• API key válida y con facturación habilitada\n' +
                       '• APIs habilitadas: Maps JavaScript API y Places API';
          this.state.error = error;
          this.state.isLoading = false;
          this.notifyListeners('error', error);
          reject(new Error(error));
        };

        // Agregar script al DOM
        document.head.appendChild(script);

      } catch (error) {
        const errorMessage = `Error obteniendo configuración de Google Maps: ${error}`;
        this.state.error = errorMessage;
        this.state.isLoading = false;
        this.notifyListeners('error', errorMessage);
        reject(new Error(errorMessage));
      }
    });

    return this.state.promise;
  }

  /**
   * Suscribirse a eventos de carga
   */
  subscribe(callbacks: {
    onLoad?: () => void;
    onError?: (error: string) => void;
  }): () => void {
    this.listeners.push(callbacks);

    // Si ya está cargado, notificar inmediatamente
    if (this.state.isLoaded) {
      callbacks.onLoad?.();
    } else if (this.state.error) {
      callbacks.onError?.(this.state.error);
    }

    // Retornar función de desuscripción
    return () => {
      const index = this.listeners.indexOf(callbacks);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notificar a todos los listeners
   */
  private notifyListeners(event: 'load' | 'error', error?: string) {
    this.listeners.forEach(listener => {
      if (event === 'load') {
        listener.onLoad?.();
      } else if (event === 'error') {
        listener.onError?.(error || 'Error desconocido');
      }
    });
  }

  /**
   * Obtener estado actual
   */
  getState(): GoogleMapsLoaderState {
    return { ...this.state };
  }

  /**
   * Verificar si Google Maps está disponible
   */
  isAvailable(): boolean {
    return this.state.isLoaded && !!(window.google && window.google.maps);
  }

  /**
   * Limpiar estado (útil para testing)
   */
  reset(): void {
    this.state = {
      isLoaded: false,
      isLoading: false,
      error: null,
      promise: null
    };
    this.listeners = [];
  }
}

// Crear instancia singleton
export const googleMapsLoader = new GoogleMapsLoaderService();

// Hook de React para usar el loader
export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = React.useState(googleMapsLoader.isAvailable());
  const [error, setError] = React.useState<string | null>(googleMapsLoader.getState().error);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (googleMapsLoader.isAvailable()) {
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);

    const unsubscribe = googleMapsLoader.subscribe({
      onLoad: () => {
        setIsLoaded(true);
        setError(null);
        setIsLoading(false);
      },
      onError: (error) => {
        setError(error);
        setIsLoaded(false);
        setIsLoading(false);
      }
    });

    // Iniciar carga
    googleMapsLoader.load().catch(console.error);

    return unsubscribe;
  }, []);

  return { isLoaded, error, isLoading };
}

// Para compatibilidad con imports existentes
import React from 'react';

export default googleMapsLoader;