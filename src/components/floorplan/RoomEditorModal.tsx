import React, { useState } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import { RoomItem, RoomType } from '../../types';
import { getRoomDirectionZone } from '../../utils/vaastuEngine';

interface RoomEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomItem | null;
  onSave: (updatedRoom: RoomItem) => void;
  onDelete?: (roomId: string) => void;
  northRotation: number;
}

const ROOM_TYPES: { type: RoomType; label: string; defaultZone: string }[] = [
  { type: 'ENTRANCE', label: 'Main Entrance / Mahadwara', defaultZone: 'NE / E / N' },
  { type: 'LIVING_ROOM', label: 'Living Room / Drawing Room', defaultZone: 'N / E' },
  { type: 'KITCHEN', label: 'Kitchen (Pākaśālā)', defaultZone: 'SE / NW' },
  { type: 'MASTER_BEDROOM', label: 'Master Bedroom', defaultZone: 'SW' },
  { type: 'BEDROOM', label: 'Bedroom (General)', defaultZone: 'S / W' },
  { type: 'CHILDREN_BEDROOM', label: 'Children / Study Bedroom', defaultZone: 'W / NW' },
  { type: 'GUEST_BEDROOM', label: 'Guest Bedroom', defaultZone: 'NW' },
  { type: 'POOJA_ROOM', label: 'Pooja / Meditation Sanctum', defaultZone: 'NE' },
  { type: 'BATHROOM', label: 'Bathroom (Bathing Only)', defaultZone: 'E / N' },
  { type: 'TOILET', label: 'Toilet / WC (Waste Drainage)', defaultZone: 'WNW / SSW' },
  { type: 'DINING_ROOM', label: 'Dining Area', defaultZone: 'W / E' },
  { type: 'STAIRCASE', label: 'Staircase', defaultZone: 'S / W / SW' },
  { type: 'BALCONY', label: 'Balcony / Verandah', defaultZone: 'N / E' },
  { type: 'STUDY_ROOM', label: 'Study / Library', defaultZone: 'NE / E / N' },
  { type: 'WATER_TANK_OVERHEAD', label: 'Overhead Water Tank', defaultZone: 'SW / W' },
  { type: 'BOREWELL_UNDERGROUND', label: 'Underground Water / Borewell', defaultZone: 'NE' },
  { type: 'SEPTIC_TANK', label: 'Septic Tank', defaultZone: 'NW / WNW' },
  { type: 'STORAGE', label: 'Storage Room', defaultZone: 'SW / S' },
];

export const RoomEditorModal: React.FC<RoomEditorModalProps> = ({
  isOpen,
  onClose,
  room,
  onSave,
  onDelete,
  northRotation,
}) => {
  if (!isOpen || !room) return null;

  const [name, setName] = useState(room.name);
  const [type, setType] = useState<RoomType>(room.type);
  const [x, setX] = useState(room.x);
  const [y, setY] = useState(room.y);
  const [width, setWidth] = useState(room.width);
  const [height, setHeight] = useState(room.height);

  const previewZone = getRoomDirectionZone(
    { ...room, x, y, width, height },
    northRotation
  );

  const handleSave = () => {
    onSave({
      ...room,
      name,
      type,
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Edit Room / Space Parameters
            </h3>
            <p className="text-xs text-stone-500">
              Calibrate architectural coordinates, category type, and directional zoning.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Resulting Zone Live Pill */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <span className="text-xs text-amber-900 font-medium">Resulting Direction Zone:</span>
            <span className="text-sm font-bold font-mono px-2.5 py-0.5 rounded bg-amber-600 text-white">
              {previewZone}
            </span>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Room Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            />
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Space Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as RoomType)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
            >
              {ROOM_TYPES.map((rt) => (
                <option key={rt.type} value={rt.type}>
                  {rt.label} (Ideal: {rt.defaultZone})
                </option>
              ))}
            </select>
          </div>

          {/* Position Sliders: X & Y */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <span>X Position (Horizontal)</span>
                <span className="font-mono">{x}</span>
              </div>
              <input
                type="range"
                min="60"
                max="800"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <span>Y Position (Vertical)</span>
                <span className="font-mono">{y}</span>
              </div>
              <input
                type="range"
                min="60"
                max="800"
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>

          {/* Dimensions: Width & Height */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <span>Width</span>
                <span className="font-mono">{width}</span>
              </div>
              <input
                type="range"
                min="80"
                max="450"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <span>Height</span>
                <span className="font-mono">{height}</span>
              </div>
              <input
                type="range"
                min="80"
                max="450"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between bg-stone-50">
          {onDelete ? (
            <button
              onClick={() => {
                onDelete(room.id);
                onClose();
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Room</span>
            </button>
          ) : (
            <div></div>
          )}

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
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
