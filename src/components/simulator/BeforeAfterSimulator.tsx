import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Property, RoomItem, DirectionZone } from '../../types';
import {
  analyzePropertyVaastu,
  simulateRoomMove,
  getRoomDirectionZone,
} from '../../utils/vaastuEngine';

interface BeforeAfterSimulatorProps {
  property: Property;
  onApplyModifiedRooms: (rooms: RoomItem[]) => void;
}

const ZONE_COORDINATES: Record<DirectionZone, { x: number; y: number }> = {
  N: { x: 440, y: 120 },
  NNE: { x: 580, y: 140 },
  NE: { x: 740, y: 160 },
  ENE: { x: 780, y: 300 },
  E: { x: 780, y: 440 },
  ESE: { x: 780, y: 580 },
  SE: { x: 740, y: 740 },
  SSE: { x: 580, y: 780 },
  S: { x: 440, y: 780 },
  SSW: { x: 300, y: 780 },
  SW: { x: 140, y: 740 },
  WSW: { x: 140, y: 580 },
  W: { x: 140, y: 440 },
  WNW: { x: 140, y: 300 },
  NW: { x: 140, y: 160 },
  NNW: { x: 300, y: 140 },
  BRAHMASTHAN: { x: 440, y: 440 },
};

export const BeforeAfterSimulator: React.FC<BeforeAfterSimulatorProps> = ({
  property,
  onApplyModifiedRooms,
}) => {
  const currentReport = analyzePropertyVaastu(property);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    property.rooms.length > 0 ? property.rooms[0].id : ''
  );
  const [targetZone, setTargetZone] = useState<DirectionZone>('SE');

  const selectedRoom = property.rooms.find((r) => r.id === selectedRoomId);
  const currentZone = selectedRoom
    ? getRoomDirectionZone(selectedRoom, property.northRotation)
    : 'N';

  // Calculate simulated property
  const simulatedRooms = property.rooms.map((r) => {
    if (r.id === selectedRoomId) {
      const coords = ZONE_COORDINATES[targetZone];
      return { ...r, x: coords.x, y: coords.y };
    }
    return r;
  });

  const simulatedProperty: Property = {
    ...property,
    rooms: simulatedRooms,
  };

  const simulatedReport = analyzePropertyVaastu(simulatedProperty);
  const scoreDiff = simulatedReport.overallScore - currentReport.overallScore;

  const handleApply = () => {
    onApplyModifiedRooms(simulatedRooms);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-stone-900 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              AI Before / After Simulation Engine
            </span>
            <span className="text-xs text-stone-300">•</span>
            <span className="text-xs text-stone-300">Live Spatial Optimization</span>
          </div>
          <h1 className="text-2xl font-bold font-serif tracking-tight">
            Remodeling & Layout Optimization Simulator
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
            Test relocating key functional spaces (like Kitchen, Master Bedroom, or Pooja) to ideal canonical quadrants and observe real-time Vaastu score and elemental balance shifts.
          </p>
        </div>

        {scoreDiff > 0 && (
          <button
            onClick={handleApply}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Check className="w-4 h-4" />
            <span>Apply Simulation to Active Plan (+{scoreDiff} pts)</span>
          </button>
        )}
      </div>

      {/* Comparison Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Before Score */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Current Base Score
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1 font-sans">
              {currentReport.overallScore}
              <span className="text-sm font-normal text-stone-400"> / 100</span>
            </div>
            <div className="text-xs text-stone-500 mt-0.5">{currentReport.alignmentRating}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-stone-700 text-lg">
            A
          </div>
        </div>

        {/* Delta Shift Indicator */}
        <div
          className={`rounded-2xl border p-5 shadow-xs flex items-center justify-between transition-colors ${
            scoreDiff > 0
              ? 'bg-emerald-50/80 border-emerald-200'
              : scoreDiff < 0
              ? 'bg-rose-50/80 border-rose-200'
              : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Simulated Delta Shift
            </span>
            <div
              className={`text-3xl font-extrabold mt-1 font-sans flex items-center gap-1.5 ${
                scoreDiff > 0
                  ? 'text-emerald-700'
                  : scoreDiff < 0
                  ? 'text-rose-700'
                  : 'text-stone-700'
              }`}
            >
              {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
              <span className="text-sm font-semibold">Points</span>
            </div>
            <div className="text-xs font-medium text-stone-600 mt-0.5">
              {scoreDiff > 0
                ? 'Substantial harmonic gain'
                : scoreDiff < 0
                ? 'Elemental regression'
                : 'Neutral balance'}
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              scoreDiff > 0
                ? 'bg-emerald-600 text-white'
                : scoreDiff < 0
                ? 'bg-rose-600 text-white'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* After Simulated Score */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Simulated Future Score
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1 font-sans">
              {simulatedReport.overallScore}
              <span className="text-sm font-normal text-stone-400"> / 100</span>
            </div>
            <div className="text-xs text-stone-500 mt-0.5">{simulatedReport.alignmentRating}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-lg">
            B
          </div>
        </div>
      </div>

      {/* Simulator Interactive Control Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Room & Target Zone Selection */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-serif">
              1. Select Room to Relocate
            </h2>
            <p className="text-xs text-stone-500">Choose the architectural space to optimize.</p>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {property.rooms.map((room) => {
              const zone = getRoomDirectionZone(room, property.northRotation);
              const isSelected = room.id === selectedRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 font-bold text-amber-950 shadow-2xs'
                      : 'bg-stone-50/50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate">{room.name}</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-white border border-stone-200 text-stone-700">
                    Current: {zone}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100">
            <h2 className="text-base font-bold text-stone-900 font-serif">
              2. Select Target Directional Quadrant
            </h2>
            <p className="text-xs text-stone-500">Pick the candidate zone for relocation.</p>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {(
              [
                'N',
                'NE',
                'E',
                'SE',
                'S',
                'SW',
                'W',
                'NW',
                'NNE',
                'ENE',
                'ESE',
                'SSE',
                'SSW',
                'WSW',
                'WNW',
                'NNW',
              ] as DirectionZone[]
            ).map((zone) => (
              <button
                key={zone}
                onClick={() => setTargetZone(zone)}
                className={`py-2 rounded-lg border text-center font-mono font-bold transition-all ${
                  targetZone === zone
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs scale-105'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Center / Right: Visual Floor Plan Comparison & Explanation */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-stone-100 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Simulation Analysis
              </span>
              <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                {selectedRoom?.name}: {currentZone} → {targetZone}
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-900 mt-1 font-serif">
              Architectural & Classical Treatise Impact
            </h3>
          </div>

          {/* Explanation Text */}
          <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="font-semibold text-stone-800 text-sm">
                Moving {selectedRoom?.name} from {currentZone} to {targetZone}
              </div>
              <p>
                {selectedRoom?.type === 'KITCHEN' && targetZone === 'SE' && (
                  'Placing the Kitchen in South-East (Agneya) brings the primary culinary fire element into perfect union with morning solar thermal rays as prescribed in Mayamata 26.14. This prevents moisture buildup and thermal imbalance in northern quadrants.'
                )}
                {selectedRoom?.type === 'MASTER_BEDROOM' && targetZone === 'SW' && (
                  'Relocating the Master Bedroom to South-West (Nirriti) fulfills the Samarangana Sutradhara canon for head-of-family stability and thermal mass buffering against evening sun.'
                )}
                {selectedRoom?.type === 'POOJA_ROOM' && targetZone === 'NE' && (
                  'Relocating the Meditation/Puja sanctum to North-East (Ishanya) aligns with pure water and spiritual calm (Manasara 9).'
                )}
                {selectedRoom?.type === 'TOILET' && (targetZone === 'NE' || targetZone === 'BRAHMASTHAN') && (
                  'Warning: Moving toilet drainage into North-East or Brahmasthan causes severe score penalties and elemental conflict.'
                )}
                {!['KITCHEN', 'MASTER_BEDROOM', 'POOJA_ROOM'].includes(selectedRoom?.type || '') && (
                  `Relocating ${selectedRoom?.name} to ${targetZone} yields a score impact of ${scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} points across functional and circulation metrics.`
                )}
              </p>
            </div>

            {/* Elemental Shift Summary */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                <span className="font-semibold text-stone-700">Original Elemental Balance</span>
                <div className="text-[11px] text-stone-500">
                  Fire: {currentReport.elementalBalance.fire}% • Water: {currentReport.elementalBalance.water}% • Earth: {currentReport.elementalBalance.earth}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="font-semibold text-amber-900">Simulated Elemental Balance</span>
                <div className="text-[11px] text-amber-800">
                  Fire: {simulatedReport.elementalBalance.fire}% • Water: {simulatedReport.elementalBalance.water}% • Earth: {simulatedReport.elementalBalance.earth}%
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              Simulation runs locally in real time without modifying saved database records until applied.
            </span>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply Simulated Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
