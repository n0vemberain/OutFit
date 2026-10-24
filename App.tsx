import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AmbientBackground } from './src/components/glass/AmbientBackground';
import { BottomTabs, TabKey } from './src/navigation/BottomTabs';
import { WardrobeScreen } from './src/screens/WardrobeScreen';
import { AiStylistScreen } from './src/screens/AiStylistScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { getDatabase } from './src/services/database/db';
import { Colors } from './src/theme/colors';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('wardrobe');
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbKey, setDbKey] = useState(0);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      await getDatabase();
      setIsDbReady(true);
    } catch (e) {
      console.warn('Database initialization warning:', e);
      setIsDbReady(true);
    }
  };

  const handleDatabaseReset = () => {
    setDbKey((prev) => prev + 1);
  };

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'wardrobe':
        return <WardrobeScreen key={`wardrobe_${dbKey}`} />;
      case 'ai_stylist':
        return <AiStylistScreen key={`stylist_${dbKey}`} />;
      case 'analytics':
        return <AnalyticsScreen key={`analytics_${dbKey}`} />;
      case 'settings':
        return <SettingsScreen onDatabaseReset={handleDatabaseReset} />;
      default:
        return <WardrobeScreen key={`wardrobe_${dbKey}`} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AmbientBackground>
        {!isDbReady ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accents.violet} />
          </View>
        ) : (
          <View style={styles.appContainer}>
            <View style={styles.screenContainer}>{renderActiveScreen()}</View>
            <BottomTabs currentTab={currentTab} onSelectTab={setCurrentTab} />
          </View>
        )}
      </AmbientBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
