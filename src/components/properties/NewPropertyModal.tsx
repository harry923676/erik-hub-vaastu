import React, { useState } from 'react';
import { X, Building2, Check, Compass } from 'lucide-react';
import { Property, PropertyType, FacingDirection, RoomItem } from '../../types';
import { CitySearchInput } from '../common/CitySearchInput';

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (property: Property) => void;
}

export const NewPropertyModal: React.FC<NewPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT_FLAT');
  const [facingDirection, setFacingDirection] = useState<FacingDirection>('EAST');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [northRotation, setNorthRotation] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Default seeded rooms based on property type
    const defaultRooms: RoomItem[] = [
      {
        id: `R_${Date.now()}_1`,
        name: 'Main Entrance (Mahadwara)',
        type: 'ENTRANCE',
        x: 420,
        y: 80,
        width: 160,
        height: 100,
        isEntrance: true,
      },
      {
        id: `R_${Date.now()}_2`,
        name: 'Living Room',
        type: 'LIVING_ROOM',
        x: 350,
        y: 200,
        width: 300,
        height: 250,
      },
      {
        id: `R_${Date.now()}_3`,
        name: 'Kitchen (Agneya)',
        type: 'KITCHEN',
        x: 650,
        y: 650,
        width: 250,
        height: 250,
      },
      {
        id: `R_${Date.now()}_4`,
        name: 'Master Bedroom (Nirriti)',
        type: 'MASTER_BEDROOM',
        x: 100,
        y: 650,
        width: 280,
        height: 250,
      },
      {
        id: `R_${Date.now()}_5`,
        name: 'Pooja Sanctum (Ishanya)',
        type: 'POOJA_ROOM',
        x: 680,
        y: 100,
        width: 180,
        height: 180,
      },
    ];

    const newProp: Property = {
      id: `PROP_${Date.now()}`,
      name: name.trim() || 'New Property',
      propertyType,
      facingDirection,
      northRotation,
      city: city.trim() || 'Mumbai',
      country: country.trim() || 'India',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rooms: defaultRooms,
      notes: 'Initial property profile seeded with basic spatial zoning.',
    };

    onAddProperty(newProp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Add New Property for Vaastu Audit
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Property Title / Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Greenwood Villa 4BHK, Skyline Tower Apt 1204"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Property Category</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 bg-white"
              >
                <option value="APARTMENT_FLAT">Apartment / Flat</option>
                <option value="INDEPENDENT_HOUSE">Independent House</option>
                <option value="VILLA">Luxury Villa</option>
                <option value="COMMERCIAL_OFFICE">Commercial Office</option>
                <option value="SHOP_RETAIL">Shop / Retail Store</option>
                <option value="FACTORY_INDUSTRIAL">Factory / Industrial</option>
                <option value="OPEN_PLOT">Open Plot / Land</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Primary Facing Direction</label>
              <select
                value={facingDirection}
                onChange={(e) => setFacingDirection(e.target.value as FacingDirection)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 bg-white"
              >
                <option value="NORTH">North (Kubera)</option>
                <option value="NORTH_EAST">North-East (Ishanya)</option>
                <option value="EAST">East (Indra / Surya)</option>
                <option value="SOUTH_EAST">South-East (Agni)</option>
                <option value="SOUTH">South (Yama)</option>
                <option value="SOUTH_WEST">South-West (Nirriti)</option>
                <option value="WEST">West (Varuna)</option>
                <option value="NORTH_WEST">North-West (Vayu)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="Search city (e.g. Mumbai, Bengaluru, New Delhi...)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">True North Offset Angle</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={northRotation}
                  onChange={(e) => setNorthRotation(Number(e.target.value))}
                  className="flex-1 accent-amber-600"
                />
                <span className="font-mono text-xs font-bold w-10 text-right">
                  {northRotation}°
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Create Property Audit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
