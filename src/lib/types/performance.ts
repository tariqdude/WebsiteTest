/**
 * Enhanced Performance & Monitoring Types
 * 
 * Comprehensive types for performance monitoring, web vitals,
 * and diagnostic capabilities across all frameworks.
 * 
 * @version 1.0.0
 */

import type { 
  PerformanceStats, 
  MemoryInfo,
  ConnectionInfo 
} from './index';

// =============================================================================
// WEB VITALS & CORE METRICS
// =============================================================================

// Core Web Vitals
export interface CoreWebVitals {
  // First Contentful Paint
  fcp: number;
  // Largest Contentful Paint  
  lcp: number;
  // First Input Delay
  fid: number;
  // Cumulative Layout Shift
  cls: number;
  // Time to First Byte
  ttfb: number;
}

// Additional performance metrics
export interface AdditionalMetrics {
  // Time to Interactive
  tti?: number;
  // First Meaningful Paint
  fmp?: number;
  // Speed Index
  si?: number;
  // Total Blocking Time
  tbt?: number;
  // DOM Content Loaded
  domContentLoaded: number;
  // Full page load
  loadComplete: number;
}

// Combined performance report
export interface PerformanceReport extends CoreWebVitals, AdditionalMetrics {
  timestamp: Date;
  url: string;
  userAgent: string;
  connection?: ConnectionInfo;
  memory?: MemoryInfo;
  score?: PerformanceScore;
}

// Performance scoring
export interface PerformanceScore {
  overall: number; // 0-100
  metrics: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
  category: 'poor' | 'needs-improvement' | 'good';
}

// =============================================================================
// RESOURCE MONITORING
// =============================================================================

// Resource timing data
export interface ResourceTiming {
  name: string;
  type: 'script' | 'stylesheet' | 'image' | 'fetch' | 'navigation' | 'other';
  size: number;
  duration: number;
  startTime: number;
  endTime: number;
  transferSize?: number;
  encodedBodySize?: number;
  decodedBodySize?: number;
  cacheHit?: boolean;
}

// Bundle analysis
export interface BundleAnalysis {
  entryPoints: string[];
  chunks: ChunkInfo[];
  totalSize: number;
  gzippedSize: number;
  assets: AssetInfo[];
  duplicates?: string[];
  recommendations?: string[];
}

export interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  modules: string[];
  type: 'entry' | 'vendor' | 'async' | 'runtime';
}

export interface AssetInfo {
  name: string;
  size: number;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
  cached?: boolean;
  compressed?: boolean;
}

// =============================================================================
// RUNTIME MONITORING
// =============================================================================

// Frame performance monitoring
export interface FrameMetrics {
  fps: number;
  frameTime: number;
  droppedFrames: number;
  jankScore: number;
  timestamp: number;
}

// Memory monitoring
export interface MemoryMonitoring extends MemoryInfo {
  heapUsagePercent: number;
  gcEvents: GCEvent[];
  leaks?: MemoryLeak[];
}

export interface GCEvent {
  type: 'minor' | 'major' | 'incremental';
  duration: number;
  timestamp: number;
  beforeSize: number;
  afterSize: number;
}

export interface MemoryLeak {
  component: string;
  size: number;
  references: number;
  firstSeen: Date;
  lastSeen: Date;
}

// CPU monitoring
export interface CPUMetrics {
  usage: number; // percentage
  taskDuration: number;
  longTasks: LongTask[];
}

export interface LongTask {
  duration: number;
  startTime: number;
  attribution?: TaskAttribution[];
}

export interface TaskAttribution {
  containerType: string;
  containerSrc?: string;
  containerId?: string;
  containerName?: string;
}

// =============================================================================
// DIAGNOSTIC CAPABILITIES
// =============================================================================

// Performance diagnostic configuration
export interface DiagnosticConfig {
  enableWebVitals: boolean;
  enableResourceTiming: boolean;
  enableMemoryMonitoring: boolean;
  enableFrameMetrics: boolean;
  enableNetworkMonitoring: boolean;
  samplingRate: number; // 0-1
  reportingInterval: number; // milliseconds
  thresholds: PerformanceThresholds;
}

// Performance thresholds for alerting
export interface PerformanceThresholds {
  fcp: { good: number; poor: number };
  lcp: { good: number; poor: number };
  fid: { good: number; poor: number };
  cls: { good: number; poor: number };
  ttfb: { good: number; poor: number };
  memory: { warning: number; critical: number };
  frameRate: { minimum: number };
}

// Diagnostic alert
export interface PerformanceAlert {
  type: 'warning' | 'error' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

// Performance session data
export interface PerformanceSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  url: string;
  userAgent: string;
  vitals: CoreWebVitals;
  resources: ResourceTiming[];
  errors: PerformanceAlert[];
  customMetrics: Record<string, number>;
}

// =============================================================================
// FRAMEWORK-SPECIFIC MONITORING
// =============================================================================

// React performance monitoring
export interface ReactPerformanceMetrics {
  componentRenders: ComponentRenderInfo[];
  hookUpdates: HookUpdateInfo[];
  rerenderReasons: RerenderReason[];
  fiberWorkDuration: number;
}

export interface ComponentRenderInfo {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  totalRenderTime: number;
  props?: Record<string, unknown>;
}

export interface HookUpdateInfo {
  hookType: string;
  updateCount: number;
  component: string;
  dependencies?: unknown[];
}

export interface RerenderReason {
  component: string;
  reason: 'props' | 'state' | 'context' | 'parent' | 'force';
  details?: string;
  timestamp: number;
}

// Vue performance monitoring
export interface VuePerformanceMetrics {
  componentUpdates: VueComponentUpdate[];
  reactivityTriggers: ReactivityTrigger[];
  renderTime: number;
}

export interface VueComponentUpdate {
  componentName: string;
  updateType: 'props' | 'data' | 'computed' | 'watch';
  duration: number;
  timestamp: number;
}

export interface ReactivityTrigger {
  property: string;
  oldValue: unknown;
  newValue: unknown;
  component: string;
  timestamp: number;
}

// =============================================================================
// REPORTING & ANALYTICS
// =============================================================================

// Performance report configuration
export interface ReportConfig {
  format: 'json' | 'html' | 'csv';
  includeScreenshots?: boolean;
  includeWaterfall?: boolean;
  includeRecommendations?: boolean;
  timeRange?: {
    start: Date;
    end: Date;
  };
}

// Aggregated performance analytics
export interface PerformanceAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  sessions: number;
  averageMetrics: CoreWebVitals;
  percentiles: {
    p50: CoreWebVitals;
    p75: CoreWebVitals;
    p90: CoreWebVitals;
    p95: CoreWebVitals;
  };
  trends: MetricTrend[];
  topIssues: PerformanceIssue[];
}

export interface MetricTrend {
  metric: keyof CoreWebVitals;
  direction: 'improving' | 'degrading' | 'stable';
  change: number; // percentage
  significance: 'low' | 'medium' | 'high';
}

export interface PerformanceIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  impact: number; // 0-100
  description: string;
  recommendation?: string;
  affectedPages: string[];
}

// =============================================================================
// HOOKS & UTILITIES
// =============================================================================

// Performance monitoring hook return type
export interface UsePerformanceReturn {
  metrics: PerformanceStats;
  vitals: CoreWebVitals | null;
  isLoading: boolean;
  error: string | null;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordCustomMetric: (name: string, value: number) => void;
  generateReport: () => PerformanceReport;
}

// Performance observer configuration
export interface PerformanceObserverConfig {
  entryTypes: string[];
  buffered?: boolean;
  callback: (entries: PerformanceEntry[]) => void;
}

// =============================================================================
// EXPORT TYPE BUNDLES
// =============================================================================

export type WebVitalsTypes = {
  CoreWebVitals: CoreWebVitals;
  AdditionalMetrics: AdditionalMetrics;
  PerformanceReport: PerformanceReport;
  PerformanceScore: PerformanceScore;
};

export type MonitoringTypes = {
  ResourceTiming: ResourceTiming;
  BundleAnalysis: BundleAnalysis;
  FrameMetrics: FrameMetrics;
  MemoryMonitoring: MemoryMonitoring;
  CPUMetrics: CPUMetrics;
};

export type DiagnosticTypes = {
  DiagnosticConfig: DiagnosticConfig;
  PerformanceThresholds: PerformanceThresholds;
  PerformanceAlert: PerformanceAlert;
  PerformanceSession: PerformanceSession;
};

export type FrameworkTypes = {
  ReactPerformanceMetrics: ReactPerformanceMetrics;
  VuePerformanceMetrics: VuePerformanceMetrics;
};

export type AnalyticsTypes = {
  PerformanceAnalytics: PerformanceAnalytics;
  MetricTrend: MetricTrend;
  PerformanceIssue: PerformanceIssue;
  ReportConfig: ReportConfig;
};
