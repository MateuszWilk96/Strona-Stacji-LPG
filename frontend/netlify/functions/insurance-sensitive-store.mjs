// Serwerowy moduł przechowywania danych wrażliwych.
// Nie importować do kodu React ani do przeglądarki.

import { encryptSensitiveData } from "./insurance-crypto.mjs";

export function prepareSensitiveRecord(value, submissionId, expiresAt) {
  if (
    typeof submissionId !== "string" ||
    !submissionId.trim()
  ) {
    throw new Error("Brak identyfikatora zgłoszenia.");
  }

  const expiry = new Date(expiresAt);

  if (
    !Number.isFinite(expiry.getTime()) ||
    expiry.getTime() <= Date.now()
  ) {
    throw new Error("Nieprawidłowy termin usunięcia.");
  }

  return {
    submission_id: submissionId,
    encrypted_payload: JSON.stringify(
      encryptSensitiveData(value, submissionId)
    ),
    expires_at: expiry.toISOString(),
  };
}
