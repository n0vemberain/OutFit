# OutFit — Smart Wardrobe & AI Color Stylist

<div align="center">

![OutFit Banner](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80)

**A luxury mobile application built with React Native, modern Glassmorphism, local-first SQLite wear frequency tracking, and multimodal AI skin tone analysis powered by Google Gemini 3.8 Flash.**

[![React Native](https://img.shields.io/badge/React_Native-0.88.0-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo_SDK-58.0.0-000020?logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57?logo=sqlite&logoColor=white)](https://docs.expo.dev/versions/latest/sdk/sqlite/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-gemini--3.8--flash-8B5CF6?logo=google&logoColor=white)](https://ai.google.dev)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-brightgreen)](https://github.com/n0vemberain/OutFit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Features Overview

### 💎 1. Luxury Glassmorphism Design System
- **Frosted Translucent Cards**: Uses `expo-blur` (`BlurView`) with Android hardware acceleration fallbacks (`dimezisBlurView`) to render layered, frosted translucent surfaces.
- **Ambient Light Refraction**: Engineered radiant gradient glow orbs (Electric Violet, Neon Cyan, Rose Glow) that subtly illuminate through cards while scrolling.
- **Specular Sheens & Tactile Feedback**: Micro-interactions with specular linear highlight borders, glowing badges, elevation drop shadows, and Android ripple effects.
- **Floating Glass Dock Navigation**: Frosted pill navigation dock anchoring screens with seamless active tab transitions.

### 🗄️ 2. Local-First SQLite Database & Wear Tracking
- **Zero-Latency Offline Architecture**: Powered by `expo-sqlite` configured with Write-Ahead Logging (`WAL`) mode and relational foreign key constraints.
- **Wear Frequency Tracker**: Track wear counts, last-worn dates, and log wear occasions (Work, Date Night, Casual, Events) with 1–5 star ratings and pairing notes.
- **Cost-Per-Wear (CPW) Engine**: Calculates exact investment metrics per garment (`Purchase Price / Wear Count = Cost per Wear`).
- **Starter Capsule Wardrobe**: Auto-seeds 11 curated capsule items on initial launch (Merino Wool Knit, Raw Selvedge Denim, Camel Wool Coat, Veja Sneakers, Silk Blouse, etc.).

### 🔮 3. Gemini 3.8 Flash Vision AI Color Stylist
- **Multimodal Portrait Vision**: Captures a live selfie via native Camera or selects an existing photo from the gallery (`expo-image-picker`).
- **Scientific Undertone Detection**: Evaluates skin tone depth, undertones (*Warm*, *Cool*, *Neutral*, *Olive*), and facial contrast level (*High*, *Medium*, *Low*).
- **Seasonal Color Palette**: Recommends personalized color palettes (*Deep Autumn*, *Cool Summer*, *Bright Winter*, *Soft Spring*) with color names, hex swatches, and styling rationale.
- **Colors to Avoid**: Flags clashing shades that wash out or overwhelm natural skin undertones.
- **Instant Demo Profiles**: Includes 4 diverse model profiles (Golden Tan, Porcelain Rose, Deep Espresso, Olive Neutral) to test without needing a camera.

### 👕 4. Closet Color Palette Matching
- Computes Euclidean RGB distance between Gemini's recommended color palette and items stored in the user's local SQLite database.
- Displays matching clothes directly from your wardrobe with similarity percentages (e.g., *94% Palette Match*).

### 📊 5. Wardrobe Utilization Analytics
- **Closet Health Dashboard**: Track total garments, aggregate wear count, average wears per item, and neglected/underutilized items.
- **Wardrobe MVPs**: Highlights your most frequently worn champion piece.
- **Category Breakdown**: Horizontal progress bars showing wear distribution across Tops, Bottoms, Outerwear, Shoes, and Accessories.
- **Activity Log Feed**: Chronological timeline of all logged wear events.

---

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 58](https://expo.dev) / [React Native 0.88](https://reactnative.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org) (Strict Mode)
- **Database**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (`expo-sqlite`) in WAL mode
- **State & Preferences**: `@react-native-async-storage/async-storage`
- **AI / Multimodal Vision**: [Google GenAI SDK](https://github.com/google-gemini/generative-ai-js) (`@google/genai`) using **`gemini-3.8-flash`**
- **UI & Animation**: `expo-blur`, `expo-linear-gradient`, `react-native-safe-area-context`
- **Icons**: `lucide-react-native` & `react-native-svg`
- **Media**: `expo-image-picker` & `expo-file-system`

---

## 📁 Project Architecture

```
OutFit/
├── assets/                    # App icons, adaptive icons, and splash screens
├── src/
│   ├── components/
│   │   ├── glass/             # Glassmorphism design system
│   │   │   ├── AmbientBackground.tsx  # Radiant gradient ambient orbs
│   │   │   ├── GlassBadge.tsx         # Pill tags for wear count & categories
│   │   │   ├── GlassButton.tsx        # Tactile glassmorphic buttons
│   │   │   ├── GlassCard.tsx          # Frosted card container with blur & specular line
│   │   │   ├── GlassInput.tsx         # Frosted inputs with focus glow
│   │   │   └── GlassModal.tsx         # Frosted blur overlay dialogs
│   │   └── wardrobe/          # Closet UI modules
│   │       ├── ClothCard.tsx          # Clothing item card with quick wear logging
│   │       ├── AddClothModal.tsx      # Add garment with category & color swatches
│   │       ├── ClothDetailModal.tsx   # Specs, CPW calculator & wear history
│   │       └── LogWearModal.tsx       # Occasion, rating, and notes logging
│   ├── navigation/
│   │   └── BottomTabs.tsx     # Floating glass dock bottom navigation bar
│   ├── screens/
│   │   ├── WardrobeScreen.tsx # Digital closet with search, filter, and sorting
│   │   ├── AiStylistScreen.tsx# Gemini 3.8 Flash vision skin tone & palette analysis
│   │   ├── AnalyticsScreen.tsx# Wear frequency stats, category bars & MVP pieces
│   │   └── SettingsScreen.tsx # Gemini API key setup, database reset & specifications
│   ├── services/
│   │   ├── database/          # SQLite persistence layer
│   │   │   ├── db.ts                  # SQLite init, schema tables & WAL mode
│   │   │   ├── clothesRepository.ts   # CRUD operations, wear logging & stats
│   │   │   ├── seedData.ts            # Curated starter capsule wardrobe
│   │   │   └── types.ts               # Domain TypeScript interfaces
│   │   └── gemini/            # AI Stylist engine
│   │       ├── geminiService.ts       # Gemini 3.8 Flash multimodal vision & closet matcher
│   │       └── sampleProfiles.ts      # Demo test portraits across diverse tones
│   ├── theme/
│   │   ├── colors.ts          # Glass tokens, ambient lights & category accents
│   │   └── typography.ts      # Responsive typography scale
│   └── utils/
│       ├── colorUtils.ts      # Color conversions
│       └── dateUtils.ts       # CPW and recency helpers
├── App.tsx                    # Root container with AmbientBackground & navigation
├── app.json                   # Android package configuration & permissions
├── progress.md                # Chronological development steps log
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app installed on your physical mobile device, or an Android Studio emulator

### 1. Clone the Repository
```bash
git clone https://github.com/n0vemberain/OutFit.git
cd OutFit
```

### 2. Install Dependencies
```bash
npx expo install
```

### 3. Start the Development Server
```bash
npx expo start
```

### 4. Run on Your Target Platform
- **Android Device**: Open **Expo Go** and scan the QR code printed in your terminal.
- **Android Emulator**: Press <kbd>a</kbd> in the terminal (or run `npx expo start --android`).
- **Web Browser**: Press <kbd>w</kbd> in the terminal to view on `http://localhost:8081`.

---

## 🔑 Gemini API Configuration

OutFit works right out of the box! If no API key is provided, the app will automatically use its built-in realistic stylist simulation engine so you can explore all features offline.

To connect live with Google Gemini:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. You can either:
   - Enter your key directly inside the app under **Settings → Google Gemini API**.
   - Or set an environment variable:
     ```env
     EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
     ```

The app connects to **`gemini-3.8-flash`** for high-speed, cost-efficient multimodal portrait understanding.

---

## 📜 Development Log

A complete chronological record of all architectural decisions, dependency setups, and implementation steps is preserved in [progress.md](progress.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
