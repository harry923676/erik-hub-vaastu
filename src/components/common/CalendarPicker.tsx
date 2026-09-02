import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface CalendarPickerProps {
  value: string; // ISO format 'YYYY-MM-DD', e.g. '1990-05-15'
  onChange: (dateStr: string) => void;
  label?: string;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  id?: string;
  className?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  value,
  onChange,
  label = 'Date of Birth',
  required = false,
  minDate = '1930-01-01',
  maxDate = new Date().toISOString().split('T')[0],
  id = 'calendarPicker',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date
  const parsedValue = useMemo(() => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d);
      }
    }
    return null;
  }, [value]);

  // Current view state (viewing year, month, and view mode)
  // viewMode: 'DAYS' | 'MONTHS' | 'YEARS'
  const [viewMode, setViewMode] = useState<'DAYS' | 'MONTHS' | 'YEARS'>('DAYS');
  const [viewYear, setViewYear] = useState(parsedValue ? parsedValue.getFullYear() : 1995);
  const [viewMonth, setViewMonth] = useState(parsedValue ? parsedValue.getMonth() : 4);
  const [decadeStart, setDecadeStart] = useState(Math.floor((parsedValue ? parsedValue.getFullYear() : 1995) / 12) * 12);

  // Sync internal view when value changes
  useEffect(() => {
    if (parsedValue) {
      setViewYear(parsedValue.getFullYear());
      setViewMonth(parsedValue.getMonth());
      setDecadeStart(Math.floor(parsedValue.getFullYear() / 12) * 12);
    }
  }, [parsedValue]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('DAYS');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format display string
  const formattedDisplay = useMemo(() => {
    if (!parsedValue) return 'Select Date of Birth';
    return parsedValue.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [parsedValue]);

  // Calculate age for birth profile
  const ageDisplay = useMemo(() => {
    if (!parsedValue) return null;
    const today = new Date();
    let age = today.getFullYear() - parsedValue.getFullYear();
    const m = today.getMonth() - parsedValue.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < parsedValue.getDate())) {
      age--;
    }
    return age >= 0 ? `${age} yrs` : null;
  }, [parsedValue]);

  // Generate calendar days for viewMonth & viewYear
  const daysInMonth = useMemo(() => {
    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean; isDisabled: boolean }[] = [];
    
    // First day of current month
    const firstDay = new Date(viewYear, viewMonth, 1);
    // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    // Convert to Monday = 0, Sunday = 6
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    // Previous month filler days
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevD = prevMonthLastDay - i;
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(prevD).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: prevD,
        isCurrentMonth: false,
        isDisabled: (minDate && dateStr < minDate) || (maxDate && dateStr > maxDate),
      });
    }

    // Current month days
    const currentMonthTotalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let d = 1; d <= currentMonthTotalDays; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isDisabled: (minDate && dateStr < minDate) || (maxDate && dateStr > maxDate),
      });
    }

    // Next month filler days to complete grid (up to 42 cells or 35 cells)
    const remaining = 42 - days.length;
    for (let nextD = 1; nextD <= remaining; nextD++) {
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(nextD).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: nextD,
        isCurrentMonth: false,
        isDisabled: (minDate && dateStr < minDate) || (maxDate && dateStr > maxDate),
      });
    }

    return days;
  }, [viewYear, viewMonth, minDate, maxDate]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleQuickDecadeJump = (year: number) => {
    setViewYear(year);
    setDecadeStart(Math.floor(year / 12) * 12);
    setViewMode('DAYS');
  };

  return (
    <div ref={containerRef} className={`relative space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
            <span>{label}</span>
          </label>
          {ageDisplay && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200">
              Age: {ageDisplay}
            </span>
          )}
        </div>
      )}

      {/* Trigger Control */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? 'border-amber-600 ring-2 ring-amber-500/20 bg-white'
            : 'border-stone-300 bg-white hover:border-amber-500 hover:bg-stone-50/50'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 flex-shrink-0">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className={`text-sm font-semibold ${parsedValue ? 'text-stone-900' : 'text-stone-400'}`}>
              {formattedDisplay}
            </span>
            {value && (
              <span className="block text-[11px] font-mono text-stone-400 leading-tight">{value}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[11px] font-medium text-amber-700 hover:text-amber-800 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/60">
            Change
          </span>
        </div>
      </button>

      {/* Interactive Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-88 bg-white rounded-2xl border border-stone-200 shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Top Quick Decade Bar */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Quick Eras:
            </span>
            <div className="flex items-center gap-1">
              {[1970, 1980, 1990, 1995, 2000, 2005].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => handleQuickDecadeJump(y)}
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md transition-colors ${
                    viewYear === y
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {y}s
                </button>
              ))}
            </div>
          </div>

          {/* Header Navigation & Mode Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {viewMode === 'DAYS' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setViewMode('MONTHS')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-stone-800 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 transition-colors"
                  >
                    {MONTH_NAMES[viewMonth]}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDecadeStart(Math.floor(viewYear / 12) * 12);
                      setViewMode('YEARS');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-stone-800 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 transition-colors"
                  >
                    {viewYear}
                  </button>
                </>
              ) : viewMode === 'MONTHS' ? (
                <span className="text-xs font-bold text-stone-900 px-2 py-1">
                  Select Month for {viewYear}
                </span>
              ) : (
                <span className="text-xs font-bold text-stone-900 px-2 py-1">
                  {decadeStart} – {decadeStart + 11}
                </span>
              )}
            </div>

            {/* Prev / Next Controls */}
            <div className="flex items-center gap-1">
              {viewMode === 'DAYS' && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {viewMode === 'YEARS' && (
                <>
                  <button
                    type="button"
                    onClick={() => setDecadeStart((prev) => prev - 12)}
                    className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                    title="Previous 12 Years"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecadeStart((prev) => prev + 12)}
                    className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                    title="Next 12 Years"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 ml-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VIEW 1: DAYS MATRIX */}
          {viewMode === 'DAYS' && (
            <div className="space-y-1.5">
              {/* Day of week headers */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((wd, i) => (
                  <div
                    key={wd}
                    className={`text-[11px] font-bold uppercase py-1 ${
                      i >= 5 ? 'text-amber-700/80' : 'text-stone-400'
                    }`}
                  >
                    {wd}
                  </div>
                ))}
              </div>

              {/* Day numbers */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {daysInMonth.map((item, idx) => {
                  const isSelected = value === item.dateStr;
                  const isToday =
                    item.dateStr === new Date().toISOString().split('T')[0];

                  return (
                    <button
                      key={`${item.dateStr}_${idx}`}
                      type="button"
                      disabled={item.isDisabled}
                      onClick={() => handleSelectDay(item.dateStr)}
                      className={`h-8 w-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        item.isDisabled
                          ? 'opacity-25 cursor-not-allowed text-stone-300'
                          : isSelected
                          ? 'bg-amber-600 text-white font-bold shadow-sm ring-2 ring-amber-400 scale-105'
                          : item.isCurrentMonth
                          ? isToday
                            ? 'border-2 border-amber-500 text-amber-700 font-bold hover:bg-amber-50'
                            : 'text-stone-800 hover:bg-amber-50 hover:text-amber-900'
                          : 'text-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {item.dayNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: MONTH SELECTION GRID */}
          {viewMode === 'MONTHS' && (
            <div className="grid grid-cols-3 gap-2 py-2">
              {MONTH_NAMES.map((mName, mIdx) => {
                const isSelected = viewMonth === mIdx;
                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => {
                      setViewMonth(mIdx);
                      setViewMode('DAYS');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors text-center ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-amber-900 border border-stone-200/70'
                    }`}
                  >
                    {MONTH_SHORT[mIdx]}
                  </button>
                );
              })}
            </div>
          )}

          {/* VIEW 3: 12-YEAR DECADE GRID */}
          {viewMode === 'YEARS' && (
            <div className="grid grid-cols-3 gap-2 py-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const year = decadeStart + i;
                const isSelected = viewYear === year;
                const isFuture = year > new Date().getFullYear();

                return (
                  <button
                    key={year}
                    type="button"
                    disabled={isFuture}
                    onClick={() => {
                      setViewYear(year);
                      setViewMode('MONTHS');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-colors text-center ${
                      isFuture
                        ? 'opacity-30 cursor-not-allowed bg-stone-50 text-stone-300'
                        : isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-50 text-stone-700 hover:bg-amber-50 hover:text-amber-900 border border-stone-200/70'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                const todayStr = new Date().toISOString().split('T')[0];
                handleSelectDay(todayStr);
              }}
              className="text-amber-700 hover:text-amber-900 font-semibold text-[11px] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Set to Today</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
