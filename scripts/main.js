// ── Mobile Menu ──────────────────────────────────────────
const menuBtn = document.getElementById('menuBtn');
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

// ── Share Dropdown ───────────────────────────────────────
const shareIcon = document.getElementById('shareIcon');
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

// ── Reveal on Scroll ─────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach((el) => observer.observe(el));