import React from 'react';
import { ClothingItem } from '../../types';
import { GlassCard } from '../glass/GlassCard';
import { GlassBadge } from '../glass/GlassBadge';
import { calculateCostPerWear, formatRelativeDate, getCategoryLabel } from '../../utils/formatUtils';
import { Check } from 'lucide-react';

interface ClothCardProps {
  cloth: ClothingItem;
  onClick: () => void;
  onQuickWear: (e: React.MouseEvent) => void;
}

export const ClothCard: React.FC<ClothCardProps> = ({ cloth, onClick, onQuickWear }) => {
  const cpw = calculateCostPerWear(cloth.price, cloth.wearCount);

  return (
    <GlassCard
      interactive
      onClick={onClick}
      className="group flex flex-col justify-between h-full border-white/8 hover:border-violet-500/30 transition-all duration-300"
    >
      {/* Top Media Container */}
      <div className="relative aspect-4/5 w-full bg-slate-900 overflow-hidden">
        {cloth.imageUri ? (
          <img
            src={cloth.imageUri}
            alt={cloth.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 font-serif text-4xl">
            {cloth.name[0]}
          </div>
        )}

        {/* Specular Edge Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <GlassBadge variant="slate" size="sm">
            {getCategoryLabel(cloth.category)}
          </GlassBadge>
        </div>

        {/* Wear Count Pill */}
        <div className="absolute top-2.5 right-2.5">
          <GlassBadge variant={cloth.wearCount > 20 ? 'emerald' : 'cyan'} size="sm" dot>
            {cloth.wearCount} wears
          </GlassBadge>
        </div>

        {/* Quick Wear Floating Button */}
        <button
          type="button"
          onClick={onQuickWear}
          title="Quick log wear for today"
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-violet-600/90 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-900/50 border border-violet-400/40 backdrop-blur-md opacity-90 group-hover:opacity-100 group-hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
        >
          <Check className="w-4 h-4" />
        </button>

        {/* Color Dot & Name */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-white">
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
            style={{ backgroundColor: cloth.hexCode }}
          />
          <span className="truncate max-w-[100px]">{cloth.colorName}</span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          {cloth.brand && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-400/90 truncate mb-0.5">
              {cloth.brand}
            </p>
          )}
          <h4 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-violet-200 transition-colors">
            {cloth.name}
          </h4>
        </div>

        {/* Metrics Row */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Cost / Wear</span>
            <span className="font-mono font-bold text-emerald-400">
              {cloth.price ? `$${cpw}` : '—'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Last Worn</span>
            <span className="text-slate-300 font-medium">
              {formatRelativeDate(cloth.lastWornDate)}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
