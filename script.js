// Performance optimization - debounce scroll events
let scrollTimeout;
function debounce(func, wait) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(scrollTimeout);
            func(...args);
        };
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(later, wait);
    };
}

// Mobile menu toggle with enhanced animation
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    
    // Animate hamburger menu
    const spans = mobileMenu.querySelectorAll('span');
    if (navLinks.classList.contains('mobile-open')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            
            window.scrollTo({
                top: target.offsetTop - headerHeight,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('mobile-open')) {
                navLinks.classList.remove('mobile-open');
                const spans = mobileMenu.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        }
    });
});

// Enhanced fade in animation on scroll with optimized observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Optimized header background change on scroll
const header = document.querySelector('header');
const handleScroll = debounce(() => {
    const scrolled = window.scrollY;
    
    if (scrolled > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

// Enhanced newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const button = this.querySelector('.newsletter-btn');
        const input = this.querySelector('.newsletter-input');
        const originalText = button.textContent;
        
        // Validate email
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showMessage('Please enter your email address.', 'error');
            input.focus();
            return;
        }
        
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            input.focus();
            return;
        }
        
        button.textContent = 'Joining...';
        button.style.opacity = '0.7';
        button.disabled = true;
        input.disabled = true;
        
        setTimeout(() => {
            showMessage('Welcome to our exclusive circle! You will receive premium insights and luxury digital trends.', 'success');
            button.textContent = originalText;
            button.style.opacity = '1';
            button.disabled = false;
            input.disabled = false;
            this.reset();
        }, 1500);
    });
}

// Enhanced contact form submission with validation
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const button = this.querySelector('.submit-btn');
        const originalText = button.textContent;
        
        // Get all form fields
        const nameField = this.querySelector('input[type="text"]');
        const emailField = this.querySelector('input[type="email"]');
        const phoneField = this.querySelector('input[type="tel"]');
        const serviceField = this.querySelector('select');
        const messageField = this.querySelector('textarea');
        
        // Validation
        let isValid = true;
        let firstErrorField = null;
        
        // Reset all field styles
        [nameField, emailField, phoneField, serviceField, messageField].forEach(field => {
            if (field) {
                field.style.borderColor = 'rgba(102, 126, 234, 0.2)';
            }
        });
        
        // Validate name
        if (!nameField.value.trim()) {
            nameField.style.borderColor = '#f093fb';
            isValid = false;
            if (!firstErrorField) firstErrorField = nameField;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailField.value.trim()) {
            emailField.style.borderColor = '#f093fb';
            isValid = false;
            if (!firstErrorField) firstErrorField = emailField;
        } else if (!emailRegex.test(emailField.value.trim())) {
            emailField.style.borderColor = '#f093fb';
            isValid = false;
            if (!firstErrorField) firstErrorField = emailField;
        }
        
        // Validate service selection
        if (serviceField.selectedIndex === 0) {
            serviceField.style.borderColor = '#f093fb';
            isValid = false;
            if (!firstErrorField) firstErrorField = serviceField;
        }
        
        // Validate message
        if (!messageField.value.trim()) {
            messageField.style.borderColor = '#f093fb';
            isValid = false;
            if (!firstErrorField) firstErrorField = messageField;
        }
        
        if (!isValid) {
            showMessage('Please fill in all required fields correctly.', 'error');
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }
        
        // Disable form during submission
        const formElements = this.querySelectorAll('input, select, textarea, button');
        formElements.forEach(element => {
            element.disabled = true;
        });
        
        button.textContent = 'Sending...';
        button.style.opacity = '0.7';
        
        setTimeout(() => {
            showMessage('Thank you for your inquiry! Our luxury consultation team will contact you within 24 hours to discuss your premium digital journey.', 'success');
            button.textContent = originalText;
            button.style.opacity = '1';
            
            // Re-enable form elements
            formElements.forEach(element => {
                element.disabled = false;
            });
            
            this.reset();
            
            // Reset select field appearance
            serviceField.selectedIndex = 0;
        }, 2000);
    });
}

// Message display function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease-out;
        ${type === 'success' 
            ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' 
            : 'background: linear-gradient(135deg, #f093fb 0%, #ff6b6b 100%);'
        }
    `;
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 5000);
}

// Optimized parallax effect for hero section
let ticking = false;
const hero = document.querySelector('.hero');

const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
    ticking = false;
};

const requestParallax = () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
};

window.addEventListener('scroll', requestParallax, { passive: true });

// Optimized cursor effect with reduced frequency
let cursorTimeout;
document.addEventListener('mousemove', (e) => {
    if (cursorTimeout) return;
    
    cursorTimeout = setTimeout(() => {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-purple);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.6;
            animation: fadeOut 0.8s ease-out forwards;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
        `;
        document.body.appendChild(cursor);
        
        setTimeout(() => cursor.remove(), 800);
        cursorTimeout = null;
    }, 50);
});

// Preload critical resources
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
preloadLink.as = 'style';
document.head.appendChild(preloadLink);

// Optimize animations based on user preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// Service worker registration for better performance (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if we have a service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}