# 🛠️ Modo Mantenimiento

## Descripción

El modo mantenimiento permite mostrar una pantalla de espera elegante a los usuarios cuando el sitio está en mantenimiento o actualización. La pantalla tiene un diseño inspirado en Samsung: minimalista, futurista y con animaciones fluidas.

## Características

- ✨ **Diseño Samsung**: Minimalista, futurista y profesional
- 🎨 **Animaciones fluidas**: Partículas flotantes, gradientes animados y efectos de brillo
- 📱 **Responsive**: Se adapta perfectamente a todos los dispositivos
- ⚡ **Performance optimizado**: Animaciones CSS puras sin impacto en rendimiento
- 🌙 **Dark mode**: Diseño oscuro con acentos azules

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
// Línea ~87
<h1 className="...">
  Estamos trabajando  {/* Cambia este texto */}
</h1>

// Línea ~90
<h2 className="...">
  en una nueva experiencia  {/* Cambia este texto */}
</h2>

// Línea ~96
<p className="...">
  Estamos preparando algo especial...  {/* Cambia este texto */}
</p>
```

### Modificar las características

Edita el array de características en la línea ~119:

```tsx
const features = [
  { icon: "🎁", title: "Tu título", desc: "Tu descripción" },
  // Agrega más...
];
```

### Cambiar colores

Los colores principales están en Tailwind:
- `blue-500`: Color principal
- `gray-950`: Fondo oscuro
- Busca todas las clases `text-blue-*` y `bg-blue-*` para cambiar el esquema

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
