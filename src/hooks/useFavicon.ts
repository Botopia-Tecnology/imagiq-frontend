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
      console.log('⏳ [useFavicon] Esperando favicon...', { loading, favicon: favicon?.image_url })
      return
    }

    console.log('🎯 [useFavicon] Actualizando favicon:', favicon.image_url)

    // 🔧 SOLUCIÓN ROBUSTA: Query y update (sin remove)
    // Esto previene race conditions con React 19 concurrent rendering
    let iconLink: HTMLLinkElement | null = document.querySelector("link[rel='icon']")

    if (!iconLink) {
      iconLink = document.createElement('link')
      iconLink.rel = 'icon'
      document.head.appendChild(iconLink)
      console.log('✅ [useFavicon] Nuevo link[rel=icon] creado')
    } else {
      console.log('🔄 [useFavicon] Reutilizando link[rel=icon] existente')
    }

    iconLink.type = 'image/png'
    iconLink.href = favicon.image_url

    // También actualizar shortcut icon para mayor compatibilidad
    let shortcutLink: HTMLLinkElement | null = document.querySelector("link[rel='shortcut icon']")

    if (!shortcutLink) {
      shortcutLink = document.createElement('link')
      shortcutLink.rel = 'shortcut icon'
      document.head.appendChild(shortcutLink)
      console.log('✅ [useFavicon] Nuevo shortcut icon creado')
    } else {
      console.log('🔄 [useFavicon] Reutilizando shortcut icon existente')
    }

    shortcutLink.type = 'image/png'
    shortcutLink.href = favicon.image_url

    console.log('✅ [useFavicon] Favicon actualizado exitosamente')

  }, [favicon?.image_url, loading]) // Dependencias específicas

  return { favicon, loading }
}
