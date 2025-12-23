import { useEffect } from 'react'
import { useLogos } from './useLogos'

/**
 * Hook para actualizar el favicon dinámicamente
 * SOLUCIÓN: Query y update en lugar de remove/create
 * Esto previene race conditions con React 19 concurrent rendering
 */
export function useFavicon() {
  const { favicon, loading } = useLogos()

  useEffect(() => {
    if (loading || !favicon?.image_url) {
      return
    }

    // 🔧 SOLUCIÓN ROBUSTA: Query y update (sin remove)
    // Esto previene race conditions con React 19 concurrent rendering
    let iconLink: HTMLLinkElement | null = document.querySelector("link[rel='icon']")

    if (iconLink) {
      iconLink.type = 'image/png'
      iconLink.href = favicon.image_url
    } else {
      iconLink = document.createElement('link')
      iconLink.rel = 'icon'
      iconLink.type = 'image/png'
      iconLink.href = favicon.image_url
      document.head.appendChild(iconLink)
    }

    // También actualizar shortcut icon para mayor compatibilidad
    let shortcutLink: HTMLLinkElement | null = document.querySelector("link[rel='shortcut icon']")

    if (shortcutLink) {
      shortcutLink.type = 'image/png'
      shortcutLink.href = favicon.image_url
    } else {
      shortcutLink = document.createElement('link')
      shortcutLink.rel = 'shortcut icon'
      shortcutLink.type = 'image/png'
      shortcutLink.href = favicon.image_url
      document.head.appendChild(shortcutLink)
    }

  }, [favicon?.image_url, loading]) // Dependencias específicas

  return { favicon, loading }
}
