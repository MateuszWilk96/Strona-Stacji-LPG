import { useEffect, useMemo, useState } from "react";

const defaultRates = {
  notice: "Wyniki są wyłącznie orientacyjnym szacunkiem poglądowym i nie stanowią oferty ubezpieczenia.",
  basePremium: 520,
  factors: { youngDriver: 1.35, regional: 1.12, claim: 1.22, largeEngine: 1.18, olderVehicle: 1.08 },
  thresholds: { youngDriverAge: 26, largeEngineCc: 2000, olderVehicleBeforeYear: 2010, regionalPostalPrefix: "4" },
  companies: []
};

export default function InsuranceCalculator({ onRequest }) {
  const [form, setForm] = useState({ brand: "", model: "", year: "", engine: "", postalCode: "", driverAge: "", claims: "0" });
  const [rates, setRates] = useState(defaultRates);
  const [calculated, setCalculated] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    fetch("/data/insurance-rates.json", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Brak konfiguracji kalkulatora")))
      .then(setRates)
      .catch((error) => console.warn(error.message));
  }, []);

  const change = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setCalculated(false);
    setValidationMessage("");
  };

  const estimates = useMemo(() => {
    let base = Number(rates.basePremium) || 520;
    const age = Number(form.driverAge);
    const year = Number(form.year);
    const engine = Number(form.engine);
    const claims = Number(form.claims);
    const f = rates.factors;
    const t = rates.thresholds;

    if (age && age < t.youngDriverAge) base *= f.youngDriver;
    if (form.postalCode.trim().startsWith(String(t.regionalPostalPrefix))) base *= f.regional;
    if (claims > 0) base *= Math.pow(f.claim, claims);
    if (engine > t.largeEngineCc) base *= f.largeEngine;
    if (year && year < t.olderVehicleBeforeYear) base *= f.olderVehicle;

    return rates.companies
      .filter((company) => company.active)
      .map((company) => {
        const min = Math.round((base * company.multiplier) / 10) * 10;
        return { name: company.name, min, max: Math.round((min * 1.25) / 10) * 10 };
      });
  }, [form, rates]);

  const calculate = () => {
    const currentYear = new Date().getFullYear();
    const year = Number(form.year);
    const age = Number(form.driverAge);
    const engine = Number(form.engine);

    if (!form.brand.trim() || !form.model.trim() || !year || !engine || !form.postalCode.trim() || !age) {
      setValidationMessage("Uzupełnij wszystkie dane pojazdu i kierowcy.");
      return;
    }
    if (year < 1950 || year > currentYear + 1 || engine < 100 || engine > 12000 || age < 18 || age > 100) {
      setValidationMessage("Sprawdź poprawność roku, pojemności silnika i wieku kierowcy.");
      return;
    }

    setValidationMessage("");
    setCalculated(true);
  };

  return (
    <section id="kalkulator" className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
      <h2 className="text-3xl font-bold text-emerald-900">Orientacyjny kalkulator OC</h2>
      <p className="mt-2 text-gray-600">{rates.notice}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="form-input" name="brand" value={form.brand} onChange={change} placeholder="Marka pojazdu" />
        <input className="form-input" name="model" value={form.model} onChange={change} placeholder="Model" />
        <input className="form-input" type="number" name="year" value={form.year} onChange={change} placeholder="Rok produkcji" />
        <input className="form-input" type="number" name="engine" value={form.engine} onChange={change} placeholder="Pojemność silnika w cm³" />
        <input className="form-input" name="postalCode" value={form.postalCode} onChange={change} placeholder="Kod pocztowy" />
        <input className="form-input" type="number" name="driverAge" value={form.driverAge} onChange={change} placeholder="Wiek kierowcy" />
        <select className="form-input md:col-span-2" name="claims" value={form.claims} onChange={change}>
          <option value="0">Brak szkód</option><option value="1">1 szkoda</option><option value="2">2 szkody</option><option value="3">3 lub więcej szkód</option>
        </select>
        {validationMessage && <p className="md:col-span-2 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{validationMessage}</p>}
        <button type="button" onClick={calculate} className="md:col-span-2 rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">Oblicz orientacyjnie</button>
      </div>

      {calculated && (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {estimates.map((estimate) => (
              <div key={estimate.name} className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <strong>{estimate.name}</strong>
                <p className="text-xl font-bold text-emerald-900">{estimate.min}–{estimate.max} zł</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-gray-600">Przedziały są wynikiem modelu orientacyjnego strony, a nie odpowiedzią z systemów towarzystw.</p>
          <button onClick={() => onRequest(form, estimates)} className="mt-4 w-full rounded-lg bg-amber-400 px-5 py-3 font-bold text-slate-900 hover:bg-amber-500">Chcę dokładną analizę agenta</button>
        </>
      )}
    </section>
  );
}
