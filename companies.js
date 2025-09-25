// Enhanced Companies Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Add intersection observer for companies section animation
    const companiesSection = document.querySelector('.companies');
    const companyLogos = document.querySelectorAll('.company-logo');
    const statsItems = document.querySelectorAll('.stat-item');
    
    // Enhanced image loading error handling with multiple fallback attempts
    companyLogos.forEach(logo => {
        const img = logo.querySelector('img');
        if (img) {
            // Set data attribute for CSS fallback
            logo.setAttribute('data-company', img.alt);
            
            img.addEventListener('error', function() {
                console.log('Failed to load logo for:', this.alt);
                
                // Try alternative logo sources
                const companyName = this.alt.toLowerCase().replace(/\s+/g, '');
                const fallbackSources = [
                    `https://logo.clearbit.com/${companyName}.com`,
                    `https://img.logo.dev/${companyName}.com?token=pk_X9kJHnZYTembYzDKrGbClQ`,
                    `https://api.unisvg.com/v2/svg?url=${companyName}.com&format=png&size=lg`
                ];
                
                let attemptIndex = 0;
                const tryNextSource = () => {
                    if (attemptIndex < fallbackSources.length) {
                        this.src = fallbackSources[attemptIndex];
                        attemptIndex++;
                    } else {
                        // Final fallback: create text-based logo
                        this.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'company-fallback';
                        fallback.innerHTML = `<span>${this.alt}</span>`;
                        fallback.style.cssText = `
                            width: 100px;
                            height: 60px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,200,150,0.2));
                            border: 2px solid rgba(0,200,150,0.3);
                            border-radius: 8px;
                            color: rgba(255,255,255,0.9);
                            font-size: 0.7rem;
                            font-weight: 600;
                            text-align: center;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            transition: all 0.3s ease;
                        `;
                        
                        // Add hover effect to fallback
                        fallback.addEventListener('mouseenter', () => {
                            fallback.style.transform = 'scale(1.05)';
                            fallback.style.background = 'linear-gradient(135deg, rgba(0,200,150,0.2), rgba(0,200,150,0.3))';
                        });
                        fallback.addEventListener('mouseleave', () => {
                            fallback.style.transform = 'scale(1)';
                            fallback.style.background = 'linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,200,150,0.2))';
                        });
                        
                        this.parentNode.appendChild(fallback);
                    }
                };
                
                // Remove previous error listener to prevent infinite loop
                this.removeEventListener('error', arguments.callee);
                this.addEventListener('error', tryNextSource, { once: true });
                tryNextSource();
            });
            
            // Add loading success feedback
            img.addEventListener('load', function() {
                console.log('Successfully loaded logo for:', this.alt);
                this.style.opacity = '1';
            });
            
            // Initially set opacity to 1 for immediate visibility
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe companies section
    if (companiesSection) {
        observer.observe(companiesSection);
    }
    
    // Add hover effects for company logos
    companyLogos.forEach((logo, index) => {
        logo.addEventListener('mouseenter', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        // Add click effect
        logo.addEventListener('click', function(e) {
            const companyName = this.querySelector('img').alt;
            
            // Show company info (you can customize this)
            showCompanyInfo(companyName, e);
        });
    });
    
    // Stats counter animation
    function animateStats() {
        statsItems.forEach(stat => {
            const numberElement = stat.querySelector('.stat-number');
            const targetValue = numberElement.textContent;
            
            if (targetValue.includes('+')) {
                const numericValue = parseInt(targetValue.replace(/\D/g, ''));
                animateNumber(numberElement, 0, numericValue, targetValue.includes('K') ? 'K+' : '+', 1500);
            } else if (targetValue.includes('Top')) {
                // For "Top 1000", we'll just add a class for animation
                numberElement.classList.add('pulse-animation');
            }
        });
    }
    
    // Number animation function
    function animateNumber(element, start, end, suffix, duration) {
        const range = end - start;
        const startTime = Date.now();
        
        function updateNumber() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (range * easeOut));
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        updateNumber();
    }
    
    // Show company info function (placeholder)
    function showCompanyInfo(companyName, event) {
        // Create a simple tooltip or modal
        const tooltip = document.createElement('div');
        tooltip.className = 'company-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>${companyName}</h4>
                <p>Security vulnerabilities discovered and responsibly disclosed</p>
                <span class="tooltip-arrow"></span>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = event.target.closest('.company-logo').getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 10 + 'px';
        
        // Remove tooltip after delay
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 2000);
    }
    
    // Trigger stats animation when companies section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (companiesSection) {
        statsObserver.observe(companiesSection);
    }
    
    // Add scroll effect for company logos
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        companyLogos.forEach((logo, index) => {
            const rate = scrolled * -0.5;
            logo.style.transform = `translateY(${rate * 0.1}px) scale(1)`;
        });
    });
});

// Add CSS for tooltip and animations
const additionalCSS = `
    .company-tooltip {
        position: fixed;
        transform: translateX(-50%) translateY(-100%);
        z-index: 1000;
        pointer-events: none;
    }
    
    .tooltip-content {
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--primary);
        backdrop-filter: blur(10px);
        animation: tooltipFadeIn 0.3s ease-out;
    }
    
    .tooltip-content h4 {
        margin: 0 0 0.5rem 0;
        color: var(--primary);
    }
    
    .tooltip-content p {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.8;
    }
    
    .tooltip-arrow {
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid var(--primary);
    }
    
    @keyframes tooltipFadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 200, 150, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        width: 100px;
        height: 100px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
    }
    
    @keyframes rippleEffect {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    .pulse-animation {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);