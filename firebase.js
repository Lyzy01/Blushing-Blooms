/* ================================================
   Blushing Blooms — Firebase & Admin Logic
   firebase.js  (loaded as type="module")

   🔥 SETUP:
   Replace the firebaseConfig values below with your
   own from Firebase Console → Project Settings → Apps
   ================================================ */

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc,
  onSnapshot, addDoc, updateDoc, deleteDoc, query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ══════════════════════════════
//  FIREBASE CONFIG — replace values below
// ══════════════════════════════
const firebaseConfig = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ══════════════════════════════
//  OBFUSCATED CREDENTIALS
//  Multi-layer encoded — not plain text in source
// ══════════════════════════════
const _x = [
  'WW14MWMy','aHBibWRp','Ykc5dmJY','TkFZV1J0','YVc0dVky','OXQ='
].join('');
const _y = [
  'WW14MWMy','aHBibWRp','Ykc5dmJY','TXlNREky'
].join('');

const _d = s => atob(atob(s));
const _ae = _d(_x); // resolves at runtime only
const _ap = _d(_y); // resolves at runtime only

// ══════════════════════════════
//  REAL-TIME PRODUCT LISTENER
// ══════════════════════════════
const productsCol = collection(db, "products");

onSnapshot(query(productsCol), (snapshot) => {
  const data = {};
  snapshot.forEach(docSnap => {
    data[docSnap.id] = { ...docSnap.data(), id: docSnap.id };
  });
  window._products = data;
  if (typeof renderProducts === "function") renderProducts(data);
  if (window._adminUser && typeof renderAdminProducts === "function") renderAdminProducts();
});

// ══════════════════════════════
//  AUTH STATE
// ══════════════════════════════
onAuthStateChanged(auth, (user) => {
  window._adminUser = user;
  document.getElementById("admin-panel").style.display        = user ? "flex" : "none";
  document.getElementById("admin-login-screen").style.display = user ? "none" : "flex";
  document.getElementById("admin-dashboard").style.display    = user ? "flex" : "none";
  if (user && typeof renderAdminProducts === "function") renderAdminProducts();
});

// ══════════════════════════════
//  LOGIN
// ══════════════════════════════
window.doAdminLogin = async () => {
  const u     = document.getElementById("a-user").value.trim();
  const p     = document.getElementById("a-pass").value;
  const errEl = document.getElementById("login-err");
  errEl.textContent = "";
  try {
    if (u.toLowerCase() !== _ae.toLowerCase()) throw new Error("auth/invalid-credential");
    if (p !== _ap) throw new Error("auth/invalid-credential");
    await signInWithEmailAndPassword(auth, _ae, _ap);
  } catch(e) {
    errEl.textContent = "❌ Wrong username or password.";
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

  await addDoc(productsCol, { name, price, desc, icon: icon || "🌸", stock, cat });

  document.getElementById("p-name").value     = "";
  document.getElementById("p-price").value    = "";
  document.getElementById("p-desc").value     = "";
  document.getElementById("p-icon").value     = "";
  document.getElementById("p-stock").checked  = true;
  showToast("✅ Product added!");
};

// ══════════════════════════════
//  TOGGLE STOCK
// ══════════════════════════════
window.toggleStock = async (id, current) => {
  await updateDoc(doc(db, "products", id), { stock: !current });
  showToast(!current ? "✅ Marked In Stock" : "🚫 Marked Out of Stock");
};

// ══════════════════════════════
//  DELETE PRODUCT
// ══════════════════════════════
window.deleteProduct = async (id) => {
  if (!confirm("Delete this product?")) return;
  await deleteDoc(doc(db, "products", id));
  showToast("🗑️ Product deleted.");
};

// ══════════════════════════════
//  EDIT PRODUCT — open modal
// ══════════════════════════════
window.editProduct = (id) => {
  const p = window._products[id];
  if (!p) return;
  document.getElementById("edit-id").value      = id;
  document.getElementById("edit-name").value    = p.name;
  document.getElementById("edit-price").value   = p.price;
  document.getElementById("edit-desc").value    = p.desc  || "";
  document.getElementById("edit-icon").value    = p.icon  || "🌸";
  document.getElementById("edit-stock").checked = !!p.stock;
  document.getElementById("edit-cat").value     = p.cat   || "bouquet";
  document.getElementById("edit-modal").style.display = "flex";
};

// ══════════════════════════════
//  SAVE EDIT
// ══════════════════════════════
window.saveEdit = async () => {
  const id    = document.getElementById("edit-id").value;
  const name  = document.getElementById("edit-name").value.trim();
  const price = document.getElementById("edit-price").value.trim();
  const desc  = document.getElementById("edit-desc").value.trim();
  const icon  = document.getElementById("edit-icon").value.trim();
  const stock = document.getElementById("edit-stock").checked;
  const cat   = document.getElementById("edit-cat").value;

  await updateDoc(doc(db, "products", id), { name, price, desc, icon: icon || "🌸", stock, cat });
  document.getElementById("edit-modal").style.display = "none";
  showToast("✏️ Product updated!");
};

window.closeEdit = () => {
  document.getElementById("edit-modal").style.display = "none";
};
