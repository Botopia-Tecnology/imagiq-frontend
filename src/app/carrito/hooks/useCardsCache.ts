"use client";
import { useState, useCallback } from "react";
import { profileService } from "@/services/profile.service";
import { useAuthContext } from "@/features/auth/context";
import { DBCard, DecryptedCardData } from "@/features/profile/types";
import { encryptionService } from "@/lib/encryption";
import { checkZeroInterest } from "../utils";
import { CheckZeroInterestResponse } from "../types";

// Caché en memoria para las tarjetas
let cardsCache: {
  data: DBCard[] | null;
  timestamp: number;
  userId: string | null;
} = {
  data: null,
  timestamp: 0,
  userId: null,
};

// Caché en memoria para zero interest
let zeroInterestCache: {
  data: CheckZeroInterestResponse | null;
  timestamp: number;
  userId: string | null;
  cacheKey: string | null; // Para identificar qué se cacheó (cardIds + productSkus + total)
} = {
  data: null,
  timestamp: 0,
  userId: null,
  cacheKey: null,
};

// Tiempo de validez del caché (5 minutos)
const CACHE_DURATION = 5 * 60 * 1000;

export function useCardsCache() {
  const authContext = useAuthContext();
  const [savedCards, setSavedCards] = useState<DBCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [zeroInterestData, setZeroInterestData] = useState<CheckZeroInterestResponse | null>(null);
  const [isLoadingZeroInterest, setIsLoadingZeroInterest] = useState(false);

  // Verificar si el caché es válido
  const isCacheValid = useCallback(() => {
    const now = Date.now();
    return (
      cardsCache.data !== null &&
      cardsCache.userId === authContext.user?.id &&
      now - cardsCache.timestamp < CACHE_DURATION
    );
  }, [authContext.user?.id]);

  // Cargar tarjetas (con o sin caché)
  const loadSavedCards = useCallback(async (forceReload = false) => {
    if (!authContext.user?.id) {
      setSavedCards([]);
      return;
    }

    // Si el caché es válido y no se fuerza la recarga, usar caché
    if (!forceReload && isCacheValid() && cardsCache.data) {
      console.log("📦 Usando tarjetas desde caché");
      setSavedCards(cardsCache.data);
      return;
    }

    try {
      console.log("🔄 Cargando tarjetas desde API...");
      setIsLoadingCards(true);
      const encryptedCards =
        await profileService.getUserPaymentMethodsEncrypted(
          authContext.user?.id
        );

      const decryptedCards: DBCard[] = encryptedCards
        .map((encCard) => {
          const decrypted = encryptionService.decryptJSON<DecryptedCardData>(
            encCard.encryptedData
          );
          if (!decrypted) return null;

          return {
            id: decrypted.cardId as unknown as string,
            ultimos_dijitos: decrypted.last4Digits,
            marca: decrypted.brand?.toLowerCase() || undefined,
            banco: decrypted.banco || undefined,
            tipo_tarjeta: decrypted.tipo || undefined,
            es_predeterminada: false,
            activa: true,
            nombre_titular: decrypted.cardHolderName || undefined,
          } as DBCard;
        })
        .filter((card): card is DBCard => card !== null);

      // Actualizar caché
      cardsCache = {
        data: decryptedCards,
        timestamp: Date.now(),
        userId: authContext.user?.id || null,
      };

      setSavedCards(decryptedCards);
      console.log("✅ Tarjetas cargadas y guardadas en caché");
    } catch (error) {
      console.error("❌ Error cargando tarjetas:", error);
      setSavedCards([]);
      // No actualizar caché en caso de error
    } finally {
      setIsLoadingCards(false);
    }
  }, [authContext.user?.id, isCacheValid]);

  // Precargar tarjetas sin mostrar loading (para precarga anticipada)
  const preloadCards = useCallback(async () => {
    if (!authContext.user?.id) return;

    // Si ya hay caché válido, no hacer nada
    if (isCacheValid() && cardsCache.data) {
      console.log("📦 Caché de tarjetas ya válido, no es necesario precargar");
      return;
    }

    try {
      console.log("⚡ Precargando tarjetas en segundo plano...");
      const encryptedCards =
        await profileService.getUserPaymentMethodsEncrypted(
          authContext.user?.id
        );

      const decryptedCards: DBCard[] = encryptedCards
        .map((encCard) => {
          const decrypted = encryptionService.decryptJSON<DecryptedCardData>(
            encCard.encryptedData
          );
          if (!decrypted) return null;

          return {
            id: decrypted.cardId as unknown as string,
            ultimos_dijitos: decrypted.last4Digits,
            marca: decrypted.brand?.toLowerCase() || undefined,
            banco: decrypted.banco || undefined,
            tipo_tarjeta: decrypted.tipo || undefined,
            es_predeterminada: false,
            activa: true,
            nombre_titular: decrypted.cardHolderName || undefined,
          } as DBCard;
        })
        .filter((card): card is DBCard => card !== null);

      // Actualizar caché (pero no setSavedCards ya que es precarga)
      cardsCache = {
        data: decryptedCards,
        timestamp: Date.now(),
        userId: authContext.user?.id || null,
      };

      console.log("✅ Tarjetas precargadas exitosamente");
    } catch (error) {
      console.error("❌ Error precargando tarjetas:", error);
    }
  }, [authContext.user?.id, isCacheValid]);

  // Invalidar caché manualmente
  const invalidateCache = useCallback(() => {
    cardsCache = {
      data: null,
      timestamp: 0,
      userId: null,
    };
    zeroInterestCache = {
      data: null,
      timestamp: 0,
      userId: null,
      cacheKey: null,
    };
  }, []);

  // Generar clave de caché para zero interest
  const generateZeroInterestCacheKey = useCallback(
    (cardIds: string[], productSkus: string[], totalAmount: number) => {
      return `${cardIds.sort().join(",")}_${productSkus.sort().join(",")}_${totalAmount}`;
    },
    []
  );

  // Verificar si el caché de zero interest es válido
  const isZeroInterestCacheValid = useCallback(
    (cardIds: string[], productSkus: string[], totalAmount: number) => {
      const now = Date.now();
      const cacheKey = generateZeroInterestCacheKey(cardIds, productSkus, totalAmount);
      return (
        zeroInterestCache.data !== null &&
        zeroInterestCache.userId === authContext.user?.id &&
        zeroInterestCache.cacheKey === cacheKey &&
        now - zeroInterestCache.timestamp < CACHE_DURATION
      );
    },
    [authContext.user?.id, generateZeroInterestCacheKey]
  );

  // Cargar zero interest (con o sin caché)
  const loadZeroInterest = useCallback(
    async (cardIds: string[], productSkus: string[], totalAmount: number, forceReload = false) => {
      if (!authContext.user?.id || cardIds.length === 0) {
        setZeroInterestData(null);
        return;
      }

      // Si el caché es válido y no se fuerza la recarga, usar caché
      if (!forceReload && isZeroInterestCacheValid(cardIds, productSkus, totalAmount) && zeroInterestCache.data) {
        console.log("📦 Usando zero interest desde caché");
        setZeroInterestData(zeroInterestCache.data);
        return;
      }

      try {
        console.log("🔄 Cargando zero interest desde API...");
        setIsLoadingZeroInterest(true);
        const result = await checkZeroInterest({
          userId: authContext.user.id,
          cardIds,
          productSkus,
          totalAmount,
        });

        // Actualizar caché
        const cacheKey = generateZeroInterestCacheKey(cardIds, productSkus, totalAmount);
        zeroInterestCache = {
          data: result,
          timestamp: Date.now(),
          userId: authContext.user.id,
          cacheKey,
        };

        setZeroInterestData(result);
        console.log("✅ Zero interest cargado y guardado en caché");
      } catch (error) {
        console.error("❌ Error cargando zero interest:", error);
        setZeroInterestData(null);
      } finally {
        setIsLoadingZeroInterest(false);
      }
    },
    [authContext.user?.id, isZeroInterestCacheValid, generateZeroInterestCacheKey]
  );

  // Precargar zero interest sin mostrar loading
  const preloadZeroInterest = useCallback(
    async (cardIds: string[], productSkus: string[], totalAmount: number) => {
      if (!authContext.user?.id || cardIds.length === 0) return;

      // Si ya hay caché válido, no hacer nada
      if (isZeroInterestCacheValid(cardIds, productSkus, totalAmount) && zeroInterestCache.data) {
        console.log("📦 Caché de zero interest ya válido, no es necesario precargar");
        return;
      }

      try {
        console.log("⚡ Precargando zero interest en segundo plano...");
        const result = await checkZeroInterest({
          userId: authContext.user.id,
          cardIds,
          productSkus,
          totalAmount,
        });

        // Actualizar caché (pero no setZeroInterestData ya que es precarga)
        const cacheKey = generateZeroInterestCacheKey(cardIds, productSkus, totalAmount);
        zeroInterestCache = {
          data: result,
          timestamp: Date.now(),
          userId: authContext.user.id,
          cacheKey,
        };

        console.log("✅ Zero interest precargado exitosamente");
      } catch (error) {
        console.error("❌ Error precargando zero interest:", error);
      }
    },
    [authContext.user?.id, isZeroInterestCacheValid, generateZeroInterestCacheKey]
  );

  return {
    savedCards,
    isLoadingCards,
    loadSavedCards,
    preloadCards,
    invalidateCache,
    isCacheValid,
    zeroInterestData,
    isLoadingZeroInterest,
    loadZeroInterest,
    preloadZeroInterest,
  };
}
