import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

//  Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCy22AFdR_ye1UmUJKIlWaVmeHICVYgk9Y",
  authDomain: "login-alui-salon.firebaseapp.com",
  projectId: "login-alui-salon",
  storageBucket: "login-alui-salon.firebasestorage.app",
  messagingSenderId: "726282564731",
  appId: "1:726282564731:web:07a6ebb2106fcb4e4fdede"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elemen
const submit = document.getElementById("submit");
const googleLoginBtn = document.getElementById("google-login");
const loadingOverlay = document.getElementById("loading-overlay");
const rememberMe = document.getElementById("rememberMe");

function showLoading() { loadingOverlay.style.display = "flex"; }
function hideLoading() { loadingOverlay.style.display = "none"; }

async function checkUserInFirestore(uid) {
  const userRef = doc(db, "user", uid); 
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

window.addEventListener("DOMContentLoaded", () => {
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    document.getElementById("email").value = savedEmail;
    rememberMe.checked = true;
  }
});

// Login Email & Password
submit.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Data belum lengkap",
      text: "Email dan password tidak boleh kosong.",
      confirmButtonColor: "#333",
    });
    return;
  }

  showLoading();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = await checkUserInFirestore(user.uid);
    hideLoading();

    if (!userData) {
      await auth.signOut();
      Swal.fire({
        icon: "info",
        title: "Akun tidak ada",
        text: "Data pengguna tidak ditemukan di Firestore.",
        confirmButtonColor: "#3085d6"
      }).then(() => window.location.href = "index.html");
      return;
    }

    // Simpan email kalau Remember Me aktif
    if (rememberMe.checked) localStorage.setItem("rememberedEmail", email);
    else localStorage.removeItem("rememberedEmail");

    // Login Berhasil 
    const role = userData.role || "user"; // default user bila kosong
    const redirectPage = role === "admin" ? "mainsalonadmin.html" : "mainsalon.html";

    Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: `Selamat datang, ${userData.userName}!`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    }).then(() => window.location.href = redirectPage);

  } catch (error) {
    hideLoading();

    let errorMsg = "Akun tidak ada, silakan buat akun terlebih dahulu.";
    if (error.code === "auth/wrong-password") errorMsg = "Password salah.";
    else if (error.code === "auth/invalid-email") errorMsg = "Format email tidak valid.";

    Swal.fire({
      icon: "error",
      title: "Login Gagal",
      text: errorMsg,
      confirmButtonColor: "#d33",
    });
  }
});

// Login Google
googleLoginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();

  showLoading();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const methods = await fetchSignInMethodsForEmail(auth, user.email);
    if (methods.length === 0) {
      hideLoading();
      await auth.signOut();
      Swal.fire({
        icon: "info",
        title: "Akun tidak ada",
        text: "Silakan buat akun terlebih dahulu.",
        confirmButtonColor: "#3085d6"
      }).then(() => window.location.href = "index.html");
      return;
    }

    const userData = await checkUserInFirestore(user.uid);
    hideLoading();

    if (!userData) {
      await auth.signOut();
      Swal.fire({
        icon: "info",
        title: "Akun tidak ada",
        text: "Silakan buat akun terlebih dahulu.",
        confirmButtonColor: "#3085d6"
      }).then(() => window.location.href = "index.html");
      return;
    }

    // Cek role 
    const role = userData.role || "user";
    const redirectPage = role === "admin" ? "mainsalonadmin.html" : "mainsalon.html";

    Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: `Selamat datang, ${userData.userName}!`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    }).then(() => window.location.href = redirectPage);

  } catch (err) {
    hideLoading();

    if (err.code === "auth/popup-closed-by-user") {
      console.log("User menutup popup login Google.");
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Gagal Login Google",
      text: err.message,
      confirmButtonColor: "#d33",
    });
  }
});

// Redirect otomatis
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const userData = await checkUserInFirestore(user.uid);
  if (!userData) {
    await auth.signOut();
    return;
  }

  const role = userData.role || "user";
  const redirectPage = role === "admin" ? "mainsalonadmin.html" : "mainsalon.html";

  window.location.href = redirectPage;
});