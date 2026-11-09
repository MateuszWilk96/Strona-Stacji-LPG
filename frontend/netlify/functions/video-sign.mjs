import crypto from "node:crypto";

export default async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "Zaloguj się do panelu." }, { status: 401 });
  // Validate identity server-side. Never trust a browser-provided role or email.
  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (!siteUrl) return Response.json({ error: "Brak adresu witryny Netlify." }, { status: 500 });
  let identity;
  try {
    const res = await fetch(`${siteUrl}/.netlify/identity/user`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return Response.json({ error: "Sesja wygasła." }, { status: 401 });
    identity = await res.json();
  } catch { return Response.json({ error: "Nie udało się zweryfikować konta." }, { status: 503 }); }
  

const roles = identity.app_metadata?.roles;

const isAdmin =
  Array.isArray(roles) &&
  roles.some(
    (role) =>
      typeof role === "string" &&
      role.toLowerCase() === "admin"
  );

if (!isAdmin) {
  return Response.json(
    { error: "Tylko administrator może przesyłać filmy." },
    { status: 403 }
  );
}


  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return Response.json({ error: "Skonfiguruj Cloudinary w Netlify." }, { status: 503 });
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "twojastrefa/ubezpieczenia";
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(toSign + secret).digest("hex");
  return Response.json({ cloud, apiKey: key, timestamp, folder, signature });
};
