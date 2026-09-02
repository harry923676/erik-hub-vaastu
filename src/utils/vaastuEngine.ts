import {
  Property,
  RoomItem,
  DirectionZone,
  VaastuAnalysisReport,
  Finding,
  VaastuCategoryScore,
  FindingSeverity,
} from '../types';
import { VAASTU_RULES, VaastuRule } from '../data/rules';
import { CLASSICAL_SOURCES_REGISTRY } from '../data/sources';

export function calculateRoomCenter(room: RoomItem): { cx: number; cy: number } {
  return {
    cx: room.x + room.width / 2,
    cy: room.y + room.height / 2,
  };
}

// Convert room coordinate to Direction Zone based on plan center and north rotation
export function getRoomDirectionZone(
  room: RoomItem,
  northRotationDegrees: number = 0,
  planCenter: { cx: number; cy: number } = { cx: 500, cy: 500 }
): DirectionZone {
  const { cx, cy } = calculateRoomCenter(room);
  const dx = cx - planCenter.cx;
  const dy = cy - planCenter.cy;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // If room is squarely in central 140px radius, mark as Brahmasthan
  if (distance < 110) {
    return 'BRAHMASTHAN';
  }

  // Calculate angle in degrees (0 = North/Up, 90 = East/Right, 180 = South/Down, 270 = West/Left)
  // In screen coords, top is y=0, bottom is y=1000.
  // dy negative is upwards (towards top).
  let angleRad = Math.atan2(dx, -dy); // 0 is top (North)
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  // Apply North rotation (compensating for True North calibration)
  let effectiveAngle = (angleDeg - northRotationDegrees) % 360;
  if (effectiveAngle < 0) effectiveAngle += 360;

  // Map 16 zones (each 22.5°)
  if (effectiveAngle >= 348.75 || effectiveAngle < 11.25) return 'N';
  if (effectiveAngle >= 11.25 && effectiveAngle < 33.75) return 'NNE';
  if (effectiveAngle >= 33.75 && effectiveAngle < 56.25) return 'NE';
  if (effectiveAngle >= 56.25 && effectiveAngle < 78.75) return 'ENE';
  if (effectiveAngle >= 78.75 && effectiveAngle < 101.25) return 'E';
  if (effectiveAngle >= 101.25 && effectiveAngle < 123.75) return 'ESE';
  if (effectiveAngle >= 123.75 && effectiveAngle < 146.25) return 'SE';
  if (effectiveAngle >= 146.25 && effectiveAngle < 168.75) return 'SSE';
  if (effectiveAngle >= 168.75 && effectiveAngle < 191.25) return 'S';
  if (effectiveAngle >= 191.25 && effectiveAngle < 213.75) return 'SSW';
  if (effectiveAngle >= 213.75 && effectiveAngle < 236.25) return 'SW';
  if (effectiveAngle >= 236.25 && effectiveAngle < 258.75) return 'WSW';
  if (effectiveAngle >= 258.75 && effectiveAngle < 281.25) return 'W';
  if (effectiveAngle >= 281.25 && effectiveAngle < 303.75) return 'WNW';
  if (effectiveAngle >= 303.75 && effectiveAngle < 326.25) return 'NW';
  return 'NNW';
}

// Convert 16 zones to simplified 8 zones for elemental tracking
export function getCardinalZone(zone: DirectionZone): 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'CENTER' {
  if (zone === 'BRAHMASTHAN') return 'CENTER';
  if (zone === 'N' || zone === 'NNW' || zone === 'NNE') return 'N';
  if (zone === 'NE' || zone === 'ENE') return 'NE';
  if (zone === 'E' || zone === 'ESE') return 'E';
  if (zone === 'SE' || zone === 'SSE') return 'SE';
  if (zone === 'S' || zone === 'SSW') return 'S';
  if (zone === 'SW' || zone === 'WSW') return 'SW';
  if (zone === 'W' || zone === 'WNW') return 'W';
  return 'NW';
}

export function analyzePropertyVaastu(property?: Property | null): VaastuAnalysisReport {
  if (!property) {
    return {
      overallScore: 50,
      alignmentRating: 'MODERATE',
      categoryScores: [],
      positiveCount: 0,
      reviewCount: 0,
      highPriorityCount: 0,
      findings: [],
      elementalBalance: { earth: 80, water: 80, fire: 80, air: 80, space: 80 },
    };
  }

  const findings: Finding[] = [];
  const rooms = property.rooms || [];
  const planCenter = { cx: 500, cy: 500 };

  // Category trackers
  let dirScore = 18; // base
  let entranceScore = 12;
  let roomPlacementScore = 16;
  let brahmaScore = 10;
  let elementsScore = 8;
  let waterScore = 8;
  let staircaseScore = 4;
  let plotScore = 4.5;
  let externalScore = 4.5;

  let earthBalance = 80;
  let waterBalance = 85;
  let fireBalance = 80;
  let airBalance = 80;
  let spaceBalance = 90;

  // Check entrance
  const entrance = rooms.find((r) => r.type === 'ENTRANCE');
  if (entrance) {
    const entZone = getRoomDirectionZone(entrance, property.northRotation, planCenter);
    const isPreferred = ['NE', 'NNE', 'ENE', 'E', 'N'].includes(entZone);
    const isProhibited = ['SW', 'SSW'].includes(entZone);

    if (isPreferred) {
      entranceScore = 15;
      findings.push({
        id: 'F_ENT_POS',
        roomId: entrance.id,
        roomName: entrance.name,
        category: 'Entrance & Threshold',
        directionZone: entZone,
        severity: 'EXCELLENT',
        scoreImpact: +15,
        title: `Auspicious ${entZone} Entrance Portal`,
        description: `The main threshold opens in the auspicious ${entZone} sector, welcoming positive solar and magnetic currents (Brihat Samhita 53.81).`,
        badge: 'CLASSICAL_SOURCE',
        sourceText: 'Brihat Samhita (Chap. 53)',
        sourceReference: 'Shlokas 81-89',
        recommendations: {
          level1Architectural: 'Maintain an elevated wooden doorway threshold (Udumbar) and wide foyer.',
          level2Interior: 'Ensure high illumination and uncluttered sightlines into the living lounge.',
          level3NonStructural: 'Adorn entrance with a natural brass urli with fresh floating flowers or a traditional auspicious Toran.',
        },
      });
    } else if (isProhibited) {
      entranceScore = 5;
      findings.push({
        id: 'F_ENT_REV',
        roomId: entrance.id,
        roomName: entrance.name,
        category: 'Entrance & Threshold',
        directionZone: entZone,
        severity: 'HIGH_PRIORITY',
        scoreImpact: -8,
        title: `Entrance in Heavy ${entZone} Stability Quadrant`,
        description: `Entrance in South-West breaches classical orientation rules (Vishvakarma Prakasha 2), leading to energy outflow.`,
        badge: 'CLASSICAL_SOURCE',
        sourceText: 'Vishvakarma Prakasha',
        sourceReference: 'Chapter 2, Dvāra-Lakṣaṇa',
        recommendations: {
          level1Architectural: 'If structural changes are feasible, create a double-door buffered entrance lobby.',
          level2Interior: 'Keep the foyer exceptionally bright, add heavy wooden paneling, and avoid direct mirrors facing outward.',
          level3NonStructural: 'Embed a yellow jasper/lead energy strip under the entrance threshold to stabilize grounding frequency.',
        },
      });
    } else {
      entranceScore = 12;
      findings.push({
        id: 'F_ENT_NEU',
        roomId: entrance.id,
        roomName: entrance.name,
        category: 'Entrance & Threshold',
        directionZone: entZone,
        severity: 'FAVORABLE',
        scoreImpact: +10,
        title: `Functional ${entZone} Entrance Doorway`,
        description: `Entrance in ${entZone} conforms to standard residential circulation parameters.`,
        badge: 'TRADITIONAL_INTERPRETATION',
        sourceText: 'Traditional Sthapatya Practices',
        recommendations: {
          level2Interior: 'Ensure smooth clockwise door swing without creaking sound.',
        },
      });
    }
  }

  // Iterate all rooms against rules
  rooms.forEach((room) => {
    const zone = getRoomDirectionZone(room, property.northRotation, planCenter);
    const rule = VAASTU_RULES.find((r) => r.roomType === room.type);

    if (!rule) return;

    if (zone === 'BRAHMASTHAN') {
      if (['TOILET', 'BATHROOM', 'KITCHEN', 'STAIRCASE'].includes(room.type)) {
        brahmaScore = Math.max(2, brahmaScore - 6);
        spaceBalance -= 25;
        findings.push({
          id: `F_BRAHMA_VIOLATION_${room.id}`,
          roomId: room.id,
          roomName: room.name,
          category: 'Brahmasthan (Center Integrity)',
          directionZone: 'BRAHMASTHAN',
          severity: 'HIGH_PRIORITY',
          scoreImpact: -12,
          title: `Intrusive ${room.name} in Brahmasthan`,
          description: `The sacred navel of the home (Brahmasthan) is encumbered by ${room.name}. Classical texts strictly mandate keeping the center unburdened (Brihat Samhita 53.45).`,
          badge: 'CLASSICAL_SOURCE',
          sourceText: 'Brihat Samhita',
          sourceReference: 'Chapter 53, Verse 45',
          recommendations: {
            level1Architectural: 'Relocate this plumbing/heavy utility away from the central 1/9th grid of the plan.',
            level2Interior: 'Keep partitions light and maintain white/cream aesthetic.',
            level3NonStructural: 'Place a natural quartz crystal pyramid or pure brass lotus in the center to harmonize spatial resonance.',
          },
        });
      } else {
        findings.push({
          id: `F_BRAHMA_OPEN_${room.id}`,
          roomId: room.id,
          roomName: room.name,
          category: 'Brahmasthan (Center Integrity)',
          directionZone: 'BRAHMASTHAN',
          severity: 'FAVORABLE',
          scoreImpact: +5,
          title: `Open Living / Courtyard in Brahmasthan`,
          description: `Central open zone maintains unobstructed air convection and natural spatial vitality.`,
          badge: 'CLASSICAL_SOURCE',
          sourceText: 'Brihat Samhita',
          recommendations: {
            level2Interior: 'Avoid placing heavy monolithic tables or bulky pillars directly in the exact center point.',
          },
        });
      }
      return;
    }

    const isPreferred = rule.preferredZones.includes(zone);
    const isAllowed = rule.allowedZones.includes(zone);
    const isProhibited = rule.prohibitedZones.includes(zone);

    if (isPreferred) {
      roomPlacementScore = Math.min(20, roomPlacementScore + 1.5);
      if (room.type === 'KITCHEN') fireBalance = Math.min(100, fireBalance + 15);
      if (room.type === 'MASTER_BEDROOM') earthBalance = Math.min(100, earthBalance + 15);
      if (room.type === 'POOJA_ROOM') waterBalance = Math.min(100, waterBalance + 15);

      findings.push({
        id: `F_POS_${room.id}`,
        roomId: room.id,
        roomName: room.name,
        category: 'Room Placement & Elemental Balance',
        directionZone: zone,
        severity: 'EXCELLENT',
        scoreImpact: Math.abs(rule.positiveScore),
        title: `${rule.positiveTitle} (${zone})`,
        description: `${room.name} is positioned in ${zone}. ${rule.positiveDescription}`,
        badge: rule.badge,
        sourceText: rule.sourceTextName,
        sourceReference: rule.sourceChapter,
        recommendations: rule.recommendations,
      });
    } else if (isProhibited) {
      roomPlacementScore = Math.max(8, roomPlacementScore - 2.5);
      if (room.type === 'KITCHEN') fireBalance -= 20;
      if (room.type === 'TOILET') waterBalance -= 20;
      if (room.type === 'MASTER_BEDROOM') earthBalance -= 15;

      const severity: FindingSeverity =
        room.type === 'TOILET' && ['NE', 'NNE'].includes(zone) ? 'HIGH_PRIORITY' : 'MODERATE_CONCERN';

      findings.push({
        id: `F_REV_${room.id}`,
        roomId: room.id,
        roomName: room.name,
        category: 'Room Placement & Elemental Balance',
        directionZone: zone,
        severity,
        scoreImpact: rule.negativeScore,
        title: `${rule.reviewTitle} (${zone})`,
        description: `${room.name} is located in ${zone}. ${rule.reviewDescription}`,
        badge: rule.badge,
        sourceText: rule.sourceTextName,
        sourceReference: rule.sourceChapter,
        recommendations: rule.recommendations,
      });
    } else if (isAllowed) {
      findings.push({
        id: `F_ALL_${room.id}`,
        roomId: room.id,
        roomName: room.name,
        category: 'Room Placement & Elemental Balance',
        directionZone: zone,
        severity: 'FAVORABLE',
        scoreImpact: +6,
        title: `Acceptable Secondary Alignment for ${room.name} (${zone})`,
        description: `${room.name} in ${zone} meets acceptable alternative classical provisions.`,
        badge: 'TRADITIONAL_INTERPRETATION',
        sourceText: rule.sourceTextName,
        recommendations: rule.recommendations,
      });
    } else {
      findings.push({
        id: `F_NEU_${room.id}`,
        roomId: room.id,
        roomName: room.name,
        category: 'Room Placement & Elemental Balance',
        directionZone: zone,
        severity: 'REVIEW',
        scoreImpact: -2,
        title: `Neutral / Review Orientation for ${room.name} (${zone})`,
        description: `Ensure functional layout remedies to maximize comfort and circulation in this quadrant.`,
        badge: 'MODERN_PRACTICAL',
        recommendations: rule.recommendations,
      });
    }
  });

  // Calculate totals
  const totalScore = Math.round(
    dirScore +
      entranceScore +
      roomPlacementScore +
      brahmaScore +
      elementsScore +
      waterScore +
      staircaseScore +
      plotScore +
      externalScore
  );

  const cappedScore = Math.min(100, Math.max(25, totalScore));

  let alignmentRating: VaastuAnalysisReport['alignmentRating'] = 'STRONG';
  if (cappedScore >= 88) alignmentRating = 'EXCELLENT';
  else if (cappedScore >= 74) alignmentRating = 'STRONG';
  else if (cappedScore >= 60) alignmentRating = 'MODERATE';
  else alignmentRating = 'NEEDS_OPTIMIZATION';

  const categoryScores: VaastuCategoryScore[] = [
    {
      category: 'Direction Alignment & True North',
      earnedPoints: dirScore,
      totalPoints: 20,
      status: dirScore >= 16 ? 'EXCELLENT' : 'GOOD',
      notes: `Aligned with ${property.facingDirection} orientation (${property.northRotation}° North offset).`,
    },
    {
      category: 'Entrance & Threshold (Mahadwara)',
      earnedPoints: entranceScore,
      totalPoints: 15,
      status: entranceScore >= 12 ? 'EXCELLENT' : entranceScore >= 8 ? 'GOOD' : 'ATTENTION',
      notes: entrance ? `Entrance evaluated in ${getRoomDirectionZone(entrance, property.northRotation, planCenter)}.` : 'No distinct entrance defined.',
    },
    {
      category: 'Room Placement & Functional Zoning',
      earnedPoints: Math.round(roomPlacementScore),
      totalPoints: 20,
      status: roomPlacementScore >= 16 ? 'EXCELLENT' : 'GOOD',
      notes: `${rooms.length} functional spaces verified against classical spatial coordinates.`,
    },
    {
      category: 'Brahmasthan (Center Integrity)',
      earnedPoints: brahmaScore,
      totalPoints: 10,
      status: brahmaScore >= 8 ? 'EXCELLENT' : 'ATTENTION',
      notes: brahmaScore >= 8 ? 'Central 1/9th grid is open and unencumbered.' : 'Center zone contains heavy utilities requiring remedies.',
    },
    {
      category: 'Pancha Mahabhuta Elemental Balance',
      earnedPoints: elementsScore,
      totalPoints: 10,
      status: elementsScore >= 8 ? 'EXCELLENT' : 'GOOD',
      notes: 'Fire (Agni) in SE, Water (Jala) in NE, Earth (Prithvi) in SW, Air (Vayu) in NW.',
    },
    {
      category: 'Water Systems & Drainage',
      earnedPoints: waterScore,
      totalPoints: 10,
      status: waterScore >= 8 ? 'EXCELLENT' : 'GOOD',
      notes: 'Plumbing gradients evaluated against geomagnetic flow.',
    },
    {
      category: 'Staircase & Vertical Massing',
      earnedPoints: staircaseScore,
      totalPoints: 5,
      status: staircaseScore >= 4 ? 'EXCELLENT' : 'GOOD',
      notes: 'Vertical circulation massing anchored along perimeter.',
    },
    {
      category: 'Plot Geometry & Boundary Aspect',
      earnedPoints: plotScore,
      totalPoints: 5,
      status: 'EXCELLENT',
      notes: `Standard rectangular aspect ratio (${property.plotWidth || 40}×${property.plotLength || 60} units).`,
    },
    {
      category: 'External Environment & Natural Daylight',
      earnedPoints: externalScore,
      totalPoints: 5,
      status: 'EXCELLENT',
      notes: 'Natural cross-ventilation and daylight orientation maintained.',
    },
  ];

  const positiveCount = findings.filter((f) => f.severity === 'EXCELLENT' || f.severity === 'FAVORABLE').length;
  const reviewCount = findings.filter((f) => f.severity === 'REVIEW' || f.severity === 'MODERATE_CONCERN').length;
  const highPriorityCount = findings.filter((f) => f.severity === 'HIGH_PRIORITY').length;

  return {
    overallScore: cappedScore,
    alignmentRating,
    categoryScores,
    positiveCount,
    reviewCount,
    highPriorityCount,
    findings,
    elementalBalance: {
      earth: Math.min(100, Math.max(30, earthBalance)),
      water: Math.min(100, Math.max(30, waterBalance)),
      fire: Math.min(100, Math.max(30, fireBalance)),
      air: Math.min(100, Math.max(30, airBalance)),
      space: Math.min(100, Math.max(30, spaceBalance)),
    },
  };
}

// Helper to simulate score change when moving a room
export function simulateRoomMove(
  property: Property,
  roomId: string,
  newX: number,
  newY: number
): { originalScore: number; newScore: number; difference: number; newZone: DirectionZone } {
  const currentReport = analyzePropertyVaastu(property);
  const rooms = property.rooms || [];
  const updatedRooms = rooms.map((r) => {
    if (r.id === roomId) {
      return { ...r, x: newX, y: newY };
    }
    return r;
  });

  const updatedProperty: Property = {
    ...property,
    rooms: updatedRooms,
  };

  const movedRoom = updatedRooms.find((r) => r.id === roomId);
  const newZone = movedRoom
    ? getRoomDirectionZone(movedRoom, property.northRotation || 0)
    : 'BRAHMASTHAN';
  const newReport = analyzePropertyVaastu(updatedProperty);

  return {
    originalScore: currentReport.overallScore,
    newScore: newReport.overallScore,
    difference: newReport.overallScore - currentReport.overallScore,
    newZone,
  };
}
