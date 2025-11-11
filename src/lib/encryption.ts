import CryptoJS from 'crypto-js';

/**
 * Servicio de desencriptación para datos sensibles del backend
 * Usa AES-256-CBC con la misma configuración que el backend
 */
class EncryptionService {
  private readonly key: string;

  constructor() {
    const key = process.env.NEXT_PUBLIC_FRONTEND_ENCRYPTION_KEY;

    if (!key || key.length !== 64) {
      throw new Error('NEXT_PUBLIC_FRONTEND_ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
    }

    this.key = key;
  }

  /**
   * Desencripta datos del backend
   * Formato esperado: "iv:ciphertext" (ambos en hex)
   *
   * @param encryptedData - String encriptado del backend
   * @returns Datos desencriptados como string
   */
  decrypt(encryptedData: string): string | null {
    if (!encryptedData) return null;

    try {
      // El formato es "iv:ciphertext" (ambos en hex)
      const [ivHex, cipherHex] = encryptedData.split(':');

      if (!ivHex || !cipherHex) {
        console.error('Invalid encrypted data format. Expected "iv:ciphertext"');
        return null;
      }

      // Convertir hex a WordArray de CryptoJS
      const key = CryptoJS.enc.Hex.parse(this.key);
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const ciphertext = CryptoJS.enc.Hex.parse(cipherHex);

      // Desencriptar usando AES-256-CBC
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext } as CryptoJS.lib.CipherParams,
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // Convertir a string UTF-8
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedStr) {
        console.error('Decryption failed: empty result');
        return null;
      }

      return decryptedStr;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  /**
   * Desencripta y parsea JSON
   * Útil para objetos complejos que vienen encriptados
   *
   * @param encryptedData - String encriptado del backend
   * @returns Objeto parseado o null si falla
   */
  decryptJSON<T>(encryptedData: string): T | null {
    const decrypted = this.decrypt(encryptedData);

    if (!decrypted) return null;

    try {
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('JSON parse error after decryption:', error);
      return null;
    }
  }
}

// Exportar singleton
export const encryptionService = new EncryptionService();
