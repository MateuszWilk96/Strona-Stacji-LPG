
// Server-side relay: Google Sheets and e-mail are handled by Apps Script.

const allowedFields = [
  "name",
  "phone",
  "email",
  "registration",
  "notes",
  "marka",
  "model",
  "rokProdukcji",
  "pojemnoscCm3",
  "paliwo",
  "source",
];

const validRequestId = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const clean = (value, limit = 300) =>
  String(value ?? "").trim().slice(0, limit);

export default async function handler(request) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Metoda niedozwolona." },
      { status: 405 }
    );
  }

  const url = process.env.INSURANCE_APPS_SCRIPT_URL;
  const secret = process.env.INSURANCE_WEBHOOK_SECRET;

  if (!url || !secret) {
    return Response.json(
      { error: "Wysyłka zgłoszeń nie jest skonfigurowana." },
      { status: 503 }
    );
  }

  try {
    const raw = await request.text();

    if (raw.length > 12000) {
      return Response.json(
        { error: "Zbyt duże zgłoszenie." },
        { status: 413 }
      );
    }

    const input = JSON.parse(raw);

    // Honeypot — pole ukryte przed użytkownikiem.
    if (input.website) {
      return Response.json({ ok: true });
    }

    if (
      input.acceptContact !== true ||
      input.privacyAcknowledged !== true
    ) {
      return Response.json(
        {
          error:
            "Potwierdź zapoznanie się z informacją o danych i prośbę o kontakt.",
        },
        { status: 400 }
      );
    }

    const data = Object.fromEntries(
      allowedFields.map((key) => [
        key,
        clean(input[key], key === "notes" ? 1200 : 300),
      ])
    );

    if (
      !data.name ||
      !/^\+?[0-9 ()-]{9,20}$/.test(data.phone)
    ) {
      return Response.json(
        {
          error: "Podaj imię i prawidłowy numer telefonu.",
        },
        { status: 400 }
      );
    }

    if (
      data.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      return Response.json(
        { error: "Nieprawidłowy adres e-mail." },
        { status: 400 }
      );
    }

    const payload = {
      type: "insurance-lead",
      ...data,
      privacyAcknowledged: true,
      acceptContact: true,
      date: new Date().toISOString(),
      requestId: validRequestId(input.requestId)
        ? input.requestId
        : crypto.randomUUID(),
      token: secret,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
    });

    if (!response.ok) {
      throw new Error("Błąd dostawcy");
    }

    const result = await response.json();

    if (result.ok !== true) {
  console.error("Apps Script response:", {
    ok: result.ok,
    errorType:
      result.error === "Unauthorized"
        ? "UNAUTHORIZED"
        : "OTHER_ERROR",
  });

  throw new Error("Nie udało się potwierdzić zapisu.");
}

    return Response.json(
      { ok: true, id: result.id },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Insurance lead failed:", error);

    return Response.json(
      {
        error:
          "Nie udało się potwierdzić zapisu zgłoszenia. Skontaktuj się telefonicznie z agencją; nie wysyłaj ponownie bez sprawdzenia.",
      },
      { status: 502 }
    );
  }
}

export const config = {
  path: "/.netlify/functions/insurance-lead",
};
