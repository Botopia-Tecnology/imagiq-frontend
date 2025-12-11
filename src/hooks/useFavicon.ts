import { useEffect } from 'react'
import { useLogos } from './useLogos'

/**
 * Hook para actualizar el favicon dinámicamente
 * Similar a cómo se cargan los banners
 */
export function useFavicon() {
  const { favicon, loading } = useLogos()

  useEffect(() => {
    if (loading || !favicon?.image_url) {
      console.log('⏳ [useFavicon] Esperando favicon...', { loading, favicon: favicon?.image_url })
      return
    }

    console.log('🎯 [useFavicon] Actualizando favicon:', favicon.image_url)

    // ELIMINAR todos los favicons existentes (incluyendo el de Next.js)
    const existingLinks = document.querySelectorAll("link[rel*='icon']")
    console.log(`🗑️ [useFavicon] Eliminando ${existingLinks.length} favicon(s) existente(s)`)
    existingLinks.forEach((link) => link.remove())

    // Crear un NUEVO favicon con el URL dinámico
    const newLink = document.createElement('link')
    newLink.rel = 'icon'
    newLink.type = 'image/png' // Especificar tipo PNG
    newLink.href = favicon.image_url
    document.head.appendChild(newLink)
    console.log('✅ [useFavicon] Favicon dinámico creado:', favicon.image_url)

    // También crear shortcut icon para mayor compatibilidad
    const shortcutLink = document.createElement('link')
    shortcutLink.rel = 'shortcut icon'
    shortcutLink.type = 'image/png'
    shortcutLink.href = favicon.image_url
    document.head.appendChild(shortcutLink)
    console.log('✅ [useFavicon] Shortcut icon creado')
  }, [favicon, loading])

  return { favicon, loading }
}
