import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, Building2, MapPin, Layers, CheckCircle } from 'lucide-react';
import { Property } from '../../types';

interface DeletePropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  totalPropertiesCount: number;
  isActiveProperty?: boolean;
  onClose: () => void;
  onConfirmDelete: (propertyId: string) => void;
}

export const DeletePropertyModal: React.FC<DeletePropertyModalProps> = ({
  isOpen,
  property,
  totalPropertiesCount,
  isActiveProperty = false,
  onClose,
  onConfirmDelete,
}) => {
  // Listen for Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !property) return null;

  const isLastProperty = totalPropertiesCount <= 1;

  const handleDelete = () => {
    onConfirmDelete(property.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="delete-dialog-title" className="text-base font-bold text-stone-900">
                Delete Property
              </h2>
              <p className="text-xs text-stone-500">Confirm architectural property removal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-stone-900 font-semibold">{property.name}</strong>?
          </p>

          {/* Property Summary Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-stone-800 font-semibold">
              <span className="flex items-center gap-1.5 truncate">
                <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="truncate">{property.name}</span>
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isActiveProperty && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" />
                    Currently Active
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 text-[10px] font-bold">
                  {property.propertyType}
                </span>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-stone-500 text-[11px]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {property.city}, {property.country}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                {property.rooms?.length || 0} Rooms Mapped
              </span>
              <span>Facing: {property.facingDirection}</span>
            </div>
          </div>

          {/* Warning Notices */}
          {isLastProperty ? (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-semibold">Only Remaining Property</strong>
                <span>
                  Deleting this property will automatically generate a fresh, blank property workspace so you can continue mapping new floor plans.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-semibold">Irreversible Action</strong>
                <span>
                  All mapped rooms, compass rotations, and custom Vaastu audit scores for this property will be permanently removed.
                  {isActiveProperty && ' The workspace will automatically switch to the next available property.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isLastProperty ? 'Delete & Create Blank' : 'Delete Property'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
