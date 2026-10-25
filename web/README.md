# OutFit Web Edition - Smart Wardrobe & AI Color Stylist

<div align="center">

![OutFit Web Banner](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80)

**A luxury high-fashion web application built with React 19, Vite, Tailwind CSS, local-first reactive storage, and multimodal AI skin tone analysis powered by Google Gemini 3.8 Flash.**

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini API](https://img.shields.io/badge/Gemini_API-gemini--3.8--flash-8B5CF6?logo=google&logoColor=white)](https://ai.google.dev)
[![Deployment](https://img.shields.io/badge/Deployment-GitHub_Pages-22c55e?logo=githubpages&logoColor=white)](https://n0vemberain.github.io/OutFit/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<br/>

### Live Web Application: [https://n0vemberain.github.io/OutFit/](https://n0vemberain.github.io/OutFit/)

</div>

---

## Live Deployment

- **Live URL**: [https://n0vemberain.github.io/OutFit/](https://n0vemberain.github.io/OutFit/)
- **Repository**: [https://github.com/n0vemberain/OutFit](https://github.com/n0vemberain/OutFit)

---

## Features Overview

### 1. Luxury Obsidian Glassmorphism Design
- **Frosted Translucent Surfaces**: High-performance CSS `backdrop-filter: blur(16px)` layered containers with subtle specular borders and inner linear highlights.
- **Ambient Radiant Glow Orbs**: Multi-layer animated radial orbs (Electric Violet, Neon Cyan, Rose Glow, Warm Amber) shifting continuously behind cards.
- **Responsive Floating Dock & Desktop Navbar**: Adapts seamlessly from a spacious desktop header with live item counts to a floating bottom glass dock on mobile devices.

### 2. Digital Capsule Wardrobe & Wear Frequency Tracking
- **Local-First Storage**: Zero-latency offline data persistence via reactive `localStorage`.
- **Pre-Seeded Luxury Capsule**: Automatically initialized with 11 curated capsule items (Arket Merino Knit, Reformation Silk Blouse, Uniqlo U Oxford, A.P.C. Raw Denim, COS Linen Trousers, Mango Camel Coat, AllSaints Leather Biker, Veja Sneakers, etc.).
- **Cost-Per-Wear (CPW) Engine**: Real-time investment return calculation (`Purchase Price / Wear Count = CPW`), tracking garment ROI with utilization status ratings.
- **Wear Logging with Celebration**: Log occasions (Work, Casual, Date Night, Dinner Party, Formal), 1 to 5 star ratings, styling notes, and celebrate wears with celebratory confetti.
- **Dynamic Filtering & Sorting**: Real-time keyword search, category pills (Tops, Bottoms, Outerwear, Shoes, Accessories), seasonality selector, and multiple sorting options (Most Worn, Lowest CPW, Highest Price, Recently Added).

### 3. Gemini 3.8 Flash Multimodal AI Color Stylist
- **Live Webcam Capture**: Real-time interactive camera preview with flip/mirror, 3-second countdown timer, and snapshot capture directly from your browser.
- **Photo Upload**: Supports image upload (PNG, JPEG, WEBP) from your device.
- **Instant Demo Profiles**: Includes 4 diverse model profiles (Golden Tan, Porcelain Rose, Deep Espresso, Olive Neutral) to test analysis instantly without camera hardware or API keys.
- **Scientific Undertone Detection**: Identifies skin tone depth, undertones (*Warm*, *Cool*, *Neutral*, *Olive*), and facial contrast level (*High*, *Medium*, *Low*).
- **Seasonal Color Palette**: Delivers tailored seasonal color classifications (*Deep Autumn*, *Cool Summer*, *Bright Winter*, *Soft Spring*) with color names, hex swatches, categories, and styling advice.
- **Colors to Avoid**: Flags clashing shades that wash out or overwhelm natural skin undertones with clear reasons.

### 4. Euclidean RGB Closet Matching Engine
- Computes mathematical Euclidean distance in 3D RGB color space between Gemini's recommended palette and every item in the user's wardrobe.
- Ranks matching garments with similarity percentages (e.g., *96% Palette Match*).
- One-click "Wear Piece" button to immediately log wear for recommended matches.

### 5. Wardrobe Utilization & ROI Analytics
- **Capsule Health Score**: Computes wardrobe utilization rate based on 60-day wear rotations.
- **Financial & Wear Metrics**: Displays total garments, total wears, average wears per garment, total investment value, and average CPW across the whole closet.
- **Wardrobe Champion (MVP)**: Highlights the most worn MVP garment.
- **Neglected Pieces**: Detects dormant items (0 wears or > 60 days idle) with a quick "Wear Today" revival action.
- **Category Wear Distribution**: Animated gradient progress bars illustrating wear proportions across Tops, Bottoms, Outerwear, Shoes, and Accessories.
- **Activity Log Feed**: Chronological timeline of all logged wear events with occasions, dates, and star ratings.

### 6. Settings, Backup & API Configuration
- **Gemini API Key Management**: Store user API keys locally with visibility toggle and a "Test Connection" verification ping.
- **Model Selector**: Switch between `gemini-3.8-flash`, `gemini-2.5-flash`, and `gemini-2.0-flash`.
- **JSON Export & Import**: Backup your complete wardrobe, wear history, and stylist analysis to a portable JSON file.
- **Reset to Seed**: Restore the pristine 11-piece capsule wardrobe at any time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev) + [Vite 6](https://vite.dev) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + `@tailwindcss/vite` |
| **Icons** | [Lucide React](https://lucide.dev) |
| **AI / Multimodal Vision** | [Google GenAI SDK](https://github.com/google-gemini/generative-ai-js) (`@google/genai`) using **`gemini-3.8-flash`** |
| **Celebrations** | `canvas-confetti` |
| **Persistence** | Local-First Reactive Browser `localStorage` |

---

## Directory Structure

```
web/
├── index.html                     # HTML5 entry with Plus Jakarta Sans & Playfair Display
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # Strict TypeScript configuration
├── vite.config.ts                 # Vite + React + Tailwind v4 plugin setup
└── src/
    ├── main.tsx                   # Application DOM mounting
    ├── App.tsx                    # Root container wiring state, modals & views
    ├── index.css                  # Tailwind imports, glassmorphism utilities & keyframes
    ├── types/
    │   └── index.ts               # Domain TypeScript interfaces
    ├── services/
    │   ├── storage/
    │   │   ├── seedData.ts        # Starter 11-piece luxury capsule wardrobe
    │   │   └── wardrobeStorage.ts # Local-first CRUD, wear logging, CPW & metrics
    │   └── gemini/
    │       ├── geminiWebService.ts # Gemini 3.8 Flash multimodal vision & color matcher
    │       └── sampleProfiles.ts   # Diverse test model profiles for instant demo
    ├── components/
    │   ├── glass/
    │   │   ├── AmbientBackground.tsx # Multi-orb moving radiant glow orbs
    │   │   ├── GlassCard.tsx         # Frosted container with specular edge highlight
    │   │   ├── GlassButton.tsx       # Tactile glowing buttons with variants
    │   │   ├── GlassBadge.tsx        # Pill tags with glowing status dots
    │   │   └── GlassModal.tsx        # Accessible dialog overlay with blur backdrop
    │   ├── navigation/
    │   │   └── Navbar.tsx            # Header navigation & mobile floating dock
    │   ├── wardrobe/
    │   │   ├── WardrobeView.tsx      # Digital closet with search, filters & sort
    │   │   ├── ClothCard.tsx         # Garment card with CPW & quick wear action
    │   │   ├── AddClothModal.tsx     # Add garment with upload & Unsplash presets
    │   │   ├── ClothDetailModal.tsx  # Garment specs, ROI progress & wear history
    │   │   └── LogWearModal.tsx      # Occasion logger with confetti burst
    │   ├── stylist/
    │   │   └── AiStylistView.tsx     # Webcam selfie capture & Gemini vision analysis
    │   ├── analytics/
    │   │   └── AnalyticsView.tsx     # CPW analytics, champion MVP & activity feed
    │   └── settings/
    │       └── SettingsView.tsx      # Gemini API key setup & JSON data backup
    └── utils/
        └── formatUtils.ts            # Currency, CPW, relative dates & category styling
```

---

## Getting Started

### 1. Installation
Navigate into the `web` directory and install dependencies:

```bash
cd web
npm install
```

### 2. Development Server
Start the local Vite dev server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
Typecheck and compile optimized static assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Gemini API Setup (Optional)

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. In the web app, click **Settings** from the navigation bar.
3. Paste your API key into the **Google Gemini API Key** input.
4. Click **Test Connection** to verify connectivity with `gemini-3.8-flash`.
5. Click **Save Settings**.

Note: Even without an API key, the app includes high-fidelity simulation profiles so you can explore the full user experience immediately.
