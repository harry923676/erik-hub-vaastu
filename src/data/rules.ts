import { DirectionZone, RoomType, FindingSeverity, KnowledgeBadgeType } from '../types';

export interface VaastuRule {
  id: string;
  ruleCode: string;
  roomType: RoomType;
  allowedZones: DirectionZone[];
  preferredZones: DirectionZone[];
  prohibitedZones: DirectionZone[];
  title: string;
  positiveTitle: string;
  reviewTitle: string;
  positiveDescription: string;
  reviewDescription: string;
  badge: KnowledgeBadgeType;
  sourceTextName: string;
  sourceChapter: string;
  positiveScore: number;
  negativeScore: number;
  recommendations: {
    level1Architectural: string;
    level2Interior: string;
    level3NonStructural: string;
  };
}

export const VAASTU_RULES: VaastuRule[] = [
  {
    id: 'RULE_KITCHEN_PLACEMENT',
    ruleCode: 'VR_KIT_01',
    roomType: 'KITCHEN',
    preferredZones: ['SE', 'ESE'],
    allowedZones: ['SE', 'ESE', 'NW', 'WNW'],
    prohibitedZones: ['NE', 'NNE', 'SW', 'SSW', 'BRAHMASTHAN'],
    title: 'Kitchen (Agni Tatva - Fire Sector)',
    positiveTitle: 'Kitchen Aligned in Fire / Dynamic Zone',
    reviewTitle: 'Kitchen in Elemental Conflict Zone',
    positiveDescription: 'Positioned in the South-East (Agneya) or North-West (Vayavya), in strict alignment with solar thermal dynamics and Agni Purana guidelines.',
    reviewDescription: 'Located in a sensitive sector (such as North-East water zone or South-West stability zone), creating an elemental thermal mismatch.',
    badge: 'CLASSICAL_SOURCE',
    sourceTextName: 'Mayamata & Agni Purana',
    sourceChapter: 'Mayamata 26.14 & Agni Purana 106',
    positiveScore: 18,
    negativeScore: -14,
    recommendations: {
      level1Architectural: 'If remodeling or constructing, relocate cooktop to the South-East quadrant or separate dry preparation from active gas burners with a heat buffer.',
      level2Interior: 'Ensure the cook faces East while cooking. Keep cooking range and water sink separated by at least 3 feet of dry granite/counter space.',
      level3NonStructural: 'Introduce warm fire-element grounding: use light peach/cream tiles, brass kitchenware, or a polished copper accessory near the cooktop.',
    },
  },
  {
    id: 'RULE_MASTER_BEDROOM_PLACEMENT',
    ruleCode: 'VR_MBR_02',
    roomType: 'MASTER_BEDROOM',
    preferredZones: ['SW', 'SSW', 'S', 'WSW'],
    allowedZones: ['SW', 'SSW', 'S', 'WSW', 'W'],
    prohibitedZones: ['NE', 'NNE', 'SE', 'BRAHMASTHAN'],
    title: 'Master Bedroom (Prithvi Tatva - Earth & Stability)',
    positiveTitle: 'Master Bedroom in Prime Heavy Stability Zone',
    reviewTitle: 'Master Bedroom in Light Spiritual or Fire Zone',
    positiveDescription: 'Positioned in South-West (Nirriti), the heaviest and most grounded quadrant, supporting calm rest and decisive family leadership (Samarangana Sutradhara 38).',
    reviewDescription: 'Located in North-East (light water zone) or South-East (fire zone), which can cause thermal overheating or restless sleep cycles.',
    badge: 'CLASSICAL_SOURCE',
    sourceTextName: 'Samarangana Sutradhara',
    sourceChapter: 'Chapter 38, Verses 51-54',
    positiveScore: 18,
    negativeScore: -12,
    recommendations: {
      level1Architectural: 'Maintain thicker walls, solid doors, and minimum exterior large glass openings towards South-West to reduce afternoon solar heat gain.',
      level2Interior: 'Position bed headboard towards South or East so you sleep with crown of head towards magnetic South or solar East.',
      level3NonStructural: 'Use grounding earthy tones (warm sand, biscuit, terracotta) and solid wooden furniture rather than hollow metal beds.',
    },
  },
  {
    id: 'RULE_POOJA_MEDITATION_PLACEMENT',
    ruleCode: 'VR_PJA_03',
    roomType: 'POOJA_ROOM',
    preferredZones: ['NE', 'NNE', 'E', 'ENE', 'N'],
    allowedZones: ['NE', 'NNE', 'E', 'ENE', 'N'],
    prohibitedZones: ['SW', 'SSW', 'S', 'SE'],
    title: 'Pooja & Meditation Sanctuary (Ishanya)',
    positiveTitle: 'Sanctuary Located in Sacred North-East Gradient',
    reviewTitle: 'Prayer Area Positioned in Heavy or Waste Zone',
    positiveDescription: 'Situated in the North-East (Ishanya, ruled by Shiva/Soma), capturing sacred morning solar spectrum and peaceful geomagnetic energy.',
    reviewDescription: 'Positioned under stairs, adjoining a toilet, or in South-West, counteracting quiet contemplative reflection.',
    badge: 'CLASSICAL_SOURCE',
    sourceTextName: 'Manasara Shilpa Shastra',
    sourceChapter: 'Chapter 9, Verses 28-32',
    positiveScore: 15,
    negativeScore: -10,
    recommendations: {
      level1Architectural: 'Keep room open to East or North light with clear ventilation corridors.',
      level2Interior: 'Ensure idols/sanctum face West or South so that devotees face East or North while praying or meditating.',
      level3NonStructural: 'Maintain serene white or light golden illumination; avoid placing heavy storage cupboards in this room.',
    },
  },
  {
    id: 'RULE_ENTRANCE_PLACEMENT',
    ruleCode: 'VR_ENT_04',
    roomType: 'ENTRANCE',
    preferredZones: ['NE', 'E', 'N', 'ENE', 'NNE'],
    allowedZones: ['NE', 'E', 'N', 'ENE', 'NNE', 'NW', 'SE', 'W'],
    prohibitedZones: ['SW', 'SSW'],
    title: 'Main Entrance & Mahadwara (Threshold Energy)',
    positiveTitle: 'Main Entrance in Highly Auspicious Solar/Lunar Arc',
    reviewTitle: 'Main Entrance in Heavy Obstructed Sector',
    positiveDescription: 'Entrance falls within auspicious padas (such as Jayanta, Indra, Mukhya, or Bhallata) with unobstructed welcoming sightlines (Brihat Samhita 53).',
    reviewDescription: 'Entrance located in South-West (Nirriti Pada) or obstructed by immediate stair treads or septic line.',
    badge: 'CLASSICAL_SOURCE',
    sourceTextName: 'Brihat Samhita & Vishvakarma Prakasha',
    sourceChapter: 'Brihat Samhita 53.81 & VKP 2',
    positiveScore: 15,
    negativeScore: -10,
    recommendations: {
      level1Architectural: 'Provide a distinct well-lit foyer with an elevated doorway sill (Udumbar) and ensure the door swings inwards clockwise.',
      level2Interior: 'Remove clutter, shoe racks, and dark mirrors right facing the entrance door.',
      level3NonStructural: 'Illuminate the main foyer with warm 2700K ambient light; add auspicious auspicious greenery or brass urli near entry.',
    },
  },
  {
    id: 'RULE_TOILET_BATHROOM_PLACEMENT',
    ruleCode: 'VR_TLT_05',
    roomType: 'TOILET',
    preferredZones: ['WNW', 'SSW', 'WSW', 'S', 'W'],
    allowedZones: ['WNW', 'SSW', 'WSW', 'S', 'W', 'NW'],
    prohibitedZones: ['NE', 'NNE', 'BRAHMASTHAN', 'E'],
    title: 'Toilet & Waste Drainage (Visarga Zone)',
    positiveTitle: 'Waste Drainage Located in Approved De-energizing Zone',
    reviewTitle: 'Toilet Located in Sensitive Water or Sacred Zone',
    positiveDescription: 'Located in West-North-West (depression/release zone) or South-South-West (expenditure zone), safely channeling away wastewater.',
    reviewDescription: 'Toilet directly placed in North-East (Ishanya) or Brahmasthan, which represents an architectural sanitation and electromagnetic conflict.',
    badge: 'TRADITIONAL_INTERPRETATION',
    sourceTextName: 'Vishvakarma Prakasha & Traditional Sthapatya',
    sourceChapter: 'Griha-Pariśuddhi Section',
    positiveScore: 12,
    negativeScore: -15,
    recommendations: {
      level1Architectural: 'Do not allow toilet commode directly above or below sacred pooja areas or kitchens in multi-story houses.',
      level2Interior: 'Orient commode seat along North-South or South-North axis rather than directly facing East.',
      level3NonStructural: 'Keep toilet door permanently closed; place a bowl of natural Himalayan sea salt in a ceramic dish to absorb damp stagnant humidity.',
    },
  },
  {
    id: 'RULE_LIVING_ROOM_PLACEMENT',
    ruleCode: 'VR_LIV_06',
    roomType: 'LIVING_ROOM',
    preferredZones: ['N', 'NE', 'E', 'NW'],
    allowedZones: ['N', 'NE', 'E', 'NW', 'W', 'SE'],
    prohibitedZones: ['SW'],
    title: 'Living & Social Reception Area',
    positiveTitle: 'Living Area Optimally Oriented for Natural Daylight',
    reviewTitle: 'Living Area Sub-optimally Positioned',
    positiveDescription: 'Enjoys open northern or eastern daylight, inviting natural vitality, ventilation, and social cohesion.',
    reviewDescription: 'Constrained without adequate daylight or competing with private quarters.',
    badge: 'MODERN_PRACTICAL',
    sourceTextName: 'Modern Architectural Integration & Mayamata',
    sourceChapter: 'Chapter 26 (Gṛhavinyāsa)',
    positiveScore: 12,
    negativeScore: -4,
    recommendations: {
      level1Architectural: 'Maximize window-to-wall ratio along North and East to invite diffuse daylight without solar heat glare.',
      level2Interior: 'Arrange heavy sofas along South or West walls; keep center of living room uncluttered.',
      level3NonStructural: 'Incorporate live indoor plants (e.g. peace lily, money plant) in North or East corners.',
    },
  },
  {
    id: 'RULE_STAIRCASE_PLACEMENT',
    ruleCode: 'VR_STR_07',
    roomType: 'STAIRCASE',
    preferredZones: ['S', 'SW', 'W', 'NW'],
    allowedZones: ['S', 'SW', 'W', 'NW', 'SE'],
    prohibitedZones: ['NE', 'NNE', 'BRAHMASTHAN'],
    title: 'Staircase & Vertical Massing',
    positiveTitle: 'Staircase Anchored in Heavy Southern/Western Perimeter',
    reviewTitle: 'Staircase Burdening Light or Central Zone',
    positiveDescription: 'Acts as structural thermal buffer against harsh western sun while ascending smoothly in clockwise (pradakshina) flow.',
    reviewDescription: 'Placed in North-East or Brahmasthan, loading the most delicate energetic sectors with massive concrete deadweight.',
    badge: 'CLASSICAL_SOURCE',
    sourceTextName: 'Aparajitaprccha',
    sourceChapter: 'Sutra 72 (Sopāna-Vidhi)',
    positiveScore: 8,
    negativeScore: -8,
    recommendations: {
      level1Architectural: 'Ensure stairs turn clockwise as you ascend. Keep area beneath stairs clean and free from pooja altars or water dispensers.',
      level2Interior: 'Add bright illumination on staircase landings to prevent shadowed zones.',
      level3NonStructural: 'If stairs are in North-East, paint surrounding walls soft ivory and avoid heavy stone cladding.',
    },
  },
];
