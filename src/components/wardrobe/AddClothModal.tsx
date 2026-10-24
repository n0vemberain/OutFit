import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Sparkles, Tag, DollarSign, Palette } from 'lucide-react-native';
import { GlassModal } from '../glass/GlassModal';
import { GlassInput } from '../glass/GlassInput';
import { GlassButton } from '../glass/GlassButton';
import { ClothingCategory, ClothingItem, ClothingSeason } from '../../services/database/types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface AddClothModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCloth: (cloth: Omit<ClothingItem, 'id' | 'createdAt' | 'wearCount'>) => Promise<void>;
}

const CATEGORIES: { label: string; value: ClothingCategory }[] = [
  { label: 'Tops', value: 'tops' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'One-Piece', value: 'one_piece' },
];

const SEASONS: { label: string; value: ClothingSeason }[] = [
  { label: 'All Year', value: 'all' },
  { label: 'Summer', value: 'summer' },
  { label: 'Winter', value: 'winter' },
  { label: 'Spring', value: 'spring' },
  { label: 'Fall', value: 'fall' },
];

const PRESET_COLORS = [
  { name: 'Onyx Black', hex: '#09090B' },
  { name: 'Crisp White', hex: '#F8FAFC' },
  { name: 'Charcoal Grey', hex: '#334155' },
  { name: 'Royal Navy', hex: '#1E3A8A' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Camel Tan', hex: '#B45309' },
  { name: 'Burgundy Wine', hex: '#881337' },
  { name: 'Terracotta Rust', hex: '#C2410C' },
  { name: 'Slate Blue', hex: '#3B82F6' },
  { name: 'Olive Green', hex: '#4D7C0F' },
  { name: 'Warm Taupe', hex: '#78716C' },
  { name: 'Dusty Rose', hex: '#EC4899' },
];

export const AddClothModal: React.FC<AddClothModalProps> = ({
  visible,
  onClose,
  onAddCloth,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [colorName, setColorName] = useState('Charcoal Grey');
  const [hexCode, setHexCode] = useState('#334155');
  const [season, setSeason] = useState<ClothingSeason>('all');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter a name for the clothing item.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddCloth({
        name: name.trim(),
        category,
        colorName: colorName.trim() || 'Custom Color',
        hexCode: hexCode.trim() || '#334155',
        season,
        brand: brand.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setName('');
      setBrand('');
      setPrice('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error adding cloth:', error);
      Alert.alert('Error', 'Failed to save clothing item to wardrobe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Sparkles size={20} color={Colors.accents.violet} />
          <Text style={[Typography.h2, styles.title]}>Add Wardrobe Item</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Item Name */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Item Name *</Text>
        <GlassInput
          placeholder="e.g. Cashmere Knit Sweater"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      {/* Category Selection */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {CATEGORIES.map((c) => {
            const isSelected = category === c.value;
            const catColor = Colors.categories[c.value];
            return (
              <TouchableOpacity
                key={c.value}
                onPress={() => setCategory(c.value)}
                style={[
                  styles.chip,
                  isSelected && {
                    backgroundColor: `${catColor}33`,
                    borderColor: catColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && { color: '#FFFFFF', fontWeight: '700' },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Color Selection & Swatches */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Color: {colorName}</Text>
        <View style={styles.swatchesGrid}>
          {PRESET_COLORS.map((color) => {
            const isSelected = hexCode === color.hex;
            return (
              <TouchableOpacity
                key={color.hex}
                onPress={() => {
                  setHexCode(color.hex);
                  setColorName(color.name);
                }}
                style={[
                  styles.swatch,
                  { backgroundColor: color.hex },
                  isSelected && styles.swatchSelected,
                ]}
              />
            );
          })}
        </View>
        <GlassInput
          placeholder="Custom Color Name"
          value={colorName}
          onChangeText={setColorName}
          icon={<Palette size={16} color={Colors.text.muted} />}
          containerStyle={{ marginTop: 8 }}
        />
      </View>

      {/* Season Selection */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Season</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {SEASONS.map((s) => {
            const isSelected = season === s.value;
            return (
              <TouchableOpacity
                key={s.value}
                onPress={() => setSeason(s.value)}
                style={[
                  styles.chip,
                  isSelected && {
                    backgroundColor: 'rgba(139, 92, 246, 0.3)',
                    borderColor: Colors.accents.violet,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && { color: '#FFFFFF', fontWeight: '700' },
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Brand & Price in Row */}
      <View style={styles.rowFields}>
        <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.fieldLabel}>Brand</Text>
          <GlassInput
            placeholder="e.g. Uniqlo"
            value={brand}
            onChangeText={setBrand}
            icon={<Tag size={16} color={Colors.text.muted} />}
          />
        </View>

        <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.fieldLabel}>Price ($)</Text>
          <GlassInput
            placeholder="e.g. 85"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            icon={<DollarSign size={16} color={Colors.text.muted} />}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <GlassButton
          title="Add to Wardrobe"
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
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  chipText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  swatchesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 4,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  swatchSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  rowFields: {
    flexDirection: 'row',
  },
  actions: {
    marginTop: 10,
    marginBottom: 6,
  },
});
