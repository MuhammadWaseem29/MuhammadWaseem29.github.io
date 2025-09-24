// Minimal script.js for portfolio site
document.addEventListener('DOMContentLoaded', () => {
  // Add fade-in effect
  document.body.classList.add('fade-in');
  
  // Reset any scroll blocking that might have persisted
  document.body.style.overflow = '';
  
  // Mobile navigation setup
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      
      // Add body class to prevent scrolling when menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});

// Blog Functions
function loadBlogPosts() {
    const filteredPosts = currentFilter === 'all' 
        ? blogPosts 
        : blogPosts.filter(post => post.category === currentFilter);
    
    const postsToShow = filteredPosts.slice(0, displayedPosts);
    
    blogGrid.innerHTML = '';
    
    if (postsToShow.length === 0) {
        blogGrid.innerHTML = '<div class="no-posts"><p>No posts found for this category.</p></div>';
        return;
    }

    postsToShow.forEach(post => {
        const postElement = createBlogCard(post);
        blogGrid.appendChild(postElement);
    });

    // Show/hide load more button
    loadMoreBtn.style.display = postsToShow.length < filteredPosts.length ? 'inline-block' : 'none';
}

function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.setAttribute('data-category', post.category);
    
    const severityColor = getSeverityColor(post.severity);
    const categoryIcon = getCategoryIcon(post.category);
    
    card.innerHTML = `
        <div class="blog-card-image">
            <i class="${categoryIcon}"></i>
        </div>
        <div class="blog-card-content">
            <div class="blog-card-meta">
                <span class="blog-tag">${post.category.toUpperCase()}</span>
                <span class="blog-date">${formatDate(post.date)}</span>
            </div>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="post-stats">
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>${post.readTime}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-exclamation-triangle" style="color: ${severityColor}"></i>
                    <span style="color: ${severityColor}">${post.severity}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${post.bounty}</span>
                </div>
            </div>
            <a href="post.html?id=${post.id}" class="read-more">
                Read Full Writeup <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    return card;
}

function getSeverityColor(severity) {
    const colors = {
        'Critical': '#ff4757',
        'High': '#ff6b7a',
        'Medium': '#ffa502',
        'Low': '#2ed573'
    };
    return colors[severity] || '#666';
}

function getCategoryIcon(category) {
    const icons = {
        'xss': 'fas fa-code',
        'sqli': 'fas fa-database',
        'rce': 'fas fa-terminal',
        'idor': 'fas fa-key',
        'csrf': 'fas fa-shield-alt'
    };
    return icons[category] || 'fas fa-bug';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Event Listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update filter and reload posts
            currentFilter = button.getAttribute('data-filter');
            displayedPosts = 3;
            loadBlogPosts();
        });
    });

    // Load more button
    loadMoreBtn.addEventListener('click', () => {
        displayedPosts += 3;
        loadBlogPosts();
    });

    // Mobile navigation is now handled in the DOMContentLoaded event

    // Contact form
    contactForm.addEventListener('submit', handleFormSubmit);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }, 1500);
}

// Scroll effects
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe blog cards and sections
    document.querySelectorAll('.blog-card, .about-content, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Typing animation for hero section
function setupTypingAnimation() {
    const phrases = [
        'Bug Bounty Hunter',
        'Security Researcher',
        'Ethical Hacker',
        'Vulnerability Hunter'
    ];
    
    const heroTitle = document.querySelector('.hero h1');
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function typeAnimation() {
        const current = phrases[currentPhrase];
        
        if (isDeleting) {
            heroTitle.textContent = current.substring(0, currentChar - 1);
            currentChar--;
        } else {
            heroTitle.textContent = current.substring(0, currentChar + 1);
            currentChar++;
        }
        
        let speed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentChar === current.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
            speed = 500; // Pause before next phrase
        }
        
        setTimeout(typeAnimation, speed);
    }
    
    // Start typing animation after page load
    setTimeout(typeAnimation, 1000);
}

// Add additional styling to post stats
const additionalStyles = `
<style>
.post-stats {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.9rem;
    color: #ccc;
}

.stat-item i {
    font-size: 0.8rem;
}

.no-posts {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: #666;
}

@media (max-width: 768px) {
    .post-stats {
        gap: 0.5rem;
    }
    
    .stat-item {
        font-size: 0.8rem;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Enhanced Blog Animations
function initBlogAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe blog cards
    document.querySelectorAll('.blog-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.8s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Add hover sound effect simulation
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Enhanced scroll animations
function initScrollAnimations() {
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.blog-card, .achievement, .about-content').forEach(el => {
        animateOnScroll.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBlogAnimations();
    initScrollAnimations();
    
    // Add typing effect to blog section title
    const blogTitle = document.querySelector('#blogs h3');
    if (blogTitle) {
        const originalText = blogTitle.textContent;
        blogTitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < originalText.length) {
                blogTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                observer.disconnect();
            }
        });
        
        observer.observe(blogTitle);
    }
});