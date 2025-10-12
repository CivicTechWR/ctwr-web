/**
 * Vanilla JavaScript scroll handling
 * Replaces jQuery-based click-scroll.js for better performance
 * @author CivicTechWR
 * @version 2.0.0
 */

'use strict';

// Configuration
const SECTION_IDS = ['section_1', 'section_3', 'section_4'];
const NAVBAR_OFFSET = 90;
const SCROLL_ANIMATION_DURATION = 300;

// Cache DOM elements
let navbarLinks = null;
let sections = null;

/**
 * Initialize scroll handling when DOM is ready
 */
function initScrollHandling() {
  // Cache frequently used elements
  navbarLinks = document.querySelectorAll('.navbar-nav .nav-item .nav-link');
  sections = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean);
  
  // Only proceed if we have the required sections
  if (sections.length === 0) {
    return;
  }

  // Set up scroll listener with throttling
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveNav);
      ticking = true;
    }
  };

  // Set up click handlers
  setupClickHandlers();
  
  // Set initial state
  setInitialNavState();
  
  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Update active navigation based on scroll position
 */
function updateActiveNav() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPosition = scrollTop + 1;

  sections.forEach((section, index) => {
    if (!section) return;

    const sectionTop = section.offsetTop - NAVBAR_OFFSET;
    
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
  
  ticking = false;
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
      
      const targetPosition = targetSection.offsetTop - NAVBAR_OFFSET;
      
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollHandling);
} else {
  initScrollHandling();
}
