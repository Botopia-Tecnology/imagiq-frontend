import { apiClient } from "@/lib/api"

export interface Logo {
  id: string
  name: "header-logo-dark" | "header-logo-light" | "favicon"
  image_url: string | null
  status: string
  width: number
  height: number
  alt_text: string
  created_at: string
  updated_at: string
}

class LogosService {
  private cache: Logo[] | null = null
  private cacheTimestamp: number = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutos (igual que banners)

  /**
   * Obtener todos los logos activos
   */
  async getAllLogos(): Promise<Logo[]> {
    // Verificar si el caché es válido
    const now = Date.now()
    if (this.cache && now - this.cacheTimestamp < this.CACHE_TTL) {
      return this.cache
    }

    try {
      const response = await apiClient.get<Logo[]>("/api/multimedia/logos")

      // El API devuelve directamente el array (no envuelto en { data: [...] })
      // Verificar si viene en response.data o directamente
      let logos: Logo[] = []

      if (Array.isArray(response.data)) {
        logos = response.data
      } else if (Array.isArray(response)) {
        logos = response as unknown as Logo[]
      } else {
        return []
      }

      // Actualizar caché
      this.cache = logos
      this.cacheTimestamp = now

      return this.cache
    } catch (error) {
      return []
    }
  }

  /**
   * Obtener logo por nombre
   */
  async getLogoByName(name: "header-logo-dark" | "header-logo-light" | "favicon"): Promise<Logo | null> {
    try {
      const response = await apiClient.get<Logo>(`/api/multimedia/logo/${name}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching logo ${name}:`, error)
      return null
    }
  }

  /**
   * Limpiar caché (útil para forzar recarga)
   */
  clearCache(): void {
    this.cache = null
    this.cacheTimestamp = 0
  }
}

// Exportar instancia singleton
export const logosService = new LogosService()
