/**
 * Global Learn India - Frontend Logic
 * Refactored for performance, accessibility, and scalability.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- UTILITIES & CONSTANTS ---
    const DEBOUNCE_TIME = 100;
    const body = document.body;

    /**
     * Debounce function to limit execution rate of high-frequency events.
     */
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // --- MOBILE MENU ---
    const menuConfig = {
        toggle: document.getElementById('mobile-menu'),
        close: document.getElementById('close-menu'),
        nav: document.getElementById('mobile-nav'),
        links: document.querySelectorAll('.mobile-link')
    };

    const toggleMenu = (isOpen) => {
        if (!menuConfig.nav) return;

        menuConfig.nav.classList.toggle('active', isOpen);
        menuConfig.toggle?.setAttribute('aria-expanded', isOpen);
        menuConfig.nav.setAttribute('aria-hidden', !isOpen);

        if (isOpen) {
            menuConfig.close?.focus();
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            menuConfig.toggle?.focus();
            body.style.overflow = '';
        }
    };

    if (menuConfig.toggle && menuConfig.nav) {
        menuConfig.toggle.addEventListener('click', () => toggleMenu(true));
        menuConfig.close?.addEventListener('click', () => toggleMenu(false));
        menuConfig.links.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuConfig.nav.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (!navbar) return;
        const isScrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', isScrolled);
    };

    window.addEventListener('scroll', throttle(handleScroll, 100));

    /**
     * Simple throttle function for scroll performance.
     */
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // --- GENERIC SLIDER MODULE ---
    /**
     * A reusable slider class to handle different sliders on the page.
     */
    class Slider {
        constructor(config) {
            this.slider = config.slider;
            this.cards = config.cards;
            this.prevBtn = config.prevBtn;
            this.nextBtn = config.nextBtn;
            this.dotContainer = config.dotContainer;
            this.autoSlideDelay = config.autoSlideDelay || 5000;
            this.breakpoint = config.breakpoint || 1024;
            this.gap = config.gap || 32;

            if (!this.slider || !this.cards.length) return;

            this.currentIndex = 0;
            this.startX = 0;
            this.isDragging = false;
            this.autoSlideInterval = null;

            this.init();
        }

        init() {
            this.createDots();
            this.addEventListeners();
            this.startAutoSlide();
            this.update();
        }

        createDots() {
            if (!this.dotContainer) return;
            this.dotContainer.innerHTML = '';
            this.cards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goTo(index));
                this.dotContainer.appendChild(dot);
            });
            this.dots = this.dotContainer.querySelectorAll('.dot');
        }

        update() {
            if (window.innerWidth < this.breakpoint) {
                const cardWidth = this.cards[0].offsetWidth;
                this.slider.style.transform = `translateX(-${this.currentIndex * (cardWidth + this.gap)}px)`;
            } else {
                this.slider.style.transform = '';
            }

            this.dots?.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        goTo(index) {
            this.currentIndex = (index + this.cards.length) % this.cards.length;
            this.update();
            this.resetAutoSlide();
        }

        next() { this.goTo(this.currentIndex + 1); }
        prev() { this.goTo(this.currentIndex - 1); }

        addEventListeners() {
            this.nextBtn?.addEventListener('click', () => this.next());
            this.prevBtn?.addEventListener('click', () => this.prev());

            this.slider.addEventListener('touchstart', (e) => {
                this.startX = e.touches[0].clientX;
                this.isDragging = true;
                this.resetAutoSlide();
            }, { passive: true });

            this.slider.addEventListener('touchmove', (e) => {
                if (!this.isDragging) return;
                const diff = this.startX - e.touches[0].clientX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.next() : this.prev();
                    this.isDragging = false;
                }
            }, { passive: true });

            this.slider.addEventListener('touchend', () => this.isDragging = false);
            window.addEventListener('resize', debounce(() => this.update(), 100));
        }

        startAutoSlide() {
            if (this.autoSlideDelay) {
                this.autoSlideInterval = setInterval(() => this.next(), this.autoSlideDelay);
            }
        }

        resetAutoSlide() {
            clearInterval(this.autoSlideInterval);
            this.startAutoSlide();
        }
    }

    // Initialize Sliders
    new Slider({
        slider: document.getElementById('testimonials-slider'),
        cards: document.querySelectorAll('.testimonial-card'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        dotContainer: document.getElementById('pagination-dots')
    });

    new Slider({
        slider: document.getElementById('services-slider'),
        cards: document.querySelectorAll('#services-slider .service-card'),
        dotContainer: document.getElementById('services-pagination-dots'),
        breakpoint: 769,
        gap: 0,
        autoSlideDelay: 4500
    });

    // --- COUNTER ANIMATION ---
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentNum = Math.floor(progress * target);

            el.innerText = currentNum;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.innerText = target;
            }
        };
        requestAnimationFrame(update);
    };

    const statsSection = document.querySelector('.stats-container');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(animateCounter);
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // --- FORM HANDLING ---
    const form = document.getElementById('inquiryForm');
    const successMsg = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            // Gather form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:5000/api/inquiry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Success
                    successMsg.classList.remove('hidden');
                    form.reset();

                    // Hide success message after 5 seconds
                    setTimeout(() => successMsg.classList.add('hidden'), 5000);
                } else {
                    // Server-side validation error
                    alert(result.message || 'Something went wrong. Please try again.');
                }

            } catch (error) {
                console.error('Submission Error:', error);
                alert('Could not connect to the server. Please check if the backend is running.');
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Testimonial Reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.testimonial-card').forEach(card => revealObserver.observe(card));
});
