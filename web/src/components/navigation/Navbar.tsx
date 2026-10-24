import React from 'react';
import { Sparkles, Shirt, Wand2, BarChart3, Settings, Plus, Camera } from 'lucide-react';
import { ActiveTab } from '../../types';
import { GlassButton } from '../glass/GlassButton';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  itemCount: number;
  onOpenAddModal: () => void;
  onOpenAiStylist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  itemCount,
  onOpenAddModal,
  onOpenAiStylist,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'wardrobe', label: 'Wardrobe', icon: <Shirt className="w-4 h-4" /> },
    { id: 'stylist', label: 'AI Stylist', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0F19]/80 border-b border-white/8 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => onTabChange('wardrobe')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-600/30 border border-violet-400/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  Out<span className="text-violet-400">Fit</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                  Web Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Smart Wardrobe & AI Color Stylist
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.id === 'wardrobe' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {itemCount}
                    </span>
                  )}
                  {tab.id === 'stylist' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06B6D4]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <GlassButton
              variant="accent"
              size="sm"
              icon={<Camera className="w-3.5 h-3.5" />}
              onClick={onOpenAiStylist}
              className="hidden sm:inline-flex"
            >
              Analyze Skin
            </GlassButton>

            <GlassButton
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onOpenAddModal}
            >
              <span className="hidden sm:inline">Add Garment</span>
              <span className="sm:hidden">Add</span>
            </GlassButton>
          </div>
        </div>
      </header>

      {/* Floating Bottom Glass Dock on Mobile Viewports */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40 flex justify-center pointer-events-none">
        <div className="glass-dock rounded-2xl p-1.5 flex items-center justify-between w-full max-w-md pointer-events-auto shadow-2xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all ${
                  isActive
                    ? 'bg-violet-600/30 text-violet-200 border border-violet-400/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
