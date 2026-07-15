import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useSettings } from "../../context/SettingsContext";

export default function Header(){
  const {pathname}=useLocation(); const {lang,toggleLanguage,t}=useLanguage(); const {settings}=useSettings();
  const insurance=pathname.startsWith("/ubezpieczenia");
  return <>
    <div className={insurance?"bg-emerald-800 text-white":"bg-blue-600 text-white"}>
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 p-4">
        <Link to={insurance?"/ubezpieczenia":"/"} className="text-2xl font-bold">{insurance?settings.brands.insurance:settings.brands.station}</Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm md:text-base">
          {!insurance&&<><a href="#sklep" className="hover:text-yellow-300">{t.shop}</a><a href="#karta" className="hover:text-yellow-300">{t.loyalty}</a><a href="#przyczepka" className="hover:text-yellow-300">{t.trailer}</a><a href="#kontakt" className="hover:text-yellow-300">{t.contact}</a></>}
          {insurance&&<><a href="#oferta" className="hover:text-amber-200">Oferta</a><a href="#kalkulator" className="hover:text-amber-200">Kalkulator</a><a href="#kontakt" className="hover:text-amber-200">Kontakt</a></>}
          <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="font-semibold hover:text-yellow-300">Facebook</a>
          <Link to={insurance?"/":"/ubezpieczenia"} className="rounded-full bg-white/15 px-4 py-2 font-bold hover:bg-white/25">{insurance?"⛽ Stacja LPG":"🛡️ Ubezpieczenia"}</Link>
          <button onClick={toggleLanguage} className="rounded border border-white/60 px-3 py-1">{lang==="pl"?"EN":"PL"}</button>
        </nav>
      </div>
    </div>
  </>;
}
