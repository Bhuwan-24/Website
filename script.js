document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    function openMenu() {
        mobileNav.classList.add('active');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (mobileNav) mobileNav.setAttribute('aria-hidden', 'false');
        // move focus to close button for accessibility
        if (closeMenuBtn) closeMenuBtn.focus();
    }

    function closeMenu() {
        mobileNav.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (mobileNav) mobileNav.setAttribute('aria-hidden', 'true');
        // return focus to the toggle button
        if (mobileMenuBtn) mobileMenuBtn.focus();
    }

    if (mobileMenuBtn && closeMenuBtn && mobileNav) {
        // initialize accessibility attributes
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');

        mobileMenuBtn.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeMenuBtn.addEventListener('click', closeMenu);

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Navbar Scrolled Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Form Submission Handling
    const form = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual submission

            // In a real application, you'd send the data to a server here using fetch/XHR.
            // For now, we'll just simulate a successful submission.

            // Disable button during "submission"
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show success message
                successMessage.classList.remove('hidden');

                // Reset form
                form.reset();

                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
            }, 1000); // Simulate network delay
        });
    }

    // --- STUDENT TESTIMONIALS SLIDER ---
    const slider = document.getElementById('testimonials-slider');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotContainer = document.getElementById('pagination-dots');

    if (slider && cards.length > 0) {
        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;
        let autoSlideInterval;

        // Generate Pagination Dots
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateSlider() {
            // Only slide on mobile/tablet (less than 1024px)
            if (window.innerWidth < 1024) {
                const cardWidth = cards[0].offsetWidth;
                const gap = 32; // 2rem
                slider.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            } else {
                slider.style.transform = 'none';
            }

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex >= cards.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = cards.length - 1;
            updateSlider();
            resetAutoSlide();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateSlider();
        }

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        // Touch Events for Mobile Swipe
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            resetAutoSlide();
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                isDragging = false;
            }
        });

        slider.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Auto slide every 5 seconds
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();

        // Reveal Animation on Scroll
        const observerOptions = {
            threshold: 0.1
        };

        const testimonialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal');
                    // Stagger effect if many cards
                    const cardIndex = Array.from(cards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${cardIndex * 150}ms`;
                }
            });
        }, observerOptions);

        cards.forEach(card => testimonialObserver.observe(card));

        // Handle Resize
        window.addEventListener('resize', updateSlider);
    }

    // --- OUR SERVICES SLIDER (Mobile Only) ---
    const srvSlider = document.getElementById('services-slider');
    const srvCards = srvSlider ? srvSlider.querySelectorAll('.service-card') : [];
    const srvPrevBtn = document.getElementById('services-prev-btn');
    const srvNextBtn = document.getElementById('services-next-btn');
    const srvDotContainer = document.getElementById('services-pagination-dots');

    if (srvSlider && srvCards.length > 0) {
        let srvIndex = 0;
        let srvStartX = 0;
        let srvIsDragging = false;
        let srvAutoSlide;

        // Create dots
        srvCards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => srvGoTo(i));
            srvDotContainer.appendChild(dot);
        });

        const srvDots = srvDotContainer.querySelectorAll('.dot');

        function srvUpdate() {
            if (window.innerWidth <= 768) {
                const w = srvSlider.offsetWidth;
                srvSlider.style.transform = `translateX(-${srvIndex * w}px)`;
            } else {
                srvSlider.style.transform = 'none';
            }
            srvDots.forEach((dot, i) => dot.classList.toggle('active', i === srvIndex));
        }

        function srvGoTo(i) {
            srvIndex = i;
            if (srvIndex < 0) srvIndex = srvCards.length - 1;
            if (srvIndex >= srvCards.length) srvIndex = 0;
            srvUpdate();
            srvResetTimer();
        }

        if (srvNextBtn) srvNextBtn.addEventListener('click', () => srvGoTo(srvIndex + 1));
        if (srvPrevBtn) srvPrevBtn.addEventListener('click', () => srvGoTo(srvIndex - 1));

        // Swipe logic
        srvSlider.addEventListener('touchstart', (e) => {
            srvStartX = e.touches[0].clientX;
            srvIsDragging = true;
            srvResetTimer();
        });

        srvSlider.addEventListener('touchmove', (e) => {
            if (!srvIsDragging) return;
            const diff = srvStartX - e.touches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) srvGoTo(srvIndex + 1);
                else srvGoTo(srvIndex - 1);
                srvIsDragging = false;
            }
        });

        srvSlider.addEventListener('touchend', () => srvIsDragging = false);

        function srvStartTimer() { srvAutoSlide = setInterval(() => srvGoTo(srvIndex + 1), 4500); }
        function srvResetTimer() { clearInterval(srvAutoSlide); srvStartTimer(); }

        srvStartTimer();
        window.addEventListener('resize', srvUpdate);
    }
});
