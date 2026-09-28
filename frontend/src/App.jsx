import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import LpgPage from "./pages/LpgPage";
import InsurancePage from "./pages/InsurancePage";
import RouteFavicon from "./components/RouteFavicon";

export default function App() {
  return (
    <BrowserRouter>
      <RouteFavicon />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LpgPage />} />
          <Route path="ubezpieczenia" element={<InsurancePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
