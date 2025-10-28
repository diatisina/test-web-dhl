document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const menu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const dropdownToggles = document.querySelectorAll('.submenu-toggle');

    // 1. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // 2. Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // 3. Dropdown Menu Toggle (Perbaikan untuk Mobile)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Hentikan default action link dan propagasi
            e.preventDefault();
            e.stopPropagation(); 
            
            const parentItem = this.closest('.nav-item.dropdown');
            
            // Tutup semua submenu lain, kecuali yang diklik
            document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                if (item !== parentItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });

            // Toggle kelas 'active' pada item dropdown
            parentItem.classList.toggle('active');
        });
    });

    // 4. Tutup menu saat link diklik (di mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        if (!link.closest('.dropdown')) { // Jangan tutup jika ini adalah link dropdown utama
             link.addEventListener('click', () => {
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
             });
        }
    });


    // 5. Hero Slider (Asumsi ada 3 slide)
    const slides = document.querySelectorAll('.slide-bg');
    const totalSlides = slides.length;
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Auto slide change every 7 seconds
    let slideInterval = setInterval(nextSlide, 7000);

    // Manual navigation (jika tombol ada)
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval); // Stop auto slide
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
            slideInterval = setInterval(nextSlide, 7000); // Restart auto slide
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval); // Stop auto slide
            nextSlide();
            slideInterval = setInterval(nextSlide, 7000); // Restart auto slide
        });
    }

    // Inisialisasi slide pertama
    showSlide(currentSlide);


    // 6. AOS Initialization
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true
    });

    // 7. Counter Animation (tetap sama)
    const counterItems = document.querySelectorAll('.jumlah-item');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target.querySelector('.counter');
                animateCounter(counterElement);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    counterItems.forEach(item => {
        observer.observe(item);
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        let current = 0;
        const duration = 2000;
        const stepTime = 10;
        const step = Math.ceil((target / duration) * stepTime);

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = current.toLocaleString('id-ID');
        }, stepTime);
    }

    // 8. Prestasi Slider Logic (tetap sama)
    const slider = document.querySelector('.prestasi-slider');
    const cards = document.querySelectorAll('.prestasi-card');
    const sliderNavPrev = document.querySelector('#prestasi .prestasi-nav.prev');
    const sliderNavNext = document.querySelector('#prestasi .prestasi-nav.next');
    let currentIndex = 0;
    
    if(slider && cards.length > 0) {
        // Tentukan jumlah kartu yang terlihat per viewport
        const getCardsPerView = () => {
            if (window.innerWidth >= 992) return 3;
            if (window.innerWidth >= 600) return 2;
            return 1;
        };
        
        const updateSlider = () => {
            const cardsPerView = getCardsPerView();
            const cardWidth = cards[0].offsetWidth + 20; // width + margin
            const offset = -currentIndex * cardWidth;
            slider.style.transform = `translateX(${offset}px)`;

            // Sembunyikan/tampilkan tombol navigasi
            sliderNavPrev.style.display = currentIndex === 0 ? 'none' : 'block';
            sliderNavNext.style.display = currentIndex >= cards.length - cardsPerView ? 'none' : 'block';
        };

        const goToNext = () => {
            const cardsPerView = getCardsPerView();
            if (currentIndex < cards.length - cardsPerView) {
                currentIndex++;
            } else {
                 currentIndex = 0; // Loop kembali ke awal
            }
            updateSlider();
        };

        const goToPrev = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                 // currentIndex = cards.length - getCardsPerView(); // Loop ke akhir
            }
            updateSlider();
        };

        sliderNavNext.addEventListener('click', goToNext);
        sliderNavPrev.addEventListener('click', goToPrev);
        
        // Update slider saat resize
        window.addEventListener('resize', () => {
            currentIndex = 0; // Reset index saat resize agar tidak error
            updateSlider();
        });

        // Inisialisasi
        updateSlider();
    }
});