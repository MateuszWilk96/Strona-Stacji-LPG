import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { prepareSensitiveRecord } from "./insurance-sensitive-store.mjs";
import { decryptSensitiveData } from "./insurance-crypto.mjs";

// Klucz wyłącznie do testu, nie do produkcji.
process.env.INSURANCE_ENCRYPTION_KEY =
  randomBytes(32).toString("base64");

const submissionId = "TEST-206";
const testValue = "DANE_TESTOWE_BEZ_PESEL";
const expiresAt = new Date(
  Date.now() + 24 * 60 * 60 * 1000
).toISOString();

const record = prepareSensitiveRecord(
  testValue,
  submissionId,
  expiresAt
);

assert.equal(record.submission_id, submissionId);
assert.equal(record.expires_at, expiresAt);

assert.equal(
  decryptSensitiveData(
    JSON.parse(record.encrypted_payload),
    submissionId
  ),
  testValue
);

assert.equal(
  record.encrypted_payload.includes(testValue),
  false
);

console.log("TEST OK — rekord przygotowany i zaszyfrowany.");
