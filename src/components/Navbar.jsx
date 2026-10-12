import React, { useState } from 'react';
import { 
  FileText, 
  Layout, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Printer, 
  Copy, 
  FileDown, 
  ChevronDown, 
  Sparkles,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Check,
  Loader2,
  LogOut,
  User,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { CVnestLogo } from './CVnestLogo';
import { UserAvatar } from './UserAvatar';

export function Navbar({
  resumeTitle,
  setResumeTitle,
  atsScore,
  onOpenTemplates,
  onOpenAtsModal,
  onBackToHome,
  mobileView,
  setMobileView,
  zoom,
  setZoom,
  onDownloadPdf,
  onPrintResume,
  onCopyPlainText,
  onExportJson,
  saveStatus = 'saved'
}) {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoggedIn, logout, setIsAuthModalOpen } = useAuth();

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getAtsColorClass = (score) => {
    if (score >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-300";
    if (score >= 75) return "bg-blue-50 text-blue-700 border-blue-300";
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-300";
    return "bg-rose-50 text-rose-700 border-rose-300";
  };

  const handleDownloadAction = (actionFn) => {
    if (!isLoggedIn) {
      setDownloadMenuOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    setDownloadMenuOpen(false);
    triggerCelebration();
    actionFn();
  };

  const handleDownloadButtonClick = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setDownloadMenuOpen(!downloadMenuOpen);
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs font-sans">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Brand, Back Button & Resume Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            title="Return to Dashboard / Home"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 font-bold text-xs"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">My Resumes</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <CVnestLogo size="md" showText={false} theme="light" />
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="text-sm font-bold text-slate-900 hover:bg-slate-100/70 focus:bg-white rounded px-1.5 py-0.5 border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-44 sm:w-56 truncate transition-all"
                  title="Click to rename resume"
                />
                
                {/* Auto-save Status Indicator */}
                <div className="hidden md:flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                      <span className="text-amber-600">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-600 font-semibold">Saved</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Mobile Switcher, ATS Pill & Templates */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setMobileView('editor')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                mobileView === 'editor'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                mobileView === 'preview'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* ATS Score Pill */}
          <button
            onClick={onOpenAtsModal}
            className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-105 shadow-2xs ${getAtsColorClass(atsScore)}`}
            title="Click for ATS score breakdown & recommendations"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>ATS Score: {atsScore}%</span>
          </button>

          {/* Choose Template Button (50+ Templates) */}
          <button
            onClick={onOpenTemplates}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 text-xs sm:text-sm font-semibold transition-all group shadow-2xs"
          >
            <Layout className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
            <span>Templates</span>
            <span className="text-[11px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
              50+
            </span>
          </button>
        </div>

        {/* Right Side: Zoom, Download & Google Sign-In */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom controls */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium">
            <button
              onClick={() => setZoom(z => Math.max(0.6, +(z - 0.1).toFixed(1)))}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span 
              onClick={() => setZoom(1.1)} 
              title="Click to reset to default (110%)"
              className="px-1 text-[11px] font-semibold text-slate-700 min-w-[42px] text-center cursor-pointer hover:text-teal-700 select-none"
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.4, +(z + 0.1).toFixed(1)))}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download Action Button (Locked until user signs in!) */}
          <div className="relative">
            <button
              onClick={handleDownloadButtonClick}
              title={isLoggedIn ? "Download Resume" : "Sign in with Google to download resume"}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
                isLoggedIn 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-300 ring-2 ring-indigo-500/30'
              }`}
            >
              {isLoggedIn ? (
                <Download className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4 text-amber-300" />
              )}
              <span className="hidden sm:inline">Download</span>
              {!isLoggedIn && (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                  Login
                </span>
              )}
              {isLoggedIn && <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />}
            </button>

            {downloadMenuOpen && isLoggedIn && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDownloadMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                      Export Resume
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownloadAction(onDownloadPdf)}
                    className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <FileDown className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="font-semibold text-slate-800">Direct PDF Download</div>
                      <div className="text-[11px] text-slate-400">High-res ATS friendly PDF</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDownloadAction(onPrintResume)}
                    className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <Printer className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-semibold text-slate-800">Print / Browser PDF</div>
                      <div className="text-[11px] text-slate-400">Standard system print dialog</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => handleDownloadAction(onCopyPlainText)}
                    className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-800">Copy Plain Text</div>
                      <div className="text-[11px] text-slate-400">Quick paste into job portals</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDownloadAction(onExportJson)}
                    className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-800">Export JSON Backup</div>
                      <div className="text-[11px] text-slate-400">Save and edit anytime later</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Google Auth Button / User Profile */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-teal-400 focus:outline-hidden transition-all"
                title={user?.name || "User account"}
              >
                <UserAvatar
                  user={user}
                  size="sm"
                  variant="navbar"
                  showStatus={true}
                />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <UserAvatar
                        user={user}
                        size="md"
                        variant="navbar"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onBackToHome();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>My Resumes Dashboard</span>
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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

      </div>
    </header>
  );
}
