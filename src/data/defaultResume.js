export const initialResumeData = {
  personalDetails: {
    fullName: "Alex R. Morgan",
    jobTitle: "Senior Full Stack Software Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 349-8201",
    location: "San Francisco, CA",
    website: "https://alexmorgan.dev",
    linkedin: "linkedin.com/in/alexrmorgan",
    github: "github.com/alexmorgan-dev",
    photoUrl: "", // optional user photo
  },
  summary: "Results-driven Software Engineer with 6+ years of experience building high-scale distributed systems, microservices, and modern web applications. Proven track record of improving system latency by 35% and scaling microservices to 10M+ daily active users. Proficient in React, TypeScript, Node.js, and AWS.",
  sectionsOrder: ["summary", "experience", "education", "skills", "projects", "certifications", "languages"],
  sectionsVisibility: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
  },
  experience: [
    {
      id: "exp-1",
      company: "Stripe Technologies",
      position: "Senior Full Stack Engineer",
      location: "San Francisco, CA",
      startDate: "03/2022",
      endDate: "Present",
      current: true,
      description: "• Architected and shipped mission-critical checkout microservices processing $40M+ in weekly transaction volume with 99.99% uptime.\n• Spearheaded migration from legacy monolithic architecture to event-driven services on AWS (Lambda, SQS, DynamoDB), cutting operational costs by 28%.\n• Mentored 8 junior and mid-level software engineers across 2 cross-functional product squads, driving code review throughput up by 30%."
    },
    {
      id: "exp-2",
      company: "Datadog",
      position: "Software Engineer II",
      location: "New York, NY",
      startDate: "06/2019",
      endDate: "02/2022",
      current: false,
      description: "• Developed interactive visualization widgets in React/TypeScript, reducing dashboard load times by 42% for over 250k enterprise engineers.\n• Engineered high-throughput telemetry ingestion pipelines handling 150,000+ events per second using Kafka, Golang, and PostgreSQL.\n• Collaborated closely with Product Management and UX to implement automated end-to-end testing, reducing production incident rates by 18%."
    },
    {
      id: "exp-3",
      company: "NextGen Digital Labs",
      position: "Junior Frontend Developer",
      location: "Austin, TX",
      startDate: "08/2018",
      endDate: "05/2019",
      current: false,
      description: "• Built and deployed 15+ responsive client portals using React, Next.js, and Tailwind CSS.\n• Improved Core Web Vitals score across client portfolios from 68 to 96, increasing organic user conversion by 22%."
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      location: "Berkeley, CA",
      startDate: "08/2014",
      endDate: "05/2018",
      grade: "GPA: 3.86 / 4.0 (Dean's Honor List)"
    }
  ],
  skills: [
    { category: "Languages", items: "TypeScript, JavaScript (ES6+), Python, Go, SQL, HTML5, CSS3" },
    { category: "Frontend", items: "React, Next.js, Redux Toolkit, Tailwind CSS, Vite, Webpack, Responsive Design" },
    { category: "Backend & Cloud", items: "Node.js, Express, PostgreSQL, Redis, MongoDB, AWS (EC2, S3, Lambda), Docker, CI/CD" },
    { category: "Tools & Methodologies", items: "Git, Agile/Scrum, Jest, Cypress, Microservices, REST APIs, GraphQL, System Design" }
  ],
  projects: [
    {
      id: "proj-1",
      title: "CloudPulse - Multi-Cloud Metrics Monitor",
      tech: "React, Node.js, WebSockets, Docker, InfluxDB",
      link: "https://cloudpulse.io",
      github: "https://github.com/alexmorgan-dev/cloudpulse",
      date: "2023",
      description: "• Open-source monitoring tool with 1,200+ GitHub stars; collects real-time node health data across AWS, GCP, and Azure.\n• Designed low-overhead WebSocket telemetry streaming achieving sub-50ms latency for live chart rendering."
    },
    {
      id: "proj-2",
      title: "SwiftCache - Distributed In-Memory Store",
      tech: "Go, Raft Consensus, gRPC, Protobuf",
      link: "",
      github: "https://github.com/alexmorgan-dev/swiftcache",
      date: "2022",
      description: "• Built fault-tolerant distributed key-value cache implementing Raft consensus for leader election and log replication.\n• Benchmarked throughput at 85k write ops/sec with horizontal node clustering."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: "2023 - 2026",
      credentialUrl: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      name: "CKAD: Certified Kubernetes Application Developer",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      date: "2022 - 2025",
      credentialUrl: ""
    }
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native / Bilingual" },
    { id: "lang-2", language: "Spanish", proficiency: "Professional Working Proficiency" },
    { id: "lang-3", language: "German", proficiency: "Elementary" }
  ],
  customSections: []
};

export const blankResumeData = {
  personalDetails: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photoUrl: "",
  },
  summary: "",
  sectionsOrder: ["summary", "experience", "education", "skills", "projects", "certifications", "languages"],
  sectionsVisibility: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};

