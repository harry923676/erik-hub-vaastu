import React, { useState, useEffect } from 'react';
import { X, Building2, Check, Compass, MapPin } from 'lucide-react';
import { Property, PropertyType, FacingDirection, PropertyStatus } from '../../types';
import { CitySearchInput } from '../common/CitySearchInput';

interface EditPropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onUpdateProperty: (updatedProperty: Property) => void;
}

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: 'Apartment / Flat', value: 'APARTMENT_FLAT' },
  { label: 'Villa / Kothi', value: 'VILLA' },
  { label: 'Independent House', value: 'INDEPENDENT_HOUSE' },
  { label: 'Duplex Home', value: 'DUPLEX' },
  { label: 'Penthouse', value: 'PENTHOUSE' },
  { label: 'Commercial Office', value: 'COMMERCIAL_OFFICE' },
  { label: 'Retail Shop', value: 'SHOP_RETAIL' },
  { label: 'Factory / Industrial', value: 'FACTORY_INDUSTRIAL' },
  { label: 'Open / Residential Plot', value: 'RESIDENTIAL_PLOT' },
];

const FACING_DIRECTIONS: FacingDirection[] = [
  'NORTH',
  'NORTH_EAST',
  'EAST',
  'SOUTH_EAST',
  'SOUTH',
  'SOUTH_WEST',
  'WEST',
  'NORTH_WEST',
];

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  property,
  onClose,
  onUpdateProperty,
}) => {
  const [name, setName] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT_FLAT');
  const [facingDirection, setFacingDirection] = useState<FacingDirection>('EAST');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<PropertyStatus>('READY_TO_MOVE');
  const [northRotation, setNorthRotation] = useState(0);
  const [notes, setNotes] = useState('');

  // Sync state when property prop changes
  useEffect(() => {
    if (property) {
      setName(property.name || '');
      setPropertyType(property.propertyType || 'APARTMENT_FLAT');
      setFacingDirection(property.facingDirection || 'EAST');
      setCity(property.city || '');
      setCountry(property.country || 'India');
      setAddress(property.address || '');
      setStatus(property.status || 'READY_TO_MOVE');
      setNorthRotation(property.northRotation || 0);
      setNotes(property.notes || '');
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Property = {
      ...property,
      name: name.trim(),
      propertyType,
      facingDirection,
      city: city.trim() || 'Unknown City',
      country: country.trim() || 'India',
      address: address.trim(),
      status,
      northRotation: Number(northRotation) || 0,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    };

    onUpdateProperty(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Edit Property Details</h2>
              <p className="text-xs text-stone-500">Update metadata, orientation & location</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Property Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Property Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Varanasi Heritage Residence"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Property Type Grid */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Property Classification</label>
            <div className="grid grid-cols-3 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => setPropertyType(type.value)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-center truncate transition-all cursor-pointer ${
                    propertyType === type.value
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold shadow-2xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location / City with Real-time Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <CitySearchInput
                value={city}
                onChange={(val, details) => {
                  setCity(val);
                  if (details?.country) {
                    setCountry(details.country);
                  }
                }}
                label="City / District"
                placeholder="Search city (e.g. Mumbai, Varanasi...)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* Facing Direction */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span>Main Facing Direction</span>
              <span className="text-[11px] text-amber-700 font-medium">Selected: {facingDirection}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {FACING_DIRECTIONS.map((dir) => (
                <button
                  type="button"
                  key={dir}
                  onClick={() => setFacingDirection(dir)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    facingDirection === dir
                      ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {dir.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* True North Rotation Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                True North Calibration Angle
              </span>
              <span className="font-mono font-bold text-amber-800">{northRotation}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={northRotation}
              onChange={(e) => setNorthRotation(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>-180° (West Tilt)</span>
              <span>0° (Due North)</span>
              <span>+180° (East Tilt)</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Property Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Architectural notes or context..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Submit / Actions Footer */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
