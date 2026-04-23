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

    // Disable submit while sending
    const submitBtn = membershipForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'جار الإرسال...';

    // Collect form data
    const data = {
      firstName : membershipForm.querySelector('[name="firstName"]').value.trim(),
      lastName  : membershipForm.querySelector('[name="lastName"]').value.trim(),
      email     : membershipForm.querySelector('[name="email"]').value.trim(),
      phone     : membershipForm.querySelector('[name="phone"]').value.trim(),
      work      : membershipForm.querySelector('[name="work"]').value.trim(),
      state     : membershipForm.querySelector('[name="state"]').value.trim(),
      ssn       : membershipForm.querySelector('[name="ssn"]').value.trim(),
    };

    // ── Paste your Apps Script deployment URL here ──────────
    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyzJLyMWUTzQ4YgM1LZdm7xKHr2CDaNkIGkSS3ZnDaFjRP-1pznDLGhe5orhFTqylmT/exec';
    // ────────────────────────────────────────────────────────

    fetch(SHEET_URL, {
      method      : 'POST',
      mode        : 'no-cors',          // Apps Script requires this
      headers     : { 'Content-Type': 'application/json' },
      body        : JSON.stringify(data),
    })
      .then(() => {
        // no-cors means we get an opaque response — any response = success
        membershipForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('visible');
      })
      .catch(() => {
        // Re-enable button so the user can try again
        submitBtn.disabled = false;
        submitBtn.textContent = 'إرسال الطلب';
        alert('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
      });
  });
}