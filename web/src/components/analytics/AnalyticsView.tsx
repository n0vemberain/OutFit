import React from 'react';
import { ClothingItem, WearStatistics } from '../../types';
import { GlassBadge } from '../glass/GlassBadge';
import { GlassButton } from '../glass/GlassButton';
import {
  formatCurrency,
  calculateCostPerWear,
  getCategoryLabel,
  formatRelativeDate,
} from '../../utils/formatUtils';
import {
  Trophy,
  AlertCircle,
  Star,
  CheckCircle,
} from 'lucide-react';

interface AnalyticsViewProps {
  stats: WearStatistics;
  onSelectCloth: (cloth: ClothingItem) => void;
  onQuickLogWear: (cloth: ClothingItem) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  stats,
  onSelectCloth,
  onQuickLogWear,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Editorial Title Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
              Wardrobe Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white font-serif tracking-tight">
            Utilization & CPW Analytics
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            Measure your wardrobe return-on-investment, identify neglected pieces before they become clutter, and celebrate your champion capsule garments.
          </p>
        </div>

        {/* Health Score Pill */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 shrink-0">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400/40 flex items-center justify-center font-mono text-xl font-bold text-emerald-300 shadow-lg shadow-emerald-500/20">
            {stats.utilizationRate}%
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Capsule Health
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              {stats.utilizationRate >= 70
                ? 'Excellent rotation'
                : 'Some pieces need love'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Financial & Wear Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Garments</span>
          <div className="text-3xl font-bold font-mono text-white tracking-tight">
            {stats.totalItems}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active capsule wardrobe</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Wears</span>
          <div className="text-3xl font-bold font-mono text-cyan-300 tracking-tight">
            {stats.totalWears}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Avg {stats.averageWearPerItem} wears / piece
          </p>
        </div>

        <div className="p-5 rounded-3xl glass-panel">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Wardrobe Value</span>
          <div className="text-3xl font-bold font-mono text-amber-300 tracking-tight">
            {formatCurrency(stats.totalValue)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total garment investment</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Average CPW</span>
          <div className="text-3xl font-bold font-mono text-emerald-300 tracking-tight">
            ${stats.averageCostPerWear}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cost per outfit worn</p>
        </div>
      </div>

      {/* MVP Piece vs Neglected Pieces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wardrobe Champion / MVP */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 border-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Wardrobe MVP (Most Worn)</h3>
            </div>
            <GlassBadge variant="amber" dot>
              Champion
            </GlassBadge>
          </div>

          {stats.mostWornItem ? (
            <div
              onClick={() => onSelectCloth(stats.mostWornItem!)}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer flex items-center gap-4"
            >
              <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/15">
                {stats.mostWornItem.imageUri ? (
                  <img
                    src={stats.mostWornItem.imageUri}
                    alt={stats.mostWornItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-serif">
                    {stats.mostWornItem.name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-0.5">
                  {stats.mostWornItem.brand || 'Capsule Piece'}
                </span>
                <h4 className="text-base font-bold text-white truncate">
                  {stats.mostWornItem.name}
                </h4>
                <div className="mt-2 flex items-center gap-4 text-xs font-mono">
                  <span className="text-cyan-300 font-bold">
                    {stats.mostWornItem.wearCount} wears
                  </span>
                  <span className="text-emerald-300 font-bold">
                    ${calculateCostPerWear(stats.mostWornItem.price, stats.mostWornItem.wearCount)}/wear
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No wear data available yet.</p>
          )}
        </div>

        {/* Neglected / Underutilized Pieces */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 border-rose-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">Neglected Items</h3>
            </div>
            <GlassBadge variant="rose">
              {stats.neglectedItems.length} Dormant
            </GlassBadge>
          </div>

          {stats.neglectedItems.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/5 text-center text-xs text-emerald-300">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              All items in your capsule wardrobe are actively being rotated!
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
              {stats.neglectedItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectCloth(item)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                      {item.imageUri && (
                        <img
                          src={item.imageUri}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="truncate">
                      <h5 className="font-semibold text-white truncate">{item.name}</h5>
                      <span className="text-slate-400 text-[11px]">
                        Last worn: {formatRelativeDate(item.lastWornDate)}
                      </span>
                    </div>
                  </div>

                  <GlassButton
                    type="button"
                    variant="accent"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickLogWear(item);
                    }}
                  >
                    Wear Today
                  </GlassButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Wear Distribution */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-5">
        <div>
          <h3 className="text-lg font-bold text-white font-serif">
            Wear Distribution by Category
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            How often each clothing category is represented in your logged outfits
          </p>
        </div>

        <div className="space-y-4">
          {stats.categoryDistribution.map(({ category, count, wearCount }) => {
            const percentage =
              stats.totalWears > 0 ? Math.round((wearCount / stats.totalWears) * 100) : 0;

            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    {getCategoryLabel(category)} ({count} items)
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-300">{wearCount} wears</span>
                    <span className="text-violet-300 font-bold">{percentage}%</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Timeline Feed */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Wear Activity Feed</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of recent outfit wear entries
            </p>
          </div>
          <GlassBadge variant="slate">{stats.recentWearLogs.length} Logged Entries</GlassBadge>
        </div>

        {stats.recentWearLogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 text-center text-xs text-slate-400">
            No recent activity recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentWearLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: log.hexCode }}
                  />
                  <div>
                    <h5 className="font-bold text-white">{log.clothName}</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {log.occasion || 'Casual'} • {log.notes || 'Capsule rotation'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-300 block mb-0.5">
                    {log.wornDate}
                  </span>
                  {log.rating && (
                    <div className="flex items-center justify-end gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-[11px] font-mono">{log.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
