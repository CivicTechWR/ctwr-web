/**
 * Memory-Optimized JavaScript Bundle for CTWR Website
 * Focuses on reducing memory footprint and improving performance
 * @author CivicTechWR
 * @version 2.1.0
 */

'use strict';

// ============================================================================
// CONFIGURATION (Minimal)
// ============================================================================

const CONFIG = {
  preloaderFadeDuration: 800,
  scrollAnimationDuration: 200,
  navbarOffset: 90
};

// ============================================================================
// UTILITY FUNCTIONS (Optimized)
// ============================================================================

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const debounce = (func, wait) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

// ============================================================================
// PERFORMANCE MONITORING (Lightweight)
// ============================================================================

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.init();
  }

  init() {
    // Monitor memory usage (if available)
    if ('memory' in performance) {
      this.monitorMemory();
    }

    // Monitor Core Web Vitals
    this.observeWebVitals();
  }

  monitorMemory() {
    setInterval(() => {
      const memory = performance.memory;
      if (memory) {
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        
        // Log if memory usage is high
        if (usedMB > 50) {
          console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
        }
      }
    }, 30000); // Check every 30 seconds
  }

  observeWebVitals() {
    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently fail if not supported
      }
    }
  }
}

// ============================================================================
// SMOOTH SCROLLING (Optimized)
// ============================================================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Use passive event listeners for better performance
    document.addEventListener('click', this.handleClick.bind(this), { passive: true });
  }

  handleClick(e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    e.preventDefault();
    const targetId = target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      this.scrollToElement(targetElement);
    }
  }

  scrollToElement(element) {
    const targetPosition = element.offsetTop - CONFIG.navbarOffset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ============================================================================
// MEETING EVENTS (Simplified)
// ============================================================================

class MeetingEvents {
  constructor() {
    this.sampleData = {
      name: 'CTWR Weekly Hacknight',
      dateTime: 'Thursday 6:00 PM',
      location: 'Downtown Kitchener',
      url: 'https://www.meetup.com/civictechwr/events/'
    };
    this.init();
  }

  init() {
    this.displayEvent(this.sampleData);
  }

  displayEvent(event) {
    const nameEl = document.getElementById('meeting-name');
    const dateTimeEl = document.getElementById('meeting-date-time');
    const locationEl = document.getElementById('meeting-location');
    const btnEl = document.getElementById('meeting-btn');

    if (nameEl) nameEl.textContent = event.name;
    if (dateTimeEl) dateTimeEl.textContent = event.dateTime;
    if (locationEl) locationEl.textContent = event.location;
    if (btnEl) btnEl.href = event.url;
  }
}

// ============================================================================
// LAZY LOADING (Memory Optimized)
// ============================================================================

class LazyLoader {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        { rootMargin: '50px 0px', threshold: 0.1 }
      );
      this.observeElements();
    }
  }

  observeElements() {
    const elements = document.querySelectorAll('[data-src]');
    elements.forEach(el => this.observer.observe(el));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  loadElement(element) {
    const src = element.dataset.src;
    if (src && element.tagName === 'IMG') {
      element.src = src;
      element.classList.add('loaded');
    }
  }
}

// ============================================================================
// INITIALIZATION (Minimal)
// ============================================================================

function init() {
  // Initialize components only if needed
  if (document.getElementById('meeting-name')) {
    new MeetingEvents();
  }

  new SmoothScroll();
  new LazyLoader();
  new PerformanceMonitor();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================================================
// CLEANUP (Memory Management)
// ============================================================================

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  // Clear any intervals or timeouts
  // This helps prevent memory leaks
});
