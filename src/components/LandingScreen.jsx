import React, { useRef, useState } from 'react';
import { Plus, Upload, Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, LogIn, LayoutGrid } from 'lucide-react';
import { parseResumeFile } from '../utils/resumeParser';
import { useAuth } from '../context/AuthContext';
import { CVnestLogo } from './CVnestLogo';

export function LandingScreen({ onStartNew, onUploadResume, onLoadSample, onGoToDashboard }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user, isLoggedIn, setIsAuthModalOpen } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await parseResumeFile(file);
      onUploadResume(result.data);
    } catch (err) {
      alert("Error parsing file: " + err.message);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-gradient-to-b from-[#F0F4F8] via-slate-50 to-slate-100/70 flex flex-col justify-between font-sans selection:bg-teal-100 overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      
      {/* TOP HEADER WITH LOGO & GOOGLE SIGN IN */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CVnestLogo size="md" theme="light" />
          <span className="hidden sm:inline-block text-[11px] font-bold bg-teal-100/80 text-teal-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-1">
            ATS Engine
          </span>
        </div>

        <div>
          {isLoggedIn ? (
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Go to My Resumes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs hover:shadow transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero & Choice Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:px-8 max-w-5xl mx-auto w-full my-auto">
        
        {/* Brand Banner */}
        <div className="max-w-4xl w-full text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs sm:text-sm font-medium mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Next-Gen ATS Resume Engine • 50+ Clean Templates</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Create an ATS-Optimized Resume <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d2a3a] via-[#103d4c] to-[#0f606e]">
              That Lands Real Interviews
            </span>
          </h1>
          <p className="mt-2 sm:mt-2.5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Tailored for high parse rates on Workday, Taleo, Greenhouse & Lever. Choose from 50+ recruiter-approved styles with real-time live preview.
          </p>
        </div>

        {/* Main Choice Cards: Dashed Empty Boxes with Centered Icons */}
        <div className="max-w-3xl lg:max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
          
          {/* Option 1: Create New Resume */}
          <div
            onClick={onStartNew}
            className="group relative bg-white/90 hover:bg-white rounded-3xl p-6 sm:p-8 lg:py-8 lg:px-7 border-2 border-dashed border-teal-300 hover:border-teal-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center transform hover:-translate-y-1"
          >
            <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                Recommended
              </span>
            </div>

            {/* Centered Plus Icon in Empty Dashed Box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-50 group-hover:bg-gradient-to-r group-hover:from-[#0d2a3a] group-hover:via-[#103d4c] group-hover:to-[#0f606e] text-teal-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-inner mb-4 group-hover:scale-105">
              <Plus className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-1.5">
              Create New Resume
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xs mb-4 leading-relaxed">
              Start with a fresh, clean slate. Guided step-by-step editor with real-time ATS scoring.
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 group-hover:text-teal-800">
              <span>Start from scratch</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Option 2: Upload Existing Resume */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative bg-white/90 hover:bg-white rounded-3xl p-6 sm:p-8 lg:py-8 lg:px-7 border-2 border-dashed border-teal-300 hover:border-teal-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center transform hover:-translate-y-1"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt,.doc,.docx,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                Fast Import
              </span>
            </div>

            {/* Centered Upload / Document Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-50 group-hover:bg-gradient-to-r group-hover:from-[#0d2a3a] group-hover:via-[#103d4c] group-hover:to-[#0f606e] text-teal-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-inner mb-4 group-hover:scale-105">
              {isUploading ? (
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2] animate-spin text-teal-700 group-hover:text-white" />
              ) : (
                <Upload className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.2]" />
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-1.5">
              {isUploading ? "Extracting Content..." : "Upload Existing Resume"}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xs mb-4 leading-relaxed">
              {isUploading 
                ? "Reading structure & contact info..." 
                : "Upload JSON, TXT, DOCX, or PDF. Automatically extracts sections and contact info."}
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 group-hover:text-teal-800">
              <span>{isUploading ? "Please wait a moment..." : "Select file from computer"}</span>
              {!isUploading && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
            </div>
          </div>

        </div>

        {/* ATS Trust Indicators */}
        <div className="mt-4 sm:mt-6 max-w-3xl w-full border-t border-slate-200/80 pt-4 sm:pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center shrink-0">
          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% ATS Machine Readable</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Real-time Live Sync Preview</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>50+ Recruiter-Tested Layouts</span>
          </div>
        </div>

      </div>
    </div>
  );
}
