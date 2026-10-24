import React, { useState } from 'react';
import { WardrobeStorage } from '../../services/storage/wardrobeStorage';
import { testGeminiConnection } from '../../services/gemini/geminiWebService';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import {
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RotateCcw,
  Cpu,
} from 'lucide-react';

interface SettingsViewProps {
  onDataReset: () => void;
  onDataImported: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onDataReset, onDataImported }) => {
  const [apiKey, setApiKey] = useState(() => WardrobeStorage.getApiKey());
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(() => WardrobeStorage.getModel());
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveApiKey = () => {
    WardrobeStorage.saveApiKey(apiKey);
    WardrobeStorage.saveModel(model);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleClearApiKey = () => {
    WardrobeStorage.clearApiKey();
    setApiKey('');
    setTestResult(null);
    setSaveMessage('API key cleared. System reverted to client simulation mode.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const res = await testGeminiConnection(apiKey, model);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleExportData = () => {
    const dataStr = WardrobeStorage.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outfit-wardrobe-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          const success = WardrobeStorage.importData(content);
          if (success) {
            alert('Wardrobe data successfully restored!');
            onDataImported();
          } else {
            alert('Failed to parse backup file. Please ensure it is valid OutFit JSON data.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetData = () => {
    if (
      confirm(
        'Are you sure you want to restore the default capsule wardrobe? This will reset all clothes and wear logs to default.'
      )
    ) {
      onDataReset();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure Google Gemini AI API credentials, export your wardrobe data, and manage persistence
        </p>
      </div>

      {/* Gemini AI Configuration */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
              <p className="text-xs text-slate-400">
                Enables real-time scientific multimodal vision analysis
              </p>
            </div>
          </div>
          <GlassBadge variant={apiKey ? 'emerald' : 'slate'} dot>
            {apiKey ? 'API Key Active' : 'Simulation Mode'}
          </GlassBadge>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Keys are stored locally in your browser's private storage (`localStorage`) and never transmitted to any third-party servers.
          </p>
        </div>

        {/* Model Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Gemini Multimodal Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-violet-500"
          >
            <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Stylist Model)</option>
            <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Stable)</option>
            <option value="gemini-2.0-flash">gemini-2.0-flash</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <GlassButton
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveApiKey}
          >
            Save Settings
          </GlassButton>

          <GlassButton
            type="button"
            variant="secondary"
            size="sm"
            loading={isTesting}
            onClick={handleTestKey}
          >
            Test Connection
          </GlassButton>

          {apiKey && (
            <GlassButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearApiKey}
            >
              Clear Key
            </GlassButton>
          )}
        </div>

        {/* Save or Test Notifications */}
        {saveMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}
          >
            {testResult.success ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Data Backup & Restore */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Data Backup & Export</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Export your wardrobe, wear logs, and color analysis to JSON or restore from a backup
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <GlassButton
            type="button"
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportData}
          >
            Export Wardrobe JSON
          </GlassButton>

          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <GlassButton
            type="button"
            variant="danger"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleResetData}
          >
            Reset to Starter Capsule
          </GlassButton>
        </div>
      </div>

      {/* System Specifications */}
      <div className="p-6 rounded-3xl glass-panel space-y-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Cpu className="w-4 h-4 text-violet-400" />
          <span>System & Architecture Specifications</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <span className="text-slate-500 block">Frontend Stack</span>
            <span className="text-slate-300 font-mono">React 19 + TypeScript + Vite + Tailwind CSS</span>
          </div>
          <div>
            <span className="text-slate-500 block">AI Vision Engine</span>
            <span className="text-slate-300 font-mono">Google GenAI SDK (@google/genai)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Persistence</span>
            <span className="text-slate-300 font-mono">Local-First Reactive Browser Storage</span>
          </div>
          <div>
            <span className="text-slate-500 block">Color Match Algorithm</span>
            <span className="text-slate-300 font-mono">Euclidean RGB Distance Vector Math</span>
          </div>
        </div>
      </div>
    </div>
  );
};
