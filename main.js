import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBEBm4KB3ZK9v82WjLl8irhNMiKHptfHns",
  authDomain: "locqar-website-3d1c6.firebaseapp.com",
  projectId: "locqar-website-3d1c6",
  storageBucket: "locqar-website-3d1c6.firebasestorage.app",
  messagingSenderId: "285807508142",
  appId: "1:285807508142:web:d59e8f068e2940b77bcb3f",
  measurementId: "G-S77JH57VSG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Set persistence so sessions survive refresh
setPersistence(auth, browserLocalPersistence);

// Helpers
function showToast(m, t) {
  t = t || 'success';
  var e = document.getElementById('toast');
  e.textContent = m;
  e.className = 'toast ' + t + ' show';
  setTimeout(function () { e.classList.remove('show') }, 3500);
}
function $(id) { return document.getElementById(id) }

var ham = $('hamburger'), mm = $('mobileMenu');
window.addEventListener('load', function () { setTimeout(function () { $('pageLoader').classList.add('hidden') }, 800) });

// Theme
var isDark = false;
function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  var icon = isDark ? '\u2600' : '\u263E';
  document.querySelectorAll('.theme-toggle').forEach(function (b) { b.innerHTML = icon });
}
$('themeToggle').addEventListener('click', toggleTheme);
$('themeToggle2').addEventListener('click', toggleTheme);
$('themeToggle3').addEventListener('click', toggleTheme);

// Scroll progress + parallax
window.addEventListener('scroll', function () {
  var h = document.documentElement.scrollHeight - window.innerHeight;
  $('scrollProgress').style.width = (h > 0 ? (window.pageYOffset / h) * 100 : 0) + '%';
  var y = window.pageYOffset;
  if (y < window.innerHeight) {
    var ht = $('heroText'), hp = $('heroPhone');
    if (ht) ht.style.transform = 'translateY(' + y * 0.15 + 'px)';
    if (hp) hp.style.transform = 'translateY(' + y * -0.1 + 'px)';
  }
  $('nav').style.boxShadow = y > 80 ? '0 4px 20px rgba(0,0,0,.15)' : 'none';
  if (y > 600) { $('floatingCta').classList.add('show'); $('backToTop').classList.add('show') }
  else { $('floatingCta').classList.remove('show'); $('backToTop').classList.remove('show') }
});
$('backToTop').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }) });

// Typing animation
var typingTexts = ['+233 24 555 1234', '+233 50 987 6543', '+233 27 111 2222'], tIdx = 0, cIdx = 0, deleting = false, typingEl = $('typingField');
function typeLoop() {
  if (!typingEl) return;
  var txt = typingTexts[tIdx];
  if (!deleting) {
    cIdx++;
    typingEl.textContent = txt.substring(0, cIdx);
    if (cIdx === txt.length) {
      setTimeout(function () {
        $('phoneBtn').textContent = 'Sent! \u2713';
        $('phoneBtn').classList.add('sent');
        $('phoneNotif').classList.add('show');
        setTimeout(function () {
          deleting = true;
          $('phoneBtn').textContent = 'Send Package \u2192';
          $('phoneBtn').classList.remove('sent');
          $('phoneNotif').classList.remove('show');
          typeLoop();
        }, 2500);
      }, 800);
      return;
    }
  } else {
    cIdx--;
    typingEl.textContent = txt.substring(0, cIdx);
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % typingTexts.length }
  }
  setTimeout(typeLoop, deleting ? 30 : 80);
}
setTimeout(typeLoop, 1500);

// Track
var trackDB = {
  'LQ-8294': { steps: [{ t: 'Package Dropped Off', time: 'Today, 9:15 AM', loc: 'Accra Mall', s: 'done' }, { t: 'In Transit', time: 'Today, 10:02 AM', loc: 'Moving to Legon Campus', s: 'done' }, { t: 'Arrived at Station', time: 'Today, 11:30 AM', loc: 'Legon Campus', s: 'active' }, { t: 'Awaiting Pickup', time: '', loc: 'Locker #14', s: '' }] },
  'LQ-5501': { steps: [{ t: 'Package Dropped Off', time: 'Yesterday, 2:45 PM', loc: 'Achimota Mall', s: 'done' }, { t: 'In Transit', time: 'Yesterday, 3:30 PM', loc: '', s: 'done' }, { t: 'Arrived at Station', time: 'Yesterday, 5:00 PM', loc: 'Kotoka Int. Airport', s: 'done' }, { t: 'Collected', time: 'Today, 8:12 AM', loc: 'Picked up by receiver', s: 'done' }] },
  'LQ-7720': { steps: [{ t: 'Package Dropped Off', time: 'Today, 7:00 AM', loc: 'Legon Campus', s: 'done' }, { t: 'Processing', time: 'Today, 7:15 AM', loc: 'Sorting', s: 'active' }, { t: 'In Transit', time: '', loc: '', s: '' }, { t: 'Ready for Pickup', time: '', loc: '', s: '' }] }
};
$('trackBtn').addEventListener('click', function () {
  var code = $('trackInput').value.trim().toUpperCase();
  $('trackError').classList.remove('show');
  $('trackResult').classList.remove('show');
  if (!code) { showToast('Enter a tracking code', 'error'); return }
  var pkg = trackDB[code];
  if (!pkg) { $('trackError').classList.add('show'); return }
  $('trackCode').textContent = code;
  var tl = $('trackTimeline');
  tl.innerHTML = '';
  pkg.steps.forEach(function (s) {
    var d = document.createElement('div');
    d.className = 'track-step' + (s.s ? ' ' + s.s : '');
    d.innerHTML = '<div class="ts-title">' + s.t + '</div>' + (s.time ? '<div class="ts-time">' + s.time + '</div>' : '') + (s.loc ? '<div class="ts-loc">' + s.loc + '</div>' : '');
    tl.appendChild(d);
  });
  $('trackResult').classList.add('show');
});
$('trackInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('trackBtn').click() });

// Station finder
var stations = [
  { name: 'Accra Mall', loc: 'Tetteh Quarshie, East Legon', x: 68, y: 42, status: 'open' },
  { name: 'Achimota Mall', loc: 'Achimota, Accra', x: 35, y: 28, status: 'open' },
  { name: 'Legon Campus', loc: 'University of Ghana, Legon', x: 55, y: 22, status: 'open' },
  { name: 'Kotoka Int. Airport', loc: 'Airport City, Accra', x: 58, y: 55, status: 'open' }
];
function buildMap() {
  var mc = $('mapCanvas'), sl = $('stationList');
  var svg = '<svg class="map-roads" viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%">';
  for (var i = 10; i <= 90; i += 12) svg += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="100"/>';
  for (var j = 10; j <= 90; j += 15) svg += '<line x1="0" y1="' + j + '" x2="100" y2="' + j + '"/>';
  svg += '<line x1="5" y1="45" x2="95" y2="45" style="stroke-width:2"/><line x1="50" y1="5" x2="50" y2="95" style="stroke-width:2"/></svg>';
  mc.innerHTML = svg;
  stations.forEach(function (s, i) {
    var pin = document.createElement('div');
    pin.className = 'map-pin';
    pin.style.left = s.x + '%';
    pin.style.top = s.y + '%';
    pin.innerHTML = '<div class="pin-pulse"></div><div class="pin-dot"></div><div class="pin-label">' + s.name + '</div>';
    pin.addEventListener('click', function () {
      document.querySelectorAll('.station-card').forEach(function (c) { c.classList.remove('active') });
      var card = document.querySelector('[data-station="' + i + '"]');
      if (card) { card.classList.add('active'); card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }
    });
    mc.appendChild(pin);
    var card = document.createElement('div');
    card.className = 'station-card';
    card.dataset.station = i;
    card.innerHTML = '<h4>&#128205; ' + s.name + '</h4><div class="sc-loc">' + s.loc + '</div><div class="sc-meta"><span class="sc-badge open">OPEN</span></div>';
    card.addEventListener('click', function () {
      document.querySelectorAll('.station-card').forEach(function (c) { c.classList.remove('active') });
      card.classList.add('active');
    });
    sl.appendChild(card);
  });
}
buildMap();

// Page nav
function showPage(p) {
  $('homePage').style.display = p === 'home' ? '' : 'none';
  $('bizPage').style.display = p === 'biz' ? 'block' : 'none';
  $('bizDashboard').style.display = p === 'dashboard' ? 'block' : 'none';
  $('homeNav').style.display = p === 'home' ? '' : 'none';
  $('subNav').style.display = p !== 'home' ? '' : 'none';
  document.querySelectorAll('.mm-home').forEach(function (el) { el.style.display = p === 'home' ? '' : 'none' });
  document.querySelectorAll('.mm-sub').forEach(function (el) { el.style.display = p !== 'home' ? '' : 'none' });
  $('floatingCta').style.display = p === 'home' ? '' : 'none';
  window.scrollTo({ top: 0 });
  ham.classList.remove('active');
  mm.classList.remove('open');
  if (p === 'dashboard') initDashboard();
  var obs2 = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible') }) }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.remove('visible'); obs2.observe(el) });
}
$('logoBtn').addEventListener('click', function (e) { e.preventDefault(); showPage('home') });
$('backNav').addEventListener('click', function () { var isDash = $('bizDashboard').style.display === 'block'; if (isDash) { showPage('biz') } else { showPage('home') } });
$('backMobile').addEventListener('click', function () { var isDash = $('bizDashboard').style.display === 'block'; if (isDash) { showPage('biz') } else { showPage('home') } });
document.addEventListener('click', function (e) { if (e.target.classList.contains('go-biz')) { e.preventDefault(); showPage('biz') } });
ham.addEventListener('click', function () { ham.classList.toggle('active'); mm.classList.toggle('open') });
document.querySelectorAll('#mobileMenu a').forEach(function (a) { a.addEventListener('click', function () { ham.classList.remove('active'); mm.classList.remove('open') }) });
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var h = a.getAttribute('href');
    if (h === '#') return;
    e.preventDefault();
    var t = document.querySelector(h);
    if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
  });
});
var obs = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible') }) }, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el) });
var cObs = new IntersectionObserver(function (en) {
  en.forEach(function (e) {
    if (!e.isIntersecting) return;
    var el = e.target, c = parseInt(el.dataset.count), s = el.dataset.suffix || '';
    if (isNaN(c)) return;
    var cur = 0, step = Math.max(1, Math.floor(c / 40)), iv = setInterval(function () { cur += step; if (cur >= c) { cur = c; clearInterval(iv) } el.textContent = cur.toLocaleString() + s }, 30);
    cObs.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(function (el) { cObs.observe(el) });

// ===== CONSUMER AUTH =====
var modal = $('authModal');
function openModal() { modal.classList.add('open'); document.body.style.overflow = 'hidden' }
function closeModalFn() { modal.classList.remove('open'); document.body.style.overflow = '' }
var olm = $('openLoginMobile');
if (olm) olm.addEventListener('click', function (e) { e.preventDefault(); ham.classList.remove('active'); mm.classList.remove('open'); openModal() });
$('closeModal').addEventListener('click', closeModalFn);
modal.addEventListener('click', function (e) { if (e.target === modal) closeModalFn() });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModalFn() });

function switchTab(t) {
  document.querySelectorAll('.modal-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === t) });
  $('loginForm').style.display = t === 'login' ? 'block' : 'none';
  $('signupForm').style.display = t === 'signup' ? 'block' : 'none';
  $('modalTitle').textContent = t === 'login' ? 'Welcome Back' : 'Create Account';
  $('modalDesc').textContent = t === 'login' ? 'Log in to manage your packages' : 'Join LocQar';
}
document.querySelectorAll('.modal-tab').forEach(function (t) { t.addEventListener('click', function () { switchTab(t.dataset.tab) }) });

// Consumer signup
$('signupBtn').addEventListener('click', function () {
  var name = $('signupName').value.trim(), phone = $('signupPhone').value.trim(), pass = $('signupPass').value, btn = $('signupBtn');
  if (!name || !phone || !pass) { showToast('Please fill in all fields', 'error'); return }
  if (pass.length < 6) { showToast('Password must be at least 6 characters', 'error'); return }
  var email = phone.replace(/[^0-9]/g, '') + '@locqar.app';
  btn.textContent = 'Creating...'; btn.disabled = true;
  createUserWithEmailAndPassword(auth, email, pass)
    .then(function (r) { return updateProfile(r.user, { displayName: name }) })
    .then(function () { closeModalFn(); showToast('Account created! Welcome, ' + name + '!'); updateNav() })
    .catch(function (err) { showToast(err.code === 'auth/email-already-in-use' ? 'Phone already registered' : err.message, 'error') })
    .finally(function () { btn.textContent = 'Create Account'; btn.disabled = false });
});

// Consumer login
$('loginBtn').addEventListener('click', function () {
  var phone = $('loginPhone').value.trim(), pass = $('loginPass').value, btn = $('loginBtn');
  if (!phone || !pass) { showToast('Please fill in all fields', 'error'); return }
  var email = phone.replace(/[^0-9]/g, '') + '@locqar.app';
  btn.textContent = 'Logging in...'; btn.disabled = true;
  signInWithEmailAndPassword(auth, email, pass)
    .then(function (r) { closeModalFn(); showToast('Welcome back, ' + (r.user.displayName || 'there') + '!'); updateNav() })
    .catch(function (err) { showToast(err.code === 'auth/user-not-found' ? 'No account found' : 'Incorrect password', 'error') })
    .finally(function () { btn.textContent = 'Log In'; btn.disabled = false });
});

// Google sign-in
$('googleBtn').addEventListener('click', function () {
  signInWithPopup(auth, googleProvider)
    .then(function (r) { closeModalFn(); showToast('Welcome, ' + (r.user.displayName || 'there') + '!'); updateNav() })
    .catch(function (err) { showToast(err.message, 'error') });
});

function updateNav() { }
onAuthStateChanged(auth, function (u) { if (u) updateNav() });

// ===== BIZ PAGE TABS =====
function bizShowTab(id) {
  document.querySelectorAll('.biz-section').forEach(function (s) { s.classList.remove('active') });
  document.querySelectorAll('.biz-nav-tab').forEach(function (t) { t.classList.remove('active') });
  var sec = $('biz-' + id); if (sec) sec.classList.add('active');
  var tab = document.querySelector('[data-biz="' + id + '"]'); if (tab) tab.classList.add('active');
  var navEl = $('bizNav'); if (navEl) navEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
// Expose for inline onclick handlers
window.bizShowTab = bizShowTab;

document.querySelectorAll('.biz-nav-tab').forEach(function (t) { t.addEventListener('click', function () { bizShowTab(t.dataset.biz) }) });

// Pricing toggle
document.querySelectorAll('.bp-toggle-btn').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('.bp-toggle-btn').forEach(function (x) { x.classList.remove('active') });
    b.classList.add('active');
    var c = b.dataset.cycle;
    document.querySelectorAll('.bp-price').forEach(function (p) { p.innerHTML = c === 'annual' ? p.dataset.a : p.dataset.m });
  });
});

// ===== BIZ AUTH =====
function bizAuthSwitch(t) {
  $('bizLoginView').classList.toggle('active', t === 'login');
  $('bizRegisterView').classList.toggle('active', t === 'register');
  $('bizSuccess').style.display = 'none';
  $('bizTabLogin').classList.toggle('active', t === 'login');
  $('bizTabRegister').classList.toggle('active', t === 'register');
  if (t === 'register') bizGoStep(1);
}
$('bizTabLogin').addEventListener('click', function () { bizAuthSwitch('login') });
$('bizTabRegister').addEventListener('click', function () { bizAuthSwitch('register') });
$('bizGoRegister').addEventListener('click', function () { bizAuthSwitch('register') });

function bizGoStep(n) {
  document.querySelectorAll('.reg-step').forEach(function (s) { s.classList.remove('active') });
  $('bizStep' + n).classList.add('active');
  for (var i = 1; i <= 3; i++) {
    var d = $('sd' + i), l = $('sl' + (i - 1));
    d.classList.remove('active', 'done');
    if (i < n) { d.classList.add('done'); d.textContent = '\u2713' }
    else if (i === n) { d.classList.add('active'); d.textContent = i }
    else d.textContent = i;
    if (l) l.classList.toggle('done', i <= n);
  }
}
$('bizNext1').addEventListener('click', function () { if (!$('bizName').value.trim() || !$('bizType').value || !$('bizVolume').value || !$('bizLocation').value.trim()) { showToast('Fill in all required fields', 'error'); return } bizGoStep(2) });
$('bizNext2').addEventListener('click', function () { if (!$('bizFirst').value.trim() || !$('bizLast').value.trim() || !$('bizPhone').value.trim()) { showToast('Fill in all required fields', 'error'); return } bizGoStep(3) });
$('bizBack2').addEventListener('click', function () { bizGoStep(1) });
$('bizBack3').addEventListener('click', function () { bizGoStep(2) });

// Password strength
$('bizPwInput').addEventListener('input', function () {
  var v = this.value, s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  var colors = ['', '#FF4D4D', '#FF9F43', '#FBBF24', '#34D399'], labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  for (var i = 1; i <= 4; i++) $('pb' + i).style.background = i <= s ? colors[s] : 'rgba(255,255,255,.1)';
  $('pwLabel').textContent = v.length > 0 ? labels[s] : '';
  $('pwLabel').style.color = colors[s];
});

// Biz register submit
$('bizSubmit').addEventListener('click', function () {
  var pw = $('bizPwInput').value, pw2 = $('bizPwConfirm').value, btn = $('bizSubmit');
  if (pw.length < 8) { showToast('Password must be at least 8 characters', 'error'); return }
  if (pw !== pw2) { showToast('Passwords do not match', 'error'); return }
  if (!$('bizTerms').checked) { showToast('Please agree to the Terms', 'error'); return }
  var phone = $('bizPhone').value.trim();
  var dn = $('bizFirst').value.trim() + ' ' + $('bizLast').value.trim() + ' [' + $('bizName').value.trim() + ']';
  var email = phone.replace(/[^0-9]/g, '') + '@biz.locqar.app';
  btn.textContent = 'Creating...'; btn.disabled = true;
  createUserWithEmailAndPassword(auth, email, pw)
    .then(function (r) { return updateProfile(r.user, { displayName: dn }) })
    .then(function () {
      document.querySelectorAll('.biz-form-view').forEach(function (v) { v.classList.remove('active') });
      $('bizSuccess').style.display = 'block';
      $('bizSuccessTitle').textContent = 'Account Created!';
      $('bizSuccessMsg').textContent = 'Your business account for ' + $('bizName').value.trim() + ' is ready. Redirecting...';
      showToast('Business account created!');
      setTimeout(function () { showPage('dashboard') }, 1500);
    })
    .catch(function (err) { showToast(err.code === 'auth/email-already-in-use' ? 'Phone already registered. Try logging in.' : err.message, 'error') })
    .finally(function () { btn.textContent = 'Create Business Account'; btn.disabled = false });
});

// Biz login
$('bizLoginBtn').addEventListener('click', function () {
  var phone = $('bizLoginPhone').value.trim(), pw = $('bizLoginPass').value, btn = $('bizLoginBtn');
  if (!phone || !pw) { showToast('Fill in all fields', 'error'); return }
  var email = phone.replace(/[^0-9]/g, '') + '@biz.locqar.app';
  btn.textContent = 'Signing in...'; btn.disabled = true;
  signInWithEmailAndPassword(auth, email, pw)
    .then(function (r) {
      var name = (r.user.displayName || '').split('[')[0].trim() || 'there';
      document.querySelectorAll('.biz-form-view').forEach(function (v) { v.classList.remove('active') });
      $('bizSuccess').style.display = 'block';
      $('bizSuccessTitle').textContent = 'Welcome Back, ' + name + '!';
      $('bizSuccessMsg').textContent = 'Redirecting to your dashboard...';
      showToast('Welcome back!');
      setTimeout(function () { showPage('dashboard') }, 1200);
    })
    .catch(function (err) { showToast(err.code === 'auth/user-not-found' ? 'No account found' : 'Incorrect password', 'error') })
    .finally(function () { btn.textContent = 'Sign In'; btn.disabled = false });
});

// Dashboard
$('bizSuccessBtn').addEventListener('click', function () { showPage('dashboard') });

function initDashboard() {
  var u = auth.currentUser;
  if (!u) return;
  var dn = u.displayName || 'User';
  var parts = dn.split('[');
  var name = parts[0].trim();
  var biz = parts[1] ? parts[1].replace(']', '').trim() : 'My Business';
  var first = name.split(' ')[0] || 'there';
  var initials = name.split(' ').map(function (w) { return w[0] }).join('').toUpperCase().substring(0, 2) || 'U';
  var h = new Date().getHours();
  var greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  $('dashGreeting').textContent = greet + ', ' + first + '!';
  $('dashUserName').textContent = name;
  $('dashUserRole').textContent = biz;
  $('dashAvatar').textContent = initials;
  var now = new Date();
  var opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  $('dashDate').textContent = now.toLocaleDateString('en-US', opts);
}

$('dashLogout').addEventListener('click', function () {
  signOut(auth).then(function () { showPage('biz'); bizAuthSwitch('login'); showToast('Logged out successfully') });
});
$('dashSendPkg').addEventListener('click', function () { showToast('Send Package form coming soon!') });
$('dashBulkUpload').addEventListener('click', function () { showToast('Bulk upload coming soon!') });
$('dashTeam').addEventListener('click', function () { showToast('Team management coming soon!') });
$('dashExport').addEventListener('click', function () { showToast('Generating report...'); setTimeout(function () { showToast('Report downloaded!') }, 1500) });

// Auto-redirect to dashboard if a biz user is already logged in (session persisted)
onAuthStateChanged(auth, function (u) {
  if (u && u.email && u.email.endsWith('@biz.locqar.app')) {
    // User has an active biz session — show dashboard
    showPage('dashboard');
  }
});

// FAQ, newsletter, cookies
document.querySelectorAll('.faq-q').forEach(function (q) {
  q.addEventListener('click', function () {
    var i = q.parentElement, w = i.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function (x) { x.classList.remove('open') });
    if (!w) i.classList.add('open');
  });
});
$('nlBtn').addEventListener('click', function () { var e = $('nlEmail').value; if (!e || e.indexOf('@') < 0) { showToast('Enter a valid email', 'error'); return } $('nlEmail').value = ''; showToast('Subscribed!') });
setTimeout(function () { $('cookieBanner').classList.add('show') }, 2000);
$('cookieAccept').addEventListener('click', function () { $('cookieBanner').classList.remove('show') });
$('cookieDecline').addEventListener('click', function () { $('cookieBanner').classList.remove('show') });
