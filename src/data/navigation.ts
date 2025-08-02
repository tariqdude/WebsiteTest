/**
 * Navigation Configuration
 * Define your website's navigation structure
 */

export interface NavItem {
  name: string;
  href: string;
  description?: string;
  icon?: string;
  children?: NavItem[];
  featured?: boolean;
  external?: boolean;
}

export interface NavigationConfig {
  main: NavItem[];
  footer: {
    sections: FooterSection[];
    social: SocialLink[];
    legal: NavItem[];
  };
  mobile: NavItem[];
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export const navigationConfig: NavigationConfig = {
  main: [
    {
      name: "Home",
      href: "/",
      description: "Return to homepage"
    },
    {
      name: "Solutions",
      href: "/solutions",
      description: "Our business solutions",
      children: [
        {
          name: "Business Consulting",
          href: "/solutions/consulting",
          description: "Strategic business consulting services",
          featured: true
        },
        {
          name: "Digital Transformation",
          href: "/solutions/digital",
          description: "Modernize your business processes"
        },
        {
          name: "Process Optimization",
          href: "/solutions/optimization",
          description: "Streamline operations for efficiency"
        },
        {
          name: "Technology Integration",
          href: "/solutions/technology",
          description: "Seamless technology implementation"
        },
        {
          name: "Training & Development",
          href: "/solutions/training",
          description: "Employee skill development programs"
        }
      ]
    },
    {
      name: "Industries",
      href: "/industries",
      description: "Industries we serve",
      children: [
        {
          name: "Technology",
          href: "/industries/technology",
          description: "Tech companies and startups"
        },
        {
          name: "Healthcare",
          href: "/industries/healthcare",
          description: "Medical and healthcare organizations"
        },
        {
          name: "Finance",
          href: "/industries/finance",
          description: "Financial services and banking"
        },
        {
          name: "Manufacturing",
          href: "/industries/manufacturing",
          description: "Manufacturing and production"
        },
        {
          name: "Retail",
          href: "/industries/retail",
          description: "Retail and e-commerce businesses"
        },
        {
          name: "Professional Services",
          href: "/industries/professional",
          description: "Law firms, accounting, consulting"
        }
      ]
    },
    {
      name: "Resources",
      href: "/resources",
      description: "Helpful resources",
      children: [
        {
          name: "Case Studies",
          href: "/resources/case-studies",
          description: "Real client success stories",
          featured: true
        },
        {
          name: "White Papers",
          href: "/resources/whitepapers",
          description: "In-depth industry insights"
        },
        {
          name: "Blog",
          href: "/blog",
          description: "Latest news and insights"
        },
        {
          name: "Webinars",
          href: "/resources/webinars",
          description: "Educational webinar sessions"
        },
        {
          name: "Templates",
          href: "/resources/templates",
          description: "Free business templates"
        },
        {
          name: "ROI Calculator",
          href: "/tools/roi-calculator",
          description: "Calculate your potential ROI"
        }
      ]
    },
    {
      name: "About",
      href: "/about",
      description: "Learn about our company"
    },
    {
      name: "Contact",
      href: "/contact",
      description: "Get in touch with us"
    }
  ],

  footer: {
    sections: [
      {
        title: "Solutions",
        links: [
          { name: "Business Consulting", href: "/solutions/consulting" },
          { name: "Digital Transformation", href: "/solutions/digital" },
          { name: "Process Optimization", href: "/solutions/optimization" },
          { name: "Technology Integration", href: "/solutions/technology" },
          { name: "Training & Development", href: "/solutions/training" }
        ]
      },
      {
        title: "Industries",
        links: [
          { name: "Technology", href: "/industries/technology" },
          { name: "Healthcare", href: "/industries/healthcare" },
          { name: "Finance", href: "/industries/finance" },
          { name: "Manufacturing", href: "/industries/manufacturing" },
          { name: "Retail", href: "/industries/retail" }
        ]
      },
      {
        title: "Resources",
        links: [
          { name: "Case Studies", href: "/resources/case-studies" },
          { name: "White Papers", href: "/resources/whitepapers" },
          { name: "Blog", href: "/blog" },
          { name: "Webinars", href: "/resources/webinars" },
          { name: "Documentation", href: "/docs" }
        ]
      },
      {
        title: "Company",
        links: [
          { name: "About Us", href: "/about" },
          { name: "Leadership Team", href: "/about/team" },
          { name: "Careers", href: "/careers" },
          { name: "Partners", href: "/partners" },
          { name: "News & Press", href: "/news" }
        ]
      },
      {
        title: "Support",
        links: [
          { name: "Help Center", href: "/support" },
          { name: "Contact Us", href: "/contact" },
          { name: "System Status", href: "/status" },
          { name: "Community", href: "/community" },
          { name: "API Documentation", href: "/api-docs" }
        ]
      }
    ],
    social: [
      {
        name: "Twitter",
        href: "https://twitter.com/enterprisepro",
        icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
        </svg>`
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com/company/enterprise-solutions-pro",
        icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>`
      },
      {
        name: "Facebook",
        href: "https://facebook.com/enterprisesolutions",
        icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>`
      },
      {
        name: "Instagram",
        href: "https://instagram.com/enterprisepro",
        icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>`
      }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Security", href: "/security" }
    ]
  },

  mobile: [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Industries", href: "/industries" },
    { name: "Resources", href: "/resources" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ]
};

export default navigationConfig;
