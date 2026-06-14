# Storvana — Premium Mobile Commerce

> Built by [Mohit Lakhara](https://github.com/mohitlakhara-ind) | React Native · TypeScript · Medusa.js

*Storvana* = Store + Nirvana. A luxury-dark e-commerce mobile app where shopping feels premium. Built on the Medusa.js open-commerce engine with a bespoke warm-amber UI system.

---

## ✨ What Makes Storvana Different

### Core
- **Product Catalog** — Browse by collection/category with parallax scroll hero
- **Cart & Checkout** — Full cart management, address, shipping method, payment
- **Order History** — View past orders, track delivery status
- **Medusa Backend** — Self-hosted or Medusa Cloud, full commerce API

### 🆕 Original Features
1. **❤️ Offline Wishlist** — Save any product to a local wishlist (AsyncStorage-persisted). Shows a `🔥 -37%` price-drop badge when the product goes on sale. Heart button has spring animation on toggle.
2. **🔍 Smart Search** — 300ms debounced live search with saved recent queries (stored locally), trending tags (auto-generated from popular views), and a clean no-results state.

---

## 🎨 Design

| | |
|---|---|
| **Palette** | Amber gold `#F59E0B` + Charcoal `#0C0B0A` |
| **Accent** | Pink `#EC4899` (sale/discount highlights) |
| **Style** | Warm luxury dark mode |
| **Fonts** | Inter (body) + Playfair Display (product names) |
| **Components** | SkeletonCard loaders, AnimatedCartButton, BlurTabBar |

---

## 🛠 Stack

| | |
|---|---|
| Mobile | React Native 0.82 (bare workflow) |
| Language | TypeScript |
| Navigation | React Navigation v7 |
| Commerce | Medusa.js v2 |
| State | React Query + Context |
| Local Store | AsyncStorage |
| Gestures | react-native-gesture-handler |
| Animation | react-native-reanimated v4 |

---

## 🚀 Run It

```bash
npm install
npx react-native start

# Android (new terminal)
npx react-native run-android

# iOS (Mac only)
npx react-native run-ios
```

Environment:
```bash
cp .env.template .env
# Set: MEDUSA_BACKEND_URL=http://localhost:9000
```

---

## 📂 Structure

```
storvana/
├── app/
│   ├── screens/          ← home, product-detail, cart, checkout, wishlist (new), etc.
│   ├── components/       ← SearchWithHistory (new), SkeletonCard, etc.
│   ├── styles/           ← storvana-theme.ts design system
│   ├── api/              ← Medusa JS SDK client
│   └── types/
├── android/
└── ios/
```

---

MIT © 2026 Mohit Lakhara
