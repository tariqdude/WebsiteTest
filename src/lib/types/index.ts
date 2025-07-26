// Core type definitions for the application

export interface BlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    author: string;
    tags: string[];
    image?: string;
    featured?: boolean;
  };
}

export interface Project {
  slug: string;
  data: {
    title: string;
    description: string;
    image: string;
    technologies: string[];
    github?: string;
    demo?: string;
    featured?: boolean;
    category?: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Framework {
  name: string;
  description: string;
  icon: string;
  bg: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }>;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface ContactInfo {
  title: string;
  description: string;
  icon: string;
  link?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
  children?: NavigationItem[];
}
