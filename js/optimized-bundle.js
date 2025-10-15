/**
 * Optimized JavaScript Bundle for CTWR Website
 * Combines all essential functionality with performance optimizations
 * @author CivicTechWR
 * @version 2.0.0
 */

'use strict';

// ============================================================================
// CONFIGURATION & UTILITIES
// ============================================================================

const CONFIG = {
  preloaderFadeDuration: 1000,
  scrollAnimationDuration: 300,
  navbarOffset: 90,
  sectionIds: ['section_1', 'section_3', 'section_4']
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function to delay function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// ============================================================================
// PRELOADER MANAGEMENT
// ============================================================================

/**
 * Handle preloader fade out
 */
function initPreloader() {
  window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.transition = `opacity ${CONFIG.preloaderFadeDuration}ms`;
      setTimeout(() => {
        preloader.style.display = 'none';
      }, CONFIG.preloaderFadeDuration);
    }
  });
}

// ============================================================================
// SMOOTH SCROLLING
// ============================================================================

/**
 * Initialize smooth scrolling for custom links
 */
function initSmoothScroll() {
  document.addEventListener('DOMContentLoaded', () => {
    const customLinks = document.querySelectorAll('.custom-link');

    customLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const navbar = document.querySelector('.navbar');
          const headerHeight = navbar ? navbar.offsetHeight + 10 : 10;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  });
}

// ============================================================================
// NAVIGATION SCROLL HANDLING
// ============================================================================

let navbarLinks = null;
let sections = null;

/**
 * Initialize scroll-based navigation
 */
function initScrollNavigation() {
  // Cache DOM elements
  navbarLinks = document.querySelectorAll('.navbar-nav .nav-item .nav-link');
  sections = CONFIG.sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  
  // Only proceed if we have the required sections
  if (sections.length === 0) {
    return;
  }

  // Set up throttled scroll listener
  const handleScroll = throttle(updateActiveNav, 16); // ~60fps
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Set up click handlers
  setupClickHandlers();
  
  // Set initial state
  setInitialNavState();
}

/**
 * Update active navigation based on scroll position
 */
function updateActiveNav() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPosition = scrollTop + 1;

  sections.forEach((section, index) => {
    if (!section) return;

    const sectionTop = section.offsetTop - CONFIG.navbarOffset;
    
    if (scrollPosition >= sectionTop) {
      // Remove active class from all links
      navbarLinks.forEach(link => {
        link.classList.remove('active');
        link.classList.add('inactive');
      });
      
      // Add active class to current section's link
      if (navbarLinks[index]) {
        navbarLinks[index].classList.add('active');
        navbarLinks[index].classList.remove('inactive');
      }
    }
  });
}

/**
 * Set up click handlers for navigation links
 */
function setupClickHandlers() {
  const clickScrollLinks = document.querySelectorAll('.click-scroll');
  
  clickScrollLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetSection = sections[index];
      if (!targetSection) return;
      
      const targetPosition = targetSection.offsetTop - CONFIG.navbarOffset;
      
      // Smooth scroll to target
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Set initial navigation state
 */
function setInitialNavState() {
  // Add inactive class to all links
  navbarLinks.forEach(link => {
    link.classList.add('inactive');
  });
  
  // Set first link as active
  if (navbarLinks[0]) {
    navbarLinks[0].classList.add('active');
    navbarLinks[0].classList.remove('inactive');
  }
}

// ============================================================================
// MEETING EVENT MANAGEMENT
// ============================================================================

/**
 * Calculate the next occurrence of a specific day of week
 * @param {Date} date - Starting date
 * @param {number} dayOfWeek - Target day (0=Sunday, 3=Wednesday)
 * @returns {Date} Next occurrence of that day
 */
function getNextDayOfWeek(date, dayOfWeek) {
  const resultDate = new Date(date.getTime());
  resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
  // If it's the same day, get next week
  if (resultDate.getDate() === date.getDate()) {
    resultDate.setDate(date.getDate() + 7);
  }
  return resultDate;
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate upcoming event data dynamically based on current date
 * This ensures meeting dates are always accurate without manual updates
 */
function generateUpcomingEvents() {
  const today = new Date();
  const nextWednesday = getNextDayOfWeek(today, 3); // 3 = Wednesday
  const followingWednesday = new Date(nextWednesday);
  followingWednesday.setDate(nextWednesday.getDate() + 7);

  return [
    {
      name: "CTWR Weekly Hacknight",
      local_date: formatDate(nextWednesday),
      local_time: "18:00",
      venue: { name: "Downtown Kitchener" },
      link: "https://www.meetup.com/civictechwr/events/",
    },
    {
      name: "CivicTech Waterloo Region Hacknight",
      local_date: formatDate(followingWednesday),
      local_time: "18:00",
      venue: { name: "Downtown Kitchener" },
      link: "https://www.meetup.com/civictechwr/events/",
    },
  ];
}

const upcomingEvents = generateUpcomingEvents();

/**
 * Parse date and time strings into a JavaScript Date object
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} timeString - Time in HH:MM format
 * @returns {Date} Parsed date object
 */
function parseDateTime(dateString, timeString) {
  const [year, month, day] = dateString.split("-");
  const [hours, minutes] = timeString.split(":");
  return new Date(year, month - 1, day, hours, minutes);
}

/**
 * Display event information in the meeting section
 * @param {Object} event - Event object with name, date, time, venue, and link
 */
function displayEvent(event) {
  const date = parseDateTime(event.local_date, event.local_time);
  const dateString = date.toLocaleString("en-US", {
    weekday: "long",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });
  const venue = event.venue ? event.venue.name : "Venue TBD";

  const meetingName = document.getElementById("meeting-name");
  const meetingDateTime = document.getElementById("meeting-date-time");
  const meetingLocation = document.getElementById("meeting-location");
  const meetingBtn = document.getElementById("meeting-btn");

  if (meetingName) meetingName.textContent = event.name;
  if (meetingDateTime) meetingDateTime.textContent = dateString;
  if (meetingLocation) meetingLocation.textContent = venue;
  if (meetingBtn) meetingBtn.setAttribute("href", event.link);
}

/**
 * Initialize meeting event display
 */
function initMeetingEvents() {
  const initializeMeeting = () => {
    // Use sample data directly (Meetup API requires authentication)
    // This ensures the site works reliably without external dependencies
    if (upcomingEvents.length > 0) {
      displayEvent(upcomingEvents[0]);
    }
  };

  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMeeting);
  } else {
    // DOM is already loaded, initialize immediately
    initializeMeeting();
  }
}

// ============================================================================
// PROJECT CARDS MANAGEMENT
// ============================================================================

/**
 * Initialize project cards functionality
 */
function initProjectCards() {
  document.addEventListener('DOMContentLoaded', () => {
    // Add any project-specific functionality here
    // Currently handled by add-view-all-card.js
  });
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Performance monitoring class
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.memoryThreshold = 50 * 1024 * 1024; // 50MB threshold
  }

  init() {
    this.observeCoreWebVitals();
    this.monitorMemoryUsage();
  }

  observeCoreWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

    } catch (error) {
      // Silently fail if not supported
    }
  }

  monitorMemoryUsage() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      
      if (usedMB > 50) {
        console.warn(`High memory usage: ${usedMB}MB`);
        if (window.gc) window.gc();
      }
    };

    setInterval(checkMemory, 30000);
    checkMemory();
  }
}

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

/**
 * Initialize intersection observer for lazy loading
 */
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
  const monitor = new PerformanceMonitor();
  monitor.init();
  
  // Export for debugging
  window.performanceMonitor = monitor;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all functionality
 */
function init() {
  // Core functionality
  initPreloader();
  initSmoothScroll();
  initScrollNavigation();
  initMeetingEvents();
  initProjectCards();
  
  // Performance optimizations
  initLazyLoading();
  initPerformanceMonitoring();
}

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
