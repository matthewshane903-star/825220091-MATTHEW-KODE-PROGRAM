import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// Elemen
const container = document.getElementById("notifContainer");

let currentUser = null;

function loadUserNotifications() {
  if (!currentUser) return;

  const notifRef = collection(db, "notification");

  const notifQuery = query(
    notifRef,
    where("target", "in", [currentUser.uid, "all"]),
    orderBy("timestamps", "desc")
  );

  onSnapshot(notifQuery, snapshot => {
    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = `<p style="text-align:center; opacity:0.7;">Belum ada notifikasi 📭</p>`;
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const time = data.timestamps?.toDate
        ? data.timestamps.toDate().toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short"
          })
        : "-";

      const card = document.createElement("div");
      card.classList.add("notif-card");
      card.innerHTML = `
        <h3>${data.title || "Tanpa Judul"}</h3>
        <p>${data.message || ""}</p>
        <small>${time}</small>
      `;
      container.appendChild(card);
    });
  }, error => {
    console.error("❌ Error memuat notifikasi:", error);
  });
}

onAuthStateChanged(auth, user => {
  if (!user) return;
  currentUser = user;
  console.log("User UID:", currentUser.uid);

  loadUserNotifications(); 
});