import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BarChart3,
  Flame,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
} from 'lucide-react-native';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassBadge } from '../components/glass/GlassBadge';
import { getWearStatistics } from '../services/database/clothesRepository';
import { WearStatistics } from '../services/database/types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { formatDate } from '../utils/dateUtils';

export const AnalyticsScreen: React.FC = () => {
  const [stats, setStats] = useState<WearStatistics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getWearStatistics();
      setStats(data);
    } catch (e) {
      console.warn('Failed to load wear statistics:', e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchStats();
    setIsRefreshing(false);
  };

  if (!stats) return null;

  const maxCategoryWear = Math.max(
    ...stats.categoryDistribution.map((c) => c.wearCount),
    1
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accents.violet}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <GlassBadge
              label="Local Database Analytics"
              color={Colors.accents.cyan}
              size="sm"
            />
          </View>
          <Text style={[Typography.h1, styles.title]}>Wear Frequency</Text>
          <Text style={styles.subtitle}>
            Data-driven insights to maximize your wardrobe utilization and cost-per-wear.
          </Text>
        </View>

        {/* 4 Core Metrics Grid */}
        <View style={styles.metricsGrid}>
          <GlassCard variant="default" borderRadius={20} style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <Sparkles size={16} color={Colors.accents.violet} />
            </View>
            <Text style={styles.metricValue}>{stats.totalWears}</Text>
            <Text style={styles.metricLabel}>Total Wears</Text>
          </GlassCard>

          <GlassCard variant="default" borderRadius={20} style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <TrendingUp size={16} color={Colors.accents.cyan} />
            </View>
            <Text style={[styles.metricValue, { color: Colors.accents.cyan }]}>
              {stats.averageWearPerItem}
            </Text>
            <Text style={styles.metricLabel}>Avg Wears/Item</Text>
          </GlassCard>

          <GlassCard variant="default" borderRadius={20} style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <CheckCircle size={16} color={Colors.accents.emerald} />
            </View>
            <Text style={[styles.metricValue, { color: Colors.accents.emerald }]}>
              {stats.totalItems}
            </Text>
            <Text style={styles.metricLabel}>Wardrobe Items</Text>
          </GlassCard>

          <GlassCard variant="default" borderRadius={20} style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <AlertTriangle size={16} color={Colors.accents.amber} />
            </View>
            <Text style={[styles.metricValue, { color: Colors.accents.amber }]}>
              {stats.neglectedItemsCount}
            </Text>
            <Text style={styles.metricLabel}>Underutilized</Text>
          </GlassCard>
        </View>

        {/* Most Worn Champion Hero */}
        {stats.mostWornItem && (
          <GlassCard variant="accent" borderRadius={22} style={styles.mvpCard}>
            <View style={styles.mvpRow}>
              <View style={styles.mvpIconWrap}>
                <Flame size={24} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mvpBadge}>MOST WORN ITEM</Text>
                <Text style={[Typography.h3, styles.mvpTitle]} numberOfLines={1}>
                  {stats.mostWornItem.name}
                </Text>
                <Text style={styles.mvpSub}>
                  {stats.mostWornItem.wearCount} wears logged • {stats.mostWornItem.colorName}
                </Text>
              </View>
              <View
                style={[
                  styles.mvpColorDot,
                  { backgroundColor: stats.mostWornItem.hexCode },
                ]}
              />
            </View>
          </GlassCard>
        )}

        {/* Category Wear Breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <BarChart3 size={18} color={Colors.accents.violet} />
            <Text style={[Typography.h3, styles.sectionTitle]}>Category Distribution</Text>
          </View>

          <GlassCard variant="default" borderRadius={20} style={styles.categoryCard}>
            {stats.categoryDistribution.map((cat) => {
              const percentage = Math.round((cat.wearCount / maxCategoryWear) * 100);
              const categoryColor = Colors.categories[cat.category];
              return (
                <View key={cat.category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>
                      {cat.category.toUpperCase().replace('_', ' ')}
                    </Text>
                    <Text style={styles.categoryCounts}>
                      {cat.wearCount} wears ({cat.count} items)
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.max(percentage, 6)}%`,
                          backgroundColor: categoryColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </GlassCard>
        </View>

        {/* Recent Wear Logs Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Clock size={18} color={Colors.accents.cyan} />
            <Text style={[Typography.h3, styles.sectionTitle]}>Recent Activity Log</Text>
          </View>

          {stats.recentWearLogs.length === 0 ? (
            <GlassCard variant="subtle" borderRadius={18} style={styles.emptyLogCard}>
              <Text style={styles.emptyLogText}>No outfits logged yet. Start wearing your clothes!</Text>
            </GlassCard>
          ) : (
            stats.recentWearLogs.map((log) => (
              <GlassCard
                key={log.id}
                variant="subtle"
                borderRadius={16}
                style={styles.activityCard}
              >
                <View style={styles.activityRow}>
                  <View style={[styles.activityDot, { backgroundColor: log.hexCode }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityTitle}>{log.clothName}</Text>
                    <Text style={styles.activityMeta}>
                      {formatDate(log.wornDate)} • {log.occasion || 'Daily rotation'}
                    </Text>
                    {log.notes && (
                      <Text style={styles.activityNotes}>"{log.notes}"</Text>
                    )}
                  </View>
                  <View style={styles.activityRating}>
                    {[...Array(log.rating || 5)].map((_, i) => (
                      <Star key={i} size={10} color="#F59E0B" fill="#F59E0B" />
                    ))}
                  </View>
                </View>
              </GlassCard>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 16,
  },
  badgeRow: {
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    padding: 16,
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  mvpCard: {
    padding: 16,
    marginBottom: 20,
  },
  mvpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mvpIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  mvpBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FCD34D',
    letterSpacing: 0.5,
  },
  mvpTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  mvpSub: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  mvpColorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryCard: {
    padding: 16,
    gap: 14,
  },
  categoryRow: {
    gap: 6,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  categoryCounts: {
    color: Colors.text.muted,
    fontSize: 12,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyLogCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyLogText: {
    color: Colors.text.muted,
    fontSize: 13,
  },
  activityCard: {
    padding: 12,
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  activityMeta: {
    color: Colors.text.muted,
    fontSize: 11,
    marginTop: 2,
  },
  activityNotes: {
    color: Colors.text.secondary,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  activityRating: {
    flexDirection: 'row',
    gap: 2,
  },
});
