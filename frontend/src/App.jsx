import { useEffect, useState } from "react";

export default function App() {
  const [lang, setLang] = useState("pl");
  const [cart, setCart] = useState([]);
  const [lpgPrice, setLpgPrice] = useState(null);

const t = {
    pl: {
      banner: "Twoja zaufana stacja LPG – Wymiany, butle, akcesoria (wkrótce)",
      add: "Dodaj do koszyka",
      remove: "Usuń",
      qty: "Ilość",
      cart: "Koszyk",
      empty: "Koszyk jest pusty",
      total: "Razem",
      order: "Złóż zamówienie",
      info: "Przyjmujemy butle turystyczne do nabicia, lecz tylko mające legalizację. Nie przyjmujemy butli czerwonych oraz z niestandardowymi zaworami. Czas oczekiwania wynosi od 2 do 5 dni (Butle są odbierane i przywożone w poniedziałki, środy i piątki w różnych godzinach, najpóźniej około 15).",
      programTitle:
        "Dołącz do programu i zbieraj podpisy przy każdej wymianie butli lub tankowaniu LPG.",
      programDesc:
        "Po zebraniu kompletu — rabat 50% na następną butlę lub stały rabat od nowej karty przy LPG.",
      paymentTitle: "Formy płatności",
      paymentDesc:
        "Płatności: w sklepie (gotówka, karta, Blik), przy dostawie (gotówka lub Blik ustalony z dostawcą).",
      trailer: "Wypożyczenie przyczepki",
      upTo3h: "Do 3 godzin",
      over3h: "Powyżej 3 godzin",
      expansion: "Planowane rozszerzenie asortymentu",
      expansionText: "Już wkrótce dostępne będą akcesoria do butli i LPG!",
      delivery:
        "Możliwa dostawa Butli 11Kg w cenie 20zł pod numerem +48 601 441 314",
      contact: "Kontakt",
      reserved: "Wszystkie prawa zastrzeżone",
      private: "Osoba prywatna",
      company: "Firma",
      invoiceData: "Dane do faktury",
    },
    en: {
      banner:
        "Your trusted LPG station – Refills, cylinders, accessories (soon)",
      add: "Add to cart",
      remove: "Remove",
      qty: "Quantity",
      cart: "Cart",
      empty: "Cart is empty",
      total: "Total",
      order: "Place order",
      info: "We accept tourist cylinders for refilling only if they are certified. We do not accept red cylinders or with non-standard valves. Waiting time: 2–5 days (Cylinders are collected and returned on Mondays, Wednesdays and Fridays, latest ~3 PM).",
      programTitle:
        "Join the loyalty program and collect stamps for each refill or LPG fueling.",
      programDesc:
        "After completing the card — 50% discount on the next cylinder or a permanent discount with the new LPG card.",
      paymentTitle: "Payment methods",
      paymentDesc:
        "Payments: in-store (cash, card, Blik), delivery (cash or Blik by arrangement).",
      trailer: "Trailer rental",
      upTo3h: "Up to 3 hours",
      over3h: "Over 3 hours",
      expansion: "Planned product range expansion",
      expansionText: "Accessories for cylinders and LPG coming soon!",
      delivery: "Possible delivery of 11Kg cylinders for 20zł at +48 601 441 314",
      contact: "Contact",
      reserved: "All rights reserved",
      private: "Private person",
      company: "Company",
      invoiceData: "Invoice details",
    },
  };
;

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setLpgPrice(data.lpgPrice))
      .catch((err) => console.error("Błąd wczytywania ceny LPG:", err));
  }, []);

  const products = [
    { id: 2, name: "Gaz w butli 11KG Propan-Butan", price: 75, desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", image: "/butla-11kg.png" },
    { id: 3, name: "Gaz w butli 10KG Propan-Butan", price: 85, desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", image: "/butla-11kg.png" },
    { id: 4, name: "Gaz w butli 8KG Propan-Butan", price: 62, desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", image: "/butla-8kg.jpg" },
    { id: 5, name: "Gaz w butli 5KG", price: 53, desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", image: "/butla-5kg.jpg"  },
    { id: 6, name: "Gaz w butli 3KG", price: 45, desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", image: "/butla-3kg.jpg"  },
    { id: 7, name: "Gaz w butli 2KG", price: 40, desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", image: "/butla-2kg.jpg" },
    { id: 8, name: "Gaz w butli 1KG", price: 27, desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", image: "/butla-1kg.jpg"  },
    { id: 9, name: "Pojemnik 11KG", price: 260, desc: "Cena za pustą butlę (bez gazu).", image: "/butla-11kg.png" },
    { id: 10, name: "Sodastream Wymiana", price: 15,desc: "Cena za wymianę butli Click On lub Twist On", image: "/SodaStream.jpg" },
    { id: 11, name: "Płyn do spryskiwaczy letni", price: 11, desc: "Opakowanie 5L. Zapach Zielonego Jabłka.", image: "/Płyn-lato.jpg"  },
    { id: 12, name: "Płyn do spryskiwaczy zimowy", price: 22, desc: "Opakowanie 5L. Odporny na mróz do -20 stopni. Zapach Cytrusowy", image: "/Płyn-zima.jpg"  },
  ];

  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, qty } : item)));
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Formularz
  const [customerType, setCustomerType] = useState("osoba"); // 'private' | 'company'
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    companyName: "",
    nip: "",
    payment: "Cash in store", // domyślna
  });

  const handleForm = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert(lang==="pl"? "Koszyk jest pusty":"Cart is empty");

    const payload = {
      cart,
      total: Number(total.toFixed(2)),
      customerType,
      form,
      lang,
    };

    try {
      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send failed");

      alert(lang==="pl" ? "Zamówienie wysłane!" : "Order sent!");
      setCart([]);
      setCustomerType("private");
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        companyName: "",
        nip: "",
        payment: "Cash in store",
      });
    } catch (err) {
      console.error(err);
      alert(lang==="pl"? "Błąd przy wysyłaniu zamówienia" : "Error sending order");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900">
      {/* Pasek górny */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Twoja Stacja LPG</h1>
          <nav className="flex gap-6">
            <a href="#sklep" className="hover:text-yellow-300">Sklep</a>
            <a href="#karta" className="hover:text-yellow-300">Karta stałego klienta</a>
            <a href="#przyczepka" className="hover:text-yellow-300">Przyczepka</a>
            <a href="#kontakt" className="hover:text-yellow-300">Kontakt</a>
            <button onClick={()=> setLang(l=> l==="pl"?"en":"pl")} className="px-3 py-1 border rounded">{lang==="pl"?"EN":"PL"}</button>
          </nav>
        </div>
      </header>

      {/* Stały baner */}
<header className="relative w-full h-64 md:h-80 lg:h-96">
  <img
    src="/header.webp" 
    alt="Baner Stacji LPG"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      Twoja Stacja LPG
    </h1>
    <p className="text-lg md:text-xl font-semibold">
      Ulica Podhalańska 25, 44-335 Jastrzębie-Zdrój
    </p>
    <p className="text-md md:text-lg mt-2 text-yellow-400">
      Cena LPG: {lpgPrice ? `${lpgPrice} zł / L` : "Ładowanie..."}
    </p>
  </div>
</header>

      {/* Sklep */}
      <main className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="h-32 w-auto mx-auto mb-2 object-contain"
              />
            )}
            <h2 className="text-lg font-semibold mb-2 text-center">
              {product.name}
            </h2>
            <p className="text-md mb-2 text-center">{product.price} zł</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mt-auto"
            >
              {t[lang].add}
            </button>
          </div>
        ))}
      </main>

      {/* KOSZYK */}
      <aside className="container mx-auto bg-white p-6 rounded-2xl shadow mt-6">
        <h2 className="text-2xl font-bold mb-4">{t[lang].cart}</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">{t[lang].empty}</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 object-contain"
                    />
                  )}
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="px-2 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="px-2 bg-gray-300 rounded"
                  >
                    +
                  </button>
                  <span>{item.price * item.qty} zł</span>
                  <button
                    onClick={() => updateQty(item.id, 0)}
                    className="text-red-600 font-bold"
                  >
                    {t[lang].remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="font-semibold text-lg mt-2">
          {t[lang].total}: {total} zł
        </p>
      </aside>

      {/* Formularz */}
      <section className="container mx-auto bg-white p-6 rounded-2xl shadow mt-6">
        <h2 className="text-2xl font-bold mb-4">{t[lang].order}</h2>
        <div className="flex gap-4 mb-4">
          <label>
            <input
              type="radio"
              name="ctype"
              value="private"
              checked={customerType === "private"}
              onChange={(e) => setCustomerType(e.target.value)}
            />
            {t[lang].private}
          </label>
          <label>
            <input
              type="radio"
              name="ctype"
              value="company"
              checked={customerType === "company"}
              onChange={(e) => setCustomerType(e.target.value)}
            />
            {t[lang].company}
          </label>
        </div>
        {customerType === "company" && (
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              {t[lang].invoiceData}:
            </label>
            <textarea className="w-full border rounded p-2"></textarea>
          </div>
        )}
        <button className="bg-yellow-400 px-4 py-2 rounded-lg font-bold">
          {t[lang].order}
        </button>
      </section>

      {/* Sekcja informacyjna */}
      <section className="container mx-auto bg-yellow-100 p-6 rounded-2xl shadow mt-6">
        <p className="text-gray-800">{t[lang].info}</p>
      </section>

      {/* Program lojalnościowy */}
      <section className="container mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {t[lang].programTitle}
        </h2>
        <p className="text-md text-gray-700 max-w-2xl mx-auto mb-10">
          {t[lang].programDesc}
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col gap-6">
            <img src="/karta1.jpg" alt="Karta 1" className="rounded-xl shadow" />
            <img src="/karta2.jpg" alt="Karta 2" className="rounded-xl shadow" />
          </div>
          <div>
            <img src="/ulotka.jpg" alt="Ulotka" className="rounded-xl shadow" />
          </div>
        </div>
      </section>

      {/* Przyczepka */}
      <section className="container mx-auto p-6 mt-12 bg-blue-100 rounded-2xl border-2 border-yellow-400">
        <h2 className="text-2xl font-bold text-blue-800 mb-3">
          {t[lang].trailer}
        </h2>
        <p className="text-gray-800 mb-2">
          • {t[lang].upTo3h}: <span className="font-semibold">20 zł</span>
        </p>
        <p className="text-gray-800">
          • {t[lang].over3h}: <span className="font-semibold">50 zł / doba</span>
        </p>
      </section>

      {/* Rozszerzenia */}
      <section className="mt-12 container mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">
          {t[lang].expansion}
        </h2>
        <p className="text-gray-700">{t[lang].expansionText}</p>
      </section>

      {/* Dostawa */}
      <section className="mt-12 container mx-auto text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          {t[lang].delivery}
        </h2>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="py-12">
        <div className="container mx-auto grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              {t[lang].contact}
            </h2>
            <p>📍 Ulica Podhalańska 25, 44-335 Jastrzębie-Zdrój</p>
            <p>📞 Stacja: +48 661 880 881</p>
            <p>📞 Właściciel: +48 601 441 314</p>
            <p>✉️ twoja.stacja.lpg@gmail.com</p>
          </div>
          <div className="w-full h-80 rounded-2xl overflow-hidden shadow border-4 border-yellow-400">
            <iframe
              title="Mapa stacji LPG"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2562.546854111!2d18.58014!3d49.95512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47115fa3c3f6d8ff%3A0x9a4b8a2dcf6bca!2sPodhalańska%2025%2C%2044-335%20Jastrzębie-Zdrój!5e0!3m2!1spl!2spl!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="bg-blue-600 text-white text-center p-4">
        <p>
          © {new Date().getFullYear()} Twoja Stacja LPG – {t[lang].reserved}
        </p>
      </footer>
    </div>
  );
}