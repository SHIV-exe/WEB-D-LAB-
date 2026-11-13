// public/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // If the current URL starts with the link path (and it's not just "/")
    if (currentPath === linkPath || (currentPath.startsWith(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
  });
});