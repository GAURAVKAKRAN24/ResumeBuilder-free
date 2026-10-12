import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Plus, 
  RotateCcw, 
  Trash2, 
  Sparkles,
  FileText,
  BarChart2,
  Layers
} from 'lucide-react';

export function OverviewTab({
  resumeData,
  setResumeData,
  atsAnalysis,
  onResetSample,
  onClearAll,
  onOpenTemplates,
  onOpenAtsModal
}) {
  const [newSectionName, setNewSectionName] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);

  const sectionLabels = {
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Key Skills & Technologies",
    projects: "Highlighted Projects",
    certifications: "Licenses & Certifications",
    languages: "Languages"
  };

  const sectionsOrder = Array.isArray(resumeData.sectionsOrder) && resumeData.sectionsOrder.length > 0
    ? resumeData.sectionsOrder
    : ["summary", "experience", "education", "skills", "projects", "certifications", "languages"];
  const sectionsVisibility = resumeData.sectionsVisibility || {};

  const moveSection = (index, direction) => {
    const newOrder = [...sectionsOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setResumeData(prev => ({ ...prev, sectionsOrder: newOrder }));
  };

  const toggleVisibility = (sectionKey) => {
    setResumeData(prev => ({
      ...prev,
      sectionsVisibility: {
        ...sectionsVisibility,
        [sectionKey]: !sectionsVisibility[sectionKey]
      }
    }));
  };

  const handleAddCustomSection = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;

    const customId = `custom-${Date.now()}`;
    const newOrder = [...resumeData.sectionsOrder, customId];
    const newCustoms = [
      ...(resumeData.customSections || []),
      {
        id: customId,
        title: newSectionName.trim(),
        items: [
          {
            id: `item-${Date.now()}`,
            title: "Project / Honor / Entry Name",
            subtitle: "Organization or Context",
            date: "2024",
            description: "• High-impact achievement or details regarding this custom section."
          }
        ]
      }
    ];

    setResumeData(prev => ({
      ...prev,
      sectionsOrder: newOrder,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [customId]: true
      },
      customSections: newCustoms
    }));

    setNewSectionName("");
    setShowAddCustom(false);
  };

  // Word count & metric counts
  const totalWords = [
    resumeData.summary,
    ...(resumeData.experience || []).map(e => e.description + " " + e.position + " " + e.company),
    ...(resumeData.projects || []).map(p => p.description + " " + p.title),
    ...(resumeData.education || []).map(e => e.degree + " " + e.institution),
    ...(resumeData.skills || []).map(s => s.items)
  ].filter(Boolean).join(" ").split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-8 font-sans">
      {/* ATS Health Card */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/50 p-5 rounded-2xl border border-indigo-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">ATS Readiness Score</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Screening compatibility analysis</p>
            </div>
          </div>
          <button
            onClick={onOpenAtsModal}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
          >
            View Checklist
          </button>
        </div>

        {/* Score Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-800">{atsAnalysis.score >= 90 ? "Excellent" : atsAnalysis.score >= 75 ? "Good" : "Needs Polish"}</span>
            <span className="text-indigo-600 font-extrabold">{atsAnalysis.score} / 100</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                atsAnalysis.score >= 90
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                  : atsAnalysis.score >= 75
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                  : "bg-gradient-to-r from-amber-500 to-orange-500"
              }`}
              style={{ width: `${atsAnalysis.score}%` }}
            />
          </div>
        </div>

        {/* Top Recommendation */}
        {atsAnalysis.issues.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2.5 text-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <span className="font-bold">Quick Tip: </span>
              {atsAnalysis.issues[0]}
            </p>
          </div>
        )}
      </div>

      {/* Live Content Metrics */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-sm text-slate-600 font-bold">Total Words</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalWords}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-sm text-slate-600 font-bold">Est. Pages</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {totalWords < 450 ? "1" : totalWords < 900 ? "2" : "3+"}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-sm text-slate-600 font-bold">Sections</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {sectionsOrder.filter(s => sectionsVisibility[s] !== false).length}
          </div>
        </div>
      </div>

      {/* Sections Manager: Reorder & Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">
              Sections Arrangement
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">Reorder or toggle visibility</span>
        </div>

        <div className="space-y-2 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200">
          {sectionsOrder.map((sectionKey, idx) => {
            const isVisible = sectionsVisibility[sectionKey] !== false;
            let label = sectionLabels[sectionKey];
            if (!label && sectionKey.startsWith("custom-")) {
              const customItem = (resumeData.customSections || []).find(c => c.id === sectionKey);
              label = customItem ? customItem.title : "Custom Section";
            }

            return (
              <div
                key={sectionKey}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all text-sm font-bold ${
                  isVisible 
                    ? "bg-white border-slate-200 text-slate-900 shadow-2xs" 
                    : "bg-slate-100 border-slate-200/60 text-slate-400 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-slate-400 text-xs w-4 font-mono">{idx + 1}.</span>
                  <span className="truncate">{label || sectionKey}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Reorder Buttons */}
                  <button
                    onClick={() => moveSection(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 rounded"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSection(idx, 1)}
                    disabled={idx === sectionsOrder.length - 1}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 rounded"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => toggleVisibility(sectionKey)}
                    className={`p-1.5 rounded transition-colors ${
                      isVisible 
                        ? "text-indigo-600 hover:bg-indigo-50" 
                        : "text-slate-400 hover:bg-slate-200"
                    }`}
                    title={isVisible ? "Hide section from resume" : "Show section"}
                  >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Custom Section Button */}
        {!showAddCustom ? (
          <button
            onClick={() => setShowAddCustom(true)}
            className="w-full py-3 border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50/50 flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Custom Section</span>
          </button>
        ) : (
          <form onSubmit={handleAddCustomSection} className="p-4 bg-white border-2 border-indigo-200 rounded-xl space-y-3 shadow-2xs">
            <label className="text-sm font-bold text-slate-800 block">
              Section Title
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Publications, Awards, Volunteer"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                autoFocus
                className="flex-1 text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="px-3.5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Quick Template Switch Banner */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
        <div>
          <h4 className="text-base font-bold">50+ Clean ATS Templates</h4>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">Harvard, Silicon Valley, Oxford & more</p>
        </div>
        <button
          onClick={onOpenTemplates}
          className="px-4 py-2 bg-white text-slate-900 rounded-xl text-sm font-black hover:bg-slate-100 transition-all shrink-0 uppercase tracking-wide"
        >
          Browse
        </button>
      </div>

      {/* Reset & Clear Actions */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600 font-medium">
        <button
          onClick={onResetSample}
          className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Sample Data</span>
        </button>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All Content</span>
        </button>
      </div>
    </div>
  );
}

