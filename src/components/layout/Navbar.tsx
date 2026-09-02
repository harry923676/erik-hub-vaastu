import React from 'react';
import {
  Compass,
  LayoutGrid,
  Sparkles,
  BookOpen,
  Sliders,
  FileText,
  User,
  PlusCircle,
  Building2,
  ChevronDown,
  Printer,
  Moon,
  Sun,
  ShieldCheck,
  Trash2,
  RotateCcw,
  Settings,
  Layers,
} from 'lucide-react';
import { Property, ThemeMode, UserRole } from '../../types';

interface NavbarProps {
  currentTab?: string;
  activeTab?: string;
  setCurrentTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  properties: Property[];
  activeProperty: Property;
  setActivePropertyId?: (id: string) => void;
  onSelectProperty?: (id: string) => void;
  onOpenNewPropertyModal?: () => void;
  onOpenNewProperty?: () => void;
  onOpenManageProperties?: () => void;
  onRequestDeleteProperty?: (property: Property) => void;
  onRestoreSampleProperties?: () => void;
  overallScore?: number;
  theme?: ThemeMode;
  setTheme?: (theme: ThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  activeTab,
  setCurrentTab,
  onSelectTab,
  properties,
  activeProperty,
  setActivePropertyId,
  onSelectProperty,
  onOpenNewPropertyModal,
  onOpenNewProperty,
  onOpenManageProperties,
  onRequestDeleteProperty,
  onRestoreSampleProperties,
  overallScore = 85,
  theme = 'CELESTIAL_IVORY',
  setTheme,
}) => {
  const [propertyDropdownOpen, setPropertyDropdownOpen] = React.useState(false);
  const [internalTheme, setInternalTheme] = React.useState<ThemeMode>(theme);

  const activeTabId = currentTab || activeTab || 'dashboard';

  const handleSelectTab = (tab: string) => {
    if (setCurrentTab) setCurrentTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  const handleSelectProperty = (id: string) => {
    if (setActivePropertyId) setActivePropertyId(id);
    if (onSelectProperty) onSelectProperty(id);
    setPropertyDropdownOpen(false);
  };

  const handleOpenNewProperty = () => {
    setPropertyDropdownOpen(false);
    if (onOpenNewPropertyModal) onOpenNewPropertyModal();
    if (onOpenNewProperty) onOpenNewProperty();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'blueprint', label: 'Floor Plan Analyzer', icon: Compass },
    { id: 'simulator', label: 'AI Simulator', icon: Sliders },
    { id: 'coach', label: 'AI Vaastu Coach', icon: Sparkles },
    { id: 'knowledge', label: 'Knowledge Registry', icon: BookOpen },
    { id: 'jyotish', label: 'Jyotish Profile', icon: User },
    { id: 'report', label: 'Audit Report', icon: FileText },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-stone-50/95 backdrop-blur shadow-xs">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 sm:h-16 sm:flex-nowrap sm:py-0">
          {/* Brand Identity */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 font-serif text-xl font-bold tracking-wider text-white shadow-sm">
              🏛️
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="truncate font-serif text-base font-bold tracking-tight text-stone-900 sm:text-lg">
                  ERIK-HUB Vaastu
                </span>
                <span className="shrink-0 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-900 sm:text-[11px]">
                  AI Coach
                </span>
              </div>
              <p className="truncate text-[11px] font-medium text-stone-500 sm:text-xs">
                Architectural Intelligence • <span className="text-amber-700 font-semibold">Pawan Paji</span>
              </p>
            </div>
          </div>

          {/* Center Property Switcher */}
          <div className="relative order-3 w-full sm:order-none sm:w-auto">
            <button
              onClick={() => setPropertyDropdownOpen(!propertyDropdownOpen)}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-left text-sm font-medium text-stone-800 shadow-2xs transition-colors hover:border-amber-500 sm:w-auto"
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span className="max-w-[140px] sm:max-w-[200px] truncate">{activeProperty.name}</span>
              <span className="text-xs text-stone-400">({activeProperty.propertyType})</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {propertyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setPropertyDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1 w-80 rounded-xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between border-b border-stone-100 pb-1.5 mb-1">
                    <span>Saved Properties ({properties.length})</span>
                    {onOpenManageProperties && (
                      <button
                        type="button"
                        onClick={() => {
                          setPropertyDropdownOpen(false);
                          onOpenManageProperties();
                        }}
                        className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Settings className="w-3 h-3" />
                        Manage
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-stone-100">
                    {properties.map((prop) => {
                      const isActive = prop.id === activeProperty.id;
                      return (
                        <div
                          key={prop.id}
                          className={`w-full px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors ${
                            isActive ? 'bg-amber-50/90 text-amber-950 font-semibold' : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectProperty(prop.id)}
                            className="flex-1 text-left min-w-0 cursor-pointer group"
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="truncate text-xs sm:text-sm">{prop.name}</div>
                              {isActive && (
                                <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[9px] font-bold">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-400 truncate font-normal">
                              {prop.city} • {prop.propertyType} • {prop.rooms?.length || 0} rooms
                            </div>
                          </button>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {onRequestDeleteProperty && (
                              <button
                                type="button"
                                title={`Delete ${prop.name}`}
                                aria-label={`Delete ${prop.name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPropertyDropdownOpen(false);
                                  onRequestDeleteProperty(prop);
                                }}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-200/80 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-semibold hidden sm:inline">Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-stone-100 my-1"></div>
                  
                  {/* Quick Action Buttons */}
                  <div className="px-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPropertyDropdownOpen(false);
                        handleOpenNewProperty();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Add New Property...</span>
                    </button>

                    {onOpenManageProperties && (
                      <button
                        type="button"
                        onClick={() => {
                          setPropertyDropdownOpen(false);
                          onOpenManageProperties();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-stone-500" />
                        <span>Manage All Properties</span>
                      </button>
                    )}

                    {onRestoreSampleProperties && (
                      <button
                        type="button"
                        onClick={() => {
                          setPropertyDropdownOpen(false);
                          onRestoreSampleProperties();
                        }}
                        className="w-full text-left px-2.5 py-1 text-[11px] text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 text-stone-400" />
                        <span>Restore Default Sample Properties</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Action Widgets */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            {/* Score Pill */}
            <div
              className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold sm:gap-1.5 sm:px-3 sm:text-xs ${getScoreColor(
                overallScore
              )}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Score {overallScore}/100</span>
            </div>

            {/* Print/Export */}
            <button
              onClick={() => handleSelectTab('report')}
              title="View & Export Report"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-700 text-xs font-medium hover:bg-stone-100 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Report</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const themes: ThemeMode[] = [
                  'CELESTIAL_IVORY',
                  'ROYAL_INDIGO',
                  'TEMPLE_STONE',
                  'MIDNIGHT_ARCHITECTURE',
                ];
                const currentTheme = theme || internalTheme;
                const next = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
                setInternalTheme(next);
                if (setTheme) {
                  setTheme(next);
                }
              }}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs flex items-center gap-1"
              title={`Theme: ${theme || internalTheme}`}
            >
              <Sun className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="overflow-hidden border-t border-stone-200/80 bg-white/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex max-w-full space-x-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTabId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
