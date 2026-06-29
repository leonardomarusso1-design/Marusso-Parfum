import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "https://ljsdkegxfcwrwqosbjsm.supabase.co",
  process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc2RrZWd4ZmN3cndxb3NianNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzM3NjUsImV4cCI6MjA5Njg0OTc2NX0.eaFkqPlMwlf9olr_qCLMbBLJlRJ76jR0ysfvj7BeFgk"
);

const API_SECRET = process.env.MARUSSO_API_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-API-Secret");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── GET: lista produtos ativos ────────────────────────────────────────────
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("marusso_products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ── POST: adiciona produto (requer secret) ────────────────────────────────
  if (req.method === "POST") {
    if (req.headers["x-api-secret"] !== API_SECRET) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    const body = req.body;
    const required = ["id", "name", "brand", "price", "image", "affiliate_link"];
    for (const field of required) {
      if (!body[field]) return res.status(400).json({ error: `Campo obrigatório: ${field}` });
    }

    const { data, error } = await supabase
      .from("marusso_products")
      .upsert({
        id: body.id,
        name: body.name,
        brand: body.brand ?? "ML",
        price: Number(body.price),
        original_price: body.original_price ? Number(body.original_price) : null,
        discount: body.discount ? Number(body.discount) : null,
        image: body.image,
        images: body.images ?? [],
        description: body.description ?? "",
        features: body.features ?? [],
        affiliate_link: body.affiliate_link,
        badge: body.badge ?? null,
        sold_count: body.sold_count ?? null,
        rating: body.rating ? Number(body.rating) : 4.7,
        gender: body.gender ?? "unissex",
        ml_item_id: body.ml_item_id ?? null,
        reviews: body.reviews ?? [],
        active: true,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Método não permitido" });
}
