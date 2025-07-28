/**
 * Enhanced TypeScript utility types for the multi-framework showcase
 */

// Framework Detection
export type SupportedFramework = 'react' | 'vue' | 'svelte' | 'solid' | 'preact' | 'astro';

export interface FrameworkConfig {
  name: SupportedFramework;
  displayName: string;
  version: string;
  features: string[];
  color: string;
  icon: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface ShowcaseComponentProps extends BaseComponentProps {
  title: string;
  description?: string;
  framework: SupportedFramework;
  isLoading?: boolean;
  error?: string | null;
}

// Performance Monitoring Types
export interface PerformanceMetrics {
  loadTime: number;
  domNodes: number;
  memoryUsage: number;
  connectionType: string;
  renderTime: number;
  bundleSize: number;
  cacheEfficiency: number;
  interactionLatency: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

export interface LiveMetrics {
  fps: number;
  cpuUsage: number;
  networkLatency: number;
  timestamp: number;
}

// Code Editor Types
export interface CodeEditorConfig {
  language: 'javascript' | 'typescript' | 'python' | 'css' | 'html' | 'json';
  theme: 'vs-dark' | 'vs-light' | 'hc-black';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
}

export interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed?: number;
}

// Theme and UI Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface UITheme {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  requestId: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form and Validation Types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  required: boolean;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// Animation and Interaction Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  iterationCount?: number | 'infinite';
}

export interface InteractionEvent {
  type: 'click' | 'hover' | 'focus' | 'scroll' | 'resize' | 'keypress';
  target: string;
  timestamp: number;
  data?: any;
}

// Project Configuration Types
export interface ProjectConfig {
  name: string;
  version: string;
  description: string;
  frameworks: FrameworkConfig[];
  features: ProjectFeature[];
  deployment: DeploymentConfig;
  performance: PerformanceConfig;
}

export interface ProjectFeature {
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface DeploymentConfig {
  platform: 'github-pages' | 'vercel' | 'netlify' | 'aws' | 'custom';
  baseUrl: string;
  buildCommand: string;
  outputDir: string;
  environment: Record<string, string>;
}

export interface PerformanceConfig {
  budgets: {
    bundleSize: number;
    loadTime: number;
    memoryUsage: number;
  };
  monitoring: {
    enabled: boolean;
    interval: number;
    alerts: boolean;
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RecursiveReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? RecursiveReadonly<T[P]> : T[P];
};

// Event System Types
export interface EventHandler<T = any> {
  (event: T): void | Promise<void>;
}

export interface EventEmitter {
  on<T>(event: string, handler: EventHandler<T>): () => void;
  emit<T>(event: string, data: T): void;
  off(event: string, handler: EventHandler): void;
  once<T>(event: string, handler: EventHandler<T>): () => void;
}

// Error Handling Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  stack?: string;
  context?: Record<string, any>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
  errorInfo?: any;
}

// Testing Types
export interface TestCase {
  name: string;
  description?: string;
  framework: SupportedFramework;
  component: string;
  props?: Record<string, any>;
  expected: any;
  timeout?: number;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  error?: string;
  duration: number;
  coverage?: number;
}

// Accessibility Types
export interface A11yConfig {
  enabled: boolean;
  rules: A11yRule[];
  reportLevel: 'error' | 'warning' | 'info';
}

export interface A11yRule {
  id: string;
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
  tags: string[];
}

// SEO and Meta Types
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  robots?: string;
  structuredData?: Record<string, any>;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

// File System Types
export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  lastModified: Date;
  type: 'file' | 'directory';
}

export interface DirectoryStructure {
  path: string;
  files: FileInfo[];
  directories: DirectoryStructure[];
}

// Build and Bundling Types
export interface BuildConfig {
  entryPoint: string;
  outputDir: string;
  sourceMaps: boolean;
  minify: boolean;
  target: string[];
  externals: string[];
  plugins: BuildPlugin[];
}

export interface BuildPlugin {
  name: string;
  options?: Record<string, any>;
  apply?: 'serve' | 'build' | 'all';
}

export interface BuildResult {
  success: boolean;
  duration: number;
  outputFiles: string[];
  warnings: string[];
  errors: string[];
  stats: {
    bundleSize: number;
    chunkCount: number;
    assetCount: number;
  };
}

// All enhanced types are defined above and exported automatically
