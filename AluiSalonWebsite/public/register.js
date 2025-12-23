import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Config
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
const googleRegisterBtn = document.getElementById("google-register");
const loadingOverlay = document.getElementById("loading-overlay");

const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
document.head.appendChild(script);


// Simpan user
async function saveUserToFirestore(user, extra = {}) {

  const userRef = doc(db, "user", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    await auth.signOut();
    loadingOverlay.style.display = "none";

    return Swal.fire({
      icon: "info",
      title: "Akun sudah terdaftar",
      text: "Silakan login menggunakan email ini.",
      confirmButtonColor: "#333",
    });
  }

  await setDoc(userRef, {
    role: "user",
    userName: extra.userName || "",
    userEmail: user.email,
    userNotelp: extra.userNotelp || "",
    userAlamat: extra.userAlamat || "",
    userGender: extra.userGender || ""
  });
}

// Register Email + Password
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

  loadingOverlay.style.display = "flex";

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    await sendEmailVerification(user);

    // Ambil nama sebelum @
    const extractedName = email.split("@")[0];

    await saveUserToFirestore(user, {
      userName: extractedName
    });

    loadingOverlay.style.display = "none";

    Swal.fire({
      icon: "success",
      title: "Akun Berhasil Dibuat!",
      html: `
        Email verifikasi telah dikirim ke <b>${email}</b>.<br>
        Silakan cek inbox atau bagian spam.
      `,
      confirmButtonColor: "#333",
    }).then(() => {
      window.location.href = "login.html";
    });

  } catch (error) {
    loadingOverlay.style.display = "none";

    let message = "Terjadi kesalahan.";

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "Email ini sudah digunakan.";
        break;
      case "auth/invalid-email":
        message = "Format email tidak valid.";
        break;
      case "auth/weak-password":
        message = "Password terlalu lemah (minimal 6 karakter).";
        break;
    }

    Swal.fire({
      icon: "error",
      title: "Gagal Membuat Akun",
      text: message,
      confirmButtonColor: "#d33",
    });
  }
});

// Register Google
googleRegisterBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();

  loadingOverlay.style.display = "flex";

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await saveUserToFirestore(user, {
      userName: user.displayName || ""
    });

    loadingOverlay.style.display = "none";

    Swal.fire({
      icon: "success",
      title: "Pendaftaran Berhasil!",
      text: `Akun Google ${user.displayName || "User"} berhasil terdaftar.`,
      confirmButtonColor: "#333",
    }).then(() => {
      window.location.href = "login.html";
    });

  } catch (err) {
    loadingOverlay.style.display = "none";

    Swal.fire({
      icon: "error",
      title: "Gagal Daftar dengan Google",
      text: err.message,
      confirmButtonColor: "#d33",
    });
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const snap = await getDoc(doc(db, "user", user.uid));
  if (!snap.exists()) return;

  const role = snap.data().role || "user";
  window.location.href = role === "admin" ? "mainsalonadmin.html" : "mainsalon.html";
});
