/* ================================================
   Blushing Blooms — Firebase & Admin Logic
   firebase.js  (loaded as type="module")

   🔥 SETUP:
   1. Replace the firebaseConfig values below with your
      own from Firebase Console → Project Settings → Apps
   2. Replace _ae value with btoa("youremail@example.com")
      Run btoa("your@email.com") in browser console to get it

   📦 Uses: Firestore Database (NOT Realtime Database)
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
//  FIREBASE CONFIG
//  Replace all values below ↓
// ══════════════════════════════
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
const db   = getFirestore(app);

/* ─── Obfuscated admin email (base64) ─── */
/* To generate: open browser console and run:  btoa("youremail@gmail.com") */
/* Then paste the result inside atob("...") below                           */
const _ae = atob("YWRtaW5AYmx1c2hpbmdibG9vbXMuY29t"); // admin@blushingblooms.com

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
    if (u.toLowerCase() !== _ae.toLowerCase()) throw new Error("Invalid credentials.");
    await signInWithEmailAndPassword(auth, _ae, p);
  } catch(e) {
    errEl.textContent = "❌ " + (
      e.code === "auth/wrong-password" || e.code === "auth/user-not-found" || e.code === "auth/invalid-credential"
        ? "Wrong username or password."
        : e.message
    );
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

  document.getElementById("p-name").value  = "";
  document.getElementById("p-price").value = "";
  document.getElementById("p-desc").value  = "";
  document.getElementById("p-icon").value  = "";
  document.getElementById("p-stock").checked = true;
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
