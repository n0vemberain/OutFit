import React, { useState, useMemo } from 'react';
import { ClothingItem, ClothingCategory, ClothingSeason } from '../../types';
import { ClothCard } from './ClothCard';
import { GlassButton } from '../glass/GlassButton';
import { Search, Plus, Shirt, TrendingUp, RotateCcw } from 'lucide-react';
import { formatCurrency, calculateCostPerWear } from '../../utils/formatUtils';

interface WardrobeViewProps {
  clothes: ClothingItem[];
  onAddClothClick: () => void;
  onSelectCloth: (cloth: ClothingItem) => void;
  onQuickLogWear: (cloth: ClothingItem) => void;
  onResetSeedData: () => void;
}

type SortOption = 'wear_desc' | 'wear_asc' | 'cpw_asc' | 'price_desc' | 'date_desc';

const CATEGORIES: { id: ClothingCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Pieces' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
];

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  clothes,
  onAddClothClick,
  onSelectCloth,
  onQuickLogWear,
  onResetSeedData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [selectedSeason, setSelectedSeason] = useState<ClothingSeason | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('wear_desc');

  // Filter and sort clothes
  const filteredClothes = useMemo(() => {
    return clothes
      .filter((item) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchBrand = item.brand?.toLowerCase().includes(q);
          const matchColor = item.colorName.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchColor && !matchNotes) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Season filter
        if (selectedSeason !== 'all' && item.season !== selectedSeason && item.season !== 'all') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'wear_desc') return b.wearCount - a.wearCount;
        if (sortBy === 'wear_asc') return a.wearCount - b.wearCount;
        if (sortBy === 'cpw_asc') {
          const cpwA = calculateCostPerWear(a.price, a.wearCount);
          const cpwB = calculateCostPerWear(b.price, b.wearCount);
          return cpwA - cpwB;
        }
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'date_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [clothes, searchQuery, selectedCategory, selectedSeason, sortBy]);

  // Quick stats summary
  const totalWears = clothes.reduce((sum, c) => sum + (c.wearCount || 0), 0);
  const totalValue = clothes.reduce((sum, c) => sum + (c.price || 0), 0);
  const avgCpw = totalWears > 0 ? (totalValue / totalWears).toFixed(2) : '0.00';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Hero & Metrics Ribbon */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Editorial Title Box */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#8B5CF6]" />
              <span className="text-xs uppercase font-bold tracking-widest text-violet-300">
                Curated Digital Closet
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              Capsule Wardrobe
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-md leading-relaxed">
              Track wear frequencies, analyze investment return with Cost-Per-Wear (CPW), and pair with AI skin tone color analysis.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3 relative z-10">
            <GlassButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onAddClothClick}
            >
              Add New Garment
            </GlassButton>

            {clothes.length === 0 && (
              <GlassButton
                variant="secondary"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={onResetSeedData}
              >
                Load Starter Capsule
              </GlassButton>
            )}
          </div>

          {/* Ambient Corner Flare */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        </div>

        {/* Metric 1: Total Pieces & Wears */}
        <div className="p-5 rounded-3xl glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Closet Volume</span>
            <Shirt className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-white tracking-tight">
              {clothes.length} <span className="text-sm font-sans font-normal text-slate-400">pieces</span>
            </div>
            <p className="text-xs text-cyan-300/90 font-medium mt-1">
              Logged across {totalWears} total outfit wears
            </p>
          </div>
        </div>

        {/* Metric 2: Average CPW & Value */}
        <div className="p-5 rounded-3xl glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Average CPW</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-emerald-300 tracking-tight">
              ${avgCpw} <span className="text-sm font-sans font-normal text-slate-400">/ wear</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Total wardrobe value: {formatCurrency(totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl glass-panel space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments by name, brand, color, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Season & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Season Selector */}
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value as ClothingSeason | 'all')}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Seasons</option>
              <option value="winter">Winter</option>
              <option value="summer">Summer</option>
              <option value="spring">Spring</option>
              <option value="fall">Fall / Autumn</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-violet-500"
            >
              <option value="wear_desc">Most Worn</option>
              <option value="wear_asc">Least Worn</option>
              <option value="cpw_asc">Lowest CPW (Best ROI)</option>
              <option value="price_desc">Highest Price</option>
              <option value="date_desc">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? clothes.length
                : clothes.filter((c) => c.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/40 font-semibold'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5 hover:bg-white/10'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Garments Grid */}
      {filteredClothes.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center space-y-3">
          <Shirt className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-serif">No garments found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'all' || selectedSeason !== 'all'
              ? 'Try adjusting your search criteria or clearing filters to see more clothes.'
              : 'Your capsule wardrobe is currently empty. Add your first piece or seed the luxury capsule!'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {(searchQuery || selectedCategory !== 'all' || selectedSeason !== 'all') && (
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSeason('all');
                }}
              >
                Clear Filters
              </GlassButton>
            )}
            <GlassButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onAddClothClick}
            >
              Add Garment
            </GlassButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredClothes.map((cloth) => (
            <ClothCard
              key={cloth.id}
              cloth={cloth}
              onClick={() => onSelectCloth(cloth)}
              onQuickWear={(e) => {
                e.stopPropagation();
                onQuickLogWear(cloth);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
