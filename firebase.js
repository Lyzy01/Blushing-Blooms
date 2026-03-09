/* ================================================
   Blushing Blooms — Firebase & Admin Logic
   firebase.js  (loaded as type="module")

   🔥 SETUP:
   1. Replace the firebaseConfig values below with your
      own from Firebase Console → Project Settings → Apps
   2. Replace _ae value with btoa("youremail@example.com")
      Run btoa("your@email.com") in browser console to get it
   ================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, onValue, set, push, remove, update }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCruBTt8OVlwSmdu0RwC0pWtE4eeeS115s",
  authDomain: "blushing-blooms.firebaseapp.com",
  projectId: "blushing-blooms",
  storageBucket: "blushing-blooms.firebasestorage.app",
  messagingSenderId: "189548277099",
  appId: "1:189548277099:web:1697152b9000ae0f13f02e"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

/* ─── Obfuscated admin email (base64) ─── */
/* To generate: btoa("youremail@gmail.com") in browser console */
/* Replace the string below with your own btoa-encoded admin email */
const _ae = atob("YWRtaW5AYmx1c2hpbmdibG9vbXMuY29t"); // admin@blushingblooms.com

// ══════════════════════════════
//  PRODUCT LISTENER
// ══════════════════════════════
window._db  = db;
window._ref = ref;
window._set = set;
window._push = push;
window._remove = remove;
window._update = update;

onValue(ref(db, "products"), (snap) => {
  const data = snap.val() || {};
  window._products = data;
  renderProducts(data);
});

// ══════════════════════════════
//  AUTH STATE
// ══════════════════════════════
onAuthStateChanged(auth, (user) => {
  window._adminUser = user;
  document.getElementById("admin-panel").style.display = user ? "flex" : "none";
  document.getElementById("admin-login-screen").style.display = user ? "none" : "flex";
  document.getElementById("admin-dashboard").style.display = user ? "flex" : "none";
  if (user) renderAdminProducts();
});

// ══════════════════════════════
//  LOGIN
// ══════════════════════════════
window.doAdminLogin = async () => {
  const u = document.getElementById("a-user").value.trim();
  const p = document.getElementById("a-pass").value;
  const errEl = document.getElementById("login-err");
  errEl.textContent = "";
  try {
    /* We only accept login if the entered username matches the obfuscated admin email */
    if (u.toLowerCase() !== _ae.toLowerCase()) throw new Error("Invalid credentials.");
    await signInWithEmailAndPassword(auth, _ae, p);
  } catch(e) {
    errEl.textContent = "❌ " + (e.code === "auth/wrong-password" || e.code === "auth/user-not-found"
      ? "Wrong username or password." : e.message);
  }
};

window.doAdminLogout = () => signOut(auth);

// ══════════════════════════════
//  ADD PRODUCT
// ══════════════════════════════
window.addProduct = async () => {
  const name  = document.getElementById("p-name").value.trim();
  const price = document.getElementById("p-price").value.trim();
  const desc  = document.getElementById("p-desc").value.trim();
  const icon  = document.getElementById("p-icon").value.trim();
  const stock = document.getElementById("p-stock").checked;
  const cat   = document.getElementById("p-cat").value;
  if (!name || !price) return alert("Name and price are required.");
  const newRef = push(ref(db, "products"));
  await set(newRef, { name, price, desc, icon: icon || "🌸", stock, cat, id: newRef.key });
  document.getElementById("p-name").value = "";
  document.getElementById("p-price").value = "";
  document.getElementById("p-desc").value = "";
  document.getElementById("p-icon").value = "";
  document.getElementById("p-stock").checked = true;
  showToast("✅ Product added!");
};

// ══════════════════════════════
//  TOGGLE STOCK
// ══════════════════════════════
window.toggleStock = async (id, current) => {
  await update(ref(db, "products/" + id), { stock: !current });
  showToast(!current ? "✅ Marked In Stock" : "🚫 Marked Out of Stock");
};

// ══════════════════════════════
//  DELETE PRODUCT
// ══════════════════════════════
window.deleteProduct = async (id) => {
  if (!confirm("Delete this product?")) return;
  await remove(ref(db, "products/" + id));
  showToast("🗑️ Product deleted.");
};

// ══════════════════════════════
//  EDIT PRODUCT
// ══════════════════════════════
window.editProduct = (id) => {
  const p = window._products[id];
  if (!p) return;
  document.getElementById("edit-id").value   = id;
  document.getElementById("edit-name").value  = p.name;
  document.getElementById("edit-price").value = p.price;
  document.getElementById("edit-desc").value  = p.desc || "";
  document.getElementById("edit-icon").value  = p.icon || "🌸";
  document.getElementById("edit-stock").checked = !!p.stock;
  document.getElementById("edit-cat").value   = p.cat || "bouquet";
  document.getElementById("edit-modal").style.display = "flex";
};

window.saveEdit = async () => {
  const id    = document.getElementById("edit-id").value;
  const name  = document.getElementById("edit-name").value.trim();
  const price = document.getElementById("edit-price").value.trim();
  const desc  = document.getElementById("edit-desc").value.trim();
  const icon  = document.getElementById("edit-icon").value.trim();
  const stock = document.getElementById("edit-stock").checked;
  const cat   = document.getElementById("edit-cat").value;
  await update(ref(db, "products/" + id), { name, price, desc, icon: icon||"🌸", stock, cat });
  document.getElementById("edit-modal").style.display = "none";
  showToast("✏️ Product updated!");
};

window.closeEdit = () => {
  document.getElementById("edit-modal").style.display = "none";
};
