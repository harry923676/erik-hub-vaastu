import { BirthProfile, DirectionZone } from '../types';

export const ZODIAC_RASHIS = [
  { name: 'Mesha (Aries)', rulingPlanet: 'Mars (Mangala)', element: 'Fire (Agni)', favorable: ['E', 'SE', 'S'] as DirectionZone[] },
  { name: 'Vrishabha (Taurus)', rulingPlanet: 'Venus (Shukra)', element: 'Earth (Prithvi)', favorable: ['SE', 'S', 'NW'] as DirectionZone[] },
  { name: 'Mithuna (Gemini)', rulingPlanet: 'Mercury (Budha)', element: 'Air (Vayu)', favorable: ['N', 'NW', 'W'] as DirectionZone[] },
  { name: 'Karka (Cancer)', rulingPlanet: 'Moon (Chandra)', element: 'Water (Jala)', favorable: ['NE', 'N', 'E'] as DirectionZone[] },
  { name: 'Simha (Leo)', rulingPlanet: 'Sun (Surya)', element: 'Fire (Agni)', favorable: ['E', 'NE', 'SE'] as DirectionZone[] },
  { name: 'Kanya (Virgo)', rulingPlanet: 'Mercury (Budha)', element: 'Earth (Prithvi)', favorable: ['N', 'NW', 'S'] as DirectionZone[] },
  { name: 'Tula (Libra)', rulingPlanet: 'Venus (Shukra)', element: 'Air (Vayu)', favorable: ['W', 'NW', 'SE'] as DirectionZone[] },
  { name: 'Vrishchika (Scorpio)', rulingPlanet: 'Mars (Mangala)', element: 'Water (Jala)', favorable: ['S', 'E', 'NE'] as DirectionZone[] },
  { name: 'Dhanu (Sagittarius)', rulingPlanet: 'Jupiter (Guru)', element: 'Fire (Agni)', favorable: ['NE', 'E', 'N'] as DirectionZone[] },
  { name: 'Makara (Capricorn)', rulingPlanet: 'Saturn (Shani)', element: 'Earth (Prithvi)', favorable: ['W', 'SW', 'S'] as DirectionZone[] },
  { name: 'Kumbha (Aquarius)', rulingPlanet: 'Saturn (Shani)', element: 'Air (Vayu)', favorable: ['W', 'NW', 'N'] as DirectionZone[] },
  { name: 'Meena (Pisces)', rulingPlanet: 'Jupiter (Guru)', element: 'Water (Jala)', favorable: ['NE', 'N', 'E'] as DirectionZone[] },
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export function calculateJyotishAffinity(profile: Partial<BirthProfile>): BirthProfile {
  const rashi = ZODIAC_RASHIS.find((r) => r.name === profile.rashiMoonSign) || ZODIAC_RASHIS[3]; // default Cancer / Karka

  const favorable = rashi.favorable;
  const sensitive: DirectionZone[] = ['SW'];
  if (rashi.element === 'Fire (Agni)') {
    sensitive.push('NE');
  }

  const moderatelyFavorable: DirectionZone[] = (['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as DirectionZone[]).filter(
    (d) => !favorable.includes(d) && !sensitive.includes(d)
  );

  return {
    consented: Boolean(profile.consented),
    fullName: profile.fullName || 'Valued Resident',
    dob: profile.dob || '1990-01-01',
    tob: profile.tob || '10:30',
    pobCity: profile.pobCity || 'New Delhi',
    pobCountry: profile.pobCountry || 'India',
    gender: profile.gender || 'Prefer not to say',
    rashiMoonSign: rashi.name,
    lagnaAscendant: profile.lagnaAscendant || 'Simha (Leo)',
    nakshatra: profile.nakshatra || 'Rohini',
    favorableDirections: favorable,
    moderatelyFavorableDirections: moderatelyFavorable,
    sensitiveDirections: sensitive,
    personalizedNotes: `Based on your ${rashi.name} placement ruled by ${rashi.rulingPlanet}, your primary personal focus quadrant is ${favorable.join(', ')}. Keep this in mind when positioning your personal desk or preferred study chair. Note: Universal property Vaastu scores remain independent of personal astrological charts.`,
  };
}
