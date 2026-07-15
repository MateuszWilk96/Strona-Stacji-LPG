import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./layout/Layout";

/**
 * Tymczasowa strona LPG.
 *
 * W kolejnym etapie zostanie zastąpiona pełną stroną,
 * która zachowa obecny wygląd Twojej Stacji LPG.
 */
function TemporaryLpgPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
          Moduł LPG
        </p>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">
          Twoja Stacja LPG
        </h1>

        <p className="mb-2 text-lg text-gray-700">
          Podhalańska 25, 44-335 Jastrzębie-Zdrój
        </p>

        <p className="mb-8 text-gray-600">
          Obecna strona LPG zostanie przeniesiona do tego widoku bez zmiany
          dotychczasowego wyglądu.
        </p>

        <Link
          to="/ubezpieczenia"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Przejdź do Twojej Strefy Ubezpieczeń
        </Link>
      </div>
    </section>
  );
}

/**
 * Tymczasowa strona multiagencji.
 *
 * W kolejnych etapach dodamy:
 * - ofertę ubezpieczeń,
 * - partnerów,
 * - kalkulator orientacyjny,
 * - formularz dokładnej wyceny,
 * - kontakt do agentów.
 */
function TemporaryInsurancePage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-emerald-700">
          Multiagencja ubezpieczeniowa
        </p>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">
          Twoja Strefa Ubezpieczeń
        </h1>

        <p className="mb-2 text-lg text-gray-700">
          Podhalańska 25, 44-335 Jastrzębie-Zdrój
        </p>

        <p className="mb-8 text-gray-600">
          Tutaj powstanie pełna strona agencji wraz z kalkulatorem
          orientacyjnym i możliwością wysłania danych do dokładnej analizy.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Wróć do Twojej Stacji LPG
        </Link>
      </div>
    </section>
  );
}

/**
 * Strona wyświetlana dla nieprawidłowego adresu.
 */
function NotFoundPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <p className="mb-2 text-6xl font-bold text-blue-600">404</p>

        <h1 className="mb-4 text-2xl font-bold">
          Nie znaleziono strony
        </h1>

        <p className="mb-6 text-gray-600">
          Podany adres nie istnieje.
        </p>

        <Link
          to="/"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Przejdź na stronę główną
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<TemporaryLpgPage />} />

          <Route
            path="ubezpieczenia"
            element={<TemporaryInsurancePage />}
          />

          <Route path="404" element={<NotFoundPage />} />

          <Route
            path="*"
            element={<Navigate to="/404" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}