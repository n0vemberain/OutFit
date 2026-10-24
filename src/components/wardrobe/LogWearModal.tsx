import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Sparkles, Calendar, Star, X } from 'lucide-react-native';
import { GlassModal } from '../glass/GlassModal';
import { GlassInput } from '../glass/GlassInput';
import { GlassButton } from '../glass/GlassButton';
import { ClothingItem } from '../../services/database/types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface LogWearModalProps {
  visible: boolean;
  item: ClothingItem | null;
  onClose: () => void;
  onConfirmLog: (details: {
    wornDate?: string;
    occasion?: string;
    rating?: number;
    notes?: string;
  }) => Promise<void>;
}

const OCCASIONS = ['Casual', 'Work / Office', 'Date Night', 'Formal / Gala', 'Workout / Active', 'Travel'];

export const LogWearModal: React.FC<LogWearModalProps> = ({
  visible,
  item,
  onClose,
  onConfirmLog,
}) => {
  const [occasion, setOccasion] = useState('Casual');
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onConfirmLog({
        occasion,
        rating,
        notes: notes.trim() || undefined,
        wornDate: new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (e) {
      console.error('Failed to log wear:', e);
      Alert.alert('Error', 'Could not record wear event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Sparkles size={18} color={Colors.accents.violet} />
          <Text style={[Typography.h3, styles.title]}>Log Outfit Wear</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={18} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Target Item Summary */}
      <View style={styles.itemSummary}>
        <View style={[styles.colorDot, { backgroundColor: item.hexCode }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemSub}>
            Current wears: {item.wearCount} • {item.category.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Occasion Selector */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Occasion</Text>
        <View style={styles.occasionsContainer}>
          {OCCASIONS.map((occ) => {
            const isSelected = occasion === occ;
            return (
              <TouchableOpacity
                key={occ}
                onPress={() => setOccasion(occ)}
                style={[
                  styles.occChip,
                  isSelected && styles.occChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.occText,
                    isSelected && styles.occTextSelected,
                  ]}
                >
                  {occ}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Outfit Satisfaction Rating */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Outfit Rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starBtn}
            >
              <Star
                size={28}
                color={star <= rating ? '#F59E0B' : 'rgba(255, 255, 255, 0.2)'}
                fill={star <= rating ? '#F59E0B' : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Notes / Pairing Details</Text>
        <GlassInput
          placeholder="e.g. Paired with white court sneakers and selvedge denim"
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Submit Button */}
      <View style={styles.actions}>
        <GlassButton
          title={`Confirm Wear (+1 Wear)`}
          onPress={handleSubmit}
          loading={isSubmitting}
          variant="primary"
          size="lg"
        />
      </View>
    </GlassModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  itemSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  itemName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  itemSub: {
    color: Colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  occasionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  occChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  occChipSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: Colors.accents.violet,
  },
  occText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  occTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  starBtn: {
    padding: 2,
  },
  actions: {
    marginTop: 10,
  },
});
