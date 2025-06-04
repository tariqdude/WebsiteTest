// @ts-check

const swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    a11y: {
        enabled: true,
    },
    keyboard: {
        enabled: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
    },
});

// Motion preference check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
}

// Typed hero text
const typedHero = document.getElementById('typedHero');
if (typedHero && !prefersReducedMotion) {
    new Typed('#typedHero', {
        strings: ['Building Beyond Expectations', 'Crafting Your Vision'],
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    });
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
    if (typedHero) {
        typedHero.dataset.variant = savedVariant;
    }
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
    if (themeTip) {
        function positionTip() {
            const rect = darkToggle.getBoundingClientRect();
            themeTip.style.left = rect.left + rect.width / 2 + 'px';
            themeTip.style.top = rect.bottom + window.scrollY + 'px';
        }
        positionTip();
        window.addEventListener('resize', positionTip);
        window.addEventListener('scroll', positionTip);
    }
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
const menuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const expanded = navMenu.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', expanded);
    });
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
            alert('Please complete all required fields.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
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
if (pointerRing) {
    window.addEventListener('pointermove', e => {
        pointerRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
}


// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
