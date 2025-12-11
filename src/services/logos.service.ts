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
      console.log("✅ [LogosService] Retornando logos desde caché:", this.cache.length)
      return this.cache
    }

    try {
      console.log("📡 [LogosService] Fetching logos desde API...")
      const response = await apiClient.get<Logo[]>("/api/multimedia/logos")

      console.log("📦 [LogosService] Response completo:", response)

      // El API devuelve directamente el array (no envuelto en { data: [...] })
      // Verificar si viene en response.data o directamente
      let logos: Logo[] = []

      if (Array.isArray(response.data)) {
        logos = response.data
      } else if (Array.isArray(response)) {
        logos = response as unknown as Logo[]
      } else {
        console.warn("⚠️ [LogosService] Respuesta inesperada del API:", response)
        return []
      }

      console.log("✅ [LogosService] Logos procesados:", logos.length, logos)

      // Actualizar caché
      this.cache = logos
      this.cacheTimestamp = now

      return this.cache
    } catch (error) {
      console.error("❌ [LogosService] Error fetching logos:", error)
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
