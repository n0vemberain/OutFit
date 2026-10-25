# OutFit - Smart Wardrobe & AI Color Stylist

<div align="center">

![OutFit Banner](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80)

**A luxury cross-platform suite featuring a native mobile app (React Native / Expo SDK 58) and a full-featured modern web application (React 19 / Vite / Tailwind CSS), local-first wear tracking, Cost-Per-Wear (CPW) ROI analytics, and multimodal AI skin tone analysis powered by Google Gemini 3.8 Flash.**

[![React Native](https://img.shields.io/badge/React_Native-0.88.0-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![React](https://img.shields.io/badge/React_Web-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Expo](https://img.shields.io/badge/Expo_SDK-58.0.0-000020?logo=expo&logoColor=white)](https://expo.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Gemini API](https://img.shields.io/badge/Gemini_API-gemini--3.8--flash-8B5CF6?logo=google&logoColor=white)](https://ai.google.dev)
[![Deployment](https://img.shields.io/badge/Deployment-GitHub_Pages-22c55e?logo=githubpages&logoColor=white)](https://n0vemberain.github.io/OutFit/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<br/>

### Live Web Application: [https://n0vemberain.github.io/OutFit/](https://n0vemberain.github.io/OutFit/)

</div>

---

## Live Deployment & Repository Links

- **Live Web Application**: [https://n0vemberain.github.io/OutFit/](https://n0vemberain.github.io/OutFit/)
- **GitHub Repository**: [https://github.com/n0vemberain/OutFit](https://github.com/n0vemberain/OutFit)

---

## Available Editions

| Platform | Tech Stack | Key Capabilities | Entry Point |
|---|---|---|---|
| **Web Edition** | React 19, Vite, Tailwind CSS v4, `@google/genai` | Live browser webcam selfie capture, interactive color matcher, local-first reactive storage, confetti celebrations | [`web/`](web/) |
| **Mobile App** | React Native 0.88, Expo SDK 58, `expo-sqlite` (WAL), `expo-blur` | Android hardware-accelerated frosted glass, native camera capture, SQLite relational schema | Root (`App.tsx`) |

---

## Features Overview

### 1. Luxury Glassmorphism Design System
- **Frosted Translucent Cards**: Uses CSS `backdrop-filter: blur(16px)` on the web and `expo-blur` (`BlurView`) on mobile to render layered, frosted translucent surfaces.
- **Ambient Light Refraction**: Engineered radiant gradient glow orbs (Electric Violet, Neon Cyan, Rose Glow, Warm Amber) that subtly illuminate through cards while scrolling.
- **Specular Sheens & Tactile Feedback**: Micro-interactions with specular linear highlight borders, glowing badges, elevation drop shadows, and ripple effects.
- **Floating Glass Dock Navigation**: Frosted pill navigation dock anchoring screens with seamless active tab transitions.

### 2. Local-First Database & Wear Frequency Tracking
- **Zero-Latency Offline Architecture**: Powered by reactive `localStorage` on the web and `expo-sqlite` in WAL mode on mobile.
- **Wear Frequency Tracker**: Track wear counts, last-worn dates, and log wear occasions (Work, Date Night, Casual, Events) with 1 to 5 star ratings and pairing notes.
- **Cost-Per-Wear (CPW) Engine**: Calculates exact investment metrics per garment (`Purchase Price / Wear Count = Cost per Wear`) with capsule utilization ratings.
- **Starter Capsule Wardrobe**: Auto-seeds 11 curated capsule items on initial launch (Merino Wool Knit, Raw Selvedge Denim, Camel Wool Coat, Veja Sneakers, Silk Blouse, etc.).

### 3. Gemini 3.8 Flash Vision AI Color Stylist
- **Multimodal Portrait Vision**: Captures a live webcam selfie directly in the browser or selects an existing photo from your gallery.
- **Scientific Undertone Detection**: Evaluates skin tone depth, undertones (*Warm*, *Cool*, *Neutral*, *Olive*), and facial contrast level (*High*, *Medium*, *Low*).
- **Seasonal Color Palette**: Recommends personalized color palettes (*Deep Autumn*, *Cool Summer*, *Bright Winter*, *Soft Spring*) with color names, hex swatches, and styling rationale.
- **Colors to Avoid**: Flags clashing shades that wash out or overwhelm natural skin undertones.
- **Instant Demo Profiles**: Includes 4 diverse model profiles (Golden Tan, Porcelain Rose, Deep Espresso, Olive Neutral) to test without needing a camera.

### 4. Closet Color Palette Matching
- Computes Euclidean RGB distance between Gemini's recommended color palette and items stored in the user's digital wardrobe.
- Displays matching clothes directly from your wardrobe with similarity percentages (e.g., *96% Palette Match*).
- One-click "Wear Piece" action to log wear for the recommended outfit item.

### 5. Wardrobe Utilization & CPW Analytics
- **Closet Health Dashboard**: Track total garments, aggregate wear count, average wears per item, total investment value, and neglected or underutilized items.
- **Wardrobe Champion (MVP)**: Highlights your most frequently worn champion piece.
- **Category Breakdown**: Horizontal animated progress bars showing wear distribution across Tops, Bottoms, Outerwear, Shoes, and Accessories.
- **Activity Log Feed**: Chronological timeline of all logged wear events.

---

## Project Architecture

```
OutFit/
├── assets/                    # Mobile app icons, adaptive icons, and splash screens
├── src/                       # React Native Mobile App Source
│   ├── components/
│   │   ├── glass/             # Mobile glassmorphism components
│   │   └── wardrobe/          # Mobile closet UI modules
│   ├── navigation/            # Mobile bottom tabs
│   ├── screens/               # Mobile screens (Wardrobe, AiStylist, Analytics, Settings)
│   ├── services/
│   │   ├── database/          # SQLite persistence layer (WAL mode)
│   │   └── gemini/            # Gemini 3.8 Flash mobile service
│   └── utils/                 # Mobile format & color utilities
├── web/                       # Modern Web Application (React 19 + Vite + Tailwind)
│   ├── public/                # Static assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── glass/         # Web glassmorphism (AmbientBackground, GlassCard, etc.)
│   │   │   ├── navigation/    # Web header navbar & mobile dock
│   │   │   ├── wardrobe/      # Web wardrobe view, cards & modals
│   │   │   ├── stylist/       # Web AI stylist view with live webcam
│   │   │   ├── analytics/     # Web CPW analytics & activity feed
│   │   │   └── settings/      # Web API key setup & JSON import/export
│   │   ├── services/          # Web storage & Gemini Web service
│   │   ├── types/             # Domain TypeScript interfaces
│   │   └── utils/             # Format & color utilities
│   ├── index.html             # Web entry HTML
│   ├── package.json           # Web dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── README.md              # Dedicated Web documentation
├── App.tsx                    # Root mobile entry point
├── app.json                   # Expo mobile configuration
├── progress.md                # Chronological development steps log
└── package.json               # Root scripts & dependencies
```

---

## Getting Started

### Option A: Running the Web Application (Recommended for Web)

```bash
# 1. Install web dependencies
cd web
npm install

# 2. Run local development server
npm run dev
# The website will be available at http://localhost:5173

# Or build and test production bundle
npm run build
npm run preview
```

Tip: From the root directory, you can also run `npm run web:dev` or `npm run web:build`.

---

### Option B: Running the Mobile Application (Expo / React Native)

```bash
# 1. Install mobile dependencies
npx expo install

# 2. Start the Expo development server
npx expo start

# 3. Open on your device or emulator:
# - Press 'a' to open on Android Emulator
# - Scan the terminal QR code with Expo Go on your physical Android or iOS phone
```

---

## Gemini API Configuration

OutFit works right out of the box. If no API key is entered, both the Web and Mobile editions will automatically use built-in high-fidelity stylist simulation profiles so you can explore all features immediately.

To connect live with Google Gemini:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. In the Web app: Go to **Settings -> Google Gemini API Key**, paste your key, and click **Test Connection**.
3. In the Mobile app: Enter your key in **Settings**, or set `EXPO_PUBLIC_GEMINI_API_KEY` in `.env.local`.

Both editions utilize **`gemini-3.8-flash`** for high-speed, cost-efficient multimodal portrait understanding.

---

## Development Log

A complete chronological record of all architectural decisions, dependency setups, and implementation steps is preserved in [progress.md](progress.md).

---

## License

This project is licensed under the [MIT License](LICENSE).
