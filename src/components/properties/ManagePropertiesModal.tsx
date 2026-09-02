import React, { useState } from 'react';
import {
  Building2,
  Trash2,
  Edit3,
  Plus,
  CheckCircle,
  X,
  Compass,
  MapPin,
  Layers,
  RotateCcw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Property } from '../../types';
import { analyzePropertyVaastu } from '../../utils/vaastuEngine';

interface ManagePropertiesModalProps {
  isOpen: boolean;
  properties: Property[];
  activePropertyId: string;
  onClose: () => void;
  onSelectProperty: (propertyId: string) => void;
  onOpenNewProperty: () => void;
  onEditProperty: (property: Property) => void;
  onRequestDeleteProperty: (property: Property) => void;
  onRestoreSampleProperties: () => void;
}

export const ManagePropertiesModal: React.FC<ManagePropertiesModalProps> = ({
  isOpen,
  properties,
  activePropertyId,
  onClose,
  onSelectProperty,
  onOpenNewProperty,
  onEditProperty,
  onRequestDeleteProperty,
  onRestoreSampleProperties,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredProperties = properties.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.propertyType.toLowerCase().includes(q) ||
      p.facingDirection.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-props-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="manage-props-title" className="text-base font-bold text-stone-900">
                Manage Properties ({properties.length})
              </h2>
              <p className="text-xs text-stone-500">
                Switch between properties, edit details, or delete blueprints
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewProperty();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Property</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar & Stats */}
        <div className="px-5 py-3 border-b border-stone-100 bg-white flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, or property type..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50/60 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>
          <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
            Showing {filteredProperties.length} of {properties.length}
          </span>
        </div>

        {/* Properties List */}
        <div className="p-5 overflow-y-auto divide-y divide-stone-100 space-y-3 flex-1">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Building2 className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-sm font-medium text-stone-600">No matching properties found</p>
              <p className="text-xs text-stone-400">Try adjusting your search criteria or create a new property.</p>
            </div>
          ) : (
            filteredProperties.map((prop) => {
              const isActive = prop.id === activePropertyId;
              const propReport = analyzePropertyVaastu(prop);
              const roomCount = prop.rooms?.length || 0;

              return (
                <div
                  key={prop.id}
                  className={`pt-3 first:pt-0 p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'border-amber-500 bg-amber-50/40 shadow-xs ring-1 ring-amber-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900 truncate">
                          {prop.name}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Active
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-200">
                          {prop.propertyType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {prop.city}, {prop.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-stone-400" />
                          {roomCount} {roomCount === 1 ? 'room' : 'rooms'} mapped
                        </span>
                        <span className="flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-amber-600" />
                          Facing {prop.facingDirection} ({prop.northRotation}°)
                        </span>
                        <span className="font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md text-[11px]">
                          Vaastu Score: {propReport.overallScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Property Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProperty(prop.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg border border-amber-600 bg-white hover:bg-amber-50 text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Select & Switch
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          Current Blueprint
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => onEditProperty(prop)}
                        title="Edit property details"
                        className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-amber-800 hover:bg-amber-50 hover:border-amber-300 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRequestDeleteProperty(prop)}
                        title={`Delete ${prop.name}`}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all properties back to default sample residences? Any custom properties will be replaced.')) {
                onRestoreSampleProperties();
              }
            }}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Reset to Sample Properties</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-200/70 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewProperty();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Property</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
