/**
 * Testimonials & Case Studies Configuration
 * Real client success stories and social proof
 */

export interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    title: string;
    company: string;
    avatar?: string;
    linkedin?: string;
  };
  rating: number;
  category: string;
  featured: boolean;
  video?: string;
  results?: {
    metric: string;
    improvement: string;
    timeframe: string;
  }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: {
    name: string;
    industry: string;
    size: string;
    logo?: string;
  };
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  testimonial: Testimonial;
  image?: string;
  pdf?: string;
  featured: boolean;
  tags: string[];
}

export const testimonials: Testimonial[] = [
  {
    id: "sarah-johnson-techcorp",
    quote: "Enterprise Solutions Pro transformed our entire business strategy. Their consulting team helped us identify key growth opportunities that resulted in a 40% increase in revenue within the first year. The strategic roadmap they developed was comprehensive and actionable.",
    author: {
      name: "Sarah Johnson",
      title: "CEO",
      company: "TechCorp Industries",
      avatar: "/images/testimonials/sarah-johnson.jpg",
      linkedin: "https://linkedin.com/in/sarah-johnson"
    },
    rating: 5,
    category: "consulting",
    featured: true,
    results: [
      {
        metric: "Revenue Growth",
        improvement: "40%",
        timeframe: "12 months"
      },
      {
        metric: "Market Share",
        improvement: "25%",
        timeframe: "18 months"
      },
      {
        metric: "Operational Efficiency",
        improvement: "60%",
        timeframe: "6 months"
      }
    ]
  },
  {
    id: "michael-chen-healthplus",
    quote: "The digital transformation project exceeded all our expectations. The team's expertise in healthcare technology helped us modernize our patient management system, resulting in improved patient satisfaction and operational efficiency.",
    author: {
      name: "Dr. Michael Chen",
      title: "Chief Medical Officer",
      company: "HealthPlus Medical Group",
      avatar: "/images/testimonials/michael-chen.jpg"
    },
    rating: 5,
    category: "digital-transformation",
    featured: true,
    results: [
      {
        metric: "Patient Satisfaction",
        improvement: "35%",
        timeframe: "8 months"
      },
      {
        metric: "Administrative Efficiency",
        improvement: "50%",
        timeframe: "6 months"
      }
    ]
  },
  {
    id: "emma-rodriguez-financegroup",
    quote: "Their cybersecurity assessment identified critical vulnerabilities we weren't aware of. The implementation of their security framework has given us confidence that our client data is protected. The team was professional and thorough throughout the process.",
    author: {
      name: "Emma Rodriguez",
      title: "CTO",
      company: "SecureFinance Group",
      avatar: "/images/testimonials/emma-rodriguez.jpg"
    },
    rating: 5,
    category: "cybersecurity",
    featured: true,
    results: [
      {
        metric: "Security Score",
        improvement: "85%",
        timeframe: "4 months"
      },
      {
        metric: "Compliance Rating",
        improvement: "100%",
        timeframe: "3 months"
      }
    ]
  },
  {
    id: "david-kim-retailmax",
    quote: "The process optimization work they did for our supply chain was incredible. We saw immediate improvements in efficiency and cost reduction. Their team understood our industry challenges and provided practical solutions.",
    author: {
      name: "David Kim",
      title: "Operations Director",
      company: "RetailMax Corporation",
      avatar: "/images/testimonials/david-kim.jpg"
    },
    rating: 5,
    category: "process-optimization",
    featured: false,
    results: [
      {
        metric: "Cost Reduction",
        improvement: "30%",
        timeframe: "5 months"
      },
      {
        metric: "Delivery Speed",
        improvement: "45%",
        timeframe: "4 months"
      }
    ]
  },
  {
    id: "lisa-thompson-edutech",
    quote: "The data analytics platform they built for us provides incredible insights into our business. We can now make data-driven decisions with confidence. The training they provided ensured our team could maximize the platform's potential.",
    author: {
      name: "Lisa Thompson",
      title: "VP of Analytics",
      company: "EduTech Solutions",
      avatar: "/images/testimonials/lisa-thompson.jpg"
    },
    rating: 5,
    category: "data-analytics",
    featured: false,
    results: [
      {
        metric: "Decision Speed",
        improvement: "70%",
        timeframe: "3 months"
      },
      {
        metric: "Data Accuracy",
        improvement: "95%",
        timeframe: "2 months"
      }
    ]
  },
  {
    id: "robert-garcia-manufacturing",
    quote: "The leadership training program they developed for our management team was exceptional. We've seen significant improvements in team performance and employee engagement. The ROI was evident within months.",
    author: {
      name: "Robert Garcia",
      title: "HR Director",
      company: "Advanced Manufacturing Co.",
      avatar: "/images/testimonials/robert-garcia.jpg"
    },
    rating: 5,
    category: "training",
    featured: false,
    results: [
      {
        metric: "Employee Engagement",
        improvement: "55%",
        timeframe: "6 months"
      },
      {
        metric: "Team Performance",
        improvement: "40%",
        timeframe: "4 months"
      }
    ]
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "techcorp-digital-transformation",
    title: "Digital Transformation Drives 40% Revenue Growth",
    client: {
      name: "TechCorp Industries",
      industry: "Technology",
      size: "500-1000 employees",
      logo: "/images/clients/techcorp-logo.png"
    },
    challenge: "TechCorp Industries was struggling with outdated processes and disconnected systems that were limiting their growth potential. Their manual workflows were causing delays, and they lacked real-time visibility into their operations.",
    solution: "We implemented a comprehensive digital transformation strategy that included process automation, cloud migration, and integrated business intelligence. Our team worked closely with TechCorp's leadership to ensure seamless adoption and minimal disruption.",
    results: [
      {
        metric: "Revenue Growth",
        value: "40%",
        description: "Year-over-year revenue increase following implementation"
      },
      {
        metric: "Process Efficiency",
        value: "60%",
        description: "Reduction in manual processing time"
      },
      {
        metric: "Data Accuracy",
        value: "95%",
        description: "Improvement in data quality and reporting accuracy"
      },
      {
        metric: "Customer Satisfaction",
        value: "35%",
        description: "Increase in customer satisfaction scores"
      }
    ],
    testimonial: testimonials[0],
    featured: true,
    tags: ["Digital Transformation", "Process Automation", "Business Intelligence", "Technology"]
  },
  {
    id: "healthplus-patient-management",
    title: "Healthcare Technology Modernization Success",
    client: {
      name: "HealthPlus Medical Group",
      industry: "Healthcare",
      size: "200-500 employees",
      logo: "/images/clients/healthplus-logo.png"
    },
    challenge: "HealthPlus was using outdated patient management systems that created inefficiencies and impacted patient care quality. They needed a modern, integrated solution that would improve both operational efficiency and patient experience.",
    solution: "We designed and implemented a comprehensive patient management platform with integrated scheduling, electronic health records, and patient communication tools. The solution was built with healthcare compliance and security at its core.",
    results: [
      {
        metric: "Patient Satisfaction",
        value: "35%",
        description: "Improvement in patient satisfaction scores"
      },
      {
        metric: "Administrative Efficiency",
        value: "50%",
        description: "Reduction in administrative processing time"
      },
      {
        metric: "Appointment Scheduling",
        value: "80%",
        description: "Improvement in scheduling efficiency"
      },
      {
        metric: "Data Security",
        value: "100%",
        description: "HIPAA compliance achievement"
      }
    ],
    testimonial: testimonials[1],
    featured: true,
    tags: ["Healthcare", "Digital Transformation", "Patient Management", "Compliance"]
  },
  {
    id: "securityfinance-cybersecurity",
    title: "Comprehensive Cybersecurity Transformation",
    client: {
      name: "SecureFinance Group",
      industry: "Financial Services",
      size: "1000+ employees",
      logo: "/images/clients/securefinance-logo.png"
    },
    challenge: "SecureFinance Group needed to enhance their cybersecurity posture to protect sensitive financial data and meet increasing regulatory requirements. Their existing security measures were insufficient for their growth trajectory.",
    solution: "We conducted a comprehensive security assessment and implemented a multi-layered security framework including advanced threat detection, employee training, and compliance management systems.",
    results: [
      {
        metric: "Security Score",
        value: "85%",
        description: "Overall improvement in security posture"
      },
      {
        metric: "Threat Detection",
        value: "99%",
        description: "Improvement in threat detection and response time"
      },
      {
        metric: "Compliance Rating",
        value: "100%",
        description: "Achievement of all regulatory compliance requirements"
      },
      {
        metric: "Security Incidents",
        value: "90%",
        description: "Reduction in security incidents"
      }
    ],
    testimonial: testimonials[2],
    featured: false,
    tags: ["Cybersecurity", "Financial Services", "Compliance", "Risk Management"]
  }
];

// Client logos for social proof
export const clientLogos = [
  {
    name: "TechCorp Industries",
    logo: "/images/clients/techcorp.svg",
    industry: "Technology"
  },
  {
    name: "HealthPlus Medical",
    logo: "/images/clients/healthplus.svg",
    industry: "Healthcare"
  },
  {
    name: "SecureFinance Group",
    logo: "/images/clients/securefinance.svg",
    industry: "Finance"
  },
  {
    name: "RetailMax Corporation",
    logo: "/images/clients/retailmax.svg",
    industry: "Retail"
  },
  {
    name: "EduTech Solutions",
    logo: "/images/clients/edutech.svg",
    industry: "Education"
  },
  {
    name: "Advanced Manufacturing",
    logo: "/images/clients/manufacturing.svg",
    industry: "Manufacturing"
  },
  {
    name: "Global Logistics",
    logo: "/images/clients/logistics.svg",
    industry: "Logistics"
  },
  {
    name: "Innovation Labs",
    logo: "/images/clients/innovation.svg",
    industry: "Research"
  }
];

// Stats and metrics
export const businessStats = {
  clients: {
    total: "500+",
    description: "Satisfied clients worldwide"
  },
  projects: {
    total: "1,200+",
    description: "Successful projects completed"
  },
  experience: {
    total: "15+",
    description: "Years of industry experience"
  },
  satisfaction: {
    total: "98%",
    description: "Client satisfaction rate"
  },
  roi: {
    total: "250%",
    description: "Average ROI improvement"
  },
  retention: {
    total: "95%",
    description: "Client retention rate"
  }
};

export default testimonials;
