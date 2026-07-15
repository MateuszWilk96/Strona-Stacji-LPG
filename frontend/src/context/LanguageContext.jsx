import { createContext, useContext, useEffect, useMemo, useState } from "react";
import translations from "../data/translations";
const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("language") || "pl");
  useEffect(() => localStorage.setItem("language", lang), [lang]);
  const value = useMemo(() => ({ lang, setLang, toggleLanguage:()=>setLang(v=>v==="pl"?"en":"pl"), t:translations[lang] }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){ const c=useContext(LanguageContext); if(!c) throw new Error("useLanguage poza providerem"); return c; }
