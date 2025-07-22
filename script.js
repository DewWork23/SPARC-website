document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active') 
                ? 'rotate(45deg) translateY(8px)' 
                : 'none';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active') 
                ? 'rotate(-45deg) translateY(-8px)' 
                : 'none';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            console.log('Form submission:', data);
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-100px 0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .stat-card, .resource-card, .pathway-card, .service-preview-card, .approach-card, .value-card, .detailed-service, .update-card, .goal-card, .story-card, .outcome');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    const highlightCurrentPage = () => {
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath || 
                (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html') ||
                (currentPath.endsWith('/index.html') && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    };

    highlightCurrentPage();

    const activeStyle = document.createElement('style');
    activeStyle.textContent = `
        .nav-menu a.active {
            color: var(--primary-color);
            position: relative;
        }
        .nav-menu a.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: var(--primary-color);
        }
    `;
    document.head.appendChild(activeStyle);

    const counters = document.querySelectorAll('.stat-card h3[data-count], .impact-number[data-count]');
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const originalText = counter.textContent;
        
        // Extract prefix and suffix from original text
        const prefix = originalText.match(/^[\$]/) ? '$' : '';
        const suffix = originalText.match(/[%MK\+]+$/) ? originalText.match(/[%MK\+]+$/)[0] : '';
        
        const duration = 2000;
        const steps = 50;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = prefix + target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = prefix + Math.floor(current) + suffix;
            }
        }, duration / steps);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        const originalText = counter.textContent;
        const prefix = originalText.match(/^[\$]/) ? '$' : '';
        const suffix = originalText.match(/[%MK\+]+$/) ? originalText.match(/[%MK\+]+$/)[0] : '';
        counter.textContent = prefix + '0' + suffix;
        counterObserver.observe(counter);
    });

    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            pointer-events: none;
            width: 4px;
            height: 4px;
            background-color: ${Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--secondary-color)'};
            opacity: 0.3;
            border-radius: 50%;
            z-index: -1;
        `;
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const endX = startX + (Math.random() - 0.5) * 200;
        const duration = 15000 + Math.random() * 10000;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: `translate(0, 0)`, opacity: 0.3 },
            { transform: `translate(${endX - startX}px, -${window.innerHeight + 20}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        });
        
        animation.onfinish = () => particle.remove();
    };

    if (window.innerWidth > 768 && document.querySelector('.hero')) {
        setInterval(createParticle, 3000);
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            alert('Thank you for subscribing! We\'ll keep you updated.');
            newsletterForm.reset();
        });
    }

    console.log('SPARC website initialized successfully!');
});