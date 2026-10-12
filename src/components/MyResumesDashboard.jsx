import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CVnestLogo } from './CVnestLogo';
import { UserAvatar } from './UserAvatar';
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Edit3, 
  Sparkles, 
  Download, 
  LogOut, 
  Briefcase, 
  Mail, 
  Layers, 
  User, 
  Eye,
  History,
  Check,
  Search,
  LayoutGrid,
  List,
  Menu,
  X,
  Share2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Clock,
  Lock
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { ResumePreview } from './ResumePreview';
import { TemplateModal } from './TemplateModal';
import { initialResumeData, blankResumeData } from '../data/defaultResume';
import { initialCustomization } from '../data/customizationDefaults';
import { calculateAtsScore } from '../utils/atsChecker';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Edited recently';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Edited just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Edited ${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Edited ${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Edited 1 day ago';
  return `Edited ${diffDays} days ago`;
}

function ResumeThumbnail({ resume, width = 144, height = 192, className = "" }) {
  if (!resume?.data) return null;
  const a4Width = 794;
  const a4Height = 1123;
  const scale = width / a4Width;

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-xl shadow-md overflow-hidden relative select-none shrink-0 ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        className="absolute top-0 left-0 pointer-events-none select-none"
        style={{
          width: `${a4Width}px`,
          minHeight: `${a4Height}px`,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <ResumePreview
          resumeData={resume.data}
          customization={resume.customization || initialCustomization}
          isThumbnail={true}
        />
      </div>
    </div>
  );
}

function ResumeActionDropdown({ resume, onRename, onDuplicate, onDelete, onClose }) {
  return (
    <>
      <div 
        className="fixed inset-0 z-30" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }} 
      />

      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onRename}
          className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
          <span>Rename</span>
        </button>

        <button
          type="button"
          onClick={onDuplicate}
          className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          <span>Duplicate</span>
        </button>

        <div className="h-px bg-slate-100 my-1" />

        <button
          type="button"
          onClick={onDelete}
          className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Delete</span>
        </button>
      </div>
    </>
  );
}

function SecondaryResumeCard({
  resume,
  activeMenuResumeId,
  setActiveMenuResumeId,
  onOpenResume,
  onPreviewResume,
  onDownloadResume,
  onDeleteResume,
  onRenameResume,
  onDuplicateResume,
}) {
  return (
    <div className="rounded-[22px] sm:rounded-[26px] bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-5 md:p-6 flex flex-col justify-between relative overflow-hidden group h-full min-h-[260px] sm:min-h-[310px] md:min-h-[355px]">
      {/* Soft Coral Accent Blob */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-rose-400/25 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          <div className="truncate min-w-0">
            <h3 
              onClick={() => onOpenResume(resume.id)}
              className="font-black text-xs sm:text-base md:text-lg text-slate-900 hover:text-indigo-600 transition-colors truncate cursor-pointer leading-tight"
              title={resume.title}
            >
              {resume.title}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
              {formatTimeAgo(resume.updatedAt)} • {resume.pageFormat || 'A4'}
            </p>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 relative">
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuResumeId(activeMenuResumeId === resume.id ? null : resume.id);
                }}
                className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Options"
              >
                <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {activeMenuResumeId === resume.id && (
                <ResumeActionDropdown
                  resume={resume}
                  onRename={() => {
                    setActiveMenuResumeId(null);
                    onRenameResume(resume);
                  }}
                  onDuplicate={() => {
                    setActiveMenuResumeId(null);
                    onDuplicateResume(resume.id);
                  }}
                  onDelete={() => {
                    setActiveMenuResumeId(null);
                    onDeleteResume(resume);
                  }}
                  onClose={() => setActiveMenuResumeId(null)}
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => onDeleteResume(resume)}
              className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title={`Delete ${resume.title}`}
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Centered Scaled Resume Preview */}
        <div 
          onClick={() => onOpenResume(resume.id)}
          className="my-1.5 sm:my-3.5 flex justify-center cursor-pointer group-hover:scale-105 transition-transform duration-300"
          title="Click to edit resume"
        >
          {/* Mobile compact thumbnail */}
          <div className="block sm:hidden">
            <ResumeThumbnail resume={resume} width={82} height={116} />
          </div>
          {/* Tablet & Desktop thumbnail */}
          <div className="hidden sm:block">
            <ResumeThumbnail resume={resume} width={124} height={175} />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-1 sm:gap-2 pt-1.5 sm:pt-2 z-10">
        <button
          type="button"
          onClick={() => onOpenResume(resume.id)}
          className="flex-1 py-1.5 sm:py-2 px-1.5 sm:px-3 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-[11px] sm:text-xs rounded-lg sm:rounded-xl border border-slate-300 shadow-2xs text-center transition-all cursor-pointer truncate"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onPreviewResume(resume)}
          className="p-1.5 sm:p-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 rounded-lg sm:rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer shrink-0"
          title="Preview"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => onDownloadResume(resume, e)}
          className="p-1.5 sm:p-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 rounded-lg sm:rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer shrink-0"
          title="Download PDF"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

export function MyResumesDashboard({ onOpenEditor }) {
  const navigate = useNavigate();
  const { 
    resumes, 
    createResume, 
    duplicateResume, 
    renameResume, 
    deleteResume, 
    setActiveResumeId,
    cleanupBlankDrafts,
    isResumeBlank,
    isUneditedDraft
  } = useResume();
  const { user, logout, isLoggedIn, setIsAuthModalOpen } = useAuth();

  useEffect(() => {
    if (cleanupBlankDrafts) cleanupBlankDrafts();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeMenuResumeId, setActiveMenuResumeId] = useState(null);
  const [renameModalResume, setRenameModalResume] = useState(null);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [previewResume, setPreviewResume] = useState(null);
  const [historyResume, setHistoryResume] = useState(null);
  const [deleteConfirmResume, setDeleteConfirmResume] = useState(null);
  const [copiedId, setCopiedId] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDuplicate = (id) => {
    const original = resumes.find(r => r.id === id);
    const newId = duplicateResume(id);
    if (newId) {
      showToast(`✨ Duplicated "${original?.title || 'Resume'}" successfully!`);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (!renameModalResume || !newResumeTitle.trim()) return;
    const trimmedTitle = newResumeTitle.trim();
    renameResume(renameModalResume.id, trimmedTitle);
    showToast(`✨ Renamed to "${trimmedTitle}"`);
    setRenameModalResume(null);
    setNewResumeTitle('');
  };

  // Hidden print container ref for direct PDF export from dashboard
  const hiddenPrintAreaRef = useRef(null);

  // Handlers
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Handlers
  const handleOpenResume = (id) => {
    setActiveResumeId(id);
    onOpenEditor();
  };

  // Filter out any blank or unedited draft resumes so they never render as cards
  const validResumes = resumes.filter((r) => {
    if (isUneditedDraft && isUneditedDraft(r)) return false;
    if (r.isDraft && isResumeBlank(r)) return false;
    return true;
  });

  const handleCreateNew = () => {
    setIsCreateTemplateModalOpen(true);
  };

  const handleTemplateChosenForNewResume = (template) => {
    setIsCreateTemplateModalOpen(false);
    if (cleanupBlankDrafts) cleanupBlankDrafts();

    const templateCustomization = {
      ...initialCustomization,
      templateId: template.id,
      ...template.preset,
      layout: { ...initialCustomization.layout, ...template.preset?.layout },
      font: { ...initialCustomization.font, ...template.preset?.font },
      sectionHeadings: { ...initialCustomization.sectionHeadings, ...template.preset?.sectionHeadings },
      header: { ...initialCustomization.header, ...template.preset?.header },
      colors: { 
        ...initialCustomization.colors, 
        ...template.preset?.colors,
        applyAccentTo: {
          ...initialCustomization.colors?.applyAccentTo,
          ...(template.preset?.colors?.applyAccentTo || {})
        }
      },
      spacing: { ...initialCustomization.spacing, ...template.preset?.spacing },
    };

    const newId = createResume({ 
      title: `${template.name} Resume`,
      data: JSON.parse(JSON.stringify(initialResumeData)),
      customization: templateCustomization,
      isDraft: false,
      isEdited: true
    });
    setActiveResumeId(newId);
    navigate('/editor');
    if (onOpenEditor) onOpenEditor();
  };

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handleDirectDownload = async (resume, e) => {
    if (e) e.stopPropagation();
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsExporting(true);
    // Temporary set for print
    setPreviewResume(resume);

    setTimeout(async () => {
      const element = document.getElementById('dashboard-print-area');
      if (!element) {
        setIsExporting(false);
        return;
      }

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${resume.title || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.avoid-break'] }
      };

      try {
        await html2pdf().from(element).set(opt).save();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {
        console.error("Export error:", err);
      } finally {
        setIsExporting(false);
        setPreviewResume(null);
      }
    }, 300);
  };

  // Filter resumes by search query (checks title, ID, target role, full name)
  const filteredResumes = validResumes.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const titleMatch = (r.title || '').toLowerCase().includes(q);
    const idMatch = (r.id || '').toLowerCase().includes(q);
    const nameMatch = (r.data?.personalDetails?.fullName || '').toLowerCase().includes(q);
    const roleMatch = (r.data?.personalDetails?.jobTitle || '').toLowerCase().includes(q);
    return titleMatch || idMatch || nameMatch || roleMatch;
  });

  // Featured first resume (e.g. Gaurav Kakran or first item)
  const featuredResume = filteredResumes[0];
  const secondaryResumes = filteredResumes.slice(1);

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex font-sans text-slate-800">
      
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d2a3a]/95 backdrop-blur-md border-b border-teal-800/40 px-4 flex items-center justify-between z-30 shadow-md">
        <CVnestLogo size="sm" theme="dark" />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-teal-200 hover:text-white rounded-lg hover:bg-white/10"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* LEFT SIDEBAR (MATCHING HEADER & CREATE RESUME TEAL BACKGROUND THEME) */}
      <aside
        className={`w-64 shrink-0 bg-gradient-to-b from-[#0d2a3a] via-[#103d4c] to-[#0e3b48] border-r border-teal-800/40 text-white flex flex-col justify-between p-6 z-40 transition-transform duration-200 relative overflow-hidden ${
          mobileSidebarOpen
            ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl'
            : 'hidden lg:flex fixed lg:sticky top-0 h-screen'
        }`}
      >
        {/* Subtle background glow */}
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding & Menu */}
        <div className="z-10">
          {/* Logo */}
          <div className="mb-10">
            <CVnestLogo size="md" theme="dark" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {/* 1. Resume (Active Tab with Blue/Teal highlighted style) */}
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 text-white border border-white/20 font-bold text-base shadow-sm backdrop-blur-sm"
            >
              <FileText className="w-5 h-5 text-teal-300" />
              <span>Resume</span>
            </button>

            {/* 2. Cover Letter */}
            <button
              onClick={() => alert("Cover Letter builder available in Pro mode!")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-teal-100/70 hover:text-white hover:bg-white/10 font-medium text-base transition-colors"
            >
              <Mail className="w-5 h-5 text-teal-300/60" />
              <span>Cover Letter</span>
            </button>

            {/* 3. Job Tracker */}
            <button
              onClick={() => alert("Job Tracker is available in Pro mode!")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-teal-100/70 hover:text-white hover:bg-white/10 font-medium text-base transition-colors"
            >
              <Briefcase className="w-5 h-5 text-teal-300/60" />
              <span>Job Tracker</span>
            </button>

            {/* 4. More */}
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-teal-100/70 hover:text-white hover:bg-white/10 font-medium text-base transition-colors"
            >
              <Layers className="w-5 h-5 text-teal-300/60" />
              <span>More</span>
            </button>
          </nav>
        </div>

        {/* Bottom Menu Items */}
        <div className="space-y-3 pt-6 border-t border-teal-800/40 z-10">
          <button
            onClick={() => setProModalOpen(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 text-slate-950 rounded-2xl text-xs font-black shadow-md hover:brightness-105 transition-all text-center"
          >
            Upgrade to Pro
          </button>
          <button
            onClick={() => alert("50% discount for verified student emails!")}
            className="w-full text-left text-xs font-semibold text-teal-200/80 hover:text-white transition-colors py-1 block"
          >
            Student Benefits
          </button>

          {/* User Profile Bar */}
          <div className="pt-3 border-t border-teal-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <UserAvatar
                user={user}
                size="sm"
                variant="sidebar"
                showStatus={isLoggedIn}
              />
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {isLoggedIn ? (user?.name || "Logged In User") : "Guest User"}
                </div>
                <div className="text-[11px] text-teal-200/70 truncate">
                  {isLoggedIn ? (user?.email || "Signed In") : "No cloud history"}
                </div>
              </div>
            </div>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-teal-200/70 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                title="Sign in with Google"
                className="px-2.5 py-1 bg-white text-slate-950 text-[11px] font-bold rounded-lg hover:bg-teal-50 transition-colors ml-1"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-h-screen p-5 sm:p-8 lg:p-10 max-w-[1500px] mx-auto w-full pt-20 lg:pt-8 space-y-6">
        
        {/* TOP HERO / BANNER CARD (EXACT TEAL GRADIENT MATCH FROM SCREENSHOT) */}
        <div className="rounded-[28px] bg-gradient-to-r from-[#0d2a3a] via-[#103d4c] to-[#0f606e] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-teal-800/40">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Left Text */}
          <div className="z-10">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              My Resumes
            </h1>
            <p className="text-sm sm:text-base text-teal-100/90 font-medium">
              Free Forever. Need more?{' '}
              <button
                onClick={() => setProModalOpen(true)}
                className="underline underline-offset-4 font-bold text-white hover:text-teal-200 transition-colors"
              >
                Upgrade your plan
              </button>
            </p>
          </div>

          {/* Right Controls: Search Pill & Sorting */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Resumes..."
                className="pl-9 pr-4 py-2.5 rounded-full bg-white text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md w-full sm:w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting / View Switcher */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-100/90 bg-black/20 backdrop-blur-sm px-3.5 py-2 rounded-full border border-white/10 self-start sm:self-auto">
              <span className="text-teal-300/80 mr-0.5">Sorting:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-1.5 py-0.5 rounded transition-colors ${viewMode === 'grid' ? 'text-white underline font-black' : 'text-teal-200/70 hover:text-white'}`}
              >
                Grid
              </button>
              <span className="opacity-40">|</span>
              <button
                onClick={() => setViewMode('list')}
                className={`px-1.5 py-0.5 rounded transition-colors ${viewMode === 'list' ? 'text-white underline font-black' : 'text-teal-200/70 hover:text-white'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* MAIN ROW: [CREATE NEW RESUME] + [FEATURED RESUME (GAURAV KAKRAN)] + [SECONDARY CARD] */}
        {viewMode === 'grid' ? (
          <div className="space-y-6">
            
            {/* Top Cards Trio (As in the User's Screenshot) */}
            <div className="grid grid-cols-2 md:grid-cols-12 gap-3 sm:gap-6 items-stretch">
              
              {/* 1. START FRESH: CREATE NEW RESUME CARD */}
              <div
                onClick={handleCreateNew}
                className="col-span-1 md:col-span-3 rounded-[22px] sm:rounded-[26px] bg-gradient-to-b from-[#0e2c3c] via-[#114555] to-[#126b77] p-3 sm:p-5 md:p-6 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group select-none border border-teal-800/40 h-full min-h-[260px] sm:min-h-[310px] md:min-h-[355px]"
              >
                {/* Header text */}
                <div>
                  <span className="text-teal-200/90 text-[10px] sm:text-xs md:text-sm font-bold block">Start Fresh:</span>
                  <h3 className="text-xs sm:text-lg md:text-2xl font-black text-white mt-0.5 leading-snug">
                    Create New Resume
                  </h3>
                </div>

                {/* Centered Plus Button */}
                <div className="my-auto flex items-center justify-center py-2 sm:py-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-white/30 group-hover:border-white bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-light shadow-xl transition-all duration-300 group-hover:scale-110">
                    +
                  </div>
                </div>

                {/* Bottom Stacked Resume Graphic (Simulated ATS Sheets) */}
                <div className="relative mx-auto w-24 sm:w-32 md:w-40 h-12 sm:h-16 md:h-20 -mb-1 sm:-mb-2 opacity-85 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-white/10 rounded-xl transform -rotate-6 scale-95 border border-white/10"></div>
                  <div className="absolute inset-0 bg-white/20 rounded-xl transform rotate-3 scale-95 border border-white/20"></div>
                  <div className="absolute inset-0 bg-white rounded-xl shadow-md p-1.5 sm:p-2.5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="h-1 sm:h-1.5 w-8 sm:w-12 bg-indigo-600 rounded"></div>
                      <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-slate-200 rounded"></div>
                      <div className="h-0.5 sm:h-1 w-12 sm:w-20 bg-slate-200 rounded"></div>
                    </div>
                    <div className="flex justify-end gap-1">
                      <div className="w-2.5 sm:w-4 h-2 sm:h-3 bg-rose-400 rounded-xs"></div>
                      <div className="w-2.5 sm:w-4 h-2 sm:h-3 bg-amber-400 rounded-xs"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. FEATURED RESUME CARD */}
              {featuredResume && (
                <div className={`${secondaryResumes.length === 0 ? 'col-span-1 md:col-span-9' : 'col-span-1 md:col-span-6'} rounded-[22px] sm:rounded-[26px] bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-5 md:p-6 flex flex-col justify-between relative overflow-hidden group h-full min-h-[260px] sm:min-h-[310px] md:min-h-[355px]`}>
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

                  {/* MOBILE COMPACT VIEW (< md) - 1 row me 2 format */}
                  <div className="flex md:hidden flex-col justify-between h-full">
                    {/* Top Header */}
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div className="truncate min-w-0">
                          <h3 
                            onClick={() => handleOpenResume(featuredResume.id)}
                            className="font-black text-xs sm:text-base text-slate-900 hover:text-indigo-600 transition-colors truncate cursor-pointer leading-tight"
                            title={featuredResume.title}
                          >
                            {featuredResume.title}
                          </h3>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                            {formatTimeAgo(featuredResume.updatedAt)} • {featuredResume.pageFormat || 'A4'}
                          </p>
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0 relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuResumeId(activeMenuResumeId === featuredResume.id ? null : featuredResume.id);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          {activeMenuResumeId === featuredResume.id && (
                            <ResumeActionDropdown
                              resume={featuredResume}
                              onRename={() => {
                                setActiveMenuResumeId(null);
                                setRenameModalResume(featuredResume);
                                setNewResumeTitle(featuredResume.title);
                              }}
                              onDuplicate={() => {
                                setActiveMenuResumeId(null);
                                handleDuplicate(featuredResume.id);
                              }}
                              onDelete={() => {
                                setActiveMenuResumeId(null);
                                setDeleteConfirmResume(featuredResume);
                              }}
                              onClose={() => setActiveMenuResumeId(null)}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmResume(featuredResume)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title={`Delete ${featuredResume.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Center Thumbnail */}
                      <div 
                        onClick={() => handleOpenResume(featuredResume.id)}
                        className="my-1.5 flex justify-center cursor-pointer group-hover:scale-105 transition-transform duration-300"
                        title="Click to edit resume"
                      >
                        <ResumeThumbnail resume={featuredResume} width={82} height={116} />
                      </div>
                    </div>

                    {/* Bottom Actions + Mini ATS Pill */}
                    <div>
                      <div className="flex items-center gap-1 pt-1.5 z-10">
                        <button
                          type="button"
                          onClick={() => handleOpenResume(featuredResume.id)}
                          className="flex-1 py-1.5 px-1.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-[11px] rounded-lg border border-slate-300 shadow-2xs text-center transition-all cursor-pointer truncate"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewResume(featuredResume)}
                          className="p-1.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 rounded-lg border border-slate-300 shadow-2xs transition-all cursor-pointer shrink-0"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDirectDownload(featuredResume, e)}
                          className="p-1.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 rounded-lg border border-slate-300 shadow-2xs transition-all cursor-pointer shrink-0"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded text-center mt-1 truncate">
                        Score: {calculateAtsScore(featuredResume.data).score}% • ATS
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP VIEW (>= md) - Original Featured Card Structure */}
                  <div className="hidden md:flex flex-col justify-between h-full">
                    <div>
                      {/* Top Title & Metadata */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 
                              onClick={() => handleOpenResume(featuredResume.id)}
                              className="text-2xl lg:text-3xl font-black text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                            >
                              {featuredResume.title}
                            </h2>
                            {/* Unique Resume ID Tag */}
                            <button
                              onClick={(e) => handleCopyId(featuredResume.id, e)}
                              title="Click to copy unique Resume ID"
                              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-mono font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <span>#{featuredResume.id}</span>
                              {copiedId === featuredResume.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 opacity-60" />}
                            </button>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                            <span>{formatTimeAgo(featuredResume.updatedAt)} • {featuredResume.pageFormat || 'A4'}</span>
                            {isLoggedIn ? (
                              <>
                                <span>•</span>
                                <button
                                  onClick={() => setHistoryResume(featuredResume)}
                                  className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
                                >
                                  <History className="w-3 h-3" />
                                  <span>{(featuredResume.history || []).length} edits</span>
                                </button>
                              </>
                            ) : null}
                          </p>
                        </div>

                        {/* Top Action Buttons (Delete & 3-dot Menu) */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmResume(featuredResume)}
                            title={`Delete ${featuredResume.title}`}
                            className="px-3 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 border border-transparent hover:border-rose-200 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold text-rose-600">Delete</span>
                          </button>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuResumeId(activeMenuResumeId === featuredResume.id ? null : featuredResume.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                              title="More options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeMenuResumeId === featuredResume.id && (
                              <ResumeActionDropdown
                                resume={featuredResume}
                                onRename={() => {
                                  setActiveMenuResumeId(null);
                                  setRenameModalResume(featuredResume);
                                  setNewResumeTitle(featuredResume.title);
                                }}
                                onDuplicate={() => {
                                  setActiveMenuResumeId(null);
                                  handleDuplicate(featuredResume.id);
                                }}
                                onDelete={() => {
                                  setActiveMenuResumeId(null);
                                  setDeleteConfirmResume(featuredResume);
                                }}
                                onClose={() => setActiveMenuResumeId(null)}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle Flex: Actions on left, Thumbnail on right */}
                      <div className="grid grid-cols-12 gap-4 items-center my-2">
                        {/* Left: Action Buttons */}
                        <div className="col-span-6 space-y-2.5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleOpenResume(featuredResume.id)}
                              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setPreviewResume(featuredResume)}
                              className="px-3.5 py-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Preview</span>
                            </button>

                            <button
                              onClick={(e) => handleDirectDownload(featuredResume, e)}
                              className="px-3.5 py-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-500" />
                              <span>Download</span>
                            </button>

                            <button
                              onClick={() => setDeleteConfirmResume(featuredResume)}
                              className="px-3.5 py-2 bg-white hover:bg-rose-50 hover:text-rose-600 active:scale-95 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                              title={`Delete ${featuredResume.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Right: Scaled Resume Thumbnail */}
                        <div 
                          onClick={() => handleOpenResume(featuredResume.id)}
                          className="col-span-6 flex justify-center cursor-pointer group-hover:scale-105 transition-transform duration-300"
                          title="Click to edit resume"
                        >
                          <ResumeThumbnail resume={featuredResume} width={124} height={175} className="shadow-lg" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom ATS Score Bar */}
                    <div className="pt-2.5 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-black text-slate-800 mb-1">
                        <span>Resume Score: {calculateAtsScore(featuredResume.data).score}%</span>
                        <span className="text-emerald-600 font-bold">ATS Optimized</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${calculateAtsScore(featuredResume.data).score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. ALL SECONDARY RESUMES (ANUBHAV RESUME, SUMIT KUMAR RESUME, ETC.) */}
              {secondaryResumes.map((resume, idx) => (
                <div
                  key={resume.id}
                  className={`col-span-1 ${idx === 0 ? 'md:col-span-3' : 'md:col-span-4 lg:col-span-3'} flex flex-col h-full`}
                >
                  <SecondaryResumeCard
                    resume={resume}
                    activeMenuResumeId={activeMenuResumeId}
                    setActiveMenuResumeId={setActiveMenuResumeId}
                    onOpenResume={handleOpenResume}
                    onPreviewResume={setPreviewResume}
                    onDownloadResume={handleDirectDownload}
                    onDeleteResume={setDeleteConfirmResume}
                    onRenameResume={(res) => {
                      setRenameModalResume(res);
                      setNewResumeTitle(res.title);
                    }}
                    onDuplicateResume={handleDuplicate}
                  />
                </div>
              ))}

              {/* SEARCH NO RESULTS */}
              {resumes.length > 0 && filteredResumes.length === 0 && (
                <div className="col-span-2 md:col-span-9 rounded-[26px] bg-white border border-slate-200 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[320px]">
                  <Search className="w-10 h-10 text-slate-400 mb-3" />
                  <h4 className="font-bold text-slate-800 text-lg mb-1">No resumes match "{searchQuery}"</h4>
                  <p className="text-sm text-slate-500 mb-4">Try searching with another keyword or clear the search filter.</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* LIST VIEW MODE */
          filteredResumes.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-slate-200/90 p-12 text-center flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-slate-300 mb-3" />
              <h4 className="text-lg font-black text-slate-800 mb-1">No Resumes in List</h4>
              <p className="text-sm text-slate-500 mb-5">Click below to create a new resume or clear your filter.</p>
              <button
                onClick={handleCreateNew}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Resume</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
            {filteredResumes.map((resume) => (
              <div 
                key={resume.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                    {resume.title[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 
                        onClick={() => handleOpenResume(resume.id)}
                        className="font-bold text-base text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                      >
                        {resume.title}
                      </h3>
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{resume.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{formatTimeAgo(resume.updatedAt)}</span>
                      <span>•</span>
                      <span>Score: {calculateAtsScore(resume.data).score}%</span>
                      {isLoggedIn && (resume.history || []).length > 0 && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => setHistoryResume(resume)}
                            className="text-indigo-600 font-semibold hover:underline"
                          >
                            {(resume.history || []).length} edits
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenResume(resume.id)}
                    className="px-4 py-2 bg-[#2563EB] text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setPreviewResume(resume)}
                    className="p-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDirectDownload(resume, e)}
                    className="p-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmResume(resume)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuResumeId(activeMenuResumeId === resume.id ? null : resume.id);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenuResumeId === resume.id && (
                      <ResumeActionDropdown
                        resume={resume}
                        onRename={() => {
                          setActiveMenuResumeId(null);
                          setRenameModalResume(resume);
                          setNewResumeTitle(resume.title);
                        }}
                        onDuplicate={() => {
                          setActiveMenuResumeId(null);
                          handleDuplicate(resume.id);
                        }}
                        onDelete={() => {
                          setActiveMenuResumeId(null);
                          setDeleteConfirmResume(resume);
                        }}
                        onClose={() => setActiveMenuResumeId(null)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

      </main>

      {/* ============================================================== */}
      {/* 1. INSTANT FULLSCREEN PREVIEW MODAL */}
      {/* ============================================================== */}
      {previewResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <span>{previewResume.title}</span>
                  <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                    #{previewResume.id}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">{formatTimeAgo(previewResume.updatedAt)} • High-Resolution Live Preview</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenResume(previewResume.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Open in Editor</span>
                </button>
                <button
                  onClick={(e) => handleDirectDownload(previewResume, e)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setPreviewResume(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scaled Resume Paper */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100/80 flex justify-center">
              <ResumePreview
                resumeData={previewResume.data}
                customization={previewResume.customization}
                zoom={0.82}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. RESUME REVISION HISTORY MODAL (ONLY FOR LOGGED-IN USERS) */}
      {/* ============================================================== */}
      {historyResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 border border-slate-200">
            <button
              onClick={() => setHistoryResume(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Revision History</h3>
                <p className="text-xs text-slate-500 font-mono">Resume ID: #{historyResume.id}</p>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 py-2">
                {(historyResume.history || []).length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No historical snapshots recorded yet.</p>
                ) : (
                  (historyResume.history || []).map((h, idx) => (
                    <div key={h.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900">{h.action || 'Updated Content'}</div>
                        <div className="text-xs text-slate-500">{h.note || 'Auto-saved version'}</div>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(h.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">History Available for Logged-In Users</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Revision history is only managed for authenticated accounts. Sign in to track past edits.
                </p>
                <button
                  onClick={() => {
                    setHistoryResume(null);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Sign In with Google
                </button>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHistoryResume(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. DELETE CONFIRMATION MODAL WITH SPECIFIC RESUME ID */}
      {/* ============================================================== */}
      {deleteConfirmResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Delete this resume?</h3>
            <p className="text-sm text-slate-600 mt-2">
              Are you sure you want to permanently delete:
            </p>
            <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800 text-sm">
              <span className="font-bold">{deleteConfirmResume.title}</span>
              <span className="block font-mono text-xs text-slate-400 mt-0.5">ID: #{deleteConfirmResume.id}</span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmResume(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteResume(deleteConfirmResume.id);
                  setDeleteConfirmResume(null);
                  showToast("Resume deleted.");
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Delete Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. RENAME RESUME MODAL */}
      {/* ============================================================== */}
      {renameModalResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-200">
            <button
              type="button"
              onClick={() => setRenameModalResume(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Rename Resume</h3>
                <p className="text-xs text-slate-500 font-mono">ID: #{renameModalResume.id}</p>
              </div>
            </div>

            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Resume Title</label>
                <input
                  type="text"
                  autoFocus
                  value={newResumeTitle}
                  onChange={(e) => setNewResumeTitle(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="Enter resume title..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameModalResume(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newResumeTitle.trim()}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden print container for direct PDF export from Dashboard */}
      {isExporting && previewResume && (
        <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
          <div id="dashboard-print-area">
            <ResumePreview
              resumeData={previewResume.data}
              customization={previewResume.customization}
              zoom={1}
            />
          </div>
        </div>
      )}

      {/* Pro Plan Modal */}
      {proModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-200 text-center">
            <button
              onClick={() => setProModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mx-auto mb-4 flex justify-center">
              <CVnestLogo size="lg" theme="light" showText={false} badgeStyle="luminous" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              CV<span className="text-teal-600">nest</span> Pro
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Unlimited resumes, cover letters, custom color palettes, and priority ATS machine parsing.
            </p>
            <button
              onClick={() => {
                alert("You're currently using the full free edition with all features enabled!");
                setProModalOpen(false);
              }}
              className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-md"
            >
              Continue Free
            </button>
          </div>
        </div>
      )}

      {/* Template Selection Modal for Creating New Resume with Real Previews */}
      <TemplateModal
        isOpen={isCreateTemplateModalOpen}
        onClose={() => setIsCreateTemplateModalOpen(false)}
        onSelectTemplate={handleTemplateChosenForNewResume}
        mode="create"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default MyResumesDashboard;
