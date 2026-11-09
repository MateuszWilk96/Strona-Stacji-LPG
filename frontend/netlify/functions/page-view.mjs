
const ALLOWED_PATHS = new Set([
  "/",
  "/ubezpieczenia",
  "/odczyt-pojazdu",
]);

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
      { error: "Statystyki nie są skonfigurowane." },
      { status: 503 }
    );
  }

    // Środowisko ustawiane osobno w każdym projekcie Netlify.
  // Nie przyjmujemy tej wartości z przeglądarki.
  const environment = process.env.PAGE_VIEW_ENV;

  if (environment !== "Test" && environment !== "Main") {
    console.error("Nieprawidłowe PAGE_VIEW_ENV.");

    return Response.json(
      { error: "Nie skonfigurowano środowiska statystyk." },
      { status: 503 }
    );
  }
  try {
    const raw = await request.text();

    if (raw.length > 1000) {
      return Response.json(
        { error: "Zbyt duże żądanie." },
        { status: 413 }
      );
    }

    const data = JSON.parse(raw);

    if (
      typeof data.path !== "string" ||
      !ALLOWED_PATHS.has(data.path)
    ) {
      return Response.json(
        { error: "Nieprawidłowa strona." },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        type: "page-view",
        path: data.path,
        environment,
        token: secret,
      }),
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error("Błąd Google Apps Script.");
    }

    const result = await response.json();

    if (result.ok !== true) {
      throw new Error("Nie udało się zapisać odwiedzin.");
    }

    return Response.json(
      { ok: true },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Page view failed:", error.message);

    return Response.json(
      { error: "Nie udało się zapisać odwiedzin." },
      { status: 502 }
    );
  }
}
