import CryptoJS from 'crypto-js';

/**
 * Desencripta el script de Google Maps usando AES-256-CBC
 * @param encrypted - Script encriptado en formato "iv:ciphertext" (hex)
 * @param keyHex - Clave de encriptación en formato hexadecimal
 * @returns Script desencriptado como string
 */
export function decryptGoogleMapsScript(
  encrypted: string,
  keyHex: string
): string {
  try {
    // Separar IV y ciphertext
    const [ivHex, ciphertext] = encrypted.split(':');
    if (!ivHex || !ciphertext) {
      throw new Error('Invalid encrypted format. Expected "iv:ciphertext"');
    }

    // Convertir hex a WordArray
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encryptedData = CryptoJS.enc.Hex.parse(ciphertext);

    // Desencriptar
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedData,
    });
    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`Decryption failed: ${(error as Error).message}`);
  }
}

