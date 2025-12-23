import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase config
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
const usernameEl = document.getElementById("username");
const useremailEl = document.getElementById("useremail");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const genderInput = document.getElementById("gender");
const addressInput = document.getElementById("address");
const loader = document.getElementById("loader");
const content = document.getElementById("content");

function showUserHeader(username, email) {
  usernameEl.textContent = username;
  useremailEl.textContent = email;
  nameInput.value = username;
  emailInput.value = email;
  emailInput.readOnly = true;

  localStorage.setItem("alui_username", username);
  localStorage.setItem("alui_useremail", email);
  localStorage.setItem("alui_cache_valid", "true");
}

const isCacheValid = localStorage.getItem("alui_cache_valid") === "true";
if (isCacheValid) {
  const cachedName = localStorage.getItem("alui_username");
  const cachedEmail = localStorage.getItem("alui_useremail");
  if (cachedName && cachedEmail) showUserHeader(cachedName, cachedEmail);
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    Swal.fire({
      icon: "info",
      title: "Anda telah logout",
      text: "Silakan login kembali!",
      confirmButtonColor: "#333"
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  const email = user.email || "guest@mail.com";
  let username = user.displayName || email.split("@")[0];
  const userRef = doc(db, "user", user.uid);

  onSnapshot(userRef, async (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      nameInput.value = data.userName || username;
      phoneInput.value = data.userNotelp || "";
      genderInput.value = data.userGender || "";
      addressInput.value = data.userAlamat || "";

      const finalName = data.userName || username;
      showUserHeader(finalName, email);
    } else {
      await setDoc(userRef, {
        userName: username,
        userEmail: email,
        userNotelp: "",
        userGender: "",
        userAlamat: ""
      });
      showUserHeader(username, email);
    }

    loader.style.display = "none";
    content.style.display = "block";
  });
});


// Simpan atau Update data
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

  const profileData = {
    userName: nameInput.value,
    userEmail: emailInput.value,
    userNotelp: phoneInput.value,
    userGender: genderInput.value,
    userAlamat: addressInput.value
  };

  try {
    await setDoc(doc(db, "user", user.uid), profileData, { merge: true });
    Swal.fire({
      icon: "success",
      title: "Profil diperbarui",
      text: "Data profil berhasil disimpan!",
      timer: 1800,
      showConfirmButton: false
    });
    localStorage.setItem("alui_username", profileData.userName);
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Gagal Menyimpan",
      text: "Terjadi kesalahan saat menyimpan profil.",
      confirmButtonColor: "#d33"
    });
  }
});

// Logout
document.querySelector(".btn-logout").addEventListener("click", async () => {
  Swal.fire({
    icon: "question",
    title: "Yakin ingin keluar?",
    showCancelButton: true,
    confirmButtonText: "Ya, Logout",
    cancelButtonText: "Batal",
    confirmButtonColor: "#333",
    cancelButtonColor: "#999"
  }).then(async (result) => {
    if (result.isConfirmed) {
      await signOut(auth);
      localStorage.clear();
      Swal.fire({
        icon: "success",
        title: "Berhasil Logout",
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(() => (window.location.href = "login.html"), 1000);
    }
  });
});

// Hapus akun 
document.querySelector(".btn-delete").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  Swal.fire({
    icon: "warning",
    title: "Hapus akun?",
    text: "Data akun Anda akan ikut terhapus!",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#c40101",
    cancelButtonColor: "#999"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "user", user.uid));
        Swal.fire({
          icon: "success",
          title: "Akun dihapus",
          text: "Data akun berhasil dihapus!",
          timer: 2000,
          showConfirmButton: false
        });
        await signOut(auth);
        setTimeout(() => (window.location.href = "login.html"), 2000);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: "Terjadi kesalahan saat menghapus akun.",
          confirmButtonColor: "#d33"
        });
      }
    }
  });
});
