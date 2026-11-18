// public/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  // Highlight active navigation tab
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath || (currentPath.startsWith(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
  });

  // Smooth tab switching transition
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');

    // Only apply to internal navigation links (not downloads, external, or hashes)
    if (
      href &&
      href.startsWith('/') &&
      !href.startsWith('//') &&
      !link.hasAttribute('download') &&
      link.target !== '_blank'
    ) {
      if (window.location.pathname === href) return; // Already on this tab

      const container = document.querySelector('.container');
      if (container) {
        e.preventDefault();
        container.classList.add('page-exit');
        setTimeout(() => {
          window.location.href = href;
        }, 120);
      }
    }
  });
});

// Ensure clean state when navigating via browser back/forward buttons
window.addEventListener('pageshow', () => {
  const container = document.querySelector('.container');
  if (container) {
    container.classList.remove('page-exit');
  }
});
