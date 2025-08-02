/**
 * Team & About Configuration
 * Leadership team and company culture information
 */

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  department: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
    github?: string;
  };
  expertise: string[];
  certifications: string[];
  languages: string[];
  yearsExperience: number;
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  achievements: string[];
  featured: boolean;
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

export interface CompanyMilestone {
  year: number;
  title: string;
  description: string;
  impact: string;
  image?: string;
}

export const leadership: TeamMember[] = [
  {
    id: "alexandra-white",
    name: "Alexandra White",
    title: "Chief Executive Officer",
    department: "Executive",
    bio: "Alexandra brings over 20 years of leadership experience in technology consulting and digital transformation. She has led successful transformations for Fortune 500 companies and is passionate about helping businesses leverage technology for sustainable growth.",
    image: "/images/team/alexandra-white.jpg",
    social: {
      linkedin: "https://linkedin.com/in/alexandra-white",
      twitter: "https://twitter.com/alexwhiteceo",
      email: "alexandra@enterprisesolutions.pro"
    },
    expertise: [
      "Digital Transformation",
      "Strategic Planning",
      "Executive Consulting",
      "Change Management",
      "Business Strategy"
    ],
    certifications: [
      "Certified Management Consultant (CMC)",
      "PMP - Project Management Professional",
      "AWS Solutions Architect"
    ],
    languages: ["English", "Spanish", "French"],
    yearsExperience: 20,
    education: [
      {
        degree: "MBA in Strategic Management",
        institution: "Stanford Graduate School of Business",
        year: 2003
      },
      {
        degree: "BS in Computer Science",
        institution: "MIT",
        year: 1999
      }
    ],
    achievements: [
      "Led digital transformation for 50+ Fortune 500 companies",
      "Recognized as 'Technology Leader of the Year' 2023",
      "Published author on digital strategy",
      "Speaker at major industry conferences"
    ],
    featured: true
  },
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    title: "Chief Technology Officer",
    department: "Technology",
    bio: "Marcus is a technology visionary with deep expertise in cloud architecture, AI/ML, and cybersecurity. He leads our technical innovation initiatives and ensures our solutions leverage cutting-edge technologies to deliver maximum value to clients.",
    image: "/images/team/marcus-johnson.jpg",
    social: {
      linkedin: "https://linkedin.com/in/marcus-johnson-cto",
      github: "https://github.com/marcusjohnson",
      email: "marcus@enterprisesolutions.pro"
    },
    expertise: [
      "Cloud Architecture",
      "Artificial Intelligence",
      "Cybersecurity",
      "DevOps",
      "Software Engineering"
    ],
    certifications: [
      "AWS Solutions Architect Professional",
      "Azure Expert Architect",
      "Google Cloud Professional",
      "CISSP - Cybersecurity"
    ],
    languages: ["English", "German"],
    yearsExperience: 18,
    education: [
      {
        degree: "PhD in Computer Science",
        institution: "Carnegie Mellon University",
        year: 2005
      },
      {
        degree: "MS in Software Engineering",
        institution: "University of Washington",
        year: 2001
      }
    ],
    achievements: [
      "Designed cloud infrastructure serving 10M+ users",
      "Published 15+ research papers on AI/ML",
      "Patent holder for cloud security innovations",
      "Keynote speaker at tech conferences"
    ],
    featured: true
  },
  {
    id: "priya-patel",
    name: "Dr. Priya Patel",
    title: "Chief Operations Officer",
    department: "Operations",
    bio: "Dr. Patel brings operational excellence and process optimization expertise from her background in engineering and management consulting. She ensures our delivery processes are efficient, scalable, and consistently exceed client expectations.",
    image: "/images/team/priya-patel.jpg",
    social: {
      linkedin: "https://linkedin.com/in/priya-patel-coo",
      email: "priya@enterprisesolutions.pro"
    },
    expertise: [
      "Operations Management",
      "Process Optimization",
      "Quality Assurance",
      "Supply Chain",
      "Performance Analytics"
    ],
    certifications: [
      "Six Sigma Black Belt",
      "Lean Manufacturing Certification",
      "PMP - Project Management Professional",
      "ITIL v4 Expert"
    ],
    languages: ["English", "Hindi", "Gujarati"],
    yearsExperience: 16,
    education: [
      {
        degree: "PhD in Industrial Engineering",
        institution: "Georgia Institute of Technology",
        year: 2007
      },
      {
        degree: "MS in Operations Research",
        institution: "UC Berkeley",
        year: 2003
      }
    ],
    achievements: [
      "Optimized operations for 100+ manufacturing companies",
      "Reduced operational costs by average 35% for clients",
      "Expert in Lean Six Sigma methodologies",
      "Published operational excellence frameworks"
    ],
    featured: true
  },
  {
    id: "james-rodriguez",
    name: "James Rodriguez",
    title: "Head of Consulting",
    department: "Consulting",
    bio: "James leads our consulting practice with expertise in business strategy, digital transformation, and organizational change. His collaborative approach and deep industry knowledge help clients navigate complex business challenges.",
    image: "/images/team/james-rodriguez.jpg",
    social: {
      linkedin: "https://linkedin.com/in/james-rodriguez-consulting",
      email: "james@enterprisesolutions.pro"
    },
    expertise: [
      "Business Strategy",
      "Change Management",
      "Digital Transformation",
      "Process Reengineering",
      "Organizational Development"
    ],
    certifications: [
      "Certified Management Consultant (CMC)",
      "Change Management Certification",
      "Agile Transformation Certification"
    ],
    languages: ["English", "Spanish"],
    yearsExperience: 14,
    education: [
      {
        degree: "MBA in Strategy",
        institution: "Wharton School",
        year: 2009
      },
      {
        degree: "BS in Business Administration",
        institution: "University of Texas",
        year: 2005
      }
    ],
    achievements: [
      "Led transformation projects for 200+ companies",
      "Expertise in multi-industry consulting",
      "Published case studies on digital transformation",
      "Mentor for emerging consultants"
    ],
    featured: true
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: "sarah-kim",
    name: "Sarah Kim",
    title: "Senior Data Scientist",
    department: "Analytics",
    bio: "Sarah specializes in machine learning and predictive analytics, helping clients unlock insights from their data to drive business decisions.",
    image: "/images/team/sarah-kim.jpg",
    social: {
      linkedin: "https://linkedin.com/in/sarah-kim-data",
      github: "https://github.com/sarahkimdata"
    },
    expertise: ["Machine Learning", "Data Analytics", "Python", "R", "Statistical Modeling"],
    certifications: ["Google Cloud ML Engineer", "AWS Machine Learning"],
    languages: ["English", "Korean"],
    yearsExperience: 8,
    education: [
      {
        degree: "PhD in Statistics",
        institution: "University of California, Berkeley",
        year: 2015
      }
    ],
    achievements: ["Published 10+ ML research papers", "Led analytics for Fortune 100 companies"],
    featured: false
  },
  {
    id: "david-chen",
    name: "David Chen",
    title: "Cloud Solutions Architect",
    department: "Technology",
    bio: "David designs and implements scalable cloud architectures that help businesses modernize their infrastructure and improve performance.",
    image: "/images/team/david-chen.jpg",
    social: {
      linkedin: "https://linkedin.com/in/david-chen-cloud",
      github: "https://github.com/davidchen"
    },
    expertise: ["AWS", "Azure", "Google Cloud", "Kubernetes", "DevOps"],
    certifications: ["AWS Solutions Architect Professional", "Azure Expert"],
    languages: ["English", "Mandarin"],
    yearsExperience: 10,
    education: [
      {
        degree: "MS in Computer Science",
        institution: "Stanford University",
        year: 2013
      }
    ],
    achievements: ["Migrated 500+ applications to cloud", "Cloud cost optimization expert"],
    featured: false
  }
];

export const companyValues: CompanyValue[] = [
  {
    id: "excellence",
    title: "Excellence",
    description: "We strive for excellence in everything we do, from client service to technical implementation. Our commitment to quality ensures that every project exceeds expectations.",
    icon: "star",
    examples: [
      "98% client satisfaction rate maintained for 5+ years",
      "Rigorous quality assurance processes",
      "Continuous improvement mindset",
      "Industry-leading best practices"
    ]
  },
  {
    id: "innovation",
    title: "Innovation",
    description: "We embrace cutting-edge technologies and creative solutions to solve complex business challenges. Innovation drives our approach to problem-solving.",
    icon: "lightbulb",
    examples: [
      "Early adoption of AI and machine learning",
      "Custom solution development",
      "R&D investment in emerging technologies",
      "Patent portfolio in cloud security"
    ]
  },
  {
    id: "integrity",
    title: "Integrity",
    description: "Honesty, transparency, and ethical business practices are the foundation of our relationships with clients, partners, and team members.",
    icon: "shield",
    examples: [
      "Transparent pricing and project scope",
      "Confidentiality and data protection",
      "Ethical AI and technology practices",
      "Long-term client partnerships"
    ]
  },
  {
    id: "collaboration",
    title: "Collaboration",
    description: "We believe the best results come from working together. We partner closely with our clients and foster teamwork within our organization.",
    icon: "users",
    examples: [
      "Cross-functional project teams",
      "Client co-creation workshops",
      "Knowledge sharing culture",
      "Industry partnership network"
    ]
  },
  {
    id: "impact",
    title: "Impact",
    description: "We measure our success by the positive impact we create for our clients' businesses and the communities we serve.",
    icon: "trending-up",
    examples: [
      "Average 250% ROI for clients",
      "Sustainable business practices",
      "Community technology education",
      "Pro bono work for nonprofits"
    ]
  },
  {
    id: "growth",
    title: "Growth",
    description: "We are committed to continuous learning and development, both for our team members and our clients' organizations.",
    icon: "arrow-up",
    examples: [
      "Continuous learning programs",
      "Professional development budget",
      "Mentorship and coaching",
      "Industry certification support"
    ]
  }
];

export const companyMilestones: CompanyMilestone[] = [
  {
    year: 2024,
    title: "AI Innovation Center Launch",
    description: "Opened dedicated AI research and development center to advance machine learning solutions for enterprise clients.",
    impact: "Positioned as industry leader in AI consulting with 15 new ML-powered solutions launched."
  },
  {
    year: 2023,
    title: "500+ Client Milestone",
    description: "Reached milestone of serving over 500 satisfied clients across 25+ industries worldwide.",
    impact: "Established global presence with consistent 98% client satisfaction rating."
  },
  {
    year: 2022,
    title: "Cybersecurity Excellence Award",
    description: "Recognized as 'Cybersecurity Consulting Firm of the Year' by industry association.",
    impact: "Strengthened reputation as trusted security partner for Fortune 500 companies."
  },
  {
    year: 2021,
    title: "Cloud Migration Expertise",
    description: "Became certified partner with all major cloud providers (AWS, Azure, Google Cloud).",
    impact: "Successfully migrated 1000+ applications to cloud with zero downtime record."
  },
  {
    year: 2020,
    title: "Remote Work Transformation",
    description: "Led industry in remote work solutions during global pandemic, helping 200+ companies adapt.",
    impact: "Maintained 100% project delivery rate while supporting clients' remote transformation."
  },
  {
    year: 2019,
    title: "International Expansion",
    description: "Expanded operations to Europe and Asia with offices in London and Singapore.",
    impact: "Enabled 24/7 global support and local expertise for international clients."
  },
  {
    year: 2018,
    title: "Digital Transformation Leader",
    description: "Recognized as top digital transformation consultant by major industry publication.",
    impact: "Led 100+ successful digital transformation projects with average 40% efficiency gains."
  },
  {
    year: 2015,
    title: "Company Founded",
    description: "Enterprise Solutions Pro founded with mission to help businesses leverage technology for growth.",
    impact: "Started with vision to democratize enterprise-grade technology solutions for all businesses."
  }
];

// Company overview
export const companyOverview = {
  founded: 2015,
  employees: "150+",
  locations: ["New York", "San Francisco", "London", "Singapore"],
  headquarters: "New York, NY",
  mission: "To empower businesses with innovative technology solutions that drive sustainable growth and competitive advantage.",
  vision: "To be the world's most trusted partner for digital transformation and business innovation.",
  approach: "We combine deep industry expertise with cutting-edge technology to deliver solutions that create lasting value for our clients."
};

export default leadership;
