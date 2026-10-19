document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initReveal();
    initMobileNav();
    initCarousels();
});

function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const top = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = (height > 0 ? (top / height) * 100 : 0) + '%';
    }, { passive: true });
}

function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

    items.forEach((el) => observer.observe(el));
}

function initMobileNav() {
    const toggle = document.getElementById('menu-toggle');
    const panel = document.getElementById('mobile-nav');
    if (!toggle || !panel) return;

    const links = panel.querySelectorAll('a');

    const close = () => {
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
        panel.hidden = true;
        document.body.classList.remove('nav-open');
    };

    const open = () => {
        toggle.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        panel.hidden = false;
        document.body.classList.add('nav-open');
    };

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        if (expanded) close();
        else open();
    });

    links.forEach((link) => link.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 768px)').matches) close();
    });
}

function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    carousels.forEach((carousel) => setupCarousel(carousel));
}

function setupCarousel(carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    const counter = carousel.querySelector('[data-carousel-counter]');
    if (!slides.length) return;

    let index = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (index < 0) index = 0;

    if (dotsWrap) {
        dotsWrap.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel__dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });
    }

    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.carousel__dot')) : [];

    function goTo(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
            slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });
        dots.forEach((dot, i) => {
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
        if (counter) {
            counter.textContent = `${index + 1} / ${slides.length}`;
        }
    }

    prevBtn?.addEventListener('click', () => goTo(index - 1));
    nextBtn?.addEventListener('click', () => goTo(index + 1));

    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goTo(index - 1);
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(index + 1);
        }
    });

    goTo(index);
}
