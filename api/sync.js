const SUPABASE_URL = process.env.SUPABASE_URL || "https://ljsdkegxfcwrwqosbjsm.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc2RrZWd4ZmN3cndxb3NianNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzM3NjUsImV4cCI6MjA5Njg0OTc2NX0.eaFkqPlMwlf9olr_qCLMbBLJlRJ76jR0ysfvj7BeFgk";
const API_SECRET   = process.env.MARUSSO_API_SECRET || "12e8e7c07cd6672f42ceccc20580a8616ae7892726951d90";

const sbHeaders = {
  "apikey": SUPABASE_KEY,
  "Authorization": "Bearer " + SUPABASE_KEY,
  "Content-Type": "application/json",
};

export default async function handler(req, res) {
  if (req.headers["x-api-secret"] !== API_SECRET)
    return res.status(401).json({ error: "Não autorizado" });

  const r = await fetch(
    SUPABASE_URL + "/rest/v1/marusso_products?select=id,affiliate_link,active",
    { headers: sbHeaders }
  );
  const products = await r.json();
  if (!r.ok) return res.status(500).json({ error: JSON.stringify(products) });

  const changed = [];
  for (const p of products) {
    try {
      const resp = await fetch(p.affiliate_link, {
        method: "HEAD", redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
      const outOfStock = resp.status === 404 || resp.url.includes("pausado");
      const nowActive = !outOfStock;
      if (nowActive !== p.active) {
        await fetch(SUPABASE_URL + "/rest/v1/marusso_products?id=eq." + p.id, {
          method: "PATCH", headers: sbHeaders,
          body: JSON.stringify({ active: nowActive }),
        });
        changed.push({ id: p.id, was: p.active, now: nowActive });
      }
    } catch (_) {}
  }
  return res.status(200).json({ synced: products.length, changed });
}
