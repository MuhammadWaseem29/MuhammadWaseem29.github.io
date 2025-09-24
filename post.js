// post.js - JavaScript for the post.html page
document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }
  
  console.log('Post page loaded with mobile navigation');
});
