import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  AlignLeft,
  GripVertical
} from 'lucide-react';

function DescriptionTextEditor({ value, onChange, placeholder, verbs = [] }) {
  const textareaRef = useRef(null);

  const applyFormat = (type) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value || "";
    const selected = text.substring(start, end);

    let newText = text;
    let newCursorPos = end;

    if (type === 'bold') {
      if (selected) {
        newText = text.substring(0, start) + `**${selected}**` + text.substring(end);
        newCursorPos = end + 4;
      } else {
        newText = text.substring(0, start) + `**bold text**` + text.substring(end);
        newCursorPos = start + 13;
      }
    } else if (type === 'italic') {
      if (selected) {
        newText = text.substring(0, start) + `*${selected}*` + text.substring(end);
        newCursorPos = end + 2;
      } else {
        newText = text.substring(0, start) + `*italic text*` + text.substring(end);
        newCursorPos = start + 13;
      }
    } else if (type === 'bullet') {
      const targetText = selected || text;
      const lines = targetText.split('\n');
      const allBulleted = lines.every(l => !l.trim() || l.trim().startsWith('•') || l.trim().startsWith('-'));

      const transformed = lines.map(l => {
        const trimmed = l.trim();
        if (!trimmed) return l;
        return allBulleted ? trimmed.replace(/^[•\-*▪▫–\s]+/, '') : `• ${trimmed.replace(/^[•\-*▪▫–\s]+/, '')}`;
      }).join('\n');

      if (selected) {
        newText = text.substring(0, start) + transformed + text.substring(end);
        newCursorPos = start + transformed.length;
      } else {
        newText = transformed;
        newCursorPos = newText.length;
      }
    } else if (type === 'numbered') {
      const targetText = selected || text;
      const lines = targetText.split('\n');
      let count = 1;
      const transformed = lines.map(l => {
        const trimmed = l.replace(/^(?:\d+\.|\•|\-|\*)\s*/, '').trim();
        return trimmed ? `${count++}. ${trimmed}` : l;
      }).join('\n');

      if (selected) {
        newText = text.substring(0, start) + transformed + text.substring(end);
        newCursorPos = start + transformed.length;
      } else {
        newText = transformed;
        newCursorPos = newText.length;
      }
    } else if (type === 'paragraph') {
      newText = (text || "")
        .split('\n')
        .map(l => l.replace(/^(?:[•\-*▪▫–]|\d+\.)\s*/, '').trim())
        .filter(Boolean)
        .join('\n\n');
      newCursorPos = newText.length;
    }

    onChange(newText);
    setTimeout(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const insertVerb = (verb) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const text = el.value || "";
    const prefix = (!text || text.endsWith('\n') || text.trim() === '') ? '• ' : '\n• ';
    const snippet = `${prefix}${verb} `;
    const newText = text.substring(0, start) + snippet + text.substring(start);
    onChange(newText);

    setTimeout(() => {
      if (el) {
        el.focus();
        const nextPos = start + snippet.length;
        el.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const el = e.target;
      const cursor = el.selectionStart;
      const text = el.value || "";
      const lineStart = text.lastIndexOf('\n', cursor - 1) + 1;
      const currentLine = text.substring(lineStart, cursor);

      if (/^[•\-*]\s*/.test(currentLine)) {
        e.preventDefault();
        const contentAfterBullet = currentLine.replace(/^[•\-*]\s*/, '').trim();
        if (contentAfterBullet.length === 0) {
          const newText = text.substring(0, lineStart) + text.substring(cursor);
          onChange(newText);
          setTimeout(() => el.setSelectionRange(lineStart, lineStart), 0);
        } else {
          const newText = text.substring(0, cursor) + '\n• ' + text.substring(cursor);
          onChange(newText);
          setTimeout(() => el.setSelectionRange(cursor + 3, cursor + 3), 0);
        }
      } else if (/^\d+\.\s*/.test(currentLine)) {
        e.preventDefault();
        const match = currentLine.match(/^(\d+)\.\s*/);
        const nextNum = parseInt(match[1], 10) + 1;
        const newText = text.substring(0, cursor) + `\n${nextNum}. ` + text.substring(cursor);
        onChange(newText);
        setTimeout(() => el.setSelectionRange(cursor + `${nextNum}. `.length, cursor + `${nextNum}. `.length), 0);
      }
    }
  };

  const isBulletMode = (value || "").trim().startsWith('•') || (value || "").includes('\n•');

  return (
    <div className="border border-slate-300 rounded-2xl bg-white shadow-2xs overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all font-sans">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            className="p-2 hover:bg-white text-slate-700 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Bold (**text**)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            className="p-2 hover:bg-white text-slate-700 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Italic (*text*)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => applyFormat('bullet')}
            className={`p-2 rounded-lg transition-colors border ${
              isBulletMode 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold' 
                : 'hover:bg-white text-slate-700 border-transparent hover:border-slate-200'
            }`}
            title="Bullet List (• items)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('numbered')}
            className="p-2 hover:bg-white text-slate-700 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Numbered List (1. items)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('paragraph')}
            className={`p-2 rounded-lg transition-colors border ${
              !isBulletMode && (value || "").trim().length > 0
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold' 
                : 'hover:bg-white text-slate-700 border-transparent hover:border-slate-200'
            }`}
            title="Paragraph / Freeform text"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-500 font-medium">
            {isBulletMode ? '• Bullet Points' : '¶ Paragraph'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-mono font-medium">
            {(value || "").length} chars
          </span>
        </div>
      </div>

      {/* Action Verbs Quick Bar */}
      {verbs && verbs.length > 0 && (
        <div className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100/70 border-b border-slate-200 overflow-x-auto text-xs">
          <span className="text-slate-600 font-bold uppercase tracking-wider shrink-0 mr-1 text-xs">
            Action Verbs:
          </span>
          {verbs.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => insertVerb(v)}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg border border-slate-300 hover:border-indigo-300 font-bold transition-all shrink-0 text-xs"
            >
              +{v}
            </button>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        rows={5}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Write role overview, accomplishments or bullet points..."}
        className="w-full text-base text-slate-800 p-4 bg-white focus:outline-none leading-relaxed font-sans resize-y min-h-[130px]"
      />
    </div>
  );
}

export function ContentTab({ resumeData, setResumeData }) {
  // Main accordion state - only ONE section open at a time
  const [openSectionKey, setOpenSectionKey] = useState('personal');

  // Track expanded state for individual experience tabs
  const [expandedExps, setExpandedExps] = useState(() => {
    const initial = {};
    if (resumeData.experience && resumeData.experience.length > 0) {
      initial[resumeData.experience[0].id] = true;
    }
    return initial;
  });

  // Track expanded state for individual education and project tabs
  const [expandedEdus, setExpandedEdus] = useState({});
  const [expandedProjs, setExpandedProjs] = useState({});
  const [expandedCustomItems, setExpandedCustomItems] = useState({});

  // Section Drag and drop state
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState(null);

  // Individual item drag and swap states
  const [draggedExpIdx, setDraggedExpIdx] = useState(null);
  const [dragOverExpIdx, setDragOverExpIdx] = useState(null);

  const [draggedEduIdx, setDraggedEduIdx] = useState(null);
  const [dragOverEduIdx, setDragOverEduIdx] = useState(null);

  const [draggedProjIdx, setDraggedProjIdx] = useState(null);
  const [dragOverProjIdx, setDragOverProjIdx] = useState(null);

  // Single-open accordion toggle: opening a section closes all others
  const toggleSection = (key) => {
    setOpenSectionKey(prev => prev === key ? null : key);
  };

  const toggleExpExpand = (id) => {
    setExpandedExps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleEduExpand = (id) => {
    setExpandedEdus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleProjExpand = (id) => {
    setExpandedProjs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCustomItemExpand = (id) => {
    setExpandedCustomItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Safe sections order array
  const safeSectionsOrder = Array.isArray(resumeData.sectionsOrder) && resumeData.sectionsOrder.length > 0
    ? resumeData.sectionsOrder
    : ["summary", "experience", "education", "skills", "projects", "certifications", "languages"];

  // Default section definitions
  const DEFAULT_SECTIONS_INFO = {
    summary: { title: "PROFESSIONAL SUMMARY" },
    experience: { title: "WORK EXPERIENCE" },
    education: { title: "EDUCATION" },
    skills: { title: "TECHNICAL & CORE SKILLS" },
    projects: { title: "KEY PROJECTS" },
    certifications: { title: "LICENSES & CERTIFICATIONS" },
    languages: { title: "LANGUAGES" },
  };

  // Section drag and drop reordering
  const handleSectionDragStart = (e, index) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `sec-${index}`);
  };

  const handleSectionDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSectionIndex !== index) {
      setDragOverSectionIndex(index);
    }
  };

  const handleSectionDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === targetIndex) {
      setDraggedSectionIndex(null);
      setDragOverSectionIndex(null);
      return;
    }

    const newOrder = [...safeSectionsOrder];
    const [removed] = newOrder.splice(draggedSectionIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    setResumeData(prev => ({
      ...prev,
      sectionsOrder: newOrder
    }));

    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
  };

  // 1-Click Move Section Up / Down
  const moveSection = (index, direction, e) => {
    e.stopPropagation();
    const newOrder = [...safeSectionsOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setResumeData(prev => ({
      ...prev,
      sectionsOrder: newOrder
    }));
  };

  // Complete Section Delete Handler
  const handleDeleteSection = (sectionKey) => {
    const newOrder = safeSectionsOrder.filter(k => k !== sectionKey);
    const newVisibility = { ...(resumeData.sectionsVisibility || {}), [sectionKey]: false };

    let newCustomSections = resumeData.customSections || [];
    if (sectionKey.startsWith('custom-')) {
      newCustomSections = newCustomSections.filter(c => c.id !== sectionKey);
    }

    setResumeData(prev => ({
      ...prev,
      sectionsOrder: newOrder,
      sectionsVisibility: newVisibility,
      customSections: newCustomSections
    }));

    if (openSectionKey === sectionKey) {
      setOpenSectionKey(null);
    }
  };

  // Restore deleted default section
  const handleRestoreSection = (sectionKey) => {
    const newOrder = [...safeSectionsOrder, sectionKey];
    const newVisibility = { ...(resumeData.sectionsVisibility || {}), [sectionKey]: true };
    setResumeData(prev => ({
      ...prev,
      sectionsOrder: newOrder,
      sectionsVisibility: newVisibility
    }));
    setOpenSectionKey(sectionKey);
  };

  // Add Custom Content Large Button Handler
  const handleAddCustomContent = () => {
    const newCustomId = `custom-${Date.now()}`;
    const newCustomSection = {
      id: newCustomId,
      title: "ADDITIONAL ACHIEVEMENTS",
      items: [
        {
          id: `item-${Date.now()}`,
          title: "Title / Role",
          subtitle: "Organization / Context",
          date: "2024",
          description: "• Spearheaded key initiative resulting in quantifiable improvement."
        }
      ]
    };

    setResumeData(prev => ({
      ...prev,
      sectionsOrder: [...safeSectionsOrder, newCustomId],
      sectionsVisibility: {
        ...(prev.sectionsVisibility || {}),
        [newCustomId]: true
      },
      customSections: [...(prev.customSections || []), newCustomSection]
    }));

    setOpenSectionKey(newCustomId);
  };

  // Personal Details handlers
  const handlePersonalChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [field]: value }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalChange('photoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // ==============================================================
  // EXPERIENCE DRAG & SWAP + EXPANDABLE TABS HANDLERS
  // ==============================================================
  const handleExpDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedExpIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `exp-${index}`);
  };

  const handleExpDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverExpIdx !== index) {
      setDragOverExpIdx(index);
    }
  };

  const handleExpDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedExpIdx === null || draggedExpIdx === targetIndex) {
      setDraggedExpIdx(null);
      setDragOverExpIdx(null);
      return;
    }

    const exps = [...(resumeData.experience || [])];
    const [removed] = exps.splice(draggedExpIdx, 1);
    exps.splice(targetIndex, 0, removed);

    setResumeData(prev => ({ ...prev, experience: exps }));
    setDraggedExpIdx(null);
    setDragOverExpIdx(null);
  };

  const handleExpDragEnd = (e) => {
    e.stopPropagation();
    setDraggedExpIdx(null);
    setDragOverExpIdx(null);
  };

  const moveExperience = (index, direction, e) => {
    e.stopPropagation();
    const exps = [...(resumeData.experience || [])];
    const target = index + direction;
    if (target < 0 || target >= exps.length) return;

    const temp = exps[index];
    exps[index] = exps[target];
    exps[target] = temp;

    setResumeData(prev => ({ ...prev, experience: exps }));
  };

  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newExp = {
      id: newId,
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "• Spearheaded key initiative resulting in quantifiable improvement.\n• Collaborated with cross-functional teams to deliver milestones on schedule."
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExp]
    }));
    // Auto expand the newly added experience tab
    setExpandedExps(prev => ({ ...prev, [newId]: true }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExperience = (id, e) => {
    if (e) e.stopPropagation();
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  // ==============================================================
  // EDUCATION DRAG & SWAP + EXPANDABLE TABS HANDLERS
  // ==============================================================
  const handleEduDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedEduIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleEduDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverEduIdx !== index) setDragOverEduIdx(index);
  };

  const handleEduDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedEduIdx === null || draggedEduIdx === targetIndex) {
      setDraggedEduIdx(null);
      setDragOverEduIdx(null);
      return;
    }

    const edus = [...(resumeData.education || [])];
    const [removed] = edus.splice(draggedEduIdx, 1);
    edus.splice(targetIndex, 0, removed);

    setResumeData(prev => ({ ...prev, education: edus }));
    setDraggedEduIdx(null);
    setDragOverEduIdx(null);
  };

  const moveEducation = (index, direction, e) => {
    e.stopPropagation();
    const edus = [...(resumeData.education || [])];
    const target = index + direction;
    if (target < 0 || target >= edus.length) return;

    const temp = edus[index];
    edus[index] = edus[target];
    edus[target] = temp;

    setResumeData(prev => ({ ...prev, education: edus }));
  };

  const addEducation = () => {
    const newId = `edu-${Date.now()}`;
    const newEdu = {
      id: newId,
      institution: "",
      degree: "",
      location: "",
      startDate: "",
      endDate: "",
      grade: ""
    };
    setResumeData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
    setExpandedEdus(prev => ({ ...prev, [newId]: true }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id, e) => {
    if (e) e.stopPropagation();
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  // ==============================================================
  // PROJECTS DRAG & SWAP + EXPANDABLE TABS HANDLERS
  // ==============================================================
  const handleProjDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedProjIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleProjDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverProjIdx !== index) setDragOverProjIdx(index);
  };

  const handleProjDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedProjIdx === null || draggedProjIdx === targetIndex) {
      setDraggedProjIdx(null);
      setDragOverProjIdx(null);
      return;
    }

    const projs = [...(resumeData.projects || [])];
    const [removed] = projs.splice(draggedProjIdx, 1);
    projs.splice(targetIndex, 0, removed);

    setResumeData(prev => ({ ...prev, projects: projs }));
    setDraggedProjIdx(null);
    setDragOverProjIdx(null);
  };

  const moveProject = (index, direction, e) => {
    e.stopPropagation();
    const projs = [...(resumeData.projects || [])];
    const target = index + direction;
    if (target < 0 || target >= projs.length) return;

    const temp = projs[index];
    projs[index] = projs[target];
    projs[target] = temp;

    setResumeData(prev => ({ ...prev, projects: projs }));
  };

  const addProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProj = {
      id: newId,
      title: "",
      tech: "",
      link: "",
      github: "",
      date: "",
      description: "• Engineered key features and deployed to production.\n• Optimized responsiveness and performance."
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProj]
    }));
    setExpandedProjs(prev => ({ ...prev, [newId]: true }));
  };

  const updateProject = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removeProject = (id, e) => {
    if (e) e.stopPropagation();
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Skills handlers
  const addSkillCategory = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), { category: "Specialization", items: "Skill 1, Skill 2, Skill 3" }]
    }));
  };

  const updateSkill = (index, field, value) => {
    setResumeData(prev => {
      const nextSkills = [...(prev.skills || [])];
      nextSkills[index] = { ...nextSkills[index], [field]: value };
      return { ...prev, skills: nextSkills };
    });
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }));
  };

  // Certifications handlers
  const addCertification = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      credentialUrl: ""
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCert]
    }));
  };

  const updateCert = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const removeCert = (id) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  // Languages handlers
  const addLanguage = () => {
    const newLang = {
      id: `lang-${Date.now()}`,
      language: "",
      proficiency: "Fluent"
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), newLang]
    }));
  };

  const updateLanguage = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  const removeLanguage = (id) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
  };

  // Custom sections item handlers
  const updateCustomSectionTitle = (customId, newTitle) => {
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(c => c.id === customId ? { ...c, title: newTitle } : c)
    }));
  };

  const addCustomItem = (customId) => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: "",
      subtitle: "",
      date: "",
      description: "• "
    };
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(c => 
        c.id === customId ? { ...c, items: [...(c.items || []), newItem] } : c
      )
    }));
    setExpandedCustomItems(prev => ({ ...prev, [newItem.id]: true }));
  };

  const updateCustomItem = (customId, itemId, field, value) => {
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(c => {
        if (c.id !== customId) return c;
        return {
          ...c,
          items: (c.items || []).map(it => it.id === itemId ? { ...it, [field]: value } : it)
        };
      })
    }));
  };

  const removeCustomItem = (customId, itemId, e) => {
    if (e) e.stopPropagation();
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(c => {
        if (c.id !== customId) return c;
        return {
          ...c,
          items: (c.items || []).filter(it => it.id !== itemId)
        };
      })
    }));
  };

  // Find which default sections were deleted so user can restore them
  const defaultKeys = Object.keys(DEFAULT_SECTIONS_INFO);
  const deletedDefaultSections = defaultKeys
    .filter(k => !safeSectionsOrder.includes(k))
    .map(k => ({ key: k, label: DEFAULT_SECTIONS_INFO[k].title }));

  // ==============================================================
  // SECTION BODY RENDERER
  // ==============================================================
  const renderSectionBody = (key) => {
    if (key === 'summary') {
      return (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-3.5">
          <div className="flex justify-between items-center text-sm text-slate-600 font-medium">
            <span>Highlight core experience, technical stacks & major achievements</span>
            <span className="font-mono text-xs">{(resumeData.summary || "").length} chars</span>
          </div>
          <textarea
            rows={5}
            value={resumeData.summary || ""}
            onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="e.g. Results-driven Software Engineer with 6+ years of experience building high-scale distributed systems..."
            className="w-full text-base border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none leading-relaxed font-sans"
          />
        </div>
      );
    }

    // ==============================================================
    // EXPERIENCE: DRAGGABLE TABS LIST WITH INLINE EXPANSION
    // (Matches exact design from the uploaded screenshot!)
    // ==============================================================
    if (key === 'experience') {
      const exps = resumeData.experience || [];

      return (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-3">
          {/* Empty state */}
          {exps.length === 0 && (
            <div className="py-6 text-center text-slate-500 text-sm">
              No work experience entries yet. Click "Add Entry" below.
            </div>
          )}

          {/* Draggable Experience Items as Tabs */}
          <div className="space-y-2.5">
            {exps.map((exp, idx) => {
              const isExpanded = !!expandedExps[exp.id];
              const isDragging = draggedExpIdx === idx;
              const isDragOver = dragOverExpIdx === idx;

              return (
                <div 
                  key={exp.id}
                  draggable={true}
                  onDragStart={(e) => handleExpDragStart(e, idx)}
                  onDragOver={(e) => handleExpDragOver(e, idx)}
                  onDrop={(e) => handleExpDrop(e, idx)}
                  onDragEnd={handleExpDragEnd}
                  className={`border rounded-2xl bg-white transition-all overflow-hidden shadow-2xs ${
                    isDragging ? 'opacity-40 border-indigo-400 scale-[0.98]' : 'opacity-100'
                  } ${
                    isDragOver ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200'
                  }`}
                >
                  {/* TAB ROW HEADER (EXACTLY LIKE USER'S SCREENSHOT) */}
                  <div
                    onClick={() => toggleExpExpand(exp.id)}
                    className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Grip Drag Handle */}
                      <div 
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing rounded shrink-0"
                        title="Drag to swap experience order"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Title: Bold Company, Regular Role */}
                      <div className="text-base truncate flex-1 min-w-0">
                        <span className="font-bold text-slate-900">
                          {exp.company || "Company Name"}
                        </span>
                        {exp.position && (
                          <span className="text-slate-600 ml-1 font-medium">
                            , {exp.position}
                          </span>
                        )}
                        {!exp.company && !exp.position && (
                          <span className="text-slate-400 italic">
                            (New Experience Entry)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons on the right: Move Up/Down + Delete + Chevron */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Delete icon button */}
                      <button
                        type="button"
                        onClick={(e) => removeExperience(exp.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete this role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Expand / Collapse Chevron */}
                      <button
                        type="button"
                        onClick={() => toggleExpExpand(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700"
                        title={isExpanded ? "Collapse" : "Open Details"}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED EXPERIENCE DETAIL FORM */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Company *</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="e.g. HCLTech / Stripe"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Job Title *</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="e.g. 03/2022"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">End Date</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              disabled={exp.current}
                              value={exp.current ? "Present" : exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              placeholder="e.g. 09/2024"
                              className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium disabled:bg-slate-100 disabled:text-slate-400"
                            />
                            <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 cursor-pointer select-none whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                              />
                              <span>Current</span>
                            </label>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            placeholder="e.g. Gurgaon, India / San Francisco, CA / Remote"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                      </div>

                      {/* Job Description & Achievements Rich Text Editor */}
                      <div>
                        <label className="text-sm font-bold text-slate-800 block mb-1.5 uppercase tracking-wide">
                          Description & Key Accomplishments
                        </label>
                        <DescriptionTextEditor
                          value={exp.description}
                          onChange={(val) => updateExperience(exp.id, 'description', val)}
                          placeholder="Write role overview, quantifiable impact, or structured achievements (e.g. • Led development of...)"
                          verbs={["Architected", "Spearheaded", "Engineered", "Scaled", "Optimized", "Delivered", "Designed"]}
                        />
                      </div>

                      {/* Done / Collapse button */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => toggleExpExpand(exp.id)}
                          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-300 shadow-2xs transition-colors"
                        >
                          Done Editing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* "+ Add Entry" Centered Button (matches screenshot!) */}
          <div className="flex items-center justify-center pt-3">
            <button
              type="button"
              onClick={addExperience}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 rounded-2xl text-base font-bold text-slate-800 hover:text-indigo-600 flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      );
    }

    // ==============================================================
    // EDUCATION: DRAGGABLE TABS LIST WITH INLINE EXPANSION
    // ==============================================================
    if (key === 'education') {
      const edus = resumeData.education || [];

      return (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-3">
          {edus.length === 0 && (
            <div className="py-6 text-center text-slate-500 text-sm">
              No education entries yet. Click "Add Entry" below.
            </div>
          )}

          <div className="space-y-2.5">
            {edus.map((edu, idx) => {
              const isExpanded = !!expandedEdus[edu.id];
              const isDragging = draggedEduIdx === idx;
              const isDragOver = dragOverEduIdx === idx;

              return (
                <div 
                  key={edu.id}
                  draggable={true}
                  onDragStart={(e) => handleEduDragStart(e, idx)}
                  onDragOver={(e) => handleEduDragOver(e, idx)}
                  onDrop={(e) => handleEduDrop(e, idx)}
                  onDragEnd={() => { setDraggedEduIdx(null); setDragOverEduIdx(null); }}
                  className={`border rounded-2xl bg-white transition-all overflow-hidden shadow-2xs ${
                    isDragging ? 'opacity-40 border-indigo-400 scale-[0.98]' : 'opacity-100'
                  } ${
                    isDragOver ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200'
                  }`}
                >
                  {/* TAB ROW HEADER */}
                  <div
                    onClick={() => toggleEduExpand(edu.id)}
                    className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing rounded shrink-0"
                        title="Drag to swap order"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div className="text-base truncate flex-1 min-w-0">
                        <span className="font-bold text-slate-900">
                          {edu.degree || edu.institution || "Degree / Major"}
                        </span>
                        {edu.institution && edu.degree && (
                          <span className="text-slate-600 ml-1 font-medium">
                            , {edu.institution}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => removeEducation(edu.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Degree"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleEduExpand(edu.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED DETAIL FORM */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Institution *</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="e.g. UC Berkeley"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Degree / Major *</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="e.g. B.S. in Computer Science"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Start Date</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            placeholder="e.g. 08/2016"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Graduation Date</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            placeholder="e.g. 05/2020"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Location</label>
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            placeholder="e.g. Berkeley, CA"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">GPA / Honors</label>
                          <input
                            type="text"
                            value={edu.grade}
                            onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                            placeholder="e.g. GPA: 3.86 / 4.0"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => toggleEduExpand(edu.id)}
                          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-300 shadow-2xs transition-colors"
                        >
                          Done Editing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center pt-3">
            <button
              type="button"
              onClick={addEducation}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 rounded-2xl text-base font-bold text-slate-800 hover:text-indigo-600 flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      );
    }

    // ==============================================================
    // TECHNICAL SKILLS
    // ==============================================================
    if (key === 'skills') {
      return (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            Categorize your skills (e.g. Languages, Frameworks, Cloud). Separate keywords by commas.
          </p>

          {(resumeData.skills || []).map((skill, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) => updateSkill(idx, 'category', e.target.value)}
                  placeholder="Category Name"
                  className="text-base font-bold text-slate-900 bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-indigo-600 pb-1 w-64 uppercase"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 px-2.5 py-1 rounded-lg border border-rose-200 uppercase transition-colors"
                  title="Delete Category"
                >
                  REMOVE
                </button>
              </div>
              <input
                type="text"
                value={skill.items}
                onChange={(e) => updateSkill(idx, 'items', e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, GraphQL, Docker"
                className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
          ))}

          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={addSkillCategory}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 rounded-2xl text-base font-bold text-slate-800 hover:text-indigo-600 flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add Skill Category</span>
            </button>
          </div>
        </div>
      );
    }

    // ==============================================================
    // PROJECTS: DRAGGABLE TABS LIST WITH INLINE EXPANSION
    // ==============================================================
    if (key === 'projects') {
      const projs = resumeData.projects || [];

      return (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-3">
          {projs.length === 0 && (
            <div className="py-6 text-center text-slate-500 text-sm">
              No project entries yet. Click "Add Entry" below.
            </div>
          )}

          <div className="space-y-2.5">
            {projs.map((p, idx) => {
              const isExpanded = !!expandedProjs[p.id];
              const isDragging = draggedProjIdx === idx;
              const isDragOver = dragOverProjIdx === idx;

              return (
                <div 
                  key={p.id}
                  draggable={true}
                  onDragStart={(e) => handleProjDragStart(e, idx)}
                  onDragOver={(e) => handleProjDragOver(e, idx)}
                  onDrop={(e) => handleProjDrop(e, idx)}
                  onDragEnd={() => { setDraggedProjIdx(null); setDragOverProjIdx(null); }}
                  className={`border rounded-2xl bg-white transition-all overflow-hidden shadow-2xs ${
                    isDragging ? 'opacity-40 border-indigo-400 scale-[0.98]' : 'opacity-100'
                  } ${
                    isDragOver ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200'
                  }`}
                >
                  <div
                    onClick={() => toggleProjExpand(p.id)}
                    className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing rounded shrink-0"
                        title="Drag to swap order"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div className="text-base truncate flex-1 min-w-0">
                        <span className="font-bold text-slate-900">
                          {p.title || "Project Title"}
                        </span>
                        {p.tech && (
                          <span className="text-slate-600 ml-1 font-medium">
                            [{p.tech}]
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => removeProject(p.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleProjExpand(p.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Project Title *</label>
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => updateProject(p.id, 'title', e.target.value)}
                            placeholder="e.g. CloudPulse Monitor"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Technologies Used</label>
                          <input
                            type="text"
                            value={p.tech}
                            onChange={(e) => updateProject(p.id, 'tech', e.target.value)}
                            placeholder="e.g. React, Node.js, WebSockets, Docker"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Live App URL</label>
                          <input
                            type="text"
                            value={p.link}
                            onChange={(e) => updateProject(p.id, 'link', e.target.value)}
                            placeholder="https://..."
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">GitHub / Code URL</label>
                          <input
                            type="text"
                            value={p.github}
                            onChange={(e) => updateProject(p.id, 'github', e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Date / Year</label>
                          <input
                            type="text"
                            value={p.date}
                            onChange={(e) => updateProject(p.id, 'date', e.target.value)}
                            placeholder="e.g. 2023"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-800 block mb-1.5 uppercase tracking-wide">
                          Description & Impact
                        </label>
                        <DescriptionTextEditor
                          value={p.description}
                          onChange={(val) => updateProject(p.id, 'description', val)}
                          placeholder="Describe architecture, problems solved, quantifiable throughput..."
                          verbs={["Built", "Implemented", "Deployed", "Engineered", "Designed", "Published"]}
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => toggleProjExpand(p.id)}
                          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-300 shadow-2xs transition-colors"
                        >
                          Done Editing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center pt-3">
            <button
              type="button"
              onClick={addProject}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 rounded-2xl text-base font-bold text-slate-800 hover:text-indigo-600 flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      );
    }

    // ==============================================================
    // CERTIFICATIONS
    // ==============================================================
    if (key === 'certifications') {
      return (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-4">
          {(resumeData.certifications || []).map((c, idx) => (
            <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wider">
                  CREDENTIAL #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCert(c.id)}
                  className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors uppercase tracking-wider"
                >
                  REMOVE
                </button>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-1.5">Certification Title *</label>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCert(c.id, 'name', e.target.value)}
                    placeholder="e.g. AWS Solutions Architect Associate"
                    className="w-full text-base font-bold border border-slate-300 rounded-xl px-4 py-3 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-800 block mb-1.5">Issuing Authority</label>
                    <input
                      type="text"
                      value={c.issuer}
                      onChange={(e) => updateCert(c.id, 'issuer', e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-800 block mb-1.5">Date / Validity</label>
                    <input
                      type="text"
                      value={c.date}
                      onChange={(e) => updateCert(c.id, 'date', e.target.value)}
                      placeholder="e.g. 2023 - 2026"
                      className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={addCertification}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 rounded-2xl text-base font-bold text-slate-800 hover:text-indigo-600 flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add Certification</span>
            </button>
          </div>
        </div>
      );
    }

    // ==============================================================
    // LANGUAGES
    // ==============================================================
    if (key === 'languages') {
      return (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-4">
          {(resumeData.languages || []).map((l) => (
            <div key={l.id} className="flex items-center gap-2.5">
              <input
                type="text"
                value={l.language}
                onChange={(e) => updateLanguage(l.id, 'language', e.target.value)}
                placeholder="Language (e.g. English)"
                className="text-base font-bold border border-slate-300 rounded-xl px-4 py-3 bg-white flex-1"
              />
              <input
                type="text"
                value={l.proficiency}
                onChange={(e) => updateLanguage(l.id, 'proficiency', e.target.value)}
                placeholder="Proficiency (e.g. Fluent)"
                className="text-base border border-slate-300 rounded-xl px-4 py-3 bg-white flex-1 font-medium"
              />
              <button
                type="button"
                onClick={() => removeLanguage(l.id)}
                className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 px-3 py-3 rounded-xl border border-rose-200 transition-colors uppercase"
              >
                REMOVE
              </button>
            </div>
          ))}

          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={addLanguage}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 rounded-2xl text-base font-bold text-slate-800 hover:text-indigo-600 flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add Language</span>
            </button>
          </div>
        </div>
      );
    }

    // ==============================================================
    // CUSTOM SECTION RENDERER
    // ==============================================================
    if (key.startsWith('custom-')) {
      const customItem = (resumeData.customSections || []).find(c => c.id === key);
      if (!customItem) return null;

      return (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-800 block mb-1.5 uppercase tracking-wide">
              SECTION HEADING TITLE:
            </label>
            <input
              type="text"
              value={customItem.title || ""}
              onChange={(e) => updateCustomSectionTitle(customItem.id, e.target.value)}
              placeholder="e.g. VOLUNTEERING, PUBLICATIONS, AWARDS"
              className="w-full text-lg font-black border-2 border-indigo-300 rounded-xl px-4 py-3 bg-indigo-50/30 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wide"
            />
          </div>

          <div className="space-y-3">
            {(customItem.items || []).map((entry, idx) => {
              const isExpanded = !!expandedCustomItems[entry.id];

              return (
                <div key={entry.id} className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
                  <div 
                    onClick={() => toggleCustomItemExpand(entry.id)}
                    className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  >
                    <div className="text-base font-bold text-slate-900 truncate flex-1 min-w-0">
                      {entry.title || "Custom Entry"} {entry.subtitle && <span className="font-medium text-slate-600">, {entry.subtitle}</span>}
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => removeCustomItem(customItem.id, entry.id, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCustomItemExpand(entry.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Entry Title *</label>
                          <input
                            type="text"
                            value={entry.title || ""}
                            onChange={(e) => updateCustomItem(customItem.id, entry.id, 'title', e.target.value)}
                            placeholder="e.g. Volunteer Lead / Paper Title"
                            className="w-full text-base font-bold border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Subtitle / Organization</label>
                          <input
                            type="text"
                            value={entry.subtitle || ""}
                            onChange={(e) => updateCustomItem(customItem.id, entry.id, 'subtitle', e.target.value)}
                            placeholder="e.g. Non-Profit Org / IEEE"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none font-medium"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-sm font-bold text-slate-800 block mb-1.5">Date / Duration</label>
                          <input
                            type="text"
                            value={entry.date || ""}
                            onChange={(e) => updateCustomItem(customItem.id, entry.id, 'date', e.target.value)}
                            placeholder="e.g. 2023 - Present"
                            className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-800 block mb-1.5 uppercase tracking-wide">
                          Details & Bullet Points
                        </label>
                        <DescriptionTextEditor
                          value={entry.description || ""}
                          onChange={(val) => updateCustomItem(customItem.id, entry.id, 'description', val)}
                          placeholder="Details about this custom entry..."
                          verbs={["Organized", "Authored", "Spearheaded", "Awarded", "Presented"]}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={() => addCustomItem(customItem.id)}
                className="px-6 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 rounded-2xl text-base font-bold text-slate-800 hover:text-indigo-600 flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Add Entry</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4 pb-14 font-sans text-slate-900">

      {/* ============================================================== */}
      {/* 1. PERSONAL DETAILS (NO ICON, BOLD, LARGE, UPPERCASE) */}
      {/* ============================================================== */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('personal')}
          className="w-full p-4.5 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 leading-tight">
              PERSONAL DETAILS
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Contact information, full name & target title
            </p>
          </div>

          <div className="flex items-center gap-2">
            {openSectionKey === 'personal' ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </div>
        </button>

        {openSectionKey === 'personal' && (
          <div className="p-5 pt-2 border-t border-slate-100 space-y-4">
            {/* Photo upload row */}
            <div className="flex items-center gap-4 py-2">
              <div className="relative group">
                <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-300 overflow-hidden flex items-center justify-center text-slate-400 shadow-inner shrink-0">
                  {resumeData.personalDetails.photoUrl ? (
                    <img 
                      src={resumeData.personalDetails.photoUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-[10px] font-bold tracking-tight text-slate-400">PHOTO</span>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 hover:bg-black text-white rounded-full cursor-pointer shadow-md transition-all">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 text-sm">
                <div className="font-bold text-slate-900 text-base">Profile Photo</div>
                <div className="text-slate-500 mt-0.5">Optional for modern ATS resumes</div>
                {resumeData.personalDetails.photoUrl && (
                  <button
                    type="button"
                    onClick={() => handlePersonalChange('photoUrl', '')}
                    className="mt-1 text-sm font-bold text-rose-600 hover:underline"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={resumeData.personalDetails.fullName || ""}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">Target Professional Title *</label>
                <input
                  type="text"
                  value={resumeData.personalDetails.jobTitle || ""}
                  onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={resumeData.personalDetails.email || ""}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">Phone Number *</label>
                <input
                  type="text"
                  value={resumeData.personalDetails.phone || ""}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  placeholder="+1 (555) 349-8201"
                  className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">Location (City, Country)</label>
                <input
                  type="text"
                  value={resumeData.personalDetails.location || ""}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">Website / Portfolio</label>
                <input
                  type="text"
                  value={resumeData.personalDetails.website || ""}
                  onChange={(e) => handlePersonalChange('website', e.target.value)}
                  placeholder="https://alexmorgan.dev"
                  className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">LinkedIn Profile</label>
                <input
                  type="text"
                  value={resumeData.personalDetails.linkedin || ""}
                  onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/alexmorgan"
                  className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">GitHub / Code Profile</label>
                <input
                  type="text"
                  value={resumeData.personalDetails.github || ""}
                  onChange={(e) => handlePersonalChange('github', e.target.value)}
                  placeholder="github.com/alexmorgan"
                  className="w-full text-base border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. DYNAMIC DRAGGABLE SECTIONS (ORDERABLE & DELETABLE) */}
      {/* ============================================================== */}
      <div className="space-y-4">
        {safeSectionsOrder.map((sectionKey, index) => {
          let sectionTitle = "";
          if (DEFAULT_SECTIONS_INFO[sectionKey]) {
            sectionTitle = DEFAULT_SECTIONS_INFO[sectionKey].title;
          } else if (sectionKey.startsWith('custom-')) {
            const customItem = (resumeData.customSections || []).find(c => c.id === sectionKey);
            sectionTitle = (customItem?.title || "CUSTOM SECTION").toUpperCase();
          }

          const isOpen = openSectionKey === sectionKey;
          const isDraggingThis = draggedSectionIndex === index;
          const isDragOverThis = dragOverSectionIndex === index;

          return (
            <div
              key={sectionKey}
              draggable={true}
              onDragStart={(e) => handleSectionDragStart(e, index)}
              onDragOver={(e) => handleSectionDragOver(e, index)}
              onDrop={(e) => handleSectionDrop(e, index)}
              onDragEnd={handleSectionDragEnd}
              className={`bg-white border-2 rounded-2xl shadow-xs transition-all ${
                isDraggingThis ? 'opacity-40 border-indigo-400 scale-[0.98]' : 'opacity-100'
              } ${
                isDragOverThis ? 'border-indigo-600 bg-indigo-50/20 shadow-md' : 'border-slate-200'
              }`}
            >
              {/* SECTION HEADER (BOLD, LARGE, UPPERCASE, NO ICONS, ANIMATED DELETE ON HOVER) */}
              <div 
                onClick={() => toggleSection(sectionKey)}
                className="group w-full p-4.5 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  {/* Grip Handle for Section Dragging */}
                  <div 
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing rounded"
                    title="Drag up or down to reorder resume sections"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Section Title: BOLD, LARGE, UPPERCASE, NO ICONS */}
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 leading-tight">
                      {sectionTitle}
                    </h3>
                  </div>
                </div>

                {/* Controls: Animated Delete Button on Hover + Accordion Toggle */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {/* Animated Delete Icon on Hover */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(sectionKey);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300 transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 focus:opacity-100 focus:scale-100 cursor-pointer"
                    title={`Delete complete ${sectionTitle} section`}
                  >
                    <Trash2 className="w-5 h-5 stroke-[2.2]" />
                  </button>

                  {/* Accordion expand/collapse */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sectionKey)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Section Body */}
              {isOpen && renderSectionBody(sectionKey)}
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 3. RESTORE REMOVED DEFAULT SECTIONS IF ANY WERE DELETED */}
      {/* ============================================================== */}
      {deletedDefaultSections.length > 0 && (
        <div className="p-4.5 bg-slate-100/80 border border-dashed border-slate-300 rounded-2xl">
          <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2.5">
            RESTORE REMOVED RESUME SECTIONS:
          </div>
          <div className="flex flex-wrap gap-2">
            {deletedDefaultSections.map(sec => (
              <button
                key={sec.key}
                type="button"
                onClick={() => handleRestoreSection(sec.key)}
                className="px-3.5 py-2 text-xs font-bold bg-white text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-50 shadow-2xs transition-colors uppercase tracking-wide"
              >
                + {sec.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. LARGE ADD CUSTOM CONTENT BUTTON (INCREASED HEIGHT & GRADIENT) */}
      {/* ============================================================== */}
      <div className="pt-3 pb-3">
        <button
          type="button"
          onClick={handleAddCustomContent}
          className="w-full h-16 sm:h-20 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 active:from-indigo-700 active:via-purple-700 active:to-pink-700 text-white rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wider shadow-lg hover:shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] border border-white/20"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          <span>ADD CUSTOM CONTENT</span>
        </button>
      </div>

    </div>
  );
}

export default ContentTab;
