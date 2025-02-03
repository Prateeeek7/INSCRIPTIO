// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// // Enhanced slideshow functionality
// let currentSlide = 0;
// const slides = document.querySelectorAll('.slide');

// function showSlide(n) {
//     slides.forEach(slide => {
//         slide.style.opacity = '0';
//         slide.classList.remove('active');
//     });
//     currentSlide = (n + slides.length) % slides.length;
//     slides[currentSlide].classList.add('active');
// }

// setInterval(() => {
//     showSlide(currentSlide + 1);
// }, 4000);

// Enhanced FAQ functionality
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        
        // Close all FAQs
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle clicked FAQ
        if (!wasActive) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll with offset for sticky nav
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.textContent.toLowerCase().replace(/[^a-zA-Z]/g, '');
        const target = document.getElementById(targetId);
        if (target) {
            const offset = document.querySelector('.nav-container').offsetHeight + 20;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
