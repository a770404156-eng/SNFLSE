/* ─────────────────────────────────────────────────────────
   news.js
   Handles: mobile menu, share dropdown, reveal animations,
            filter buttons, lightbox for photos, Google Sheets fetch
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

/* ── Filter buttons ───────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');

function getCards() {
  return document.querySelectorAll('.news-card');
}

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    getCards().forEach((card) => {
      const type = card.dataset.type;
      const show = filter === 'all' || type === filter;

      if (show) {
        card.style.display = '';
        card.style.animation = 'cardFadeIn 0.4s ease both';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ── Lightbox ─────────────────────────────────────────── */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentPhotos = [];
let currentIndex  = 0;

function openLightbox(photos, index = 0) {
  currentPhotos = photos;
  currentIndex  = index;
  updateLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  lightboxImg.src = currentPhotos[currentIndex];
  lightboxCounter.textContent = `${currentIndex + 1} / ${currentPhotos.length}`;
  lightboxPrev.style.display = currentPhotos.length > 1 ? '' : 'none';
  lightboxNext.style.display = currentPhotos.length > 1 ? '' : 'none';
}

function attachLightboxTriggers() {
  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const photos = JSON.parse(trigger.dataset.photos || '[]');
      if (photos.length) openLightbox(photos, 0);
    });
  });
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateLightbox();
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    updateLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex + 1) % currentPhotos.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length; updateLightbox(); }
});

/* ── Google Sheets fetch ──────────────────────────────── */
const API_URL = "https://script.google.com/macros/s/AKfycbyXA8jI1V-S8Hvw3VEP1zDCAwUxrYttvtnhrmydoZ-YIW9mGVvly6bshv8MJLFvTHS_4Q/exec";

async function loadNews() {
  try {
    const res  = await fetch(API_URL + '?t=' + Date.now());
    const data = await res.json();
    renderNews(data);
  } catch (err) {
    console.error("Error loading news:", err);
    const grid = document.getElementById("newsGrid");
    if (grid) grid.innerHTML = `<div class="news-empty"><p>تعذّر تحميل الأخبار، يرجى المحاولة لاحقاً.</p></div>`;
  }
}

/* ── Arabic labels for type badges ───────────────────── */
const TYPE_LABELS = { news: 'خبر', photo: 'صورة', video: 'فيديو' };

/* ── Render ───────────────────────────────────────────── */
function renderNews(posts) {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = "";

  if (!posts || !posts.length) {
    grid.innerHTML = `<div class="news-empty"><p>لا توجد أخبار حالياً</p></div>`;
    return;
  }

  posts.forEach((post, i) => {
    const type  = (post.type  || "news").trim().toLowerCase();
    const media = (post.media || "").trim();

    const card = document.createElement("article");
    card.className = "news-card";
    card.dataset.type = type;
    card.style.animationDelay = `${i * 0.08}s`;

    /* ── Media area ─────────────────────────────────── */
    let mediaHTML = "";

    if (type === "video" && media) {
      mediaHTML = `
        <div class="card-media">
          <iframe
            src="${formatMediaLink(media)}"
            allowfullscreen
            loading="lazy"
            title="${post.title || ''}"
          ></iframe>
          <span class="type-badge video">${TYPE_LABELS.video}</span>
        </div>`;

    } else if (type === "photo" && media) {
      const photos = media.split(',')
                          .map(u => formatMediaLink(u.trim()))
                          .filter(Boolean);

      if (photos.length === 1) {
        mediaHTML = `
          <div class="card-media">
            <img
              src="${photos[0]}"
              alt="${post.title || ''}"
              class="lightbox-trigger"
              data-photos='${JSON.stringify(photos)}'
              style="cursor:pointer;"
            >
            <span class="type-badge photo">${TYPE_LABELS.photo}</span>
          </div>`;

      } else {
        const visible  = photos.slice(0, 3);
        const extra    = photos.length - 3;
        const countCls = `count-${Math.min(photos.length, 3)}`;

        const strips = visible.map((src, idx) => {
          const isLast = idx === visible.length - 1 && extra > 0;
          return `
            <div class="strip-img">
              <img src="${src}" alt="صورة ${idx + 1}">
              ${isLast ? `<div class="strip-more">+${extra}</div>` : ''}
            </div>`;
        }).join('');

        mediaHTML = `
          <div class="card-media" style="padding:0;">
            <div
              class="photo-strip ${countCls} lightbox-trigger"
              data-photos='${JSON.stringify(photos)}'
              style="cursor:pointer;"
            >${strips}</div>
            <span class="type-badge photo">${TYPE_LABELS.photo}</span>
            <div class="media-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/>
              </svg>
              ${photos.length} صور
            </div>
          </div>`;
      }

    } else {
      mediaHTML = `
        <div class="card-media-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>`;
    }

    /* ── Card HTML ──────────────────────────────────── */
    card.innerHTML = `
      ${mediaHTML}
      <div class="card-body">
        <span class="card-category">${post.category || ''}</span>
        <h2 class="card-title">${post.title || ''}</h2>
        <p class="card-excerpt">${post.content || ''}</p>
        <div class="card-meta">
          <span class="card-date">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
            </svg>
            ${post.date || ''}
          </span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  attachLightboxTriggers();
}

/* ── Convert any Drive/YouTube URL to embeddable ─────── */
function formatMediaLink(url) {
  if (!url) return "";
  if (url.includes('/preview') || url.includes('/embed/')) return url;

  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;

  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  return url;
}

/* ── Boot ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', loadNews);