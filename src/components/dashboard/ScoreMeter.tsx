import React from 'react';
import { Compass as CompassIcon, Shield, Flame, Droplets, Mountain, Wind, Sun } from 'lucide-react';
import { VaastuAnalysisReport, Property } from '../../types';

interface ScoreMeterProps {
  report: VaastuAnalysisReport;
  property: Property;
  onOpenCompassCalibration?: () => void;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  report,
  property,
  onOpenCompassCalibration,
}) => {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.overallScore / 100) * circumference;

  const getScoreTheme = (score: number) => {
    if (score >= 85) {
      return {
        color: '#059669', // Emerald
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        label: 'Auspicious Harmony',
        description: 'Exemplary spatial alignment conforming to classical treatise canons.',
      };
    }
    if (score >= 70) {
      return {
        color: '#d97706', // Amber
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        label: 'Favorable Foundation',
        description: 'Sound core architectural layout with targeted non-structural remedy opportunities.',
      };
    }
    return {
      color: '#e11d48', // Rose
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      label: 'Requires Optimization',
      description: 'Key elemental conflicts identified in water or fire sectors.',
    };
  };

  const theme = getScoreTheme(report.overallScore);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row gap-6 items-center">
      {/* Circular Gauge */}
      <div className="relative flex-shrink-0 flex flex-col items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#f5f5f4"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated progress arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={theme.color}
            strokeWidth="12"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-stone-900 tracking-tight font-sans">
            {report.overallScore}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Out of 100
          </span>
          <span
            className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${theme.bg}`}
          >
            {report.alignmentRating}
          </span>
        </div>
      </div>

      {/* Center Details & Description */}
      <div className="flex-1 space-y-3 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              Overall Vaastu Alignment Score
            </h3>
          </div>
          <p className="text-sm text-stone-600 mt-1 leading-relaxed">{theme.description}</p>
        </div>

        {/* Key Counts */}
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="text-xs text-emerald-800 font-medium">Positive Factors</div>
            <div className="text-lg font-bold text-emerald-700">+{report.positiveCount}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-100">
            <div className="text-xs text-amber-800 font-medium">Points to Review</div>
            <div className="text-lg font-bold text-amber-700">{report.reviewCount}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-rose-50/70 border border-rose-100">
            <div className="text-xs text-rose-800 font-medium">High Priority</div>
            <div className="text-lg font-bold text-rose-700">{report.highPriorityCount}</div>
          </div>
        </div>

        {/* Orientation & Compass Calibration Trigger */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <CompassIcon className="w-4 h-4 text-amber-600" />
            <span>Facing: <strong className="text-stone-800">{property.facingDirection}</strong></span>
            <span className="text-stone-300">•</span>
            <span>North: <strong className="text-stone-800">{property.northRotation}°</strong></span>
          </div>
          {onOpenCompassCalibration && (
            <button
              onClick={onOpenCompassCalibration}
              className="text-amber-700 font-medium hover:underline text-xs flex items-center gap-1"
            >
              Calibrate Compass →
            </button>
          )}
        </div>
      </div>

      {/* Pancha Mahabhuta (5 Elements) Bars */}
      <div className="w-full md:w-60 flex-shrink-0 bg-stone-50 rounded-xl border border-stone-200/80 p-3.5 space-y-2.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
          <span>Pancha Mahabhuta</span>
          <span className="text-[10px] text-amber-700 font-medium">5 Elements</span>
        </div>

        {/* Water / Jala */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-600" /> Water (NE)
            </span>
            <span className="font-semibold text-cyan-700">{report.elementalBalance.water}%</span>
          </div>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${report.elementalBalance.water}%` }}
            />
          </div>
        </div>

        {/* Fire / Agni */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" /> Fire (SE)
            </span>
            <span className="font-semibold text-rose-600">{report.elementalBalance.fire}%</span>
          </div>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${report.elementalBalance.fire}%` }}
            />
          </div>
        </div>

        {/* Earth / Prithvi */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1">
              <Mountain className="w-3 h-3 text-amber-700" /> Earth (SW)
            </span>
            <span className="font-semibold text-amber-800">{report.elementalBalance.earth}%</span>
          </div>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 rounded-full transition-all duration-500"
              style={{ width: `${report.elementalBalance.earth}%` }}
            />
          </div>
        </div>

        {/* Air / Vayu */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-sky-600" /> Air (NW)
            </span>
            <span className="font-semibold text-sky-700">{report.elementalBalance.air}%</span>
          </div>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${report.elementalBalance.air}%` }}
            />
          </div>
        </div>

        {/* Space / Akasha */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1">
              <Sun className="w-3 h-3 text-indigo-600" /> Space (Brahmasthan)
            </span>
            <span className="font-semibold text-indigo-700">{report.elementalBalance.space}%</span>
          </div>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${report.elementalBalance.space}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
