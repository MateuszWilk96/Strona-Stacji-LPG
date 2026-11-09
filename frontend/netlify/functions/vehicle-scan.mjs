// Netlify Function: images are forwarded to the AI service, never written to disk or logs.
const allowed = ['image/jpeg', 'image/png', 'image/webp'];
const empty = {marka:'',model:'',rokProdukcji:'',pojemnoscCm3:'',paliwo:''};
export default async (request) => {
  if (request.method !== 'POST') return Response.json({error:'Metoda niedozwolona.'},{status:405});
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({error:'Usługa odczytu nie jest jeszcze skonfigurowana.'},{status:503});
  try {
    const {image,consent} = await request.json();
    if (consent !== true) return Response.json({error:'Wymagana jest zgoda na analizę zdjęcia.'},{status:400});
    if (typeof image !== 'string' || image.length > 5_700_000) return Response.json({error:'Nieprawidłowy rozmiar zdjęcia.'},{status:413});
    const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(image);
    if (!match || !allowed.includes(match[1])) return Response.json({error:'Nieobsługiwany format zdjęcia.'},{status:400});
    const response = await fetch('https://api.openai.com/v1/responses', {
      method:'POST', headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:'gpt-4.1-mini',store:false,max_output_tokens:350,
        input:[{role:'user',content:[
          {type:'input_text',text:'Odczytaj wyłącznie dane techniczne pojazdu z polskiego dowodu rejestracyjnego. Nie zwracaj danych osobowych, numerów dokumentu, VIN, tablic rejestracyjnych ani adresów. Nie zgaduj brakujących wartości. Zwróć dokładnie obiekt JSON z polami marka, model, rokProdukcji, pojemnoscCm3, paliwo; wszystkie wartości jako tekst, puste jeśli niepewne. Rok produkcji podaj tylko jeśli wyraźnie widnieje w dokumencie (nie utożsamiaj z datą pierwszej rejestracji).'},
          {type:'input_image',image_url:image,detail:'high'}]}],text:{format:{type:'json_schema',name:'vehicle',strict:true,schema:{type:'object',additionalProperties:false,properties:Object.fromEntries(Object.keys(empty).map(k=>[k,{type:'string'}])),required:Object.keys(empty)}}}})
    });
    if (!response.ok) return Response.json({error:'Usługa AI chwilowo niedostępna. Spróbuj ponownie później.'},{status:502});
    const result = await response.json();
    const output = result.output?.flatMap(item=>item.content||[]).find(c=>c.type==='output_text')?.text;
    if (!output) return Response.json({error:'Nie udało się odczytać danych ze zdjęcia.'},{status:422});
    const parsed = JSON.parse(output);
    return Response.json({vehicle:Object.fromEntries(Object.keys(empty).map(k=>[k,String(parsed[k]??'').slice(0,100)]))},{headers:{'Cache-Control':'no-store'}});
  } catch { return Response.json({error:'Nie udało się przetworzyć zdjęcia.'},{status:500}); }
};
export const config = {path:'/.netlify/functions/vehicle-scan'};
