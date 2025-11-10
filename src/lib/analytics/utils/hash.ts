/**
 * Funciones de hashing SHA-256 para PII (Personally Identifiable Information)
 *
 * **Especificaciones**:
 * - Meta Pixel: SHA-256 hexadecimal lowercase
 * - TikTok Pixel: SHA-256 hexadecimal lowercase
 * - Normalización ANTES de hashear según Meta Advanced Matching guidelines
 *
 * **Referencias**:
 * - https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching
 * - https://ads.tiktok.com/marketing_api/docs?id=1739585700402178
 */

/**
 * Normaliza un email según estándares de Meta/TikTok
 * 1. Trim whitespace
 * 2. Convert to lowercase
 *
 * @param email - Email sin normalizar
 * @returns Email normalizado
 *
 * @example
 * normalizeEmail('  User@Example.COM  ') // => 'user@example.com'
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normaliza un teléfono según estándares de Meta/TikTok
 * 1. Remove all non-numeric characters EXCEPT leading +
 * 2. Must include country code (e.g., +57 for Colombia)
 *
 * @param phone - Teléfono sin normalizar
 * @returns Teléfono normalizado (solo dígitos con + opcional)
 *
 * @example
 * normalizePhone('+57 (300) 123-4567') // => '+573001234567'
 * normalizePhone('300 123 4567')       // => '3001234567' (falta country code!)
 */
export function normalizePhone(phone: string): string {
  // Preservar el + inicial si existe
  const hasPlus = phone.trim().startsWith('+');
  const digits = phone.replace(/[^\d]/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Genera SHA-256 hash en formato hexadecimal lowercase
 *
 * **Importante**: Normalizar el input ANTES de llamar esta función
 *
 * @param input - String a hashear (ya normalizado)
 * @returns Promise con el hash SHA-256 en hex lowercase
 *
 * @example
 * ```typescript
 * const input = 'user@example.com';
 * const hash = await sha256Hex(input);
 * // hash = 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514'
 * ```
 */
export async function sha256Hex(input: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    console.warn('[Analytics] SHA-256 not available (SSR or old browser), skipping hash');
    return '';
  }

  try {
    const enc = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
    return hashHex; // Ya es lowercase por defecto
  } catch (error) {
    console.error('[Analytics] Failed to hash with SHA-256:', error);
    return '';
  }
}

/**
 * Hashea un email para Advanced Matching
 *
 * @param email - Email sin hashear
 * @returns Promise con el hash SHA-256 en hex lowercase (o '' si está vacío)
 *
 * @example
 * ```typescript
 * const hashed = await hashEmail('User@Example.com');
 * // hashed = 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514'
 * ```
 */
export async function hashEmail(email: string): Promise<string> {
  if (!email || email.trim() === '') return '';
  const normalized = normalizeEmail(email);
  return sha256Hex(normalized);
}

/**
 * Hashea un teléfono para Advanced Matching
 *
 * **IMPORTANTE**: El teléfono debe incluir country code (+57 para Colombia)
 *
 * @param phone - Teléfono sin hashear
 * @returns Promise con el hash SHA-256 en hex lowercase (o '' si está vacío)
 *
 * @example
 * ```typescript
 * const hashed = await hashPhone('+573001234567');
 * // hashed = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
 * ```
 */
export async function hashPhone(phone: string): Promise<string> {
  if (!phone || phone.trim() === '') return '';
  const normalized = normalizePhone(phone);

  // Validar que tenga country code (debe empezar con +)
  if (!normalized.startsWith('+')) {
    console.warn('[Analytics] Phone number missing country code, hash may be invalid:', phone);
  }

  return sha256Hex(normalized);
}

/**
 * Hashea datos de usuario para Advanced Matching de Meta Pixel
 *
 * **Campos soportados**:
 * - `em`: Email (hashed)
 * - `ph`: Phone (hashed, debe incluir country code)
 * - `fn`: First name (hashed)
 * - `ln`: Last name (hashed)
 * - `ct`: City (hashed)
 * - `st`: State (hashed)
 * - `country`: Country code ISO 3166-1 alpha-2 (plain text, NO hasheado)
 * - `zp`: Zip/postal code (hashed)
 *
 * @param user - Objeto con datos de usuario
 * @returns Promise con datos hasheados según especificaciones de Meta
 *
 * @example
 * ```typescript
 * const user = {
 *   email: 'user@example.com',
 *   phone: '+573001234567',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   city: 'Bogotá',
 *   country: 'co',
 * };
 *
 * const hashed = await hashUserData(user);
 * // {
 * //   em: 'b4c9a289323b21a01c3e940f150eb9b8...',
 * //   ph: '8d969eef6ecad3c29a3a629280e686cf...',
 * //   fn: '96d9632f363564cc3032521409cf22a8...',
 * //   ln: '5e52fee47e6b070565f74372468cdc69...',
 * //   ct: '8d5e957f297893487bd98fa830fa6413...',
 * //   country: 'co'
 * // }
 * ```
 */
export async function hashUserData(user: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}): Promise<{
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  country?: string;
  zp?: string;
}> {
  const hashed: Record<string, string> = {};

  // Email (hashed)
  if (user.email) {
    const emailHash = await hashEmail(user.email);
    if (emailHash) hashed.em = emailHash;
  }

  // Phone (hashed, debe incluir country code)
  if (user.phone) {
    const phoneHash = await hashPhone(user.phone);
    if (phoneHash) hashed.ph = phoneHash;
  }

  // First name (lowercase + hash)
  if (user.firstName) {
    const normalized = user.firstName.trim().toLowerCase();
    const fnHash = await sha256Hex(normalized);
    if (fnHash) hashed.fn = fnHash;
  }

  // Last name (lowercase + hash)
  if (user.lastName) {
    const normalized = user.lastName.trim().toLowerCase();
    const lnHash = await sha256Hex(normalized);
    if (lnHash) hashed.ln = lnHash;
  }

  // City (lowercase + hash)
  if (user.city) {
    const normalized = user.city.trim().toLowerCase();
    const ctHash = await sha256Hex(normalized);
    if (ctHash) hashed.ct = ctHash;
  }

  // State (lowercase + hash)
  if (user.state) {
    const normalized = user.state.trim().toLowerCase();
    const stHash = await sha256Hex(normalized);
    if (stHash) hashed.st = stHash;
  }

  // Zip code (digits only + hash)
  if (user.zipCode) {
    const normalized = user.zipCode.replace(/[^\d]/g, '');
    const zpHash = await sha256Hex(normalized);
    if (zpHash) hashed.zp = zpHash;
  }

  // Country (plain text, lowercase ISO code, NO hasheado)
  if (user.country) {
    hashed.country = user.country.trim().toLowerCase();
  }

  return hashed;
}
