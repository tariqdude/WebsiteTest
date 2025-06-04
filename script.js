// @ts-check

const carousel = document.querySelector('.case-carousel');
if (carousel) {
    const slides = carousel.querySelectorAll('.case-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let index = 0;

    const dots = Array.from(slides, (_, i) => {
        const b = document.createElement('button');
        b.className = 'carousel-dot';
        b.type = 'button';
        b.setAttribute('aria-label', `Go to slide ${i + 1}`);
        b.addEventListener('click', () => show(i));
        dotsContainer?.appendChild(b);
        return b;
    });

    function show(newIndex) {
        if (newIndex === index) return;
        const update = () => {
            slides[index].classList.remove('active');
            dots[index]?.classList.remove('active');
            index = (newIndex + slides.length) % slides.length;
            slides[index].classList.add('active');
            dots[index]?.classList.add('active');
        };
        if (document.startViewTransition) {
            document.startViewTransition(update);
        } else {
            update();
        }
    }

    prevBtn?.addEventListener('click', () => show(index - 1));
    nextBtn?.addEventListener('click', () => show(index + 1));
    carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') prevBtn?.click();
        if (e.key === 'ArrowRight') nextBtn?.click();
    });
    // activate first dot
    dots[0]?.classList.add('active');
}

// Motion preference check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
}

// Cycle hero tagline text
const heroTyped = document.getElementById('heroTyped');
if (heroTyped) {
    const phrases = [
        'Innovative Designs',
        'Quality Craftsmanship',
        'Timely Delivery'
    ];
    let pIndex = 0;
    let cIndex = 0;
    let deleting = false;

    const type = () => {
        const text = phrases[pIndex];
        if (deleting) {
            heroTyped.textContent = text.slice(0, cIndex--);
            if (cIndex < 0) {
                deleting = false;
                pIndex = (pIndex + 1) % phrases.length;
            }
        } else {
            heroTyped.textContent = text.slice(0, cIndex++);
            if (cIndex > text.length) {
                deleting = true;
                cIndex = text.length;
                setTimeout(type, 1500);
                return;
            }
        }
        setTimeout(type, 120);
    };
    if (!prefersReducedMotion) type();
}

// Simple particle line effect in hero canvas
const canvas = document.getElementById('particleCanvas');
if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = Array.from({ length: 80 }, () => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    function resize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        particles.forEach(p => {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
            p.vx = (Math.random() - 0.5) * 0.5;
            p.vy = (Math.random() - 0.5) * 0.5;
        });
    }
    function draw() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            ctx.fillStyle = 'rgba(31,224,177,0.8)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 80) {
                    ctx.strokeStyle = `rgba(31,224,177,${1 - dist / 80})`;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
}

// Color scheme variants via query params
const params = new URLSearchParams(window.location.search);
const variant = params.get('variant');
if (variant) {
    localStorage.setItem('apex-variant', variant);
}
const savedVariant = localStorage.getItem('apex-variant');
if (savedVariant) {
    document.body.dataset.variant = savedVariant;
}

const counterElements = document.querySelectorAll('.stat-number');
if (!prefersReducedMotion) {
    counterElements.forEach(element => {
        const targetCount = parseInt(element.dataset.count);
        let currentCount = 0;
        const increment = targetCount / 200; // Adjust speed by changing the divisor

        function updateCounter() {
            if (currentCount < targetCount) {
                currentCount += increment;
                element.textContent = Math.ceil(currentCount);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetCount + '+'; // Ensure final value is displayed
            }
        }
        updateCounter();
    });
} else {
    counterElements.forEach(element => {
        const targetCount = parseInt(element.dataset.count);
        element.textContent = targetCount + '+';
    });
}

// Dark mode toggle
const darkToggle = document.getElementById('darkModeToggle');
const themeTip = document.getElementById('themeTip');
if (darkToggle) {
    const storedPreference = localStorage.getItem('dark-mode');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedPreference === 'true' || (storedPreference === null && prefersDarkScheme)) {
        document.body.classList.add('dark-mode');
    }
    darkToggle.setAttribute('aria-pressed', document.body.classList.contains('dark-mode') ? 'true' : 'false');
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const active = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', active);
        darkToggle.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    // Tooltip visibility handled via CSS
}

// Sticky header & back to top button
const header = document.querySelector('.header');
const backToTop = document.getElementById('backToTop');
const scrollProgress = document.getElementById('scrollProgress');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        if (scrollProgress) {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / total) * 100;
            scrollProgress.style.width = progress + '%';
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile navigation
const menuToggle = document.querySelector('[popovertarget="navMenu"]');
const navMenu = document.getElementById('navMenu');
if (menuToggle && navMenu && navMenu.showPopover) {
    const mq = window.matchMedia('(min-width: 768px)');
    function updateNav() {
        if (mq.matches) {
            navMenu.showPopover();
        } else {
            navMenu.hidePopover();
        }
    }
    updateNav();
    mq.addEventListener('change', updateNav);
}

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#navMenu a');
if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    const target = link.getAttribute('href').substring(1);
                    link.classList.toggle('active', target === entry.target.id);
                });
            }
        });
    }, { threshold: 0.6 });
    sections.forEach(sec => sectionObserver.observe(sec));
}

// Reveal sections on scroll
const disableScrollReveal = prefersReducedMotion;
const revealEls = document.querySelectorAll('.reveal');
if (!disableScrollReveal) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    revealEls.forEach(el => revealObserver.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('visible'));
}

// Contact form handler
const contactForm = document.querySelector('.contact-form form');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = contactForm.elements['name'].value.trim();
        const email = contactForm.elements['email'].value.trim();
        const phone = contactForm.elements['phone'].value.trim();
        const message = contactForm.elements['message'].value.trim();
        if (!name || !email || !message) {
            if (formStatus) {
                formStatus.textContent = 'Please complete all required fields.';
                setTimeout(() => formStatus.textContent = '', 5000);
            }
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (formStatus) {
                formStatus.textContent = 'Please enter a valid email address.';
                setTimeout(() => formStatus.textContent = '', 5000);
            }
            return;
        }
        try {
            const resp = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, phone, message })
            });
            if (formStatus) {
                formStatus.textContent = resp.ok
                    ? 'Thank you for contacting ApexBuild!'
                    : 'Submission failed. Please try again.';
                setTimeout(() => formStatus.textContent = '', 5000);
            }
        } catch (err) {
            if (formStatus) {
                formStatus.textContent = 'Submission failed. Please try again.';
                setTimeout(() => formStatus.textContent = '', 5000);
            }
        }
        contactForm.reset();
    });
}

// Cookie consent banner
const cookieBanner = document.getElementById('cookieConsent');
const acceptCookies = document.getElementById('acceptCookies');
if (cookieBanner && acceptCookies) {
    if (!localStorage.getItem('cookies-accepted')) {
        cookieBanner.showModal();
    }
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'true');
        cookieBanner.close();
    });
}

// Set current year in footer
const yearEl = document.getElementById('currentYear');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// Pointer ring effect
const pointerRing = document.getElementById('pointerRing');
if (pointerRing && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', e => {
        pointerRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
}

// Dialog polyfill fallback
if (!('HTMLDialogElement' in window)) {
    document.querySelectorAll('dialog').forEach(dialog => {
        dialogPolyfill.registerDialog(dialog);
    });
}

// Core Web Vitals logging
if ('PerformanceObserver' in window) {
    const perfEndpoint = '/perf';
    const po = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
            fetch(perfEndpoint, {
                method: 'POST',
                keepalive: true,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: entry.name, value: entry.startTime })
            });
        }
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
