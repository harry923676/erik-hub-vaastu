export type PropertyType =
  | 'APARTMENT'
  | 'FLAT'
  | 'APARTMENT_FLAT'
  | 'INDEPENDENT_HOUSE'
  | 'VILLA'
  | 'DUPLEX'
  | 'PENTHOUSE'
  | 'OFFICE'
  | 'COMMERCIAL_OFFICE'
  | 'SHOP'
  | 'SHOP_RETAIL'
  | 'SHOWROOM'
  | 'RESTAURANT'
  | 'FACTORY'
  | 'FACTORY_INDUSTRIAL'
  | 'WAREHOUSE'
  | 'RESIDENTIAL_PLOT'
  | 'COMMERCIAL_PLOT'
  | 'OPEN_PLOT';

export type PropertyStatus = 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION' | 'PLANNING' | 'RENOVATION';

export type FacingDirection = 'NORTH' | 'NORTH_EAST' | 'EAST' | 'SOUTH_EAST' | 'SOUTH' | 'SOUTH_WEST' | 'WEST' | 'NORTH_WEST';

export type DirectionZone =
  | 'N'
  | 'NNE'
  | 'NE'
  | 'ENE'
  | 'E'
  | 'ESE'
  | 'SE'
  | 'SSE'
  | 'S'
  | 'SSW'
  | 'SW'
  | 'WSW'
  | 'W'
  | 'WNW'
  | 'NW'
  | 'NNW'
  | 'BRAHMASTHAN';

export type RoomType =
  | 'ENTRANCE'
  | 'LIVING_ROOM'
  | 'KITCHEN'
  | 'MASTER_BEDROOM'
  | 'BEDROOM'
  | 'CHILDREN_BEDROOM'
  | 'GUEST_BEDROOM'
  | 'BATHROOM'
  | 'TOILET'
  | 'POOJA_ROOM'
  | 'DINING_ROOM'
  | 'STAIRCASE'
  | 'BALCONY'
  | 'STUDY_ROOM'
  | 'WATER_TANK_OVERHEAD'
  | 'BOREWELL_UNDERGROUND'
  | 'SEPTIC_TANK'
  | 'STORAGE'
  | 'GARAGE_PARKING'
  | 'GARDEN_COURTYARD';

export type FindingSeverity = 'EXCELLENT' | 'FAVORABLE' | 'REVIEW' | 'MODERATE_CONCERN' | 'HIGH_PRIORITY';

export type KnowledgeBadgeType =
  | 'CLASSICAL_SOURCE'
  | 'TRADITIONAL_INTERPRETATION'
  | 'PERSONALIZED_JYOTISH'
  | 'AI_LAYOUT_INFERENCE'
  | 'MODERN_PRACTICAL';

export type AnalysisFramework =
  | 'CLASSICAL_TEXT'
  | 'TRADITIONAL'
  | 'REGIONAL'
  | 'MODERN_ARCHITECTURAL'
  | 'HYBRID';

export interface RoomItem {
  id: string;
  name: string;
  type: RoomType;
  x: number; // 0-1000
  y: number; // 0-1000
  width: number;
  height: number;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  isEntrance?: boolean;
  notes?: string;
  colorOverride?: string;
}

export interface Property {
  id: string;
  name: string;
  propertyType: PropertyType;
  country: string;
  city: string;
  address?: string;
  facingDirection: FacingDirection;
  northRotation: number; // 0 - 360 degrees
  plotWidth?: number; // in ft or meters
  plotLength?: number;
  numberOfFloors?: number;
  currentFloor?: number;
  status?: PropertyStatus;
  yearBuilt?: number;
  layoutImageUrl?: string;
  rooms: RoomItem[];
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface Finding {
  id: string;
  roomId?: string;
  roomName?: string;
  category: string;
  directionZone: DirectionZone;
  severity: FindingSeverity;
  scoreImpact: number; // e.g. +8, -5
  title: string;
  description: string;
  badge: KnowledgeBadgeType;
  sourceText?: string;
  sourceReference?: string;
  recommendations: {
    level1Architectural?: string;
    level2Interior?: string;
    level3NonStructural?: string;
  };
}

export interface VaastuCategoryScore {
  category: string;
  earnedPoints: number;
  totalPoints: number;
  status: 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'ATTENTION';
  notes: string;
}

export interface VaastuAnalysisReport {
  overallScore: number;
  alignmentRating: 'EXCELLENT' | 'STRONG' | 'MODERATE' | 'NEEDS_OPTIMIZATION';
  categoryScores: VaastuCategoryScore[];
  positiveCount: number;
  reviewCount: number;
  highPriorityCount: number;
  findings: Finding[];
  elementalBalance: {
    earth: number; // 0-100
    water: number;
    fire: number;
    air: number;
    space: number;
  };
}

export interface ClassicalSource {
  id: string;
  name: string;
  author: string;
  historicalPeriod: string;
  language: string;
  script: string;
  reliabilityTier: 'Tier 1 — Classical Primary' | 'Tier 2 — Academic Translation' | 'Tier 3 — Traditional Commentary';
  chapter: string;
  verseOrSection: string;
  sanskritOriginal: string;
  iastTransliteration: string;
  englishTranslation: string;
  hindiTranslation: string;
  practicalInterpretation: string;
  topic: string;
  recommendedDirection?: DirectionZone;
}

export interface BirthProfile {
  consented: boolean;
  fullName: string;
  dob: string;
  tob: string;
  pobCity: string;
  pobState?: string;
  pobCountry?: string;
  gender?: string;
  rashiMoonSign?: string;
  lagnaAscendant?: string;
  nakshatra?: string;
  favorableDirections: DirectionZone[];
  moderatelyFavorableDirections: DirectionZone[];
  sensitiveDirections: DirectionZone[];
  personalizedNotes?: string;
}

export type ThemeMode = 'CELESTIAL_IVORY' | 'ROYAL_INDIGO' | 'TEMPLE_STONE' | 'MIDNIGHT_ARCHITECTURE';

export type UserRole = 'FREE_USER' | 'PRO_USER' | 'CONSULTANT' | 'ADMIN';
