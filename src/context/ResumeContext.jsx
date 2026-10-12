import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialResumeData, blankResumeData } from '../data/defaultResume';
import { initialCustomization } from '../data/customizationDefaults';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ResumeContext = createContext(null);

const DUMMY_RESUME_IDS = new Set(['res-gk-01', 'res-am-02', 'res-dev-03']);

export function isResumeBlank(resume) {
  if (!resume || !resume.data) return true;
  const d = resume.data;
  const p = d.personalDetails || {};
  
  const hasPersonalDetails = Boolean(
    (p.fullName && p.fullName.trim()) ||
    (p.jobTitle && p.jobTitle.trim()) ||
    (p.email && p.email.trim()) ||
    (p.phone && p.phone.trim()) ||
    (p.location && p.location.trim()) ||
    (p.website && p.website.trim()) ||
    (p.linkedin && p.linkedin.trim()) ||
    (p.github && p.github.trim()) ||
    (p.photoUrl && p.photoUrl.trim())
  );

  const hasSummary = Boolean(d.summary && d.summary.trim());
  const hasExperience = Array.isArray(d.experience) && d.experience.some(e => 
    (e.company && e.company.trim()) || 
    (e.position && e.position.trim()) || 
    (e.description && e.description.trim())
  );
  const hasEducation = Array.isArray(d.education) && d.education.some(e => 
    (e.institution && e.institution.trim()) || 
    (e.degree && e.degree.trim())
  );
  const hasSkills = Array.isArray(d.skills) && d.skills.some(s => 
    (s.category && s.category.trim()) || 
    (s.items && s.items.trim())
  );
  const hasProjects = Array.isArray(d.projects) && d.projects.some(pr => 
    (pr.title && pr.title.trim()) || 
    (pr.description && pr.description.trim())
  );
  const hasCertifications = Array.isArray(d.certifications) && d.certifications.some(c => 
    (c.name && c.name.trim())
  );
  const hasLanguages = Array.isArray(d.languages) && d.languages.some(l => 
    (l.language && l.language.trim())
  );
  const hasCustomSections = Array.isArray(d.customSections) && d.customSections.some(cs => 
    (cs.title && cs.title.trim()) || 
    (Array.isArray(cs.items) && cs.items.length > 0)
  );

  return !(
    hasPersonalDetails ||
    hasSummary ||
    hasExperience ||
    hasEducation ||
    hasSkills ||
    hasProjects ||
    hasCertifications ||
    hasLanguages ||
    hasCustomSections
  );
}

export function isUneditedDraft(r) {
  if (!r) return false;
  // If explicitly marked as draft and user hasn't made any edits yet
  if (r.isDraft && !r.isEdited) return true;
  // Fallback: If completely blank with default title
  if (isResumeBlank(r) && (!r.history || r.history.length <= 1) && (!r.title || r.title.startsWith('Resume ') || r.title === 'New Resume' || r.title === 'New_Resume' || r.title === 'My Resume' || r.isDraft)) {
    return true;
  }
  return false;
}

export function filterOutDummyResumes(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((r) => {
    if (!r) return false;
    // Strip dummy mock resumes created by previous default generator
    if (DUMMY_RESUME_IDS.has(r.id)) return false;
    if (r.id === 'res-gk-01' || r.id === 'res-am-02' || r.id === 'res-dev-03') return false;
    if (r.title === 'Gaurav Kakran' && r.id?.startsWith('res-gk')) return false;
    if (r.title === 'Alex_Morgan_Resume' && r.id?.startsWith('res-am')) return false;
    if (r.title === 'Resume 2' && r.id?.startsWith('res-dev')) return false;
    // Strip any completely blank or unedited draft resumes
    if (isUneditedDraft(r)) {
      return false;
    }
    return true;
  });
}

export function ResumeProvider({ children }) {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const currentUserId = user?.id || 'guest';
  const storageKey = `proresume_resumes_${currentUserId}`;

  // Ref to track which user's data is currently loaded in 'resumes' state
  const loadedUserIdRef = useRef(currentUserId);

  // Resumes list state - ONLY user-created resumes, NO auto-generated dummy resumes
  const [resumes, setResumes] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = filterOutDummyResumes(parsed);
          // If legacy dummy resumes existed, clean them up from localStorage immediately!
          if (cleaned.length !== parsed.length) {
            try {
              localStorage.setItem(storageKey, JSON.stringify(cleaned));
            } catch (e) {}
          }
          if (!isLoggedIn) {
            return cleaned.map(r => ({ ...r, history: [] }));
          }
          return cleaned;
        }
      }

      return [];
    } catch (e) {
      console.error('Error loading resumes:', e);
      return [];
    }
  });

  // Currently active resume ID
  const [activeResumeId, setActiveResumeId] = useState(() => {
    return resumes[0]?.id || null;
  });

  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'
  const saveTimeoutRef = useRef(null);

  // Sync with localStorage when user changes (login or logout)
  useEffect(() => {
    const prevUserId = loadedUserIdRef.current;
    if (prevUserId === currentUserId) return;

    try {
      const wasGuest = prevUserId === 'guest';
      const isLoggingIn = wasGuest && isLoggedIn && currentUserId !== 'guest';

      // Read target user's existing saved resumes from localStorage
      const saved = localStorage.getItem(`proresume_resumes_${currentUserId}`);
      let userResumes = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            userResumes = filterOutDummyResumes(parsed);
            if (userResumes.length !== parsed.length) {
              localStorage.setItem(`proresume_resumes_${currentUserId}`, JSON.stringify(userResumes));
            }
            if (!isLoggedIn) {
              userResumes = userResumes.map(r => ({ ...r, history: [] }));
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      // IF GUEST JUST LOGGED IN (e.g. from /editor while creating/editing a resume to download):
      if (isLoggingIn) {
        // Find the active resume the guest was working on (excluding any dummy resumes)
        const validGuestResumes = filterOutDummyResumes(resumes);
        let activeGuestResume = validGuestResumes.find(r => r.id === activeResumeId) || validGuestResumes[0];

        // Fallback: check guest localStorage if in-memory list is missing it
        if (!activeGuestResume) {
          try {
            const guestSaved = localStorage.getItem('proresume_resumes_guest');
            if (guestSaved) {
              const parsedGuest = JSON.parse(guestSaved);
              if (Array.isArray(parsedGuest) && parsedGuest.length > 0) {
                const cleanedGuest = filterOutDummyResumes(parsedGuest);
                activeGuestResume = cleanedGuest.find(r => r.id === activeResumeId) || cleanedGuest[0];
              }
            }
          } catch (e) {}
        }

        if (activeGuestResume) {
          // Prepare migrated resume with active revision history, maintaining 100% same content
          const migratedActiveResume = {
            ...activeGuestResume,
            updatedAt: Date.now(),
            history: [
              {
                id: `h-${Date.now()}`,
                timestamp: Date.now(),
                action: 'Saved to Cloud Account',
                note: `Linked to ${user?.email || 'Google Account'} upon sign-in`,
              },
              ...(activeGuestResume.history || []),
            ],
          };

          // Migrate all other valid guest session resumes as well
          const otherGuestResumes = validGuestResumes
            .filter(r => r.id !== activeGuestResume.id)
            .map(r => ({
              ...r,
              history: r.history || [],
            }));

          const allGuestMigrated = [migratedActiveResume, ...otherGuestResumes];
          const guestIds = new Set(allGuestMigrated.map(r => r.id));

          // Retain existing account resumes that don't collide with guest resumes
          const existingNonColliding = userResumes.filter(r => !guestIds.has(r.id));

          const mergedList = [...allGuestMigrated, ...existingNonColliding];

          // Save directly to target user's account storage
          localStorage.setItem(`proresume_resumes_${currentUserId}`, JSON.stringify(mergedList));

          // Clean up guest storage so it doesn't linger
          try {
            localStorage.removeItem('proresume_resumes_guest');
          } catch (e) {}

          loadedUserIdRef.current = currentUserId;
          setResumes(mergedList);
          setActiveResumeId(migratedActiveResume.id);
          return;
        }
      }

      // If user logged out (switched to guest)
      if (!isLoggedIn) {
        const guestSaved = localStorage.getItem('proresume_resumes_guest');
        let guestResumes = [];
        if (guestSaved) {
          try {
            const parsed = JSON.parse(guestSaved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              guestResumes = filterOutDummyResumes(parsed).map(r => ({ ...r, history: [] }));
            }
          } catch (e) {}
        }

        loadedUserIdRef.current = 'guest';
        setResumes(guestResumes);
        setActiveResumeId(guestResumes[0]?.id || null);
        return;
      }

      // Normal account load (only user-created resumes)
      loadedUserIdRef.current = currentUserId;
      setResumes(userResumes);
      setActiveResumeId(userResumes[0]?.id || null);
    } catch (e) {
      console.error('Failed to load user resumes:', e);
    }
  }, [currentUserId, isLoggedIn]);

  // Save to localStorage & sync to Supabase Cloud on change
  useEffect(() => {
    if (loadedUserIdRef.current !== currentUserId) {
      // Prevents race-condition overwrite when user changes
      return;
    }
    try {
      const toSave = resumes.filter((r) => !isUneditedDraft(r));
      localStorage.setItem(storageKey, JSON.stringify(toSave));

      // Sync to Supabase Cloud if user is authenticated and Supabase is configured
      if (isSupabaseConfigured && isLoggedIn && currentUserId && currentUserId !== 'guest') {
        toSave.forEach((r) => {
          if (!r?.id) return;
          supabase
            .from('resumes')
            .upsert({
              id: r.id,
              user_id: user.id,
              title: r.title || 'My Resume',
              template_id: r.templateId || 'modern',
              data: r.data || {},
              customization: r.customization || {},
              is_draft: Boolean(r.isDraft),
              updated_at: new Date(r.updatedAt || Date.now()).toISOString(),
            })
            .then(() => {})
            .catch((err) => console.warn('Supabase sync warning:', err));
        });
      }
    } catch (e) {
      console.error('Error saving resumes list:', e);
    }
  }, [resumes, storageKey, currentUserId, isLoggedIn, user?.id]);

  // Load from Supabase Cloud on login
  useEffect(() => {
    if (!isSupabaseConfigured || !isLoggedIn || !user?.id || user.id === 'guest') return;

    async function loadCloudResumes() {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id);

        if (!error && Array.isArray(data) && data.length > 0) {
          const cloudList = data.map((row) => ({
            id: row.id,
            title: row.title || 'My Resume',
            templateId: row.template_id || 'modern',
            data: row.data || {},
            customization: row.customization || {},
            isDraft: Boolean(row.is_draft),
            updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
            history: [],
          }));

          setResumes((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newResumes = cloudList.filter((cr) => !existingIds.has(cr.id));
            if (newResumes.length > 0) {
              const merged = [...prev, ...newResumes];
              try {
                localStorage.setItem(`proresume_resumes_${user.id}`, JSON.stringify(merged));
              } catch (e) {}
              return merged;
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn('Could not load from Supabase:', err);
      }
    }

    loadCloudResumes();
  }, [user?.id, isLoggedIn]);

  // Active resume object
  const activeResume = resumes.find((r) => r.id === activeResumeId) || resumes[0] || null;

  // Cleanup unedited blank draft resumes
  const cleanupBlankDrafts = () => {
    setResumes((prev) => {
      const remaining = prev.filter((r) => !isUneditedDraft(r));

      if (remaining.length !== prev.length) {
        if (!remaining.some((r) => r.id === activeResumeId)) {
          setActiveResumeId(remaining[0]?.id || null);
        }
        try {
          localStorage.setItem(storageKey, JSON.stringify(remaining));
        } catch (e) {}
      }
      return remaining;
    });
  };

  // Create New Resume
  const createResume = ({ title = 'New Resume', data = null, customization = null, isDraft = false, isEdited = false } = {}) => {
    const newId = `res-${Date.now().toString(36)}`;
    const resumeData = data ? JSON.parse(JSON.stringify(data)) : JSON.parse(JSON.stringify(initialResumeData));

    const newResume = {
      id: newId,
      title: title || 'New Resume',
      updatedAt: Date.now(),
      pageFormat: 'A4',
      isDraft: Boolean(isDraft),
      isEdited: Boolean(isEdited),
      data: resumeData,
      customization: customization || initialCustomization,
      // Only manage history if user is logged in
      history: isLoggedIn ? [
        {
          id: `h-${Date.now()}`,
          timestamp: Date.now(),
          action: 'Created Resume',
          note: `New resume initialized (ID: ${newId})`,
        },
      ] : [],
    };

    setResumes((prev) => [newResume, ...prev]);
    setActiveResumeId(newId);
    return newId;
  };

  // Duplicate Resume
  const duplicateResume = (id) => {
    const original = resumes.find((r) => r.id === id);
    if (!original) return null;

    const newId = `res-${Date.now().toString(36)}`;
    const copy = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      updatedAt: Date.now(),
      isDraft: false,
      data: JSON.parse(JSON.stringify(original.data)),
      customization: JSON.parse(JSON.stringify(original.customization)),
      // Only manage history if user is logged in
      history: isLoggedIn ? [
        {
          id: `h-${Date.now()}`,
          timestamp: Date.now(),
          action: 'Duplicated Resume',
          note: `Cloned from ${original.title} (${original.id})`,
        },
        ...(original.history || []),
      ] : [],
    };

    setResumes((prev) => [copy, ...prev]);
    return newId;
  };

  // Rename Resume
  const renameResume = (id, newTitle) => {
    setResumes((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const isDefaultTitle = !newTitle || newTitle === 'New Resume' || newTitle === 'New_Resume' || newTitle.startsWith('Resume ');
        const isDraft = r.isDraft ? (isResumeBlank(r) && isDefaultTitle) : false;

        const newHist = isLoggedIn ? [
          {
            id: `h-${Date.now()}`,
            timestamp: Date.now(),
            action: 'Renamed Resume',
            note: `Renamed from "${r.title}" to "${newTitle}"`,
          },
          ...(r.history || []),
        ] : [];

        return {
          ...r,
          title: newTitle,
          isDraft: false,
          isEdited: true,
          updatedAt: Date.now(),
          history: newHist,
        };
      })
    );
  };

  // Delete Resume by ID
  const deleteResume = (id) => {
    setResumes((prev) => {
      const remaining = prev.filter((r) => r.id !== id);
      if (activeResumeId === id) {
        setActiveResumeId(remaining[0]?.id || null);
      }
      return remaining;
    });

    if (isSupabaseConfigured && isLoggedIn && user?.id && user.id !== 'guest') {
      supabase.from('resumes').delete().eq('id', id).then(() => {}).catch(e => console.warn(e));
    }
  };

  // Delete All Resumes
  const deleteAllResumes = () => {
    setResumes([]);
    setActiveResumeId(null);
    try {
      localStorage.setItem(storageKey, JSON.stringify([]));
      if (isSupabaseConfigured && isLoggedIn && user?.id && user.id !== 'guest') {
        supabase.from('resumes').delete().eq('user_id', user.id).then(() => {}).catch(e => console.warn(e));
      }
    } catch (e) {
      console.error('Error clearing resumes in storage:', e);
    }
  };

  // Auto-save updates: only manage history if user is logged in
  const updateActiveResume = (dataUpdater, customizationUpdater, actionLabel = 'Edited Content') => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    setResumes((prev) => {
      // If resumes was empty, auto-create initial resume
      if (prev.length === 0 || !activeResumeId || !prev.some(r => r.id === activeResumeId)) {
        const newId = `res-${Date.now().toString(36)}`;
        const freshData = typeof dataUpdater === 'function' ? dataUpdater(blankResumeData) : (dataUpdater || blankResumeData);
        const fresh = {
          id: newId,
          title: 'My Resume',
          updatedAt: Date.now(),
          pageFormat: 'A4',
          isDraft: false,
          isEdited: true,
          data: freshData,
          customization: typeof customizationUpdater === 'function' ? customizationUpdater(initialCustomization) : (customizationUpdater || initialCustomization),
          history: isLoggedIn ? [
            { id: `h-${Date.now()}`, timestamp: Date.now(), action: actionLabel, note: 'Initialized resume' },
          ] : [],
        };
        setActiveResumeId(newId);
        return [fresh];
      }

      return prev.map((r) => {
        if (r.id !== activeResumeId) return r;

        const updatedData =
          typeof dataUpdater === 'function' ? dataUpdater(r.data) : (dataUpdater !== undefined ? dataUpdater : r.data);

        const updatedCustom =
          typeof customizationUpdater === 'function'
            ? customizationUpdater(r.customization)
            : (customizationUpdater !== undefined ? customizationUpdater : r.customization);

        const hasCustomDesign = Boolean(customizationUpdater !== undefined || r.hasCustomDesign);

        let newHist = [];
        if (isLoggedIn) {
          const existingHist = r.history || [];
          const lastHist = existingHist[0];
          const isRecent = lastHist && (Date.now() - lastHist.timestamp < 120000); // 2 minutes window

          newHist = existingHist;
          if (!isRecent) {
            newHist = [
              {
                id: `h-${Date.now()}`,
                timestamp: Date.now(),
                action: actionLabel,
                note: `Auto-saved updates at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              },
              ...existingHist.slice(0, 19),
            ];
          }
        }

        return {
          ...r,
          data: updatedData,
          customization: updatedCustom,
          isDraft: false,
          isEdited: true,
          hasCustomDesign,
          updatedAt: Date.now(),
          history: newHist,
        };
      });
    });

    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
  };

  const updateActiveData = (updater) => {
    updateActiveResume(updater, undefined, 'Updated Content');
  };

  const updateActiveCustomization = (updater) => {
    updateActiveResume(undefined, updater, 'Customized Design');
  };

  const updateActiveTitle = (title) => {
    if (!activeResumeId) return;
    renameResume(activeResumeId, title);
  };

  const addResumeHistoryEntry = (id, action, note) => {
    if (!isLoggedIn) return; // Do not manage history if guest / not logged in
    setResumes((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          updatedAt: Date.now(),
          history: [
            { id: `h-${Date.now()}`, timestamp: Date.now(), action, note },
            ...(r.history || []),
          ],
        };
      })
    );
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        activeResumeId,
        setActiveResumeId,
        activeResume,
        saveStatus,
        createResume,
        duplicateResume,
        renameResume,
        deleteResume,
        deleteAllResumes,
        updateActiveResume,
        updateActiveData,
        updateActiveCustomization,
        updateActiveTitle,
        addResumeHistoryEntry,
        cleanupBlankDrafts,
        isResumeBlank,
        isUneditedDraft,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
