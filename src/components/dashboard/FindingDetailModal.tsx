import React from 'react';
import { X, CheckCircle2, AlertTriangle, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { Finding } from '../../types';

interface FindingDetailModalProps {
  finding: Finding | null;
  onClose: () => void;
}

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({ finding, onClose }) => {
  if (!finding) return null;

  const isPositive = finding.severity === 'EXCELLENT' || finding.severity === 'FAVORABLE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">{finding.title}</h3>
              <div className="text-xs text-stone-400">Directional Zone: {finding.directionZone}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Badge & Source */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {finding.badge.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-stone-500 font-serif">
              Canonical Text: <strong>{finding.sourceText || 'Traditional Sthapatya Veda'}</strong>
            </span>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
            {finding.description}
          </div>

          {/* Tiered Remedies Architecture */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Three-Tiered Action Hierarchy
            </div>

            {(finding.recommendations?.level1Architectural || (finding.recommendations as any)?.level1Structural) && (
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
                <span className="font-bold text-rose-900">
                  Level 1 — Structural / Layout Alternative (For New Construction / Renovations):
                </span>
                <p className="text-stone-700">
                  {finding.recommendations?.level1Architectural || (finding.recommendations as any)?.level1Structural}
                </p>
              </div>
            )}

            {finding.recommendations?.level2Interior && (
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1">
                <span className="font-bold text-blue-900">
                  Level 2 — Interior Realignment (Furnishings & Spatial Orientation):
                </span>
                <p className="text-stone-700">{finding.recommendations.level2Interior}</p>
              </div>
            )}

            {(finding.recommendations?.level3NonStructural || (finding.recommendations as any)?.level3Remedy) && (
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-900">
                  Level 3 — Non-Structural Harmonizers (Lighting, Elemental Accents, Natural Salt):
                </span>
                <p className="text-stone-700">
                  {finding.recommendations?.level3NonStructural || (finding.recommendations as any)?.level3Remedy}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 flex items-center justify-end bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
