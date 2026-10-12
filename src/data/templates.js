// 50+ Real Distinct ATS-Friendly Templates
// Curated for High ATS parse rates, zero non-standard clutter, clean typography, and balanced layouts

export const TEMPLATE_CATEGORIES = [
  "All",
  "Classic ATS",
  "Modern Clean",
  "Two Column",
  "Technical & SWE",
  "Executive & Leadership",
  "Academic & Research",
  "Compact 1-Page"
];

export const RESUME_TEMPLATES = [
  // 1. Classic ATS (1 - 8)
  {
    id: "harvard-classic",
    name: "Harvard Classic",
    category: "Classic ATS",
    description: "Standard Ivy League single-column serif layout trusted by Fortune 500 recruiters.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#000000", textColor: "#000000", colorArea: "monochrome", paletteType: "monochrome" },
      spacing: { lineHeight: 1.35, spaceElements: "normal", marginLR: 15, marginTB: 16 }
    }
  },
  {
    id: "wall-street-standard",
    name: "Wall Street Standard",
    category: "Classic ATS",
    description: "High-density investment banking & finance resume standard.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Merriweather", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#0f172a", colorArea: "accent" },
      spacing: { lineHeight: 1.25, spaceElements: "compact", marginLR: 12, marginTB: 14 }
    }
  },
  {
    id: "oxford-serif",
    name: "Oxford Scholar",
    category: "Classic ATS",
    description: "Timeless academic and consulting structure with elegant proportions.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "EB Garamond", nameFont: "playfair" },
      sectionHeadings: { capitalization: "capitalize", icons: "none", style: "clean" },
      header: { textAlign: "left", detailsArrangement: "stacked", iconStyle: "no-frame" },
      colors: { accentColor: "#334155", colorArea: "accent" },
      spacing: { lineHeight: 1.35, spaceElements: "normal", marginLR: 16, marginTB: 18 }
    }
  },
  {
    id: "traditional-legal",
    name: "Legal Counsel",
    category: "Classic ATS",
    description: "Rigorous, no-nonsense format tailored for law firms and regulatory agencies.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Merriweather", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "double-line" },
      header: { textAlign: "center", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#1e293b", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 16, marginTB: 16 }
    }
  },
  {
    id: "ivy-league-bold",
    name: "Ivy League Bold",
    category: "Classic ATS",
    description: "Strong header hierarchy with distinct role callouts.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "serif" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#1e3a8a", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "stanford-clean",
    name: "Stanford Clean",
    category: "Classic ATS",
    description: "West Coast tech-executive hybrid format balancing pedigree and clarity.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "circle-filled" },
      colors: { accentColor: "#881337", colorArea: "accent" },
      spacing: { lineHeight: 1.32, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "times-formal",
    name: "Times Formal",
    category: "Classic ATS",
    description: "Strict newspaper typography for government and diplomatic applications.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "EB Garamond", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#000000", colorArea: "monochrome" },
      spacing: { lineHeight: 1.25, spaceElements: "compact", marginLR: 14, marginTB: 14 }
    }
  },
  {
    id: "executive-serif",
    name: "Heritage Executive",
    category: "Classic ATS",
    description: "Warm, sophisticated typography for senior directors and advisory boards.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Merriweather", nameFont: "playfair" },
      sectionHeadings: { capitalization: "capitalize", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#292524", colorArea: "accent" },
      spacing: { lineHeight: 1.35, spaceElements: "normal", marginLR: 16, marginTB: 16 }
    }
  },

  // 2. Modern Clean (9 - 16)
  {
    id: "silicon-valley",
    name: "Silicon Valley Tech",
    category: "Modern Clean",
    description: "Engineered for rapid parsing by automated Greenhouse and Lever screening engines.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "outline", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "rounded-filled" },
      colors: { accentColor: "#2563eb", colorArea: "accent" },
      spacing: { lineHeight: 1.32, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "scandinavian-clean",
    name: "Nordic Minimal",
    category: "Modern Clean",
    description: "Generous whitespace, breathability, and crisp sans-serif geometry.",
    atsScore: 97,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Lato", nameFont: "same" },
      sectionHeadings: { capitalization: "capitalize", icons: "none", style: "clean" },
      header: { textAlign: "left", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#475569", colorArea: "accent" },
      spacing: { lineHeight: 1.4, spaceElements: "spacious", marginLR: 16, marginTB: 18 }
    }
  },
  {
    id: "metro-modern",
    name: "Metro Horizon",
    category: "Modern Clean",
    description: "Contemporary tech aesthetic with clean horizontal division accents.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "shaded" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "circle-outline" },
      colors: { accentColor: "#0f766e", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "pure-monochrome",
    name: "Pure Monochrome",
    category: "Modern Clean",
    description: "100% black and white stark minimalism. Guaranteed universal compatibility.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#000000", colorArea: "monochrome" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 15, marginTB: 15 }
    }
  },
  {
    id: "slate-minimal",
    name: "Slate Professional",
    category: "Modern Clean",
    description: "Sophisticated charcoal slate accents that pass any OCR parser effortlessly.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "capitalize", icons: "outline", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "rounded-filled" },
      colors: { accentColor: "#334155", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "swiss-typographic",
    name: "Swiss International",
    category: "Modern Clean",
    description: "Based on legendary International Typographic Style principles.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "stacked", iconStyle: "no-frame" },
      colors: { accentColor: "#1e293b", colorArea: "accent" },
      spacing: { lineHeight: 1.28, spaceElements: "compact", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "poppins-sleek",
    name: "Geometric Modern",
    category: "Modern Clean",
    description: "Clean geometric curves and modern friendly aura for SaaS & scaleups.",
    atsScore: 97,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Poppins", nameFont: "same" },
      sectionHeadings: { capitalization: "capitalize", icons: "filled", style: "clean" },
      header: { textAlign: "center", detailsArrangement: "icon", iconStyle: "circle-filled" },
      colors: { accentColor: "#4338ca", colorArea: "accent" },
      spacing: { lineHeight: 1.35, spaceElements: "normal", marginLR: 15, marginTB: 16 }
    }
  },
  {
    id: "horizon-sans",
    name: "Horizon Pro",
    category: "Modern Clean",
    description: "Balanced contrast designed for multi-disciplinary product professionals.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#1d4ed8", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },

  // 3. Two Column (17 - 24)
  {
    id: "compact-sidebar-left",
    name: "Left Rail Two-Column",
    category: "Two Column",
    description: "Key skills and contact details pinned left; extensive experience on right.",
    atsScore: 96,
    preset: {
      layout: { columns: "two-left", sectionLayout: "columns", sidebarWidthPercent: 32 },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "outline", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "stacked", iconStyle: "circle-filled" },
      colors: { accentColor: "#1e3a8a", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "compact-sidebar-right",
    name: "Right Rail Two-Column",
    category: "Two Column",
    description: "Chronological narrative on the left; certifications & education on the right.",
    atsScore: 96,
    preset: {
      layout: { columns: "two-right", sectionLayout: "columns", sidebarWidthPercent: 32 },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#0f766e", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "executive-split",
    name: "Executive 30/70",
    category: "Two Column",
    description: "High-level summary column paired with exhaustive career achievements.",
    atsScore: 95,
    preset: {
      layout: { columns: "two-left", sectionLayout: "columns", sidebarWidthPercent: 30 },
      font: { bodyFont: "EB Garamond", nameFont: "serif" },
      sectionHeadings: { capitalization: "capitalize", icons: "none", style: "clean" },
      header: { textAlign: "left", detailsArrangement: "stacked", iconStyle: "no-frame" },
      colors: { accentColor: "#1e293b", colorArea: "accent" },
      spacing: { lineHeight: 1.35, spaceElements: "normal", marginLR: 15, marginTB: 16 }
    }
  },
  {
    id: "balanced-two-col",
    name: "Dual Column Balanced",
    category: "Two Column",
    description: "Symmetric two-column division ideal for mid-level professionals.",
    atsScore: 95,
    preset: {
      layout: { columns: "two-left", sectionLayout: "columns", sidebarWidthPercent: 35 },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "shaded" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#334155", colorArea: "accent" },
      spacing: { lineHeight: 1.28, spaceElements: "compact", marginLR: 13, marginTB: 14 }
    }
  },
  {
    id: "sidebar-tinted-rail",
    name: "Tinted Left Accent",
    category: "Two Column",
    description: "Soft contrast rail highlighting competencies and proficiencies.",
    atsScore: 96,
    preset: {
      layout: { columns: "two-left", sectionLayout: "columns", sidebarWidthPercent: 32 },
      font: { bodyFont: "Lato", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "outline", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "circle-filled" },
      colors: { accentColor: "#1e3a8a", colorArea: "border" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "hybrid-header-split",
    name: "Hybrid Banner Split",
    category: "Two Column",
    description: "Full-width unified header atop an optimized two-column content grid.",
    atsScore: 97,
    preset: {
      layout: { columns: "mix", sectionLayout: "columns", sidebarWidthPercent: 33 },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "capitalize", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#2563eb", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "matrix-two-col",
    name: "Competency Matrix",
    category: "Two Column",
    description: "Technical matrix on sidebar; bulleted enterprise projects on main panel.",
    atsScore: 96,
    preset: {
      layout: { columns: "two-left", sectionLayout: "columns", sidebarWidthPercent: 34 },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#0f172a", colorArea: "accent" },
      spacing: { lineHeight: 1.28, spaceElements: "compact", marginLR: 13, marginTB: 14 }
    }
  },
  {
    id: "clean-duo",
    name: "Clean Duo Pro",
    category: "Two Column",
    description: "Minimalist two-column layout with light separator rules.",
    atsScore: 97,
    preset: {
      layout: { columns: "two-left", sectionLayout: "columns", sidebarWidthPercent: 30 },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "clean" },
      header: { textAlign: "left", detailsArrangement: "stacked", iconStyle: "no-frame" },
      colors: { accentColor: "#3b82f6", colorArea: "accent" },
      spacing: { lineHeight: 1.32, spaceElements: "normal", marginLR: 15, marginTB: 16 }
    }
  },

  // 4. Technical & SWE (25 - 32)
  {
    id: "full-stack-dev",
    name: "Full Stack Engineer",
    category: "Technical & SWE",
    description: "Engineered specifically for GitHub links, tech stack badges, and system design bullets.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "outline", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "rounded-filled" },
      colors: { accentColor: "#2563eb", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "compact", marginLR: 14, marginTB: 14 }
    }
  },
  {
    id: "devops-cloud",
    name: "DevOps & Cloud Architect",
    category: "Technical & SWE",
    description: "Highlights infrastructure credentials, containerization, and AWS/GCP certifications.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "square-filled" },
      colors: { accentColor: "#0284c7", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "code-terminal",
    name: "Monospace Engineer",
    category: "Technical & SWE",
    description: "Subtle JetBrains Mono styling for terminal-native developers.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "JetBrains Mono", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#0f172a", colorArea: "monochrome" },
      spacing: { lineHeight: 1.28, spaceElements: "compact", marginLR: 13, marginTB: 14 }
    }
  },
  {
    id: "data-scientist-pro",
    name: "Data Scientist & ML",
    category: "Technical & SWE",
    description: "Emphasis on quantitative impact, models deployed, and published benchmarks.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "capitalize", icons: "outline", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#0d9488", colorArea: "accent" },
      spacing: { lineHeight: 1.32, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "system-architect",
    name: "Principal Architect",
    category: "Technical & SWE",
    description: "High-level technical leadership format showcasing distributed systems governance.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "double-line" },
      header: { textAlign: "center", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#1e3a8a", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 15, marginTB: 16 }
    }
  },
  {
    id: "frontend-specialist",
    name: "Frontend UI/UX Dev",
    category: "Technical & SWE",
    description: "Clean aesthetic for UI engineers who value visual rhythm and accessibility.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "outline", style: "clean" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "circle-outline" },
      colors: { accentColor: "#6366f1", colorArea: "accent" },
      spacing: { lineHeight: 1.34, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "embedded-firmware",
    name: "Systems & C++ Specialist",
    category: "Technical & SWE",
    description: "Dense chronological format prioritizing low-level hardware and RTOS expertise.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#1e293b", colorArea: "accent" },
      spacing: { lineHeight: 1.25, spaceElements: "compact", marginLR: 13, marginTB: 14 }
    }
  },
  {
    id: "cybersecurity-analyst",
    name: "Cybersecurity & InfoSec",
    category: "Technical & SWE",
    description: "Clear grouping for CISSP certifications, compliance audits, and pen-testing.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "shaded" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "rounded-filled" },
      colors: { accentColor: "#047857", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },

  // 5. Executive & Leadership (33 - 40)
  {
    id: "chief-executive",
    name: "C-Suite Executive",
    category: "Executive & Leadership",
    description: "Authoritative, distinguished typography for CEO, CTO, and VP candidacies.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "EB Garamond", nameFont: "playfair" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#1e293b", colorArea: "accent" },
      spacing: { lineHeight: 1.35, spaceElements: "normal", marginLR: 16, marginTB: 18 }
    }
  },
  {
    id: "director-bold",
    name: "Senior Director",
    category: "Executive & Leadership",
    description: "Prominent title headers and quantifiable P&L revenue highlight styling.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#1e3a8a", colorArea: "accent" },
      spacing: { lineHeight: 1.32, spaceElements: "normal", marginLR: 15, marginTB: 16 }
    }
  },
  {
    id: "management-consultant",
    name: "Strategy Consultant",
    category: "Executive & Leadership",
    description: "McKinsey/Bain/BCG case-oriented resume framework focusing on business outcomes.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Merriweather", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#0f172a", colorArea: "accent" },
      spacing: { lineHeight: 1.28, spaceElements: "compact", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "corporate-vp",
    name: "Corporate VP",
    category: "Executive & Leadership",
    description: "Executive presentation with subtle navy accents and spacious line balance.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Lato", nameFont: "same" },
      sectionHeadings: { capitalization: "capitalize", icons: "outline", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "circle-filled" },
      colors: { accentColor: "#1e3a8a", colorArea: "accent" },
      spacing: { lineHeight: 1.35, spaceElements: "normal", marginLR: 15, marginTB: 16 }
    }
  },
  {
    id: "boardroom-prestige",
    name: "Boardroom Prestige",
    category: "Executive & Leadership",
    description: "Classic prestige serif tailored for advisory and governance boards.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "EB Garamond", nameFont: "playfair" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "double-line" },
      header: { textAlign: "center", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#334155", colorArea: "accent" },
      spacing: { lineHeight: 1.34, spaceElements: "normal", marginLR: 16, marginTB: 17 }
    }
  },
  {
    id: "strategic-advisor",
    name: "Strategic Advisor",
    category: "Executive & Leadership",
    description: "Clean modern corporate formatting for organizational transformation leaders.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "capitalize", icons: "none", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#475569", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "product-vp",
    name: "VP of Product",
    category: "Executive & Leadership",
    description: "Balances customer empathy and hard business KPIs with crisp typography.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "outline", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#0284c7", colorArea: "accent" },
      spacing: { lineHeight: 1.32, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },
  {
    id: "global-operations",
    name: "Global Operations Lead",
    category: "Executive & Leadership",
    description: "Structured efficiency for supply chain, logistics, and multi-region leads.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "shaded" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#0f172a", colorArea: "accent" },
      spacing: { lineHeight: 1.28, spaceElements: "compact", marginLR: 14, marginTB: 14 }
    }
  },

  // 6. Academic & Research (41 - 48)
  {
    id: "academic-cv",
    name: "Curriculum Vitae Standard",
    category: "Academic & Research",
    description: "Standard multi-page academic CV format for universities and grant committees.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "EB Garamond", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "stacked", iconStyle: "no-frame" },
      colors: { accentColor: "#111827", colorArea: "monochrome" },
      spacing: { lineHeight: 1.38, spaceElements: "normal", marginLR: 18, marginTB: 20 }
    }
  },
  {
    id: "scientific-researcher",
    name: "Scientific Researcher",
    category: "Academic & Research",
    description: "Optimized for publication records, peer reviews, and laboratory achievements.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Merriweather", nameFont: "same" },
      sectionHeadings: { capitalization: "capitalize", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#1e3a8a", colorArea: "accent" },
      spacing: { lineHeight: 1.35, spaceElements: "normal", marginLR: 16, marginTB: 17 }
    }
  },
  {
    id: "phd-fellowship",
    name: "PhD Fellowship",
    category: "Academic & Research",
    description: "Rigorous scholarly presentation for postdoctoral and fellowship applications.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "EB Garamond", nameFont: "playfair" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "clean" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#1f2937", colorArea: "accent" },
      spacing: { lineHeight: 1.36, spaceElements: "normal", marginLR: 16, marginTB: 18 }
    }
  },
  {
    id: "university-lecturer",
    name: "University Lecturer",
    category: "Academic & Research",
    description: "Highlights pedagogical tenure, syllabi design, and student outcomes.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Lato", nameFont: "serif" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#334155", colorArea: "accent" },
      spacing: { lineHeight: 1.32, spaceElements: "normal", marginLR: 15, marginTB: 16 }
    }
  },
  {
    id: "clinical-fellow",
    name: "Medical & Clinical Scholar",
    category: "Academic & Research",
    description: "Tailored for residency programs, board certifications, and clinical rotations.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#0284c7", colorArea: "accent" },
      spacing: { lineHeight: 1.28, spaceElements: "compact", marginLR: 14, marginTB: 14 }
    }
  },
  {
    id: "grant-proposal",
    name: "Research Grant Fellow",
    category: "Academic & Research",
    description: "Emphasizes funded initiatives, PI duties, and cross-institutional labs.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "EB Garamond", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "double-line" },
      header: { textAlign: "center", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#111827", colorArea: "monochrome" },
      spacing: { lineHeight: 1.32, spaceElements: "normal", marginLR: 16, marginTB: 16 }
    }
  },
  {
    id: "journal-author",
    name: "Published Author Format",
    category: "Academic & Research",
    description: "Clean citation-ready formatting for monographs and journal contributions.",
    atsScore: 98,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Merriweather", nameFont: "playfair" },
      sectionHeadings: { capitalization: "capitalize", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "stacked", iconStyle: "no-frame" },
      colors: { accentColor: "#292524", colorArea: "accent" },
      spacing: { lineHeight: 1.34, spaceElements: "normal", marginLR: 16, marginTB: 17 }
    }
  },
  {
    id: "postdoc-fellow",
    name: "Postdoctoral Fellow",
    category: "Academic & Research",
    description: "Compact academic template balancing teaching and laboratory findings.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "serif" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#1e3a8a", colorArea: "accent" },
      spacing: { lineHeight: 1.3, spaceElements: "normal", marginLR: 14, marginTB: 15 }
    }
  },

  // 7. Compact 1-Page (49 - 54)
  {
    id: "ultra-dense-1page",
    name: "Ultra-Dense 1-Page Max",
    category: "Compact 1-Page",
    description: "Engineered to fit 6+ years of dense experience into an exact single page without overflow.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#0f172a", colorArea: "accent" },
      spacing: { lineHeight: 1.2, spaceElements: "compact", marginLR: 10, marginTB: 10 }
    }
  },
  {
    id: "micro-spacing-pro",
    name: "Micro-Spacing Compact",
    category: "Compact 1-Page",
    description: "Tight letterforms, condensed margins, and sharp bullet formatting.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "shaded" },
      header: { textAlign: "left", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#1e293b", colorArea: "accent" },
      spacing: { lineHeight: 1.22, spaceElements: "compact", marginLR: 11, marginTB: 11 }
    }
  },
  {
    id: "concise-single-page",
    name: "Concise Single Page",
    category: "Compact 1-Page",
    description: "Optimal balance of brevity and modern clean hierarchy.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "outline", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "icon", iconStyle: "circle-filled" },
      colors: { accentColor: "#2563eb", colorArea: "accent" },
      spacing: { lineHeight: 1.25, spaceElements: "compact", marginLR: 12, marginTB: 12 }
    }
  },
  {
    id: "bullet-maximized",
    name: "Bullet-Maximized Action",
    category: "Compact 1-Page",
    description: "Focuses 80% of page real estate on high-impact metric action bullets.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Inter", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "left-bar" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#1e3a8a", colorArea: "accent" },
      spacing: { lineHeight: 1.24, spaceElements: "compact", marginLR: 12, marginTB: 12 }
    }
  },
  {
    id: "impact-metrics-dense",
    name: "High-Volume Career",
    category: "Compact 1-Page",
    description: "Designed for consultants with 20+ projects who need to summarize cleanly.",
    atsScore: 99,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "EB Garamond", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "center", detailsArrangement: "bullet", iconStyle: "no-frame" },
      colors: { accentColor: "#000000", colorArea: "monochrome" },
      spacing: { lineHeight: 1.22, spaceElements: "compact", marginLR: 11, marginTB: 11 }
    }
  },
  {
    id: "rapid-scan-recruit",
    name: "6-Second Rapid Scan",
    category: "Compact 1-Page",
    description: "Optimized for the infamous 6-second recruiter glance test.",
    atsScore: 100,
    preset: {
      layout: { columns: "one", sectionLayout: "full-width" },
      font: { bodyFont: "Roboto", nameFont: "same" },
      sectionHeadings: { capitalization: "uppercase", icons: "none", style: "bottom-line" },
      header: { textAlign: "left", detailsArrangement: "bar", iconStyle: "no-frame" },
      colors: { accentColor: "#1e293b", colorArea: "accent" },
      spacing: { lineHeight: 1.24, spaceElements: "compact", marginLR: 12, marginTB: 12 }
    }
  }
];

