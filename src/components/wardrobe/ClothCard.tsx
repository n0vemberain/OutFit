import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shirt, Sparkles, Plus, Calendar, DollarSign } from 'lucide-react-native';
import { GlassCard } from '../glass/GlassCard';
import { GlassBadge } from '../glass/GlassBadge';
import { ClothingItem } from '../../services/database/types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { getDaysAgo, getCostPerWear } from '../../utils/dateUtils';

interface ClothCardProps {
  item: ClothingItem;
  onPress: () => void;
  onQuickLogWear: () => void;
}

export const ClothCard: React.FC<ClothCardProps> = ({
  item,
  onPress,
  onQuickLogWear,
}) => {
  const categoryColor = Colors.categories[item.category] || Colors.accents.violet;
  const isHighWear = item.wearCount >= 15;
  const isNeglected = item.wearCount === 0;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.touchable}>
      <GlassCard
        variant="default"
        borderRadius={20}
        intensity={30}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          {/* Color swatch circle with specular rim */}
          <View style={styles.colorIndicatorWrapper}>
            <View
              style={[
                styles.colorDot,
                {
                  backgroundColor: item.hexCode,
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              ]}
            />
            <Text style={styles.colorLabel} numberOfLines={1}>
              {item.colorName}
            </Text>
          </View>

          {/* Category Badge */}
          <GlassBadge
            label={item.category.toUpperCase().replace('_', ' ')}
            color={categoryColor}
            size="sm"
            variant="filled"
          />
        </View>

        {/* Item Title & Brand */}
        <View style={styles.titleSection}>
          <Text style={[Typography.h3, styles.titleText]} numberOfLines={1}>
            {item.name}
          </Text>
          {item.brand && (
            <Text style={styles.brandText} numberOfLines={1}>
              {item.brand}
            </Text>
          )}
        </View>

        {/* Stats Row: Wears, Recency, CPW */}
        <View style={styles.statsRow}>
          {/* Wear Count Pill */}
          <View
            style={[
              styles.wearPill,
              isHighWear && styles.wearPillHigh,
              isNeglected && styles.wearPillLow,
            ]}
          >
            <Sparkles size={12} color={isHighWear ? '#F59E0B' : '#A78BFA'} />
            <Text
              style={[
                styles.wearCountText,
                isHighWear && { color: '#FDE68A' },
                isNeglected && { color: '#94A3B8' },
              ]}
            >
              {item.wearCount} {item.wearCount === 1 ? 'wear' : 'wears'}
            </Text>
          </View>

          {/* Last Worn Recency */}
          <View style={styles.metaItem}>
            <Calendar size={12} color={Colors.text.muted} />
            <Text style={styles.metaText}>{getDaysAgo(item.lastWornDate)}</Text>
          </View>

          {/* Cost per wear (if price recorded) */}
          {item.price && item.price > 0 && (
            <View style={styles.metaItem}>
              <DollarSign size={12} color={Colors.accents.emerald} />
              <Text style={[styles.metaText, { color: Colors.accents.emerald }]}>
                {getCostPerWear(item.price, item.wearCount)}
              </Text>
            </View>
          )}
        </View>

        {/* Card Footer with Quick Log Action */}
        <View style={styles.footerRow}>
          <Text style={styles.seasonTag}>
            {item.season === 'all' ? 'All Seasons' : item.season.toUpperCase()}
          </Text>

          <TouchableOpacity
            style={styles.logWearButton}
            activeOpacity={0.7}
            onPress={(e) => {
              e.stopPropagation();
              onQuickLogWear();
            }}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={styles.logWearButtonText}>Wear</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 14,
  },
  card: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  colorLabel: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  titleSection: {
    marginBottom: 12,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
  },
  brandText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  wearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 4,
  },
  wearPillHigh: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  wearPillLow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  wearCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DDD6FE',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.07)',
  },
  seasonTag: {
    fontSize: 11,
    color: Colors.text.muted,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  logWearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.5)',
    gap: 4,
  },
  logWearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
