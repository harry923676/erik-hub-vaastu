import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, X, Globe, Sparkles, Navigation } from 'lucide-react';

export interface CityItem {
  id: string;
  name: string;
  admin1?: string; // State / Province
  country: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isSacredOrHistoric?: boolean;
}

// Curated high-precision database of major Indian cities, sacred cultural centers & world hubs
const CURATED_CITIES: CityItem[] = [
  // Sacred & Historic Indian Centers
  { id: 'c_varanasi', name: 'Varanasi (Kashi)', admin1: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, isSacredOrHistoric: true },
  { id: 'c_ujjain', name: 'Ujjain (Avantika)', admin1: 'Madhya Pradesh', country: 'India', latitude: 23.1765, longitude: 75.7885, isSacredOrHistoric: true },
  { id: 'c_ayodhya', name: 'Ayodhya', admin1: 'Uttar Pradesh', country: 'India', latitude: 26.7922, longitude: 82.1998, isSacredOrHistoric: true },
  { id: 'c_haridwar', name: 'Haridwar', admin1: 'Uttarakhand', country: 'India', latitude: 29.9457, longitude: 78.1642, isSacredOrHistoric: true },
  { id: 'c_rishikesh', name: 'Rishikesh', admin1: 'Uttarakhand', country: 'India', latitude: 30.0869, longitude: 78.2676, isSacredOrHistoric: true },
  { id: 'c_mathura', name: 'Mathura', admin1: 'Uttar Pradesh', country: 'India', latitude: 27.4924, longitude: 77.6737, isSacredOrHistoric: true },
  { id: 'c_tirupati', name: 'Tirupati', admin1: 'Andhra Pradesh', country: 'India', latitude: 13.6288, longitude: 79.4192, isSacredOrHistoric: true },
  { id: 'c_puri', name: 'Puri', admin1: 'Odisha', country: 'India', latitude: 19.8135, longitude: 85.8312, isSacredOrHistoric: true },
  { id: 'c_madurai', name: 'Madurai', admin1: 'Tamil Nadu', country: 'India', latitude: 9.9252, longitude: 78.1198, isSacredOrHistoric: true },
  { id: 'c_amritsar', name: 'Amritsar', admin1: 'Punjab', country: 'India', latitude: 31.634, longitude: 74.8723, isSacredOrHistoric: true },

  // Major Indian Metros & State Capitals
  { id: 'c_delhi', name: 'New Delhi', admin1: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.209 },
  { id: 'c_mumbai', name: 'Mumbai', admin1: 'Maharashtra', country: 'India', latitude: 19.076, longitude: 72.8777 },
  { id: 'c_bengaluru', name: 'Bengaluru', admin1: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946 },
  { id: 'c_hyderabad', name: 'Hyderabad', admin1: 'Telangana', country: 'India', latitude: 17.385, longitude: 78.4867 },
  { id: 'c_chennai', name: 'Chennai', admin1: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707 },
  { id: 'c_kolkata', name: 'Kolkata', admin1: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  { id: 'c_pune', name: 'Pune', admin1: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567 },
  { id: 'c_ahmedabad', name: 'Ahmedabad', admin1: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714 },
  { id: 'c_jaipur', name: 'Jaipur', admin1: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873 },
  { id: 'c_lucknow', name: 'Lucknow', admin1: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462 },
  { id: 'c_chandigarh', name: 'Chandigarh', admin1: 'Chandigarh', country: 'India', latitude: 30.7333, longitude: 76.7794 },
  { id: 'c_bhopal', name: 'Bhopal', admin1: 'Madhya Pradesh', country: 'India', latitude: 23.2599, longitude: 77.4126 },
  { id: 'c_indore', name: 'Indore', admin1: 'Madhya Pradesh', country: 'India', latitude: 22.7196, longitude: 75.8577 },
  { id: 'c_patna', name: 'Patna', admin1: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376 },
  { id: 'c_surat', name: 'Surat', admin1: 'Gujarat', country: 'India', latitude: 21.1702, longitude: 72.8311 },
  { id: 'c_kochi', name: 'Kochi (Cochin)', admin1: 'Kerala', country: 'India', latitude: 9.9312, longitude: 76.2673 },
  { id: 'c_thiruvananthapuram', name: 'Thiruvananthapuram', admin1: 'Kerala', country: 'India', latitude: 8.5241, longitude: 76.9366 },
  { id: 'c_coimbatore', name: 'Coimbatore', admin1: 'Tamil Nadu', country: 'India', latitude: 11.0168, longitude: 76.9558 },
  { id: 'c_nagpur', name: 'Nagpur', admin1: 'Maharashtra', country: 'India', latitude: 21.1458, longitude: 79.0882 },
  { id: 'c_agra', name: 'Agra', admin1: 'Uttar Pradesh', country: 'India', latitude: 27.1767, longitude: 78.0081 },
  { id: 'c_prayagraj', name: 'Prayagraj (Allahabad)', admin1: 'Uttar Pradesh', country: 'India', latitude: 25.4358, longitude: 81.8463, isSacredOrHistoric: true },
  { id: 'c_dehradun', name: 'Dehradun', admin1: 'Uttarakhand', country: 'India', latitude: 30.3165, longitude: 78.0322 },
  { id: 'c_shimla', name: 'Shimla', admin1: 'Himachal Pradesh', country: 'India', latitude: 31.1048, longitude: 77.1734 },
  { id: 'c_mysore', name: 'Mysuru (Mysore)', admin1: 'Karnataka', country: 'India', latitude: 12.2958, longitude: 76.6394 },
  { id: 'c_bhubaneswar', name: 'Bhubaneswar', admin1: 'Odisha', country: 'India', latitude: 20.2961, longitude: 85.8245 },
  { id: 'c_guwahati', name: 'Guwahati', admin1: 'Assam', country: 'India', latitude: 26.1445, longitude: 91.7362 },
  { id: 'c_ranchi', name: 'Ranchi', admin1: 'Jharkhand', country: 'India', latitude: 23.3441, longitude: 85.3096 },
  { id: 'c_raipur', name: 'Raipur', admin1: 'Chhattisgarh', country: 'India', latitude: 21.2514, longitude: 81.6296 },
  { id: 'c_visakhapatnam', name: 'Visakhapatnam', admin1: 'Andhra Pradesh', country: 'India', latitude: 17.6868, longitude: 83.2185 },
  { id: 'c_vadodara', name: 'Vadodara', admin1: 'Gujarat', country: 'India', latitude: 22.3072, longitude: 73.1812 },
  { id: 'c_nashik', name: 'Nashik', admin1: 'Maharashtra', country: 'India', latitude: 19.9975, longitude: 73.7898, isSacredOrHistoric: true },
  { id: 'c_gwalior', name: 'Gwalior', admin1: 'Madhya Pradesh', country: 'India', latitude: 26.2183, longitude: 78.1828 },
  { id: 'c_jabalpur', name: 'Jabalpur', admin1: 'Madhya Pradesh', country: 'India', latitude: 23.1815, longitude: 79.9864 },
  { id: 'c_noida', name: 'Noida', admin1: 'Uttar Pradesh', country: 'India', latitude: 28.5355, longitude: 77.391 },
  { id: 'c_gurgaon', name: 'Gurugram (Gurgaon)', admin1: 'Haryana', country: 'India', latitude: 28.4595, longitude: 77.0266 },
  { id: 'c_faridabad', name: 'Faridabad', admin1: 'Haryana', country: 'India', latitude: 28.4089, longitude: 77.3178 },
  { id: 'c_ghaziabad', name: 'Ghaziabad', admin1: 'Uttar Pradesh', country: 'India', latitude: 28.6692, longitude: 77.4538 },

  // Global Diaspora & Major International Cities
  { id: 'c_dubai', name: 'Dubai', admin1: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
  { id: 'c_london', name: 'London', admin1: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { id: 'c_singapore', name: 'Singapore', admin1: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { id: 'c_new_york', name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { id: 'c_san_francisco', name: 'San Francisco', admin1: 'California', country: 'United States', latitude: 37.7749, longitude: -122.4194 },
  { id: 'c_toronto', name: 'Toronto', admin1: 'Ontario', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { id: 'c_sydney', name: 'Sydney', admin1: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { id: 'c_melbourne', name: 'Melbourne', admin1: 'Victoria', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
  { id: 'c_tokyo', name: 'Tokyo', admin1: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { id: 'c_kuala_lumpur', name: 'Kuala Lumpur', admin1: 'Federal Territory', country: 'Malaysia', latitude: 3.139, longitude: 101.6869 },
];

const POPULAR_QUICK_PICKS = [
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Varanasi',
  'Jaipur',
  'Chandigarh',
  'Pune',
  'Hyderabad',
  'Ujjain',
  'Dubai',
];

interface CitySearchInputProps {
  value: string;
  onChange: (city: string, details?: CityItem) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  value,
  onChange,
  label = 'Birth City / Location',
  placeholder = 'Type city name (e.g. Varanasi, Mumbai, New Delhi...)',
  required = false,
  id = 'citySearchInput',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CityItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Synchronize internal value when parent prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time search handler with local immediate results + Open-Meteo online geocoding
  useEffect(() => {
    const trimmed = inputValue.trim();

    if (!trimmed || trimmed.length < 2) {
      // Show default top recommendations if field is open but query is short
      const curatedSlice = CURATED_CITIES.slice(0, 8);
      setResults(curatedSlice);
      setIsLoading(false);
      return;
    }

    // 1. Instant local filter
    const lower = trimmed.toLowerCase();
    const localMatches = CURATED_CITIES.filter((c) => {
      return (
        c.name.toLowerCase().includes(lower) ||
        (c.admin1 && c.admin1.toLowerCase().includes(lower)) ||
        c.country.toLowerCase().includes(lower)
      );
    });

    setResults(localMatches);

    // 2. Real-time debounced online geocoding fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data && Array.isArray(data.results)) {
          const apiCities: CityItem[] = data.results.map((item: any) => ({
            id: `geo_${item.id}`,
            name: item.name,
            admin1: item.admin1 || item.admin2 || '',
            country: item.country || '',
            countryCode: item.country_code,
            latitude: item.latitude,
            longitude: item.longitude,
            timezone: item.timezone,
          }));

          // Merge local curated results with API results (avoid exact duplicates)
          const merged: CityItem[] = [...localMatches];
          const existingNames = new Set(localMatches.map((m) => `${m.name.toLowerCase()}_${m.country.toLowerCase()}`));

          for (const apiCity of apiCities) {
            const key = `${apiCity.name.toLowerCase()}_${apiCity.country.toLowerCase()}`;
            if (!existingNames.has(key)) {
              merged.push(apiCity);
              existingNames.add(key);
            }
          }

          setResults(merged.slice(0, 10));
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Realtime city search error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [inputValue]);

  const handleSelectCity = (city: CityItem) => {
    const formatted = city.admin1
      ? `${city.name}, ${city.admin1}, ${city.country}`
      : `${city.name}, ${city.country}`;

    setInputValue(formatted);
    onChange(formatted, city);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < results.length) {
        e.preventDefault();
        handleSelectCity(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setResults(CURATED_CITIES.slice(0, 8));
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div ref={containerRef} className={`relative space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>{label}</span>
          </label>
          <span className="text-[10px] text-stone-400">Real-time Global Geocoding</span>
        </div>
      )}

      {/* Main Input Control */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4 text-amber-700/60" />
        </div>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          required={required}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 bg-white text-stone-900 shadow-2xs placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
        />

        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />}
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Picks / Popular Chips when not searching or on initial focus */}
      {isOpen && !inputValue && (
        <div className="pt-1">
          <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Popular Jyotish & Cultural Centers:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_QUICK_PICKS.map((quickName) => (
              <button
                key={quickName}
                type="button"
                onClick={() => {
                  const match = CURATED_CITIES.find((c) => c.name.toLowerCase().includes(quickName.toLowerCase()));
                  if (match) {
                    handleSelectCity(match);
                  } else {
                    setInputValue(quickName);
                    onChange(quickName);
                    setIsOpen(false);
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-xs bg-stone-100 hover:bg-amber-100/70 hover:text-amber-900 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
              >
                {quickName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Results Box */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-stone-200 shadow-xl max-h-72 overflow-y-auto overflow-x-hidden divide-y divide-stone-100">
          <div className="px-3 py-1.5 bg-stone-50/80 text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between sticky top-0 backdrop-blur-xs border-b border-stone-100">
            <span>{isLoading ? 'Searching worldwide locations...' : `${results.length} Cities Found`}</span>
            <span className="text-amber-700 flex items-center gap-1">
              <Navigation className="w-2.5 h-2.5" /> Live Lat/Long Coordinates
            </span>
          </div>

          {results.map((city, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={city.id || `${city.name}_${idx}`}
                type="button"
                onClick={() => handleSelectCity(city)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-amber-50/80 text-amber-950' : 'hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                      city.isSacredOrHistoric
                        ? 'bg-amber-100 text-amber-700'
                        : isSelected
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {city.isSacredOrHistoric ? <Sparkles className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900 truncate">{city.name}</span>
                      {city.isSacredOrHistoric && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-300 flex-shrink-0">
                          Tīrtha Kshetra
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 truncate flex items-center gap-1">
                      <span>{city.admin1 ? `${city.admin1}, ` : ''}</span>
                      <span className="font-medium text-stone-700">{city.country}</span>
                    </div>
                  </div>
                </div>

                {/* Coordinates for precision astrological calculation */}
                {city.latitude !== undefined && city.longitude !== undefined && (
                  <div className="text-right flex-shrink-0 pl-2">
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/60">
                      {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
