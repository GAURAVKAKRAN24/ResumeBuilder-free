import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

// Configure pdfjs worker to local bundled worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const DEFAULT_SECTIONS_ORDER = [
  "summary", 
  "experience", 
  "education", 
  "skills", 
  "projects", 
  "certifications", 
  "languages"
];

export const DEFAULT_SECTIONS_VISIBILITY = {
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: true,
  languages: true,
};

export async function parseResumeFile(file) {
  const fileName = file.name.toLowerCase();

  // 1. JSON Resume / ProResume backup
  if (fileName.endsWith('.json')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const normalized = normalizeResumeJson(parsed);
          resolve({ type: 'json', data: normalized });
        } catch (err) {
          reject(new Error("Invalid JSON resume format"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read JSON file"));
      reader.readAsText(file);
    });
  }

  // 2. PDF Files: Extract genuine text content page by page using pdfjs
  if (fileName.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let textLines = [];
      const linkUrls = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // Extract PDF link annotations (mailto, linkedin, github, portfolio links)
        try {
          const annotations = await page.getAnnotations();
          if (Array.isArray(annotations)) {
            annotations.forEach(ann => {
              if (ann && ann.url) {
                linkUrls.push(ann.url);
              }
            });
          }
        } catch (annErr) {
          console.warn("Could not read annotations on page", i, annErr);
        }

        const textContent = await page.getTextContent();
        const items = (textContent.items || []).filter(item => item && item.str && item.str.trim().length > 0);

        // Sort items by visual position:
        // Top of page (higher Y) first. On the same visual line (within 3.5px), left to right (smaller X first).
        items.sort((a, b) => {
          const yDiff = b.transform[5] - a.transform[5];
          if (Math.abs(yDiff) > 3.5) {
            return yDiff;
          }
          return a.transform[4] - b.transform[4];
        });

        // Group into lines with gap-based logical separation
        let currentLineY = null;
        let currentLineText = "";
        let prevItemEndX = null;

        items.forEach((item) => {
          const itemY = item.transform[5];
          const itemX = item.transform[4];
          const itemWidth = item.width || 0;

          if (currentLineY === null || Math.abs(itemY - currentLineY) > 3.5) {
            // New visual line
            if (currentLineText.trim()) {
              textLines.push(currentLineText.trim());
            }
            currentLineY = itemY;
            currentLineText = item.str;
            prevItemEndX = itemX + itemWidth;
          } else {
            // Same visual line: check horizontal gap
            const gap = prevItemEndX !== null ? itemX - prevItemEndX : 0;
            if (gap > 22) {
              // Wide gap between columns/fields (e.g. Title on left, Dates on right)
              currentLineText += " | " + item.str;
            } else if (gap > 4) {
              currentLineText += " " + item.str;
            } else {
              const needSpace = !currentLineText.endsWith(" ") && !item.str.startsWith(" ");
              currentLineText += (needSpace ? " " : "") + item.str;
            }
            prevItemEndX = itemX + itemWidth;
          }
        });

        if (currentLineText.trim()) {
          textLines.push(currentLineText.trim());
        }
      }

      const extractedText = textLines.join("\n");
      const data = extractDetailsFromText(extractedText, file.name, linkUrls);
      return { type: 'extracted', data };
    } catch (err) {
      console.error("PDF Parsing error:", err);
      throw new Error("Could not extract text from this PDF. Please ensure it is not password protected.");
    }
  }

  // 3. Word Documents (.docx)
  if (fileName.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const data = extractDetailsFromText(result.value, file.name);
      return { type: 'extracted', data };
    } catch (err) {
      console.error("DOCX Parsing error:", err);
      throw new Error("Could not read Word document (.docx).");
    }
  }

  // 4. Plain Text (.txt) or fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const data = extractDetailsFromText(text, file.name);
      resolve({ type: 'extracted', data });
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

// Normalizes JSON whether it's our backup format, standard JSON Resume, or custom JSON
export function normalizeResumeJson(json) {
  const raw = json.resumeData ? json.resumeData : json;
  const customization = json.customization || null;

  const basics = raw.basics || {};
  const personal = raw.personalDetails || {
    fullName: basics.name || raw.name || "Candidate Name",
    jobTitle: basics.label || raw.jobTitle || "Professional",
    email: basics.email || raw.email || "",
    phone: basics.phone || raw.phone || "",
    location: basics.location?.city ? `${basics.location.city}, ${basics.location.region || basics.location.countryCode || ""}` : (raw.location || ""),
    website: basics.url || raw.website || "",
    linkedin: (basics.profiles || []).find(p => p.network?.toLowerCase().includes("linkedin"))?.url || raw.linkedin || "",
    github: (basics.profiles || []).find(p => p.network?.toLowerCase().includes("github"))?.url || raw.github || "",
    photoUrl: basics.image || raw.photoUrl || ""
  };

  const experience = Array.isArray(raw.experience) 
    ? raw.experience 
    : Array.isArray(raw.work) 
    ? raw.work.map((w, idx) => ({
        id: `exp-${idx}-${Date.now()}`,
        company: w.name || w.company || "",
        position: w.position || "",
        location: w.location || "",
        startDate: w.startDate || "",
        endDate: w.endDate || "",
        current: !w.endDate,
        description: w.summary || (w.highlights ? w.highlights.map(h => `• ${h}`).join("\n") : "")
      }))
    : [];

  const education = Array.isArray(raw.education)
    ? raw.education.map((e, idx) => ({
        id: e.id || `edu-${idx}-${Date.now()}`,
        institution: e.institution || e.school || "",
        degree: e.degree || e.studyType || e.area ? `${e.studyType || ""} ${e.area || ""}`.trim() : "",
        location: e.location || "",
        startDate: e.startDate || "",
        endDate: e.endDate || "",
        grade: e.grade || e.score || e.gpa || ""
      }))
    : [];

  const skills = Array.isArray(raw.skills)
    ? raw.skills.map(s => typeof s === 'string' ? { category: "Skills", items: s } : {
        category: s.category || s.name || "Core Skills",
        items: Array.isArray(s.keywords) ? s.keywords.join(", ") : (s.items || "")
      })
    : [];

  const projects = Array.isArray(raw.projects) ? raw.projects : [];
  const certifications = Array.isArray(raw.certifications) 
    ? raw.certifications 
    : Array.isArray(raw.certificates)
    ? raw.certificates.map(c => ({
        id: `cert-${Date.now()}`,
        name: c.name || "",
        issuer: c.issuer || "",
        date: c.date || "",
        credentialUrl: c.url || ""
      }))
    : [];

  const languages = Array.isArray(raw.languages)
    ? raw.languages.map(l => typeof l === 'string' ? { id: `lang-${Date.now()}`, language: l, proficiency: "Fluent" } : {
        id: l.id || `lang-${Date.now()}`,
        language: l.language || l.name || "",
        proficiency: l.proficiency || l.fluency || "Fluent"
      })
    : [];

  return {
    personalDetails: personal,
    summary: raw.summary || basics.summary || "",
    sectionsOrder: Array.isArray(raw.sectionsOrder) && raw.sectionsOrder.length > 0 
      ? raw.sectionsOrder 
      : DEFAULT_SECTIONS_ORDER,
    sectionsVisibility: raw.sectionsVisibility || DEFAULT_SECTIONS_VISIBILITY,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    customSections: Array.isArray(raw.customSections) ? raw.customSections : [],
    customization
  };
}

// Intelligent extractor for text parsed from PDF, Word, or TXT
export function extractDetailsFromText(rawText, fileName = "", linkUrls = []) {
  if (!rawText) return getDefaultEmptyResume(fileName);

  // Filter out raw PDF metadata or stream tokens
  const cleanLines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => {
      if (!l) return false;
      if (l.startsWith('%PDF') || l.startsWith('<<') || l.startsWith('>>')) return false;
      if (l.includes('obj') && l.includes('endobj')) return false;
      if (l.includes('/MediaBox') || l.includes('/Type /Page')) return false;
      return true;
    });

  const fullCleanText = cleanLines.join("\n");

  // 1. Email Extraction (Prioritize PDF link annotations first, then text search)
  let email = "";
  const mailtoLink = linkUrls.find(u => typeof u === 'string' && u.toLowerCase().startsWith('mailto:'));
  if (mailtoLink) {
    email = mailtoLink.replace(/^mailto:/i, '').split('?')[0].trim();
  }
  if (!email) {
    const emailMatch = fullCleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
    if (emailMatch) email = emailMatch[0].trim();
  }

  // 2. Phone Extraction (Accurate matching avoiding year ranges like 2018-2022)
  let phone = "";
  const phoneRegexes = [
    /(?:\+91[\s-]?)?[6-9]\d{9}\b/, // Indian mobile
    /(?:\+?1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/, // US/North America
    /\+?\d{1,3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/ // International
  ];
  for (const rx of phoneRegexes) {
    const match = fullCleanText.match(rx);
    if (match) {
      const candidate = match[0].trim();
      // Ensure candidate is not a date range like 2019-2023
      if (!/^(19|20)\d{2}[-\s](19|20)\d{2}$/.test(candidate) && candidate.replace(/\D/g, '').length >= 10) {
        phone = candidate;
        break;
      }
    }
  }

  // 3. LinkedIn Extraction
  let linkedin = "";
  const linkedinUrl = linkUrls.find(u => typeof u === 'string' && u.toLowerCase().includes('linkedin.com/in/'));
  if (linkedinUrl) {
    linkedin = linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  } else {
    const linkedinMatch = fullCleanText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    if (linkedinMatch) linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
  }

  // 4. GitHub Extraction
  let github = "";
  const githubUrl = linkUrls.find(u => typeof u === 'string' && u.toLowerCase().includes('github.com/') && !u.includes('/issues') && !u.includes('/pull'));
  if (githubUrl) {
    github = githubUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  } else {
    const githubMatch = fullCleanText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
    if (githubMatch) github = `github.com/${githubMatch[1]}`;
  }

  // 5. Website / Portfolio Extraction
  let website = "";
  const portfolioUrl = linkUrls.find(u => typeof u === 'string' && !u.includes('linkedin.com') && !u.includes('github.com') && !u.startsWith('mailto:'));
  if (portfolioUrl) {
    website = portfolioUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  } else {
    const websiteMatch = fullCleanText.match(/https?:\/\/(?!linkedin|github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s|]*)?/i);
    if (websiteMatch) website = websiteMatch[0].replace(/^https?:\/\//, '').trim();
  }

  // 6. Candidate Name Extraction
  let name = "";
  for (let i = 0; i < Math.min(cleanLines.length, 5); i++) {
    const rawLine = cleanLines[i];
    // Split by pipe or dash if candidate name shares line with other elements
    const lineParts = rawLine.split(/[|•–—]/).map(p => p.trim()).filter(Boolean);
    const candidateNamePart = lineParts[0] || "";

    if (candidateNamePart.includes("@") || candidateNamePart.includes("http") || candidateNamePart.includes("www") || candidateNamePart.length > 35) continue;
    if (isHeadingLine(candidateNamePart)) continue;

    // Check Title Case: "Gaurav Kakran" or All-Caps: "GAURAV KAKRAN"
    if (/^[A-Za-z.'-]+(?:\s+[A-Za-z.'-]+){1,3}$/.test(candidateNamePart)) {
      // Normalize to Title Case if all uppercase
      if (candidateNamePart === candidateNamePart.toUpperCase()) {
        name = candidateNamePart.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      } else {
        name = candidateNamePart;
      }
      break;
    }
  }

  // Fallback candidate name if not found
  if (!name && linkedin) {
    const liUser = linkedin.split('/').pop();
    if (liUser) name = liUser.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  } else if (!name && email) {
    const emailUser = email.split('@')[0].replace(/[0-9._-]+/g, ' ').trim();
    if (emailUser.length > 3) {
      name = emailUser.replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  if (!name && fileName) {
    name = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/(resume|cv)/gi, "").trim();
    if (name) name = name.replace(/\b\w/g, c => c.toUpperCase());
  }
  if (!name) name = "Candidate Name";

  // 7. Job Title Extraction (Sanitize to prevent duplicate name inside job title)
  let jobTitle = "";
  const roleKeywordsRegex = /\b(engineer|developer|architect|designer|lead|manager|consultant|analyst|specialist|scientist|administrator|associate|sde|intern|full stack|frontend|backend|devops|qa|programmer)\b/i;

  for (let i = 0; i < Math.min(cleanLines.length, 8); i++) {
    const line = cleanLines[i];
    if (line.includes("@") || line.includes("http") || line.includes("github.com") || line.includes("linkedin.com")) continue;
    if (isHeadingLine(line)) continue;

    if (roleKeywordsRegex.test(line)) {
      // Remove candidate's name if accidentally prepended in title line
      let sanitized = line;
      if (name && name !== "Candidate Name") {
        sanitized = sanitized.replace(new RegExp(`\\b${escapeRegExp(name)}\\b`, 'gi'), '');
      }
      sanitized = sanitized.replace(/^[|•–—:\s,]+|[|•–—:\s,]+$/g, '').trim();

      // If line had pipes, grab the part containing the role keyword
      if (sanitized.includes('|')) {
        const parts = sanitized.split('|').map(p => p.trim());
        const matchingPart = parts.find(p => roleKeywordsRegex.test(p));
        if (matchingPart) sanitized = matchingPart;
      }

      if (sanitized && sanitized.length > 3 && sanitized.length < 50) {
        jobTitle = sanitized;
        break;
      }
    }
  }
  if (!jobTitle) jobTitle = "Professional";

  // 8. Location Extraction (Clean and strictly extract valid city/country without trailing URLs)
  let location = "";
  // Check top 12 lines for location
  for (let i = 0; i < Math.min(cleanLines.length, 12); i++) {
    const line = cleanLines[i];
    if (isHeadingLine(line)) continue;

    const locPattern = /\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2,}|India|USA|UK|Canada|Germany|France|Singapore|Australia|UAE|[A-Z][a-zA-Z]+))\b/;
    const locMatch = line.match(locPattern);
    if (locMatch) {
      let candidateLoc = locMatch[1].trim();
      // Strip anything with github, linkedin, http, or trailing pipes
      candidateLoc = candidateLoc.replace(/(github|linkedin|http|www).*/i, '').replace(/[|•–—]+$/, '').trim();
      if (candidateLoc.length > 3 && !candidateLoc.includes("University") && !candidateLoc.includes("School")) {
        location = candidateLoc;
        break;
      }
    }

    // Direct check for major Indian/Global tech hubs
    const cityMatch = line.match(/\b(New Delhi|Delhi|Bengaluru|Bangalore|Noida|Gurgaon|Gurugram|Mumbai|Hyderabad|Pune|Chennai|Kolkata|San Francisco|New York|London|Seattle|Austin|Boston|Remote)\b/i);
    if (cityMatch && !location) {
      location = cityMatch[1];
      if (/delhi|bengaluru|bangalore|noida|gurgaon|gurugram|mumbai|hyderabad|pune|chennai/i.test(location)) {
        location += ", India";
      }
    }
  }

  // 9. Split Document into Sections
  const sections = splitIntoSections(cleanLines);

  // Extract Summary
  let summary = sections["summary"] || "";
  if (!summary && cleanLines.length > 2) {
    const earlyParagraph = cleanLines.slice(2, 6).find(l => l.length > 60 && !l.includes("@") && !l.includes("http") && !isHeadingLine(l));
    if (earlyParagraph) summary = earlyParagraph;
  }

  // Extract Section Content
  const experience = parseExperienceSection(sections["experience"] || []);
  const education = parseEducationSection(sections["education"] || []);
  const skills = parseSkillsSection(sections["skills"] || []);
  const projects = parseProjectsSection(sections["projects"] || []);
  const languages = parseLanguagesSection(sections["languages"] || []);
  const certifications = parseCertificationsSection(sections["certifications"] || []);

  return {
    personalDetails: {
      fullName: name,
      jobTitle: jobTitle,
      email: email,
      phone: phone,
      location: location || "Remote / Onsite",
      website: website,
      linkedin: linkedin,
      github: github,
      photoUrl: ""
    },
    summary: summary || "Results-driven professional with proven expertise in building high-performance systems and delivering scalable software solutions.",
    sectionsOrder: DEFAULT_SECTIONS_ORDER,
    sectionsVisibility: DEFAULT_SECTIONS_VISIBILITY,
    experience: experience.length > 0 ? experience : [
      {
        id: `exp-${Date.now()}`,
        company: "Previous Enterprise Corp",
        position: jobTitle || "Software Engineer",
        location: location || "Remote / Onsite",
        startDate: "2021",
        endDate: "Present",
        current: true,
        description: "• Architected high-throughput applications and microservices.\n• Streamlined delivery pipelines, reducing deployment latency by 35%.\n• Collaborated with cross-functional product teams to deliver key roadmap features."
      }
    ],
    education: education.length > 0 ? education : [
      {
        id: `edu-${Date.now()}`,
        institution: "University Institute",
        degree: "Bachelor of Technology",
        location: location || "Campus",
        startDate: "2017",
        endDate: "2021",
        grade: "First Class with Distinction"
      }
    ],
    skills: skills.length > 0 ? skills : [
      { category: "Technical Skills", items: "JavaScript, TypeScript, React, Node.js, Python, SQL" },
      { category: "Tools & Frameworks", items: "Git, Docker, AWS, Tailwind CSS, REST APIs" }
    ],
    projects: projects,
    certifications: certifications,
    languages: languages.length > 0 ? languages : [{ id: "lang-1", language: "English", proficiency: "Fluent" }],
    customSections: []
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isHeadingLine(line) {
  const norm = line.replace(/^[#*•\-_=~|\s]+|[#*•\-_=~|\s]+$/g, '').toUpperCase().trim();
  return /^(SUMMARY|PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY|PROFILE|ABOUT ME|EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT|EMPLOYMENT HISTORY|EDUCATION|ACADEMIC BACKGROUND|ACADEMICS|QUALIFICATIONS|SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|EXPERTISE|PROJECTS|KEY PROJECTS|PERSONAL PROJECTS|CERTIFICATIONS|CERTIFICATES|LICENSES & CERTIFICATIONS|LANGUAGES)$/.test(norm);
}

function splitIntoSections(lines) {
  const sections = {};
  let currentKey = "intro";

  lines.forEach(line => {
    const norm = line.replace(/^[#*•\-_=~|\s]+|[#*•\-_=~|\s]+$/g, '').toUpperCase().trim();

    if (/^(SUMMARY|PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY|PROFILE|ABOUT ME)$/.test(norm)) {
      currentKey = "summary";
      sections[currentKey] = [];
    } else if (/^(EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT|EMPLOYMENT HISTORY|WORK HISTORY)$/.test(norm)) {
      currentKey = "experience";
      sections[currentKey] = [];
    } else if (/^(EDUCATION|ACADEMIC BACKGROUND|ACADEMICS|QUALIFICATIONS)$/.test(norm)) {
      currentKey = "education";
      sections[currentKey] = [];
    } else if (/^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|EXPERTISE|SKILLS & ABILITIES)$/.test(norm)) {
      currentKey = "skills";
      sections[currentKey] = [];
    } else if (/^(PROJECTS|KEY PROJECTS|PERSONAL PROJECTS|FEATURED PROJECTS)$/.test(norm)) {
      currentKey = "projects";
      sections[currentKey] = [];
    } else if (/^(CERTIFICATIONS|CERTIFICATES|LICENSES & CERTIFICATIONS)$/.test(norm)) {
      currentKey = "certifications";
      sections[currentKey] = [];
    } else if (/^(LANGUAGES|LANGUAGE PROFICIENCY)$/.test(norm)) {
      currentKey = "languages";
      sections[currentKey] = [];
    } else {
      if (!sections[currentKey]) sections[currentKey] = [];
      sections[currentKey].push(line);
    }
  });

  if (sections["summary"]) {
    sections["summary"] = sections["summary"].join(" ").slice(0, 600);
  }

  return sections;
}

// Helper to join wrapped lines that belong to bullet points or sentences
function consolidateWrappedLines(lines) {
  const consolidated = [];
  const DATE_RANGE_REGEX = /(?:(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)|\d{1,2}\/\d{4})\.?\s*(?:[0-9]{4})?\s*(?:–|-|—|to)\s*(?:Present|Current|Ongoing|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)|\d{1,2}\/\d{4})\.?\s*(?:[0-9]{4})?|\d{4}))|\b(?:19\d{2}|20\d{2})\s*(?:–|-|—|to)\s*(?:Present|Current|19\d{2}|20\d{2})\b)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const isBullet = /^[•\-*▪▫–]/.test(line);
    const hasDate = DATE_RANGE_REGEX.test(line);
    const isHeading = isHeadingLine(line);

    if (consolidated.length > 0) {
      const prevLine = consolidated[consolidated.length - 1];
      const prevIsBullet = /^[•\-*▪▫–]/.test(prevLine);

      // If previous line was a bullet, and current line:
      // - does NOT start with a bullet
      // - does NOT have a date range
      // - is NOT a section heading
      // - does NOT look like a new job header (check if line + next line has date)
      const nextHasDate = i + 1 < lines.length && DATE_RANGE_REGEX.test(lines[i + 1]);
      if (prevIsBullet && !isBullet && !hasDate && !isHeading && !nextHasDate) {
        if (prevLine.endsWith('-')) {
          consolidated[consolidated.length - 1] = prevLine + line;
        } else {
          consolidated[consolidated.length - 1] = prevLine + " " + line;
        }
        continue;
      }
    }

    consolidated.push(line);
  }

  return consolidated;
}

// Multi-line chunking parser for work experience
function parseExperienceSection(rawLines) {
  if (!rawLines || rawLines.length === 0) return [];

  const lines = consolidateWrappedLines(rawLines);

  // Date range regex matching:
  // "May 2021 – Present", "05/2021 - Present", "2021 - Present", "03/2024 – 09/2025", "12/2021 – 02/2024"
  const DATE_RANGE_REGEX = /(?:(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)|\d{1,2}\/\d{4})\.?\s*(?:[0-9]{4})?\s*(?:–|-|—|to)\s*(?:Present|Current|Ongoing|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)|\d{1,2}\/\d{4})\.?\s*(?:[0-9]{4})?|\d{4}))|\b(?:19\d{2}|20\d{2})\s*(?:–|-|—|to)\s*(?:Present|Current|19\d{2}|20\d{2})\b)/i;

  const ROLE_KEYWORDS = /\b(engineer|developer|architect|designer|lead|manager|consultant|analyst|specialist|scientist|administrator|associate|sde|intern|full stack|frontend|backend|devops|qa|programmer|cto|vp|director|founder|co-founder)\b/i;

  const entries = [];
  let currentEntry = null;
  let pendingHeaderLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const hasDate = DATE_RANGE_REGEX.test(line);
    const nextHasDate = i + 1 < lines.length && DATE_RANGE_REGEX.test(lines[i + 1]);
    const isBullet = /^[•\-*▪▫–]/.test(line);

    // Check if this line is part of a job header:
    // It's a header if it contains a date OR (it's not a bullet and the next line has a date)
    const isHeaderLine = hasDate || (!isBullet && nextHasDate);

    if (isHeaderLine) {
      // If we have an existing entry that was being populated, this new header line signals a NEW JOB!
      if (currentEntry) {
        entries.push(currentEntry);
        currentEntry = null;
        pendingHeaderLines = [];
      }

      pendingHeaderLines.push(line);

      // If this line has the date range (header is complete):
      if (hasDate) {
        currentEntry = createExperienceEntry(pendingHeaderLines);
        pendingHeaderLines = [];
      }
    } else {
      // Description / bullet line
      if (!currentEntry && pendingHeaderLines.length > 0) {
        currentEntry = createExperienceEntry(pendingHeaderLines);
        pendingHeaderLines = [];
      }

      if (currentEntry) {
        let cleanText = line.replace(/^[•\-*▪▫–\s]+/, '').trim();

        // If this line ends with a location like "| Gurgaon" or "| Noida", and currentEntry.location is default or empty:
        const locTrailingMatch = cleanText.match(/\|\s*([A-Za-z\s]+(?:,\s*[A-Za-z\s]+)?)$/);
        if (locTrailingMatch && (!currentEntry.location || currentEntry.location === "Remote / Onsite")) {
          const locCandidate = locTrailingMatch[1].trim();
          if (locCandidate.length < 30) {
            currentEntry.location = locCandidate;
            cleanText = cleanText.replace(/\|\s*[A-Za-z\s]+(?:,\s*[A-Za-z\s]+)?$/, '').trim();
          }
        }

        if (cleanText) {
          if (isBullet) {
            currentEntry.description += (currentEntry.description ? "\n" : "") + `• ${cleanText}`;
          } else {
            // Continuation or paragraph
            if (currentEntry.description.length > 0 && !currentEntry.description.endsWith('\n')) {
              currentEntry.description += " " + cleanText;
            } else {
              currentEntry.description += (currentEntry.description ? "\n" : "") + cleanText;
            }
          }
        }
      }
    }
  }

  // Push last entry
  if (currentEntry) {
    entries.push(currentEntry);
  } else if (pendingHeaderLines.length > 0) {
    entries.push(createExperienceEntry(pendingHeaderLines));
  }

  return entries.filter(e => e.company || e.position);

  function createExperienceEntry(headerLines) {
    let startDate = "2021";
    let endDate = "Present";
    let current = true;
    let location = "";

    const cleanedLines = [];

    headerLines.forEach(hLine => {
      let lineText = hLine;

      // Extract Dates
      const dateMatch = lineText.match(DATE_RANGE_REGEX);
      if (dateMatch) {
        const rawDate = dateMatch[0].trim();
        const dateParts = rawDate.split(/(?:–|-|—|to)/).map(d => d.trim());
        if (dateParts[0]) startDate = dateParts[0];
        if (dateParts[1]) {
          endDate = dateParts[1];
          current = /present|current|ongoing/i.test(endDate);
        }
        lineText = lineText.replace(rawDate, '').trim();
      }

      // Extract Location
      const locMatch = lineText.match(/\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2,}|India|USA|UK|Canada|Remote|Hybrid|Onsite|[A-Z][a-zA-Z]+))\b/) ||
                         lineText.match(/\b(New Delhi|Delhi|Bengaluru|Bangalore|Noida|Gurgaon|Gurugram|Mumbai|Hyderabad|Pune|Chennai|San Francisco|New York|London|Remote|Hybrid|Onsite)\b/i);
      if (locMatch) {
        location = locMatch[0].trim();
        lineText = lineText.replace(locMatch[0], '').trim();
      }

      lineText = lineText.replace(/^[|•–—:\s,]+|[|•–—:\s,]+$/g, '').trim();
      if (lineText) cleanedLines.push(lineText);
    });

    // Breakdown into distinct chunks (Position & Company)
    const combined = cleanedLines.join(" | ");
    const rawChunks = combined.split(/(?:\s+[|–—]\s+|[|–—,]|\s+-\s+|\s+(?:at|@)\s+)/i)
      .map(c => c.trim().replace(/^[|•–—:\s,]+|[|•–—:\s,]+$/g, ''))
      .filter(Boolean);

    let position = "";
    let company = "";

    if (rawChunks.length === 1) {
      if (ROLE_KEYWORDS.test(rawChunks[0])) {
        position = rawChunks[0];
      } else {
        company = rawChunks[0];
      }
    } else if (rawChunks.length >= 2) {
      const roleIdx = rawChunks.findIndex(c => ROLE_KEYWORDS.test(c));
      if (roleIdx !== -1) {
        position = rawChunks[roleIdx];
        const remaining = rawChunks.filter((_, idx) => idx !== roleIdx);
        company = remaining.join(" ");
      } else {
        company = rawChunks[0];
        position = rawChunks[1];
      }
    }

    if (position && company) {
      company = company.replace(new RegExp(`\\b${escapeRegExp(position)}\\b`, 'gi'), '').replace(/^[|•–—:\s,]+|[|•–—:\s,]+$/g, '').trim();
    }

    return {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      company: company || "Enterprise Organization",
      position: position || "Software Engineer",
      location: location || "Remote / Onsite",
      startDate: startDate,
      endDate: current ? "Present" : endDate,
      current: current,
      description: ""
    };
  }
}

// Multi-line chunking parser for Education
function parseEducationSection(rawLines) {
  if (!rawLines || rawLines.length === 0) return [];
  const lines = consolidateWrappedLines(rawLines);
  const entries = [];

  const DEGREE_REGEX = /\b(bachelor|master|b\.?tech|m\.?tech|b\.?e|m\.?e|b\.?s|m\.?s|bca|mca|b\.?sc|m\.?sc|ph\.?d|doctorate|diploma|associate|higher secondary|secondary|high school|computer science|information technology)\b/i;
  const INSTITUTION_REGEX = /\b(university|college|institute|school|academy|polytechnic|vidyalaya|campus|iit|nit|iiit|bits)\b/i;
  const DATE_REGEX = /\b(20\d{2}|19\d{2})\s*(?:–|-|—|to)\s*(20\d{2}|19\d{2}|Present)\b/;

  let pendingEduLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const hasDate = DATE_REGEX.test(line);
    const hasInst = INSTITUTION_REGEX.test(line);
    const hasDegree = DEGREE_REGEX.test(line);

    if (hasInst || hasDegree || hasDate) {
      pendingEduLines.push(line);
      if (pendingEduLines.length >= 2 || (hasDate && (hasInst || hasDegree))) {
        entries.push(createEducationEntry(pendingEduLines));
        pendingEduLines = [];
      }
    } else if (pendingEduLines.length > 0) {
      pendingEduLines.push(line);
      entries.push(createEducationEntry(pendingEduLines));
      pendingEduLines = [];
    }
  }

  if (pendingEduLines.length > 0) {
    entries.push(createEducationEntry(pendingEduLines));
  }

  return entries;

  function createEducationEntry(eduLines) {
    let institution = "";
    let degree = "";
    let startDate = "2017";
    let endDate = "2021";
    let grade = "";
    let location = "";

    eduLines.forEach(l => {
      // Date extraction
      const dateMatch = l.match(DATE_REGEX);
      if (dateMatch) {
        startDate = dateMatch[1];
        endDate = dateMatch[2];
        l = l.replace(dateMatch[0], '');
      }

      // Grade extraction
      const gradeMatch = l.match(/(?:cgpa|gpa|percentage|score|marks|grade)?\s*[:=]?\s*(\d{1,2}(?:\.\d{1,2})?\s*(?:\/\s*(?:10|4|100))?|\d{1,2}\.?\d*%)/i);
      if (gradeMatch && gradeMatch[0].length < 15) {
        grade = gradeMatch[0].trim();
        l = l.replace(gradeMatch[0], '');
      }

      // Location extraction
      const locMatch = l.match(/\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2,}|India|USA|UK|[A-Z][a-zA-Z]+))\b/);
      if (locMatch) {
        location = locMatch[0].trim();
        l = l.replace(locMatch[0], '');
      }

      const parts = l.split(/[|–—]/).map(p => p.trim()).filter(Boolean);
      parts.forEach(p => {
        if (INSTITUTION_REGEX.test(p) && !institution) {
          institution = p;
        } else if (DEGREE_REGEX.test(p) && !degree) {
          degree = p;
        } else if (!institution) {
          institution = p;
        } else if (!degree) {
          degree = p;
        }
      });
    });

    return {
      id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      institution: institution || "State University Institute",
      degree: degree || "Bachelor's Degree",
      location: location || "Campus",
      startDate: startDate,
      endDate: endDate,
      grade: grade
    };
  }
}

// Skills section parser
function parseSkillsSection(lines) {
  if (!lines || lines.length === 0) return [];
  const categories = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      const category = parts[0].replace(/^[•\-*▪▫–\s]+/, '').trim();
      const items = parts.slice(1).join(':').trim();
      if (category && items) {
        categories.push({ category, items });
      }
    } else if (trimmed.includes(',')) {
      categories.push({
        category: categories.length === 0 ? "Technical Skills" : "Core Technologies",
        items: trimmed.replace(/^[•\-*▪▫–\s]+/, '').trim()
      });
    }
  });

  if (categories.length === 0 && lines.length > 0) {
    categories.push({
      category: "Technical & Core Skills",
      items: lines.join(", ")
    });
  }

  return categories;
}

// Projects section parser
function parseProjectsSection(lines) {
  if (!lines || lines.length === 0) return [];
  const projects = [];
  let currentProject = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');

    if (!isBullet && line.length < 75) {
      const parts = line.split(/[|–—]/).map(p => p.trim());
      const title = parts[0];
      const tech = parts[1] || "";

      currentProject = {
        id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: title,
        tech: tech,
        link: "",
        github: "",
        date: "2023",
        description: ""
      };
      projects.push(currentProject);
    } else if (currentProject) {
      if (line.includes('github.com')) {
        const ghMatch = line.match(/(?:https?:\/\/)?github\.com\/[^\s|]+/i);
        if (ghMatch) currentProject.github = ghMatch[0];
      } else if (line.startsWith('http')) {
        currentProject.link = line.split(' ')[0];
      } else {
        const cleanBullet = isBullet ? line : `• ${line}`;
        currentProject.description += (currentProject.description ? "\n" : "") + cleanBullet;
      }
    }
  }

  return projects;
}

// Certifications parser
function parseCertificationsSection(lines) {
  if (!lines || lines.length === 0) return [];
  const certs = [];

  lines.forEach(line => {
    const clean = line.replace(/^[•\-*▪▫–\s]+/, '').trim();
    if (!clean) return;

    const dateMatch = clean.match(/\b(20\d{2}|19\d{2})\b/);
    const date = dateMatch ? dateMatch[0] : "";
    const withoutDate = clean.replace(date, '').trim();

    const parts = withoutDate.split(/[|–—]/).map(p => p.trim()).filter(Boolean);
    certs.push({
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: parts[0] || clean,
      issuer: parts[1] || "",
      date: date,
      credentialUrl: ""
    });
  });

  return certs;
}

// Languages parser
function parseLanguagesSection(lines) {
  if (!lines || lines.length === 0) return [];
  const langs = [];
  const known = ["English", "Hindi", "Spanish", "French", "German", "Mandarin", "Japanese", "Russian", "Arabic", "Portuguese"];

  const text = lines.join(" ");
  known.forEach(k => {
    if (new RegExp(`\\b${k}\\b`, 'i').test(text)) {
      langs.push({
        id: `lang-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        language: k,
        proficiency: /native/i.test(text) && new RegExp(k, 'i').test(text) ? "Native" : "Fluent"
      });
    }
  });

  return langs;
}

function getDefaultEmptyResume(fileName) {
  return {
    personalDetails: {
      fullName: fileName ? fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : "Candidate Name",
      jobTitle: "Software Engineer",
      email: "",
      phone: "",
      location: "San Francisco, CA",
      website: "",
      linkedin: "",
      github: "",
      photoUrl: ""
    },
    summary: "Dedicated and results-oriented professional with extensive technical knowledge and proven delivery success.",
    sectionsOrder: DEFAULT_SECTIONS_ORDER,
    sectionsVisibility: DEFAULT_SECTIONS_VISIBILITY,
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [{ id: "l-1", language: "English", proficiency: "Fluent" }],
    customSections: []
  };
}
