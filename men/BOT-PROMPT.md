# Botga "Bot yaratuvchisi" tugmasini qo'shish — prompt

Quyidagi promptni botni yozayotgan AI'ga (Claude, ChatGPT va h.k.) to'liq nusxalab bering.

---

## PROMPT (nusxalang)

```
Mening Telegram botimga "Bot yaratuvchisi" tugmasini qo'sh. Talablar:

1. Tugma matni: "🤖 Bot yaratuvchisi: usmoai"
2. Tugma bosilganda Telegram ichida Mini App (WebApp) sifatida shu sayt ochilsin:
   https://usmoon07-blip.github.io/Landing-sahifa-test/men/
   - Inline klaviaturada `web_app` turidagi tugma ishlat (InlineKeyboardButton(web_app=WebAppInfo(url=...))).
   - Agar `web_app` tugmasi ishlamaydigan joy bo'lsa (masalan guruh chatlari), oddiy `url` tugmaga o'tsin.
3. Tugma qayerda chiqsin:
   - /start xabarining eng pastida (asosiy menyu tugmalaridan keyin, alohida qatorda).
   - "ℹ️ Bot haqida" (yoki /about) bo'limida ham.
   - Botning asosiy funksiyalarini to'smasin — har doim eng oxirgi qatorda tursin.
4. Ixtiyoriy: /about matni oxiriga kichik yozuv qo'sh:
   "Bot yaratuvchisi: @usmoai — o'zingizga ham shunday bot kerakmi?"
5. Botning mavjud kodini, tugmalarini va logikasini buzma — faqat shu tugmani qo'sh.
6. Sayt URL'ini bitta konstantada saqla (CREATOR_URL), keyin oson o'zgartirish uchun.
7. O'zgargan fayllarni to'liq ko'rsat va qisqacha nima qilganingni tushuntir.
```

---

## Namuna kod (aiogram 3)

```python
from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import (Message, InlineKeyboardMarkup,
                           InlineKeyboardButton, WebAppInfo)

CREATOR_URL = "https://usmoon07-blip.github.io/Landing-sahifa-test/men/"
CREATOR_TEXT = "🤖 Bot yaratuvchisi: usmoai"

router = Router()

def creator_button(private: bool = True) -> InlineKeyboardButton:
    # Shaxsiy chatda Mini App, guruhda oddiy link
    if private:
        return InlineKeyboardButton(text=CREATOR_TEXT, web_app=WebAppInfo(url=CREATOR_URL))
    return InlineKeyboardButton(text=CREATOR_TEXT, url=CREATOR_URL)

def main_menu(private: bool = True) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        # ... botning asosiy tugmalari shu yerda ...
        [creator_button(private)],  # har doim oxirgi qator
    ])

@router.message(CommandStart())
async def start(msg: Message):
    await msg.answer("Xush kelibsiz!", reply_markup=main_menu(msg.chat.type == "private"))

@router.message(Command("about"))
async def about(msg: Message):
    await msg.answer(
        "Bot haqida ma'lumot...\n\n"
        "Bot yaratuvchisi: @usmoai — o'zingizga ham shunday bot kerakmi?",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[creator_button(msg.chat.type == "private")]]),
    )
```

## Muhim

- Sayt Mini App'da ochilganda birinchi marta **"Assalomu alaykum! Sahifamizga xush kelibsiz!"** tanishuv oynasi chiqadi (keyingi safar chiqmaydi).
- Mijoz botiga "Bot yaratuvchisi" yozuvini qo'yishdan oldin mijozdan ruxsat oling.
