/**
 * Business Features & Services Configuration
 * Define your business offerings in a structured, reusable format
 */

export interface BusinessFeature {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  longDescription?: string;
  benefits: string[];
  features?: string[];
  pricing?: {
    tier: 'basic' | 'standard' | 'premium' | 'enterprise';
    price?: string;
    period?: string;
  };
  cta?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary';
  };
  image?: string;
  testimonial?: {
    quote: string;
    author: string;
    company: string;
    avatar?: string;
  };
  stats?: {
    label: string;
    value: string;
  }[];
  featured?: boolean;
  popular?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: BusinessFeature[];
}

export const businessFeatures: BusinessFeature[] = [
  {
    id: 'strategic-consulting',
    category: 'consulting',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>`,
    title: 'Strategic Business Consulting',
    description:
      'Transform your business strategy with expert guidance and data-driven insights that deliver measurable results.',
    longDescription:
      'Our strategic consulting services help businesses navigate complex challenges, identify growth opportunities, and implement sustainable solutions. We work closely with your leadership team to develop comprehensive strategies that align with your goals and market dynamics.',
    benefits: [
      'Comprehensive business analysis and assessment',
      'Market research and competitive intelligence',
      'Strategic planning and roadmap development',
      'Performance optimization and KPI tracking',
      'Change management and implementation support',
    ],
    features: [
      'SWOT analysis and market positioning',
      'Financial modeling and forecasting',
      'Operational efficiency assessment',
      'Digital readiness evaluation',
      'Risk management framework',
    ],
    pricing: {
      tier: 'premium',
      price: '$5,000',
      period: 'per project',
    },
    cta: {
      text: 'Schedule Consultation',
      href: '/contact?service=strategic-consulting',
      variant: 'primary',
    },
    stats: [
      { label: 'Average ROI Increase', value: '150%' },
      { label: 'Strategy Success Rate', value: '95%' },
      { label: 'Client Satisfaction', value: '4.9/5' },
    ],
    featured: true,
    popular: true,
  },

  {
    id: 'digital-transformation',
    category: 'technology',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>`,
    title: 'Digital Transformation',
    description:
      'Modernize your business processes with cutting-edge technology solutions that boost efficiency and productivity.',
    longDescription:
      'Our digital transformation services help businesses leverage technology to streamline operations, improve customer experience, and drive innovation. We provide end-to-end solutions from strategy to implementation.',
    benefits: [
      'Process automation and workflow optimization',
      'Cloud migration and infrastructure modernization',
      'Data analytics and business intelligence',
      'Customer experience enhancement',
      'Digital culture and workforce transformation',
    ],
    features: [
      'Technology assessment and roadmap',
      'Custom software development',
      'System integration and APIs',
      'Training and change management',
      'Ongoing support and maintenance',
    ],
    pricing: {
      tier: 'enterprise',
      price: 'Custom',
      period: 'pricing',
    },
    cta: {
      text: 'Get Digital Assessment',
      href: '/contact?service=digital-transformation',
      variant: 'primary',
    },
    stats: [
      { label: 'Efficiency Improvement', value: '60%' },
      { label: 'Cost Reduction', value: '40%' },
      { label: 'Time to Market', value: '50% faster' },
    ],
    featured: true,
  },

  {
    id: 'process-optimization',
    category: 'operations',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>`,
    title: 'Process Optimization',
    description:
      'Streamline your operations with lean methodologies and smart automation to maximize efficiency and reduce costs.',
    benefits: [
      'Workflow analysis and redesign',
      'Automation implementation',
      'Quality management systems',
      'Performance monitoring',
      'Continuous improvement programs',
    ],
    pricing: {
      tier: 'standard',
      price: '$3,000',
      period: 'per month',
    },
    cta: {
      text: 'Optimize Processes',
      href: '/contact?service=process-optimization',
    },
  },

  {
    id: 'data-analytics',
    category: 'analytics',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>`,
    title: 'Data Analytics & Intelligence',
    description:
      'Transform raw data into actionable insights with advanced analytics, reporting, and business intelligence solutions.',
    benefits: [
      'Real-time dashboards and reporting',
      'Predictive analytics and forecasting',
      'Data visualization and storytelling',
      'Performance KPI tracking',
      'Custom analytics solutions',
    ],
    pricing: {
      tier: 'premium',
      price: '$4,500',
      period: 'per month',
    },
    cta: {
      text: 'Explore Analytics',
      href: '/contact?service=data-analytics',
    },
    popular: true,
  },

  {
    id: 'cybersecurity',
    category: 'security',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>`,
    title: 'Cybersecurity Solutions',
    description:
      'Protect your business with comprehensive security solutions including threat detection, compliance, and risk management.',
    benefits: [
      'Security assessment and auditing',
      'Threat detection and response',
      'Compliance management',
      'Employee security training',
      'Incident response planning',
    ],
    pricing: {
      tier: 'enterprise',
      price: '$6,000',
      period: 'per month',
    },
    cta: {
      text: 'Secure Your Business',
      href: '/contact?service=cybersecurity',
    },
  },

  {
    id: 'training-development',
    category: 'training',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>`,
    title: 'Training & Development',
    description:
      'Empower your team with comprehensive training programs designed to enhance skills and drive business growth.',
    benefits: [
      'Custom training programs',
      'Leadership development',
      'Technical skills training',
      'Certification programs',
      'Performance assessment',
    ],
    pricing: {
      tier: 'standard',
      price: '$2,500',
      period: 'per program',
    },
    cta: {
      text: 'Build Skills',
      href: '/contact?service=training',
    },
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'consulting',
    name: 'Business Consulting',
    description: 'Strategic guidance for business transformation',
    icon: '📊',
    color: 'blue',
    features: businessFeatures.filter((f) => f.category === 'consulting'),
  },
  {
    id: 'technology',
    name: 'Technology Solutions',
    description: 'Digital transformation and modernization',
    icon: '💻',
    color: 'purple',
    features: businessFeatures.filter((f) => f.category === 'technology'),
  },
  {
    id: 'operations',
    name: 'Operations Excellence',
    description: 'Process optimization and efficiency',
    icon: '⚙️',
    color: 'green',
    features: businessFeatures.filter((f) => f.category === 'operations'),
  },
  {
    id: 'analytics',
    name: 'Data & Analytics',
    description: 'Business intelligence and insights',
    icon: '📈',
    color: 'orange',
    features: businessFeatures.filter((f) => f.category === 'analytics'),
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    description: 'Cybersecurity and risk management',
    icon: '🔒',
    color: 'red',
    features: businessFeatures.filter((f) => f.category === 'security'),
  },
  {
    id: 'training',
    name: 'Training & Development',
    description: 'Workforce development and skills enhancement',
    icon: '🎓',
    color: 'indigo',
    features: businessFeatures.filter((f) => f.category === 'training'),
  },
];

// Pricing tiers
export const pricingTiers = {
  basic: {
    name: 'Basic',
    description: 'Perfect for small businesses',
    color: 'gray',
    features: ['Basic support', 'Standard features', 'Email support'],
  },
  standard: {
    name: 'Standard',
    description: 'Great for growing companies',
    color: 'blue',
    features: [
      'Priority support',
      'Advanced features',
      'Phone support',
      'Training included',
    ],
  },
  premium: {
    name: 'Premium',
    description: 'For established enterprises',
    color: 'purple',
    features: [
      '24/7 support',
      'Premium features',
      'Dedicated manager',
      'Custom integrations',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    color: 'gold',
    features: [
      'White-glove service',
      'Custom development',
      'SLA guarantee',
      'On-site support',
    ],
  },
};

export default businessFeatures;
