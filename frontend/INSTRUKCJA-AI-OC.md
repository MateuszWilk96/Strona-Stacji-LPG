# Moduł AI do odczytu danych pojazdu — instrukcja

## Co zostało dodane
- `/odczyt-pojazdu` — mobilny formularz zdjęcia, zgoda, podgląd, odczyt AI, korekta i kopiowanie danych dla agenta.
- `netlify/functions/vehicle-scan.mjs` — serwerowa funkcja Netlify korzystająca z API OpenAI. Klucz pozostaje na serwerze. `store:false` w żądaniu API.
- `/polityka-prywatnosci` — **tylko robocza informacja** do uzupełnienia przed publikacją.
- Link z podstrony `/ubezpieczenia`.

## Konfiguracja
1. Przed wdrożeniem produkcyjnym zatwierdź pełną klauzulę RODO z osobą odpowiedzialną za ochronę danych. Obecny tekst jest szkicem, nie kompletną klauzulą. Sprawdź też warunki dostawców (Netlify, OpenAI), transfery, retencję i podstawę prawną.
2. Na Netlify w Site configuration → Environment variables dodaj `OPENAI_API_KEY` (klucz API, **nigdy** w plikach frontendowych). Klucz wymaga konta API z rozliczeniami.
3. Wdróż frontend przez istniejący proces Netlify. Funkcja jest publikowana razem z projektem. Katalog bazowy musi być `frontend`, jeżeli repo obejmuje katalog nadrzędny.
4. Otwórz `/odczyt-pojazdu` i sprawdź zdjęcie testowe z zasłoniętymi danymi osobowymi. Bez klucza pojawi się komunikat o braku konfiguracji.
5. Sprawdź działanie na telefonie i na komputerze. Rozważ ograniczenie liczby zapytań i ochronę przed botami (Netlify WAF/rate limiting), aby uniknąć kosztów i nadużyć.

## Granice funkcjonalności
- To jest **rzeczywisty odczyt AI** po skonfigurowaniu klucza, nie symulacja.
- Moduł **nie wylicza składki OC**, nie integruje się z taryfikatorami ubezpieczycieli, nie wysyła leadów i nie zapisuje zdjęć w arkuszu.
- Nie odczytuje celowo danych osobowych ani numerów identyfikacyjnych. Mimo to **całe zdjęcie jest wysyłane do dostawcy AI**; przed publikacją należy uwzględnić to w obowiązkach informacyjnych i minimalizacji danych.
- Zgoda jest osobna, domyślnie odznaczona; nie jest zgodą marketingową.
- Nie zmieniono istniejącej aplikacji Apps Script do odnowień polis.
