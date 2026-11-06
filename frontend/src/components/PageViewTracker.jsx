
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TRACKED_PATHS = new Set([
  "/",
  "/ubezpieczenia",
  "/odczyt-pojazdu",
]);

export default function PageViewTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path =
      pathname.length > 1
        ? pathname.replace(/\/+$/, "")
        : pathname;

    if (!TRACKED_PATHS.has(path)) return;

    // Na razie nie wysyłamy zdarzeń.
    // Włączymy je po przygotowaniu funkcji Netlify
    // i bezpiecznej obsługi w Google Apps Script.
  }, [pathname]);

  return null;
}
