/* ─────────────────────────────────────────────────────────
   contact.js
   Handles: mobile menu, share dropdown, reveal animations,
            contact form submission
   ───────────────────────────────────────────────────────── */

/* ── Mobile menu ──────────────────────────────────────── */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ── Share dropdown ───────────────────────────────────── */
const shareIcon     = document.getElementById('shareIcon');
const shareDropdown = document.getElementById('shareDropdown');

if (shareIcon && shareDropdown) {
  shareIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = shareDropdown.classList.toggle('active');
    shareIcon.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!shareIcon.contains(e.target) && !shareDropdown.contains(e.target)) {
      shareDropdown.classList.remove('active');
      shareIcon.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Reveal on scroll ─────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => observer.observe(el));

/* ── Contact form ─────────────────────────────────────── */
const submitBtn  = document.getElementById('submitBtn');
const formEl     = document.getElementById('contactForm');
const successEl  = document.getElementById('formSuccess');

if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    // Basic validation
    const fullName = document.getElementById('fullName');
    const email    = document.getElementById('email');
    const subject  = document.getElementById('subject');
    const message  = document.getElementById('message');

    const fields = [fullName, email, subject, message];
    let valid = true;

    fields.forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
        valid = false;
      }
    });

    if (!valid) return;

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.style.borderColor = '#e53e3e';
      email.addEventListener('input', () => {
        email.style.borderColor = '';
      }, { once: true });
      return;
    }

    // Simulate send (replace with real API call / mailto / formspree etc.)
    submitBtn.disabled = true;
    submitBtn.textContent = 'جار الإرسال...';

    setTimeout(() => {
      formEl.style.display = 'none';
      successEl.classList.add('visible');
    }, 900);
  });
}