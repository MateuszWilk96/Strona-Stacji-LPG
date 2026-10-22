# Formularz OC + OCR → Google Sheets + e-mail

## Zmiany w projekcie
- `src/pages/VehicleScanPage.jsx`: formularz zapytania pod poprawianymi danymi OCR.
- `src/components/insurance/InsuranceLeadForm.jsx`: wspólny formularz dla strony ubezpieczeń i skanowania; bez PESEL, ze statusem wysyłki.
- `netlify/functions/insurance-lead.mjs`: serwerowe przekazywanie zgłoszeń do Google Apps Script. Klucz nie jest ujawniany w przeglądarce.
- `GOOGLE_APPS_SCRIPT.gs`: zapis do arkusza, e-mail i kontrola sekretu dla zgłoszeń ubezpieczeniowych. Dotychczasowa obsługa LPG pozostaje w skrypcie.

## 1. Google Sheets
1. Utwórz arkusz Google, np. „Zgłoszenia OC”. Otwórz **Rozszerzenia → Apps Script**.
2. Wklej zawartość `GOOGLE_APPS_SCRIPT.gs` i zapisz.
3. W sekcji **Ustawienia projektu → Właściwości skryptu** dodaj `INSURANCE_WEBHOOK_SECRET` z długą losową wartością (min. 32 znaki). Nie umieszczaj jej w repozytorium.
4. W `CONFIG.INSURANCE_EMAIL` wpisz właściwy adres agencji, a w `CONFIG.LPG_EMAIL` adres stacji. Zweryfikuj odbiorców przed wdrożeniem.
5. Wybierz **Wdróż → Nowe wdrożenie → Aplikacja internetowa**; wykonuj jako właściciel; dostęp „Każdy” (wywołania są uwierzytelniane sekretem przekazywanym przez serwer Netlify). Skopiuj URL kończący się `/exec`.
6. Autoryzuj dostęp skryptu do arkusza i wysyłki poczty. Zadbaj o uprawnienia dostępu do arkusza, konta Google i limit wysyłek MailApp.
7. Przy każdej zmianie skryptu **wdrażaj nową wersję**, nie wystarczy samo zapisanie kodu.

## 2. Netlify
W **Site configuration → Environment variables** ustaw:
- `OPENAI_API_KEY` — istniejący klucz do OCR.
- `INSURANCE_APPS_SCRIPT_URL` — URL aplikacji Apps Script (`.../exec`).
- `INSURANCE_WEBHOOK_SECRET` — **dokładnie ten sam sekret**, co we właściwościach Apps Script.

Zmienne muszą być dostępne w środowisku funkcji. Po zmianie wykonaj ponowne wdrożenie. Nie dodawaj sekretów do `VITE_*`, GitHub ani kodu frontendu.

## 3. GitHub i Netlify
1. Wykonaj kopię obecnego repozytorium, utwórz nową gałąź.
2. Skopiuj zmienione pliki z archiwum, zatwierdź zmiany i wypchnij na GitHub.
3. Ustaw **Base directory** `frontend` tylko wtedy, gdy repozytorium obejmuje nadrzędny katalog `Strona-Stacji-LPG`; przy repozytorium z samym `frontend` pozostaw bazę pustą.
4. Build command: `npm run build`; Publish directory: `dist` względem katalogu bazowego. Funkcje: `netlify/functions`.
5. Przetestuj Deploy Preview przed publikacją.

## 4. Testy
1. Użyj wyłącznie fikcyjnego dokumentu / danych testowych. Otwórz `/odczyt-pojazdu`.
2. Prześlij obraz, popraw dane, wpisz testowe imię i własny numer telefonu; zaznacz pola informacyjne.
3. Wyślij zgłoszenie; sprawdź nowy wiersz w arkuszu `Ubezpieczenia` oraz wiadomość na skonfigurowanym e-mailu.
4. Sprawdź też formularz na `/ubezpieczenia`, błędny e-mail i brak zgód.
5. Zweryfikuj czy **żadne zdjęcie** nie jest zapisywane w arkuszu ani przesyłane e-mailem.
6. Jeżeli arkusz otrzymał wiersz, ale e-mail nie dotarł, sprawdź logi Apps Script, limity poczty i spam. Nie ponawiaj automatycznie wysyłki bez sprawdzenia, czy zgłoszenie nie zostało już zapisane.

## 5. Warunki przed produkcją
- Strona `/polityka-prywatnosci` nadal jest wersją roboczą! Wymaga zatwierdzonej informacji RODO, m.in. dotyczącej Netlify, Google i OpenAI.
- Włącz limity/rate limiting i zabezpieczenie antybotowe dla publicznych funkcji OCR i zgłoszeń (np. Turnstile z walidacją serwerową). Obecny honeypot **nie zastępuje** ochrony przed spamem.
- Zweryfikuj podstawy przetwarzania danych i ewentualne transfery poza EOG, umowy z dostawcami, retencję oraz dostęp pracowników do arkusza.
- Funkcja przekazująca dane może zwrócić błąd po częściowym sukcesie (wiersz zapisany, ale e-mail nie wysłany). Sprawdź arkusz przed ponowieniem.
- Integracja nie liczy składki OC i nie wysyła SMS. Ofertę przygotowuje agent.

## 6. Koszty
Bez VPS i bez Supabase: dotychczasowy plan Netlify, Google Sheets / Apps Script w limitach konta i płatne wykorzystanie OpenAI API. Mogą wystąpić opłaty za przekroczenie limitów usług.
