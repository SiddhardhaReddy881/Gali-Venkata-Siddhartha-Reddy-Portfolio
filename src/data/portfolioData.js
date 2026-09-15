export const personalDetails = {
  fullName: "GALI VENKATA SIDDHARTHA REDDY",
  displayName: "GALI VENKATA SIDDHARTHA REDDY",
  shortName: "GALI VENKATA SIDDHARTHA REDDY",
  title: "CYBERSECURITY STUDENT",
  subtitle: "B.Tech — Computer Science (Cybersecurity) @ Vignan University",
  bioHeadline: "Building practical knowledge in cybersecurity, network security, threat detection, and emerging technologies.",
  aboutText: [
    "I am Gali Venkata Siddhartha Reddy, a B.Tech Computer Science (Cybersecurity) student at Vignan University with an interest in cybersecurity, network security, threat detection, and emerging technologies.",
    "I have a basic understanding of Python, Java, C, and SQL, and I have practiced these technologies through academic coursework, projects, and learning activities.",
    "I have developed foundational knowledge of networking, cybersecurity concepts, network protocols, and security tools through my studies and practical projects.",
    "I am a quick learner, creative thinker, and punctual individual who enjoys learning new technologies and improving my technical skills.",
    "My goal is to build a career in cybersecurity, strengthen my practical knowledge, and contribute to real-world projects while continuously learning and developing my skills."
  ],
  location: "Guntur, Andhra Pradesh, India",
  college: "Vignan University",
  degree: "B.Tech",
  branch: "Computer Science — Cybersecurity",
  academicStatus: "3rd Year — 1st Semester",
  graduationYear: "2028",
  cgpa: "7.96",
  email: "galisiddhardhareddy881@gmail.com",
  phone: "+91 8106453540",
  socials: {
    github: "https://github.com/SiddhardhaReddy881",
    linkedin: "https://www.linkedin.com/in/venkata-siddhardha-reddy-gali-bb4468319/",
    instagram: "https://www.instagram.com/siddhardha__reddy__2007/",
    leetcode: "https://leetcode.com/u/xN8odbTQcS/"
  },
  heroTags: [
    "Cybersecurity",
    "NetworkSecurity",
    "ThreatDetection",
    "EthicalHacking"
  ],
  aboutHighlights: [
    "Cybersecurity Concepts",
    "Network Security & Protocols",
    "Threat Detection Analysis",
    "Continuous Practical Learning"
  ]
};

export const skillCategories = [
  {
    id: "programming",
    title: "Programming Languages",
    iconName: "Code2",
    skills: ["Python", "Java", "C", "SQL"]
  },
  {
    id: "frameworks",
    title: "Frameworks",
    iconName: "Layers",
    skills: ["Spring Boot", "Flask"]
  },
  {
    id: "cloud",
    title: "Cloud",
    iconName: "Cloud",
    skills: ["AWS"]
  },
  {
    id: "security",
    title: "Cybersecurity & Networking",
    iconName: "ShieldCheck",
    skills: [
      "Network Security",
      "Ethical Hacking",
      "Threat Detection",
      "Network Protocols",
      "Wireshark",
      "Nmap",
      "Kali Linux"
    ]
  },
  {
    id: "database",
    title: "Database",
    iconName: "Database",
    skills: ["MySQL"]
  },
  {
    id: "tools",
    title: "Tools & Utilities",
    iconName: "Wrench",
    skills: ["Git", "GitHub", "Google Antigravity", "AI Coding Agents"]
  }
];

export const projectsData = [
  {
    id: "proxy-server-network",
    number: "01",
    title: "Proxy Server Network",
    subtitle: "Network Request Handling & Traffic Filtering",
    description: "Designed and implemented a basic proxy server to manage and filter network requests, gaining practical understanding of network protocols, request handling, client-server communication, and basic network security.",
    category: "Networking / Cybersecurity",
    tags: ["Networking", "Network Protocols", "Proxy Server", "Client-Server Communication", "Network Security"],
    github: null,
    liveDemo: null,
    statusNote: "GitHub / Demo repository in progress",
    details: "Implements basic socket request inspection, domain filtering, and client-server request forwarding to develop practical knowledge of network protocol mechanics."
  },
  {
    id: "linkshield-ai",
    number: "02",
    title: "LinkShield AI",
    subtitle: "AI-Powered Phishing Attack Detection",
    description: "An AI-assisted phishing detection platform designed to analyze suspicious URLs and help users identify potentially malicious links.",
    category: "Cybersecurity / AI",
    tags: ["Python", "Flask", "Phishing Analysis", "Security AI", "Cybersecurity"],
    github: "https://github.com/SiddhardhaReddy881/LinkShield-AI",
    liveDemo: "https://link-shield-ai.vercel.app/",
    isAiUsed: true,
    details: "Evaluates URL parameters and domain structures against known malicious indicators to flag phishing attempts and educate users on web link security. (AI tools utilized during development)."
  },
  {
    id: "ai-threat-detection",
    number: "03",
    title: "AI-Based Detection of Cyber Threats in Unidirectional IP Traffic",
    subtitle: "Unidirectional Network Traffic Analysis",
    description: "A cybersecurity project focused on detecting potential cyber threats from unidirectional IP traffic using machine-learning-based analysis.",
    category: "Cybersecurity / Threat Detection",
    tags: ["Python", "Threat Detection", "IP Traffic Analysis", "Network Security", "Machine Learning"],
    github: "https://github.com/SiddhardhaReddy881/AI-BASED-DETECTION-OF-CYBER-THREATS-IN-UNIDIRECTIONAL-IP-TRAFFIC",
    referenceDemo: "https://ai-based-detection-of-cyber-threats-omega.vercel.app/",
    isAiUsed: true,
    details: "Analyzes unidirectional telemetry patterns for anomalous traffic signals to assist in isolating malicious payloads. (AI tools utilized; reference deployment hosted by project contributor)."
  },
  {
    id: "smart-contract-security",
    number: "04",
    title: "Smart Contract Security Research",
    subtitle: "Implementation of Attacks for Evaluating Smart Contract Security Robustness",
    description: "Research-oriented project focused on evaluating smart contract security robustness through attack-based analysis during a summer internship at IIIT Allahabad.",
    category: "Blockchain Security / Cybersecurity",
    institution: "Indian Institute of Information Technology, Allahabad",
    tags: ["Blockchain Security", "Smart Contracts", "Attack Evaluation", "Security Robustness", "Research Work"],
    github: null,
    liveDemo: null,
    details: "Conducted at the Department of Information Technology, IIIT Allahabad under Prof. S. Venkatesan, analyzing vulnerability vectors in smart contract architectures through attack-based evaluation."
  }
];

export const experienceData = [
  {
    id: "iiit-allahabad-internship",
    institution: "Indian Institute of Information Technology Allahabad (IIIT Allahabad)",
    location: "Prayagraj / Allahabad, India",
    role: "Summer Internship",
    department: "Department of Information Technology",
    duration: "25.05.2026 to 18.07.2026",
    supervisor: "Prof. S. Venkatesan",
    topic: "Implementation of Attacks for Evaluating Smart Contract Security Robustness",
    description: "Successfully completed a summer internship program at the Department of Information Technology, Indian Institute of Information Technology Allahabad, focused on implementation of attacks for evaluating smart contract security robustness.",
    certificateFile: "IIITA_Certificate.jpg"
  }
];

export const educationData = [
  {
    id: "vignan-university",
    institution: "Vignan University (Vignan's Foundation for Science, Technology & Research)",
    degree: "B.Tech — Computer Science (Cybersecurity)",
    location: "Guntur, Andhra Pradesh, India",
    cgpa: "7.96",
    period: "2024 – 2028 (Expected)",
    status: "Currently Studying (3rd Year — 1st Semester)",
    isCurrent: true
  },
  {
    id: "sri-chaitanya",
    institution: "Sri Chaitanya Junior College",
    degree: "Intermediate — MPC (12th Standard)",
    location: "Andhra Pradesh, India",
    marks: "897 / 1000",
    period: "2024",
    status: "Completed (2024)"
  },
  {
    id: "vignananda-balakuteer",
    institution: "Vignananda Balakuteer",
    degree: "Matriculation — SSC (10th Standard)",
    location: "Guntur, Andhra Pradesh, India",
    marks: "485 / 600",
    period: "2022",
    status: "Completed (2022)"
  }
];

export const achievementsData = [
  {
    id: "sih-2026",
    title: "Smart India Hackathon 2026",
    type: "Smart India Internal Hackathon",
    achievement: "Active Participation",
    date: "9–10 September 2026",
    institution: "Vignan's Foundation for Science, Technology & Research",
    certificateFile: "SIH Participation certificates.pdf",
    category: "Hackathon"
  },
  {
    id: "agentic-ai-hackathon",
    title: "Agentic AI Hackathon 2026",
    type: "AI Hackathon",
    achievement: "Participation",
    date: "23–24 April 2026",
    organizer: "Agentic AI Club",
    institution: "Vignan's Foundation for Science, Technology & Research",
    certificateFile: "Agent Ai Hackthon.pdf",
    category: "Hackathon"
  },
  {
    id: "ctf-challenge",
    title: "CTF Challenge",
    type: "Cybersecurity Activity",
    achievement: "Challenge Participant",
    date: "2026",
    institution: "Vignan University",
    certificateFile: "CTF Challenge.pdf",
    category: "Cybersecurity"
  },
  {
    id: "controls-team",
    title: "Controls Team Coordinator",
    type: "Leadership / College Activity",
    achievement: "Event Coordinator",
    description: "Served as a Coordinator in the Controls Team for college events, managing logistics and coordination.",
    category: "Leadership"
  }
];

export const certificationsData = [
  {
    id: "aws-cloud",
    title: "AWS Cloud Practitioner",
    category: "Cloud",
    issuer: "Amazon Web Services (AWS)",
    file: "AWS Cloud Practitioner certificate.pdf",
    featured: true
  },
  {
    id: "soc-analyst",
    title: "SOC Analyst Certificate",
    category: "Cybersecurity",
    issuer: "Cybersecurity Academy",
    file: "SOC Analyst Certificate.pdf",
    featured: true
  },
  {
    id: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    issuer: "Verified Academy",
    file: "Cyber Security Fundamentals.pdf",
    featured: true
  },
  {
    id: "intro-cybersecurity",
    title: "Introduction to Cybersecurity",
    category: "Cybersecurity",
    issuer: "Cisco Networking Academy",
    file: "Introduction to Cybersecurity certificate.pdf",
    featured: true
  },
  {
    id: "networking-basics",
    title: "Networking Basics",
    category: "Networking",
    issuer: "Cisco Networking Academy",
    file: "Networking_Basics_certificate.pdf",
    featured: true
  },
  {
    id: "python-essentials-1",
    title: "Python Essentials 1",
    category: "Programming",
    issuer: "Cisco / Python Institute",
    file: "Python Essentials 1 certificate.pdf",
    featured: true
  },
  {
    id: "python-essentials-2",
    title: "Python Essentials 2",
    category: "Programming",
    issuer: "Cisco / Python Institute",
    file: "Python Essentials 2 certificate.pdf",
    featured: true
  },
  {
    id: "ctf-challenge-cert",
    title: "CTF Challenge",
    category: "Cybersecurity",
    issuer: "Vignan Security Club",
    file: "CTF Challenge.pdf",
    featured: true
  },
  {
    id: "sih-cert",
    title: "Smart India Hackathon 2026",
    category: "Hackathons",
    issuer: "Vignan's Foundation for Science, Technology & Research",
    file: "SIH Participation certificates.pdf",
    featured: true
  },
  {
    id: "agentic-ai-cert",
    title: "Agentic AI Hackathon 2026",
    category: "Hackathons",
    issuer: "Agentic AI Club",
    file: "Agent Ai Hackthon.pdf",
    featured: true
  },
  {
    id: "nptel-python",
    title: "NPTEL: Programming in Python",
    category: "Programming",
    issuer: "NPTEL",
    file: "The Joy of Computing using Python NPTEL.pdf",
    featured: false
  },
  {
    id: "nipam-ipr",
    title: "NIPAM IPR Awareness Certificate",
    category: "Cybersecurity",
    issuer: "National Intellectual Property Awareness Mission",
    file: "nipam certificate.pdf",
    featured: false
  }
];

export const researchData = {
  title: "Blockchain Technology & Smart Contract Security",
  label: "Research Work / Research Project",
  association: "IIIT Allahabad Summer Internship",
  topic: "Implementation of Attacks for Evaluating Smart Contract Security Robustness",
  supervisor: "Prof. S. Venkatesan, Department of IT, IIIT Allahabad",
  description: "Research-oriented project focused on blockchain technology and smart contract security, evaluating structural vulnerability vectors through attack-based analysis to strengthen smart contract robustness."
};
