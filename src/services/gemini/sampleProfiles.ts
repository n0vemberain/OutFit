import { SkinToneAnalysis } from '../database/types';

export interface SampleProfile {
  id: string;
  name: string;
  tagline: string;
  avatarColor: string;
  imageUri: string;
  analysis: Omit<SkinToneAnalysis, 'id' | 'analyzedAt'>;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'sample_warm_autumn',
    name: 'Warm Golden Tan',
    tagline: 'Warm undertone • Deep Autumn palette',
    avatarColor: '#D97706',
    imageUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    analysis: {
      skinTone: 'Warm Golden Tan',
      undertone: 'Warm',
      contrastLevel: 'Medium',
      paletteName: 'Deep Autumn',
      paletteDescription: 'Characterized by rich, warm, and deeply saturated earth tones that harmonize with golden and honey undertones.',
      recommendedColors: [
        {
          name: 'Terracotta Rust',
          hex: '#C2410C',
          category: 'primary',
          description: 'A fiery, grounded earth red that brings warmth to your complexion.',
          styleTip: 'Magnificent for knitwear, jackets, or statement trousers.',
        },
        {
          name: 'Forest Moss Green',
          hex: '#15803D',
          category: 'primary',
          description: 'Deep woodland green with warm amber undertones.',
          styleTip: 'Pairs seamlessly with camel coats and dark denim.',
        },
        {
          name: 'Camel Gold',
          hex: '#B45309',
          category: 'neutral',
          description: 'Warm golden tan neutral that complements your skin depth.',
          styleTip: 'Ideal for overcoats, blazers, and leather goods.',
        },
        {
          name: 'Deep Mustard Yellow',
          hex: '#CA8A04',
          category: 'accent',
          description: 'Rich, spicy yellow that highlights natural golden glow.',
          styleTip: 'Great for silk shirts, scarves, or casual knitwear.',
        },
        {
          name: 'Warm Espresso',
          hex: '#3F2C24',
          category: 'neutral',
          description: 'Rich dark chocolate brown serving as your anchor neutral.',
          styleTip: 'Substitutes harsh jet black for a softer, elevated luxury look.',
        },
      ],
      avoidColors: [
        {
          name: 'Icy Pastel Blue',
          hex: '#BFDBFE',
          reason: 'Cool, chalky pastels can wash out warm golden undertones and look dull.',
        },
        {
          name: 'Neon Magenta',
          hex: '#F43F5E',
          reason: 'Overpowers your subtle warmth and creates visual disharmony.',
        },
        {
          name: 'Harsh Stark White',
          hex: '#FFFFFF',
          reason: 'Pure blue-white creates severe contrast; opt for warm cream or ivory instead.',
        },
      ],
      wardrobeAdvice: 'Build your capsule wardrobe around warm earth neutrals: camel, rich olive, and deep espresso. Complement with rich jewel-toned accessories in bronze or warm gold hardware.',
    },
  },
  {
    id: 'sample_cool_summer',
    name: 'Porcelain Rose',
    tagline: 'Cool undertone • Cool Summer palette',
    avatarColor: '#F472B6',
    imageUri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    analysis: {
      skinTone: 'Porcelain Rose Fair',
      undertone: 'Cool',
      contrastLevel: 'High',
      paletteName: 'Cool Summer',
      paletteDescription: 'Delicate, muted, and cool tones with blue and grey undertones that complement fair, rose-tinted skin without overpowering it.',
      recommendedColors: [
        {
          name: 'Slate French Blue',
          hex: '#3B82F6',
          category: 'primary',
          description: 'Cool, classic blue that illuminates pink/blue undertones.',
          styleTip: 'Perfection for Oxford shirts, coats, and linen pieces.',
        },
        {
          name: 'Soft Dusty Rose',
          hex: '#EC4899',
          category: 'accent',
          description: 'Subtle, sophisticated cool pink with smoky undertones.',
          styleTip: 'Works as an accent in knitwear or lightweight blouses.',
        },
        {
          name: 'Charcoal Heather',
          hex: '#475569',
          category: 'neutral',
          description: 'Sophisticated cool neutral that frames fair features crisply.',
          styleTip: 'Essential for tailored trousers and structured blazers.',
        },
        {
          name: 'Cool Lavender',
          hex: '#A855F7',
          category: 'accent',
          description: 'Soft floral violet that reflects luminous coolness.',
          styleTip: 'Subtle pop for tees, ties, or light sweaters.',
        },
        {
          name: 'Crisp Cloud White',
          hex: '#F8FAFC',
          category: 'neutral',
          description: 'Fresh clean white that highlights cool clarity.',
          styleTip: 'Flawless for crisp cotton shirts and low-top sneakers.',
        },
      ],
      avoidColors: [
        {
          name: 'Warm Mustard Yellow',
          hex: '#D97706',
          reason: 'Warm yellow makes cool undertones appear sallow or jaundiced.',
        },
        {
          name: 'Rust Orange',
          hex: '#EA580C',
          reason: 'Severe warmth clashes with pink or cool porcelain tones.',
        },
        {
          name: 'Olive Drab Green',
          hex: '#65A30D',
          reason: 'Earthy yellow-greens fight against your natural cool radiance.',
        },
      ],
      wardrobeAdvice: 'Anchor your wardrobe with slate grey, royal navy, and cool powder blues. Pair with silver or white gold jewelry to echo your cool undertone.',
    },
  },
  {
    id: 'sample_deep_winter',
    name: 'Deep Rich Espresso',
    tagline: 'Neutral-Cool undertone • Deep Winter palette',
    avatarColor: '#451A03',
    imageUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    analysis: {
      skinTone: 'Deep Rich Espresso',
      undertone: 'Neutral',
      contrastLevel: 'High',
      paletteName: 'Deep Winter',
      paletteDescription: 'Vivid, saturated, and deeply contrasting colors that pop against rich, deep complexions with dramatic presence.',
      recommendedColors: [
        {
          name: 'Royal Cobalt Blue',
          hex: '#1D4ED8',
          category: 'primary',
          description: 'Electrifying, saturated jewel blue that creates brilliant visual contrast.',
          styleTip: 'Sensational for suits, overcoats, and luxury streetwear.',
        },
        {
          name: 'Emerald Jewel',
          hex: '#059669',
          category: 'primary',
          description: 'Deep, radiant emerald that glows against deep melanin.',
          styleTip: 'Pairs beautifully with dark obsidian trousers.',
        },
        {
          name: 'Crimson Ruby',
          hex: '#BE123C',
          category: 'accent',
          description: 'Powerful cool red with immense depth and elegance.',
          styleTip: 'Bold statement for evening wear or knitwear.',
        },
        {
          name: 'Pure Onyx Black',
          hex: '#09090B',
          category: 'neutral',
          description: 'True jet black that forms a seamless, sleek canvas.',
          styleTip: 'Monochrome black looks tailored and ultra-modern on you.',
        },
        {
          name: 'Stark Brilliant White',
          hex: '#FFFFFF',
          category: 'neutral',
          description: 'High-contrast optical white that delivers maximum crispness.',
          styleTip: 'Highest contrast pairing against your deep skin tone.',
        },
      ],
      avoidColors: [
        {
          name: 'Muted Muddy Beige',
          hex: '#A8A29E',
          reason: 'Faded, chalky beiges disappear or look muddy against rich deep tones.',
        },
        {
          name: 'Pastel Peach',
          hex: '#FED7AA',
          reason: 'Lacks the visual contrast required to balance your features.',
        },
      ],
      wardrobeAdvice: 'Embrace high contrast and jewel tones! Deep espresso skin carries saturated royal blues, emeralds, and ruby reds with regal confidence.',
    },
  },
  {
    id: 'sample_olive_autumn',
    name: 'Warm Olive Neutral',
    tagline: 'Olive undertone • Soft Autumn palette',
    avatarColor: '#65A30D',
    imageUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    analysis: {
      skinTone: 'Warm Olive Medium',
      undertone: 'Olive',
      contrastLevel: 'Medium',
      paletteName: 'Soft Autumn',
      paletteDescription: 'Subtly muted, warm and neutral tones that harmonize with the unique green/golden balance of olive complexions.',
      recommendedColors: [
        {
          name: 'Sage Olive Green',
          hex: '#4D7C0F',
          category: 'primary',
          description: 'Muted olive that harmonizes directly with natural olive undertones.',
          styleTip: 'Flawless for field jackets, overshirts, and chinos.',
        },
        {
          name: 'Warm Amber Honey',
          hex: '#D97706',
          category: 'accent',
          description: 'Golden warmth that awakens skin without creating yellowness.',
          styleTip: 'Great for accessories, knit sweaters, and scarves.',
        },
        {
          name: 'Deep Teal',
          hex: '#0F766E',
          category: 'primary',
          description: 'Balances both green and blue spectrums for a flattering jewel look.',
          styleTip: 'Modern alternative to navy.',
        },
        {
          name: 'Smoky Charcoal',
          hex: '#334155',
          category: 'neutral',
          description: 'Softened dark neutral that is less stark than jet black.',
          styleTip: 'Go-to everyday neutral.',
        },
      ],
      avoidColors: [
        {
          name: 'Neon Lime',
          hex: '#84CC16',
          reason: 'Highlights excess green cast in olive skin.',
        },
        {
          name: 'Bubblegum Pink',
          hex: '#F472B6',
          reason: 'Clashes with olive undertones.',
        },
      ],
      wardrobeAdvice: 'Lean into complex, hybrid tones like deep teal, rich sage, and warm amber. Gold, brass, and antique silver hardware all flatter olive skin nicely.',
    },
  },
];
