# 🚀 Polygon2 — Users CRUD + Map Polygon Drawing (React + TypeScript)

Ushbu loyiha texnik topshiriq asosida ishlab chiqilgan bo‘lib, ikki mustaqil sahifadan iborat:

1. **Users (CRUD) sahifasi** — foydalanuvchilar bilan ishlash, form validatsiya, modal, IndexedDB saqlash
2. **Map (Xarita) sahifasi** — Leaflet/react-leaflet yordamida polygon chizish

Loyiha to‘liq **React + TypeScript**, **Zustand**, **Shadcn UI**, **Tailwind CSS**, **IndexedDB**, **React-Leaflet**, va **ESLint/Prettier** asosida tayyorlangan.

---

# 📌 Funksionallik (TL;DR)

### ✅ **1) Users — CRUD tizimi (Majburiy)**
- Foydalanuvchilar ro‘yxati
- Yangi user qo‘shish — **modal ichida forma**
- Foydalanuvchi ma’lumotini tahrirlash
- O‘chirish (tasdiqlovchi modal bilan)
- Qidiruv (500ms debounce bilan)
- Pagination (har 5 ta elementdan)
- Skeleton loading (animatsiya)
- IndexedDB orqali ma’lumotni saqlash (offline-friendly)
- react-hook-form + zod orqali validatsiya

### 🗺 **2) Map sahifasi — Polygon chizish (Majburiy)**
- Leaflet / react-leaflet orqali interaktiv xarita
- Har bosilgan nuqta orqali polygon vertexlari qo‘shiladi
- Polygon shakllantirish
- Polygonni o‘chirish / tozalash
- Bonus: Turf.js bilan polygon maydonini hisoblash (ixtiyoriy)
- Performance optimization (yirik datasetlar uchun)

### 📚 **3) Repository va Hujjatlashtirish (Majburiy)**
- GitHub public repo
- To‘liq README.md:
  - o‘rnatish bo‘yicha qo‘llanma
  - Node versiyasi
  - kutubxonalar ro‘yxati
  - qisqa arxitektura izohi
  - funksiyalar va ishlash mantig‘i
  - attachments (screenshot/video)
- Semantik commitlar (`feat:`, `fix:`, `chore:`, `refactor:`)

---

# 🔧 Texnik Talablar (To‘liq bajarilgan)

| Talab | Holati |
|------|--------|
| React + TypeScript | ✅ |
| Lint: ESLint + Prettier | ✅ |
| UI kit: Tailwind CSS + Shadcn UI | ✅ |
| State: Zustand (persist bilan) | ✅ |
| Form: react-hook-form + zod | ✅ |
| Storage: IndexedDB | ✅ |
| Map: Leaflet/react-leaflet | ✅ |
| Responsive dizayn | ✅ |
| Clean code & folder architecture | ✅ |

---

# 📁 Loyiha Arxitekturasi

