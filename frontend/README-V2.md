# Twoja Stacja LPG + Twoja Strefa Ubezpieczeń v2

## Uruchomienie
1. Otwórz terminal w katalogu `frontend`.
2. `npm install`
3. `npm run dev`

## Adresy
- `/` – LPG
- `/ubezpieczenia` – Multiagencja
- `/admin` – panel Decap CMS po konfiguracji Netlify Identity i Git Gateway

## Ceny
Edytuj `public/data/products.json` i `public/data/site-data.json` albo użyj `/admin`.

## Formularze
Po deployu Netlify wykryje `zamowienie-lpg` oraz `wycena-ubezpieczenia`. W Netlify ustaw powiadomienia e-mail dla właściwych adresów.

## Google Sheets i HTML e-mail
Wklej `GOOGLE_APPS_SCRIPT.gs` do Apps Script powiązanego z arkuszem, wdróż jako Web App i wpisz adres `/exec` do `public/data/site-data.json` → `integrations.googleAppsScriptUrl`.

Kalkulator pokazuje wyłącznie orientacyjne zakresy, nie rzeczywiste taryfy towarzystw.
