// Cloudflare Worker: saytdagi buyurtmani Telegram botga yuboradi.
// Bot tokeni saytda ko'rinmasligi uchun shu yerda (Worker sozlamalarida) saqlanadi.
//
// Kerakli o'zgaruvchilar (Settings → Variables and Secrets):
//   BOT_TOKEN       — @BotFather bergan token (Secret sifatida)
//   CHAT_ID         — buyurtmalar keladigan chat ID
//   ALLOWED_ORIGIN  — ixtiyoriy, masalan https://usmoon07-blip.github.io (bo'sh bo'lsa hamma saytdan qabul qiladi)
//
// Sayt { "text": "..." } yuboradi — buyurtma matni saytning o'zida tayyorlanadi.

const MAX_LENGTH = 3000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ ok: false, error: "method" }, 405, cors);
    if (allowed !== "*" && origin !== allowed) return json({ ok: false, error: "origin" }, 403, cors);

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "json" }, 400, cors);
    }

    const text = String(data.text ?? "").trim().slice(0, MAX_LENGTH);
    if (!text) return json({ ok: false, error: "validation" }, 400, cors);

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text: "🆕 " + text, disable_web_page_preview: true }),
    });

    if (!tg.ok) return json({ ok: false, error: "telegram" }, 502, cors);
    return json({ ok: true }, 200, cors);
  },
};

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
