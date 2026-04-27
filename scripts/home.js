// ── Element refs ─────────────────────────────────────────────────
const menuBtn       = document.getElementById('menuBtn');
const mobileMenu    = document.getElementById('mobileMenu');
const shareIcon     = document.getElementById('shareIcon');
const shareDropdown = document.getElementById('shareDropdown');

// ── Mobile menu toggle ────────────────────────────────────────────
menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu when a link inside it is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ── Active nav link ───────────────────────────────────────────────
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function () {
    // Remove active from same nav's siblings only
    this.closest('nav').querySelectorAll('a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Share dropdown ────────────────────────────────────────────────
shareIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = shareDropdown.classList.toggle('active');
  shareIcon.setAttribute('aria-expanded', isOpen);
});

// Close on outside click
document.addEventListener('click', () => {
  shareDropdown.classList.remove('active');
  shareIcon.setAttribute('aria-expanded', 'false');
});

// Trap close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    shareDropdown.classList.remove('active');
    shareIcon.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
});

// ── Scroll reveal ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Members data ──────────────────────────────────────────────────
const members = [
  {
    name:  'السيدة سقني حياة',
    role:  'رئيسة النقابة',
    job:   '',
    photo: 'imgs/members/hayat segni.jpg',          // e.g. 'imgs/hayat.jpg'
    phone: '0777102070',
    email: 'Hayatsegueni75@gmail.com'           // e.g. 'hayat@snflse.dz'
  } ,
  {
    name: 'حابي محمد صلاح',
    role:'',
    job:'',
    photo:'imgs/members/habi salah.jpg',
    phone:'0669628600',
    email:'labosi.salah@gmail.com',
  } ,
  {
    name: 'نوال شنكل',
    role:'',
    job:'',
    photo:'imgs/members/nawal.jpg',
    phone:'0797468094',
    email:'nawel.chenikel16@gmail.com',
  } ,
  {
    name: 'ويزا بلقاسم',
    role:'',
    job:'',
    photo:'imgs/members/ouiza.jpg',
    phone:'0665647616',
    email:'ouizabekkvcem@gmail.com',
  } ,
  {
    name: 'ربيحة شواشي',
    role:'',
    job:'',
    photo:'imgs/members/rbiha shwashi.jpg',
    phone:'0551885188',
    email:'chouachirebiha@gmail.com',
  } ,
  {
    name: 'مواسي بوزيد',
    role:'',
    job:'',
    photo:'imgs/members/bouzid.jpg',
    phone:'0554211377',
    email:'bobomoua515@gmail.com',
  } ,
  {
    name: 'مزغيش عيسى',
    role:'',
    job:'',
    photo:'imgs/members/aissa.jpg',
    phone:'0775570990',
    email:'.mezaissa0@gmail.com',
  } ,
  {
    name: 'صابر مجدوب',
    role:'',
    job:'',
    photo:'imgs/members/saber.jpg',
    phone:'0777548676',
    email:'maxmalcom14@gmail.com',
  } ,
  {
    name: 'بابش سعيد',
    role:'',
    job:'',
    photo:'imgs/members/said.jpg',
    phone:'0696246497',
    email:'babechesaid73@gmail.com',
  } ,
  {
    name: 'فقيد بوسعد',
    role:'',
    job:'',
    photo:'',
    phone:'0550163030',
    email:'boussadfekid6@gmail.com',
  }
];

// ── SVG icons ─────────────────────────────────────────────────────
const phoneSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.6.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.6 1 1 0 01-.25 1.01l-2.2 2.18z"/></svg>`;
const emailSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

// ── Render members ────────────────────────────────────────────────
function renderMembers() {
  const grid = document.getElementById('membersGrid');
  if (!grid || members.length === 0) return;

  grid.innerHTML = members.map((m, i) => {
    // Photo or placeholder with person silhouette
    const photoHTML = m.photo
      ? `<div class="member-photo"><img src="${m.photo}" alt="صورة ${m.name}" loading="lazy"></div>`
      : `<div class="member-photo-placeholder" aria-hidden="true">
           <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="#aaa">
             <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
           </svg>
         </div>`;

    // Contact buttons — only rendered as links if info exists
    const phoneBtn = m.phone
      ? `<a href="tel:${m.phone}" class="member-contact-btn" title="اتصل بنا: ${m.phone}">${phoneSVG}</a>`
      : `<span class="member-contact-btn disabled" aria-hidden="true">${phoneSVG}</span>`;

    const emailBtn = m.email
      ? `<a href="mailto:${m.email}" class="member-contact-btn" title="راسلنا: ${m.email}">${emailSVG}</a>`
      : `<span class="member-contact-btn disabled" aria-hidden="true">${emailSVG}</span>`;

    return `
      <div class="member-card reveal" style="animation-delay:${i * 80}ms">
        ${photoHTML}
        <span class="member-name">${m.name}</span>
        <span class="member-role">${m.role}</span>
        <div class="member-contacts">
          ${phoneBtn}
          ${emailBtn}
        </div>
        ${m.job ? `<span class="member-job">${m.job}</span>` : ''}
      </div>
    `;
  }).join('');

  // Observe newly added cards
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

renderMembers();