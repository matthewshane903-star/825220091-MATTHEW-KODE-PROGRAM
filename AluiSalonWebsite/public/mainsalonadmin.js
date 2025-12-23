import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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
const usernameEl = document.getElementById("username");
const useremailEl = document.getElementById("useremail");
const loader = document.getElementById("loader");
const content = document.getElementById("content");

function showUserHeader(username, email, role = "user") {
  const displayName = role === "admin" ? `${username} (ADMIN)` : username;

  usernameEl.textContent = displayName;
  useremailEl.textContent = email;

  localStorage.setItem("alui_username", displayName);
  localStorage.setItem("alui_useremail", email);
  localStorage.setItem("alui_role", role);
  localStorage.setItem("alui_cache_valid", "true");
}

const isCacheValid = localStorage.getItem("alui_cache_valid") === "true";
if (isCacheValid) {
  const cachedName = localStorage.getItem("alui_username");
  const cachedEmail = localStorage.getItem("alui_useremail");
  if (cachedName && cachedEmail) showUserHeader(cachedName, cachedEmail);
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    Swal.fire({
      icon: "info",
      title: "Anda telah logout",
      text: "Silakan login kembali!",
      confirmButtonColor: "#333"
    }).then(() => (window.location.href = "login.html"));
    return;
  }

  const email = user.email;
  let username = user.displayName || email.split("@")[0];
  const userRef = doc(db, "user", user.uid);

  onSnapshot(userRef, async (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const finalName = data.userName || username;
      const role = data.role || "user";

      if (role !== "admin") {
        await auth.signOut();
        Swal.fire({
          icon: "warning",
          title: "Akses Ditolak",
          text: "Anda tidak memiliki akses sebagai admin.",
          confirmButtonColor: "#d33"
        }).then(() => window.location.href = "login.html");
        return;
      }

      // tampilkan nama admin
      showUserHeader(finalName, email, role);
    } else {
      await setDoc(userRef, {
        userName: username,
        userEmail: email,
        userNotelp: "",
        userGender: "",
        userAlamat: "",
        role: "admin" 
      });
      showUserHeader(username, email, "admin");
    }

    loader.style.display = "none";
    content.style.display = "block";
  });
});

// Carousel
let index = 0;
const slides = document.querySelectorAll(".slides");
const total = slides.length;
const intervalTime = 4000;
let autoSlide;

function showSlide(i) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[i].classList.add("active");
}

document.querySelector(".next").addEventListener("click", () => {
  index = (index + 1) % total;
  showSlide(index);
  resetAutoSlide();
});

document.querySelector(".prev").addEventListener("click", () => {
  index = (index - 1 + total) % total;
  showSlide(index);
  resetAutoSlide();
});

function startAutoSlide() {
  autoSlide = setInterval(() => {
    index = (index + 1) % total;
    showSlide(index);
  }, intervalTime);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

startAutoSlide();