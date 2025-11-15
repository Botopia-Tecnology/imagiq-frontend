# 🛠️ Modo Mantenimiento

## Descripción

El modo mantenimiento permite mostrar una pantalla de espera elegante a los usuarios cuando el sitio está en mantenimiento o actualización. La pantalla tiene el auténtico diseño de Samsung: **blanco y negro, minimalista, con sombras sutiles**.

## Características

- ⚪ **Diseño Samsung Real**: Blanco y negro, minimalista y limpio
- 🎨 **Sombras dinámicas**: Efectos sutiles de blur en gris
- 📱 **Responsive**: Se adapta perfectamente a todos los dispositivos
- 🛍️ **Productos reales**: Muestra 4 productos Samsung desde el backend
- ⚡ **Performance optimizado**: Animaciones CSS puras sin impacto en rendimiento
- 📧 **Notificaciones**: Sistema de email para avisar cuando vuelva el sitio

## Cómo activar/desactivar

### Opción 1: Variable de entorno (Recomendado)

1. **En desarrollo local**: Edita tu archivo `.env.local`:
   ```bash
   NEXT_PUBLIC_MAINTENANCE_MODE=true  # Activar
   NEXT_PUBLIC_MAINTENANCE_MODE=false # Desactivar
   ```

2. **En producción (Vercel)**:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Agrega/edita: `NEXT_PUBLIC_MAINTENANCE_MODE` = `true`
   - Redeploy el proyecto

3. **En producción (otras plataformas)**:
   - Configura la variable de entorno en tu plataforma
   - Asegúrate de que sea una variable pública (prefijo `NEXT_PUBLIC_`)
   - Redeploy

### Opción 2: Build-time

Si necesitas activar el modo mantenimiento durante el build:

```bash
NEXT_PUBLIC_MAINTENANCE_MODE=true npm run build
```

## Personalización

### Modificar el mensaje

Edita el archivo `src/components/MaintenanceScreen.tsx`:

```tsx
// Header (línea ~153)
<h1 className="...">
  SAMSUNG STORE  {/* Cambia el título principal */}
</h1>

// Mensaje principal (línea ~167)
<h2 className="...">
  Estamos trabajando
  <br />
  <span className="font-bold">en algo especial</span>
</h2>

// Subtítulo (línea ~173)
<p className="...">
  Nuestro equipo está preparando una experiencia renovada.
  <br />
  Vuelve pronto para descubrir las mejores ofertas.
</p>
```

### Modificar los productos mostrados

Edita el array de SKUs en la línea ~63:

```tsx
const skus = [
  "SM-F966BDBJCOO",  // Galaxy Z Fold6
  "SM-F766BDBKCOO",  // Galaxy Z Flip6
  "SM-X930NZADCOO",  // Galaxy Tab S10+
  "SM-L705FZB1COO",  // Galaxy Watch Ultra
  // Agrega o reemplaza con otros SKUs...
];
```

Los productos se obtienen automáticamente del backend usando estos SKUs.

### Diseño y colores

El diseño usa la auténtica filosofía Samsung:
- Fondo: `bg-white` (blanco puro)
- Texto principal: `text-black`
- Bordes: `border-gray-200`
- Hover: `border-black` con `shadow-2xl`
- Botones: `bg-black` con `hover:bg-gray-900`
- Sombras dinámicas: `bg-gray-900/5` con `blur-3xl`

### Cambiar animaciones

Las animaciones están definidas en el bloque `<style jsx>` al final del componente. Puedes modificar:
- Velocidad: Cambia los valores de `duration` en las animaciones
- Movimiento: Modifica los keyframes `@keyframes`

## Estructura del componente

```
src/
├── components/
│   └── MaintenanceScreen.tsx  # Pantalla principal
└── app/
    └── layout.tsx              # Lógica condicional
```

## Comportamiento

Cuando `NEXT_PUBLIC_MAINTENANCE_MODE=true`:
- ✅ Se muestra la pantalla de mantenimiento
- ❌ No se cargan providers ni contextos de la app
- ❌ No se muestra navbar, footer ni chatbot
- ✅ Analytics y Sentry siguen funcionando
- ✅ Usuarios no pueden acceder a ninguna página

## Testing local

```bash
# 1. Activar modo mantenimiento
echo "NEXT_PUBLIC_MAINTENANCE_MODE=true" >> .env.local

# 2. Reiniciar servidor
npm run dev

# 3. Visita http://localhost:3000
# Deberías ver la pantalla de mantenimiento

# 4. Desactivar
echo "NEXT_PUBLIC_MAINTENANCE_MODE=false" >> .env.local
npm run dev
```

## Checklist pre-activación en producción

Antes de activar el modo mantenimiento en producción:

- [ ] El mensaje está personalizado para tu caso de uso
- [ ] El email de contacto es correcto
- [ ] Has probado la pantalla en móvil y desktop
- [ ] Has notificado a los stakeholders
- [ ] Tienes un plan para desactivarlo
- [ ] Has configurado la variable en tu plataforma de hosting

## Solución de problemas

### No se muestra la pantalla

1. Verifica que la variable esté configurada correctamente:
   ```bash
   echo $NEXT_PUBLIC_MAINTENANCE_MODE
   ```

2. Asegúrate de usar el prefijo `NEXT_PUBLIC_`

3. Reinicia el servidor de desarrollo

4. Limpia el cache de Next.js:
   ```bash
   rm -rf .next
   npm run dev
   ```

### La variable no se actualiza en producción

- Recuerda que necesitas **redeploy** después de cambiar variables de entorno
- En Vercel: Settings → Environment Variables → Redeploy

### Animaciones con lag

- Las animaciones usan CSS puro, no deberían tener lag
- Si hay lag, verifica el rendimiento del dispositivo
- Puedes reducir el número de partículas en línea ~23

## Soporte

Si tienes problemas, consulta:
- [Documentación de Next.js sobre variables de entorno](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Documentación de Vercel sobre environment variables](https://vercel.com/docs/projects/environment-variables)
