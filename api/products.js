const SUPABASE_URL = process.env.SUPABASE_URL || "https://ljsdkegxfcwrwqosbjsm.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc2RrZWd4ZmN3cndxb3NianNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzM3NjUsImV4cCI6MjA5Njg0OTc2NX0.eaFkqPlMwlf9olr_qCLMbBLJlRJ76jR0ysfvj7BeFgk";
const API_SECRET   = process.env.MARUSSO_API_SECRET || "12e8e7c07cd6672f42ceccc20580a8616ae7892726951d90";

const sbHeaders = {
  "apikey": SUPABASE_KEY,
  "Authorization": "Bearer " + SUPABASE_KEY,
  "Content-Type": "application/json",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-API-Secret");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const r = await fetch(
        SUPABASE_URL + "/rest/v1/marusso_products?active=eq.true&order=created_at.asc&select=*",
        { headers: sbHeaders }
      );
      const data = await r.json();
      if (!r.ok) return res.status(500).json({ error: JSON.stringify(data) });
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    if (req.headers["x-api-secret"] !== API_SECRET)
      return res.status(401).json({ error: "Não autorizado" });

    const b = req.body;
    const payload = {
      id: b.id,
      name: b.name,
      brand: b.brand || "ML",
      price: Number(b.price),
      original_price: b.original_price ? Number(b.original_price) : null,
      discount: b.discount ? Number(b.discount) : null,
      image: b.image,
      images: b.images || [],
      description: b.description || "",
      features: b.features || [],
      affiliate_link: b.affiliate_link,
      badge: b.badge || null,
      sold_count: b.sold_count || null,
      rating: b.rating ? Number(b.rating) : 4.7,
      gender: b.gender || "unissex",
      ml_item_id: b.ml_item_id || null,
      reviews: b.reviews || [],
      active: true,
    };

    try {
      const r = await fetch(SUPABASE_URL + "/rest/v1/marusso_products", {
        method: "POST",
        headers: { ...sbHeaders, "Prefer": "return=representation,resolution=merge-duplicates" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) return res.status(500).json({ error: JSON.stringify(data) });
      return res.status(201).json(Array.isArray(data) ? data[0] : data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}
