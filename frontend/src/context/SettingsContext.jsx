import { createContext, useContext, useEffect, useState } from "react";
import defaultSiteConfig from "../config/siteConfig";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/site-data.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Nie można wczytać konfiguracji");
        return response.json();
      })
      .then(setSettings)
      .catch((error) => console.warn(error.message))
      .finally(() => setLoading(false));
  }, []);

  return <SettingsContext.Provider value={{ settings, loading }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings musi być użyty wewnątrz SettingsProvider");
  return context;
}
