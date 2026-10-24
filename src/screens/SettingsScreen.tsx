import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Key,
  Database,
  Info,
  CheckCircle,
  Trash2,
  RotateCcw,
  Sparkles,
  Cpu,
} from 'lucide-react-native';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassInput } from '../components/glass/GlassInput';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassBadge } from '../components/glass/GlassBadge';
import {
  getStoredApiKey,
  saveStoredApiKey,
  clearStoredApiKey,
} from '../services/gemini/geminiService';
import { resetDatabase } from '../services/database/db';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface SettingsScreenProps {
  onDatabaseReset?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onDatabaseReset }) => {
  const [apiKey, setApiKey] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const key = await getStoredApiKey();
    if (key) {
      setApiKey(key);
      setHasStoredKey(true);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Empty Key', 'Please enter a valid Gemini API key.');
      return;
    }

    try {
      setIsSavingKey(true);
      await saveStoredApiKey(apiKey.trim());
      setHasStoredKey(true);
      Alert.alert('API Key Saved', 'Your Gemini API key has been securely saved to device storage.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save API key.');
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleClearApiKey = async () => {
    await clearStoredApiKey();
    setApiKey('');
    setHasStoredKey(false);
    Alert.alert('API Key Cleared', 'The app will now use the built-in intelligent stylist simulation engine.');
  };

  const handleResetDatabase = () => {
    Alert.alert(
      'Reset Wardrobe Database',
      'This will clear all clothing items, wear logs, and re-seed the default starter capsule wardrobe. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset & Re-seed',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetDatabase();
              onDatabaseReset?.();
              Alert.alert('Database Reset', 'Wardrobe has been re-seeded successfully.');
            } catch (e) {
              Alert.alert('Error', 'Failed to reset database.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <GlassBadge label="App Configuration" color={Colors.accents.violet} size="sm" />
          </View>
          <Text style={[Typography.h1, styles.title]}>Settings & AI</Text>
          <Text style={styles.subtitle}>
            Manage your Gemini vision credentials, local SQLite storage, and styling preferences.
          </Text>
        </View>

        {/* Gemini Vision API Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Key size={18} color={Colors.accents.violet} />
            <Text style={[Typography.h3, styles.sectionTitle]}>Google Gemini API</Text>
          </View>

          <GlassCard variant="default" borderRadius={20} style={styles.card}>
            <View style={styles.modelInfoBox}>
              <Cpu size={18} color={Colors.accents.violet} />
              <View style={{ flex: 1 }}>
                <Text style={styles.modelName}>Active Model: gemini-3.8-flash</Text>
                <Text style={styles.modelSub}>High-speed multimodal image understanding & color science.</Text>
              </View>
            </View>

            <Text style={styles.label}>Gemini API Key</Text>
            <GlassInput
              placeholder="Enter AIzaSy..."
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{ marginBottom: 12 }}
            />

            <View style={styles.keyActionsRow}>
              <GlassButton
                title={hasStoredKey ? 'Update Key' : 'Save Key'}
                onPress={handleSaveApiKey}
                loading={isSavingKey}
                variant="primary"
                style={{ flex: 1, marginRight: 8 }}
              />

              {hasStoredKey && (
                <GlassButton
                  title="Clear"
                  onPress={handleClearApiKey}
                  variant="secondary"
                  style={{ width: 85 }}
                />
              )}
            </View>

            <View style={styles.fallbackNotice}>
              <Info size={14} color={Colors.text.muted} />
              <Text style={styles.fallbackNoticeText}>
                No API key? OutFit automatically uses its built-in realistic stylist simulation engine so you can test all features offline.
              </Text>
            </View>
          </GlassCard>
        </View>

        {/* Local SQLite Database Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Database size={18} color={Colors.accents.cyan} />
            <Text style={[Typography.h3, styles.sectionTitle]}>Local Database (SQLite)</Text>
          </View>

          <GlassCard variant="default" borderRadius={20} style={styles.card}>
            <Text style={styles.dbDesc}>
              All your clothes, wear logs, and skin tone analyses are stored securely on your local device using high-performance SQLite in WAL mode.
            </Text>

            <TouchableOpacity
              onPress={handleResetDatabase}
              style={styles.resetButton}
              activeOpacity={0.8}
            >
              <RotateCcw size={18} color={Colors.accents.rose} />
              <Text style={styles.resetButtonText}>Reset & Re-seed Starter Wardrobe</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* Design System & Specifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Sparkles size={18} color={Colors.accents.emerald} />
            <Text style={[Typography.h3, styles.sectionTitle]}>Design System: Glassmorphism</Text>
          </View>

          <GlassCard variant="subtle" borderRadius={20} style={styles.card}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Frosted Blur:</Text>
              <Text style={styles.specValue}>Expo BlurView + Android dimezisBlurView fallback</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Ambient Lighting:</Text>
              <Text style={styles.specValue}>Radiant Violet, Cyan & Rose Gradient Orbs</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Borders & Highlights:</Text>
              <Text style={styles.specValue}>Specular Top Sheen & Translucent Borders</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Offline Capability:</Text>
              <Text style={styles.specValue}>100% Offline Local SQLite Storage</Text>
            </View>
          </GlassCard>
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
    marginBottom: 20,
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
  card: {
    padding: 16,
  },
  modelInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    gap: 10,
    marginBottom: 14,
  },
  modelName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modelSub: {
    color: Colors.text.secondary,
    fontSize: 11,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  keyActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fallbackNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 10,
    borderRadius: 12,
  },
  fallbackNoticeText: {
    color: Colors.text.muted,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  dbDesc: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    gap: 8,
  },
  resetButtonText: {
    color: '#FDA4AF',
    fontSize: 13,
    fontWeight: '600',
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  specLabel: {
    color: Colors.text.secondary,
    fontSize: 12,
  },
  specValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
});
