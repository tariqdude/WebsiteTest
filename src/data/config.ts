export const siteConfig = {
  name: 'BusinessPro',
  description: 'Transform your business with our innovative solutions',
  tagline: 'Innovation Meets Excellence',
  url: 'https://yourdomain.com',
  email: 'hello@businesspro.com',
  phone: '+1 (555) 123-4567',
  address: '123 Business Street, Suite 100, City, ST 12345',

  hero: {
    title: 'Transform Your Business',
    subtitle: 'With Innovative Solutions',
    description:
      'We help businesses scale and thrive in the digital age with cutting-edge technology and proven strategies.',
    primaryCta: {
      text: 'Get Started Today',
      href: '#contact',
    },
    secondaryCta: {
      text: 'Learn More',
      href: '#about',
    },
  },

  navigation: [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ],

  social: {
    twitter: 'https://twitter.com/businesspro',
    linkedin: 'https://linkedin.com/company/businesspro',
    facebook: 'https://facebook.com/businesspro',
    instagram: 'https://instagram.com/businesspro',
  },
};

export const features = [
  {
    id: 1,
    title: 'AI-Powered Analytics',
    description:
      'Get real-time insights with our advanced AI analytics platform that helps you make data-driven decisions.',
    icon: 'BarChart3',
    benefits: [
      'Real-time insights',
      'Predictive analytics',
      'Custom dashboards',
    ],
  },
  {
    id: 2,
    title: 'Cloud Integration',
    description:
      'Seamlessly integrate with leading cloud platforms for scalable and secure business operations.',
    icon: 'Cloud',
    benefits: ['99.9% uptime', 'Auto-scaling', 'Enterprise security'],
  },
  {
    id: 3,
    title: '24/7 Support',
    description:
      'Round-the-clock expert support to ensure your business operations run smoothly without interruption.',
    icon: 'Headphones',
    benefits: ['Expert support', 'Quick response', 'Proactive monitoring'],
  },
  {
    id: 4,
    title: 'Custom Solutions',
    description:
      'Tailored solutions designed specifically for your business needs and industry requirements.',
    icon: 'Settings',
    benefits: [
      'Personalized approach',
      'Industry expertise',
      'Flexible pricing',
    ],
  },
  {
    id: 5,
    title: 'Security First',
    description:
      'Enterprise-grade security measures to protect your data and ensure compliance with industry standards.',
    icon: 'Shield',
    benefits: ['End-to-end encryption', 'Compliance ready', 'Regular audits'],
  },
  {
    id: 6,
    title: 'Mobile Ready',
    description:
      'Fully responsive solutions that work perfectly across all devices and platforms.',
    icon: 'Smartphone',
    benefits: ['Cross-platform', 'Native performance', 'Offline capability'],
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechCorp',
    company: 'TechCorp Industries',
    content:
      'BusinessPro transformed our operations completely. We saw a 300% increase in efficiency within the first quarter.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CTO, StartupXYZ',
    company: 'StartupXYZ',
    content:
      'The AI-powered analytics gave us insights we never had before. Game-changing for our decision-making process.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Operations Director',
    company: 'Global Solutions Inc.',
    content:
      'Outstanding support and incredibly robust platform. Our productivity has increased by 250% since implementation.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
];

export const stats = [
  { label: 'Happy Clients', value: '10,000+', icon: 'Users' },
  { label: 'Projects Completed', value: '50,000+', icon: 'CheckCircle' },
  { label: 'Countries Served', value: '100+', icon: 'Globe' },
  { label: 'Uptime Guarantee', value: '99.9%', icon: 'Zap' },
];

export const services = [
  {
    id: 1,
    title: 'Digital Transformation',
    description:
      'Complete digital overhaul of your business processes and systems.',
    price: 'Starting at $5,000',
    features: [
      'Process automation',
      'System integration',
      'Staff training',
      'Ongoing support',
    ],
  },
  {
    id: 2,
    title: 'AI Implementation',
    description:
      'Custom AI solutions tailored to your specific business needs.',
    price: 'Starting at $10,000',
    features: [
      'Custom AI models',
      'Data analysis',
      'Predictive insights',
      'Performance monitoring',
    ],
  },
  {
    id: 3,
    title: 'Cloud Migration',
    description: 'Secure and efficient migration to cloud infrastructure.',
    price: 'Starting at $3,000',
    features: [
      'Migration planning',
      'Data transfer',
      'Security setup',
      'Performance optimization',
    ],
  },
];
