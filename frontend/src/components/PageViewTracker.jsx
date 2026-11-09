
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
    const normalizedPath = pathname.toLowerCase().replace(/\/+$/, "");
const path = normalizedPath || "/";

    if (!TRACKED_PATHS.has(path)) return;

    fetch("/.netlify/functions/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  path,
  environment: window.location.hostname === "teststrefa.netlify.app"
    ? "Test"
    : "Main",
}),
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Błąd licznika:", response.status);
        }
      })
      .catch((error) => {
        console.error("Nie udało się wysłać odwiedzin:", error);
      });
  }, [pathname]);

  return null;
}

