document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section[id]');

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

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                navMenu.classList.remove('active');
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
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

    const animateElements = document.querySelectorAll('.service-card, .stat-card, .resource-card');
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

    const highlightActiveSection = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightActiveSection);

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

    const counters = document.querySelectorAll('.stat-card h3');
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const steps = 50;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
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
        if (counter.textContent.match(/\d/)) {
            const originalValue = counter.textContent;
            counter.textContent = '0' + counter.textContent.replace(/[0-9]/g, '');
            counter.setAttribute('data-target', originalValue);
            counterObserver.observe(counter);
        }
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

    if (window.innerWidth > 768) {
        setInterval(createParticle, 3000);
    }

    console.log('SPARC website initialized successfully!');
});