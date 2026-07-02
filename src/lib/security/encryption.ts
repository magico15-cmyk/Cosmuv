import crypto from "crypto";

// AES-256-GCM requires a 32-byte (256-bit) secret key
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 16 bytes IV for GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes Auth Tag for GCM

/**
 * Resolves the 32-byte encryption key from environment variables.
 * Falls back to a deterministic SHA-256 hash of SUPABASE_SERVICE_ROLE_KEY or NEXTAUTH_SECRET if ENCRYPTION_SECRET_KEY is not explicitly set.
 */
function getEncryptionKey(customSecret?: string): Buffer {
  const secret =
    customSecret ||
    process.env.ENCRYPTION_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXTAUTH_SECRET ||
    "cosmuv-default-fallback-insecure-key-change-in-prod";

  // Ensure exactly 32 bytes using SHA-256 hashing
  return crypto.createHash("sha256").update(String(secret)).digest();
}

/**
 * Encrypts a sensitive string credential (such as advertising pixel keys, TikTok/Facebook API access tokens, or carrier account configurations).
 * Produces an authenticated ciphertext formatted as `iv:authTag:ciphertext` (hex encoded).
 */
export function encryptCredential(plaintext: string, customSecret?: string): string {
  if (!plaintext || typeof plaintext !== "string") {
    return plaintext;
  }

  // Check if already encrypted (avoids double encryption)
  if (isEncryptedCredential(plaintext)) {
    return plaintext;
  }

  const key = getEncryptionKey(customSecret);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:ciphertext
  return `${iv.toString("hex")}:${authTag}:${ciphertext}`;
}

/**
 * Decrypts an authenticated ciphertext credential back to its plaintext form.
 * Guarantees data integrity by verifying the GCM authentication tag before returning plaintext.
 */
export function decryptCredential(encryptedString: string, customSecret?: string): string {
  if (!encryptedString || typeof encryptedString !== "string") {
    return encryptedString;
  }

  if (!isEncryptedCredential(encryptedString)) {
    // Return raw if not formatted as iv:authTag:ciphertext
    return encryptedString;
  }

  try {
    const parts = encryptedString.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid ciphertext structure.");
    }

    const [ivHex, authTagHex, ciphertextHex] = parts;
    const key = getEncryptionKey(customSecret);
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let plaintext = decipher.update(ciphertextHex, "hex", "utf8");
    plaintext += decipher.final("utf8");

    return plaintext;
  } catch (error) {
    console.error("[DATA-AT-REST SECURITY ERROR] Failed to decrypt integration credential:", error);
    throw new Error("Decryption failed: Ciphertext integrity check failure or invalid encryption key.");
  }
}

/**
 * Checks whether a value string matches the encrypted iv:authTag:ciphertext format.
 */
export function isEncryptedCredential(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const parts = value.split(":");
  if (parts.length !== 3) return false;
  // Verify hex character lengths (IV is 32 hex chars, authTag is 32 hex chars)
  return parts[0].length === 32 && parts[1].length === 32 && parts[2].length > 0;
}

/**
 * Default list of sensitive key names that should undergo automatic application-level encryption at rest.
 */
export const DEFAULT_SENSITIVE_KEYS = [
  "api_key",
  "apikey",
  "secret",
  "secret_key",
  "access_token",
  "refresh_token",
  "auth_token",
  "private_key",
  "pixel_id",
  "tiktok_pixel_id",
  "facebook_pixel_id",
  "snapchat_pixel_id",
  "ga_tracking_id",
  "carrier_api_key",
  "carrier_account_token",
  "webhook_secret",
];

/**
 * Helper utility to recursively encrypt sensitive keys in store settings or integration payload objects before storing in database.
 */
export function encryptStoreSettings(
  settings: Record<string, any>,
  sensitiveKeys: string[] = DEFAULT_SENSITIVE_KEYS
): Record<string, any> {
  if (!settings || typeof settings !== "object") return settings;

  const encrypted: Record<string, any> = Array.isArray(settings) ? [] : {};

  for (const [key, value] of Object.entries(settings)) {
    const isSensitive = sensitiveKeys.some((k) => key.toLowerCase().includes(k.toLowerCase()));

    if (isSensitive && typeof value === "string") {
      encrypted[key] = encryptCredential(value);
    } else if (value && typeof value === "object") {
      encrypted[key] = encryptStoreSettings(value, sensitiveKeys);
    } else {
      encrypted[key] = value;
    }
  }

  return encrypted;
}

/**
 * Helper utility to recursively decrypt sensitive integration keys in store settings at runtime for server actions.
 */
export function decryptStoreSettings(
  settings: Record<string, any>,
  sensitiveKeys: string[] = DEFAULT_SENSITIVE_KEYS
): Record<string, any> {
  if (!settings || typeof settings !== "object") return settings;

  const decrypted: Record<string, any> = Array.isArray(settings) ? [] : {};

  for (const [key, value] of Object.entries(settings)) {
    const isSensitive = sensitiveKeys.some((k) => key.toLowerCase().includes(k.toLowerCase()));

    if (isSensitive && typeof value === "string" && isEncryptedCredential(value)) {
      decrypted[key] = decryptCredential(value);
    } else if (value && typeof value === "object") {
      decrypted[key] = decryptStoreSettings(value, sensitiveKeys);
    } else {
      decrypted[key] = value;
    }
  }

  return decrypted;
}
