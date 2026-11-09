import { strict as assert } from "node:assert";
import { randomBytes } from "node:crypto";
import {
  encryptSensitiveData,
  decryptSensitiveData,
} from "./insurance-crypto.mjs";

// Wyłącznie tymczasowy klucz testowy.
process.env.INSURANCE_ENCRYPTION_KEY =
  randomBytes(32).toString("base64");

// Dane fikcyjne — nie używamy prawdziwego PESEL.
const testValue = "TEST-DANE-123";
const submissionId = "TEST-CRYPTO-194";

const encrypted = encryptSensitiveData(testValue, submissionId);

assert.notEqual(encrypted.ciphertext, testValue);
assert.equal(
  decryptSensitiveData(encrypted, submissionId),
  testValue
);

assert.throws(() =>
  decryptSensitiveData(encrypted, "INNE-ZGLOSZENIE")
);

console.log("TEST OK — szyfrowanie i odszyfrowywanie działa.");
