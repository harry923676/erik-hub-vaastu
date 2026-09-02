import React, { useState, useRef, useEffect } from 'react';
import {
  Compass as CompassIcon,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  RotateCw,
  Move,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Upload,
  Building2,
  Settings,
} from 'lucide-react';
import { Property, RoomItem, DirectionZone, Finding } from '../../types';
import { getRoomDirectionZone, calculateRoomCenter } from '../../utils/vaastuEngine';

interface FloorPlanCanvasProps {
  property: Property;
  onUpdateRooms: (rooms: RoomItem[]) => void;
  onUpdateNorthRotation: (deg: number) => void;
  onSelectRoom: (room: RoomItem) => void;
  onAddRoom: () => void;
  onEditRoom: (room: RoomItem) => void;
  onDeleteRoom: (roomId: string) => void;
  onOpenUploadWizard: () => void;
  onOpenManageProperties?: () => void;
  onRequestDeleteProperty?: (property: Property) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  property,
  onUpdateRooms,
  onUpdateNorthRotation,
  onSelectRoom,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onOpenUploadWizard,
  onOpenManageProperties,
  onRequestDeleteProperty,
}) => {
  // Viewport transforms
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Layers toggles
  const [showGrid, setShowGrid] = useState(true);
  const [showMandala, setShowMandala] = useState(true);
  const [showDirections, setShowDirections] = useState(true);
  const [showElements, setShowElements] = useState(true);
  const [showBrahmasthan, setShowBrahmasthan] = useState(true);
  const [mandalaType, setMandalaType] = useState<'3x3' | '9x9'>('3x3');

  // Defensive room items
  const propertyRooms = property?.rooms || [];

  // Selected room highlight
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    propertyRooms.length > 0 ? propertyRooms[0].id : null
  );

  // Sync selectedRoomId whenever property or its rooms change
  useEffect(() => {
    const currentRooms = property?.rooms || [];
    if (!selectedRoomId || !currentRooms.some((r) => r.id === selectedRoomId)) {
      setSelectedRoomId(currentRooms.length > 0 ? currentRooms[0].id : null);
    }
  }, [property?.id, property?.rooms]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Direction color helper
  const getRoomColor = (type: string, zone: DirectionZone) => {
    if (type === 'KITCHEN') {
      return zone === 'SE' || zone === 'NW' ? 'fill-rose-500/20 stroke-rose-600' : 'fill-rose-300/30 stroke-rose-500';
    }
    if (type === 'MASTER_BEDROOM') {
      return zone === 'SW' ? 'fill-amber-600/25 stroke-amber-700' : 'fill-amber-300/25 stroke-amber-500';
    }
    if (type === 'POOJA_ROOM') {
      return zone === 'NE' ? 'fill-cyan-500/25 stroke-cyan-600' : 'fill-cyan-300/20 stroke-cyan-500';
    }
    if (type === 'TOILET') {
      return zone === 'NE' || zone === 'BRAHMASTHAN'
        ? 'fill-rose-600/30 stroke-rose-700'
        : 'fill-stone-500/20 stroke-stone-600';
    }
    if (type === 'ENTRANCE') {
      return 'fill-emerald-500/20 stroke-emerald-600';
    }
    return 'fill-indigo-500/15 stroke-indigo-600';
  };

  const selectedRoom = property.rooms.find((r) => r.id === selectedRoomId);
  const selectedZone = selectedRoom ? getRoomDirectionZone(selectedRoom, property.northRotation) : 'N';

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[640px] pb-4">
      {/* Left Control Column: Layer Controls, North Rotation & Room List */}
      <div className="w-full lg:w-72 flex-shrink-0 bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col gap-4 overflow-y-auto">
        {/* Active Property Status & Actions */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-600" />
              Active Blueprint
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 font-semibold text-amber-900">
              {property.propertyType}
            </span>
          </div>

          <div className="truncate font-bold text-xs text-stone-900">
            {property.name}
          </div>
          <div className="text-[11px] text-stone-500 truncate">
            {property.city}, {property.country} • Facing {property.facingDirection}
          </div>

          <div className="flex items-center gap-1.5 pt-1.5 border-t border-amber-200/60">
            {onOpenManageProperties && (
              <button
                type="button"
                onClick={onOpenManageProperties}
                className="flex-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-center transition-colors cursor-pointer"
              >
                Manage All
              </button>
            )}
            {onRequestDeleteProperty && (
              <button
                type="button"
                onClick={() => onRequestDeleteProperty(property)}
                title={`Delete ${property.name}`}
                className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 text-rose-700 text-center transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* North Angle Calibration */}
        <div className="space-y-2 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
            <span className="flex items-center gap-1.5">
              <CompassIcon className="w-3.5 h-3.5 text-amber-600" />
              True North Offset
            </span>
            <span className="font-mono font-bold text-amber-800">{property.northRotation}°</span>
          </div>

          <input
            type="range"
            min="0"
            max="359"
            value={property.northRotation}
            onChange={(e) => onUpdateNorthRotation(parseInt(e.target.value, 10))}
            className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>0° (Top)</span>
            <span>90° (Right)</span>
            <span>180° (Bottom)</span>
            <span>270° (Left)</span>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Overlay Layers
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => setShowDirections(!showDirections)}
              className={`px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all ${
                showDirections
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200'
              }`}
            >
              8 Directions
            </button>

            <button
              onClick={() => setShowMandala(!showMandala)}
              className={`px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all ${
                showMandala
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200'
              }`}
            >
              Mandala {mandalaType}
            </button>

            <button
              onClick={() => setShowBrahmasthan(!showBrahmasthan)}
              className={`px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all ${
                showBrahmasthan
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200'
              }`}
            >
              Brahmasthan
            </button>

            <button
              onClick={() => setShowElements(!showElements)}
              className={`px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all ${
                showElements
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200'
              }`}
            >
              5 Elements
            </button>
          </div>

          {showMandala && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-stone-500">Mandala Grid:</span>
              <button
                onClick={() => setMandalaType('3x3')}
                className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                  mandalaType === '3x3' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                3x3 (Peetha)
              </button>
              <button
                onClick={() => setMandalaType('9x9')}
                className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                  mandalaType === '9x9' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                9x9 (Paramasayika)
              </button>
            </div>
          )}
        </div>

        {/* Room Inventory List */}
        <div className="flex-1 flex flex-col min-h-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Rooms & Spaces ({property.rooms.length})
            </span>
            <button
              onClick={onAddRoom}
              className="p-1 rounded-md bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-medium flex items-center gap-1 border border-amber-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {property.rooms.map((room) => {
              const zone = getRoomDirectionZone(room, property.northRotation);
              const isSelected = room.id === selectedRoomId;
              return (
                <div
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    onSelectRoom(room);
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 font-semibold text-stone-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="truncate">
                    <div className="truncate font-medium">{room.name}</div>
                    <div className="text-[10px] text-stone-400">{room.type.replace(/_/g, ' ')}</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-stone-100 border border-stone-200 text-stone-700">
                      {zone}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRoom(room);
                      }}
                      className="p-1 text-stone-400 hover:text-stone-800 rounded"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRoom(room.id);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload Floor Plan Button */}
        <button
          onClick={onOpenUploadWizard}
          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-50 text-amber-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Plan / Image</span>
        </button>
      </div>

      {/* Center Main Blueprint Canvas */}
      <div
        ref={containerRef}
        className="flex-1 bg-stone-900 rounded-2xl border border-stone-800 relative overflow-hidden flex items-center justify-center select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Floating Canvas Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-stone-800/90 backdrop-blur px-2.5 py-1.5 rounded-xl border border-stone-700 text-stone-200 text-xs shadow-md">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            className="p-1.5 hover:bg-stone-700 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="p-1.5 hover:bg-stone-700 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1">{Math.round(zoom * 100)}%</span>
          <div className="w-px h-3 bg-stone-700 mx-0.5"></div>
          <button
            onClick={resetView}
            className="p-1.5 hover:bg-stone-700 rounded flex items-center gap-1"
            title="Reset Pan & Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reset</span>
          </button>
        </div>

        {/* Floating True North Indicator Card */}
        <div className="absolute top-4 right-4 z-20 bg-stone-800/90 backdrop-blur px-3 py-2 rounded-xl border border-stone-700 text-white flex items-center gap-3 shadow-md">
          <div
            className="w-8 h-8 rounded-full border border-amber-500/50 flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotate(${property.northRotation}deg)` }}
          >
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[12px] border-b-rose-500"></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-stone-400">North Angle</div>
            <div className="text-xs font-mono font-bold text-amber-400">{property.northRotation}°</div>
          </div>
        </div>

        {/* The SVG Blueprint Workspace */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-75 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <svg
            viewBox="0 0 1000 1000"
            className="w-[780px] h-[780px] max-w-full max-h-full drop-shadow-2xl"
          >
            <defs>
              {/* Architectural Grid pattern */}
              <pattern id="archGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#262626" strokeWidth="0.5" />
              </pattern>
              {/* Fine subgrid */}
              <pattern id="subGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1c1917" strokeWidth="0.25" />
              </pattern>
              {/* Radial gradient for Brahmasthan */}
              <radialGradient id="brahmaAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Canvas & Grid */}
            <rect width="1000" height="1000" fill="#141413" rx="16" />
            <rect width="1000" height="1000" fill="url(#subGrid)" />
            {showGrid && <rect width="1000" height="1000" fill="url(#archGrid)" />}

            {/* Outer Plot / Building Boundary */}
            <rect
              x="60"
              y="60"
              width="880"
              height="880"
              fill="none"
              stroke="#525252"
              strokeWidth="4"
              strokeDasharray="8 4"
            />

            {/* Pancha Mahabhuta Elemental Corner Auras */}
            {showElements && (
              <g opacity="0.18">
                {/* Water (Ishanya / NE) - Top Right if N=0 */}
                <circle cx="850" cy="150" r="140" fill="#06b6d4" filter="blur(20px)" />
                {/* Fire (Agneya / SE) - Bottom Right */}
                <circle cx="850" cy="850" r="140" fill="#f43f5e" filter="blur(20px)" />
                {/* Earth (Nirriti / SW) - Bottom Left */}
                <circle cx="150" cy="850" r="140" fill="#d97706" filter="blur(20px)" />
                {/* Air (Vayavya / NW) - Top Left */}
                <circle cx="150" cy="150" r="140" fill="#38bdf8" filter="blur(20px)" />
              </g>
            )}

            {/* Vastu Purusha Mandala Grid Overlay */}
            {showMandala && (
              <g stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3">
                {mandalaType === '3x3' ? (
                  <>
                    {/* 3x3 Peetha Mandala */}
                    <line x1="353" y1="60" x2="353" y2="940" />
                    <line x1="646" y1="60" x2="646" y2="940" />
                    <line x1="60" y1="353" x2="940" y2="353" />
                    <line x1="60" y1="646" x2="940" y2="646" />
                  </>
                ) : (
                  <>
                    {/* 9x9 Paramasayika Mandala */}
                    {[...Array(8)].map((_, i) => (
                      <React.Fragment key={i}>
                        <line
                          x1={60 + (880 / 9) * (i + 1)}
                          y1="60"
                          x2={60 + (880 / 9) * (i + 1)}
                          y2="940"
                        />
                        <line
                          x1="60"
                          y1={60 + (880 / 9) * (i + 1)}
                          x2="940"
                          y2={60 + (880 / 9) * (i + 1)}
                        />
                      </React.Fragment>
                    ))}
                  </>
                )}
              </g>
            )}

            {/* 8 Cardinal & Ordinal Direction Ray Overlays */}
            {showDirections && (
              <g
                transform={`rotate(${property.northRotation} 500 500)`}
                stroke="#57534e"
                strokeWidth="1"
                opacity="0.45"
              >
                {/* Diagonal rays */}
                <line x1="500" y1="60" x2="500" y2="940" stroke="#f43f5e" strokeWidth="1.5" />
                <line x1="60" y1="500" x2="940" y2="500" />
                <line x1="188" y1="188" x2="812" y2="812" />
                <line x1="812" y1="188" x2="188" y2="812" />

                {/* Direction Labels */}
                <text x="500" y="45" fill="#f43f5e" fontSize="16" fontWeight="bold" textAnchor="middle">
                  N
                </text>
                <text x="830" y="170" fill="#06b6d4" fontSize="14" fontWeight="bold" textAnchor="middle">
                  NE
                </text>
                <text x="960" y="505" fill="#e7e5e4" fontSize="15" fontWeight="bold" textAnchor="middle">
                  E
                </text>
                <text x="830" y="840" fill="#f43f5e" fontSize="14" fontWeight="bold" textAnchor="middle">
                  SE
                </text>
                <text x="500" y="965" fill="#e7e5e4" fontSize="15" fontWeight="bold" textAnchor="middle">
                  S
                </text>
                <text x="170" y="840" fill="#d97706" fontSize="14" fontWeight="bold" textAnchor="middle">
                  SW
                </text>
                <text x="40" y="505" fill="#e7e5e4" fontSize="15" fontWeight="bold" textAnchor="middle">
                  W
                </text>
                <text x="170" y="170" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">
                  NW
                </text>
              </g>
            )}

            {/* Brahmasthan Golden Glowing Center Aura */}
            {showBrahmasthan && (
              <g>
                <circle cx="500" cy="500" r="140" fill="url(#brahmaAura)" />
                <rect
                  x="353"
                  y="353"
                  width="294"
                  height="294"
                  fill="#f59e0b"
                  fillOpacity="0.05"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x="500"
                  y="505"
                  fill="#f59e0b"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  opacity="0.8"
                >
                  BRAHMASTHAN
                </text>
              </g>
            )}

            {/* Room Polygons & Interactive Nodes */}
            {property.rooms.map((room) => {
              const zone = getRoomDirectionZone(room, property.northRotation);
              const colorClasses = getRoomColor(room.type, zone);
              const isSelected = room.id === selectedRoomId;
              const center = calculateRoomCenter(room);

              return (
                <g
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoomId(room.id);
                    onSelectRoom(room);
                  }}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Room Area Rectangle */}
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.width}
                    height={room.height}
                    rx="8"
                    className={`${colorClasses} transition-all`}
                    strokeWidth={isSelected ? 3.5 : 1.75}
                  />

                  {/* Selection Border Halo */}
                  {isSelected && (
                    <rect
                      x={room.x - 4}
                      y={room.y - 4}
                      width={room.width + 8}
                      height={room.height + 8}
                      rx="12"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                    />
                  )}

                  {/* Centroid Node */}
                  <circle cx={center.cx} cy={center.cy} r="4" fill="#ffffff" />

                  {/* Room Label Badge */}
                  <text
                    x={center.cx}
                    y={center.cy - 6}
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="drop-shadow-md pointer-events-none font-sans"
                  >
                    {room.name}
                  </text>

                  {/* Direction Zone Pill */}
                  <g transform={`translate(${center.cx - 20}, ${center.cy + 8})`}>
                    <rect
                      width="40"
                      height="16"
                      rx="4"
                      fill="#000000"
                      fillOpacity="0.65"
                      stroke="#44403c"
                      strokeWidth="0.5"
                    />
                    <text
                      x="20"
                      y="12"
                      fill="#e7e5e4"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {zone}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Right Column: Selected Room Inspector & Vaastu Evaluation */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between overflow-y-auto">
        {selectedRoom ? (
          <div className="space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-stone-100 text-stone-700">
                  {selectedRoom.type.replace(/_/g, ' ')}
                </span>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Zone: {selectedZone}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mt-1 font-serif">
                {selectedRoom.name}
              </h3>
              <p className="text-xs text-stone-400">
                Coordinates: ({selectedRoom.x}, {selectedRoom.y}) • Size: {selectedRoom.width}×{selectedRoom.height}
              </p>
            </div>

            {/* Quick Alignment Insight */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Directional Analysis</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedRoom.type === 'KITCHEN' && selectedZone === 'SE' && (
                  'Optimal alignment in Agneya (Fire sector) in full harmony with solar thermal cycles.'
                )}
                {selectedRoom.type === 'MASTER_BEDROOM' && selectedZone === 'SW' && (
                  'Anchored in Nirriti (Earth sector), ensuring grounded stability for the head of family.'
                )}
                {selectedRoom.type === 'POOJA_ROOM' && selectedZone === 'NE' && (
                  'Sacred Ishanya quadrant brings serene morning clarity and peace.'
                )}
                {selectedRoom.type === 'TOILET' && (selectedZone === 'NE' || selectedZone === 'BRAHMASTHAN') && (
                  'Sensitive placement alert: Water / Brahmasthan sectors are burdened by waste drainage.'
                )}
                {!['KITCHEN', 'MASTER_BEDROOM', 'POOJA_ROOM'].includes(selectedRoom.type) && (
                  `Positioned in the ${selectedZone} sector. Supports general functional occupancy with minor interior orientation adjustments.`
                )}
              </p>
            </div>

            {/* Practical Remedies */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Tiered Practical Remedies
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-semibold text-emerald-800">Interior (Level 2):</span>{' '}
                  <span className="text-stone-700">
                    {selectedRoom.type === 'KITCHEN'
                      ? 'Ensure cook faces East while preparing meals.'
                      : selectedRoom.type === 'MASTER_BEDROOM'
                      ? 'Orient headboard toward South or East.'
                      : 'Keep center clear and align work desks facing North or East.'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100">
                  <span className="font-semibold text-amber-800">Non-Structural (Level 3):</span>{' '}
                  <span className="text-stone-700">
                    {selectedRoom.type === 'TOILET'
                      ? 'Place a small ceramic bowl of natural rock salt to absorb stagnant damp energy.'
                      : 'Use warm ivory or soft earth tones; maintain warm 2700K lighting.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => onEditRoom(selectedRoom)}
              className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Modify Room Attributes & Position</span>
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-stone-400">
            <CompassIcon className="w-8 h-8 text-stone-300 mb-2" />
            <p className="text-xs">Click any room polygon on the canvas to inspect its Vaastu score, directional zone, and remedies.</p>
          </div>
        )}
      </div>
    </div>
  );
};
