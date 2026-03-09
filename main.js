/* ================================================
   Blushing Blooms — UI, Animations & Interactions
   main.js
   ================================================ */

/* ════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════ */
window.toggleMobileMenu = function() {
  const menu = document.getElementById("mobile-menu");
  const btn  = document.getElementById("hamburger");
  const isOpen = menu.classList.contains("open");
  if (isOpen) { menu.classList.remove("open"); btn.classList.remove("open"); document.body.style.overflow = ""; }
  else        { menu.classList.add("open");    btn.classList.add("open");    document.body.style.overflow = "hidden"; }
};
window.closeMobileMenu = function() {
  document.getElementById("mobile-menu").classList.remove("open");
  document.getElementById("hamburger").classList.remove("open");
  document.body.style.overflow = "";
};

/* ════════════════════════════════════════
   FLOATING PETALS
════════════════════════════════════════ */
const petalsContainer = document.getElementById("petals-bg");
const petalEmojis = ["🌸","🌷","✿","❀","🌹","🌺","💐"];
for (let i = 0; i < 18; i++) {
  const p = document.createElement("span");
  p.className = "petal";
  p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.animationDuration = (12 + Math.random() * 20) + "s";
  p.style.animationDelay = (Math.random() * 18) + "s";
  p.style.fontSize = (14 + Math.random() * 18) + "px";
  petalsContainer.appendChild(p);
}

/* ════════════════════════════════════════
   MARQUEE
════════════════════════════════════════ */
const marqueeItems = ["Bouquets", "Arrangements", "Gift Sets", "Event Florals",
  "Wedding Flowers", "Custom Orders", "Fresh Daily", "Made with Love",
  "📍 Davao City", "Angalan · Tugbok"];
const track = document.getElementById("marquee-track");
for (let t = 0; t < 2; t++) {
  marqueeItems.forEach(item => {
    const s = document.createElement("span"); s.className = "marquee-item"; s.textContent = item;
    track.appendChild(s);
    const d = document.createElement("span"); d.className = "marquee-dot"; d.textContent = "✦";
    track.appendChild(d);
  });
}

/* ════════════════════════════════════════
   NAV SCROLL
════════════════════════════════════════ */
window.addEventListener("scroll", () => {
  document.getElementById("main-nav").classList.toggle("scrolled", window.scrollY > 40);
});

/* ════════════════════════════════════════
   RIPPLE EFFECT — applied to all buttons & links
════════════════════════════════════════ */
function addRipple(el, e) {
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.5;
  const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left - size/2;
  const y = (e.clientY || e.touches?.[0]?.clientY || rect.top  + rect.height/2) - rect.top  - size/2;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
  el.style.position = "relative";
  el.style.overflow = "hidden";
  el.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

document.addEventListener("click", (e) => {
  const el = e.target.closest("button, .btn-primary, .btn-outline, .product-order, .nav-fb, .btn-fb-large, .filter-tab, .btn-add, .btn-save, .btn-stock, .btn-edit, .btn-del, .btn-logout, .btn-cancel, .login-form button");
  if (el && !el.classList.contains("disabled")) addRipple(el, e);
});

/* ════════════════════════════════════════
   PETAL BURST — on Order Now / Facebook buttons
════════════════════════════════════════ */
function petalBurst(x, y) {
  const emojis = ["🌸","🌷","🌹","✿","❀","🌺"];
  const count  = 8;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "pburst";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle  = (i / count) * 360 + Math.random() * 20;
    const dist   = 60 + Math.random() * 60;
    const rad    = (angle * Math.PI) / 180;
    el.style.setProperty("--dx", Math.cos(rad) * dist + "px");
    el.style.setProperty("--dy", Math.sin(rad) * dist + "px");
    el.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    el.style.left = x - 10 + "px";
    el.style.top  = y - 10 + "px";
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

document.addEventListener("click", (e) => {
  const el = e.target.closest(".product-order:not(.disabled), .btn-fb-large, .nav-fb, .mobile-menu-fb");
  if (el) petalBurst(e.clientX, e.clientY);
});

/* ════════════════════════════════════════
   MAGNETIC BUTTON EFFECT
════════════════════════════════════════ */
function magneticEffect(el) {
  el.addEventListener("mousemove", (e) => {
    const rect   = el.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) * 0.22;
    const dy     = (e.clientY - cy) * 0.22;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
    el.style.transition = "transform .4s cubic-bezier(.34,1.56,.64,1)";
    setTimeout(() => el.style.transition = "", 400);
  });
}

document.querySelectorAll(".btn-primary, .btn-outline, .btn-fb-large").forEach(magneticEffect);

/* ════════════════════════════════════════
   3D CARD TILT
════════════════════════════════════════ */
function applyTilt(card) {
  card.addEventListener("mousemove", (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const cx    = rect.width  / 2;
    const cy    = rect.height / 2;
    const rotY  =  ((x - cx) / cx) * 8;
    const rotX  = -((y - cy) / cy) * 6;
    card.style.transform   = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    card.style.boxShadow   = `${-rotY * 2}px ${rotX * 2}px 40px rgba(139,58,82,0.18)`;
    card.style.transition  = "box-shadow .1s";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform  = "";
    card.style.boxShadow  = "";
    card.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .5s";
  });
}

function attachTilts() {
  document.querySelectorAll(".product-card").forEach(applyTilt);
}

/* ════════════════════════════════════════
   FILTER TABS
════════════════════════════════════════ */
let activeFilter = "all";
document.querySelectorAll(".filter-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.cat;
    if (window._products) renderProducts(window._products);
  });
});

/* ════════════════════════════════════════
   RENDER PRODUCTS
════════════════════════════════════════ */
function renderProducts(data) {
  const grid = document.getElementById("products-grid");
  const entries = Object.values(data || {});
  const filtered = activeFilter === "all" ? entries : entries.filter(p => p.cat === activeFilter);

  if (!filtered.length) {
    grid.innerHTML = `<div class="no-products"><div class="big-icon">🌷</div><p>No flowers in this category yet — check back soon!</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card card-animate" style="animation-delay:${i * 0.07}s;${!p.stock ? 'opacity:0.8' : ''}">
      ${!p.stock ? '<div class="out-of-stock-overlay"></div>' : ''}
      <div class="product-card-img">
        <span>${p.icon || "🌸"}</span>
        <span class="product-badge ${p.stock ? 'badge-in' : 'badge-out'}">
          ${p.stock ? "✦ In Stock" : "Out of Stock"}
        </span>
      </div>
      <div class="product-card-body">
        <div class="product-cat">${catLabel(p.cat)}</div>
        <div class="product-name">${p.name}</div>
        ${p.desc ? `<div class="product-desc">${p.desc}</div>` : ''}
        <div class="product-footer">
          <div class="product-price">${p.price}</div>
          ${p.stock
            ? `<a href="https://www.facebook.com/profile.php?id=61585046258862" target="_blank" class="product-order">Order Now</a>`
            : `<span class="product-order disabled">Unavailable</span>`
          }
        </div>
      </div>
    </div>
  `).join("");

  // Re-attach tilt after render
  setTimeout(attachTilts, 50);
}

function catLabel(cat) {
  return { bouquet:"Bouquet", arrangement:"Arrangement", gift:"Gift Set", event:"Event Florals" }[cat] || cat || "Flower";
}

/* ════════════════════════════════════════
   RENDER ADMIN PRODUCT LIST
════════════════════════════════════════ */
window.renderAdminProducts = function() {
  const list = document.getElementById("admin-product-list");
  const data = window._products || {};
  const entries = Object.values(data);
  if (!entries.length) {
    list.innerHTML = `<p style="font-family:'Lora',serif; color:var(--muted); font-style:italic;">No products yet. Add your first one above!</p>`;
    return;
  }
  list.innerHTML = entries.map(p => `
    <div class="admin-product-item">
      <div class="api-icon">${p.icon || "🌸"}</div>
      <div class="api-info">
        <div class="api-name">${p.name}</div>
        <div class="api-price">${p.price} · ${catLabel(p.cat)}</div>
      </div>
      <div class="api-actions">
        <button class="btn-stock ${p.stock ? 'in' : 'out'}" onclick="toggleStock('${p.id}', ${p.stock})">
          ${p.stock ? "✅ In Stock" : "🚫 Out"}
        </button>
        <button class="btn-edit" onclick="editProduct('${p.id}')">✏️ Edit</button>
        <button class="btn-del" onclick="deleteProduct('${p.id}')">🗑️</button>
      </div>
    </div>
  `).join("");
};

const _checkRefreshAdmin = () => { if (window._adminUser) window.renderAdminProducts(); };
setInterval(_checkRefreshAdmin, 1500);

/* ════════════════════════════════════════
   ADMIN PANEL OPEN / CLOSE
════════════════════════════════════════ */
window.openAdmin = function() {
  const ov = document.getElementById("admin-overlay");
  ov.classList.add("open");
  const panel = document.getElementById("admin-panel");
  panel.style.animation = "none";
  panel.offsetHeight;
  panel.style.animation = "panelPop .45s cubic-bezier(.34,1.56,.64,1) both";
};
window.closeAdmin = function() {
  document.getElementById("admin-overlay").classList.remove("open");
};
window.handleOverlayClick = function(e) {
  if (e.target === document.getElementById("admin-overlay")) closeAdmin();
};

/* ── SECRET KEYBOARD SHORTCUT: Ctrl + Shift + F ── */
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "F") {
    e.preventDefault();
    openAdmin();
  }
});

/* ── SECRET LOGO TAP: click brand logo 5 times fast ── */
let _logoTaps = 0, _logoTimer;
document.addEventListener("click", (e) => {
  if (e.target.closest(".nav-brand")) {
    _logoTaps++;
    clearTimeout(_logoTimer);
    if (_logoTaps >= 5) { _logoTaps = 0; openAdmin(); }
    _logoTimer = setTimeout(() => { _logoTaps = 0; }, 1500);
  }
});


/* ════════════════════════════════════════
   TOAST — with icon support
════════════════════════════════════════ */
window.showToast = function(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("show");
  void t.offsetWidth; // reflow to restart animation
  t.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
};

/* ════════════════════════════════════════
   SCROLL-TRIGGERED REVEALS
════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add("visible"), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".about-feat, .order-step").forEach((el, i) => {
  el.classList.add("reveal");
  el.dataset.delay = i * 80;
  revealObserver.observe(el);
});

/* ════════════════════════════════════════
   SECTION TITLE REVEAL
════════════════════════════════════════ */
document.querySelectorAll(".section-header").forEach(el => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

/* ════════════════════════════════════════
   PANEL POP KEYFRAME (injected)
════════════════════════════════════════ */
const ks = document.createElement("style");
ks.textContent = `@keyframes panelPop { from { opacity:0; transform:scale(0.88) translateY(24px); } to { opacity:1; transform:scale(1) translateY(0); } }`;
document.head.appendChild(ks);

/* ════════════════════════════════════════
   TOUCH: disable tilt & magnetic on mobile
════════════════════════════════════════ */
if (window.matchMedia("(hover: none)").matches) {
  document.querySelectorAll(".btn-primary, .btn-outline, .btn-fb-large").forEach(el => {
    el.style.transition = "transform .15s, box-shadow .15s";
  });
}
