/**
 * Enhanced Build Diagnostics and Error Reporting
 * 
 * This utility provides comprehensive error reporting, performance monitoring,
 * and build diagnostics for better debugging and problem resolution.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// DIAGNOSTIC UTILITIES
// =============================================================================

/**
 * Enhanced logger with timestamps and categorization
 */
export class DiagnosticLogger {
  constructor(category = 'BUILD') {
    this.category = category;
    this.startTime = Date.now();
    this.errors = [];
    this.warnings = [];
    this.metrics = {};
  }

  _formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const prefix = this._getPrefix(level);
    return `${prefix} [${this.category}] [+${elapsed}s] ${message}`;
  }

  _getPrefix(level) {
    const prefixes = {
      error: '🔴 ERROR',
      warn: '🟡 WARN ',
      info: '🔵 INFO ',
      success: '🟢 OK   ',
      debug: '🔍 DEBUG',
      perf: '⚡ PERF '
    };
    return prefixes[level] || '📝 LOG  ';
  }

  error(message, error = null) {
    const formattedMessage = this._formatMessage('error', message);
    console.error(formattedMessage);
    
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null
    };
    
    this.errors.push(errorEntry);
    this._writeErrorLog(errorEntry);
  }

  warn(message) {
    const formattedMessage = this._formatMessage('warn', message);
    console.warn(formattedMessage);
    this.warnings.push({
      timestamp: new Date().toISOString(),
      message
    });
  }

  info(message) {
    console.log(this._formatMessage('info', message));
  }

  success(message) {
    console.log(this._formatMessage('success', message));
  }

  debug(message) {
    if (process.env.NODE_ENV === 'development' || process.env.VERBOSE_LOGS) {
      console.log(this._formatMessage('debug', message));
    }
  }

  perf(label, duration) {
    const message = `${label}: ${duration}ms`;
    console.log(this._formatMessage('perf', message));
    this.metrics[label] = duration;
  }

  _writeErrorLog(errorEntry) {
    try {
      const logDir = path.join(__dirname, '.logs');
      const logFile = path.join(logDir, 'build-errors.json');
      
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      let existingLogs = [];
      if (fs.existsSync(logFile)) {
        try {
          existingLogs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        } catch (e) {
          // If log file is corrupted, start fresh
          existingLogs = [];
        }
      }
      
      existingLogs.push(errorEntry);
      
      // Keep only last 100 errors
      if (existingLogs.length > 100) {
        existingLogs = existingLogs.slice(-100);
      }
      
      fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));
    } catch (writeError) {
      console.error('Failed to write error log:', writeError.message);
    }
  }

  getSummary() {
    return {
      category: this.category,
      duration: Date.now() - this.startTime,
      errors: this.errors.length,
      warnings: this.warnings.length,
      metrics: this.metrics
    };
  }
}

// =============================================================================
// BUILD PERFORMANCE MONITORING
// =============================================================================

export class PerformanceMonitor {
  constructor() {
    this.timers = new Map();
    this.measurements = [];
  }

  start(label) {
    this.timers.set(label, Date.now());
  }

  end(label) {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Performance timer '${label}' was not started`);
      return 0;
    }
    
    const duration = Date.now() - startTime;
    this.timers.delete(label);
    
    const measurement = {
      label,
      duration,
      timestamp: new Date().toISOString()
    };
    
    this.measurements.push(measurement);
    return duration;
  }

  getReport() {
    const totalDuration = this.measurements.reduce((sum, m) => sum + m.duration, 0);
    const slowest = this.measurements.reduce((prev, current) => 
      (prev.duration > current.duration) ? prev : current, { duration: 0 });
    
    return {
      totalDuration,
      averageDuration: totalDuration / this.measurements.length || 0,
      slowestOperation: slowest,
      allMeasurements: this.measurements
    };
  }
}

// =============================================================================
// DEPENDENCY ANALYZER
// =============================================================================

export class DependencyAnalyzer {
  constructor(logger) {
    this.logger = logger;
  }

  async analyzeDependencies() {
    try {
      const packageJsonPath = path.join(__dirname, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const analysis = {
        dependencies: Object.keys(packageJson.dependencies || {}),
        devDependencies: Object.keys(packageJson.devDependencies || {}),
        peerDependencies: Object.keys(packageJson.peerDependencies || {}),
        total: 0
      };
      
      analysis.total = analysis.dependencies.length + 
                     analysis.devDependencies.length + 
                     analysis.peerDependencies.length;
      
      this.logger.info(`Analyzed ${analysis.total} dependencies`);
      this.logger.debug(`Production: ${analysis.dependencies.length}, Dev: ${analysis.devDependencies.length}`);
      
      // Check for potential issues
      this._checkForIssues(analysis, packageJson);
      
      return analysis;
    } catch (error) {
      this.logger.error('Failed to analyze dependencies', error);
      return null;
    }
  }

  _checkForIssues(analysis, packageJson) {
    // Check for missing peer dependencies
    const peerDeps = packageJson.peerDependencies || {};
    const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const peerDep of Object.keys(peerDeps)) {
      if (!installedDeps[peerDep]) {
        this.logger.warn(`Missing peer dependency: ${peerDep}`);
      }
    }

    // Check for duplicate frameworks
    const frameworks = ['react', 'vue', 'svelte', 'solid-js', 'preact'];
    const installedFrameworks = frameworks.filter(fw => installedDeps[fw]);
    
    if (installedFrameworks.length > 3) {
      this.logger.warn(`Multiple UI frameworks detected: ${installedFrameworks.join(', ')}`);
      this.logger.warn('This may increase bundle size. Consider using only what you need.');
    }
  }
}

// =============================================================================
// FILE SYSTEM ANALYZER
// =============================================================================

export class FileSystemAnalyzer {
  constructor(logger) {
    this.logger = logger;
  }

  analyzeProject() {
    try {
      const analysis = {
        components: this._analyzeDirectory('src/components'),
        pages: this._analyzeDirectory('src/pages'),
        assets: this._analyzeDirectory('public'),
        lib: this._analyzeDirectory('src/lib'),
        total: 0
      };
      
      analysis.total = Object.values(analysis).reduce((sum, dir) => 
        sum + (typeof dir === 'object' ? dir.fileCount : 0), 0);
      
      this.logger.info(`Project contains ${analysis.total} files`);
      this._logDirectoryStats(analysis);
      
      return analysis;
    } catch (error) {
      this.logger.error('Failed to analyze project structure', error);
      return null;
    }
  }

  _analyzeDirectory(dirPath) {
    const fullPath = path.join(__dirname, dirPath);
    
    if (!fs.existsSync(fullPath)) {
      return { fileCount: 0, size: 0, types: {} };
    }
    
    const stats = {
      fileCount: 0,
      size: 0,
      types: {}
    };
    
    const files = this._getAllFiles(fullPath);
    
    for (const file of files) {
      try {
        const fileStat = fs.statSync(file);
        const ext = path.extname(file).toLowerCase();
        
        stats.fileCount++;
        stats.size += fileStat.size;
        stats.types[ext] = (stats.types[ext] || 0) + 1;
      } catch (error) {
        this.logger.warn(`Failed to stat file: ${file}`);
      }
    }
    
    return stats;
  }

  _getAllFiles(dirPath, files = []) {
    try {
      const entries = fs.readdirSync(dirPath);
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this._getAllFiles(fullPath, files);
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Silently ignore permission errors
    }
    
    return files;
  }

  _logDirectoryStats(analysis) {
    for (const [dir, stats] of Object.entries(analysis)) {
      if (typeof stats === 'object' && stats.fileCount) {
        const sizeKB = (stats.size / 1024).toFixed(1);
        this.logger.debug(`${dir}: ${stats.fileCount} files (${sizeKB}KB)`);
        
        const topTypes = Object.entries(stats.types)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([ext, count]) => `${ext}(${count})`)
          .join(' ');
        
        if (topTypes) {
          this.logger.debug(`  └─ Top types: ${topTypes}`);
        }
      }
    }
  }
}

// =============================================================================
// MAIN DIAGNOSTIC RUNNER
// =============================================================================

export async function runDiagnostics() {
  const logger = new DiagnosticLogger('DIAGNOSTICS');
  const perfMonitor = new PerformanceMonitor();
  
  logger.info('Starting comprehensive project diagnostics...');
  
  try {
    // Analyze dependencies
    perfMonitor.start('dependency-analysis');
    const depAnalyzer = new DependencyAnalyzer(logger);
    await depAnalyzer.analyzeDependencies();
    const depDuration = perfMonitor.end('dependency-analysis');
    logger.perf('Dependency Analysis', depDuration);
    
    // Analyze file system
    perfMonitor.start('filesystem-analysis');
    const fsAnalyzer = new FileSystemAnalyzer(logger);
    fsAnalyzer.analyzeProject();
    const fsDuration = perfMonitor.end('filesystem-analysis');
    logger.perf('Filesystem Analysis', fsDuration);
    
    // Generate report
    const report = perfMonitor.getReport();
    const summary = logger.getSummary();
    
    logger.success('Diagnostics completed successfully');
    logger.info(`Total analysis time: ${report.totalDuration}ms`);
    
    if (summary.errors > 0) {
      logger.warn(`Found ${summary.errors} errors - check .logs/build-errors.json for details`);
    }
    
    return { report, summary };
    
  } catch (error) {
    logger.error('Diagnostics failed', error);
    throw error;
  }
}

// =============================================================================
// ERROR RECOVERY UTILITIES
// =============================================================================

export function createErrorRecoveryPlugin() {
  return {
    name: 'error-recovery',
    configResolved(config) {
      const logger = new DiagnosticLogger('ERROR-RECOVERY');
      
      // Override error handling
      const originalOnError = config.logger?.error || console.error;
      
      config.logger = {
        ...config.logger,
        error: (msg, options) => {
          logger.error(`Vite Error: ${msg}`, options?.error);
          
          // Attempt error recovery
          if (msg.includes('Could not resolve')) {
            logger.info('Attempting to resolve import issue...');
            // Add recovery logic here
          }
          
          originalOnError(msg, options);
        }
      };
    }
  };
}

// Export singleton instances
export const globalLogger = new DiagnosticLogger('GLOBAL');
export const performanceMonitor = new PerformanceMonitor();
