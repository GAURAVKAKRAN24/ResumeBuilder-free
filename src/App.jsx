import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LandingScreen } from './components/LandingScreen';
import { MyResumesDashboard } from './components/MyResumesDashboard';
import { Navbar } from './components/Navbar';
import { ContentTab } from './components/ContentTab';
import { CustomizationTab } from './components/CustomizationTab';
import { ResumePreview } from './components/ResumePreview';
import { TemplateModal } from './components/TemplateModal';
import { AtsScoreModal } from './components/AtsScoreModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';

import { useAuth } from './context/AuthContext';
import { useResume } from './context/ResumeContext';
import { initialResumeData, blankResumeData } from './data/defaultResume';
import { initialCustomization } from './data/customizationDefaults';
import { calculateAtsScore, generatePlainTextResume } from './utils/atsChecker';
import { 
  FileEdit, 
  Palette, 
  Sparkles
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const { 
    activeResume, 
    activeResumeId, 
    resumes, 
    setActiveResumeId, 
    createResume, 
    updateActiveData, 
    updateActiveCustomization, 
    updateActiveTitle,
    cleanupBlankDrafts,
    isResumeBlank,
    saveStatus 
  } = useResume();

  // Sidebar Tab in Editor: 'content' | 'customization' (Overview Tab REMOVED)
  const [activeTab, setActiveTab] = useState('content');

  // Mobile View Toggle: 'editor' | 'preview'
  const [mobileView, setMobileView] = useState('editor');

  // Zoom scale for preview (Default 110%)
  const [zoom, setZoom] = useState(1.1);

  // Modals & Toast
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isLandingTemplateModalOpen, setIsLandingTemplateModalOpen] = useState(false);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // If user logs in while at landing '/', route to '/resume'
  // If user logs out while at '/resume', route to '/'
  useEffect(() => {
    if (isLoggedIn && location.pathname === '/') {
      navigate('/resume', { replace: true });
    } else if (!isLoggedIn && location.pathname === '/resume') {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  // If user logs in while in editor, show friendly confirmation toast
  const wasLoggedInRef = React.useRef(isLoggedIn);
  useEffect(() => {
    if (!wasLoggedInRef.current && isLoggedIn && location.pathname === '/editor') {
      showToast("✨ Signed in! Your resume is saved to your account & ready to download.");
    }
    wasLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn, location.pathname]);

  // Whenever user navigates away from editor without editing, clean up blank drafts
  useEffect(() => {
    if (location.pathname !== '/editor') {
      if (cleanupBlankDrafts) cleanupBlankDrafts();
    }
  }, [location.pathname]);

  // Current Resume Data & Customization from active resume
  const resumeData = activeResume?.data || blankResumeData;
  const customization = activeResume?.customization || initialCustomization;
  const resumeTitle = activeResume?.title || "My_Resume";

  // ATS Analysis calculation
  const atsAnalysis = calculateAtsScore(resumeData);

  // Handlers for Landing screen
  const handleStartNew = () => {
    setIsLandingTemplateModalOpen(true);
  };

  const handleLandingTemplateChosen = (template) => {
    setIsLandingTemplateModalOpen(false);
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
    showToast(`✨ Started fresh with "${template.name}" template!`);
  };

  const handleUploadResume = (extractedData) => {
    const newTitle = extractedData.personalDetails?.fullName?.replace(/\s+/g, '_') + "_Resume" || "Imported_Resume";
    const newCustomization = extractedData.customization || initialCustomization;
    
    const cleanData = {
      ...extractedData,
      sectionsOrder: Array.isArray(extractedData.sectionsOrder) && extractedData.sectionsOrder.length > 0
        ? extractedData.sectionsOrder
        : ["summary", "experience", "education", "skills", "projects", "certifications", "languages"],
      sectionsVisibility: extractedData.sectionsVisibility || {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
      }
    };

    const newId = createResume({
      title: newTitle,
      data: cleanData,
      customization: newCustomization
    });
    setActiveResumeId(newId);
    navigate('/editor');
    showToast("✅ Resume imported! Review and adjust your content.");
  };

  const handleLoadSample = () => {
    const newId = createResume({
      title: "Alex_Morgan_Resume",
      data: initialResumeData,
      customization: initialCustomization
    });
    setActiveResumeId(newId);
    navigate('/editor');
    showToast("🎯 Loaded sample resume with 50+ ATS templates available!");
  };

  // Template Selection Handler
  const handleSelectTemplate = (template) => {
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

    const currentIsBlank = isResumeBlank && isResumeBlank({ data: resumeData });
    const targetData = currentIsBlank ? JSON.parse(JSON.stringify(initialResumeData)) : undefined;

    updateActiveResume(targetData, templateCustomization, `Applied ${template.name} Template`);

    setIsTemplateModalOpen(false);
    navigate('/editor');
    showToast(`🎨 Template applied: "${template.name}"`);
  };

  // PDF Export (Requires Login!)
  const handleDownloadPdf = async () => {
    if (!isLoggedIn) {
      showToast("🔒 Please sign in with Google to download your ATS resume!");
      setIsAuthModalOpen(true);
      return;
    }

    const element = document.getElementById('resume-print-area');
    if (!element) {
      window.print();
      return;
    }

    showToast("📄 Generating high-resolution PDF...");

    const parent = element.parentElement;
    const prevParentTransform = parent ? parent.style.transform : '';
    const prevParentTransition = parent ? parent.style.transition : '';
    if (parent) {
      parent.style.transform = 'none';
      parent.style.transition = 'none';
    }

    const originalShadow = element.style.boxShadow;
    const originalBorder = element.style.border;
    const originalMinHeight = element.style.minHeight;
    const originalMaxHeight = element.style.maxHeight;

    element.classList.add('exporting-pdf');
    element.style.boxShadow = 'none';
    element.style.border = 'none';
    element.style.minHeight = '0px';

    const isSinglePage = element.scrollHeight <= 1130;
    if (isSinglePage) {
      element.style.maxHeight = '296.5mm';
    }

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${resumeTitle || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0,
        scrollX: 0,
        windowWidth: 794
      },
      jsPDF: { 
        unit: 'mm', 
        format: customization?.document?.pageFormat === 'US Letter' ? 'letter' : 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: ['.avoid-break']
      }
    };

    try {
      await html2pdf()
        .from(element)
        .set(opt)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          const totalPages = pdf.internal.getNumberOfPages();
          if (isSinglePage && totalPages > 1) {
            pdf.deletePage(totalPages);
          }
        })
        .save();

      showToast("🎉 Resume downloaded successfully!");
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      if (parent) {
        parent.style.transform = prevParentTransform;
        parent.style.transition = prevParentTransition;
      }
      element.classList.remove('exporting-pdf');
      element.style.boxShadow = originalShadow;
      element.style.border = originalBorder;
      element.style.minHeight = originalMinHeight;
      element.style.maxHeight = originalMaxHeight;
    }
  };

  const handlePrintResume = () => {
    if (!isLoggedIn) {
      showToast("🔒 Please sign in with Google to print your resume!");
      setIsAuthModalOpen(true);
      return;
    }

    if (mobileView === 'editor') {
      setMobileView('preview');
    }
    const prevTitle = document.title;
    document.title = resumeTitle ? `${resumeTitle}` : 'Resume';
    setTimeout(() => {
      window.print();
      document.title = prevTitle;
    }, 150);
  };

  const handleCopyPlainText = () => {
    if (!isLoggedIn) {
      showToast("🔒 Please sign in with Google to copy ATS plain text!");
      setIsAuthModalOpen(true);
      return;
    }

    const text = generatePlainTextResume(resumeData);
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 Formatted ATS text copied to clipboard!");
    });
  };

  const handleExportJson = () => {
    if (!isLoggedIn) {
      showToast("🔒 Please sign in with Google to export JSON backup!");
      setIsAuthModalOpen(true);
      return;
    }

    const payload = {
      resumeData,
      customization,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${resumeTitle || 'resume'}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("💾 Resume data saved to JSON file!");
  };

  const handleBackToDashboard = () => {
    if (cleanupBlankDrafts) cleanupBlankDrafts();
    if (isLoggedIn) {
      navigate('/resume');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Routes */}
      <Routes>
        {/* Landing Page (For guests or initial visit) */}
        <Route 
          path="/" 
          element={
            isLoggedIn ? (
              <Navigate to="/resume" replace />
            ) : (
              <LandingScreen
                onStartNew={handleStartNew}
                onUploadResume={handleUploadResume}
                onLoadSample={handleLoadSample}
                onGoToDashboard={() => navigate('/resume')}
              />
            )
          } 
        />

        {/* /resume Dashboard: CVnest Dashboard, shows created resumes + create new resume */}
        <Route 
          path="/resume" 
          element={
            isLoggedIn ? (
              <MyResumesDashboard 
                onOpenEditor={() => navigate('/editor')} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* /editor: Live Resume Editor with Left Sidebar & Live Preview */}
        <Route 
          path="/editor" 
          element={
            <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
              {/* Navbar with auto-save indicator, rename title, and locked download for unauthenticated */}
              <Navbar
                resumeTitle={resumeTitle}
                setResumeTitle={updateActiveTitle}
                atsScore={atsAnalysis.score}
                onOpenTemplates={() => setIsTemplateModalOpen(true)}
                onOpenAtsModal={() => setIsAtsModalOpen(true)}
                onBackToHome={handleBackToDashboard}
                mobileView={mobileView}
                setMobileView={setMobileView}
                zoom={zoom}
                setZoom={setZoom}
                onDownloadPdf={handleDownloadPdf}
                onPrintResume={handlePrintResume}
                onCopyPlainText={handleCopyPlainText}
                onExportJson={handleExportJson}
                saveStatus={saveStatus}
              />

              {/* Main Workspace */}
              <main className="flex-1 flex overflow-hidden max-w-[1720px] w-full mx-auto">
                {/* LEFT MULTI-PURPOSE SIDEBAR (OVERVIEW TAB REMOVED - ONLY CONTENT & CUSTOMIZATION) */}
                <aside 
                  className={`app-sidebar w-full lg:w-[480px] xl:w-[520px] shrink-0 bg-white border-r border-slate-200/80 flex flex-col h-[calc(100vh-64px)] z-20 ${
                    mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
                  }`}
                >
                  {/* Top Tabs: 1.) Content, 2.) Customization */}
                  <div className="p-3 border-b border-slate-200/80 bg-slate-50/50">
                    <div className="grid grid-cols-2 gap-1 bg-slate-200/70 p-1 rounded-2xl">
                      {/* Tab 1: Content */}
                      <button
                        onClick={() => setActiveTab('content')}
                        className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                          activeTab === 'content'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <FileEdit className="w-4 h-4" />
                        <span>Content</span>
                      </button>

                      {/* Tab 2: Customization */}
                      <button
                        onClick={() => setActiveTab('customization')}
                        className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                          activeTab === 'customization'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        <span>Customization</span>
                      </button>
                    </div>
                  </div>

                  {/* Sidebar Tab Body */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                    {activeTab === 'content' && (
                      <ContentTab
                        resumeData={resumeData}
                        setResumeData={updateActiveData}
                      />
                    )}

                    {activeTab === 'customization' && (
                      <CustomizationTab
                        customization={customization}
                        setCustomization={updateActiveCustomization}
                        onOpenTemplates={() => setIsTemplateModalOpen(true)}
                      />
                    )}
                  </div>
                </aside>

                {/* RIGHT LIVE RESUME PREVIEW */}
                <section 
                  className={`flex-1 bg-slate-200/50 h-[calc(100vh-64px)] overflow-auto relative ${
                    mobileView === 'editor' ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
                    <button
                      onClick={() => setMobileView('editor')}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700"
                    >
                      <FileEdit className="w-4 h-4" />
                      <span>Back to Editor</span>
                    </button>
                  </div>

                  <ResumePreview
                    resumeData={resumeData}
                    customization={customization}
                    zoom={zoom}
                  />
                </section>
              </main>
            </div>
          } 
        />

        {/* Fallback wildcard */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/resume" : "/"} replace />} />
      </Routes>

      {/* Landing Screen Template Picker with Real Previews */}
      <TemplateModal
        isOpen={isLandingTemplateModalOpen}
        onClose={() => setIsLandingTemplateModalOpen(false)}
        onSelectTemplate={handleLandingTemplateChosen}
        mode="create"
      />

      {/* Global In-Editor Template Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        activeTemplateId={customization.templateId}
        onSelectTemplate={handleSelectTemplate}
        resumeData={resumeData}
        mode="switch"
      />

      <AtsScoreModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        atsAnalysis={atsAnalysis}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
