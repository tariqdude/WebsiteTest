/**
 * Centralized Error Handling System
 * Provides consistent error logging, reporting, and user feedback
 */

export interface ErrorInfo {
  message: string;
  component?: string;
  timestamp: Date;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
}

export interface ErrorHandlerOptions {
  logToConsole?: boolean;
  showToast?: boolean;
  reportToService?: boolean;
  fallbackComponent?: string;
}

class ErrorManager {
  private errors: ErrorInfo[] = [];
  private maxErrors = 100;

  /**
   * Log an error with context information
   */
  logError(error: Error | string, component?: string, options: ErrorHandlerOptions = {}): void {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      component,
      timestamp: new Date(),
      stack: typeof error !== 'string' ? error.stack : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // Store error (rotate if too many)
    this.errors.unshift(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console by default
    if (options.logToConsole !== false) {
      console.error(`[${component || 'Unknown'}] ${errorInfo.message}`, errorInfo);
    }

    // Show toast notification if available
    if (options.showToast && typeof window !== 'undefined' && (window as any).toast) {
      (window as any).toast.error(`${component ? `[${component}] ` : ''}${errorInfo.message}`);
    }

    // Report to external service (placeholder)
    if (options.reportToService) {
      this.reportError(errorInfo);
    }
  }

  /**
   * Get recent errors for debugging
   */
  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /**
   * Clear all stored errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Get error summary for dashboard
   */
  getErrorSummary(): { total: number; recent: number; byComponent: Record<string, number> } {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = this.errors.filter(e => e.timestamp > oneHourAgo).length;
    
    const byComponent: Record<string, number> = {};
    this.errors.forEach(error => {
      const component = error.component || 'Unknown';
      byComponent[component] = (byComponent[component] || 0) + 1;
    });

    return {
      total: this.errors.length,
      recent,
      byComponent
    };
  }

  /**
   * Report error to external service (implement as needed)
   */
  private reportError(errorInfo: ErrorInfo): void {
    // Placeholder for external error reporting
    // Could integrate with services like Sentry, LogRocket, etc.
    console.info('Error reported to service:', errorInfo);
  }
}

// Create global instance
export const errorManager = new ErrorManager();

/**
 * Utility function for wrapping async operations with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context?: string,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    errorManager.logError(error as Error, context, { showToast: true });
    return fallback;
  }
}

/**
 * Utility function for wrapping sync operations with error handling
 */
export function safeSync<T>(
  operation: () => T,
  context?: string,
  fallback?: T
): T | undefined {
  try {
    return operation();
  } catch (error) {
    errorManager.logError(error as Error, context, { showToast: true });
    return fallback;
  }
}

/**
 * React-style error boundary for Astro components (using try-catch patterns)
 */
export function withErrorBoundary<T extends Record<string, any>>(
  componentName: string,
  renderFn: (props: T) => string | Promise<string>,
  fallbackHtml = '<div class="error-boundary">Something went wrong</div>'
) {
  return async (props: T): Promise<string> => {
    try {
      const result = await renderFn(props);
      return result;
    } catch (error) {
      errorManager.logError(error as Error, componentName, { showToast: false });
      return fallbackHtml;
    }
  };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  (window as any).errorManager = errorManager;
}
