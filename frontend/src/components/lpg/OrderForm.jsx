import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { useSettings } from "../../context/SettingsContext";
import { submitGoogleSheet, submitNetlifyForm } from "../../services/forms";

const initial = { name: "", phone: "", email: "", address: "", companyName: "", nip: "", payment: "Płatność w sklepie", notes: "", consent: false };

export default function OrderForm() {
  const { cart, total, clearCart } = useCart();
  const { lang, t } = useLanguage();
  const { settings } = useSettings();
  const [type, setType] = useState("private");
  const [form, setForm] = useState(initial);
  const [sending, setSending] = useState(false);

  const change = (event) => setForm((current) => ({
    ...current,
    [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value
  }));

  const submit = async (event) => {
    event.preventDefault();
    if (!cart.length) return alert(t.empty);

    setSending(true);
    const products = cart.map((item) => `${item.name} x ${item.qty} = ${(item.price * item.qty).toFixed(2)} zł`).join(" | ");
    const payload = {
      type: "lpg-order",
      date: new Date().toISOString(),
      customerType: type,
      ...form,
      products,
      total: total.toFixed(2),
      language: lang
    };

    try {
      await submitNetlifyForm("zamowienie-lpg", payload);
      await submitGoogleSheet(settings.integrations.googleAppsScriptUrl, payload);
      alert(t.sent);
      clearCart();
      setForm(initial);
    } catch (error) {
      console.error(error);
      alert(t.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="container mx-auto mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold">{t.order}</h2>
      <form name="zamowienie-lpg" data-netlify="true" onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="form-name" value="zamowienie-lpg" />
        <div className="flex gap-5 md:col-span-2">
          <label><input type="radio" checked={type === "private"} onChange={() => setType("private")} /> {t.private}</label>
          <label><input type="radio" checked={type === "company"} onChange={() => setType("company")} /> {t.company}</label>
        </div>
        <input className="form-input" name="name" value={form.name} onChange={change} placeholder="Imię i nazwisko" required />
        <input className="form-input" name="phone" value={form.phone} onChange={change} placeholder="Telefon" pattern="[0-9 +()-]{7,20}" required />
        <input className="form-input" type="email" name="email" value={form.email} onChange={change} placeholder="E-mail" />
        <input className="form-input" name="address" value={form.address} onChange={change} placeholder="Adres / miejsce odbioru" />
        {type === "company" && <><input className="form-input" name="companyName" value={form.companyName} onChange={change} placeholder="Nazwa firmy" required /><input className="form-input" name="nip" value={form.nip} onChange={change} placeholder="NIP" pattern="[0-9-]{10,13}" required /></>}
        <select className="form-input" name="payment" value={form.payment} onChange={change}><option>Płatność w sklepie</option><option>Gotówka przy dostawie</option><option>BLIK po uzgodnieniu</option></select>
        <textarea className="form-input md:col-span-2" name="notes" value={form.notes} onChange={change} placeholder="Uwagi do zamówienia" />
        <label className="flex gap-3 text-sm md:col-span-2"><input type="checkbox" name="consent" checked={form.consent} onChange={change} required /><span>Wyrażam zgodę na kontakt w celu realizacji zamówienia i przetwarzanie podanych danych w tym celu.</span></label>
        <button disabled={sending} className="rounded-lg bg-yellow-400 px-5 py-3 font-bold hover:bg-yellow-500 disabled:opacity-50 md:col-span-2">{sending ? "Wysyłanie..." : t.order}</button>
      </form>
    </section>
  );
}
