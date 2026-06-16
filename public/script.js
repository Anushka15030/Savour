/* ═══════════════════════════════════════════════════════════════════════
   public/script.js — Shared utilities for all pages
   Covers: Auth state, API helper, Toast, Navbar, Auth Modal, Utilities
═══════════════════════════════════════════════════════════════════════ */

const API_BASE = '/api';

/* ── AUTH STATE ──────────────────────────────────────────────────────── */
const Auth = {
  getToken  : ()         => localStorage.getItem('recipe_token'),
  getUser   : ()         => { const u = localStorage.getItem('recipe_user'); return u ? JSON.parse(u) : null; },
  isLoggedIn: ()         => !!localStorage.getItem('recipe_token'),
  setSession: (t, u)     => { localStorage.setItem('recipe_token', t); localStorage.setItem('recipe_user', JSON.stringify(u)); },
  logout    : ()         => { localStorage.removeItem('recipe_token'); localStorage.removeItem('recipe_user'); Toast.show('Logged out successfully', 'info'); updateNavForAuth(); },
  headers   : ()         => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${Auth.getToken()}` }),
  isFavorite: (id)       => { const u = Auth.getUser(); if (!u?.favorites) return false; return u.favorites.some(f => (f._id || f) === id); },
  updateFavs: (favs)     => { const u = Auth.getUser(); if (u) { u.favorites = favs; localStorage.setItem('recipe_user', JSON.stringify(u)); } },
};

/* ── API HELPER ──────────────────────────────────────────────────────── */
const API = {
  get: async (ep) => {
    const r = await fetch(API_BASE + ep);
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || 'Request failed');
    return d;
  },
  post: async (ep, body, auth = false) => {
    const r = await fetch(API_BASE + ep, {
      method : 'POST',
      headers: auth ? Auth.headers() : { 'Content-Type': 'application/json' },
      body   : JSON.stringify(body),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || 'Request failed');
    return d;
  },
  authPost: async (ep, body) => API.post(ep, body, true),
};

/* ── TOAST ───────────────────────────────────────────────────────────── */
const Toast = {
  _c: null,
  init() {
    this._c = document.createElement('div');
    this._c.className = 'toast-container';
    document.body.appendChild(this._c);
  },
  show(msg, type = 'success') {
    if (!this._c) this.init();
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-text">${msg}</span>`;
    this._c.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
  },
};

/* ── NAVBAR ──────────────────────────────────────────────────────────── */
function initNavbar() {
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 10);
  });
  const hb = document.getElementById('hamburger');
  const nl = document.getElementById('navLinks');
  if (hb && nl) {
    hb.addEventListener('click', () => nl.classList.toggle('mobile-open'));
    nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nl.classList.remove('mobile-open')));
  }
  updateNavForAuth();
}

function updateNavForAuth() {
  const ab = document.getElementById('authButtons');
  const um = document.getElementById('userMenu');
  if (!ab) return;
  const u = Auth.getUser();
  if (Auth.isLoggedIn() && u) {
    ab.style.display = 'none';
    um.style.display = 'flex';
    const el = (id) => document.getElementById(id);
    if (el('userInitial'))       el('userInitial').textContent       = u.name.charAt(0).toUpperCase();
    if (el('dropdownUserName'))  el('dropdownUserName').textContent  = u.name;
    if (el('dropdownUserEmail')) el('dropdownUserEmail').textContent = u.email;
  } else {
    ab.style.display = 'flex';
    um.style.display = 'none';
  }
}

/* ── AUTH MODAL ──────────────────────────────────────────────────────── */
function initAuthModal() {
  const overlay   = document.getElementById('authModal');
  const loginForm = document.getElementById('loginForm');
  const signupForm= document.getElementById('signupForm');
  if (!overlay) return;

  window.openLoginModal = () => {
    overlay.classList.add('open');
    loginForm.style.display  = 'block';
    signupForm.style.display = 'none';
    overlay.querySelector('h2').textContent          = 'Welcome back';
    overlay.querySelector('.modal-sub').textContent  = 'Log in to save your favourite recipes.';
  };
  window.openSignupModal = () => {
    overlay.classList.add('open');
    loginForm.style.display  = 'none';
    signupForm.style.display = 'block';
    overlay.querySelector('h2').textContent          = 'Create account';
    overlay.querySelector('.modal-sub').textContent  = 'Join thousands of food lovers today.';
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  document.getElementById('closeModal')?.addEventListener('click', () => overlay.classList.remove('open'));
  document.getElementById('switchToSignup')?.addEventListener('click', e => { e.preventDefault(); openSignupModal(); });
  document.getElementById('switchToLogin')?.addEventListener('click',  e => { e.preventDefault(); openLoginModal(); });

  // LOGIN
  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl    = document.getElementById('loginError');
    errEl.classList.remove('show');
    if (!email || !password) { errEl.textContent = 'Please fill in all fields.'; errEl.classList.add('show'); return; }
    const btn = loginForm.querySelector('button[type="submit"]');
    btn.textContent = 'Signing in…'; btn.disabled = true;
    try {
      const data = await API.post('/auth/login', { email, password });
      Auth.setSession(data.token, data.user);
      overlay.classList.remove('open');
      Toast.show(`Welcome back, ${data.user.name}! 🎉`);
      updateNavForAuth();
      if (typeof onAuthChange === 'function') onAuthChange();
    } catch (err) { errEl.textContent = err.message; errEl.classList.add('show'); }
    finally { btn.textContent = 'Sign In'; btn.disabled = false; }
  });

  // SIGNUP
  signupForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const name     = document.getElementById('signupName').value.trim();
    const email    = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const errEl    = document.getElementById('signupError');
    errEl.classList.remove('show');
    if (!name || !email || !password)     { errEl.textContent = 'Please fill in all fields.';          errEl.classList.add('show'); return; }
    if (name.length < 2)                  { errEl.textContent = 'Name must be at least 2 characters.'; errEl.classList.add('show'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email))   { errEl.textContent = 'Please enter a valid email.';         errEl.classList.add('show'); return; }
    if (password.length < 6)              { errEl.textContent = 'Password must be at least 6 chars.';  errEl.classList.add('show'); return; }
    const btn = signupForm.querySelector('button[type="submit"]');
    btn.textContent = 'Creating account…'; btn.disabled = true;
    try {
      const data = await API.post('/auth/signup', { name, email, password });
      Auth.setSession(data.token, data.user);
      overlay.classList.remove('open');
      Toast.show(`Welcome, ${data.user.name}! 🎉`);
      updateNavForAuth();
      if (typeof onAuthChange === 'function') onAuthChange();
    } catch (err) { errEl.textContent = err.message; errEl.classList.add('show'); }
    finally { btn.textContent = 'Create Account'; btn.disabled = false; }
  });

  // LOGOUT
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    Auth.logout();
    document.getElementById('userMenu').style.display  = 'none';
    document.getElementById('authButtons').style.display = 'flex';
  });

  // USER MENU TOGGLE
  document.getElementById('userAvatarBtn')?.addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('userDropdown')?.classList.toggle('open');
  });
  document.addEventListener('click', () => document.getElementById('userDropdown')?.classList.remove('open'));
}

/* ── UTILITIES ───────────────────────────────────────────────────────── */
function generateStars(r) {
  const f = Math.floor(r), h = r % 1 >= .5, e = 5 - f - (h ? 1 : 0);
  return '★'.repeat(f) + (h ? '½' : '') + '☆'.repeat(e);
}

function formatTime(m) {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60), min = m % 60;
  return min ? `${h}h ${min}m` : `${h}h`;
}

function buildRecipeCard(recipe) {
  const isFav = Auth.isFavorite(recipe._id);
  return `
    <div class="recipe-card" onclick="window.location.href='/recipe.html?id=${recipe._id}'">
      <div class="recipe-card-image">
        <img src="${recipe.image}" alt="${recipe.title}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1546548970-71785318a17b?w=800'">
        <span class="recipe-card-badge">${recipe.category}</span>
        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${recipe._id}"
                onclick="event.stopPropagation();toggleFavorite(this,'${recipe._id}')">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="recipe-card-body">
        <span class="recipe-category">${recipe.difficulty || 'Easy'} · ${recipe.category}</span>
        <h3 class="recipe-title">${recipe.title}</h3>
        <div class="recipe-meta">
          <div class="recipe-rating">
            <span class="stars">${generateStars(recipe.averageRating || 0)}</span>
            <span>${recipe.averageRating ? recipe.averageRating.toFixed(1) : '—'}</span>
            <span style="color:var(--light);font-weight:400;font-size:.78rem">(${recipe.totalReviews || 0})</span>
          </div>
          <div class="recipe-info">
            <span class="recipe-info-item">⏱ ${formatTime(recipe.cookingTime)}</span>
            <span class="recipe-info-item">👥 ${recipe.servings}</span>
          </div>
        </div>
      </div>
    </div>`;
}

async function toggleFavorite(btn, recipeId) {
  if (!Auth.isLoggedIn()) { Toast.show('Please log in to save favourites', 'info'); window.openLoginModal?.(); return; }
  try {
    const data = await API.authPost(`/auth/favorites/${recipeId}`, {});
    Auth.updateFavs(data.favorites);
    document.querySelectorAll(`.fav-btn[data-id="${recipeId}"]`).forEach(b => {
      b.classList.toggle('active', data.favorited);
      b.textContent = data.favorited ? '❤️' : '🤍';
    });
    const mfb = document.getElementById('mainFavBtn');
    if (mfb && mfb.dataset.id === recipeId) {
      mfb.classList.toggle('active', data.favorited);
      mfb.innerHTML = data.favorited ? '❤️ Saved to Favourites' : '🤍 Add to Favourites';
    }
    Toast.show(data.message);
  } catch (err) { Toast.show(err.message, 'error'); }
}

function buildSkeletonCards(n = 3) {
  return Array(n).fill(`
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton" style="height:10px;width:40%;margin-bottom:8px"></div>
        <div class="skeleton" style="height:14px;width:80%;margin-bottom:6px"></div>
        <div class="skeleton" style="height:10px;width:55%"></div>
      </div>
    </div>`).join('');
}

function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── INIT ─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  initNavbar();
  initAuthModal();
  initScrollTop();
});
