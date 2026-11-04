export const siteConfig = {
  name: "Abhishek Kokadwar",
  role: "Software Developer · AI Systems",
  tagline:
    "I build high-performance backend infrastructure, secure AI agents, and scalable web applications. Currently a pre-final year Dual Degree student at IIITM Gwalior.",
  location: "Gwalior, Madhya Pradesh, India",
  status: {
    label: "Currently Building",
    project: "CIDRA",
  },
  // Static dashboard values — "set at launch, refresh occasionally" (§5, §6).
  // DSA counts are now live via Codolio (see lib/data/codolio.ts).
  dashboard: {
    reading: "Designing Data-Intensive Applications",
  },
  // Raw email address; the `mailto:` link is derived where needed.
  email: "abhikokadwar2@gmail.com",
  links: {
    github: "https://github.com/abhishekKokadwar",
    linkedin: "https://www.linkedin.com/in/abhishek-kokadwar/",
    email: "mailto:abhikokadwar2@gmail.com",
    phone: "+91-9307229712",
    codolio: "https://codolio.com/profile/abhishek_1005",
    resume: "/resume.pdf",
  },
  about: [
    { 
      specLabel: "Academics",
      icon: "graduation", 
      label: "Integrated Dual Degree in IT @ IIIT Gwalior",
      meta: "IIIT Gwalior · 2023–2028",
      description: "CGPA 7.5/10. Coursework in data structures, operating systems, computer networks and databases.",
    },
    { 
      specLabel: "Discipline",
      icon: "terminal", 
      label: "Backend & AI Systems Engineering",
      meta: "FastAPI · Next.js · PostgreSQL · ChromaDB",
      description: "REST APIs, indexing and microservices on Docker and Kubernetes.",
    },
    { 
      specLabel: "Security",
      icon: "shield", 
      label: "AI Security Tooling & Sandboxing",
      meta: "Zero-Trust · Linux Sandboxing",
      description: "Least-privilege sandboxes and gateways for LLM tools.",
    },
    { 
      specLabel: "Availability",
      icon: "rocket", 
      label: "Open to software engineering roles",
      meta: "Internships & full-time",
      description: "Kubeflow organization member with 16 merged PRs across Kubeflow and Karmada. Solved 900+ DSA problems across LeetCode, Code360 and GeeksforGeeks.",
    },
  ],
} as const;
