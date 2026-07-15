import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";
import ProductGrid from "../components/lpg/ProductGrid";
import Cart from "../components/lpg/Cart";
import OrderForm from "../components/lpg/OrderForm";

export default function LpgPage() {
  const { settings, loading } = useSettings();
  const { t } = useLanguage();

  return (
    <div className="page-enter bg-blue-50 text-gray-900">
      <section className="relative h-64 w-full md:h-80 lg:h-96">
        <img
          src="/Header.webp"
          alt="Baner Stacji LPG"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {settings.brands.station}
          </h1>
          <p className="text-lg font-semibold md:text-xl">
            {settings.address.full}
          </p>
          <p className="mt-2 text-lg text-yellow-400">
            Cena LPG: {loading ? t.loading : `${settings.lpg.price.toFixed(2)} zł / L`}
          </p>
        </div>
      </section>

      <ProductGrid />
      <Cart />
      <OrderForm />

      <section className="container mx-auto mt-6 rounded-2xl bg-yellow-100 p-6 shadow">
        <p>{t.info}</p>
      </section>

      <section id="karta" className="container mx-auto mt-16 px-4 text-center sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-blue-700">
          {t.programTitle}
        </h2>
        <p className="mx-auto mb-10 max-w-3xl text-gray-700">
          {t.programDesc}
        </p>

        <div className="mx-auto grid max-w-7xl items-start gap-8 md:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-6">
            <img
              src="/karta1.jpg"
              alt="Przód karty stałego klienta"
              className="block h-auto w-full rounded-xl shadow"
            />
            <img
              src="/karta2.jpg"
              alt="Tył karty stałego klienta"
              className="block h-auto w-full rounded-xl shadow"
            />
          </div>

          <img
            src="/ulotka.jpg"
            alt="Ulotka Twoja Stacja LPG"
            className="block h-auto w-full rounded-xl shadow"
          />
        </div>
      </section>

      <section
        id="przyczepka"
        className="container mx-auto mt-12 rounded-2xl border-2 border-yellow-400 bg-blue-100 p-6"
      >
        <h2 className="mb-3 text-2xl font-bold text-blue-800">{t.trailer}</h2>
        <p>
          • Do 3 godzin: <strong>{settings.trailer.upTo3h} zł</strong>
        </p>
        <p>
          • Powyżej 3 godzin: <strong>{settings.trailer.day} zł / doba</strong>
        </p>
      </section>

      <section className="container mx-auto mt-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-blue-800">{t.expansion}</h2>
        <p>{t.expansionText}</p>
      </section>

      <section id="kontakt" className="container mx-auto mt-12 grid gap-6 px-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-3 text-2xl font-bold text-blue-800">Kontakt</h2>
          <p>📍 {settings.address.full}</p>
          <p>
            📞 Stacja: <a href={`tel:+48${settings.phones.station}`}>{settings.phones.station}</a>
          </p>
          <p>
            📞 Centrala: <a href={`tel:+48${settings.phones.central}`}>{settings.phones.central}</a>
          </p>
          <p>
            ✉️ <a href={`mailto:${settings.emails.station}`}>{settings.emails.station}</a>
          </p>
        </div>

        <div className="h-80 overflow-hidden rounded-2xl border-4 border-yellow-400 shadow">
          <iframe
            title="Mapa"
            src="https://www.google.com/maps?q=Podhala%C5%84ska%2025%2C%20Jastrz%C4%99bie-Zdr%C3%B3j&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
