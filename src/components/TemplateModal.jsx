import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Search, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  Eye,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RESUME_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates';
import { ResumePreview } from './ResumePreview';
import { initialCustomization } from '../data/customizationDefaults';
import { initialResumeData } from '../data/defaultResume';
import { isResumeBlank } from '../context/ResumeContext';

function TemplateRealThumbnail({ template, previewData }) {
  const custom = useMemo(() => ({
    ...initialCustomization,
    templateId: template.id,
    ...template.preset,
    layout: { ...initialCustomization.layout, ...template.preset?.layout },
    font: { ...initialCustomization.font, ...template.preset?.font },
    sectionHeadings: { ...initialCustomization.sectionHeadings, ...template.preset?.sectionHeadings },
    header: { ...initialCustomization.header, ...template.preset?.header },
    colors: { ...initialCustomization.colors, ...template.preset?.colors },
    spacing: { ...initialCustomization.spacing, ...template.preset?.spacing },
  }), [template]);

  const a4Width = 794;
  const a4Height = 1123;
  const thumbWidth = 200;
  const thumbHeight = 282; // 200 * 1.414 = 282.8
  const scale = thumbWidth / a4Width;

  return (
    <div 
      className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200 select-none mx-auto shrink-0 transition-transform duration-200 group-hover:scale-[1.02]"
      style={{ width: `${thumbWidth}px`, height: `${thumbHeight}px` }}
    >
      <div
        className="absolute top-0 left-0 pointer-events-none select-none origin-top-left"
        style={{
          width: `${a4Width}px`,
          minHeight: `${a4Height}px`,
          transform: `scale(${scale})`,
        }}
      >
        <ResumePreview
          resumeData={previewData}
          customization={custom}
          isThumbnail={true}
        />
      </div>
    </div>
  );
}

// Full High-Resolution Preview Modal attached to body via Portal
function FullTemplatePreviewModal({
  template,
  previewData,
  onClose,
  onProceed,
  onPrevTemplate,
  onNextTemplate,
  mode
}) {
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== 'undefined') {
      const availWidth = window.innerWidth - 48;
      if (availWidth < 794) {
        return Math.max(0.4, +(availWidth / 794).toFixed(2));
      }
    }
    return 0.85;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevTemplate?.();
      if (e.key === 'ArrowRight') onNextTemplate?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevTemplate, onNextTemplate]);

  const custom = useMemo(() => ({
    ...initialCustomization,
    templateId: template.id,
    ...template.preset,
    layout: { ...initialCustomization.layout, ...template.preset?.layout },
    font: { ...initialCustomization.font, ...template.preset?.font },
    sectionHeadings: { ...initialCustomization.sectionHeadings, ...template.preset?.sectionHeadings },
    header: { ...initialCustomization.header, ...template.preset?.header },
    colors: { ...initialCustomization.colors, ...template.preset?.colors },
    spacing: { ...initialCustomization.spacing, ...template.preset?.spacing },
  }), [template]);

  return createPortal(
    <div 
      className="fixed inset-0 flex flex-col bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150 select-none"
      style={{ zIndex: 99999 }}
    >
      {/* Top Header Bar */}
      <div className="relative h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 text-white shrink-0 z-10 shadow-md">
        {/* Left: Fixed-width container for Back button, Template Name & Details */}
        <div className="flex items-center gap-3 w-56 sm:w-64 md:w-80 shrink-0">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Back to all templates (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All Templates</span>
          </button>
          
          <div className="h-5 w-px bg-slate-700 hidden sm:block shrink-0" />

          {/* Fixed-width template name container so text length changes never cause layout shift */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 
                className="font-black text-sm sm:text-base text-white truncate max-w-[120px] sm:max-w-[150px] md:max-w-[180px]"
                title={template.name}
              >
                {template.name}
              </h3>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3" />
                <span>{template.atsScore}% ATS</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate">
              {template.category} • {template.preset?.font?.bodyFont || 'Sans Serif'} • {template.preset?.layout?.columns || '1-Col'}
            </p>
          </div>
        </div>

        {/* Center: Previous & Next Navigator (absolutely pinned to exact center so it NEVER shakes or shifts) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-800/95 p-1 rounded-xl border border-slate-700 text-xs shrink-0 shadow-md z-20">
          <button
            onClick={onPrevTemplate}
            className="p-1.5 px-2.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold"
            title="Previous template (←)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Prev</span>
          </button>
          <span className="text-slate-500 px-1 hidden md:inline">•</span>
          <button
            onClick={onNextTemplate}
            className="p-1.5 px-2.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold"
            title="Next template (→)"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom controls & Primary Action Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto z-10">
          <div className="hidden lg:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setZoom(z => Math.max(0.4, +(z - 0.1).toFixed(2)))}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(0.85)}
              className="px-1.5 text-[11px] text-slate-300 hover:text-white min-w-10 text-center font-mono cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom(z => Math.min(1.4, +(z + 0.1).toFixed(2)))}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onProceed(template)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Use This Template</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Close preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main High-Res Preview Canvas */}
      <div className="flex-1 overflow-auto bg-slate-950/70 flex items-start justify-center p-3 sm:p-6 md:p-10">
        <div 
          className="relative shrink-0 flex justify-center items-start my-auto transition-all duration-150"
          style={{
            width: `${Math.round(794 * zoom)}px`,
            minHeight: `${Math.round(1123 * zoom)}px`,
          }}
        >
          <div 
            style={{ 
              width: '794px',
              minHeight: '1123px',
              transform: `scale(${zoom})`, 
              transformOrigin: 'top left',
            }}
            className="shadow-2xl rounded-lg overflow-hidden shrink-0 border border-slate-700/60 bg-white"
          >
            <ResumePreview
              resumeData={previewData}
              customization={custom}
              isThumbnail={true}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const TemplateCard = React.memo(function TemplateCard({
  tpl,
  isSelected,
  isActive,
  onSelect,
  onProceed,
  onPreview,
  previewData,
  mode
}) {
  return (
    <div
      onClick={() => onSelect(tpl)}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '380px' }}
      className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/40 shadow-xl'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xl'
      }`}
    >
      <div>
        {/* Top Card Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            {tpl.category}
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>{tpl.atsScore}% ATS</span>
          </span>
        </div>

        {/* Real Rendered Resume Preview Thumbnail with Hover Action */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onPreview(tpl);
          }}
          className="relative w-full bg-slate-100/70 rounded-xl p-3 flex justify-center items-center mb-3.5 border border-slate-200/80 group-hover:bg-slate-100 transition-colors overflow-hidden"
          title="Click to view full preview"
        >
          <TemplateRealThumbnail template={tpl} previewData={previewData} />

          {/* Hover Preview Overlay Pill */}
          <div className="absolute inset-0 bg-slate-900/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 pointer-events-none">
            <span className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-1.5 border border-white/20">
              <Eye className="w-3.5 h-3.5 text-teal-300" />
              <span>Preview Full Size</span>
            </span>
          </div>
        </div>

        {/* Title, Badge & Description */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors text-base">
            {tpl.name}
          </h3>
          {(isSelected || isActive) && (
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {tpl.description}
        </p>
      </div>

      {/* Card Action Buttons: Preview & Use Template */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(tpl);
          }}
          className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
          title="Preview template in full size"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onProceed(tpl);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs truncate ${
            mode === 'create'
              ? 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white hover:shadow-md active:scale-98'
              : isSelected || isActive
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <span className="truncate">Use This Template</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
});

export function TemplateModal({ 
  isOpen, 
  onClose, 
  activeTemplateId, 
  onSelectTemplate, 
  resumeData = null, 
  mode = "switch" 
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewingTemplate, setPreviewingTemplate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return RESUME_TEMPLATES.find(t => t.id === activeTemplateId) || RESUME_TEMPLATES[0];
  });

  if (!isOpen) return null;

  // Use current user's resumeData if not blank, else use realistic initialResumeData sample
  const previewData = (resumeData && !isResumeBlank({ data: resumeData })) 
    ? resumeData 
    : initialResumeData;

  const filteredTemplates = RESUME_TEMPLATES.filter(tpl => {
    const matchesCategory = selectedCategory === "All" || tpl.category === selectedCategory;
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardSelect = (tpl) => {
    setSelectedTemplate(tpl);
  };

  const handleProceed = (tpl) => {
    const chosen = tpl || selectedTemplate || RESUME_TEMPLATES[0];
    onSelectTemplate(chosen);
    onClose?.();
  };

  const handleOpenPreview = (tpl) => {
    setPreviewingTemplate(tpl);
  };

  const handlePrevTemplateInPreview = () => {
    if (!previewingTemplate) return;
    const currentIndex = filteredTemplates.findIndex(t => t.id === previewingTemplate.id);
    const prevIndex = (currentIndex - 1 + filteredTemplates.length) % filteredTemplates.length;
    setPreviewingTemplate(filteredTemplates[prevIndex]);
  };

  const handleNextTemplateInPreview = () => {
    if (!previewingTemplate) return;
    const currentIndex = filteredTemplates.findIndex(t => t.id === previewingTemplate.id);
    const nextIndex = (currentIndex + 1) % filteredTemplates.length;
    setPreviewingTemplate(filteredTemplates[nextIndex]);
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200"
        style={{ zIndex: 50 }}
      >
        <div 
          className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                {mode === 'create' ? <LayoutGrid className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {mode === 'create' ? "Choose a Template to Start Your Resume" : "Select ATS-Friendly Template"}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>50+ Tested Layouts</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'create' 
                    ? "Click 'Preview' to view any template in full size, or 'Use Template' to get started."
                    : "100% compliant with Taleo, Workday, Greenhouse & Lever ATS screening engines."}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Categories Bar */}
          <div className="p-4 sm:px-6 bg-slate-50/70 border-b border-slate-200/80 space-y-3">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search template name or style (e.g. Harvard, Silicon Valley, Compact)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid with Real Resume Previews */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map(tpl => {
              const isSelected = selectedTemplate?.id === tpl.id;
              const isActive = activeTemplateId === tpl.id;

              return (
                <TemplateCard
                  key={tpl.id}
                  tpl={tpl}
                  isSelected={isSelected}
                  isActive={isActive}
                  onSelect={handleCardSelect}
                  onProceed={handleProceed}
                  onPreview={handleOpenPreview}
                  previewData={previewData}
                  mode={mode}
                />
              );
            })}
          </div>

          {/* Modal Bottom Footer with Preview & Proceed Action */}
          <div className="p-4 sm:px-6 border-t border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-slate-900">{filteredTemplates.length}</strong> of {RESUME_TEMPLATES.length} templates</span>
              {selectedTemplate && (
                <span className="hidden sm:inline text-slate-400">• Selected: <strong className="text-indigo-600">{selectedTemplate.name}</strong></span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleOpenPreview(selectedTemplate)}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Preview selected template in full size"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Preview Full Size</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleProceed(selectedTemplate)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white rounded-xl font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Use {selectedTemplate?.name || 'This Template'} →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full High-Resolution Template Preview Modal Portal */}
      {previewingTemplate && (
        <FullTemplatePreviewModal
          template={previewingTemplate}
          previewData={previewData}
          onClose={() => setPreviewingTemplate(null)}
          onProceed={(tpl) => {
            setPreviewingTemplate(null);
            handleProceed(tpl);
          }}
          onPrevTemplate={handlePrevTemplateInPreview}
          onNextTemplate={handleNextTemplateInPreview}
          mode={mode}
        />
      )}
    </>
  );
}
