import React from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  Building,
  Sparkles,
  ArrowRight,
  BookOpen,
  Sliders,
  FileSpreadsheet,
  HelpCircle,
  Trash2,
  Settings,
  Layers,
  Edit3,
} from 'lucide-react';
import { Property, VaastuAnalysisReport, Finding } from '../../types';
import { ScoreMeter } from './ScoreMeter';
import { CLASSICAL_SOURCES_REGISTRY } from '../../data/sources';

interface DashboardViewProps {
  property: Property;
  report: VaastuAnalysisReport;
  onNavigateTab: (tab: string) => void;
  onOpenCompassCalibration: () => void;
  onSelectFinding: (finding: Finding) => void;
  onRequestDeleteProperty?: (property: Property) => void;
  onOpenManageProperties?: () => void;
  onEditProperty?: (property: Property) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  property,
  report,
  onNavigateTab,
  onOpenCompassCalibration,
  onSelectFinding,
  onRequestDeleteProperty,
  onOpenManageProperties,
  onEditProperty,
}) => {
  const featuredQuote = CLASSICAL_SOURCES_REGISTRY[0]; // Mayamata

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'CLASSICAL_SOURCE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'TRADITIONAL_INTERPRETATION':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PERSONALIZED_JYOTISH':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Property Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-900 to-stone-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Architectural Vaastu Audit
            </span>
            <span className="text-xs text-stone-300">•</span>
            <span className="text-xs text-stone-300">{property.city}, {property.country}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            {property.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
            {property.propertyType} • Facing {property.facingDirection} ({property.northRotation}° North calibrated) • {(property.rooms?.length || 0)} architectural spaces mapped.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onNavigateTab('blueprint')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Blueprint Canvas</span>
          </button>

          {onEditProperty && (
            <button
              type="button"
              onClick={() => onEditProperty(property)}
              title="Edit property details"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Edit Details</span>
            </button>
          )}

          {onOpenManageProperties && (
            <button
              type="button"
              onClick={onOpenManageProperties}
              title="Manage all properties"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-stone-300" />
              <span>Manage Properties</span>
            </button>
          )}

          {onRequestDeleteProperty && (
            <button
              type="button"
              onClick={() => onRequestDeleteProperty(property)}
              title={`Delete ${property.name}`}
              className="px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-rose-400/50 shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Property</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score & Elemental Meter */}
      <ScoreMeter
        report={report}
        property={property}
        onOpenCompassCalibration={onOpenCompassCalibration}
      />

      {/* Two Column Grid: 9-Category Score Breakdown + Priority Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 9-Category Weighted Score Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif">
                Transparent 9-Category Score Breakdown
              </h2>
              <p className="text-xs text-stone-500">
                Mathematical evaluation based on classical orientation, functional zoning, and physical massing.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Total {report.overallScore}/100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {report.categoryScores.map((cat, idx) => {
              const pct = Math.round((cat.earnedPoints / cat.totalPoints) * 100);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/70 hover:bg-stone-50 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                    <span className="truncate">{cat.category}</span>
                    <span className="text-amber-800 font-mono font-bold">
                      {cat.earnedPoints}/{cat.totalPoints} pts
                    </span>
                  </div>

                  <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct >= 85 ? 'bg-emerald-600' : pct >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-stone-500 line-clamp-1">{cat.notes}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-400">
            <span>Formula: Direction 20 + Entrance 15 + Rooms 20 + Brahmasthan 10 + Elements 10 + Water 10 + Stairs 5 + Plot 5 + External 5 = 100</span>
            <button
              onClick={() => onNavigateTab('report')}
              className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
            >
              Full Audit Table →
            </button>
          </div>
        </div>

        {/* Right 1 Col: Quick Action Hub & Classical Source Shloka */}
        <div className="space-y-6">
          {/* Quick Hub */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900 font-serif">Quick Intelligence Tools</h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('blueprint')}
                className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-800">2D Blueprint Canvas</div>
                    <div className="text-[11px] text-stone-400">View zones, mandala, & room centroids</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigateTab('simulator')}
                className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-800">Before/After AI Simulator</div>
                    <div className="text-[11px] text-stone-400">Test room moves with live score changes</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigateTab('coach')}
                className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-800">AI Vaastu Coach</div>
                    <div className="text-[11px] text-stone-400">Chat with contextual Gemini guidance</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {onOpenManageProperties && (
                <button
                  type="button"
                  onClick={onOpenManageProperties}
                  className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-800">Manage Properties</div>
                      <div className="text-[11px] text-stone-400">Add, edit, switch, or delete blueprints</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
                </button>
              )}
            </div>
          </div>

          {/* Classical Treatise Excerpt Card */}
          <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Classical Treatise Shloka
              </span>
              <span className="text-xs text-stone-400 font-serif">मयमतम्</span>
            </div>

            <div className="space-y-1.5">
              <div className="font-serif text-sm font-semibold text-amber-200 tracking-wide">
                {featuredQuote.sanskritOriginal}
              </div>
              <div className="text-xs text-stone-400 italic">
                {featuredQuote.iastTransliteration}
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed pt-1 border-t border-stone-800">
              "{featuredQuote.englishTranslation}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-amber-400/90 pt-1 font-medium">
              <span>{featuredQuote.name} • {featuredQuote.chapter}</span>
              <button
                onClick={() => onNavigateTab('knowledge')}
                className="hover:underline flex items-center gap-1"
              >
                Explore Registry →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Findings & Recommendations Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-serif">
              Key Architectural Findings & Action Plan
            </h2>
            <p className="text-xs text-stone-500">
              Clear distinctions between classical citations, layout inferences, and non-structural practical remedies.
            </p>
          </div>
          <span className="text-xs text-stone-400">{report.findings.length} findings recorded</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.findings.slice(0, 6).map((finding) => {
            const isPositive = finding.severity === 'EXCELLENT' || finding.severity === 'FAVORABLE';
            return (
              <div
                key={finding.id}
                onClick={() => onSelectFinding(finding)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-xs ${
                  isPositive
                    ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60'
                    : 'border-amber-200 bg-amber-50/30 hover:bg-amber-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    )}
                    <h4 className="text-xs font-bold text-stone-900 truncate max-w-[220px]">
                      {finding.title}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(
                      finding.badge
                    )}`}
                  >
                    {finding.directionZone}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                  {finding.description}
                </p>

                {finding.recommendations?.level2Interior && (
                  <div className="text-[11px] text-stone-700 bg-white/80 p-2 rounded-lg border border-stone-200/80 space-y-0.5">
                    <span className="font-semibold text-stone-800">Action:</span>{' '}
                    <span>{finding.recommendations.level2Interior}</span>
                  </div>
                )}

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-stone-400">
                  <span>Source: {finding.sourceText || 'Traditional Sthapatya'}</span>
                  <span className="text-amber-700 font-semibold hover:underline">
                    View Details & Remedies →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
