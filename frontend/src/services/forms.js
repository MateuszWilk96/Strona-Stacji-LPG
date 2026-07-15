function encode(data) {
  return new URLSearchParams(Object.entries(data).map(([key, value]) => [key, typeof value === "boolean" ? String(value) : value ?? ""])).toString();
}

export async function submitNetlifyForm(formName, fields) {
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode({ "form-name": formName, ...fields })
  });
  if (!response.ok) throw new Error("Netlify Forms zwrócił błąd");
}

export async function submitGoogleSheet(url, payload) {
  if (!url) return;
  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
}
