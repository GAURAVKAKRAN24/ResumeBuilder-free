// ATS Scoring & Plain-text formatting utilities

export function calculateAtsScore(resumeData) {
  let score = 0;
  const issues = [];
  const successes = [];

  const { 
    personalDetails = {}, 
    summary = "", 
    experience = [], 
    education = [], 
    skills = [] 
  } = resumeData || {};

  // 1. Personal Details (25 points)
  if (personalDetails.fullName?.trim()) {
    score += 5;
    successes.push("Full Name provided");
  } else {
    issues.push("Missing Full Name");
  }

  if (personalDetails.jobTitle?.trim()) {
    score += 5;
    successes.push("Professional target title included");
  } else {
    issues.push("Target Job Title missing");
  }

  if (personalDetails.email?.includes("@")) {
    score += 5;
    successes.push("Valid email address found");
  } else {
    issues.push("Valid email required");
  }

  if (personalDetails.phone?.trim()) {
    score += 5;
    successes.push("Contact phone number provided");
  } else {
    issues.push("Phone number missing");
  }

  if (personalDetails.location?.trim()) {
    score += 5;
    successes.push("Location (City/State) present");
  } else {
    issues.push("Location missing (ATS looks for geographic match)");
  }

  // 2. Professional Summary (15 points)
  if (summary && summary.trim().length > 80) {
    score += 15;
    successes.push("Impactful professional summary provided");
  } else if (summary && summary.trim().length > 0) {
    score += 8;
    issues.push("Summary is brief - expand to 2-3 sentences with core strengths");
  } else {
    issues.push("Add a 2-3 sentence Professional Summary to pass initial screening");
  }

  // 3. Work Experience & Quantifiable Results (30 points)
  if (experience && experience.length > 0) {
    score += 15;
    successes.push(`${experience.length} work experience entries registered`);

    const fullExpText = experience.map(e => e.description || "").join(" ");
    const hasMetrics = /([0-9]+%|\$[0-9]+|[0-9]+k|[0-9]+\+)/i.test(fullExpText);
    const actionVerbs = /(architected|engineered|spearheaded|developed|increased|reduced|improved|led|delivered|streamlined|scaled)/i.test(fullExpText);

    if (hasMetrics) {
      score += 10;
      successes.push("Quantifiable metrics (%, $, numbers) detected in bullet points");
    } else {
      issues.push("Add measurable results (e.g. 'improved latency by 35%', 'managed $2M budget')");
    }

    if (actionVerbs) {
      score += 5;
      successes.push("Strong action verbs used");
    } else {
      issues.push("Begin bullet points with active verbs (e.g., Spearheaded, Engineered, Accelerated)");
    }
  } else {
    issues.push("Add at least one professional experience position");
  }

  // 4. Skills & Keywords (15 points)
  if (skills && skills.length > 0) {
    const totalSkillsCount = skills.reduce((acc, cat) => acc + (cat.items ? cat.items.split(",").length : 0), 0);
    if (totalSkillsCount >= 8) {
      score += 15;
      successes.push(`Strong keyword footprint with ${totalSkillsCount}+ categorized skills`);
    } else {
      score += 8;
      issues.push("Add more core technical/industry skills to match job descriptions");
    }
  } else {
    issues.push("Add a dedicated Skills section to boost keyword match");
  }

  // 5. Education (15 points)
  if (education && education.length > 0 && education[0].institution) {
    score += 15;
    successes.push("Verified degree and educational institution listed");
  } else {
    issues.push("Add your educational background or highest degree");
  }

  return {
    score: Math.min(score, 100),
    issues,
    successes
  };
}

export function generatePlainTextResume(resumeData) {
  const { 
    personalDetails = {}, 
    summary = "", 
    experience = [], 
    education = [], 
    skills = [], 
    projects = [], 
    certifications = [], 
    languages = [] 
  } = resumeData || {};

  let text = "";
  text += `${personalDetails.fullName || "Your Name"}\n`;
  if (personalDetails.jobTitle) text += `${personalDetails.jobTitle}\n`;
  text += `${[personalDetails.email, personalDetails.phone, personalDetails.location].filter(Boolean).join(" | ")}\n`;
  if (personalDetails.linkedin || personalDetails.github || personalDetails.website) {
    text += `${[personalDetails.linkedin, personalDetails.github, personalDetails.website].filter(Boolean).join(" | ")}\n`;
  }
  text += `\n${"=".repeat(40)}\n\n`;

  if (summary) {
    text += `PROFESSIONAL SUMMARY\n${"-".repeat(25)}\n${summary}\n\n`;
  }

  if (experience && experience.length > 0) {
    text += `WORK EXPERIENCE\n${"-".repeat(25)}\n`;
    experience.forEach(exp => {
      text += `${exp.position} - ${exp.company} (${exp.location || ""})\n`;
      text += `${exp.startDate} - ${exp.endDate || (exp.current ? "Present" : "")}\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += `\n`;
    });
  }

  if (education && education.length > 0) {
    text += `EDUCATION\n${"-".repeat(25)}\n`;
    education.forEach(edu => {
      text += `${edu.degree} - ${edu.institution} (${edu.location || ""})\n`;
      text += `${edu.startDate ? edu.startDate + " - " : ""}${edu.endDate || ""}\n`;
      if (edu.grade) text += `${edu.grade}\n`;
      text += `\n`;
    });
  }

  if (skills && skills.length > 0) {
    text += `TECHNICAL & PROFESSIONAL SKILLS\n${"-".repeat(25)}\n`;
    skills.forEach(s => {
      text += `${s.category}: ${s.items}\n`;
    });
    text += `\n`;
  }

  if (projects && projects.length > 0) {
    text += `KEY PROJECTS\n${"-".repeat(25)}\n`;
    projects.forEach(p => {
      text += `${p.title} (${p.tech || ""}) - ${p.date || ""}\n`;
      if (p.link) text += `Link: ${p.link}\n`;
      if (p.description) text += `${p.description}\n`;
      text += `\n`;
    });
  }

  if (certifications && certifications.length > 0) {
    text += `CERTIFICATIONS\n${"-".repeat(25)}\n`;
    certifications.forEach(c => {
      text += `${c.name} - ${c.issuer} (${c.date || ""})\n`;
    });
    text += `\n`;
  }

  if (languages && languages.length > 0) {
    text += `LANGUAGES\n${"-".repeat(25)}\n`;
    text += languages.map(l => `${l.language} (${l.proficiency})`).join(", ") + "\n";
  }

  return text;
}

