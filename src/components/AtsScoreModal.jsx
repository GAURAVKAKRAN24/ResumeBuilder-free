import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export function AtsScoreModal({ isOpen, onClose, atsAnalysis }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 via-white to-blue-50/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                ATS Screening Report
              </h3>
              <p className="text-xs text-slate-500">
                Automated parsing & keyword evaluation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Big Score Card */}
          <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
              {atsAnalysis.score}
              <span className="text-xl font-bold text-slate-400"> / 100</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {atsAnalysis.score >= 90
                ? "Excellent ATS Compatibility"
                : atsAnalysis.score >= 75
                ? "Good Parse Quality — Minor Optimizations Recommended"
                : "Screening Risks Detected — Needs Attention"}
            </p>
          </div>

          {/* Actionable Recommendations */}
          {atsAnalysis.issues.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Recommended Optimizations ({atsAnalysis.issues.length})</span>
              </h4>
              <div className="space-y-2">
                {atsAnalysis.issues.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <span className="leading-relaxed">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {atsAnalysis.successes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Passing Checks ({atsAnalysis.successes.length})</span>
              </h4>
              <div className="space-y-2">
                {atsAnalysis.successes.map((success, idx) => (
                  <div key={idx} className="p-2.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{success}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATS Guarantee Checklist */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-xs text-slate-700 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>ATS Design Rules Enforced Automatically:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              <li>No unsupported text frames or multi-layer graphics</li>
              <li>Clean, universally recognized section title conventions</li>
              <li>Standard character encoding (UTF-8) with zero missing glyphs</li>
              <li>High-contrast typography readable by OCR document scanners</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}

