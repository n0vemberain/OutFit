import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  X,
  Trash2,
  Plus,
  Sparkles,
  Calendar,
  DollarSign,
  Tag,
  Star,
} from 'lucide-react-native';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import { ClothingItem, WearLog } from '../../services/database/types';
import { getWearLogs, deleteCloth } from '../../services/database/clothesRepository';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { formatDate, getCostPerWear, getDaysAgo } from '../../utils/dateUtils';

interface ClothDetailModalProps {
  visible: boolean;
  item: ClothingItem | null;
  onClose: () => void;
  onOpenLogWear: () => void;
  onItemDeleted: () => void;
}

export const ClothDetailModal: React.FC<ClothDetailModalProps> = ({
  visible,
  item,
  onClose,
  onOpenLogWear,
  onItemDeleted,
}) => {
  const [logs, setLogs] = useState<WearLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    if (visible && item) {
      loadLogs();
    }
  }, [visible, item]);

  const loadLogs = async () => {
    if (!item) return;
    try {
      setIsLoadingLogs(true);
      const data = await getWearLogs(item.id);
      setLogs(data);
    } catch (e) {
      console.warn('Failed to load logs:', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  if (!item) return null;

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to remove "${item.name}" from your wardrobe?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCloth(item.id);
              onItemDeleted();
              onClose();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete item.');
            }
          },
        },
      ]
    );
  };

  const categoryColor = Colors.categories[item.category] || Colors.accents.violet;

  return (
    <GlassModal visible={visible} onClose={onClose}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.largeColorDot, { backgroundColor: item.hexCode }]} />
          <View style={{ flex: 1 }}>
            <Text style={[Typography.h2, styles.title]} numberOfLines={1}>
              {item.name}
            </Text>
            {item.brand && <Text style={styles.brand}>{item.brand}</Text>}
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Badges Row */}
      <View style={styles.badgesRow}>
        <GlassBadge
          label={item.category.toUpperCase().replace('_', ' ')}
          color={categoryColor}
          size="sm"
        />
        <GlassBadge
          label={item.season === 'all' ? 'ALL SEASONS' : `${item.season.toUpperCase()}`}
          color={Colors.accents.cyan}
          size="sm"
        />
        <GlassBadge
          label={item.colorName}
          color={Colors.accents.amber}
          size="sm"
          variant="outline"
        />
      </View>

      {/* Analytics Card */}
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticBox}>
          <Sparkles size={16} color={Colors.accents.violet} />
          <Text style={styles.analyticValue}>{item.wearCount}</Text>
          <Text style={styles.analyticLabel}>Total Wears</Text>
        </View>

        <View style={styles.analyticBox}>
          <DollarSign size={16} color={Colors.accents.emerald} />
          <Text style={[styles.analyticValue, { color: Colors.accents.emerald }]}>
            {getCostPerWear(item.price, item.wearCount)}
          </Text>
          <Text style={styles.analyticLabel}>Cost / Wear</Text>
        </View>

        <View style={styles.analyticBox}>
          <Calendar size={16} color={Colors.accents.cyan} />
          <Text style={styles.analyticValue}>{getDaysAgo(item.lastWornDate)}</Text>
          <Text style={styles.analyticLabel}>Last Worn</Text>
        </View>
      </View>

      {/* Notes / Styling Tips */}
      {item.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionHeader}>Styling & Care Notes</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      {/* Wear History Timeline */}
      <View style={styles.historySection}>
        <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionHeader}>Wear History</Text>
          <Text style={styles.historyCount}>{logs.length} logged</Text>
        </View>

        {logs.length === 0 ? (
          <View style={styles.emptyLogs}>
            <Text style={styles.emptyLogsText}>No wear events logged yet.</Text>
          </View>
        ) : (
          logs.slice(0, 5).map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logLeft}>
                <Text style={styles.logOccasion}>{log.occasion || 'Daily rotation'}</Text>
                <Text style={styles.logDate}>{formatDate(log.wornDate)}</Text>
                {log.notes && <Text style={styles.logNotes}>"{log.notes}"</Text>}
              </View>
              <View style={styles.logRating}>
                {[...Array(log.rating || 5)].map((_, i) => (
                  <Star key={i} size={11} color="#F59E0B" fill="#F59E0B" />
                ))}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <GlassButton
          title="Log Wear"
          onPress={() => {
            onClose();
            onOpenLogWear();
          }}
          icon={<Plus size={16} color="#FFFFFF" />}
          variant="primary"
          style={{ flex: 1, marginRight: 8 }}
        />

        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  largeColorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  brand: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  analyticBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  analyticValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  analyticLabel: {
    color: Colors.text.muted,
    fontSize: 11,
    marginTop: 2,
  },
  notesSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionHeader: {
    color: Colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  notesText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
  },
  historySection: {
    marginBottom: 18,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyCount: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  emptyLogs: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyLogsText: {
    color: Colors.text.muted,
    fontSize: 13,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  logLeft: {
    flex: 1,
  },
  logOccasion: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  logDate: {
    color: Colors.text.muted,
    fontSize: 11,
    marginTop: 2,
  },
  logNotes: {
    color: Colors.text.secondary,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  logRating: {
    flexDirection: 'row',
    gap: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
