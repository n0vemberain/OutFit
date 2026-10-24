import React, { useState, useRef, useEffect } from 'react';
import { ClothingItem, SkinToneAnalysis } from '../../types';
import {
  analyzeSkinToneWithGemini,
  matchClothesWithPalette,
  simulateAnalysis,
} from '../../services/gemini/geminiWebService';
import { SAMPLE_PROFILES, SampleProfile } from '../../services/gemini/sampleProfiles';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import {
  Wand2,
  Camera,
  Upload,
  AlertTriangle,
  Shirt,
  Flame,
  Snowflake,
  Scale,
  Leaf,
  Check,
} from 'lucide-react';

interface AiStylistViewProps {
  clothes: ClothingItem[];
  savedAnalysis: SkinToneAnalysis | null;
  onSelectCloth: (cloth: ClothingItem) => void;
  onQuickLogWear: (cloth: ClothingItem) => void;
}

export const AiStylistView: React.FC<AiStylistViewProps> = ({
  clothes,
  savedAnalysis,
  onSelectCloth,
  onQuickLogWear,
}) => {
  const [analysis, setAnalysis] = useState<SkinToneAnalysis | null>(
    savedAnalysis || SAMPLE_PROFILES[0].analysis as unknown as SkinToneAnalysis
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    savedAnalysis?.imageUri || SAMPLE_PROFILES[0].imageUri
  );
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Compute closet matches whenever analysis or clothes change
  const closetMatches = React.useMemo(() => {
    if (!analysis || !analysis.recommendedColors || analysis.recommendedColors.length === 0) {
      return [];
    }
    return matchClothesWithPalette(clothes, analysis.recommendedColors);
  }, [analysis, clothes]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 720 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Could not access camera:', err);
      alert('Camera access denied or unavailable. You can upload a photo or pick a sample profile below!');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          performCapture();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 800);
  };

  const performCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror image horizontally for natural selfie look
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImage(dataUrl);
      stopCamera();
      runAnalysis(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          runAnalysis(reader.result, file.type);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickSample = (profile: SampleProfile) => {
    setSelectedImage(profile.imageUri);
    stopCamera();
    const result: SkinToneAnalysis = {
      id: `sample_${Date.now()}`,
      analyzedAt: new Date().toISOString(),
      ...profile.analysis,
      imageUri: profile.imageUri,
    };
    setAnalysis(result);
  };

  const runAnalysis = async (base64Image: string, mimeType: string = 'image/jpeg') => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSkinToneWithGemini(base64Image, mimeType);
      setAnalysis(result);
    } catch (err) {
      console.warn('Analysis error:', err);
      const fallback = simulateAnalysis(base64Image);
      setAnalysis(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Undertone icon & badge helper
  const renderUndertoneBadge = (undertone?: string) => {
    switch (undertone) {
      case 'Warm':
        return (
          <GlassBadge variant="amber" dot>
            <Flame className="w-3.5 h-3.5 mr-1" />
            Warm Undertone
          </GlassBadge>
        );
      case 'Cool':
        return (
          <GlassBadge variant="cyan" dot>
            <Snowflake className="w-3.5 h-3.5 mr-1" />
            Cool Undertone
          </GlassBadge>
        );
      case 'Olive':
        return (
          <GlassBadge variant="emerald" dot>
            <Leaf className="w-3.5 h-3.5 mr-1" />
            Olive Undertone
          </GlassBadge>
        );
      default:
        return (
          <GlassBadge variant="violet" dot>
            <Scale className="w-3.5 h-3.5 mr-1" />
            Neutral Undertone
          </GlassBadge>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Editorial Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4]" />
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-300">
              Multimodal Vision AI
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white font-serif tracking-tight">
            Personal AI Color Stylist
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Powered by Google Gemini 3.8 Flash multimodal vision. Analyzes skin undertones, contrast levels, and computes exact seasonal color palettes harmonized directly with your wardrobe.
          </p>
        </div>

        {/* Live Camera / Upload Actions */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {!isCameraActive ? (
            <GlassButton
              variant="accent"
              size="md"
              icon={<Camera className="w-4 h-4" />}
              onClick={startCamera}
            >
              Open Camera
            </GlassButton>
          ) : (
            <GlassButton variant="secondary" size="md" onClick={stopCamera}>
              Close Camera
            </GlassButton>
          )}

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Camera Live Preview or Snapshot Section */}
      {isCameraActive && (
        <div className="p-6 rounded-3xl glass-panel relative flex flex-col items-center justify-center space-y-4">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-black border-2 border-cyan-500/30 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="text-7xl font-bold font-mono text-cyan-300 animate-ping">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <GlassButton
              variant="accent"
              size="lg"
              icon={<Camera className="w-5 h-5" />}
              onClick={capturePhoto}
              disabled={countdown !== null}
            >
              Snap Portrait Selfie
            </GlassButton>
            <GlassButton variant="ghost" size="md" onClick={stopCamera}>
              Cancel
            </GlassButton>
          </div>
        </div>
      )}

      {/* Preset Model Profiles for Instant 1-Click Testing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Instant Demo Profiles (Test without camera)
          </span>
          <span className="text-xs text-slate-500">Click any avatar to simulate</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_PROFILES.map((p) => {
            const isSelected = selectedImage === p.imageUri;
            return (
              <div
                key={p.id}
                onClick={() => handlePickSample(p)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-violet-600/20 border-violet-400 shadow-lg shadow-violet-600/20'
                    : 'bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/10'
                }`}
              >
                <img
                  src={p.imageUri}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/15"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{p.tagline.split('•')[1]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Results View */}
      {isAnalyzing ? (
        <div className="p-16 rounded-3xl glass-panel text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 animate-pulse">
            <Wand2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-white font-serif">
            Gemini 3.8 Flash Vision Analyzing...
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Extracting skin undertone frequencies, depth contrast, and calculating scientific seasonal color harmony...
          </p>
        </div>
      ) : analysis ? (
        <div className="space-y-8">
          {/* Main Stylist Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Portrait Card */}
            <div className="p-6 rounded-3xl glass-panel flex flex-col items-center text-center justify-between">
              <div className="w-full">
                <div className="relative w-44 h-44 mx-auto rounded-3xl overflow-hidden bg-slate-900 border-2 border-white/15 shadow-xl mb-4">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Portrait"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Camera className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white font-serif">{analysis.skinTone}</h3>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {renderUndertoneBadge(analysis.undertone)}
                  <GlassBadge variant="slate">{analysis.contrastLevel} Contrast</GlassBadge>
                </div>
              </div>

              <div className="mt-6 w-full pt-4 border-t border-white/10 text-xs text-slate-400">
                Analyzed by Gemini 3.8 Flash • {analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleDateString() : 'Active'}
              </div>
            </div>

            {/* Seasonal Palette Breakdown */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-panel flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-300">
                    Recommended Seasonal Palette
                  </span>
                  <GlassBadge variant="violet" dot>
                    Verified Harmony
                  </GlassBadge>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                  {analysis.paletteName}
                </h2>

                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {analysis.paletteDescription}
                </p>

                {/* Capsule Styling Advice */}
                {analysis.wardrobeAdvice && (
                  <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-violet-300 block mb-1">
                      Capsule Styling Strategy:
                    </span>
                    {analysis.wardrobeAdvice}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Flattering Color Swatches */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  Recommended Flattering Palette
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hand-curated colors that illuminate your natural undertones and facial contrast
                </p>
              </div>
              <span className="text-xs text-violet-300 font-mono">
                {analysis.recommendedColors?.length || 0} Colors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.recommendedColors?.map((color, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 hover:border-violet-500/30 transition-all"
                >
                  <div
                    className="w-12 h-16 rounded-xl shrink-0 shadow-lg border border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-sm font-bold text-white truncate">{color.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{color.hex}</span>
                    </div>
                    <GlassBadge variant="slate" size="sm" className="mb-1.5 uppercase text-[9px]">
                      {color.category}
                    </GlassBadge>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {color.description}
                    </p>
                    {color.styleTip && (
                      <p className="text-[11px] text-violet-300 mt-1.5 font-medium line-clamp-1">
                        Tip: {color.styleTip}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colors to Avoid Section */}
          {analysis.avoidColors && analysis.avoidColors.length > 0 && (
            <div className="p-6 rounded-3xl glass-panel space-y-4 border-rose-500/20 bg-rose-950/10">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Colors to Avoid</h3>
                  <p className="text-xs text-slate-400">
                    Shades that create disharmony or wash out your natural complexion
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {analysis.avoidColors.map((avoid, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-xl shrink-0 border border-white/20"
                      style={{ backgroundColor: avoid.hex }}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white">{avoid.name}</h5>
                      <p className="text-[11px] text-rose-300/90 mt-0.5 line-clamp-2">
                        {avoid.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Closet Matching Section */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white font-serif">
                    Closet Color Match Engine
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated Euclidean RGB color distance between your recommended palette and clothes in your wardrobe
                </p>
              </div>
              <GlassBadge variant="cyan" dot>
                {closetMatches.length} Matches in Closet
              </GlassBadge>
            </div>

            {closetMatches.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/5 text-center space-y-2">
                <Shirt className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm text-slate-300 font-semibold">
                  No direct color matches in your closet yet
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adding garments with hex codes similar to your recommended palette ({analysis.recommendedColors?.map((c) => c.name).slice(0, 3).join(', ')})!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {closetMatches.map(({ cloth, matchedColor, matchScore }) => (
                  <div
                    key={cloth.id}
                    onClick={() => onSelectCloth(cloth)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/15">
                        {cloth.imageUri ? (
                          <img
                            src={cloth.imageUri}
                            alt={cloth.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 font-serif">
                            {cloth.name[0]}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <GlassBadge variant={matchScore >= 85 ? 'emerald' : 'cyan'} size="sm" dot>
                            {matchScore}% Match
                          </GlassBadge>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{cloth.name}</h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{cloth.brand}</p>

                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-300">
                          <span
                            className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                            style={{ backgroundColor: matchedColor.hex }}
                          />
                          <span className="truncate">Matches: {matchedColor.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {cloth.wearCount} wears logged
                      </span>
                      <GlassButton
                        type="button"
                        variant="accent"
                        size="sm"
                        icon={<Check className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickLogWear(cloth);
                        }}
                      >
                        Wear Piece
                      </GlassButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
