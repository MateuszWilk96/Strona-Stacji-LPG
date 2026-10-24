
import React from "react";

const PROMOTION = {
  lpgDiscount: 5,
  bottleDiscount: 5,
  lpgDays: 30,
  bottleDays: 60,
  calculationCooldownDays: 90,
};

export default function OcPromotion() {
  return (
    <section
      aria-labelledby="oc-promotion-title"
      className="mx-auto my-10 max-w-6xl px-4"
    >
      <div className="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl md:p-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-300">
          Promocja dla klientów Stacji LPG
        </p>

        <h2
          id="oc-promotion-title"
          className="mb-4 text-3xl font-extrabold md:text-4xl"
        >
          Z Nami zostajesz, Więcej dostajesz!
        </h2>

        <p className="mb-6 max-w-2xl text-lg text-slate-200">
          Skorzystaj z bezpłatnej kalkulacji OC i odbierz
          dodatkowy rabat na kolejne tankowanie LPG lub
          zakup butli gazowej.
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 text-slate-900">
            <p className="text-sm font-semibold">
              Tankowanie LPG
            </p>
            <p className="my-2 text-4xl font-extrabold">
              -{PROMOTION.lpgDiscount} gr/l
            </p>
            <p>Kupon ważny przez {PROMOTION.lpgDays} dni</p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-slate-900">
            <p className="text-sm font-semibold">
              Butla gazowa
            </p>
            <p className="my-2 text-4xl font-extrabold">
              -{PROMOTION.bottleDiscount} zł
            </p>
            <p>Kupon ważny przez {PROMOTION.bottleDays} dni</p>
          </div>
        </div>

        <p className="mb-6 font-bold text-amber-300">
          Rabaty łączą się z promocją Karty Stałego Klienta!
        </p>

        <div className="mb-6 rounded-2xl bg-slate-800 p-5">
          <h3 className="mb-3 text-xl font-bold">
            Jak skorzystać z promocji?
          </h3>

          <ol className="list-inside list-decimal space-y-2 text-slate-100">
            <li>Otwórz formularz odczytu pojazdu.</li>
            <li>Prześlij zdjęcie dowodu rejestracyjnego.</li>
            <li>Sprawdź dane i wyślij zapytanie o OC.</li>
            <li>
              Po wykonaniu kalkulacji przez agenta
              otrzymasz informację o przyznanym kuponie.
            </li>
            <li>
              Na stacji wybierz rabat na LPG albo butlę.
            </li>
          </ol>
        </div>

        <a
          href="/odczyt-pojazdu"
          className="inline-block rounded-xl bg-amber-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-amber-300"
        >
          Sprawdź bezpłatnie ofertę OC
        </a>

        <p className="mt-6 text-sm text-slate-300">
          Kupon za kalkulację przysługuje nie częściej
          niż raz na {PROMOTION.calculationCooldownDays} dni
          dla tego samego pojazdu. Za każdą opłaconą polisę
          może przysługiwać dodatkowy kupon, bez karencji.
          Jeden kupon można wykorzystać tylko raz.
          Wysłanie formularza nie zobowiązuje do zakupu
          ubezpieczenia. Szczegóły określa regulamin promocji.
        </p>
      </div>
    </section>
  );
}
