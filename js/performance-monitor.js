/**
 * Performance Monitoring for CTWR Website
 * Tracks Core Web Vitals and memory usage
 * @author CivicTechWR
 * @version 2.0.0
 */

'use strict';

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.memoryThreshold = 50 * 1024 * 1024; // 50MB threshold
    this.init();
  }

  init() {
    this.observeCoreWebVitals();
    this.monitorMemoryUsage();
    this.trackResourceLoading();
  }

  /**
   * Monitor Core Web Vitals
   */
  observeCoreWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.logMetric('LCP', lastEntry.startTime, 'ms');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.logMetric('FID', this.metrics.fid, 'ms');
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
        this.logMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      
      this.metrics.memoryUsed = usedMB;
      this.metrics.memoryTotal = totalMB;

      if (usedMB > 50) {
        console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
        this.optimizeMemory();
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);
    checkMemory(); // Initial check
  }

  /**
   * Track resource loading performance
   */
  trackResourceLoading() {
    if (!('PerformanceObserver' in window)) return;

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 1000) { // Resources taking > 1s
          console.warn(`Slow resource: ${entry.name} (${Math.round(entry.duration)}ms)`);
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });
  }

  /**
   * Optimize memory usage
   */
  optimizeMemory() {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
      console.log('Forced garbage collection');
    }

    // Clear unused event listeners
    this.cleanupEventListeners();
  }

  /**
   * Clean up unused event listeners
   */
  cleanupEventListeners() {
    // This is a simplified cleanup - in a real app you'd track listeners
    const elements = document.querySelectorAll('[data-cleanup]');
    elements.forEach(el => {
      el.removeAttribute('data-cleanup');
    });
  }

  /**
   * Log performance metrics
   */
  logMetric(name, value, unit = '') {
    const threshold = this.getThreshold(name);
    const status = value <= threshold ? '✅' : '⚠️';
    console.log(`${status} ${name}: ${value}${unit}`);
  }

  /**
   * Get performance thresholds
   */
  getThreshold(metric) {
    const thresholds = {
      'LCP': 2500, // 2.5s
      'FID': 100,  // 100ms
      'CLS': 0.1   // 0.1
    };
    return thresholds[metric] || 0;
  }

  /**
   * Get performance report
   */
  getReport() {
    return {
      ...this.metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : null
    };
  }
}

// Initialize performance monitoring
const perfMonitor = new PerformanceMonitor();

// Export for debugging
window.performanceMonitor = perfMonitor;
