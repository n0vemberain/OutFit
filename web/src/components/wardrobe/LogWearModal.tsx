import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ClothingItem } from '../../types';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { Star, Sparkles } from 'lucide-react';

interface LogWearModalProps {
  cloth: ClothingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmWear: (
    clothId: string,
    details: { occasion: string; rating: number; notes: string; date: string }
  ) => void;
}

const OCCASIONS = [
  'Casual Weekend',
  'Work & Office',
  'Date Night',
  'Dinner Party',
  'Formal Event',
  'Travel & Airport',
  'Coffee Meeting',
];

export const LogWearModal: React.FC<LogWearModalProps> = ({
  cloth,
  isOpen,
  onClose,
  onConfirmWear,
}) => {
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  if (!cloth) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmWear(cloth.id, {
      occasion,
      rating,
      notes: notes.trim(),
      date,
    });

    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8B5CF6', '#06B6D4', '#F43F5E', '#F59E0B'],
      });
    } catch (err) {
      console.log('Confetti not available:', err);
    }

    setNotes('');
    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Outfit Wear"
      subtitle={`Wearing "${cloth.name}" today`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Garment Summary Ribbon */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="w-12 h-14 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-white/10">
            {cloth.imageUri ? (
              <img src={cloth.imageUri} alt={cloth.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 font-serif">
                {cloth.name[0]}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{cloth.name}</h4>
            <p className="text-xs text-slate-400">
              Current wear count: <span className="text-cyan-300 font-mono">{cloth.wearCount}</span>{' '}
              → New: <span className="text-emerald-300 font-mono font-bold">{cloth.wearCount + 1}</span>
            </p>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Wear Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Occasion */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Occasion</label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((occ) => (
              <button
                type="button"
                key={occ}
                onClick={() => setOccasion(occ)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  occasion === occ
                    ? 'bg-violet-600/30 border-violet-400 text-white font-semibold shadow-sm shadow-violet-500/20'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Outfit Satisfaction Rating */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Outfit Rating: <span className="text-amber-400 font-bold">{rating} Stars</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Outfit Notes & Pairings
          </label>
          <input
            type="text"
            placeholder="e.g. Paired with white sneakers and dark indigo jeans"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <GlassButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton type="submit" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
            Confirm Wear
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
