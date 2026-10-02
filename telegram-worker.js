// Cloudflare Worker: saytdagi arizani Telegram botga yuboradi.
// Bot tokeni saytda ko'rinmasligi uchun shu yerda (Worker sozlamalarida) saqlanadi.
//
// Kerakli o'zgaruvchilar (Settings → Variables and Secrets):
//   BOT_TOKEN       — @BotFather bergan token (Secret sifatida)
//   CHAT_ID         — arizalar keladigan chat ID (sizning yoki guruh ID)
//   ALLOWED_ORIGIN  — ixtiyoriy, masalan https://theusmondigital.uz (bo'sh bo'lsa hamma saytdan qabul qiladi)

const LIMITS = { name: 80, phone: 30, telegram: 40, tier: 40, level: 120, goal: 1000 };

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowed === "*" ? "*" : allowed,
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

    if (data.website) return json({ ok: true }, 200, cors); // spam bot

    const clean = {};
    for (const [key, max] of Object.entries(LIMITS)) {
      clean[key] = String(data[key] ?? "").trim().slice(0, max);
    }
    if (!clean.name || clean.phone.replace(/\D/g, "").length < 9) {
      return json({ ok: false, error: "validation" }, 400, cors);
    }

    const text = [
      "🆕 Yangi ariza — theusmondigital",
      "",
      `👤 Ism: ${clean.name}`,
      `📞 Telefon: ${clean.phone}`,
      `✈️ Telegram: ${clean.telegram || "—"}`,
      `💎 Tarif: ${clean.tier || "—"}`,
      `📚 Daraja: ${clean.level || "—"}`,
      `🎯 Maqsad: ${clean.goal || "—"}`,
    ].join("\n");

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text, disable_web_page_preview: true }),
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
