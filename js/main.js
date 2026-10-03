document.addEventListener('DOMContentLoaded', () => {
    const CONTACT_EMAIL = 'marcos.garcia@ejemplo.com';

    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }

    // 2. IntersectionObserver for Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // 3. Contact form via mailto (static / GitHub Pages)
    const contactForm = document.getElementById('contact-form');
    const alertBox = document.getElementById('contact-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            if (!name || !email || !message) {
                showAlert(alertBox, 'Por favor, completa todos los campos requeridos (*).', 'error');
                return;
            }

            const subject = encodeURIComponent(`Contacto portfolio — ${name}`);
            const body = encodeURIComponent(
                `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || '—'}\n\n${message}`
            );

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `ABRIENDO CORREO... <span class="material-symbols-outlined text-sm" aria-hidden="true">mail</span>`;

            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

            showAlert(alertBox, 'Se abrirá tu cliente de correo para enviar el mensaje.', 'success');
            alertBox.focus();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1200);
        });
    }

    function showAlert(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.classList.remove(
            'hidden',
            'bg-green-950', 'text-green-200', 'border-green-800',
            'bg-red-950', 'text-red-200', 'border-red-800'
        );

        if (type === 'success') {
            el.classList.add('bg-green-950', 'text-green-200', 'border', 'border-green-800');
            el.setAttribute('role', 'status');
        } else {
            el.classList.add('bg-red-950', 'text-red-200', 'border', 'border-red-800');
            el.setAttribute('role', 'alert');
        }

        el.setAttribute('tabindex', '-1');
        el.classList.remove('hidden');
    }
});
