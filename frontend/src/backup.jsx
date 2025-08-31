import { useEffect, useState } from "react";

export default function App() {
  const [cart, setCart] = useState([]);
  const [lpgPrice, setLpgPrice] = useState(null);
  const [headerImage, setHeaderImage] = useState("/header.webp"); // domyślny baner

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setLpgPrice(data.lpgPrice))
      .catch((err) => console.error("Błąd wczytywania ceny LPG:", err));
  }, []);

  const products = [
    {
      id: 2,
      name: "Gaz w butli 11KG Propan-Butan",
      price: 75,
      desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.",
      image: "/butla-11kg.png",
    },
    { 
      id: 3, 
      name: "Gaz w butli 10KG Propan-Butan",
      price: 85, 
      desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", 
      image: "/butla-11kg.png" 
    },
    { 
      id: 4, 
      name: "Gaz w butli 8KG Propan-Butan", 
      price: 62, 
      desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", 
      image: "/butla-8kg.jpg" 
    },
    { 
      id: 5, 
      name: "Gaz w butli 5KG", 
      price: 53, 
      desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", 
      image: "/butla-5kg.jpg"  
    },
    { 
      id: 6, 
      name: "Gaz w butli 3KG", 
      price: 45, 
      desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", 
      image: "/butla-3kg.jpg"  
    },
    { 
      id: 7, 
      name: "Gaz w butli 2KG", 
      price: 40, 
      desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", 
      image: "/butla-2kg.jpg" 
    },
    { 
      id: 8, 
      name: "Gaz w butli 1KG", 
      price: 27, 
      desc: "Cena za wymianę lub napełnienie. Wymagana własna butla.", 
      image: "/butla-1kg.jpg"  
    },
    { 
      id: 9, 
      name: "Pojemnik 11KG", 
      price: 260, 
      desc: "Cena za pustą butlę (bez gazu).", 
      image: "/butla-11kg.png" 
    },
    { 
      id: 10, 
      name: "Sodastream Nabój", 
      price: 15,
      desc: "Cena za wymianę butli Click On lub Twist On", 
      image: "/SodaStream.jpg" 
    },
    { 
      id: 11, 
      name: "Płyn do spryskiwaczy letni", 
      price: 11, 
      desc: "Opakowanie 5L. Chroni przed owadami, Zapach zielonego jabłka.", 
      image: "/Płyn-lato.jpg"  
    },
    { 
      id: 12, 
      name: "Płyn do spryskiwaczy zimowy", 
      price: 22, 
      desc: "Opakowanie 5L. Odporny na mróz do -20 stopni, Zapach cytrusowy.", 
      image: "/Płyn-zima.jpg"  
    },
  ];

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Zwiększanie ilości
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Zmniejszanie ilości
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Usuwanie całkowite
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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

      {/* Informacje podstawowe */}
      <section className="text-center py-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-2">Witamy!</h2>
        <p className="text-gray-700">Ulica Podhalańska 25, 44-335 Jastrzębie-Zdrój</p>
        <p className="text-lg font-semibold text-yellow-600 mt-2">
          Cena LPG na stacji: {lpgPrice ? `${lpgPrice} zł / L` : "Ładowanie..."}
        </p>
      </section>

      {/* Sklep */}
      <main id="sklep" className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between border-t-4 border-yellow-400">
            {product.image && <img src={product.image} alt={product.name} className="h-40 w-auto mx-auto mb-4 object-contain" />}
            <h3 className="text-lg font-semibold mb-2 text-center text-blue-800">{product.name}</h3>
            <p className="text-base mb-1 text-center text-blue-700">{product.price.toFixed(2)} zł</p>
            {product.desc && <p className="text-sm text-gray-600 mb-4 text-center">{product.desc}</p>}
            <button onClick={() => addToCart(product)} className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-500 mt-auto">
              Dodaj do koszyka
            </button>
          </div>
        ))}
      </main>

      import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // pobieranie produktów z JSON
  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Błąd wczytywania produktów:", err));
  }, []);

  // ➕ Dodaj do koszyka
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // 🔼 Zwiększ ilość
  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // 🔽 Zmniejsz ilość
  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ❌ Usuń z koszyka
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 🧮 Suma do zapłaty
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Baner */}
      <header className="relative w-full h-64 md:h-80 lg:h-96">
        <img
          src="/header.jpg"
          alt="Baner stacji LPG"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Twoja Stacja LPG</h1>
          <p className="text-lg md:text-xl font-semibold">
            Ulica Podhalańska 25, 44-335 Jastrzębie-Zdrój
          </p>
        </div>
      </header>

      {/* Sklep */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Oferta</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 object-contain mx-auto"
              />
              <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
              <p className="text-yellow-600 font-bold">{product.price} zł</p>
              {product.description && (
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              )}
              <button
                onClick={() => addToCart(product)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Dodaj do koszyka
              </button>
            </div>
          ))}
        </div>

        {/* Koszyk */}
        <section className="mt-10 bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Koszyk</h2>

          {cart.length === 0 ? (
            <p className="text-gray-600">Koszyk jest pusty</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b py-3"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600">
                      {item.price} zł x {item.quantity} ={" "}
                      <span className="font-bold">
                        {(item.price * item.quantity).toFixed(2)} zł
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-600 hover:underline"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 text-right font-bold text-lg">
                Razem: {totalPrice.toFixed(2)} zł
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );

export default App;

      {/* Karta stałego klienta */}
      <section className="container mx-auto mt-16 text-center">
  <h2 className="text-2xl font-bold mb-4 text-blue-700">
    Dołącz do programu i zbieraj podpisy przy każdej wymianie butli lub tankowaniu LPG.
  </h2>
  <p className="text-md text-gray-700 max-w-2xl mx-auto mb-10">
    Po zebraniu kompletu — rabat <span className="font-bold text-yellow-500">50%</span> 
    na następną butlę lub stały rabat od nowej karty przy LPG.
  </p>

  <div className="flex flex-col md:flex-row justify-center items-center gap-8">
    {/* Dwie karty stałego klienta jedna pod drugą */}
    <div className="flex flex-col gap-6">
      <img
        src="/karta1.jpg"
        alt="Karta stałego klienta 1"
        className="rounded-xl shadow mx-auto max-h-56 object-contain"
      />
      <img
        src="/karta2.jpg"
        alt="Karta stałego klienta 2"
        className="rounded-xl shadow mx-auto max-h-56 object-contain"
      />
    </div>

    {/* Ulotka obok kart */}
    <div>
      <img
        src="/ulotka.jpg"
        alt="Ulotka z rabatem"
        className="rounded-xl shadow mx-auto max-h-[500px] object-contain"
      />
    </div>
  </div>
</section>

      {/* Przyczepka */}
      <section id="przyczepka" className="container mx-auto p-6 mt-12 bg-blue-100 rounded-2xl border-2 border-yellow-400">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-3">Wypożyczenie przyczepki</h2>
        <p className="text-gray-800 mb-2">• Do 3 godzin: <span className="font-semibold text-blue-900">20 zł</span></p>
        <p className="text-gray-800">• Powyżej 3 godzin: <span className="font-semibold text-blue-900">50 zł / doba</span></p>
      </section>
      <section className="mt-12 container mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Planowane rozszerzenie asortymentu</h2>
        <p className="text-gray-700">Już wkrótce dostępne będą akcesoria do butli i LPG!</p>
      </section>
      <section className="mt-12 container mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Możliwa dostawa Butli 11Kg w cenie 20zł pod numerem +48 601 441 314</h2>
      </section>
      
      {/* Kontakt + mapa */}
      <section id="kontakt" className="py-12">
        <div className="container mx-auto grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Kontakt</h2>
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
        <p>© {new Date().getFullYear()} Twoja Stacja LPG – Wszystkie prawa zastrzeżone</p>
      </footer>
    </div>
  );
}
