import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

function getEncryptionKey() {
  const encoded = process.env.INSURANCE_ENCRYPTION_KEY;

  if (!encoded) {
    throw new Error("Brak konfiguracji szyfrowania.");
  }

  const key = Buffer.from(encoded, "base64");

  if (
    key.length !== 32 ||
    key.toString("base64") !== encoded
  ) {
    throw new Error("Nieprawidłowy klucz szyfrowania.");
  }

  return key;
}

export function encryptSensitiveData(value, submissionId) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Brak danych do zaszyfrowania.");
  }

  if (typeof submissionId !== "string" || !submissionId.trim()) {
    throw new Error("Brak identyfikatora zgłoszenia.");
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);

  cipher.setAAD(Buffer.from(submissionId, "utf8"));

  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  return {
    version: 1,
    iv: iv.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptSensitiveData(encrypted, submissionId) {
  if (encrypted?.version !== 1) {
    throw new Error("Nieobsługiwana wersja szyfrowania.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(encrypted.iv, "base64")
  );

  decipher.setAAD(Buffer.from(submissionId, "utf8"));
  decipher.setAuthTag(Buffer.from(encrypted.authTag, "base64"));

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, "base64")),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}
