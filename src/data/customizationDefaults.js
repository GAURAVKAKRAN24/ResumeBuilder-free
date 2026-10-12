export const initialCustomization = {
  // Document Settings
  document: {
    language: "English (UK)",
    dateFormat: "MM/YYYY", // "DD/MM/YYYY" | "MM/YYYY" | "YYYY-MM" | "Month YYYY"
    pageFormat: "A4", // "A4" | "US Letter"
  },

  // Active Template
  templateId: "harvard-classic",

  // Layout Columns & Sections
  layout: {
    columns: "one", // "one" | "two-left" | "two-right" | "mix"
    sectionLayout: "full-width", // "full-width" | "columns"
    sidebarWidthPercent: 32, // for two-column templates
  },

  // Typography & Font Sizes
  fontSize: {
    baseFontSize: 10.5, // pt (slider: 9 to 13)
    fullNameOffset: 8, // +8pt
    professionalTitleOffset: 3.5, // +3.5pt
    sectionHeadingsOffset: 1, // +1pt
    entryHeaderOffset: 0, // +0pt
  },

  // Spacing & Margins
  spacing: {
    lineHeight: 1.3, // 1.15 to 1.6
    spaceElements: "normal", // "compact" | "normal" | "spacious"
    marginLR: 14, // mm (Left & Right Margin)
    marginTB: 16, // mm (Top & Bottom Margin)
  },

  // Entry Layout
  entryLayout: {
    structure: "full-width", // "full-width" | "columns"
    dateLocationPosition: "right", // "right" | "below-title"
    entryHeaderSplit: "auto", // "auto" | "manual"
    titleSubtitleRatio: 60, // 60%
    dateLocationRatio: 40, // 40%
    subtitlePlacement: "same-line", // "same-line" | "below-title"
    locationPlacement: "same-line", // "same-line" | "below-date"
  },

  // Section Headings
  sectionHeadings: {
    capitalization: "uppercase", // "capitalize" | "uppercase" | "normal"
    icons: "none", // "none" | "outline" | "filled"
    style: "bottom-line", // "bottom-line" | "left-bar" | "shaded" | "boxed" | "clean" | "double-line"
  },

  // Font Selection
  font: {
    bodyFont: "Inter", // "Roboto" | "Inter" | "Merriweather" | "EB Garamond" | "Lato" | "Poppins" | "Playfair Display" | "JetBrains Mono"
    nameFont: "same", // "same" | "serif" | "sans" | "playfair"
  },

  // Colors & Themes
  colors: {
    colorArea: "monochrome", // "full-page" | "header" | "border" | "accent" | "monochrome"
    paletteType: "monochrome", // "single" | "multi" | "monochrome"
    accentColor: "#000000", // Solid High-Contrast Black
    textColor: "#000000",
    bgColor: "#ffffff",
    applyAccentTo: {
      name: true,
      jobTitle: false,
      headings: true,
      headingsLine: true,
      headerIcons: true,
      dotsBars: true,
      dates: false,
      entryTitle: false,
      entrySubtitle: false,
      linkIcons: true,
    },
  },

  // Header Details (Harvard Classic Default: Center, Bullet, No-Frame)
  header: {
    textAlign: "center", // "left" | "center" | "right"
    detailsArrangement: "bullet", // "icon" | "bullet" | "bar" | "stacked"
    iconStyle: "no-frame", // "no-frame" | "circle-filled" | "rounded-filled" | "square-filled" | "circle-outline" | "rounded-outline" | "square-outline"
  },

  // Photo
  photo: {
    showPhoto: true, // Auto-displays cleanly when photoUrl is uploaded
    size: "medium", // "small" (36px) | "medium" (46px) | "large" (56px)
    shape: "circle", // "circle" | "rounded" | "square"
    filter: "color", // "color" | "grayscale"
    position: "left", // "left" | "right" | "center"
  },

  // Links
  links: {
    underline: false,
    blueColor: false,
    linkIcon: true,
  },

  // Footer
  footer: {
    pageNumbers: false,
    email: false,
    name: false,
  },
};

