import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Shirt,
} from 'lucide-react-native';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassInput } from '../components/glass/GlassInput';
import { ClothCard } from '../components/wardrobe/ClothCard';
import { AddClothModal } from '../components/wardrobe/AddClothModal';
import { ClothDetailModal } from '../components/wardrobe/ClothDetailModal';
import { LogWearModal } from '../components/wardrobe/LogWearModal';
import {
  getAllClothes,
  addCloth,
  logWear,
} from '../services/database/clothesRepository';
import { ClothingCategory, ClothingItem } from '../services/database/types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const CATEGORIES: { label: string; value: ClothingCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Tops', value: 'tops' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'One-Piece', value: 'one_piece' },
];

const SORT_OPTIONS: { label: string; value: 'recent' | 'wear_desc' | 'wear_asc' | 'name' }[] = [
  { label: 'Recently Worn', value: 'recent' },
  { label: 'Most Worn', value: 'wear_desc' },
  { label: 'Least Worn', value: 'wear_asc' },
  { label: 'Name (A-Z)', value: 'name' },
];

export const WardrobeScreen: React.FC = () => {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'wear_desc' | 'wear_asc' | 'name'>('recent');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<ClothingItem | null>(null);
  const [selectedItemForLogWear, setSelectedItemForLogWear] = useState<ClothingItem | null>(null);

  const fetchClothes = useCallback(async () => {
    try {
      const data = await getAllClothes({
        category: selectedCategory,
        searchQuery,
        sortBy,
      });
      setClothes(data);
    } catch (e) {
      console.warn('Error fetching clothes:', e);
    }
  }, [selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    fetchClothes();
  }, [fetchClothes]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchClothes();
    setIsRefreshing(false);
  };

  const handleQuickLogWear = async (item: ClothingItem) => {
    await logWear(item.id);
    await fetchClothes();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <Sparkles size={18} color={Colors.accents.violet} />
            <Text style={[Typography.h1, styles.brandTitle]}>OutFit</Text>
          </View>
          <Text style={styles.subtitle}>
            {clothes.length} {clothes.length === 1 ? 'item' : 'items'} in your wardrobe
          </Text>
        </View>

        {/* Add Item FAB / Button */}
        <TouchableOpacity
          onPress={() => setIsAddModalOpen(true)}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <GlassInput
          placeholder="Search by name, color, or brand..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Search size={18} color={Colors.text.muted} />}
        />
      </View>

      {/* Categories Horizontal Filter */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            const categoryThemeColor =
              cat.value !== 'all' ? Colors.categories[cat.value] : Colors.accents.violet;
            return (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setSelectedCategory(cat.value)}
                style={[
                  styles.categoryPill,
                  isSelected && {
                    backgroundColor: `${categoryThemeColor}33`,
                    borderColor: categoryThemeColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && { color: '#FFFFFF', fontWeight: '700' },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sorting Tabs Row */}
      <View style={styles.sortRow}>
        <SlidersHorizontal size={14} color={Colors.text.muted} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
          {SORT_OPTIONS.map((sort) => {
            const isSelected = sortBy === sort.value;
            return (
              <TouchableOpacity
                key={sort.value}
                onPress={() => setSortBy(sort.value)}
                style={[styles.sortChip, isSelected && styles.sortChipActive]}
              >
                <Text style={[styles.sortChipText, isSelected && styles.sortChipTextActive]}>
                  {sort.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Clothing List */}
      <FlatList
        data={clothes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClothCard
            item={item}
            onPress={() => setSelectedItemForDetail(item)}
            onQuickLogWear={() => handleQuickLogWear(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accents.violet}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlassCard variant="subtle" style={styles.emptyCard} borderRadius={24}>
              <Shirt size={48} color={Colors.text.muted} style={{ marginBottom: 12 }} />
              <Text style={[Typography.h3, styles.emptyTitle]}>No Clothes Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No items matching "${searchQuery}"`
                  : 'Start adding pieces to your digital wardrobe to track wear frequency!'}
              </Text>
            </GlassCard>
          </View>
        }
      />

      {/* Modals */}
      <AddClothModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCloth={async (item) => {
          await addCloth(item);
          await fetchClothes();
        }}
      />

      <ClothDetailModal
        visible={!!selectedItemForDetail}
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onOpenLogWear={() => {
          setSelectedItemForLogWear(selectedItemForDetail);
        }}
        onItemDeleted={fetchClothes}
      />

      <LogWearModal
        visible={!!selectedItemForLogWear}
        item={selectedItemForLogWear}
        onClose={() => setSelectedItemForLogWear(null)}
        onConfirmLog={async (details) => {
          if (selectedItemForLogWear) {
            await logWear(selectedItemForLogWear.id, details);
            await fetchClothes();
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: 13,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accents.violet,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6,
    shadowColor: Colors.accents.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoriesWrapper: {
    marginBottom: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryPillText: {
    color: Colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 8,
  },
  sortScroll: {
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  sortChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  sortChipText: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  sortChipTextActive: {
    color: '#C4B5FD',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    width: '100%',
  },
  emptyTitle: {
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: Colors.text.secondary,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
});
