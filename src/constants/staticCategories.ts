export const STATIC_CATEGORY_UUIDS = ['ofertas', 'tiendas', 'soporte'] as const;

export type StaticCategoryUuid = typeof STATIC_CATEGORY_UUIDS[number];

export const isStaticCategoryUuid = (uuid?: string): boolean => {
  return !!uuid && (STATIC_CATEGORY_UUIDS as readonly string[]).includes(uuid);
};


