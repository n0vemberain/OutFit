import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Shirt, Sparkles, BarChart3, Settings } from 'lucide-react-native';
import { Colors } from '../theme/colors';

export type TabKey = 'wardrobe' | 'ai_stylist' | 'analytics' | 'settings';

interface BottomTabsProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { key: TabKey; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    {
      key: 'wardrobe',
      label: 'Closet',
      icon: (active) => (
        <Shirt
          size={22}
          color={active ? '#FFFFFF' : Colors.text.muted}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
    {
      key: 'ai_stylist',
      label: 'AI Stylist',
      icon: (active) => (
        <Sparkles
          size={22}
          color={active ? '#F59E0B' : Colors.text.muted}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: (active) => (
        <BarChart3
          size={22}
          color={active ? '#06B6D4' : Colors.text.muted}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: (active) => (
        <Settings
          size={22}
          color={active ? '#A78BFA' : Colors.text.muted}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
  ];

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      <View style={styles.glassDock}>
        {/* Blur Layer */}
        <BlurView
          intensity={50}
          tint="dark"
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          style={StyleSheet.absoluteFill}
        />

        {/* Specular Gradient Sheen */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Top Highlight Line */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.specularLine}
        />

        {/* Tabs Row */}
        <View style={styles.tabsRow}>
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => onSelectTab(tab.key)}
                style={styles.tabButton}
                activeOpacity={0.7}
              >
                <View style={[styles.tabContent, isActive && styles.tabContentActive]}>
                  {tab.icon(isActive)}
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 99,
  },
  glassDock: {
    width: '100%',
    maxWidth: 420,
    height: 68,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
    backgroundColor: Platform.select({
      android: 'rgba(15, 23, 42, 0.85)',
      default: 'rgba(255, 255, 255, 0.05)',
    }),
  },
  specularLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    gap: 3,
  },
  tabContentActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.text.muted,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
