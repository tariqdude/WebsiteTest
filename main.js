$(document).ready(function () {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
    });

    // Initialize Slick Carousel
    $('.testimonial__carousel').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 4000,
    });

    // Initialize Lightbox
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });

    // Back-to-Top Button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn();
        } else {
            $('.back-to-top').fadeOut();
        }
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    // FAQ Toggle
    $('.faq-item').click(function () {
        $(this).toggleClass('open');
        $(this).find('.faq-answer').slideToggle();
    });

    // Dark Mode Toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });

    // Lazy Load Images
    const lazyImages = document.querySelectorAll("img");
    const options = {
        rootMargin: "0px",
        threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazy");
                observer.unobserve(img);
            }
        });
    }, options);

    lazyImages.forEach(image => {
        imageObserver.observe(image);
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
});
