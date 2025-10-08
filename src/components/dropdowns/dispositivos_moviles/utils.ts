import { SIZES } from "./constants";

export const getPromoImageSize = (title: string): number => {
  if (title === "Descubre los dispositivos móviles") return SIZES.promo.large;
  if (title === "Galaxy AI" || title === "One UI") return SIZES.promo.small;
  if (title === "Samsung Health") return SIZES.promo.large;
  if (title === "¿Por qué elegir Galaxy?") return SIZES.promo.small;
  return SIZES.promo.default;
};
