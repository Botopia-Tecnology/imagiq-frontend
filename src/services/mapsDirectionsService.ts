/**
 * @module MapsDirectionsService
 * @description Servicio para calcular rutas usando el backend (Directions API)
 * La clave de Google Maps Directions API está en el backend, no en el frontend
 */

import { apiPost } from '@/lib/api-client';

export type TransportMode = 'driving' | 'walking' | 'bicycling';

export interface RouteRequest {
  origin: {
    lat: number;
    lng: number;
  } | string;
  destination: {
    lat: number;
    lng: number;
  } | string;
  mode: TransportMode;
}

export interface RouteLeg {
  distance: {
    text: string;
    value: number; // en metros
  };
  duration: {
    text: string;
    value: number; // en segundos
  };
  start_location: {
    lat: number;
    lng: number;
  };
  end_location: {
    lat: number;
    lng: number;
  };
  steps: Array<{
    polyline: {
      points: string;
    };
    start_location: {
      lat: number;
      lng: number;
    };
    end_location: {
      lat: number;
      lng: number;
    };
  }>;
}

export interface RouteResponse {
  success: boolean;
  data?: {
    routes: Array<{
      legs: RouteLeg[];
      overview_polyline: {
        points: string;
      };
      bounds: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
      };
    }>;
    status: string;
  };
  error?: string;
  message?: string;
}

/**
 * Calcula una ruta entre dos puntos usando el backend
 * @param request - Parámetros de la ruta (origen, destino, modo de transporte)
 * @returns Datos de la ruta calculada
 */
export async function calculateRoute(request: RouteRequest): Promise<RouteResponse> {
  try {
    const response = await apiPost<RouteResponse>('/api/addresses/maps/directions', request);
    return response;
  } catch (error) {
    console.error('Error calculando ruta:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al calcular la ruta',
    };
  }
}

