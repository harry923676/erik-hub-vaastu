import React, { useState } from 'react';
import { User, Shield, Compass, Sparkles, Check, AlertCircle, Info, Clock } from 'lucide-react';
import { BirthProfile } from '../../types';
import { calculateJyotishAffinity, ZODIAC_RASHIS, NAKSHATRAS } from '../../utils/jyotishEngine';
import { CitySearchInput, CityItem } from '../common/CitySearchInput';
import { CalendarPicker } from '../common/CalendarPicker';

interface JyotishProfileViewProps {
  birthProfile: BirthProfile;
  onUpdateProfile: (profile: BirthProfile) => void;
}

export const JyotishProfileView: React.FC<JyotishProfileViewProps> = ({
  birthProfile,
  onUpdateProfile,
}) => {
  const [consented, setConsented] = useState(birthProfile.consented);
  const [fullName, setFullName] = useState(birthProfile.fullName);
  const [dob, setDob] = useState(birthProfile.dob);
  const [tob, setTob] = useState(birthProfile.tob);
  const [pobCity, setPobCity] = useState(birthProfile.pobCity);
  const [rashi, setRashi] = useState(birthProfile.rashiMoonSign || ZODIAC_RASHIS[3].name);
  const [nakshatra, setNakshatra] = useState(birthProfile.nakshatra || NAKSHATRAS[3]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const calculated = calculateJyotishAffinity({
      consented,
      fullName,
      dob,
      tob,
      pobCity,
      rashiMoonSign: rashi,
      nakshatra,
    });
    onUpdateProfile(calculated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 to-stone-900 text-white p-6 rounded-2xl shadow-sm space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
            Personalization Module (Optional)
          </span>
          <span className="text-xs text-stone-300">•</span>
          <span className="text-xs text-stone-300">Jyotish Spatial Alignment</span>
        </div>
        <h1 className="text-2xl font-bold font-serif tracking-tight">
          Resident Astrological Profile & Directional Affinity
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
          Integrate individual astrological affinities (Rashi, Lagna, Nakshatra) to tailor recommendations for private personal desk orientation, reading nooks, and study positions.
        </p>
      </div>

      {/* Strict Ethical & Architectural Boundary Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm">Fundamental Architectural Separation Notice</span>
          <p className="leading-relaxed">
            Universal Vaastu Shastra principles (sunlight paths, geomagnetic gradients, ventilation) remain <strong>objective and independent of birth horoscopes</strong>. Astrological insights apply strictly as optional personal micro-adjustments (e.g. personal chair facing or favorite study sector) and never alter the universal architectural score of the building itself.
          </p>
        </div>
      </div>

      {/* Consent & Form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="consentCheck"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="consentCheck" className="text-xs font-semibold text-stone-800 cursor-pointer">
              I consent to using birth chart data for personalized spatial orientation advice.
            </label>
          </div>
          <span className="text-xs text-stone-400">100% Private & Client-Controlled</span>
        </div>

        {consented && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Resident Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <CitySearchInput
                  value={pobCity}
                  onChange={(val) => setPobCity(val)}
                  label="Birth City / Place of Birth (Real-time Search)"
                  placeholder="Search city (e.g. Varanasi, Mumbai, New Delhi, London...)"
                  required
                />
              </div>

              <div className="space-y-1">
                <CalendarPicker
                  value={dob}
                  onChange={(dateStr) => setDob(dateStr)}
                  label="Date of Birth"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Time of Birth (Approximate)</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 bg-white text-stone-900 shadow-2xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Moon Sign (Rāśi)</label>
                <select
                  value={rashi}
                  onChange={(e) => setRashi(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 bg-white"
                >
                  {ZODIAC_RASHIS.map((z) => (
                    <option key={z.name} value={z.name}>
                      {z.name} — Ruled by {z.rulingPlanet} ({z.element})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Birth Star (Nakshatra)</label>
                <select
                  value={nakshatra}
                  onChange={(e) => setNakshatra(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 bg-white"
                >
                  {NAKSHATRAS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              {savedSuccess ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <Check className="w-4 h-4" />
                  <span>Jyotish profile updated and calculated!</span>
                </div>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Calculate Directional Affinity</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Calculated Directional Affinity Cards */}
      {consented && birthProfile.rashiMoonSign && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900 font-serif">
            Calculated Personal Spatial Affinities for {birthProfile.fullName}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Highly Favorable Sectors
              </span>
              <div className="text-lg font-bold font-mono text-emerald-900">
                {birthProfile.favorableDirections.join(', ')}
              </div>
              <p className="text-[11px] text-emerald-700">
                Ideal quadrants for your primary work desk, study corner, or morning reading chair.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                Secondary Harmonic Sectors
              </span>
              <div className="text-lg font-bold font-mono text-blue-900">
                {birthProfile.moderatelyFavorableDirections.slice(0, 3).join(', ')}
              </div>
              <p className="text-[11px] text-blue-700">
                Comfortable for general activities, dining, and social seating.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Sensitive Sector
              </span>
              <div className="text-lg font-bold font-mono text-amber-900">
                {birthProfile.sensitiveDirections.join(', ')}
              </div>
              <p className="text-[11px] text-amber-700">
                Avoid sitting facing directly into this sector during intense focus work.
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
            {birthProfile.personalizedNotes}
          </p>
        </div>
      )}
    </div>
  );
};
