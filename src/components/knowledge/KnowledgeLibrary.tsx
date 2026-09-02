import React, { useState } from 'react';
import { BookOpen, Search, Filter, ExternalLink, ShieldCheck, Languages } from 'lucide-react';
import { CLASSICAL_SOURCES_REGISTRY } from '../../data/sources';
import { ClassicalSource } from '../../types';

export const KnowledgeLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<ClassicalSource>(CLASSICAL_SOURCES_REGISTRY[0]);
  const [activeScriptTab, setActiveScriptTab] = useState<'sanskrit' | 'iast' | 'english' | 'hindi'>('sanskrit');

  const topics = [
    'ALL',
    'Kitchen (Pākaśālā) & Fire Element (Agni)',
    'Brahmasthan (Navel of Dwelling)',
    'Water Reservoir & Sacred Sanctuary (Ishanya)',
    'Master Bedroom & Stability (Nirriti)',
    'Main Entrance & Threshold Orientation',
    'Staircase & Vertical Circulation',
  ];

  const filtered = CLASSICAL_SOURCES_REGISTRY.filter((src) => {
    const matchesSearch =
      src.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.practicalInterpretation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'ALL' || src.topic.includes(selectedTopic);
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white p-6 rounded-2xl shadow-sm space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Authentic Knowledge System
          </span>
          <span className="text-xs text-stone-300">•</span>
          <span className="text-xs text-stone-300">Primary Classical Treatise Registry</span>
        </div>
        <h1 className="text-2xl font-bold font-serif tracking-tight">
          Sanskrit Source Registry & Architectural Literature
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-3xl">
          Verifiable citations from foundational canonical texts (Mayamata, Manasara, Brihat Samhita, Samarangana Sutradhara, Vishvakarma Prakasha) complete with Devanagari Sanskrit, IAST transliteration, English, Hindi, and practical modern interpretations.
        </p>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search texts, authors, verses..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
          />
        </div>

        {/* Topic Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          <Filter className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
          {topics.slice(0, 5).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                selectedTopic === t
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {t === 'ALL' ? 'All Treatises' : t.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Registry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Treatises List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Canonical Texts & Verses ({filtered.length})
          </div>

          <div className="space-y-2.5">
            {filtered.map((src) => {
              const isSelected = src.id === selectedSource.id;
              return (
                <div
                  key={src.id}
                  onClick={() => setSelectedSource(src)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-500 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {src.reliabilityTier.split('—')[0]}
                    </span>
                    <span className="text-[11px] text-stone-400 font-serif">
                      {src.historicalPeriod}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 font-serif">{src.name}</h3>
                  <p className="text-xs text-amber-900 font-medium">{src.author}</p>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{src.topic}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center / Right Column: Deep Multilingual Verse Inspector */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
          {/* Header */}
          <div className="border-b border-stone-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {selectedSource.reliabilityTier}
              </span>
              <span className="text-xs text-stone-500 font-mono">
                {selectedSource.chapter} • {selectedSource.verseOrSection}
              </span>
            </div>

            <h2 className="text-xl font-bold font-serif text-stone-900 mt-2">
              {selectedSource.name}
            </h2>
            <div className="text-xs text-stone-500 mt-0.5">
              Attributed to <strong>{selectedSource.author}</strong> ({selectedSource.historicalPeriod})
            </div>
          </div>

          {/* Multi-script Tab Bar */}
          <div className="flex border-b border-stone-200 text-xs">
            <button
              onClick={() => setActiveScriptTab('sanskrit')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeScriptTab === 'sanskrit'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              संस्कृतम् (Original Devanagari)
            </button>
            <button
              onClick={() => setActiveScriptTab('iast')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeScriptTab === 'iast'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              IAST Transliteration
            </button>
            <button
              onClick={() => setActiveScriptTab('english')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeScriptTab === 'english'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              English Translation
            </button>
            <button
              onClick={() => setActiveScriptTab('hindi')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeScriptTab === 'hindi'
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              हिन्दी अनुवाद (Hindi)
            </button>
          </div>

          {/* Verse Display Box */}
          <div className="p-5 rounded-xl bg-stone-900 text-stone-100 font-serif text-base sm:text-lg leading-relaxed shadow-inner border border-stone-800">
            {activeScriptTab === 'sanskrit' && (
              <div className="text-amber-200 text-center tracking-wide font-serif py-2">
                {selectedSource.sanskritOriginal}
              </div>
            )}
            {activeScriptTab === 'iast' && (
              <div className="text-stone-300 italic text-center font-sans text-sm py-2">
                {selectedSource.iastTransliteration}
              </div>
            )}
            {activeScriptTab === 'english' && (
              <div className="text-stone-200 font-sans text-sm py-2 leading-relaxed">
                "{selectedSource.englishTranslation}"
              </div>
            )}
            {activeScriptTab === 'hindi' && (
              <div className="text-amber-100 font-serif text-sm py-2 leading-relaxed">
                "{selectedSource.hindiTranslation}"
              </div>
            )}
          </div>

          {/* Practical Modern Interpretation */}
          <div className="space-y-2 p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Architectural & Scientific Rationale</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
              {selectedSource.practicalInterpretation}
            </p>
          </div>

          {/* Attribution Footnote */}
          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100 flex items-center justify-between">
            <span>Verified Canonical Entry • ERIK-HUB Vaastu Source Registry</span>
            <span className="font-semibold text-stone-600">Developer: Pawan Paji</span>
          </div>
        </div>
      </div>
    </div>
  );
};
