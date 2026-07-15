import { useSettings } from "../../context/SettingsContext";

function ExternalButton({ url, children }) {
  if (!url) {
    return (
      <span className="mt-3 inline-flex cursor-not-allowed rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300" title="Adres strony zostanie dodany po jego otrzymaniu">
        Adres strony wkrótce
      </span>
    );
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
      {children}
    </a>
  );
}

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="mt-16 bg-slate-900 text-slate-100">
      <div className="container mx-auto grid gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">{settings.brands.station}</h3>
          <p><a href={`tel:+48${settings.phones.station}`}>Stacja: {settings.phones.station}</a></p>
          <p><a href={`tel:+48${settings.phones.central}`}>Centrala: {settings.phones.central}</a></p>
          <p className="break-words"><a href={`mailto:${settings.emails.station}`}>{settings.emails.station}</a></p>
        </div>

        <div>
          <h3 className="text-lg font-bold">{settings.brands.insurance}</h3>
          <p><a href={`tel:+48${settings.phones.agent1}`}>Agent 1: {settings.phones.agent1}</a></p>
          <p><a href={`tel:+48${settings.phones.agent2}`}>Agent 2: {settings.phones.agent2}</a></p>
          <p className="break-words"><a href={`mailto:${settings.emails.insurance}`}>{settings.emails.insurance}</a></p>
        </div>

        <div>
          <h3 className="text-lg font-bold">📦 Pakersi</h3>
          <p>{settings.pakersi.message}</p>
          <p className="break-words"><a href={`mailto:${settings.emails.pakersi}`}>{settings.emails.pakersi}</a></p>
          {settings.pakersi.enabled && <ExternalButton url={settings.pakersi.websiteUrl}>{settings.pakersi.label}</ExternalButton>}
        </div>

        <div>
          <h3 className="text-lg font-bold">Adres</h3>
          <p>{settings.address.full}</p>
          <p className="mt-4 text-sm text-slate-400">© {new Date().getFullYear()} Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
