document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const CONTACT_EMAIL = 'marcosgar272006@gmail.com';

    initScrollProgress();
    initReveal();
    initMobileNav();
    initContactForm(CONTACT_EMAIL);
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

function initContactForm(contactEmail) {
    const form = document.getElementById('contact-form');
    const alertBox = document.getElementById('contact-alert');
    if (!form) return;

    const fields = {
        name: document.getElementById('contact-name'),
        email: document.getElementById('contact-email'),
        phone: document.getElementById('contact-phone'),
        message: document.getElementById('contact-message')
    };

    Object.values(fields).forEach((input) => {
        if (!input) return;
        input.addEventListener('input', () => clearFieldError(input));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        clearAlert(alertBox);
        Object.values(fields).forEach((input) => clearFieldError(input));

        const name = fields.name.value.trim();
        const email = fields.email.value.trim();
        const phone = fields.phone.value.trim();
        const message = fields.message.value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');

        let firstInvalid = null;

        if (!name) {
            setFieldError(fields.name, 'Introduce tu nombre completo.');
            firstInvalid = firstInvalid || fields.name;
        }

        if (!email) {
            setFieldError(fields.email, 'Introduce un correo electrónico.');
            firstInvalid = firstInvalid || fields.email;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFieldError(fields.email, 'El formato del correo no es válido.');
            firstInvalid = firstInvalid || fields.email;
        }

        if (!message) {
            setFieldError(fields.message, 'Escribe un mensaje o propuesta.');
            firstInvalid = firstInvalid || fields.message;
        }

        if (firstInvalid) {
            showAlert(alertBox, 'Revisa los campos marcados. Hay errores de validación.', 'error');
            firstInvalid.focus();
            return;
        }

        const subject = encodeURIComponent(`Contacto portfolio — ${name}`);
        const body = encodeURIComponent(
            `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || '—'}\n\n${message}`
        );

        const original = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Abriendo correo…';

        window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

        showAlert(
            alertBox,
            'Se abrirá tu cliente de correo para enviar el mensaje. Si no se abre, escríbeme directamente al email de contacto.',
            'success'
        );
        alertBox.focus();

        window.setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = original;
        }, 1200);
    });
}

function setFieldError(input, message) {
    if (!input) return;
    const errorId = input.getAttribute('aria-describedby');
    const errorEl = errorId ? document.getElementById(errorId) : null;

    input.setAttribute('aria-invalid', 'true');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('is-visible');
    }
}

function clearFieldError(input) {
    if (!input) return;
    const errorId = input.getAttribute('aria-describedby');
    const errorEl = errorId ? document.getElementById(errorId) : null;

    input.removeAttribute('aria-invalid');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
    }
}

function showAlert(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('form-alert--ok', 'form-alert--err');
    el.classList.add('is-visible', type === 'success' ? 'form-alert--ok' : 'form-alert--err');
    el.setAttribute('role', type === 'success' ? 'status' : 'alert');
    el.setAttribute('tabindex', '-1');
}

function clearAlert(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.remove('is-visible', 'form-alert--ok', 'form-alert--err');
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
