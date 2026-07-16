import { createContext, useContext, useEffect, useState } from "react";
import defaultSiteConfig from "../config/siteConfig";

const SettingsContext = createContext(null);

function mergeSettings(defaults, incoming) {
  if (Array.isArray(defaults)) {
    return Array.isArray(incoming) ? incoming : defaults;
  }

  if (defaults && typeof defaults === "object") {
    const source =
      incoming && typeof incoming === "object" && !Array.isArray(incoming)
        ? incoming
        : {};

    return Object.keys(defaults).reduce(
      (result, key) => {
        result[key] = mergeSettings(defaults[key], source[key]);
        return result;
      },
      { ...source }
    );
  }

  return incoming === undefined || incoming === null || incoming === ""
    ? defaults
    : incoming;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteConfig);
  const [loading, setLoading] = useState(true);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadSettings() {
      try {
        setLoading(true);
        setSettingsError("");

        const response = await fetch(`/data/site-data.json?v=${Date.now()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Nie można wczytać konfiguracji (${response.status}).`);
        }

        const cmsSettings = await response.json();
        setSettings(mergeSettings(defaultSiteConfig, cmsSettings));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.warn(error.message);
          setSettingsError(error.message);
          setSettings(defaultSiteConfig);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSettings();
    return () => controller.abort();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, settingsError }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings musi być użyty wewnątrz SettingsProvider");
  }

  return context;
}
