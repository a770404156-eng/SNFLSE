/* ─────────────────────────────────────────────────────────
   admin.js — control panel logic
   ───────────────────────────────────────────────────────── */

import {
  auth, db,
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  collection, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, getDocs,
  query, orderBy, serverTimestamp
} from './firebase-init.js';

/* ── CONFIG: fill these in ──────────────────────────────
   Cloud name: open your Cloudinary dashboard (cloudinary.com/console).
   It's shown right at the top of the page / in Settings — copy it
   EXACTLY as written there (case-sensitive). Don't guess. */
const CLOUDINARY_CLOUD_NAME    = "PASTE_YOUR_CLOUDINARY_CLOUD_NAME_HERE";
const CLOUDINARY_UPLOAD_PRESET = "SNFLSE";

/* Old Google Sheet API — used ONLY by the one-time import button below */
const LEGACY_API_URL = "https://script.google.com/macros/s/AKfycbyXA8jI1V-S8Hvw3VEP1zDCAwUxrYttvtnhrmydoZ-YIW9mGVvly6bshv8MJLFvTHS_4Q/exec";

const TYPE_LABELS = { news: 'خبر', photo: 'صورة', video: 'فيديو' };

/* ── Elements ─────────────────────────────────────────── */
const loginScreen   = document.getElementById('loginScreen');
const loginForm     = document.getElementById('loginForm');
const loginEmail    = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError    = document.getElementById('loginError');

const adminApp    = document.getElementById('adminApp');
const userEmailEl = document.getElementById('userEmail');
const logoutBtn   = document.getElementById('logoutBtn');

const importSection = document.getElementById('importSection');
const importBtn      = document.getElementById('importBtn');

const postForm      = document.getElementById('postForm');
const postIdField   = document.getElementById('postId');
const postType      = document.getElementById('postType');
const postTitle     = document.getElementById('postTitle');
const postCategory  = document.getElementById('postCategory');
const postContent   = document.getElementById('postContent');
const photoField    = document.getElementById('photoField');
const postPhotos    = document.getElementById('postPhotos');
const photoPreview  = document.getElementById('photoPreview');
const uploadStatus  = document.getElementById('uploadStatus');
const videoField    = document.getElementById('videoField');
const postVideoLink = document.getElementById('postVideoLink');
const submitBtn     = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formTitle     = document.getElementById('formTitle');

const postsList = document.getElementById('postsList');

let uploadedPhotoUrls = [];

/* ── Auth state ──────────────────────────────────────── */
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginScreen.hidden = true;
    adminApp.hidden = false;
    userEmailEl.textContent = user.email;
    checkImportStatus();
    loadPosts();
  } else {
    loginScreen.hidden = false;
    adminApp.hidden = true;
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value.trim(), loginPassword.value);
  } catch (err) {
    console.error(err);
    loginError.textContent = 'تعذّر تسجيل الدخول، تحقق من البريد الإلكتروني وكلمة المرور.';
    loginError.hidden = false;
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

/* ── Show/hide fields based on post type ────────────────*/
function updateTypeFields() {
  const type = postType.value;
  photoField.hidden = type !== 'photo';
  videoField.hidden = type !== 'video';
}
postType.addEventListener('change', updateTypeFields);
updateTypeFields();

/* ── Photo upload → Cloudinary ──────────────────────────*/
postPhotos.addEventListener('change', async () => {
  const files = Array.from(postPhotos.files);
  if (!files.length) return;

  uploadStatus.textContent = `جارٍ رفع ${files.length} صورة...`;
  uploadedPhotoUrls = [];
  photoPreview.innerHTML = '';

  for (const file of files) {
    try {
      const url = await uploadToCloudinary(file);
      uploadedPhotoUrls.push(url);
      const img = document.createElement('img');
      img.src = url;
      photoPreview.appendChild(img);
    } catch (err) {
      console.error(err);
      uploadStatus.textContent = 'فشل رفع إحدى الصور. تحقق من اسم Cloudinary واسم الـ preset، ثم حاول مجدداً.';
      return;
    }
  }
  uploadStatus.textContent = `تم رفع ${uploadedPhotoUrls.length} صورة بنجاح.`;
});

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Cloudinary upload failed: ' + res.status);
  const data = await res.json();
  return data.secure_url;
}

/* ── Create / update post ───────────────────────────────*/
postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;

  const type = postType.value;
  let media = '';
  if (type === 'photo') media = uploadedPhotoUrls.join(',');
  if (type === 'video') media = postVideoLink.value.trim();

  const postData = {
    type,
    title: postTitle.value.trim(),
    category: postCategory.value.trim(),
    content: postContent.value.trim(),
    media,
  };

  try {
    const editingId = postIdField.value;
    if (editingId) {
      await updateDoc(doc(db, 'news', editingId), postData);
    } else {
      postData.date = new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
      postData.createdAt = serverTimestamp();
      postData.authorEmail = auth.currentUser.email;
      await addDoc(collection(db, 'news'), postData);
    }
    resetForm();
    loadPosts();
  } catch (err) {
    console.error(err);
    alert('حدث خطأ أثناء النشر، حاول مجدداً.');
  } finally {
    submitBtn.disabled = false;
  }
});

function resetForm() {
  postForm.reset();
  postIdField.value = '';
  uploadedPhotoUrls = [];
  photoPreview.innerHTML = '';
  uploadStatus.textContent = '';
  formTitle.textContent = 'نشر خبر جديد';
  submitBtn.textContent = 'نشر';
  cancelEditBtn.hidden = true;
  updateTypeFields();
}

cancelEditBtn.addEventListener('click', resetForm);

/* ── List existing posts ─────────────────────────────────*/
async function loadPosts() {
  postsList.innerHTML = `<p class="admin-loading">جارٍ التحميل...</p>`;
  try {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    if (snap.empty) {
      postsList.innerHTML = `<p class="admin-loading">لا توجد أخبار منشورة بعد.</p>`;
      return;
    }

    postsList.innerHTML = '';
    snap.forEach((docSnap) => {
      const post = docSnap.data();
      const row = document.createElement('div');
      row.className = 'admin-post-row';
      row.innerHTML = `
        <div class="admin-post-info">
          <span class="admin-post-type">${TYPE_LABELS[post.type] || post.type}</span>
          <strong>${escapeHTML(post.title || '')}</strong>
          <span class="admin-post-date">${escapeHTML(post.date || '')}</span>
        </div>
        <div class="admin-post-actions">
          <button class="admin-btn-ghost small" data-action="edit">تعديل</button>
          <button class="admin-btn-ghost small danger" data-action="delete">حذف</button>
        </div>
      `;
      row.querySelector('[data-action="edit"]').addEventListener('click', () => startEdit(docSnap.id, post));
      row.querySelector('[data-action="delete"]').addEventListener('click', () => deletePost(docSnap.id));
      postsList.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    postsList.innerHTML = `<p class="admin-loading">تعذّر تحميل الأخبار.</p>`;
  }
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function startEdit(id, post) {
  postIdField.value = id;
  postType.value = post.type || 'news';
  postTitle.value = post.title || '';
  postCategory.value = post.category || '';
  postContent.value = post.content || '';
  updateTypeFields();

  uploadedPhotoUrls = [];
  photoPreview.innerHTML = '';
  postVideoLink.value = '';

  if (post.type === 'photo' && post.media) {
    uploadedPhotoUrls = post.media.split(',').map(s => s.trim()).filter(Boolean);
    uploadedPhotoUrls.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      photoPreview.appendChild(img);
    });
    uploadStatus.textContent = 'الصور الحالية معروضة أعلاه. اختر صوراً جديدة فقط إذا أردت استبدالها.';
  } else if (post.type === 'video') {
    postVideoLink.value = post.media || '';
  }

  formTitle.textContent = 'تعديل الخبر';
  submitBtn.textContent = 'حفظ التعديلات';
  cancelEditBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deletePost(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
  try {
    await deleteDoc(doc(db, 'news', id));
    loadPosts();
  } catch (err) {
    console.error(err);
    alert('تعذّر حذف الخبر.');
  }
}

/* ── One-time import from the old Google Sheet ──────────*/
async function checkImportStatus() {
  try {
    const metaRef = doc(db, 'meta', 'importStatus');
    const snap = await getDoc(metaRef);
    if (!snap.exists() || !snap.data().imported) {
      importSection.hidden = false;
    }
  } catch (err) {
    console.error(err);
  }
}

importBtn.addEventListener('click', async () => {
  if (!confirm('سيتم نسخ كل الأخبار من Google Sheet إلى قاعدة البيانات الجديدة. المتابعة؟')) return;
  importBtn.disabled = true;
  importBtn.textContent = 'جارٍ الاستيراد...';

  try {
    const res = await fetch(LEGACY_API_URL + '?t=' + Date.now());
    const oldPosts = await res.json();

    for (const post of oldPosts) {
      await addDoc(collection(db, 'news'), {
        type: (post.type || 'news').trim().toLowerCase(),
        title: post.title || '',
        category: post.category || '',
        content: post.content || '',
        media: post.media || '',
        date: post.date || '',
        createdAt: serverTimestamp(),
        authorEmail: 'imported',
      });
    }

    await setDoc(doc(db, 'meta', 'importStatus'), {
      imported: true,
      importedAt: serverTimestamp(),
      count: oldPosts.length
    });

    importSection.hidden = true;
    alert(`تم استيراد ${oldPosts.length} خبراً بنجاح.`);
    loadPosts();
  } catch (err) {
    console.error(err);
    alert('تعذّر الاستيراد، حاول مجدداً.');
    importBtn.disabled = false;
    importBtn.textContent = 'استيراد الآن';
  }
});
