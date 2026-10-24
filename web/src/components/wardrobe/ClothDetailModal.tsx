import React from 'react';
import { ClothingItem, WearLog } from '../../types';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import {
  formatCurrency,
  calculateCostPerWear,
  formatRelativeDate,
  getCategoryLabel,
  getSeasonLabel,
} from '../../utils/formatUtils';
import { Calendar, Award, Star, Trash2, CheckCircle2 } from 'lucide-react';

interface ClothDetailModalProps {
  cloth: ClothingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onLogWear: (cloth: ClothingItem) => void;
  onDelete: (id: string) => void;
  wearLogs: WearLog[];
}

export const ClothDetailModal: React.FC<ClothDetailModalProps> = ({
  cloth,
  isOpen,
  onClose,
  onLogWear,
  onDelete,
  wearLogs,
}) => {
  if (!cloth) return null;

  const cpw = calculateCostPerWear(cloth.price, cloth.wearCount);
  const clothLogs = wearLogs.filter((l) => l.clothId === cloth.id);

  // CPW health rating
  let cpwStatus = { label: 'Underutilized', color: 'text-amber-400', progress: 20 };
  if (cloth.wearCount >= 30 || cpw <= 5) {
    cpwStatus = { label: 'Capsule Hero (High ROI)', color: 'text-emerald-400', progress: 100 };
  } else if (cloth.wearCount >= 10 || cpw <= 15) {
    cpwStatus = { label: 'Healthy Rotation', color: 'text-cyan-400', progress: 65 };
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove "${cloth.name}" from your wardrobe?`)) {
      onDelete(cloth.id);
      onClose();
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={cloth.name}
      subtitle={cloth.brand ? `By ${cloth.brand}` : 'Capsule Garment'}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Hero Image & Quick Badges */}
        <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group">
          {cloth.imageUri ? (
            <img
              src={cloth.imageUri}
              alt={cloth.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-serif text-3xl">
              {cloth.name[0]}
            </div>
          )}

          {/* Frosted Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <GlassBadge variant="slate" dot>
              {getCategoryLabel(cloth.category)}
            </GlassBadge>
            <GlassBadge variant="cyan">{getSeasonLabel(cloth.season)}</GlassBadge>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm shrink-0"
              style={{ backgroundColor: cloth.hexCode }}
            />
            <span className="text-white font-medium">{cloth.colorName}</span>
          </div>
        </div>

        {/* Cost-Per-Wear ROI Analytics Dashboard */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Investment & CPW Metrics
              </span>
            </div>
            <span className={`text-xs font-bold ${cpwStatus.color}`}>{cpwStatus.label}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Original Cost</span>
              <span className="text-base font-bold font-mono text-white">
                {formatCurrency(cloth.price)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Total Wears</span>
              <span className="text-base font-bold font-mono text-cyan-300">
                {cloth.wearCount} times
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Cost Per Wear</span>
              <span className="text-base font-bold font-mono text-emerald-300">
                {cloth.price ? `$${cpw}/wear` : 'N/A'}
              </span>
            </div>
          </div>

          {/* ROI Progress Bar */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Capsule Utilization</span>
              <span>{cpwStatus.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${cpwStatus.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Styling Notes */}
        {cloth.notes && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white block mb-1">Stylist & Fabric Notes:</span>
            {cloth.notes}
          </div>
        )}

        {/* Wear History Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>Logged Outfits ({clothLogs.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Last worn: {formatRelativeDate(cloth.lastWornDate)}
            </span>
          </div>

          {clothLogs.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-slate-400">
              No wear logs recorded yet. Wear this item today to start tracking!
            </div>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {clothLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{log.occasion || 'Casual'}</span>
                      <span className="text-slate-400 text-[11px]">{log.wornDate}</span>
                    </div>
                    {log.notes && <p className="text-slate-400 text-[11px] mt-0.5">{log.notes}</p>}
                  </div>
                  {log.rating && (
                    <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-xs font-mono">{log.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <GlassButton
            type="button"
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={handleDelete}
          >
            Delete
          </GlassButton>

          <div className="flex items-center gap-2">
            <GlassButton type="button" variant="secondary" size="sm" onClick={onClose}>
              Close
            </GlassButton>
            <GlassButton
              type="button"
              variant="primary"
              size="sm"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => {
                onLogWear(cloth);
                onClose();
              }}
            >
              Wear This Piece
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
};
