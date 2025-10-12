'use strict';

// PRE LOADER - Fade out preloader on page load
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 1s';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 1000);
  }
});

// SMOOTH SCROLL - Custom links with smooth scrolling
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
