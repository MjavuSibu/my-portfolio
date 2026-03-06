'use strict';

/* ── SCROLL PROGRESS ────────────────────────────── */
(function () {
  var bar = document.getElementById('progress');
  function upd() {
    var s = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) bar.style.height = (s / h * 100) + '%';
  }
  window.addEventListener('scroll', upd, { passive: true });
  upd();
})();

/* ── CUSTOM CURSOR ──────────────────────────────── */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  var dot = document.getElementById('cdot');
  var ring = document.getElementById('cring');
  if (!dot || !ring) return;
  var mx = -300, my = -300, rx = -300, ry = -300, visible = false;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate(calc(' + mx + 'px - 50%), calc(' + my + 'px - 50%))';
    if (!visible) { visible = true; dot.style.opacity = '1'; ring.style.opacity = '1'; }
  }, { passive: true });
  (function loop() {
    rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
    ring.style.transform = 'translate(calc(' + rx + 'px - 50%), calc(' + ry + 'px - 50%))';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .proj-card, .sk-card, .cert-card, .cc2').forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('hov'); dot.classList.add('hov'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('hov'); dot.classList.remove('hov'); });
  });
  document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { if (visible) { dot.style.opacity = '1'; ring.style.opacity = '1'; } });
})();

/* ── NAV SCROLL STATE ───────────────────────────── */
(function () {
  var nav = document.getElementById('nav');
  function upd() { nav.classList.toggle('sc', window.scrollY > 60); }
  window.addEventListener('scroll', upd, { passive: true });
  upd();
})();

/* ── MOBILE MENU ────────────────────────────────── */
(function () {
  var hbg = document.getElementById('hbg');
  var mob = document.getElementById('mob');
  if (!hbg || !mob) return;
  var open = false;
  function toggle() {
    open = !open;
    hbg.classList.toggle('open', open);
    mob.classList.toggle('open', open);
    hbg.setAttribute('aria-expanded', String(open));
    mob.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  hbg.addEventListener('click', toggle);
  var mobClose = document.getElementById('mobClose');
  if (mobClose) mobClose.addEventListener('click', toggle);
  mob.querySelectorAll('.mob-a').forEach(function (a) {
    a.addEventListener('click', function () { if (open) toggle(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) toggle(); });
})();

/* ── TYPEWRITER ─────────────────────────────────── */
(function () {
  var el = document.getElementById('roleDisplay');
  if (!el) return;
  var roles = ['Full-Stack Developer', 'Mobile App Engineer', 'Flutter Developer', 'ASP.NET Developer', 'Problem Solver'];
  var ri = 0, ci = 0, deleting = false, pausing = false;
  function tick() {
    if (pausing) { pausing = false; setTimeout(tick, 1800); return; }
    var word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; pausing = true; setTimeout(tick, 80); return; }
      setTimeout(tick, 90);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 320); return; }
      setTimeout(tick, 48);
    }
  }
  setTimeout(tick, 1200);
})();

/* ── COUNTER ANIMATION ──────────────────────────── */
function animateCounter(el) {
  var target = parseInt(el.dataset.count, 10);
  var suffix = el.dataset.suffix || '';
  var steps = 55, current = 0;
  var stepVal = Math.ceil(target / steps);
  var timer = setInterval(function () {
    current = Math.min(current + stepVal, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 1600 / steps);
}

/* ── SCROLL REVEAL + COUNTERS ───────────────────── */
(function () {
  var revEls = document.querySelectorAll('.rv, .rv-left, .rv-right');
  var cntEls = document.querySelectorAll('[data-count]');
  var triggered = new Set();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revEls.forEach(function (e) { e.classList.add('on'); });
    cntEls.forEach(function (e) { animateCounter(e); });
    return;
  }

  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('on'); revObs.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revEls.forEach(function (e) { revObs.observe(e); });

  var cntObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && !triggered.has(en.target)) {
        triggered.add(en.target);
        animateCounter(en.target);
        cntObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.5 });
  cntEls.forEach(function (e) { cntObs.observe(e); });
})();

/* ── ACTIVE NAV LINKS ───────────────────────────── */
(function () {
  var secs = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-a[href^="#"]');
  if (!secs.length || !links.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var id = en.target.id;
        links.forEach(function (l) { l.classList.toggle('act', l.getAttribute('href') === '#' + id); });
      }
    });
  }, { rootMargin: '-' + Math.round(window.innerHeight * 0.4) + 'px 0px -' + Math.round(window.innerHeight * 0.4) + 'px 0px' });
  secs.forEach(function (s) { obs.observe(s); });
})();

/* ── HORIZONTAL DRAG SCROLL ─────────────────────── */
(function () {
  var el = document.getElementById('projScroll');
  if (!el) return;
  var isDown = false, startX = 0, scrollLeft = 0;
  el.addEventListener('mousedown', function (e) { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; el.style.userSelect = 'none'; });
  el.addEventListener('mouseleave', function () { isDown = false; el.style.userSelect = ''; });
  el.addEventListener('mouseup', function () { isDown = false; el.style.userSelect = ''; });
  el.addEventListener('mousemove', function (e) { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.4; });
})();

/* ── 3D CARD TILT ───────────────────────────────── */
document.querySelectorAll('.proj-card').forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    var r = card.getBoundingClientRect();
    var rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 6;
    var ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * -6;
    card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
    card.style.transition = 'transform .05s';
  });
  card.addEventListener('mouseleave', function () {
    card.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ── FOOTER YEAR ────────────────────────────────── */
var yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ── CHATBOT ────────────────────────────────────── */
(function () {
  var toggle = document.getElementById('chatToggle');
  var win = document.getElementById('chatWindow');
  var closeBtn = document.getElementById('chatClose');
  var input = document.getElementById('chatInput');
  var sendBtn = document.getElementById('chatSend');
  var msgs = document.getElementById('chatMsgs');
  var unread = document.getElementById('chatUnread');
  var sugs = document.getElementById('chatSugs');
  if (!toggle || !win) return;

  var isOpen = false, isLoading = false, firstOpen = true;
  var history = [];

  var SYSTEM = 'You are SibuBot — the sharp, confident AI inside Sibulele Mjavu\'s portfolio. She is a woman. Use she/her pronouns. Always.\n\nRULES: Never open two replies the same way. Max 2-3 sentences. No filler like "Great question". If a topic was covered, redirect.\n\nSIBULELE\'S PROFILE:\n- IT graduate, Central University of Technology (2022–2025), 80%+ final-year average\n- Seeking graduate programs, internships, junior developer roles\n- Based in Fourways, Sandton, South Africa\n- Email: mjavusibulele@gmail.com | Phone: +27 69 994 7924\n- GitHub: github.com/MjavuSibu | LinkedIn: linkedin.com/in/sibulele-mjavu\n\nSTACK: C#, Python, Dart | ASP.NET Core, ASP.NET MVC, Flutter, HTML5, CSS3, Pandas, NumPy\nTOOLS: GitHub, VS Code, PyCharm, Android Studio, MS Office\n\nPROJECTS:\n1. VeriWork Mobile — Flutter + Firebase. Selfie-based employee identity verification. Eliminates ghost workers. github.com/MjavuSibu/VeriWork-Mobile\n2. AI Mental Health Chatbot — Python + NLP + ML. Crisis detection with helpline referrals. github.com/MjavuSibu/AI-Based_MentalHealth_Chatbot\n3. Campus Lost & Found App — Flutter. Replaced campus WhatsApp chaos with searchable real-time mobile system. github.com/MjavuSibu/Lost-and-Found-Campus-App\n4. HealthSpark — Health monitoring system with patient, doctor, and admin portals. github.com/MjavuSibu/HealthSpark\n\nCERTS (7): Cisco IT Essentials, Cybersecurity, Python Essentials 1, Modern AI, Data Science; Samsung Innovation Campus — AI & Python (2025), Coding & Programming (2025).\n\nTONE: Confident, direct, dry humour welcome. Talk ABOUT Sibulele — never pretend to be her.';

  function addMsg(text, role) {
    var div = document.createElement('div'); div.className = 'msg ' + role;
    if (role === 'bot') { var ico = document.createElement('div'); ico.className = 'msg-ico'; ico.textContent = 'SB'; div.appendChild(ico); }
    var bub = document.createElement('div'); bub.className = 'msg-bub'; bub.textContent = text;
    div.appendChild(bub); msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var wrap = document.createElement('div'); wrap.className = 'msg bot'; wrap.id = 'typingMsg';
    var ico = document.createElement('div'); ico.className = 'msg-ico'; ico.textContent = 'SB';
    var dots = document.createElement('div'); dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    wrap.appendChild(ico); wrap.appendChild(dots); msgs.appendChild(wrap); msgs.scrollTop = msgs.scrollHeight;
    return wrap;
  }

  async function send(text) {
    if (isLoading || !text.trim()) return;
    isLoading = true; sendBtn.disabled = true;
    sugs.style.display = 'none';
    addMsg(text, 'user');
    history.push({ role: 'user', content: text });
    var typingEl = showTyping();
    try {
      var res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: SYSTEM, messages: history })
      });
      var data = await res.json();
      var reply = (data.content || []).map(function (b) { return b.text || ''; }).join('') || 'Something went sideways. Try again — or email her directly.';
      typingEl.remove(); history.push({ role: 'assistant', content: reply }); addMsg(reply, 'bot');
    } catch (err) {
      typingEl.remove(); addMsg('Network issue. Her email always works: mjavusibulele@gmail.com', 'bot');
    }
    isLoading = false; sendBtn.disabled = false; input.focus();
  }

  function openChat() {
    isOpen = true; win.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); unread.style.display = 'none';
    if (firstOpen) { firstOpen = false; setTimeout(function () { addMsg("Hey — I'm SibuBot. Ask me about Sibulele's projects, stack, certifications, or why you should hire her.", 'bot'); }, 350); }
  }
  function closeChat() { isOpen = false; win.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }

  toggle.addEventListener('click', function () { isOpen ? closeChat() : openChat(); });
  closeBtn.addEventListener('click', closeChat);
  sendBtn.addEventListener('click', function () { var v = input.value.trim(); if (v) { send(v); input.value = ''; } });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); var v = input.value.trim(); if (v) { send(v); input.value = ''; } } });
  input.addEventListener('input', function () { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 96) + 'px'; });
  sugs.querySelectorAll('.sug').forEach(function (btn) { btn.addEventListener('click', function () { send(btn.dataset.q); }); });
})();
