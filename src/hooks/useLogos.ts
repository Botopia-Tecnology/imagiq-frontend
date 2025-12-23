import { useState, useEffect } from "react"
import { logosService, type Logo } from "@/services/logos.service"

interface UseLogosReturn {
  logoDark: Logo | null
  logoLight: Logo | null
  favicon: Logo | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook para cargar logos del header y favicon
 * Similar a useHeroBanner y useDynamicBanner
 */
export function useLogos(): UseLogosReturn {
  const [logoDark, setLogoDark] = useState<Logo | null>(null)
  const [logoLight, setLogoLight] = useState<Logo | null>(null)
  const [favicon, setFavicon] = useState<Logo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLogos = async () => {
    try {
      setLoading(true)
      setError(null)

      // Cargar todos los logos de una vez
      const logos = await logosService.getAllLogos()

      // Filtrar por nombre
      const dark = logos.find((logo) => logo.name === "header-logo-dark") || null
      const light = logos.find((logo) => logo.name === "header-logo-light") || null
      const fav = logos.find((logo) => logo.name === "favicon") || null

      setLogoDark(dark)
      setLogoLight(light)
      setFavicon(fav)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error desconocido"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogos()
  }, [])

  return {
    logoDark,
    logoLight,
    favicon,
    loading,
    error,
    refetch: fetchLogos,
  }
}
