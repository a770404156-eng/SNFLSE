/* ─────────────────────────────────────────────────────────
   main.js
   Handles: mobile menu, share dropdown, reveal animations,
            membership form submission (form.html)
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

if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => observer.observe(el));
}

/* ── Membership form ──────────────────────────────────── */
const membershipForm = document.getElementById('membershipForm');
const formSuccess    = document.getElementById('formSuccess');

if (membershipForm) {
  membershipForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect all required inputs
    const requiredInputs = membershipForm.querySelectorAll('[required]');
    let valid = true;

    requiredInputs.forEach((input) => {
      input.classList.remove('error');

      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;

        // Clear error style on next input
        input.addEventListener('input', () => {
          input.classList.remove('error');
        }, { once: true });
      }
    });

    // Email format check
    const emailInput = membershipForm.querySelector('[type="email"]');
    if (emailInput && emailInput.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('error');
        emailInput.addEventListener('input', () => {
          emailInput.classList.remove('error');
        }, { once: true });
        valid = false;
      }
    }

    if (!valid) return;

    // Disable submit while "sending"
    const submitBtn = membershipForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'جار الإرسال...';

    // Simulate async send — replace with real API / EmailJS / Formspree
    setTimeout(() => {
      membershipForm.style.display = 'none';
      if (formSuccess) {
        formSuccess.classList.add('visible');
      }
    }, 900);
  });
}