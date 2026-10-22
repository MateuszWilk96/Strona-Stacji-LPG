import InsuranceLeadForm from '../components/insurance/InsuranceLeadForm';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EMPTY = { marka: '', model: '', rokProdukcji: '', pojemnoscCm3: '', paliwo: '' };
const FIELDS = [['marka','Marka'],['model','Model'],['rokProdukcji','Rok produkcji'],['pojemnoscCm3','Pojemność silnika (cm³)'],['paliwo','Rodzaj paliwa']];

export default function VehicleScanPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [consent, setConsent] = useState(false);
  const [vehicle, setVehicle] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function analyze(e) {
    e.preventDefault(); setError('');
    if (!consent) return setError('Zaznacz zgodę na jednorazowy odczyt danych.');
    if (!file) return setError('Wybierz zdjęcie dokumentu.');
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) return setError('Wybierz plik JPG, PNG lub WebP.');
    if (file.size > 4 * 1024 * 1024) return setError('Zdjęcie nie może przekraczać 4 MB.');
    setBusy(true);
    try {
      const image = await new Promise((resolve,reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
      });
      const response = await fetch('/.netlify/functions/vehicle-scan', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({image, consent:true}) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Nie udało się odczytać dokumentu.');
      setVehicle(Object.fromEntries(Object.keys(EMPTY).map(k => [k, String(result.vehicle?.[k] ?? '')])));
      setAnalyzed(true);
    } catch (e) { setError(e.message || 'Błąd połączenia.'); }
    finally { setBusy(false); }
  }

  return <div className="bg-gradient-to-b from-emerald-50 to-white text-slate-900 min-h-screen">
    <div className="container mx-auto max-w-3xl px-5 py-12 md:py-20">
      <p className="text-emerald-700 font-bold tracking-widest uppercase text-sm">Ubezpieczenia komunikacyjne</p>
      <h1 className="text-3xl md:text-5xl font-black text-emerald-950 mt-3">Odczytaj dane pojazdu ze zdjęcia</h1>
      <p className="mt-4 text-slate-700">Zrób zdjęcie dowodu rejestracyjnego. AI pomoże przepisać podstawowe dane techniczne pojazdu. Sprawdź wynik przed przekazaniem go agentowi.</p>
      <div className="mt-8 rounded-3xl bg-white shadow-lg border border-emerald-100 p-6 md:p-8">
        <form onSubmit={analyze} className="space-y-5">
          <div><label htmlFor="vehicle-photo" className="block font-semibold mb-2">Zdjęcie dowodu rejestracyjnego</label>
            <input id="vehicle-photo" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e=>{setFile(e.target.files?.[0]||null);setAnalyzed(false);setVehicle(EMPTY);setError('');}} className="block w-full rounded-xl border border-slate-300 p-3" />
            <p className="text-sm text-slate-600 mt-2">JPG, PNG lub WebP, maksymalnie 4 MB. Jeśli to możliwe, zasłoń imię, nazwisko, adres i numer PESEL przed wykonaniem zdjęcia. Nie przesyłaj drugiej strony dokumentu, jeśli nie jest potrzebna.</p>
            {preview && <img src={preview} alt="Podgląd zdjęcia dokumentu" className="mt-3 max-h-64 rounded-xl border object-contain" />}
          </div>
          <label className="flex gap-3 items-start text-sm leading-relaxed"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-emerald-700" />
            <span>Wyrażam zgodę na jednorazowe przetworzenie przesłanego zdjęcia dowodu rejestracyjnego przy użyciu technologii AI, wyłącznie w celu odczytania danych pojazdu i przygotowania zapytania o składkę OC. Zapoznałem/am się z <a href="/polityka-prywatnosci" className="underline text-emerald-800">informacją o przetwarzaniu danych osobowych</a>. <strong>(wymagane)</strong></span>
          </label>
          {error && <p role="alert" className="text-red-700 font-semibold bg-red-50 p-3 rounded-xl">{error}</p>}
          <button disabled={busy || !consent || !file} className="w-full rounded-xl bg-emerald-800 text-white py-3 font-bold disabled:opacity-50">{busy?'Odczytuję dane…':'Odczytaj dane pojazdu'}</button>
        </form>
        {analyzed && <section className="mt-8 border-t pt-7"><h2 className="text-2xl font-bold text-emerald-950">Sprawdź odczytane dane</h2><p className="text-sm text-slate-600 mt-2 mb-5">Odczyt może zawierać błędy. Popraw wartości przed wykorzystaniem ich do zapytania o OC. Puste pola oznaczają brak pewnego odczytu.</p>
          <div className="grid sm:grid-cols-2 gap-4">{FIELDS.map(([key,label])=><label key={key} className="font-semibold text-sm">{label}<input value={vehicle[key]} onChange={e=>setVehicle(v=>({...v,[key]:e.target.value}))} className="mt-1 block w-full border rounded-lg p-3 font-normal" /></label>)}</div>
          <button onClick={()=>{const text=FIELDS.map(([key,label])=>`${label}: ${vehicle[key]||'brak danych'}`).join('\n'); navigator.clipboard?.writeText(text).then(()=>alert('Dane skopiowane. Możesz przekazać je agentowi.')).catch(()=>setError('Nie udało się skopiować danych.'));}} className="mt-6 rounded-xl bg-amber-400 text-slate-900 px-5 py-3 font-bold">Skopiuj dane dla agenta</button>
          <p className="text-sm text-slate-600 mt-3">Po sprawdzeniu danych możesz wysłać zgłoszenie do agenta. Składka nie jest obliczana automatycznie.</p>
          <InsuranceLeadForm vehicleData={vehicle} source="vehicle-scan"/>
        </section>}
      </div>
      <p className="mt-7 text-sm text-slate-600">Zdjęcie jest przesyłane do usługi AI wyłącznie po zaznaczeniu zgody. Aplikacja nie zapisuje zdjęcia w arkuszu ani na dysku serwera. Przetwarzanie przez dostawcę AI podlega jego zasadom retencji danych — należy to opisać w polityce prywatności przed publikacją.</p>
      <Link to="/ubezpieczenia" className="inline-block mt-5 underline text-emerald-800">← Wróć do ubezpieczeń</Link>
    </div>
  </div>;
}
