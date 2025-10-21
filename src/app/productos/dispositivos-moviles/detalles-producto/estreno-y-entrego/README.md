# Estreno y Entrego (Trade-In) Feature

Sistema modular de trade-in (intercambio de dispositivos) completamente configurable mediante datos dinámicos.

## Estructura de Archivos

```
estreno-y-entrego/
├── index.ts                      # Barrel exports
├── types.ts                      # TypeScript interfaces
├── mockData.ts                   # Datos de ejemplo (reemplazar con API)
├── README.md                     # Documentación
├── DeviceIcons.tsx              # Iconos de dispositivos
├── DeviceCategorySelector.tsx   # Selector de categoría
├── BrandDropdown.tsx            # Dropdown de marcas
├── SimpleDropdown.tsx           # Dropdown genérico reutilizable
├── TradeInInformation.tsx       # Información del proceso
├── TradeInModal.tsx             # Modal principal
└── TradeInSelector.tsx          # Selector SÍ/NO
```

## Uso Básico

```tsx
import { TradeInModal, TradeInSelector } from './estreno-y-entrego';

function ProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <TradeInSelector
        isSelected={false}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <TradeInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContinue={() => console.log('Usuario continuó')}
      />
    </>
  );
}
```

## Integración con Dashboard

### 1. Estructura de Datos

El sistema utiliza la siguiente estructura de tipos (ver `types.ts`):

```typescript
interface TradeInData {
  categories: DeviceCategory[];
  brands: Brand[];
  models: DeviceModel[];
  capacities: DeviceCapacity[];
}
```

### 2. Reemplazar Mock Data con API

Actualmente el sistema usa datos de prueba de `mockData.ts`. Para conectar con el dashboard:

#### Opción A: Pasar datos como prop

```tsx
import { TradeInModal } from './estreno-y-entrego';
import type { TradeInData } from './estreno-y-entrego';

function ProductPage() {
  const [tradeInData, setTradeInData] = useState<TradeInData | null>(null);

  useEffect(() => {
    // Cargar datos desde API
    fetch('/api/trade-in/data')
      .then(res => res.json())
      .then(data => setTradeInData(data));
  }, []);

  return (
    <TradeInModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onContinue={handleContinue}
      tradeInData={tradeInData} // Pasar datos desde API
    />
  );
}
```

#### Opción B: Crear custom hook

```tsx
// hooks/useTradeInData.ts
import { useState, useEffect } from 'react';
import type { TradeInData } from './estreno-y-entrego';

export function useTradeInData() {
  const [data, setData] = useState<TradeInData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/trade-in/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

// Uso:
function ProductPage() {
  const { data, loading } = useTradeInData();

  if (loading) return <div>Cargando...</div>;

  return (
    <TradeInModal
      tradeInData={data}
      // ... otros props
    />
  );
}
```

### 3. Endpoints Recomendados

```
GET /api/trade-in/categories
Response: DeviceCategory[]

GET /api/trade-in/brands?categoryId={id}
Response: Brand[]

GET /api/trade-in/models?brandId={id}&categoryId={id}
Response: DeviceModel[]

GET /api/trade-in/capacities?modelId={id}
Response: DeviceCapacity[]
```

### 4. Ejemplo de Respuesta de API

```json
{
  "categories": [
    {
      "id": "smartphone",
      "name": "SMARTPHONE",
      "icon": "smartphone",
      "minPrice": 100000,
      "maxPrice": 2518500
    }
  ],
  "brands": [
    {
      "id": "apple",
      "name": "Apple",
      "maxDiscount": 551900
    }
  ],
  "models": [
    {
      "id": "iphone-15-pro",
      "name": "iPhone 15 Pro",
      "brandId": "apple",
      "categoryId": "smartphone"
    }
  ],
  "capacities": [
    {
      "id": "iphone-15-pro-256gb",
      "name": "256GB",
      "modelId": "iphone-15-pro",
      "tradeInValue": 2200000
    }
  ]
}
```

## Características

### Filtrado Automático
- Las marcas se filtran según la categoría seleccionada
- Los modelos se filtran según marca y categoría
- Las capacidades se filtran según el modelo

### Reset Automático
- Al cambiar categoría, se resetean marca, modelo y capacidad
- Al cambiar marca, se resetean modelo y capacidad
- Al cambiar modelo, se resetea capacidad

### Validación
- El dropdown de modelos está deshabilitado hasta que se seleccione una marca
- El dropdown de capacidades está deshabilitado hasta que se seleccione un modelo

### Formato de Precios
- Los precios se formatean automáticamente con separadores de miles (formato colombiano)
- Ejemplo: `2518500` → `"$ 2.518.500"`

## Personalización

### Cambiar Datos por Defecto

Editar `mockData.ts` para agregar más categorías, marcas, modelos o capacidades.

### Agregar Nuevos Campos

1. Actualizar interfaces en `types.ts`
2. Actualizar mock data en `mockData.ts`
3. Actualizar componentes según sea necesario

### Estilos

Todos los componentes usan Tailwind CSS. Los colores principales son:
- Azul principal: `#0099FF`
- Fondo azul claro: `#F0F8FF`
- Texto oscuro: `#222`

## Buenas Prácticas

- ✅ Todos los archivos están bajo 250 líneas
- ✅ Un componente = una responsabilidad
- ✅ TypeScript estricto (sin `any`)
- ✅ Componentes reutilizables (SimpleDropdown)
- ✅ Separación de lógica y presentación
- ✅ Props tipadas con interfaces
- ✅ Datos configurables externamente

## Próximos Pasos

1. **Conectar con API real del dashboard**
   - Reemplazar `mockData.ts` con llamadas a API
   - Implementar loading states
   - Implementar error handling

2. **Guardar selección del usuario**
   - Enviar datos a backend cuando el usuario presiona "Continuar"
   - Integrar con sistema de carrito de compras
   - Aplicar descuento al precio final del producto

3. **Mejorar UX**
   - Agregar skeleton loaders mientras cargan datos
   - Agregar animaciones entre cambios de selección
   - Mostrar valor de trade-in calculado en tiempo real

4. **Testing**
   - Unit tests para funciones helper
   - Integration tests para flujo completo
   - E2E tests para modal

## Soporte

Para preguntas o issues, consultar con el equipo de desarrollo.
