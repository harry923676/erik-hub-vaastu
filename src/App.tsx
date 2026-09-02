import React, { useState, useEffect, useCallback } from 'react';
import { SAMPLE_PROPERTIES } from './data/sampleProperties';
import { Property, RoomItem, Finding, BirthProfile, FacingDirection } from './types';
import { analyzePropertyVaastu } from './utils/vaastuEngine';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { FloorPlanCanvas } from './components/floorplan/FloorPlanCanvas';
import { BeforeAfterSimulator } from './components/simulator/BeforeAfterSimulator';
import { AiCoachView } from './components/coach/AiCoachView';
import { KnowledgeLibrary } from './components/knowledge/KnowledgeLibrary';
import { JyotishProfileView } from './components/profile/JyotishProfileView';
import { ReportView } from './components/report/ReportView';
import { RoomEditorModal } from './components/floorplan/RoomEditorModal';
import { NorthCalibrationModal } from './components/floorplan/NorthCalibrationModal';
import { UploadWizardModal } from './components/floorplan/UploadWizardModal';
import { NewPropertyModal } from './components/properties/NewPropertyModal';
import { EditPropertyModal } from './components/properties/EditPropertyModal';
import { ManagePropertiesModal } from './components/properties/ManagePropertiesModal';
import { DeletePropertyModal } from './components/properties/DeletePropertyModal';
import { FindingDetailModal } from './components/dashboard/FindingDetailModal';

const PROPERTIES_STORAGE_KEY = 'erik_vaastu_properties_v2';
const ACTIVE_PROP_STORAGE_KEY = 'erik_vaastu_active_property_id_v2';

// Helper to create a clean starter property
export const createStarterProperty = (): Property => {
  const now = Date.now();
  return {
    id: `PROP_${now}`,
    name: 'New Residence Blueprint',
    propertyType: 'FLAT',
    country: 'India',
    city: 'New Delhi',
    address: 'Custom Floor Plan',
    facingDirection: 'EAST',
    northRotation: 0,
    plotWidth: 50,
    plotLength: 60,
    numberOfFloors: 1,
    currentFloor: 1,
    status: 'READY_TO_MOVE',
    yearBuilt: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    notes: 'Fresh property layout initialized for Vaastu Shastra spatial design.',
    rooms: [
      {
        id: `R_${now}_1`,
        name: 'Main Entrance (Mahadwara)',
        type: 'ENTRANCE',
        x: 430,
        y: 80,
        width: 140,
        height: 90,
        isEntrance: true,
      },
      {
        id: `R_${now}_2`,
        name: 'Living Room',
        type: 'LIVING_ROOM',
        x: 350,
        y: 200,
        width: 280,
        height: 240,
      },
      {
        id: `R_${now}_3`,
        name: 'Kitchen (Agneya)',
        type: 'KITCHEN',
        x: 650,
        y: 650,
        width: 220,
        height: 220,
      },
    ],
  };
};

// Safe property loader with structure verification
const loadInitialProperties = (): Property[] => {
  try {
    const saved = localStorage.getItem(PROPERTIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          rooms: Array.isArray(p.rooms) ? p.rooms : [],
          northRotation: typeof p.northRotation === 'number' ? p.northRotation : 0,
        }));
      }
    }
  } catch (e) {
    console.error('Failed to load properties from localStorage', e);
  }
  return SAMPLE_PROPERTIES;
};

// Safe active property ID loader
const loadInitialActiveId = (propsList: Property[]): string => {
  try {
    const savedId = localStorage.getItem(ACTIVE_PROP_STORAGE_KEY);
    if (savedId && propsList.some((p) => p.id === savedId)) {
      return savedId;
    }
  } catch (e) {
    console.error('Failed to load active property id', e);
  }
  return propsList[0]?.id || SAMPLE_PROPERTIES[0].id;
};

export default function App() {
  // Properties state initialized from storage
  const [properties, setProperties] = useState<Property[]>(loadInitialProperties);
  const [activePropertyId, setActivePropertyId] = useState<string>(() => {
    const initial = loadInitialProperties();
    return loadInitialActiveId(initial);
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isManagePropertiesOpen, setIsManagePropertiesOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const [isNorthModalOpen, setIsNorthModalOpen] = useState(false);
  const [isUploadWizardOpen, setIsUploadWizardOpen] = useState(false);
  const [isRoomEditorOpen, setIsRoomEditorOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomItem | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  // Resident Jyotish profile state
  const [birthProfile, setBirthProfile] = useState<BirthProfile>({
    consented: false,
    fullName: 'Pawan Paji',
    dob: '1990-05-15',
    tob: '06:30',
    pobCity: 'Chandigarh',
    favorableDirections: ['EAST', 'NORTH_EAST'],
    moderatelyFavorableDirections: ['NORTH', 'WEST'],
    sensitiveDirections: ['SOUTH_WEST'],
    personalizedNotes:
      'East and North-East quadrants provide maximum mental focus and intellectual clarity.',
  });

  // Synchronize properties state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties));
    } catch (e) {
      console.error('Failed to sync properties to localStorage', e);
    }
  }, [properties]);

  // Synchronize active property ID to localStorage
  useEffect(() => {
    try {
      if (activePropertyId) {
        localStorage.setItem(ACTIVE_PROP_STORAGE_KEY, activePropertyId);
      }
    } catch (e) {
      console.error('Failed to sync activePropertyId to localStorage', e);
    }
  }, [activePropertyId]);

  // Guaranteed safe activeProperty (never undefined)
  const activeProperty: Property =
    properties.find((p) => p.id === activePropertyId) ||
    properties[0] ||
    SAMPLE_PROPERTIES[0];

  // Dynamic live analysis whenever activeProperty changes
  const report = analyzePropertyVaastu(activeProperty);

  // --- CRUD: Switch Active Property ---
  const handleSelectProperty = (id: string) => {
    setActivePropertyId(id);
  };

  // --- CRUD: Add Property (Create) ---
  const handleAddProperty = (newProp: Property) => {
    const updated = [newProp, ...properties];
    setProperties(updated);
    setActivePropertyId(newProp.id);
    setIsNewPropertyOpen(false);
  };

  // --- CRUD: Edit Property Details (Update) ---
  const handleOpenEditProperty = (prop: Property) => {
    setPropertyToEdit(prop);
    setIsEditPropertyOpen(true);
  };

  const handleUpdateProperty = (updated: Property) => {
    setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsEditPropertyOpen(false);
    setPropertyToEdit(null);
  };

  // --- CRUD: Delete Property (Delete) ---
  const handleRequestDeleteProperty = (prop: Property) => {
    setPropertyToDelete(prop);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteProperty = (propertyId: string) => {
    // 1. Close modal and clear target immediately
    setIsDeleteModalOpen(false);
    setPropertyToDelete(null);

    // 2. Compute updated property list
    const remaining = properties.filter((p) => p.id !== propertyId);

    if (remaining.length === 0) {
      // If user deleted the last property, create a fresh starter property
      const starter = createStarterProperty();
      setProperties([starter]);
      setActivePropertyId(starter.id);
      try {
        localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify([starter]));
        localStorage.setItem(ACTIVE_PROP_STORAGE_KEY, starter.id);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // Update properties list
    setProperties(remaining);
    try {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(remaining));
    } catch (e) {
      console.error(e);
    }

    // 3. If the deleted property was active, switch to the first available property
    if (activePropertyId === propertyId) {
      const nextActiveId = remaining[0].id;
      setActivePropertyId(nextActiveId);
      try {
        localStorage.setItem(ACTIVE_PROP_STORAGE_KEY, nextActiveId);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // --- Reset to Default Sample Properties ---
  const handleRestoreSampleProperties = () => {
    setProperties(SAMPLE_PROPERTIES);
    const defaultId = SAMPLE_PROPERTIES[0].id;
    setActivePropertyId(defaultId);
    try {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(SAMPLE_PROPERTIES));
      localStorage.setItem(ACTIVE_PROP_STORAGE_KEY, defaultId);
    } catch (e) {
      console.error(e);
    }
  };

  // --- Rooms & Compass Handlers ---
  const handleUpdateRooms = (newRooms: RoomItem[]) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === activeProperty.id ? { ...p, rooms: newRooms } : p))
    );
  };

  const handleUpdateNorthRotation = (deg: number) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === activeProperty.id ? { ...p, northRotation: deg } : p))
    );
  };

  const handleSaveCompass = (rotation: number, facing: FacingDirection) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === activeProperty.id
          ? { ...p, northRotation: rotation, facingDirection: facing }
          : p
      )
    );
  };

  const handleAddRoom = () => {
    const newRoom: RoomItem = {
      id: `R_${Date.now()}`,
      name: 'New Architectural Space',
      type: 'BEDROOM',
      x: 300,
      y: 300,
      width: 220,
      height: 200,
    };
    handleUpdateRooms([...(activeProperty.rooms || []), newRoom]);
    setEditingRoom(newRoom);
    setIsRoomEditorOpen(true);
  };

  const handleSaveRoom = (updated: RoomItem) => {
    const updatedRooms = (activeProperty.rooms || []).map((r) =>
      r.id === updated.id ? updated : r
    );
    handleUpdateRooms(updatedRooms);
  };

  const handleDeleteRoom = (roomId: string) => {
    const remaining = (activeProperty.rooms || []).filter((r) => r.id !== roomId);
    handleUpdateRooms(remaining);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Universal Top Navigation Header */}
      <Navbar
        properties={properties}
        activeProperty={activeProperty}
        activeTab={activeTab}
        currentTab={activeTab}
        onSelectProperty={handleSelectProperty}
        setActivePropertyId={handleSelectProperty}
        onSelectTab={(tab) => setActiveTab(tab)}
        setCurrentTab={(tab) => setActiveTab(tab)}
        onOpenNewProperty={() => setIsNewPropertyOpen(true)}
        onOpenNewPropertyModal={() => setIsNewPropertyOpen(true)}
        onOpenManageProperties={() => setIsManagePropertiesOpen(true)}
        onRequestDeleteProperty={handleRequestDeleteProperty}
        onRestoreSampleProperties={handleRestoreSampleProperties}
        overallScore={report.overallScore}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            property={activeProperty}
            report={report}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenCompassCalibration={() => setIsNorthModalOpen(true)}
            onSelectFinding={(f) => setSelectedFinding(f)}
            onRequestDeleteProperty={handleRequestDeleteProperty}
            onOpenManageProperties={() => setIsManagePropertiesOpen(true)}
            onEditProperty={handleOpenEditProperty}
          />
        )}

        {activeTab === 'blueprint' && (
          <FloorPlanCanvas
            property={activeProperty}
            onUpdateRooms={handleUpdateRooms}
            onUpdateNorthRotation={handleUpdateNorthRotation}
            onSelectRoom={() => {}}
            onAddRoom={handleAddRoom}
            onEditRoom={(r) => {
              setEditingRoom(r);
              setIsRoomEditorOpen(true);
            }}
            onDeleteRoom={handleDeleteRoom}
            onOpenUploadWizard={() => setIsUploadWizardOpen(true)}
            onOpenManageProperties={() => setIsManagePropertiesOpen(true)}
            onRequestDeleteProperty={handleRequestDeleteProperty}
          />
        )}

        {activeTab === 'simulator' && (
          <BeforeAfterSimulator
            property={activeProperty}
            onApplyModifiedRooms={(rooms) => {
              handleUpdateRooms(rooms);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'coach' && (
          <AiCoachView
            property={activeProperty}
            overallScore={report.overallScore}
            birthProfile={birthProfile}
          />
        )}

        {activeTab === 'knowledge' && <KnowledgeLibrary />}

        {activeTab === 'jyotish' && (
          <JyotishProfileView
            birthProfile={birthProfile}
            onUpdateProfile={(prof) => setBirthProfile(prof)}
          />
        )}

        {activeTab === 'report' && (
          <ReportView property={activeProperty} report={report} />
        )}
      </main>

      {/* --- MODALS --- */}

      {/* Manage Properties Hub */}
      <ManagePropertiesModal
        isOpen={isManagePropertiesOpen}
        properties={properties}
        activePropertyId={activePropertyId}
        onClose={() => setIsManagePropertiesOpen(false)}
        onSelectProperty={handleSelectProperty}
        onOpenNewProperty={() => {
          setIsManagePropertiesOpen(false);
          setIsNewPropertyOpen(true);
        }}
        onEditProperty={(prop) => {
          setIsManagePropertiesOpen(false);
          handleOpenEditProperty(prop);
        }}
        onRequestDeleteProperty={(prop) => {
          handleRequestDeleteProperty(prop);
        }}
        onRestoreSampleProperties={handleRestoreSampleProperties}
      />

      {/* Create New Property Modal */}
      <NewPropertyModal
        isOpen={isNewPropertyOpen}
        onClose={() => setIsNewPropertyOpen(false)}
        onAddProperty={handleAddProperty}
      />

      {/* Edit Property Modal */}
      <EditPropertyModal
        isOpen={isEditPropertyOpen}
        property={propertyToEdit}
        onClose={() => {
          setIsEditPropertyOpen(false);
          setPropertyToEdit(null);
        }}
        onUpdateProperty={handleUpdateProperty}
      />

      {/* Delete Property Confirmation Modal */}
      <DeletePropertyModal
        isOpen={isDeleteModalOpen}
        property={propertyToDelete}
        totalPropertiesCount={properties.length}
        isActiveProperty={propertyToDelete?.id === activePropertyId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
        onConfirmDelete={handleConfirmDeleteProperty}
      />

      {/* Room Editor Modal */}
      <RoomEditorModal
        isOpen={isRoomEditorOpen}
        onClose={() => setIsRoomEditorOpen(false)}
        room={editingRoom}
        onSave={handleSaveRoom}
        onDelete={handleDeleteRoom}
        northRotation={activeProperty.northRotation}
      />

      {/* North Direction Compass Calibration */}
      <NorthCalibrationModal
        isOpen={isNorthModalOpen}
        onClose={() => setIsNorthModalOpen(false)}
        currentNorthRotation={activeProperty.northRotation}
        facingDirection={activeProperty.facingDirection}
        onSave={handleSaveCompass}
      />

      {/* Layout Image Upload Wizard */}
      <UploadWizardModal
        isOpen={isUploadWizardOpen}
        onClose={() => setIsUploadWizardOpen(false)}
        onApplyRooms={(rooms) => handleUpdateRooms(rooms)}
        propertyType={activeProperty.propertyType}
      />

      {/* Finding Detail Insight Dialog */}
      <FindingDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
}
