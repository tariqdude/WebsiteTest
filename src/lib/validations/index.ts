import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  newsletter: z.boolean().optional(),
});

// Advanced form validation schema
export const advancedFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  age: z
    .number()
    .min(13, 'Must be at least 13 years old')
    .max(120, 'Please enter a valid age'),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  experience: z.enum(['junior', 'mid', 'senior', 'lead'], {
    errorMap: () => ({ message: 'Please select your experience level' }),
  }),
  remote: z.boolean(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  newsletter: z.boolean().optional(),
  file: z.instanceof(File).optional(),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  preferences: z.array(z.string()).optional(),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.enum(['all', 'blog', 'projects', 'components']).optional(),
});

// Theme preference schema
export const themeSchema = z.enum(['light', 'dark', 'system']);

// Performance metrics schema
export const performanceMetricSchema = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  timestamp: z.date(),
  type: z.enum(['fcp', 'lcp', 'fid', 'cls', 'ttfb']),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type AdvancedFormData = z.infer<typeof advancedFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type ThemePreference = z.infer<typeof themeSchema>;
export type PerformanceMetricData = z.infer<typeof performanceMetricSchema>;
