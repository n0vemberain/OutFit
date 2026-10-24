import { ClothingCategory, ClothingSeason } from '../types';

export function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return `$${amount.toFixed(2)}`;
}

export function calculateCostPerWear(price?: number, wearCount?: number): number {
  if (!price || price <= 0) return 0;
  const wears = Math.max(1, wearCount || 0);
  return Number((price / wears).toFixed(2));
}

export function formatRelativeDate(dateStr?: string): string {
  if (!dateStr) return 'Never worn';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return dateStr;
  }
}

export function getCategoryLabel(category: ClothingCategory): string {
  switch (category) {
    case 'tops':
      return 'Tops & Shirts';
    case 'bottoms':
      return 'Bottoms & Trousers';
    case 'outerwear':
      return 'Outerwear & Coats';
    case 'shoes':
      return 'Shoes & Footwear';
    case 'accessories':
      return 'Accessories';
    case 'one_piece':
      return 'Dresses & Suits';
    default:
      return category;
  }
}

export function getCategoryBadgeColor(category: ClothingCategory): { bg: string; text: string; border: string } {
  switch (category) {
    case 'tops':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/20' };
    case 'bottoms':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/20' };
    case 'outerwear':
      return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20' };
    case 'shoes':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/20' };
    case 'accessories':
      return { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/20' };
    case 'one_piece':
      return { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/20' };
  }
}

export function getSeasonLabel(season: ClothingSeason): string {
  switch (season) {
    case 'all':
      return 'All Seasons';
    case 'spring':
      return 'Spring';
    case 'summer':
      return 'Summer';
    case 'fall':
      return 'Autumn / Fall';
    case 'winter':
      return 'Winter';
  }
}
