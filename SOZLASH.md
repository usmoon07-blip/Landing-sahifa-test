# Buyurtmalarni Telegram botga ulash

**Hozirgi holat:** forma to'ldirilgach, mijozning Telegram'ida @usmairways bilan chat
buyurtma matni tayyor holda ochiladi va u "Yuborish" ni bosadi. Hech qanday sozlash kerak emas.

**Aksiya muddati:** `index.html` pastidagi `OFFER_END` qatorida (hozir 31-oktabr 23:59, Toshkent vaqti).
Muddat tugagach taymer va aksiya yozuvlari avtomatik yashiriladi. Yangi aksiya uchun sanani o'zgartiring.

Buyurtmalar mijoz "Yuborish" ni bosishini kutmasdan, botga **avtomatik** kelishini xohlasangiz, quyidagini qiling.
Forma buyurtmani **Cloudflare Worker** orqali Telegram botingizga yuboradi.
Bot tokeni sayt kodida emas, Worker ichida yashirin saqlanadi, shuning uchun uni hech kim o'g'irlay olmaydi.
Hammasi bepul va taxminan 10 daqiqa vaqt oladi.

## 1. Bot yarating

1. Telegram'da [@BotFather](https://t.me/BotFather) ga kiring va `/newbot` yozing.
2. Botga nom va username bering (masalan `theusmondigital_ariza_bot`).
3. BotFather bergan **tokenni** saqlab qo'ying (`123456789:AA...` ko'rinishida).

## 2. Chat ID ni oling

1. Yangi botingizga kirib **Start** bosing va istalgan xabar yozing.
2. Brauzerda quyidagi manzilni oching (TOKEN o'rniga o'z tokeningizni qo'ying):
   `https://api.telegram.org/botTOKEN/getUpdates`
3. Javobdagi `"chat":{"id": 123456789 ...}` raqami sizning **CHAT_ID** ingiz.

> Arizalar guruhga kelishini xohlasangiz, botni guruhga qo'shing, guruhda xabar yozing va yuqoridagi amalni takrorlang (guruh ID `-100...` bilan boshlanadi).

## 3. Cloudflare Worker yarating

1. [dash.cloudflare.com](https://dash.cloudflare.com) da bepul ro'yxatdan o'ting.
2. **Workers & Pages → Create → Create Worker** ni bosing, nom bering (masalan `ariza`) va **Deploy** qiling.
3. **Edit code** ni bosing, ichidagi kodni o'chirib, shu repodagi `telegram-worker.js` faylining to'liq matnini joylang va **Deploy** bosing.
4. Worker sahifasida **Settings → Variables and Secrets** bo'limiga quyidagilarni qo'shing:
   - `BOT_TOKEN`: 1-qadamdagi token (turi: **Secret**)
   - `CHAT_ID`: 2-qadamdagi raqam
   - `ALLOWED_ORIGIN` (ixtiyoriy): saytingiz manzili, masalan `https://theusmondigital.uz`
5. Worker manzilini nusxalang (masalan `https://ariza.sizning-nomingiz.workers.dev`).

## 4. Saytga ulang

`index.html` faylining pastki qismida shu qatorni toping:

```js
const FORM_ENDPOINT = "";
```

va Worker manzilini qo'ying:

```js
const FORM_ENDPOINT = "https://ariza.sizning-nomingiz.workers.dev";
```

Tayyor. Endi saytdagi har bir buyurtma Telegram'ga quyidagi ko'rinishda keladi:

```
🆕 Assalomu alaykum! Saytdan buyurtma:

Xizmat: Telegram bot + Mini App
Funksiyalar (3): To‘lov tizimi, AI yordamchi, Yetkazib berish
Aksiya narxi: $295

Ism: Aziz
Telefon: +998 90 123 45 67
Biznes: restoran
Telegram: @aziz
Izoh: ...
```
