import React, { useState } from 'react';
import { ClothingItem, ClothingCategory, ClothingSeason } from '../../types';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

interface AddClothModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCloth: (item: Omit<ClothingItem, 'id' | 'createdAt' | 'wearCount'>) => void;
}

const PRESET_COLORS = [
  { name: 'Charcoal Grey', hex: '#334155' },
  { name: 'Obsidian Black', hex: '#0F172A' },
  { name: 'Crisp White', hex: '#F8FAFC' },
  { name: 'Deep Indigo', hex: '#1E3A8A' },
  { name: 'Camel Amber', hex: '#B45309' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Burgundy Wine', hex: '#881337' },
  { name: 'Warm Taupe', hex: '#78716C' },
  { name: 'Cognac Brown', hex: '#92400E' },
  { name: 'Slate Blue', hex: '#3B82F6' },
  { name: 'Dusty Rose', hex: '#EC4899' },
  { name: 'Sage Olive', hex: '#4D7C0F' },
];

const PRESET_IMAGES = [
  { label: 'Tee / Knit', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80' },
  { label: 'Blouse', url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Oxford Shirt', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80' },
  { label: 'Denim', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80' },
  { label: 'Overcoat', url: 'https://images.unsplash.com/photo-1539533018447-63fcce667883?auto=format&fit=crop&w=600&q=80' },
  { label: 'Leather Jacket', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' },
  { label: 'Boots', url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80' },
];

export const AddClothModal: React.FC<AddClothModalProps> = ({ isOpen, onClose, onAddCloth }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [colorName, setColorName] = useState('Charcoal Grey');
  const [hexCode, setHexCode] = useState('#334155');
  const [season, setSeason] = useState<ClothingSeason>('all');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState<string>('95');
  const [imageUri, setImageUri] = useState(PRESET_IMAGES[0].url);
  const [notes, setNotes] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUri(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCloth({
      name: name.trim(),
      category,
      colorName,
      hexCode,
      season,
      brand: brand.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
      imageUri: imageUri.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset fields
    setName('');
    setBrand('');
    setNotes('');
    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Garment to Closet"
      subtitle="Expand your digital wardrobe with garment details, purchase value, and palette color"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Selection Preview */}
        <div className="flex gap-4 items-center p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/15">
            {imageUri ? (
              <img src={imageUri} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            <div
              className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: hexCode }}
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Garment Photo</label>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {/* Quick Unsplash presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_IMAGES.slice(0, 4).map((p, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImageUri(p.url)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                    imageUri === p.url
                      ? 'bg-violet-500/30 border-violet-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Garment Name & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Garment Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cashmere Knit Sweater"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Brand / Designer
            </label>
            <input
              type="text"
              placeholder="e.g. Arket, COS, A.P.C."
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Category & Season */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="tops">Tops & Shirts</option>
              <option value="bottoms">Bottoms & Trousers</option>
              <option value="outerwear">Outerwear & Coats</option>
              <option value="shoes">Shoes & Footwear</option>
              <option value="accessories">Accessories</option>
              <option value="one_piece">Dresses & Suits</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Seasonality</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as ClothingSeason)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="all">All Seasons</option>
              <option value="winter">Winter</option>
              <option value="summer">Summer</option>
              <option value="spring">Spring</option>
              <option value="fall">Autumn / Fall</option>
            </select>
          </div>
        </div>

        {/* Price for Cost-Per-Wear Engine */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Purchase Price ($ USD)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="95"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Used to calculate your exact Cost-Per-Wear (CPW) return on investment.
          </p>
        </div>

        {/* Color Palette Swatches */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Color: <span className="text-violet-300">{colorName}</span> ({hexCode})
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={hexCode}
                onChange={(e) => {
                  setHexCode(e.target.value);
                  setColorName('Custom Color');
                }}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                title="Choose custom color"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {PRESET_COLORS.map((c) => (
              <button
                type="button"
                key={c.name}
                onClick={() => {
                  setColorName(c.name);
                  setHexCode(c.hex);
                }}
                className={`w-7 h-7 rounded-full transition-transform border ${
                  hexCode.toLowerCase() === c.hex.toLowerCase()
                    ? 'scale-125 border-white ring-2 ring-violet-500 shadow-md'
                    : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.name} (${c.hex})`}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Fabric & Styling Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. 100% cashmere, dry clean only, best paired with indigo jeans."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <GlassButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton type="submit" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
            Save Garment
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
