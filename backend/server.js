

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Konfiguracja nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint do zamówień
app.post("/api/order", async (req, res) => {
  try {
    const { cart, customer, payment, lang } = req.body;

    // Jeżeli brak koszyka -> błąd
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Koszyk jest pusty" });
    }

    // Teksty PL/EN
    const t = lang === "en" ? {
      subject: "New LPG Station Order",
      customer: "Customer data",
      name: "Name",
      company: "Company",
      nip: "VAT ID",
      phone: "Phone",
      email: "E-mail",
      payment: "Payment method",
      products: "Ordered products",
      total: "Total",
      eta: "Estimated time",
    } : {
      subject: "Nowe zamówienie - Stacja LPG",
      customer: "Dane klienta",
      name: "Imię i nazwisko",
      company: "Firma",
      nip: "NIP",
      phone: "Telefon",
      email: "E-mail",
      payment: "Forma płatności",
      products: "Zamówione produkty",
      total: "Razem",
      eta: "Przewidywany czas",
    };

    // Produkty w mailu
    const productList = cart.map(item =>
      `${item.name} - ${item.quantity} szt. = ${(item.price * item.quantity).toFixed(2)} zł (${t.eta}: ${item.eta || "—"})`
    ).join("\n");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Treść maila
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: t.subject,
      text: `
${t.customer}:
${t.name}: ${customer.name}
${t.company}: ${customer.company || "-"}
${t.nip}: ${customer.nip || "-"}
${t.phone}: ${customer.phone}
${t.email}: ${customer.email}

${t.payment}: ${payment}

${t.products}:
${productList}

${t.total}: ${total.toFixed(2)} zł
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Zamówienie wysłane poprawnie!" });

  } catch (error) {
    console.error("Błąd wysyłki:", error);
    res.status(500).json({ error: "Nie udało się wysłać zamówienia" });
  }
});

app.listen(PORT, () => console.log(`✅ Backend działa na http://localhost:${PORT}`));v