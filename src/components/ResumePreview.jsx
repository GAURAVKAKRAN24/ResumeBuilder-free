import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ExternalLink,
  Calendar,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Languages as LangIcon,
  Sparkles
} from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from './Icons';
import { initialCustomization } from '../data/customizationDefaults';

export function ResumePreview({ resumeData, customization, zoom = 1, isThumbnail = false }) {
  const { 
    personalDetails = {}, 
    summary = "", 
    experience = [], 
    education = [], 
    skills = [], 
    projects = [], 
    certifications = [], 
    languages = [], 
    customSections = [], 
    sectionsOrder, 
    sectionsVisibility 
  } = resumeData || {};
  const safeCustomization = customization || initialCustomization;
  const {
    layout = initialCustomization.layout,
    fontSize = initialCustomization.fontSize,
    spacing = initialCustomization.spacing,
    entryLayout = initialCustomization.entryLayout,
    sectionHeadings = initialCustomization.sectionHeadings,
    font = initialCustomization.font,
    colors = initialCustomization.colors,
    header = initialCustomization.header,
    photo = initialCustomization.photo,
    links = initialCustomization.links,
    footer = initialCustomization.footer
  } = safeCustomization;

  // Font mapping
  const getFontFamily = (fontName) => {
    switch (fontName) {
      case "Roboto": return "'Roboto', sans-serif";
      case "Inter": return "'Inter', sans-serif";
      case "Merriweather": return "'Merriweather', serif";
      case "EB Garamond": return "'EB Garamond', serif";
      case "Lato": return "'Lato', sans-serif";
      case "Poppins": return "'Poppins', sans-serif";
      case "Playfair Display": return "'Playfair Display', serif";
      case "JetBrains Mono": return "'JetBrains Mono', monospace";
      default: return "'Inter', sans-serif";
    }
  };

  const bodyFontFamily = getFontFamily(font.bodyFont);
  const nameFontFamily = font.nameFont === "same" 
    ? bodyFontFamily 
    : font.nameFont === "serif" 
    ? "'EB Garamond', serif"
    : font.nameFont === "playfair"
    ? "'Playfair Display', serif"
    : "'Inter', sans-serif";

  // Spacing helper
  const elementGapClass = spacing.spaceElements === "compact" 
    ? "space-y-2.5" 
    : spacing.spaceElements === "spacious" 
    ? "space-y-5" 
    : "space-y-3.5";

  const entryGapClass = spacing.spaceElements === "compact"
    ? "space-y-2"
    : spacing.spaceElements === "spacious"
    ? "space-y-4"
    : "space-y-3";

  // Section Heading text transform
  const getHeadingText = (text) => {
    if (sectionHeadings.capitalization === "uppercase") return text.toUpperCase();
    if (sectionHeadings.capitalization === "capitalize") {
      return text.replace(/\b\w/g, l => l.toUpperCase());
    }
    return text;
  };

  // Icon styling helper
  const renderContactIcon = (IconComponent) => {
    const isAccent = colors.applyAccentTo?.headerIcons;
    const baseColor = isAccent ? colors.accentColor : '#64748b';

    if (header.iconStyle === "no-frame") {
      return (
        <span className="inline-flex items-center justify-center shrink-0 w-3.5 h-3.5 self-center leading-none transform translate-y-[0.75px]">
          <IconComponent className="w-3.5 h-3.5 block shrink-0" style={{ color: baseColor }} />
        </span>
      );
    }

    if (header.iconStyle === "circle-filled") {
      return (
        <span 
          className="w-4 h-4 rounded-full inline-flex items-center justify-center shrink-0 text-white self-center leading-none transform translate-y-[0.75px]"
          style={{ backgroundColor: baseColor }}
        >
          <IconComponent className="w-2.5 h-2.5 block shrink-0 text-white" />
        </span>
      );
    }

    if (header.iconStyle === "rounded-filled") {
      return (
        <span 
          className="w-4 h-4 rounded-md inline-flex items-center justify-center shrink-0 text-white self-center leading-none transform translate-y-[0.75px]"
          style={{ backgroundColor: baseColor }}
        >
          <IconComponent className="w-2.5 h-2.5 block shrink-0 text-white" />
        </span>
      );
    }

    if (header.iconStyle === "square-filled") {
      return (
        <span 
          className="w-4 h-4 rounded-none inline-flex items-center justify-center shrink-0 text-white self-center leading-none transform translate-y-[0.75px]"
          style={{ backgroundColor: baseColor }}
        >
          <IconComponent className="w-2.5 h-2.5 block shrink-0 text-white" />
        </span>
      );
    }

    if (header.iconStyle === "circle-outline") {
      return (
        <span 
          className="w-4 h-4 rounded-full inline-flex items-center justify-center shrink-0 border self-center leading-none transform translate-y-[0.75px]"
          style={{ borderColor: baseColor, color: baseColor }}
        >
          <IconComponent className="w-2.5 h-2.5 block shrink-0" />
        </span>
      );
    }

    if (header.iconStyle === "rounded-outline") {
      return (
        <span 
          className="w-4 h-4 rounded-md inline-flex items-center justify-center shrink-0 border self-center leading-none transform translate-y-[0.75px]"
          style={{ borderColor: baseColor, color: baseColor }}
        >
          <IconComponent className="w-2.5 h-2.5 block shrink-0" />
        </span>
      );
    }

    // square-outline default
    return (
      <span 
        className="w-4 h-4 rounded-none inline-flex items-center justify-center shrink-0 border self-center leading-none transform translate-y-[0.75px]"
        style={{ borderColor: baseColor, color: baseColor }}
      >
        <IconComponent className="w-2.5 h-2.5 block shrink-0" />
      </span>
    );
  };

  // Section Heading Divider renderer
  const renderSectionHeading = (title, IconComponent) => {
    const isColorHeadings = colors.applyAccentTo?.headings;
    const isColorLine = colors.applyAccentTo?.headingsLine;
    const headingColor = isColorHeadings ? colors.accentColor : '#0f172a';
    const lineColor = isColorLine ? colors.accentColor : '#cbd5e1';

    const iconNode = sectionHeadings.icons !== "none" && IconComponent && (
      <span 
        className="inline-flex items-center justify-center shrink-0 mr-2 self-center leading-none transform translate-y-[1px]" 
        style={{ color: headingColor }}
      >
        <IconComponent className="w-4 h-4 block shrink-0" />
      </span>
    );

    switch (sectionHeadings.style) {
      case "bottom-line":
        return (
          <div className="pb-1 mb-2 border-b" style={{ borderColor: lineColor, breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
            <h2
              className="font-bold tracking-tight inline-flex items-center leading-tight"
              style={{
                fontSize: `${fontSize.baseFontSize + fontSize.sectionHeadingsOffset}pt`,
                color: headingColor
              }}
            >
              {iconNode}
              <span className="self-center leading-tight">{getHeadingText(title)}</span>
            </h2>
          </div>
        );

      case "left-bar":
        return (
          <div className="mb-2 pl-2 border-l-4" style={{ borderColor: lineColor, breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
            <h2
              className="font-bold tracking-tight inline-flex items-center leading-tight"
              style={{
                fontSize: `${fontSize.baseFontSize + fontSize.sectionHeadingsOffset}pt`,
                color: headingColor
              }}
            >
              {iconNode}
              <span className="self-center leading-tight">{getHeadingText(title)}</span>
            </h2>
          </div>
        );

      case "shaded":
        return (
          <div 
            className="mb-2 px-2.5 py-1 rounded-sm"
            style={{ backgroundColor: `${colors.accentColor}15`, breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
          >
            <h2
              className="font-bold tracking-tight inline-flex items-center leading-tight"
              style={{
                fontSize: `${fontSize.baseFontSize + fontSize.sectionHeadingsOffset}pt`,
                color: headingColor
              }}
            >
              {iconNode}
              <span className="self-center leading-tight">{getHeadingText(title)}</span>
            </h2>
          </div>
        );

      case "boxed":
        return (
          <div className="mb-2 px-2 py-1 border rounded-xs" style={{ borderColor: lineColor, breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
            <h2
              className="font-bold tracking-tight inline-flex items-center leading-tight"
              style={{
                fontSize: `${fontSize.baseFontSize + fontSize.sectionHeadingsOffset}pt`,
                color: headingColor
              }}
            >
              {iconNode}
              <span className="self-center leading-tight">{getHeadingText(title)}</span>
            </h2>
          </div>
        );

      case "double-line":
        return (
          <div className="pb-1 mb-2 border-b-2 border-double" style={{ borderColor: lineColor, breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
            <h2
              className="font-bold tracking-tight inline-flex items-center leading-tight"
              style={{
                fontSize: `${fontSize.baseFontSize + fontSize.sectionHeadingsOffset}pt`,
                color: headingColor
              }}
            >
              {iconNode}
              <span className="self-center leading-tight">{getHeadingText(title)}</span>
            </h2>
          </div>
        );

      case "clean":
      default:
        return (
          <div className="mb-1.5" style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
            <h2
              className="font-bold tracking-tight inline-flex items-center leading-tight"
              style={{
                fontSize: `${fontSize.baseFontSize + fontSize.sectionHeadingsOffset}pt`,
                color: headingColor
              }}
            >
              {iconNode}
              <span className="self-center leading-tight">{getHeadingText(title)}</span>
            </h2>
          </div>
        );
    }
  };

  // Personal Header Component
  const renderHeader = () => {
    const isAlignLeft = header.textAlign === "left";
    const isAlignCenter = header.textAlign === "center";
    const isAlignRight = header.textAlign === "right";

    const nameColor = colors.applyAccentTo?.name ? colors.accentColor : '#0f172a';
    const jobTitleColor = colors.applyAccentTo?.jobTitle ? colors.accentColor : '#475569';

    // Contact items list
    const contactItems = [
      personalDetails.email && {
        icon: Mail,
        value: personalDetails.email,
        href: `mailto:${personalDetails.email}`
      },
      personalDetails.phone && {
        icon: Phone,
        value: personalDetails.phone,
        href: `tel:${personalDetails.phone}`
      },
      personalDetails.location && {
        icon: MapPin,
        value: personalDetails.location,
        href: null
      },
      personalDetails.website && {
        icon: Globe,
        value: personalDetails.website.replace(/^https?:\/\//, ''),
        href: personalDetails.website
      },
      personalDetails.linkedin && {
        icon: LinkedInIcon,
        value: personalDetails.linkedin.replace(/^https?:\/\//, ''),
        href: personalDetails.linkedin.startsWith('http') ? personalDetails.linkedin : `https://${personalDetails.linkedin}`
      },
      personalDetails.github && {
        icon: GitHubIcon,
        value: personalDetails.github.replace(/^https?:\/\//, ''),
        href: personalDetails.github.startsWith('http') ? personalDetails.github : `https://${personalDetails.github}`
      }
    ].filter(Boolean);

    // Photo element
    const photoNode = photo.showPhoto !== false && Boolean(personalDetails.photoUrl) && (
      <div 
        className={`shrink-0 overflow-hidden border border-slate-300 shadow-2xs aspect-square ${
          photo.shape === 'rounded' ? 'rounded-xl' : photo.shape === 'square' ? 'rounded-none' : 'rounded-full'
        } ${photo.filter === 'grayscale' ? 'grayscale contrast-125' : ''}`}
        style={{
          width: photo.size === 'small' ? '36px' : photo.size === 'large' ? '56px' : '46px',
          height: photo.size === 'small' ? '36px' : photo.size === 'large' ? '56px' : '46px',
          aspectRatio: '1 / 1',
        }}
      >
        <img 
          src={personalDetails.photoUrl} 
          alt={personalDetails.fullName || 'Profile'} 
          className="w-full h-full object-cover block" 
        />
      </div>
    );

    const hasHeaderContent = Boolean(
      personalDetails.fullName?.trim() || 
      personalDetails.jobTitle?.trim() || 
      contactItems.length > 0 || 
      photoNode
    );

    if (!hasHeaderContent) return null;

    return (
      <div className={`mb-4 pb-3 border-b border-slate-200/80 ${
        isAlignCenter ? 'text-center' : isAlignRight ? 'text-right' : 'text-left'
      }`}>
        <div className={`flex items-center gap-4 ${
          isAlignCenter ? 'flex-col justify-center' : isAlignRight ? 'flex-row-reverse justify-between' : 'justify-between'
        }`}>
          {isAlignCenter ? photoNode : (photo.position === 'left' && photoNode)}

          <div className="flex-1">
            {personalDetails.fullName && (
              <h1
                className="font-bold tracking-tight leading-none mb-1.5"
                style={{
                  fontFamily: nameFontFamily,
                  fontSize: `${fontSize.baseFontSize + fontSize.fullNameOffset}pt`,
                  color: nameColor
                }}
              >
                {personalDetails.fullName}
              </h1>
            )}

            {personalDetails.jobTitle && (
              <p
                className="font-medium tracking-normal mb-2.5"
                style={{
                  fontSize: `${fontSize.baseFontSize + fontSize.professionalTitleOffset}pt`,
                  color: jobTitleColor
                }}
              >
                {personalDetails.jobTitle}
              </p>
            )}

            {/* Contact Items Container */}
            <div className={`flex flex-wrap items-center gap-y-1.5 gap-x-3 text-slate-600 ${
              isAlignCenter ? 'justify-center' : isAlignRight ? 'justify-end' : 'justify-start'
            }`}>
              {contactItems.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={i} 
                    className="inline-flex items-center gap-1.5 leading-none"
                    style={{ fontSize: `${fontSize.baseFontSize - 1}pt` }}
                  >
                    <span className="inline-flex items-center justify-center shrink-0 self-center leading-none">
                      {renderContactIcon(IconComponent)}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`${links.underline ? 'underline' : 'no-underline'} ${
                          links.blueColor ? 'text-blue-700 hover:text-blue-900' : 'text-slate-700'
                        } inline-flex items-center gap-1 leading-none self-center`}
                      >
                        <span className="leading-none self-center">{item.value}</span>
                        {links.linkIcon && (
                          <span className="inline-flex items-center justify-center shrink-0 opacity-60 self-center leading-none transform translate-y-[0.75px]">
                            <ExternalLink className="w-2.5 h-2.5 block shrink-0" />
                          </span>
                        )}
                      </a>
                    ) : (
                      <span className="leading-none self-center text-slate-700">
                        {item.value}
                      </span>
                    )}
                    {header.detailsArrangement === "bullet" && i < contactItems.length - 1 && (
                      <span className="text-slate-400 text-xs ml-1 leading-none self-center transform translate-y-[0.75px]">•</span>
                    )}
                    {header.detailsArrangement === "bar" && i < contactItems.length - 1 && (
                      <span className="text-slate-300 text-xs ml-1 leading-none self-center transform translate-y-[0.75px]">|</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {!isAlignCenter && photo.position !== 'left' && photoNode}
        </div>
      </div>
    );
  };

  // Rich content formatter supporting markdown **bold**, *italic*, bullets and paragraphs
  const renderFormattedContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-1" />;

      const isBullet = /^[•\-*▪▫–]/.test(trimmed);
      const content = isBullet ? trimmed.replace(/^[•\-*▪▫–\s]+/, '') : trimmed;

      const formatInline = (str) => {
        const parts = [];
        let lastIndex = 0;
        const regex = /\*\*(.*?)\*\*|\*(.*?)\*/g;
        let match;

        while ((match = regex.exec(str)) !== null) {
          if (match.index > lastIndex) {
            parts.push(str.substring(lastIndex, match.index));
          }
          if (match[1] !== undefined) {
            parts.push(<strong key={match.index} className="font-semibold text-slate-900">{match[1]}</strong>);
          } else if (match[2] !== undefined) {
            parts.push(<em key={match.index}>{match[2]}</em>);
          }
          lastIndex = regex.lastIndex;
        }
        if (lastIndex < str.length) {
          parts.push(str.substring(lastIndex));
        }
        return parts.length > 0 ? parts : str;
      };

      if (isBullet) {
        return (
          <div key={idx} className="flex items-baseline gap-1.5 leading-relaxed">
            <span className="shrink-0 select-none text-slate-400">•</span>
            <span className="flex-1 text-slate-700">{formatInline(content)}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-slate-700 leading-relaxed mb-1">
          {formatInline(content)}
        </p>
      );
    });
  };

  // Section Renderers
  const renderSummary = () => {
    if (!summary || sectionsVisibility.summary === false) return null;
    return (
      <div key="summary" className="mb-3.5">
        {renderSectionHeading("Professional Summary", Sparkles)}
        <p 
          className="text-slate-700 leading-relaxed text-justify"
          style={{ fontSize: `${fontSize.baseFontSize}pt` }}
        >
          {summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    const validExperiences = (experience || []).filter(exp => 
      exp?.position?.trim() || 
      exp?.company?.trim() || 
      (exp?.description && exp.description.replace(/[•\s]/g, '').trim())
    );
    if (!validExperiences.length || sectionsVisibility.experience === false) return null;
    return (
      <div key="experience" className="mb-3.5">
        {renderSectionHeading("Work Experience", Briefcase)}
        <div className={entryGapClass}>
          {validExperiences.map(exp => (
            <div 
              key={exp.id} 
              className="relative avoid-break"
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
            >
              {/* Header row: Position & Company & Dates */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                <div className="font-bold text-slate-900 leading-snug" style={{ fontSize: `${fontSize.baseFontSize + fontSize.entryHeaderOffset}pt` }}>
                  <span style={{ color: colors.applyAccentTo?.entryTitle ? colors.accentColor : '#000000' }}>
                    {exp.position}
                  </span>
                  {exp.company && (
                    <span 
                      className="font-semibold text-slate-800 ml-1.5"
                      style={{ color: colors.applyAccentTo?.entrySubtitle ? colors.accentColor : '#1e293b' }}
                    >
                      • {exp.company}
                    </span>
                  )}
                </div>

                <div 
                  className="font-medium text-slate-700 whitespace-nowrap text-right shrink-0"
                  style={{ 
                    fontSize: `${fontSize.baseFontSize - 1}pt`,
                    color: colors.applyAccentTo?.dates ? colors.accentColor : '#334155'
                  }}
                >
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  {exp.location && ` | ${exp.location}`}
                </div>
              </div>

              {/* Formatted Descriptions (bullets or paragraphs with bold/italic) */}
              {exp.description && (
                <div 
                  className="mt-1 space-y-0.5"
                  style={{ fontSize: `${fontSize.baseFontSize - 0.5}pt` }}
                >
                  {renderFormattedContent(exp.description)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    const validEducation = (education || []).filter(edu => 
      edu?.degree?.trim() || 
      edu?.institution?.trim()
    );
    if (!validEducation.length || sectionsVisibility.education === false) return null;
    return (
      <div key="education" className="mb-3.5">
        {renderSectionHeading("Education", GraduationCap)}
        <div className={entryGapClass}>
          {validEducation.map(edu => (
            <div 
              key={edu.id} 
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between avoid-break"
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
            >
              <div>
                <div 
                  className="font-bold text-slate-900"
                  style={{ 
                    fontSize: `${fontSize.baseFontSize + fontSize.entryHeaderOffset}pt`,
                    color: colors.applyAccentTo?.entryTitle ? colors.accentColor : '#0f172a'
                  }}
                >
                  {edu.degree}
                </div>
                <div className="text-slate-700 font-medium" style={{ fontSize: `${fontSize.baseFontSize - 0.5}pt` }}>
                  {edu.institution} {edu.grade && `— ${edu.grade}`}
                </div>
              </div>

              <div 
                className="text-slate-500 font-medium whitespace-nowrap sm:text-right shrink-0"
                style={{ 
                  fontSize: `${fontSize.baseFontSize - 1}pt`,
                  color: colors.applyAccentTo?.dates ? colors.accentColor : '#64748b'
                }}
              >
                {edu.startDate ? `${edu.startDate} – ` : ""}{edu.endDate}
                {edu.location && ` | ${edu.location}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    const validSkills = (skills || []).filter(s => s?.items?.trim());
    if (!validSkills.length || sectionsVisibility.skills === false) return null;
    return (
      <div key="skills" className="mb-3.5 avoid-break" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        {renderSectionHeading("Technical & Core Skills", Wrench)}
        <div className="space-y-1.5" style={{ fontSize: `${fontSize.baseFontSize - 0.5}pt` }}>
          {validSkills.map((s, idx) => (
            <div key={idx} className="leading-snug">
              <span 
                className="font-bold text-slate-900"
                style={{ color: colors.applyAccentTo?.dotsBars ? colors.accentColor : '#000000' }}
              >
                {s.category}:{" "}
              </span>
              <span className="text-slate-900">{s.items}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const validProjects = (projects || []).filter(p => p?.title?.trim() || p?.description?.trim());
    if (!validProjects.length || sectionsVisibility.projects === false) return null;
    return (
      <div key="projects" className="mb-3.5">
        {renderSectionHeading("Key Projects", FolderGit2)}
        <div className={entryGapClass}>
          {validProjects.map(p => (
            <div 
              key={p.id}
              className="avoid-break"
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <div className="font-bold text-slate-900" style={{ fontSize: `${fontSize.baseFontSize + fontSize.entryHeaderOffset}pt` }}>
                  <span style={{ color: colors.applyAccentTo?.entryTitle ? colors.accentColor : '#0f172a' }}>
                    {p.title}
                  </span>
                  {p.tech && (
                    <span className="font-normal text-slate-600 text-xs ml-1.5 font-mono">
                      [{p.tech}]
                    </span>
                  )}
                </div>

                {p.date && (
                  <div className="text-slate-500 font-medium text-xs sm:text-right shrink-0">
                    {p.date}
                  </div>
                )}
              </div>

              {(p.link || p.github) && (
                <div className="text-xs text-blue-600 flex gap-3 mt-0.5 font-medium">
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                      <span>Live App</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                      <span>Repository</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              )}

              {p.description && (
                <div 
                  className="mt-1 space-y-0.5"
                  style={{ fontSize: `${fontSize.baseFontSize - 0.5}pt` }}
                >
                  {renderFormattedContent(p.description)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    const validCertifications = (certifications || []).filter(c => c?.name?.trim());
    if (!validCertifications.length || sectionsVisibility.certifications === false) return null;
    return (
      <div key="certifications" className="mb-3.5 avoid-break" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        {renderSectionHeading("Certifications & Licenses", Award)}
        <div className="space-y-1.5" style={{ fontSize: `${fontSize.baseFontSize - 0.5}pt` }}>
          {validCertifications.map(c => (
            <div key={c.id} className="flex justify-between items-baseline avoid-break" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div>
                <span className="font-bold text-slate-900">{c.name}</span>
                {c.issuer && <span className="text-slate-800 ml-1.5">— {c.issuer}</span>}
              </div>
              {c.date && <div className="text-slate-700 text-xs shrink-0">{c.date}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    const validLanguages = (languages || []).filter(l => l?.language?.trim());
    if (!validLanguages.length || sectionsVisibility.languages === false) return null;
    return (
      <div key="languages" className="mb-3.5 avoid-break" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        {renderSectionHeading("Languages", LangIcon)}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-900" style={{ fontSize: `${fontSize.baseFontSize - 0.5}pt` }}>
          {validLanguages.map(l => (
            <div key={l.id}>
              <span className="font-semibold text-slate-900">{l.language}</span>
              <span className="text-slate-700 text-xs ml-1">({l.proficiency})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Custom sections renderer
  const renderCustomSections = (customId) => {
    if (sectionsVisibility[customId] === false) return null;
    const item = (customSections || []).find(c => c.id === customId);
    if (!item) return null;
    const validItems = (item.items || []).filter(entry => entry?.title?.trim() || entry?.description?.trim());
    if (!validItems.length) return null;

    return (
      <div key={customId} className="mb-3.5 avoid-break" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
        {renderSectionHeading(item.title, Sparkles)}
        <div className={entryGapClass}>
          {validItems.map(entry => (
            <div key={entry.id} className="avoid-break" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="flex justify-between items-baseline font-bold text-slate-900" style={{ fontSize: `${fontSize.baseFontSize}pt` }}>
                <div>
                  <span>{entry.title}</span>
                  {entry.subtitle && <span className="font-normal text-slate-800 ml-1.5">— {entry.subtitle}</span>}
                </div>
                {entry.date && <span className="text-slate-700 text-xs">{entry.date}</span>}
              </div>
              {entry.description && (
                <div className="mt-1 space-y-0.5" style={{ fontSize: `${fontSize.baseFontSize - 0.5}pt` }}>
                  {renderFormattedContent(entry.description)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Section router based on sectionsOrder
  const renderSection = (key) => {
    switch (key) {
      case "summary": return renderSummary();
      case "experience": return renderExperience();
      case "education": return renderEducation();
      case "skills": return renderSkills();
      case "projects": return renderProjects();
      case "certifications": return renderCertifications();
      case "languages": return renderLanguages();
      default:
        if (key && key.startsWith("custom-")) {
          return renderCustomSections(key);
        }
        return null;
    }
  };

  // Safe sections order and visibility with defensive fallbacks
  const safeSectionsOrder = Array.isArray(sectionsOrder) && sectionsOrder.length > 0
    ? sectionsOrder
    : ["summary", "experience", "education", "skills", "projects", "certifications", "languages"];
  const safeSectionsVisibility = sectionsVisibility || {};

  // Two-column layout split helper
  const sidebarSectionKeys = ["skills", "education", "certifications", "languages"];
  const mainSectionKeys = safeSectionsOrder.filter(k => !sidebarSectionKeys.includes(k));
  const sidebarSections = safeSectionsOrder.filter(k => sidebarSectionKeys.includes(k));

  // Check whether resume has any user-entered content
  const hasAnyContent = Boolean(
    personalDetails?.fullName?.trim() ||
    personalDetails?.jobTitle?.trim() ||
    personalDetails?.photoUrl?.trim() ||
    personalDetails?.email?.trim() ||
    personalDetails?.phone?.trim() ||
    personalDetails?.location?.trim() ||
    summary?.trim() ||
    (experience && experience.some(e => e?.position?.trim() || e?.company?.trim())) ||
    (education && education.some(e => e?.degree?.trim() || e?.institution?.trim())) ||
    (skills && skills.some(s => s?.items?.trim())) ||
    (projects && projects.some(p => p?.title?.trim())) ||
    (certifications && certifications.some(c => c?.name?.trim())) ||
    (languages && languages.some(l => l?.language?.trim())) ||
    (customSections && customSections.length > 0)
  );

  const a4PaperCanvas = (
    <div
      {...(!isThumbnail ? { id: "resume-print-area" } : {})}
      className={`a4-paper ${
        isThumbnail
          ? "border-0 shadow-none pointer-events-none select-none"
          : "shadow-paper hover:shadow-paper-lg transition-shadow border border-slate-200"
      }`}
      style={{
        fontFamily: bodyFontFamily,
        color: colors.textColor || '#000000',
        lineHeight: spacing.lineHeight,
        paddingLeft: `${spacing.marginLR}mm`,
        paddingRight: `${spacing.marginLR}mm`,
        paddingTop: `${spacing.marginTB}mm`,
        paddingBottom: `${spacing.marginTB}mm`,
        ...(isThumbnail ? { width: '794px', minHeight: '1123px' } : {})
      }}
    >
      {/* Header */}
      {renderHeader()}

      {/* Body Content based on Layout mode */}
      {layout.columns === "one" && (
        <div className={elementGapClass}>
          {safeSectionsOrder.map(key => renderSection(key))}
        </div>
      )}

      {layout.columns === "two-left" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column (Skills, Edu, Certs, Langs) */}
          <div className="col-span-4 border-r border-slate-200 pr-5">
            {sidebarSections.map(key => renderSection(key))}
          </div>
          {/* Right Column (Summary, Experience, Projects) */}
          <div className="col-span-8 pl-1">
            {mainSectionKeys.map(key => renderSection(key))}
          </div>
        </div>
      )}

      {layout.columns === "two-right" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column (Summary, Experience, Projects) */}
          <div className="col-span-8 border-r border-slate-200 pr-5">
            {mainSectionKeys.map(key => renderSection(key))}
          </div>
          {/* Right Column (Skills, Edu, Certs, Langs) */}
          <div className="col-span-4 pl-1">
            {sidebarSections.map(key => renderSection(key))}
          </div>
        </div>
      )}

      {layout.columns === "mix" && (
        <div className="space-y-4">
          {renderSummary()}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 border-r border-slate-200 pr-5">
              {renderExperience()}
              {renderProjects()}
            </div>
            <div className="col-span-4 pl-1">
              {renderSkills()}
              {renderEducation()}
              {renderCertifications()}
              {renderLanguages()}
            </div>
          </div>
        </div>
      )}

      {/* Footer details */}
      {hasAnyContent && (footer.pageNumbers || footer.email || footer.name) && (
        <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
          <div>
            {footer.name && <span className="mr-3">{personalDetails.fullName}</span>}
            {footer.email && <span>{personalDetails.email}</span>}
          </div>
          {footer.pageNumbers && <span>Page 1 of 1</span>}
        </div>
      )}
    </div>
  );

  if (isThumbnail) {
    return a4PaperCanvas;
  }

  return (
    <div className="resume-outer-container w-full flex items-start justify-center overflow-auto p-4 sm:p-8">
      {/* Zoom transform container */}
      <div 
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out'
        }}
        className="resume-zoom-container shrink-0"
      >
        {a4PaperCanvas}
      </div>
    </div>
  );
}
