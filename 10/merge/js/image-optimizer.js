/**
 * Image Optimization and Lazy Loading
 * Reduces memory footprint by loading images only when needed
 */

'use strict';

class ImageOptimizer {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Create intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );

      // Observe all images with data-src attribute
      this.observeImages();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  observeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => this.observer.observe(img));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.observer.unobserve(img);
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      // Create a new image to preload
      const newImg = new Image();
      
      newImg.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      };

      newImg.onerror = () => {
        console.warn('Failed to load image:', src);
        img.classList.add('error');
      };

      newImg.src = src;
    }
  }

  loadAllImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => this.loadImage(img));
  }

  // Optimize existing images
  optimizeExistingImages() {
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
      // Add loading="lazy" if not present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  // Preload critical images
  preloadCriticalImages() {
    const criticalImages = [
      '/images/hacknight-8.webp',
      '/images/logos/civictechwr_logo_white.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ImageOptimizer();
  });
} else {
  new ImageOptimizer();
}
