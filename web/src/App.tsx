import { useState, useEffect, useCallback } from 'react';
import { ActiveTab, ClothingItem, WearLog, WearStatistics, SkinToneAnalysis } from './types';
import { WardrobeStorage } from './services/storage/wardrobeStorage';
import { AmbientBackground } from './components/glass/AmbientBackground';
import { Navbar } from './components/navigation/Navbar';
import { WardrobeView } from './components/wardrobe/WardrobeView';
import { AiStylistView } from './components/stylist/AiStylistView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { AddClothModal } from './components/wardrobe/AddClothModal';
import { ClothDetailModal } from './components/wardrobe/ClothDetailModal';
import { LogWearModal } from './components/wardrobe/LogWearModal';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('wardrobe');
  const [clothes, setClothes] = useState<ClothingItem[]>(() => WardrobeStorage.getClothes());
  const [wearLogs, setWearLogs] = useState<WearLog[]>(() => WardrobeStorage.getWearLogs());
  const [stats, setStats] = useState<WearStatistics>(() => WardrobeStorage.getStatistics());
  const [skinAnalysis, setSkinAnalysis] = useState<SkinToneAnalysis | null>(() =>
    WardrobeStorage.getSkinAnalysis()
  );

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailCloth, setDetailCloth] = useState<ClothingItem | null>(null);
  const [wearCloth, setWearCloth] = useState<ClothingItem | null>(null);

  // Sync and refresh statistics
  const refreshData = useCallback(() => {
    const updatedClothes = WardrobeStorage.getClothes();
    const updatedLogs = WardrobeStorage.getWearLogs();
    const updatedStats = WardrobeStorage.getStatistics();
    const updatedAnalysis = WardrobeStorage.getSkinAnalysis();

    setClothes(updatedClothes);
    setWearLogs(updatedLogs);
    setStats(updatedStats);
    setSkinAnalysis(updatedAnalysis);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleAddCloth = (item: Omit<ClothingItem, 'id' | 'createdAt' | 'wearCount'>) => {
    WardrobeStorage.addCloth(item);
    refreshData();
  };

  const handleQuickLogWear = (cloth: ClothingItem) => {
    setWearCloth(cloth);
  };

  const handleConfirmWear = (
    clothId: string,
    details: { occasion: string; rating: number; notes: string; date: string }
  ) => {
    WardrobeStorage.logWear(clothId, details);
    refreshData();
  };

  const handleDeleteCloth = (id: string) => {
    WardrobeStorage.deleteCloth(id);
    refreshData();
  };

  const handleResetSeedData = () => {
    WardrobeStorage.resetToSeedData();
    refreshData();
  };

  return (
    <AmbientBackground>
      {/* Top Navbar & Floating Dock */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        itemCount={clothes.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAiStylist={() => setActiveTab('stylist')}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'wardrobe' && (
          <WardrobeView
            clothes={clothes}
            onAddClothClick={() => setIsAddModalOpen(true)}
            onSelectCloth={(cloth) => setDetailCloth(cloth)}
            onQuickLogWear={handleQuickLogWear}
            onResetSeedData={handleResetSeedData}
          />
        )}

        {activeTab === 'stylist' && (
          <AiStylistView
            clothes={clothes}
            savedAnalysis={skinAnalysis}
            onSelectCloth={(cloth) => setDetailCloth(cloth)}
            onQuickLogWear={handleQuickLogWear}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            stats={stats}
            onSelectCloth={(cloth) => setDetailCloth(cloth)}
            onQuickLogWear={handleQuickLogWear}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            onDataReset={handleResetSeedData}
            onDataImported={refreshData}
          />
        )}
      </main>

      {/* Modals */}
      <AddClothModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCloth={handleAddCloth}
      />

      <ClothDetailModal
        cloth={detailCloth}
        isOpen={!!detailCloth}
        onClose={() => setDetailCloth(null)}
        onLogWear={(cloth) => setWearCloth(cloth)}
        onDelete={handleDeleteCloth}
        wearLogs={wearLogs}
      />

      <LogWearModal
        cloth={wearCloth}
        isOpen={!!wearCloth}
        onClose={() => setWearCloth(null)}
        onConfirmWear={handleConfirmWear}
      />
    </AmbientBackground>
  );
}

export default App;
