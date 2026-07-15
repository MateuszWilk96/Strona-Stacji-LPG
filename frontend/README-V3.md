# Twoja Stacja LPG + Twoja Strefa Ubezpieczeń v3.0

## Zawartość
- zachowany wygląd strony LPG,
- koszyk zapisywany lokalnie w przeglądarce,
- Netlify Forms bez własnego backendu,
- Google Sheets, numerowanie zgłoszeń i formatowane e-maile HTML,
- arkusz `Statystyki` i opcjonalne codzienne kopie arkusza,
- panel Decap CMS pod `/admin`,
- edycja ceny LPG, cen produktów, zdjęć, danych kontaktowych i modelu kalkulatora,
- osobna strona `Twoja Strefa Ubezpieczeń`,
- orientacyjny kalkulator oraz formularz dokładnej analizy,
- animacja przejścia LPG ↔ Ubezpieczenia,
- przycisk do zewnętrznej strony Pakersi, aktywowany po wpisaniu URL.

## Uruchomienie lokalne
```cmd
cd frontend
npm install
npm run dev
```

## Najprostsza zmiana ceny LPG
Plik: `public/data/site-data.json`
```json
"lpg": { "price": 3.09 }
```
Po zmianie uruchom ponownie build lub odśwież stronę lokalną.

## Panel administratora
Adres po publikacji: `/admin`.
Panel zapisuje zmiany do repozytorium GitHub, a Netlify automatycznie publikuje nową wersję. W panelu można:
- zmieniać cenę LPG,
- edytować produkty i ceny,
- dodawać lub wymieniać zdjęcia,
- zmieniać telefony, e-maile i adres,
- ustawić URL strony Pakersi,
- zmieniać parametry modelu orientacyjnego kalkulatora.

## Google Sheets i e-maile HTML
1. Utwórz pusty Arkusz Google.
2. Otwórz `Rozszerzenia → Apps Script`.
3. Wklej zawartość `GOOGLE_APPS_SCRIPT.gs`.
4. Wdróż jako `Aplikacja internetowa`:
   - wykonuj jako: Ty,
   - dostęp: każdy.
5. Skopiuj adres kończący się `/exec`.
6. Wpisz go do `public/data/site-data.json` w `integrations.googleAppsScriptUrl` lub przez panel `/admin`.
7. Uruchom ręcznie funkcję `installDailyBackupTrigger`, jeżeli chcesz codzienną kopię arkusza na Dysku Google.

Skrypt tworzy arkusze:
- `Zamowienia LPG`,
- `Ubezpieczenia`,
- `Statystyki`.

Status zgłoszenia można ręcznie zmieniać w arkuszu, np. `Nowe`, `W realizacji`, `Zrealizowane`.

## Netlify
Dla repozytorium, którego katalogiem bazowym jest `frontend`:
- Build command: `npm run build`
- Publish directory: `dist`

Plik `netlify.toml` jest już przygotowany.

Po pierwszym deployu sprawdź w Netlify → Forms, czy wykryto:
- `zamowienie-lpg`,
- `wycena-ubezpieczenia`.

Możesz skonfigurować dodatkowe powiadomienia Netlify, ale główne formatowane maile wysyła Apps Script.

## Pakersi
Projekt nie zawiera osobnej strony Pakersi. W stopce widoczna jest sekcja z przyciskiem. Dopóki `pakersi.websiteUrl` jest pusty, przycisk jest nieaktywny. Po otrzymaniu adresu wpisz go w panelu admina albo w `public/data/site-data.json`.

## Kalkulator ubezpieczeniowy
Wyniki są modelem orientacyjnym, nie połączeniem z systemami taryfikacyjnymi ubezpieczycieli i nie stanowią oferty. Parametry są w `public/data/insurance-rates.json` i można je zmieniać w panelu admina.

## Kopie bezpieczeństwa
- kod i treści: historia commitów GitHub oraz historia deployów Netlify,
- zgłoszenia: funkcja `createSpreadsheetBackup` w Apps Script,
- przed dużą zmianą wykonaj commit i pobierz kopię ZIP repozytorium.
