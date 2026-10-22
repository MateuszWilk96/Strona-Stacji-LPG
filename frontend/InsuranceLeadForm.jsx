import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
const initial={name:'',phone:'',email:'',registration:'',notes:'',acceptContact:false,privacyAcknowledged:false,website:''};
export default function InsuranceLeadForm({vehicleData,estimates,source='insurance-page'}) {
  const ref=useRef(null);
  const [form,setForm]=useState(initial);
  const [sending,setSending]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{if(vehicleData)ref.current?.scrollIntoView({behavior:'smooth',block:'start'});},[vehicleData]);
  async function submit(e){
    e.preventDefault();setSending(true);setMessage('');setError('');
    const vehicle=Object.fromEntries(['marka','model','rokProdukcji','pojemnoscCm3','paliwo'].map(k=>[k,vehicleData?.[k]||'']));
    try {
      const response=await fetch('/.netlify/functions/insurance-lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...vehicle,...form,source})});
      const result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.error||'Nie udało się wysłać zgłoszenia.');
      setMessage(`Zgłoszenie przyjęte${result.id?' — numer '+result.id:''}. Agent skontaktuje się z Tobą.`);
      setForm(initial);
    }catch(err){setError(err.message||'Błąd połączenia.');}
    finally{setSending(false);}
  }
  const change=e=>setForm(v=>({...v,[e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value}));
  return <section ref={ref} className="mt-8 rounded-3xl bg-slate-900 p-6 text-white shadow-xl md:p-10">
    <h2 className="text-3xl font-bold">Zapytaj agenta o ofertę OC</h2>
    <p className="mt-2 text-slate-300">Prześlij potwierdzone dane i numer telefonu. Składkę obliczy agent w kalkulatorze ubezpieczyciela. Zdjęcie dokumentu nie jest dołączane do zgłoszenia.</p>
    {vehicleData && <div className="mt-4 rounded-xl border border-slate-600 p-4 text-sm"><strong>Dane pojazdu:</strong> {['marka','model','rokProdukcji','pojemnoscCm3','paliwo'].map(k=>vehicleData[k]).filter(Boolean).join(' · ')||'Brak odczytanych danych'}</div>}
    <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
      <input className="form-input text-slate-900" name="name" value={form.name} onChange={change} placeholder="Imię i nazwisko" maxLength={150} autoComplete="name" required/>
      <input className="form-input text-slate-900" name="phone" value={form.phone} onChange={change} placeholder="Telefon" type="tel" maxLength={20} autoComplete="tel" required/>
      <input className="form-input text-slate-900" type="email" name="email" value={form.email} onChange={change} placeholder="E-mail (opcjonalnie)" maxLength={200} autoComplete="email"/>
      <input className="form-input text-slate-900" name="registration" value={form.registration} onChange={change} placeholder="Numer rejestracyjny (opcjonalnie)" maxLength={30}/>
      <textarea className="form-input text-slate-900 md:col-span-2" name="notes" value={form.notes} onChange={change} placeholder="Dodatkowe informacje (bez PESEL i danych wrażliwych)" maxLength={1200}/>
      <div className="hidden" aria-hidden="true"><label>Nie wypełniaj<input name="website" value={form.website} onChange={change} tabIndex={-1} autoComplete="off"/></label></div>
      <label className="md:col-span-2 flex gap-3 text-sm"><input type="checkbox" name="privacyAcknowledged" checked={form.privacyAcknowledged} onChange={change} required/><span>Zapoznałem/am się z <Link to="/polityka-prywatnosci" className="underline">informacją o przetwarzaniu danych</Link>. (wymagane)</span></label>
      <label className="md:col-span-2 flex gap-3 text-sm"><input type="checkbox" name="acceptContact" checked={form.acceptContact} onChange={change} required/><span>Proszę o kontakt agenta w sprawie tego zapytania o ubezpieczenie. (wymagane)</span></label>
      <p className="md:col-span-2 text-xs text-slate-300">Formularz nie zapisuje zgody na odrębne wiadomości marketingowe ani automatyczne SMS-y promocyjne.</p>
      {error && <p role="alert" className="md:col-span-2 text-red-200 font-semibold">{error}</p>}
      {message && <p role="status" className="md:col-span-2 text-emerald-200 font-semibold">{message}</p>}
      <button disabled={sending} className="md:col-span-2 rounded-lg bg-amber-400 px-5 py-3 font-bold text-slate-900 hover:bg-amber-500 disabled:opacity-50">{sending?'Wysyłanie…':'Wyślij zapytanie do agenta'}</button>
    </form>
  </section>;
}
