import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shirt,
  Info,
  RefreshCw,
  Palette,
} from 'lucide-react-native';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassBadge } from '../components/glass/GlassBadge';
import {
  analyzeSkinToneWithGemini,
  matchClothesWithPalette,
} from '../services/gemini/geminiService';
import { SAMPLE_PROFILES, SampleProfile } from '../services/gemini/sampleProfiles';
import {
  getAllClothes,
  saveSkinToneAnalysis,
  getLatestSkinToneAnalysis,
} from '../services/database/clothesRepository';
import { ClothingItem, SkinToneAnalysis, RecommendedColor } from '../services/database/types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export const AiStylistScreen: React.FC = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkinToneAnalysis | null>(null);
  const [allClothes, setAllClothes] = useState<ClothingItem[]>([]);
  const [matchedClothes, setMatchedClothes] = useState<
    { cloth: ClothingItem; matchedColor: RecommendedColor; matchScore: number }[]
  >([]);
  const [selectedColorDetail, setSelectedColorDetail] = useState<RecommendedColor | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const clothes = await getAllClothes();
      setAllClothes(clothes);

      const savedAnalysis = await getLatestSkinToneAnalysis();
      if (savedAnalysis) {
        setAnalysis(savedAnalysis);
        if (savedAnalysis.imageUri) {
          setSelectedImageUri(savedAnalysis.imageUri);
        }
        const matches = matchClothesWithPalette(clothes, savedAnalysis.recommendedColors);
        setMatchedClothes(matches);
      }
    } catch (e) {
      console.warn('Error loading initial AI stylist data:', e);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera roll access is needed to select a portrait.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImageUri(asset.uri);
        if (asset.base64) {
          runAnalysis(asset.base64, asset.uri);
        } else {
          // Read via FileSystem if base64 wasn't returned
          const base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          runAnalysis(base64, asset.uri);
        }
      }
    } catch (e) {
      console.error('Failed to pick image:', e);
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera access is needed to take a portrait selfie.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImageUri(asset.uri);
        if (asset.base64) {
          runAnalysis(asset.base64, asset.uri);
        } else {
          const base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          runAnalysis(base64, asset.uri);
        }
      }
    } catch (e) {
      console.error('Failed to take photo:', e);
      Alert.alert('Error', 'Camera unavailable.');
    }
  };

  const handleSelectSample = (sample: SampleProfile) => {
    setSelectedImageUri(sample.imageUri);
    const mockAnalysis: SkinToneAnalysis = {
      id: `sample_${sample.id}`,
      analyzedAt: new Date().toISOString(),
      ...sample.analysis,
      imageUri: sample.imageUri,
    };
    setAnalysis(mockAnalysis);
    saveSkinToneAnalysis(mockAnalysis);
    const matches = matchClothesWithPalette(allClothes, mockAnalysis.recommendedColors);
    setMatchedClothes(matches);
  };

  const runAnalysis = async (base64: string, uri: string) => {
    try {
      setIsAnalyzing(true);
      const result = await analyzeSkinToneWithGemini(base64, 'image/jpeg');
      result.imageUri = uri;
      setAnalysis(result);
      await saveSkinToneAnalysis(result);

      // Match with current user clothes in SQLite
      const matches = matchClothesWithPalette(allClothes, result.recommendedColors);
      setMatchedClothes(matches);
    } catch (err) {
      console.error('Analysis failed:', err);
      Alert.alert('Analysis Failed', 'Could not process the photo with Gemini API.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUndertoneColor = (undertone?: string) => {
    switch (undertone?.toLowerCase()) {
      case 'warm':
        return Colors.accents.amber;
      case 'cool':
        return Colors.accents.cyan;
      case 'olive':
        return Colors.accents.emerald;
      case 'neutral':
      default:
        return Colors.accents.violet;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <GlassBadge
              label="Gemini 3.8 Flash Vision"
              color={Colors.accents.violet}
              size="sm"
              variant="glow"
            />
          </View>
          <Text style={[Typography.h1, styles.title]}>AI Color Stylist</Text>
          <Text style={styles.subtitle}>
            Analyze your skin tone & undertones to discover your seasonal palette and best wardrobe colors.
          </Text>
        </View>

        {/* Portrait Input Card */}
        <GlassCard variant="elevated" borderRadius={24} style={styles.inputCard}>
          <View style={styles.previewContainer}>
            {selectedImageUri ? (
              <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.emptyPreview}>
                <Palette size={44} color={Colors.accents.violet} />
                <Text style={styles.emptyPreviewText}>Take or select a portrait photo</Text>
                <Text style={styles.emptyPreviewSub}>Well-lit natural daylight works best</Text>
              </View>
            )}

            {isAnalyzing && (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator size="large" color={Colors.accents.violet} />
                <Text style={styles.analyzingText}>Gemini is analyzing undertones...</Text>
              </View>
            )}
          </View>

          {/* Action Buttons: Camera & Gallery */}
          <View style={styles.inputButtonsRow}>
            <GlassButton
              title="Camera"
              onPress={handleTakePhoto}
              icon={<Camera size={16} color="#FFFFFF" />}
              variant="secondary"
              style={{ flex: 1, marginRight: 6 }}
              disabled={isAnalyzing}
            />
            <GlassButton
              title="Gallery"
              onPress={handlePickFromGallery}
              icon={<ImageIcon size={16} color="#FFFFFF" />}
              variant="secondary"
              style={{ flex: 1, marginLeft: 6 }}
              disabled={isAnalyzing}
            />
          </View>

          {/* Quick Demo Profiles */}
          <View style={styles.sampleSection}>
            <Text style={styles.sampleLabel}>Or test instant demo profiles:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.samplesRow}>
              {SAMPLE_PROFILES.map((sample) => (
                <TouchableOpacity
                  key={sample.id}
                  onPress={() => handleSelectSample(sample)}
                  style={styles.sampleItem}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: sample.imageUri }} style={styles.sampleAvatar} />
                  <Text style={styles.sampleName} numberOfLines={1}>
                    {sample.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </GlassCard>

        {/* Analysis Results View */}
        {analysis && (
          <View style={styles.resultsContainer}>
            {/* Skin Tone & Palette Hero Card */}
            <GlassCard variant="accent" borderRadius={24} style={styles.analysisHero}>
              <View style={styles.paletteHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.skinToneLabel}>DETECTED COMPLEXION</Text>
                  <Text style={[Typography.h2, styles.skinToneValue]}>{analysis.skinTone}</Text>
                </View>
                <GlassBadge
                  label={analysis.paletteName.toUpperCase()}
                  color={Colors.accents.violet}
                  variant="glow"
                />
              </View>

              <View style={styles.tonePillsRow}>
                <GlassBadge
                  label={`Undertone: ${analysis.undertone}`}
                  color={getUndertoneColor(analysis.undertone)}
                  size="sm"
                />
                <GlassBadge
                  label={`Contrast: ${analysis.contrastLevel}`}
                  color={Colors.accents.cyan}
                  size="sm"
                />
              </View>

              <Text style={styles.paletteDesc}>{analysis.paletteDescription}</Text>
            </GlassCard>

            {/* Recommended Colors Section */}
            <View style={styles.sectionHeaderWrapper}>
              <View style={styles.sectionTitleRow}>
                <Sparkles size={18} color={Colors.accents.emerald} />
                <Text style={[Typography.h3, styles.sectionTitle]}>Recommended Colors</Text>
              </View>
              <Text style={styles.sectionSub}>Tap any swatch to view styling rationale</Text>
            </View>

            <View style={styles.swatchesRow}>
              {analysis.recommendedColors.map((color, idx) => {
                const isSelected = selectedColorDetail?.name === color.name;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedColorDetail(isSelected ? null : color)}
                    style={styles.swatchCard}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color.hex },
                        isSelected && styles.colorCircleSelected,
                      ]}
                    />
                    <Text style={styles.colorName} numberOfLines={1}>
                      {color.name}
                    </Text>
                    <Text style={styles.colorCategory}>{color.category}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Color Detail Box */}
            {selectedColorDetail && (
              <GlassCard variant="subtle" borderRadius={18} style={styles.selectedDetailCard}>
                <View style={styles.selectedDetailHeader}>
                  <View style={[styles.miniDot, { backgroundColor: selectedColorDetail.hex }]} />
                  <Text style={styles.selectedDetailName}>{selectedColorDetail.name}</Text>
                  <Text style={styles.selectedDetailHex}>{selectedColorDetail.hex}</Text>
                </View>
                <Text style={styles.selectedDetailDesc}>{selectedColorDetail.description}</Text>
                <View style={styles.styleTipBox}>
                  <Text style={styles.styleTipLabel}>Stylist Tip:</Text>
                  <Text style={styles.styleTipText}>{selectedColorDetail.styleTip}</Text>
                </View>
              </GlassCard>
            )}

            {/* Colors to Avoid */}
            {analysis.avoidColors && analysis.avoidColors.length > 0 && (
              <View style={styles.avoidSection}>
                <View style={styles.sectionTitleRow}>
                  <AlertCircle size={18} color={Colors.status.danger} />
                  <Text style={[Typography.h3, styles.sectionTitle]}>Colors to Avoid</Text>
                </View>

                {analysis.avoidColors.map((avoid, index) => (
                  <GlassCard
                    key={index}
                    variant="subtle"
                    borderRadius={16}
                    style={styles.avoidCard}
                  >
                    <View style={styles.avoidRow}>
                      <View style={[styles.avoidDot, { backgroundColor: avoid.hex }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.avoidName}>{avoid.name}</Text>
                        <Text style={styles.avoidReason}>{avoid.reason}</Text>
                      </View>
                    </View>
                  </GlassCard>
                ))}
              </View>
            )}

            {/* Wardrobe Advice */}
            {analysis.wardrobeAdvice && (
              <GlassCard variant="default" borderRadius={20} style={styles.adviceCard}>
                <View style={styles.adviceHeaderRow}>
                  <Info size={18} color={Colors.accents.violet} />
                  <Text style={[Typography.h3, styles.adviceTitle]}>Capsule Wardrobe Strategy</Text>
                </View>
                <Text style={styles.adviceText}>{analysis.wardrobeAdvice}</Text>
              </GlassCard>
            )}

            {/* Match with My Closet in Local SQLite */}
            <View style={styles.closetMatchSection}>
              <View style={styles.sectionTitleRow}>
                <Shirt size={20} color={Colors.accents.cyan} />
                <Text style={[Typography.h3, styles.sectionTitle]}>
                  Matches in Your Closet ({matchedClothes.length})
                </Text>
              </View>
              <Text style={styles.sectionSub}>
                Clothes from your local database that match this skin tone palette
              </Text>

              {matchedClothes.length === 0 ? (
                <GlassCard variant="subtle" borderRadius={18} style={styles.noMatchesCard}>
                  <Text style={styles.noMatchesText}>
                    No items in your wardrobe match this palette yet. Try adding pieces in your recommended colors!
                  </Text>
                </GlassCard>
              ) : (
                matchedClothes.map(({ cloth, matchedColor, matchScore }) => (
                  <GlassCard
                    key={cloth.id}
                    variant="default"
                    borderRadius={18}
                    style={styles.matchCard}
                  >
                    <View style={styles.matchCardContent}>
                      <View style={[styles.matchDot, { backgroundColor: cloth.hexCode }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.matchClothName}>{cloth.name}</Text>
                        <Text style={styles.matchSub}>
                          {cloth.colorName} • {cloth.category.toUpperCase()}
                        </Text>
                        <Text style={styles.matchComplement}>
                          Pairs with recommended {matchedColor.name}
                        </Text>
                      </View>
                      <View style={styles.matchScoreBadge}>
                        <Text style={styles.matchScoreText}>{matchScore}%</Text>
                        <Text style={styles.matchScoreLabel}>Match</Text>
                      </View>
                    </View>
                  </GlassCard>
                ))
              )}
            </View>
          </View>
        )}
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
  inputCard: {
    padding: 16,
    marginBottom: 20,
  },
  previewContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  emptyPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyPreviewText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  emptyPreviewSub: {
    color: Colors.text.muted,
    fontSize: 12,
    marginTop: 4,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  inputButtonsRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  sampleSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
  },
  sampleLabel: {
    fontSize: 12,
    color: Colors.text.muted,
    marginBottom: 8,
  },
  samplesRow: {
    gap: 12,
  },
  sampleItem: {
    alignItems: 'center',
    width: 72,
  },
  sampleAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 4,
  },
  sampleName: {
    color: Colors.text.secondary,
    fontSize: 11,
    textAlign: 'center',
  },
  resultsContainer: {
    gap: 18,
  },
  analysisHero: {
    padding: 20,
  },
  paletteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  skinToneLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    color: Colors.text.muted,
    fontWeight: '700',
  },
  skinToneValue: {
    fontSize: 22,
    marginTop: 2,
  },
  tonePillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  paletteDesc: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 19,
  },
  sectionHeaderWrapper: {
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSub: {
    color: Colors.text.muted,
    fontSize: 12,
  },
  swatchesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatchCard: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 6,
  },
  colorCircleSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  colorName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  colorCategory: {
    color: Colors.text.muted,
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  selectedDetailCard: {
    padding: 14,
  },
  selectedDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  miniDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  selectedDetailName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  selectedDetailHex: {
    color: Colors.text.muted,
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  selectedDetailDesc: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  styleTipBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    padding: 10,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accents.violet,
  },
  styleTipLabel: {
    color: '#C4B5FD',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  styleTipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  avoidSection: {
    marginTop: 6,
    gap: 10,
  },
  avoidCard: {
    padding: 12,
  },
  avoidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avoidDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avoidName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  avoidReason: {
    color: Colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  adviceCard: {
    padding: 16,
  },
  adviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  adviceText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 19,
  },
  closetMatchSection: {
    marginTop: 8,
    gap: 10,
  },
  noMatchesCard: {
    padding: 20,
    alignItems: 'center',
  },
  noMatchesText: {
    color: Colors.text.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  matchCard: {
    padding: 12,
  },
  matchCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  matchDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  matchClothName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  matchSub: {
    color: Colors.text.secondary,
    fontSize: 11,
    marginTop: 1,
  },
  matchComplement: {
    color: Colors.accents.cyan,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  matchScoreBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  matchScoreText: {
    color: '#22D3EE',
    fontSize: 13,
    fontWeight: '700',
  },
  matchScoreLabel: {
    color: '#A5F3FC',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
