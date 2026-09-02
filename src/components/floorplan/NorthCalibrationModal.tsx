import React, { useState } from 'react';
import { X, Compass, Check, RotateCcw } from 'lucide-react';
import { FacingDirection } from '../../types';

interface NorthCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNorthRotation: number;
  facingDirection: FacingDirection;
  onSave: (rotation: number, facing: FacingDirection) => void;
}

const PRESET_FACINGS: { label: string; facing: FacingDirection; defaultAngle: number }[] = [
  { label: 'Facing North', facing: 'NORTH', defaultAngle: 0 },
  { label: 'Facing North-East', facing: 'NORTH_EAST', defaultAngle: 45 },
  { label: 'Facing East', facing: 'EAST', defaultAngle: 90 },
  { label: 'Facing South-East', facing: 'SOUTH_EAST', defaultAngle: 135 },
  { label: 'Facing South', facing: 'SOUTH', defaultAngle: 180 },
  { label: 'Facing South-West', facing: 'SOUTH_WEST', defaultAngle: 225 },
  { label: 'Facing West', facing: 'WEST', defaultAngle: 270 },
  { label: 'Facing North-West', facing: 'NORTH_WEST', defaultAngle: 315 },
];

export const NorthCalibrationModal: React.FC<NorthCalibrationModalProps> = ({
  isOpen,
  onClose,
  currentNorthRotation,
  facingDirection,
  onSave,
}) => {
  if (!isOpen) return null;

  const [angle, setAngle] = useState(currentNorthRotation);
  const [facing, setFacing] = useState<FacingDirection>(facingDirection);

  const handleSave = () => {
    onSave(angle, facing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900 font-serif">
              True North & Compass Calibration
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compass Visual Representation */}
        <div className="p-6 flex flex-col items-center space-y-6">
          <div className="relative w-48 h-48 rounded-full border-4 border-stone-200 bg-stone-50 flex items-center justify-center shadow-inner">
            {/* Cardinal Marks */}
            <span className="absolute top-2 text-xs font-bold text-rose-600">N</span>
            <span className="absolute right-3 text-xs font-bold text-stone-600">E</span>
            <span className="absolute bottom-2 text-xs font-bold text-stone-600">S</span>
            <span className="absolute left-3 text-xs font-bold text-stone-600">W</span>

            {/* Rotating Magnetic Needle */}
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-200"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="flex flex-col items-center">
                {/* North arrow pointer */}
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[60px] border-b-rose-600 drop-shadow-sm"></div>
                {/* Center dial pin */}
                <div className="w-4 h-4 rounded-full bg-stone-900 border-2 border-white z-10 -my-2"></div>
                {/* South arrow pointer */}
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[60px] border-t-stone-400 drop-shadow-sm"></div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-2xl font-extrabold font-mono text-stone-900">{angle}°</div>
            <p className="text-xs text-stone-500">
              True North rotational offset from blueprint top boundary.
            </p>
          </div>

          {/* Slider */}
          <div className="w-full space-y-2">
            <input
              type="range"
              min="0"
              max="359"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-stone-400">
              <button onClick={() => setAngle(0)} className="hover:text-stone-800">0° (N)</button>
              <button onClick={() => setAngle(90)} className="hover:text-stone-800">90° (E)</button>
              <button onClick={() => setAngle(180)} className="hover:text-stone-800">180° (S)</button>
              <button onClick={() => setAngle(270)} className="hover:text-stone-800">270° (W)</button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="w-full space-y-2">
            <label className="text-xs font-semibold text-stone-700">Quick Orientation Presets</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {PRESET_FACINGS.map((p) => (
                <button
                  key={p.facing}
                  onClick={() => {
                    setFacing(p.facing);
                    setAngle(p.defaultAngle);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-left font-medium transition-colors ${
                    facing === p.facing
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between bg-stone-50">
          <button
            onClick={() => {
              setAngle(0);
              setFacing('NORTH');
            }}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to 0°</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Apply Calibration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
