import { useRef, useCallback, useEffect, useState } from "react";
import { tradeInEndpoints } from "@/lib/api";
import { type CartProduct, type BundleInfo } from "@/hooks/useCart";

// Shared state module-level cache to persist across component unmounts/remounts (Step 1 <-> Step 3)
const globalVerifiedSkus = new Set<string>();
const globalFailedSkus = new Set<string>();
const globalTradeInResults: Record<string, number> = {};

interface UseTradeInVerificationProps {
    products: CartProduct[];
    onVerificationComplete?: () => void;
}

export function useTradeInVerification({
    products,
    onVerificationComplete,
}: UseTradeInVerificationProps) {
    const [loadingSkus, setLoadingSkus] = useState<Set<string>>(new Set());
    const processingRef = useRef<boolean>(false);

    // Helper to check if a product needs verification
    const needsVerification = useCallback((product: CartProduct) => {
        // If it's a bundle
        if (product.bundleInfo?.productSku) {
            if (product.bundleInfo.ind_entre_estre !== undefined) return false;
            const key = product.bundleInfo.productSku;
            return !globalVerifiedSkus.has(key) && !globalFailedSkus.has(key);
        }
        // If it's a regular product
        if (product.indRetoma !== undefined) return false;
        const key = product.sku;
        return !globalVerifiedSkus.has(key) && !globalFailedSkus.has(key);
    }, []);

    const verifyProducts = useCallback(async () => {
        if (processingRef.current || products.length === 0) return;

        // Identify items that truly need verification
        const itemsToVerify = products.filter(needsVerification);

        if (itemsToVerify.length === 0) {
            onVerificationComplete?.();
            return;
        }

        // Deduplicate SKUs to verify
        const uniqueKeysToVerify = new Set<string>();
        const payload: { key: string; isBundle: boolean }[] = [];

        itemsToVerify.forEach((p) => {
            const key = p.bundleInfo?.productSku ?? p.sku;
            const isBundle = !!p.bundleInfo?.productSku;

            if (!uniqueKeysToVerify.has(key)) {
                uniqueKeysToVerify.add(key);
                payload.push({ key, isBundle });
            }
        });

        if (payload.length === 0) {
            onVerificationComplete?.();
            return;
        }

        processingRef.current = true;
        setLoadingSkus(uniqueKeysToVerify);

        try {
            // Execute in parallel with a concurrency limit (e.g., 5)
            // Although we only have a few items usually, parallel is better than sequential + delay
            const BATCH_SIZE = 5;
            const results: { key: string; isBundle: boolean; indRetoma: number | null }[] = [];

            for (let i = 0; i < payload.length; i += BATCH_SIZE) {
                const batch = payload.slice(i, i + BATCH_SIZE);

                const batchPromises = batch.map(async (item) => {
                    try {
                        // Check cache again just in case (race conditions)
                        if (globalVerifiedSkus.has(item.key)) {
                            return { ...item, indRetoma: globalTradeInResults[item.key] ?? 0 };
                        }

                        const response = await tradeInEndpoints.checkSkuForTradeIn({ sku: item.key });

                        if (response.success && response.data) {
                            const indRetoma = response.data.indRetoma ?? (response.data.aplica ? 1 : 0);
                            globalVerifiedSkus.add(item.key);
                            globalFailedSkus.delete(item.key);
                            globalTradeInResults[item.key] = indRetoma;
                            return { ...item, indRetoma };
                        } else {
                            globalFailedSkus.add(item.key);
                            // If failed, we assume 0 or handle error, here we mark as verifying finished but failed
                            return { ...item, indRetoma: null };
                        }
                    } catch (error) {
                        console.error(`Error verifying Trade-In for ${item.key}:`, error);
                        globalFailedSkus.add(item.key);
                        return { ...item, indRetoma: null };
                    }
                });

                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);
            }

            // Update LocalStorage once with all results
            if (results.some(r => r.indRetoma !== null)) {
                updateLocalStorage(results.filter(r => r.indRetoma !== null) as any);
            }

        } finally {
            setLoadingSkus(new Set());
            processingRef.current = false;
            onVerificationComplete?.();
        }
    }, [products, needsVerification, onVerificationComplete]);

    // Trigger verification when products change
    useEffect(() => {
        verifyProducts();
    }, [verifyProducts]);

    // Function to manually retry or force verify
    const forceVerify = useCallback(() => {
        verifyProducts();
    }, [verifyProducts]);

    return {
        loadingSkus,
        forceVerify
    };
}

// Helper to update LocalStorage efficiently
function updateLocalStorage(updates: { key: string; isBundle: boolean; indRetoma: number }[]) {
    try {
        const storedItems = localStorage.getItem("cart-items");
        if (!storedItems) return;

        let cartItems = JSON.parse(storedItems) as any[];
        let changed = false;

        updates.forEach(({ key, isBundle, indRetoma }) => {
            cartItems = cartItems.map(item => {
                if (isBundle && item.bundleInfo?.productSku === key) {
                    if (item.bundleInfo.ind_entre_estre !== indRetoma) {
                        changed = true;
                        return {
                            ...item,
                            bundleInfo: { ...item.bundleInfo, ind_entre_estre: indRetoma }
                        };
                    }
                } else if (!isBundle && item.sku === key) {
                    if (item.indRetoma !== indRetoma) {
                        changed = true;
                        return { ...item, indRetoma };
                    }
                }
                return item;
            });
        });

        if (changed) {
            localStorage.setItem("cart-items", JSON.stringify(cartItems));
            window.dispatchEvent(new CustomEvent("localStorageChange", { detail: { key: "cart-items" } }));
            window.dispatchEvent(new Event("storage"));
        }
    } catch (e) {
        console.error("Error updating cart items in localStorage:", e);
    }
}
