/**
 * Site Configuration
 * Central configuration for business information, branding, and settings
 */

export interface SiteConfig {
  // Hero Section Configuration
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryCTA: {
      text: string;
      href: string;
    };
    secondaryCTA: {
      text: string;
      href: string;
    };
    image: string;
    video?: string;
    features: string[];
  };

  // Business Information
  business: {
    name: string;
    tagline: string;
    description: string;
    founded: string;
    industry: string;
    size: string;
  };

  // Contact Information
  contact: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    hours: {
      weekdays: string;
      weekends: string;
      timezone: string;
    };
  };

  // Branding
  branding: {
    logo: {
      light: string;
      dark: string;
      favicon: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      warning: string;
      error: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };

  // Social Media
  social: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };

  // SEO Settings
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    twitterCard: 'summary' | 'summary_large_image';
  };

  // Features
  features: {
    darkMode: boolean;
    animations: boolean;
    newsletter: boolean;
    blog: boolean;
    ecommerce: boolean;
    multiLanguage: boolean;
  };
}

export const siteConfig: SiteConfig = {
  hero: {
    title: "Transform Your Business with Enterprise Solutions",
    subtitle: "Leading Innovation",
    description: "Empower your organization with cutting-edge technology solutions designed for Fortune 500 companies. Scale faster, innovate smarter, and stay ahead of the competition.",
    primaryCTA: {
      text: "Get Started Free",
      href: "/contact"
    },
    secondaryCTA: {
      text: "Watch Demo",
      href: "/demo"
    },
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    features: [
      "99.9% Uptime Guarantee",
      "Enterprise Security",
      "24/7 Premium Support",
      "Global CDN Network"
    ]
  },

  business: {
    name: "Enterprise Solutions Pro",
    tagline: "Empowering Business Excellence",
    description: "Leading provider of innovative business solutions that drive growth, efficiency, and success across industries.",
    founded: "2020",
    industry: "Business Consulting & Technology",
    size: "50-200 employees"
  },

  contact: {
    email: "hello@enterprisesolutions.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Business Plaza, Suite 100",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States"
    },
    hours: {
      weekdays: "9:00 AM - 6:00 PM",
      weekends: "10:00 AM - 4:00 PM",
      timezone: "PST"
    }
  },

  branding: {
    logo: {
      light: "/images/logo-light.svg",
      dark: "/images/logo-dark.svg",
      favicon: "/favicon.svg"
    },
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#f59e0b",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444"
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif"
    }
  },

  social: {
    twitter: "https://twitter.com/enterprisepro",
    linkedin: "https://linkedin.com/company/enterprise-solutions-pro",
    facebook: "https://facebook.com/enterprisesolutions",
    instagram: "https://instagram.com/enterprisepro",
    youtube: "https://youtube.com/@enterprisesolutions"
  },

  seo: {
    title: "Enterprise Solutions Pro - Business Excellence & Technology",
    description: "Transform your business with our innovative solutions. Expert consulting, cutting-edge technology, and proven strategies for sustainable growth.",
    keywords: [
      "business consulting",
      "enterprise solutions",
      "digital transformation",
      "business strategy",
      "technology consulting",
      "process optimization",
      "growth strategies"
    ],
    ogImage: "/images/og-image.jpg",
    twitterCard: "summary_large_image"
  },

  features: {
    darkMode: true,
    animations: true,
    newsletter: true,
    blog: true,
    ecommerce: false,
    multiLanguage: false
  }
};

// Industry-specific configurations
export const industryTemplates = {
  technology: {
    colors: { primary: "#3b82f6", accent: "#8b5cf6" },
    keywords: ["software", "technology", "innovation", "digital"]
  },
  healthcare: {
    colors: { primary: "#059669", accent: "#0ea5e9" },
    keywords: ["healthcare", "medical", "wellness", "patient care"]
  },
  finance: {
    colors: { primary: "#1f2937", accent: "#f59e0b" },
    keywords: ["finance", "banking", "investment", "financial services"]
  },
  consulting: {
    colors: { primary: "#7c3aed", accent: "#f59e0b" },
    keywords: ["consulting", "strategy", "business", "advisory"]
  },
  ecommerce: {
    colors: { primary: "#dc2626", accent: "#f59e0b" },
    keywords: ["ecommerce", "retail", "shopping", "marketplace"]
  }
};

export default siteConfig;
