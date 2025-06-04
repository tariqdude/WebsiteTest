const swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
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

const counterElements = document.querySelectorAll('.stat-number');
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

// Dark mode toggle
const darkToggle = document.getElementById('darkModeToggle');
if (darkToggle) {
    const prefersDark = localStorage.getItem('dark-mode') === 'true';
    if (prefersDark) document.body.classList.add('dark-mode');
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });
}

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
