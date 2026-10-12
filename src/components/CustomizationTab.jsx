import React, { useState } from 'react';
import { 
  FileCode, 
  Type, 
  Sliders, 
  Palette, 
  Image as ImageIcon, 
  Columns, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading, 
  ExternalLink,
  Settings2
} from 'lucide-react';

export function CustomizationTab({ customization, setCustomization, onOpenTemplates }) {
  // Accordion state for sub-sections
  const [openSection, setOpenSection] = useState('templates'); // default open section

  const toggle = (key) => {
    setOpenSection(prev => prev === key ? '' : key);
  };

  // Helper to deep update customization state
  const update = (category, field, value) => {
    setCustomization(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const updateApplyAccent = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        applyAccentTo: {
          ...prev.colors.applyAccentTo,
          [key]: value
        }
      }
    }));
  };

  // Color Swatches
  const colorPresets = [
    { label: "Solid Black", color: "#000000" },
    { label: "Classic Navy", color: "#1e3a8a" },
    { label: "Charcoal Slate", color: "#334155" },
    { label: "Forest Green", color: "#14532d" },
    { label: "Deep Burgundy", color: "#881337" },
    { label: "Subtle Teal", color: "#0f766e" },
    { label: "Espresso Bronze", color: "#451a03" },
    { label: "Royal Indigo", color: "#3730a3" },
  ];

  const fonts = [
    { name: "Inter (Modern ATS)", value: "Inter" },
    { name: "Roboto (Clean Sans)", value: "Roboto" },
    { name: "EB Garamond (Ivy League Serif)", value: "EB Garamond" },
    { name: "Merriweather (Executive Serif)", value: "Merriweather" },
    { name: "Lato (Balanced Sans)", value: "Lato" },
    { name: "Poppins (Contemporary)", value: "Poppins" },
    { name: "Playfair Display (Editorial)", value: "Playfair Display" },
    { name: "JetBrains Mono (Technical)", value: "JetBrains Mono" },
  ];

  return (
    <div className="space-y-4 pb-16 text-slate-900 font-sans">

      {/* 1. DOCUMENT SETTINGS */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('document')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Document Settings</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Language, date format & paper standard</p>
            </div>
          </div>
          {openSection === 'document' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'document' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">Language</label>
              <select
                value={customization.document.language}
                onChange={(e) => update('document', 'language', e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-base font-medium focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="English (UK)">English (UK)</option>
                <option value="English (US)">English (US)</option>
                <option value="Hindi">Hindi / Indian Standard</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">Date Format</label>
                <select
                  value={customization.document.dateFormat}
                  onChange={(e) => update('document', 'dateFormat', e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-3 bg-white text-base font-medium focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/YYYY">MM/YYYY (Standard)</option>
                  <option value="YYYY-MM">YYYY-MM</option>
                  <option value="Month YYYY">Month YYYY</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">Page Format</label>
                <select
                  value={customization.document.pageFormat}
                  onChange={(e) => update('document', 'pageFormat', e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-3 bg-white text-base font-medium focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="US Letter">US Letter (8.5 × 11 in)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. DESIGN TEMPLATES */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('templates')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Design Templates</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">One-click design system overhaul</p>
            </div>
          </div>
          {openSection === 'templates' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'templates' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl">
              <p className="text-sm font-semibold text-indigo-950 leading-relaxed">
                Update your entire resume design with one click 🔄
              </p>
              <button
                type="button"
                onClick={onOpenTemplates}
                className="mt-3 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Browse 50+ ATS Templates</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. LAYOUT & COLUMNS */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('layout')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Layout & Columns</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Single column, two columns or mixed grid</p>
            </div>
          </div>
          {openSection === 'layout' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'layout' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Columns Structure</label>
              <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-xl">
                {[
                  { id: 'one', label: 'One' },
                  { id: 'two-left', label: 'Two (L)' },
                  { id: 'two-right', label: 'Two (R)' },
                  { id: 'mix', label: 'Mix' }
                ].map(col => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => update('layout', 'columns', col.id)}
                    className={`py-2 text-sm font-bold rounded-lg transition-all ${
                      customization.layout.columns === col.id
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Section Layout</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'full-width', label: 'Full Width' },
                  { id: 'columns', label: 'Columns' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update('layout', 'sectionLayout', opt.id)}
                    className={`p-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                      customization.layout.sectionLayout === opt.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. FONT SIZE & SCALE */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('fontSize')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Font Size & Scale</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Base size, name, titles & headings</p>
            </div>
          </div>
          {openSection === 'fontSize' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'fontSize' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            {/* Base Font Size */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-bold text-slate-800">Base Font Size</label>
                <span className="text-sm font-mono text-indigo-600 font-extrabold">{customization.fontSize.baseFontSize}pt</span>
              </div>
              <input
                type="range"
                min="9"
                max="13"
                step="0.5"
                value={customization.fontSize.baseFontSize}
                onChange={(e) => update('fontSize', 'baseFontSize', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>9pt (Dense)</span>
                <span>11pt (Standard)</span>
                <span>13pt (Spacious)</span>
              </div>
            </div>

            {/* Scale Offsets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1">Full Name</label>
                <select
                  value={customization.fontSize.fullNameOffset}
                  onChange={(e) => update('fontSize', 'fullNameOffset', parseFloat(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-base font-medium"
                >
                  <option value="6">+6pt</option>
                  <option value="8">+8pt (Standard)</option>
                  <option value="10">+10pt</option>
                  <option value="12">+12pt</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1">Professional Title</label>
                <select
                  value={customization.fontSize.professionalTitleOffset}
                  onChange={(e) => update('fontSize', 'professionalTitleOffset', parseFloat(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-base font-medium"
                >
                  <option value="2">+2pt</option>
                  <option value="3.5">+3.5pt (Standard)</option>
                  <option value="5">+5pt</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1">Section Headings</label>
                <select
                  value={customization.fontSize.sectionHeadingsOffset}
                  onChange={(e) => update('fontSize', 'sectionHeadingsOffset', parseFloat(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-base font-medium"
                >
                  <option value="0">+0pt</option>
                  <option value="1">+1pt (Standard)</option>
                  <option value="2">+2pt</option>
                  <option value="3">+3pt</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1">Entry Header</label>
                <select
                  value={customization.fontSize.entryHeaderOffset}
                  onChange={(e) => update('fontSize', 'entryHeaderOffset', parseFloat(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-base font-medium"
                >
                  <option value="-0.5">-0.5pt</option>
                  <option value="0">+0pt (Standard)</option>
                  <option value="1">+1pt</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. SPACING & MARGINS */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('spacing')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Spacing & Margins</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Line height, element gaps & page margins</p>
            </div>
          </div>
          {openSection === 'spacing' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'spacing' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            {/* Line Height */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-bold text-slate-800">Line Height</label>
                <span className="text-sm font-mono text-indigo-600 font-extrabold">{customization.spacing.lineHeight}</span>
              </div>
              <input
                type="range"
                min="1.15"
                max="1.6"
                step="0.05"
                value={customization.spacing.lineHeight}
                onChange={(e) => update('spacing', 'lineHeight', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2"
              />
            </div>

            {/* Space Between Elements */}
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Space Between Elements</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl">
                {['compact', 'normal', 'spacious'].map(sp => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => update('spacing', 'spaceElements', sp)}
                    className={`py-2 text-sm font-bold capitalize rounded-lg transition-all ${
                      customization.spacing.spaceElements === sp
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-800 mb-1">
                  <span>Left & Right Margin</span>
                  <span className="text-indigo-600 font-mono">{customization.spacing.marginLR}mm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={customization.spacing.marginLR}
                  onChange={(e) => update('spacing', 'marginLR', parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-slate-800 mb-1">
                  <span>Top & Bottom Margin</span>
                  <span className="text-indigo-600 font-mono">{customization.spacing.marginTB}mm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="26"
                  value={customization.spacing.marginTB}
                  onChange={(e) => update('spacing', 'marginTB', parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. ENTRY LAYOUT */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('entryLayout')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Entry Layout</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Positioning for dates, location & subtitles</p>
            </div>
          </div>
          {openSection === 'entryLayout' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'entryLayout' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Structure</label>
              <div className="grid grid-cols-2 gap-2.5">
                {['full-width', 'columns'].map(struct => (
                  <button
                    key={struct}
                    type="button"
                    onClick={() => update('entryLayout', 'structure', struct)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-center capitalize text-sm font-bold transition-all ${
                      customization.entryLayout.structure === struct
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {struct.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Date & Location Position</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'right', label: 'Right' },
                  { id: 'below-title', label: 'Below Title' }
                ].map(pos => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => update('entryLayout', 'dateLocationPosition', pos.id)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                      customization.entryLayout.dateLocationPosition === pos.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1">Subtitle Placement</label>
                <select
                  value={customization.entryLayout.subtitlePlacement}
                  onChange={(e) => update('entryLayout', 'subtitlePlacement', e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-base font-medium"
                >
                  <option value="same-line">Try Same Line</option>
                  <option value="below-title">Below Title</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1">Location Placement</label>
                <select
                  value={customization.entryLayout.locationPlacement}
                  onChange={(e) => update('entryLayout', 'locationPlacement', e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-base font-medium"
                >
                  <option value="same-line">Try Same Line</option>
                  <option value="below-date">Below Date</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. SECTION HEADINGS */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('headings')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Heading className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Section Headings</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Capitalization, icons & divider accents</p>
            </div>
          </div>
          {openSection === 'headings' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'headings' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Capitalization</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'capitalize', label: 'Capitalize' },
                  { id: 'uppercase', label: 'UPPERCASE' }
                ].map(cap => (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => update('sectionHeadings', 'capitalization', cap.id)}
                    className={`py-2.5 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                      customization.sectionHeadings.capitalization === cap.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {cap.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Icons in Headings</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl">
                {['none', 'outline', 'filled'].map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => update('sectionHeadings', 'icons', ic)}
                    className={`py-2 text-sm font-bold capitalize rounded-lg transition-all ${
                      customization.sectionHeadings.icons === ic
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">Divider Style</label>
              <select
                value={customization.sectionHeadings.style}
                onChange={(e) => update('sectionHeadings', 'style', e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-base font-medium"
              >
                <option value="bottom-line">Bottom Underline</option>
                <option value="left-bar">Left Accent Bar</option>
                <option value="shaded">Light Shaded Background</option>
                <option value="boxed">Clean Boxed</option>
                <option value="double-line">Double Line</option>
                <option value="clean">Minimal Clean (No Line)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 8. FONT & TYPOGRAPHY */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('font')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Font Families</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Body & full name font pairing</p>
            </div>
          </div>
          {openSection === 'font' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'font' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">Body Font</label>
              <select
                value={customization.font.bodyFont}
                onChange={(e) => update('font', 'bodyFont', e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-base font-medium"
              >
                {fonts.map(f => (
                  <option key={f.value} value={f.value}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">Name Font</label>
              <select
                value={customization.font.nameFont}
                onChange={(e) => update('font', 'nameFont', e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-base font-medium"
              >
                <option value="same">Same as body font</option>
                <option value="serif">Classic Serif (EB Garamond)</option>
                <option value="playfair">Playfair Display</option>
                <option value="sans">Inter Sans-Serif</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 9. COLORS & ACCENTS */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('colors')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Colors & Palette</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Accent color & granular targets</p>
            </div>
          </div>
          {openSection === 'colors' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'colors' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            {/* Color Area */}
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Color Area</label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-xl">
                {[
                  { id: 'accent', label: 'Accent' },
                  { id: 'header', label: 'Header' },
                  { id: 'border', label: 'Border' },
                  { id: 'monochrome', label: 'B & W' }
                ].map(area => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => update('colors', 'colorArea', area.id)}
                    className={`py-2 text-sm font-bold rounded-lg transition-all ${
                      customization.colors.colorArea === area.id
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-600'
                    }`}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-800">Accent Color</label>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">{customization.colors.accentColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customization.colors.accentColor}
                  onChange={(e) => update('colors', 'accentColor', e.target.value)}
                  className="w-11 h-11 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                  title="Pick custom color"
                />
                <div className="flex-1 flex items-center justify-between gap-1.5">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => update('colors', 'accentColor', preset.color)}
                      style={{ backgroundColor: preset.color }}
                      className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 flex items-center justify-center ${
                        customization.colors.accentColor.toLowerCase() === preset.color.toLowerCase()
                          ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105'
                          : ''
                      }`}
                      title={preset.label}
                    >
                      {customization.colors.accentColor.toLowerCase() === preset.color.toLowerCase() && (
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Accent Color To: Checkboxes */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-800 block mb-2.5">Apply Accent Color To:</label>
              <div className="grid grid-cols-2 gap-2.5 text-sm text-slate-700 font-medium">
                {[
                  { key: 'name', label: 'Full Name' },
                  { key: 'jobTitle', label: 'Job Title' },
                  { key: 'headings', label: 'Headings' },
                  { key: 'headingsLine', label: 'Headings Line' },
                  { key: 'headerIcons', label: 'Header Icons' },
                  { key: 'dotsBars', label: 'Dots / Bars' },
                  { key: 'dates', label: 'Dates' },
                  { key: 'entryTitle', label: 'Entry Title' },
                  { key: 'entrySubtitle', label: 'Entry Subtitle' },
                  { key: 'linkIcons', label: 'Link Icons' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!customization.colors.applyAccentTo?.[item.key]}
                      onChange={(e) => updateApplyAccent(item.key, e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 10. HEADER & CONTACT */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('header')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <AlignLeft className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Header & Contact</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Alignment, icon styles & separators</p>
            </div>
          </div>
          {openSection === 'header' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'header' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Header Text Alignment</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'left', icon: AlignLeft, label: 'Left' },
                  { id: 'center', icon: AlignCenter, label: 'Center' },
                  { id: 'right', icon: AlignRight, label: 'Right' }
                ].map(al => {
                  const Icon = al.icon;
                  return (
                    <button
                      key={al.id}
                      type="button"
                      onClick={() => update('header', 'textAlign', al.id)}
                      className={`py-2 px-3 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                        customization.header.textAlign === al.id
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{al.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-2">Details Arrangement</label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-xl">
                {['icon', 'bullet', 'bar', 'stacked'].map(arr => (
                  <button
                    key={arr}
                    type="button"
                    onClick={() => update('header', 'detailsArrangement', arr)}
                    className={`py-2 text-sm font-bold capitalize rounded-lg transition-all ${
                      customization.header.detailsArrangement === arr
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-600'
                    }`}
                  >
                    {arr}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1.5">Icon Style</label>
              <select
                value={customization.header.iconStyle}
                onChange={(e) => update('header', 'iconStyle', e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-base font-medium"
              >
                <option value="no-frame">No Frame (Clean)</option>
                <option value="circle-filled">Circle Filled</option>
                <option value="rounded-filled">Rounded Filled</option>
                <option value="square-filled">Square Filled</option>
                <option value="circle-outline">Circle Outline</option>
                <option value="rounded-outline">Rounded Outline</option>
                <option value="square-outline">Square Outline</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 11. PHOTO DESIGN */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('photo')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Photo Design Options</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Shape, size, grayscale & placement</p>
            </div>
          </div>
          {openSection === 'photo' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'photo' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800 text-sm">
              <input
                type="checkbox"
                checked={customization.photo.showPhoto}
                onChange={(e) => update('photo', 'showPhoto', e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
              />
              <span>Show Photo on Resume</span>
            </label>

            {customization.photo.showPhoto && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Shape</label>
                    <select
                      value={customization.photo.shape}
                      onChange={(e) => update('photo', 'shape', e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium"
                    >
                      <option value="circle">Circle</option>
                      <option value="rounded">Rounded</option>
                      <option value="square">Square</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Size</label>
                    <select
                      value={customization.photo.size}
                      onChange={(e) => update('photo', 'size', e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Filter</label>
                    <select
                      value={customization.photo.filter}
                      onChange={(e) => update('photo', 'filter', e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-medium"
                    >
                      <option value="color">Full Color</option>
                      <option value="grayscale">Grayscale</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 12. LINKS & FOOTER */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggle('linksFooter')}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Links & Footer</span>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Underline, link icon & page numbers</p>
            </div>
          </div>
          {openSection === 'linksFooter' ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {openSection === 'linksFooter' && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-4">
            <div>
              <span className="text-sm font-bold text-slate-800 block mb-2">Link Styling</span>
              <div className="space-y-2 text-sm text-slate-700 font-medium">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.links.underline}
                    onChange={(e) => update('links', 'underline', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                  />
                  <span>Underline Links</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.links.blueColor}
                    onChange={(e) => update('links', 'blueColor', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                  />
                  <span>Accent / Blue colored links</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.links.linkIcon}
                    onChange={(e) => update('links', 'linkIcon', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                  />
                  <span>Show Link Icon</span>
                </label>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-sm font-bold text-slate-800 block mb-2">Footer Settings</span>
              <div className="space-y-2 text-sm text-slate-700 font-medium">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.footer.pageNumbers}
                    onChange={(e) => update('footer', 'pageNumbers', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                  />
                  <span>Show Page Numbers (e.g. Page 1 of 1)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.footer.email}
                    onChange={(e) => update('footer', 'email', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                  />
                  <span>Show Email in Footer</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.footer.name}
                    onChange={(e) => update('footer', 'name', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                  />
                  <span>Show Full Name in Footer</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default CustomizationTab;
