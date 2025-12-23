import {initializeApp} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {getFirestore, collection, query, where, getDocs, doc, getDoc} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Konfigurasi Firebase
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

// Helper untuk format tanggal
function formatDateValue(tanggalRaw) {
  if (!tanggalRaw) return null;
  if (tanggalRaw.toDate) return tanggalRaw.toDate();
  const d = new Date(tanggalRaw);
  return isNaN(d) ? null : d;
}

function createCardHTML({ dateObj, jam = "-", kategori = "-", hairColor = "-", status = "-" }) {
  const day = dateObj ? dateObj.getDate() : "-";
  const month = dateObj ? dateObj.toLocaleString("id-ID", { month: "long" }) : "-";
  const year = dateObj ? dateObj.getFullYear() : "-";
  const weekday = dateObj ? dateObj.toLocaleDateString("id-ID", { weekday: "long" }) : "-";

  const isHistory = (status && status.toLowerCase() === "selesai");
  const cardClass = isHistory ? "history-card" : "appointment-card";
  const iconHTML = isHistory ? `<div class="status-icon"><i class="fa-solid fa-circle-check"></i></div>` : "";

  return `
    <div class="${cardClass}">
      <div class="date-box">
        <h2>${day}</h2>
        <p>${month}</p>
      </div>
      <div class="info-box">
        <div><strong>Tahun :</strong> ${year}</div>
        <div><strong>Hari :</strong> ${weekday}</div>
        <div><strong>Jam :</strong> ${jam}</div>
        <div><strong>Color :</strong> ${hairColor}</div>
        <div><strong>Kategori :</strong> ${kategori}</div>
      </div>
      ${iconHTML}
    </div>
  `;
}

// Ambil data dari koleksi pembayaran (status = approve)
async function fetchUserBookings(uid) {
  const q = query(
    collection(db, "pembayaran"),
    where("uid", "==", uid),
    where("status", "==", "approve")
  );
  const snap = await getDocs(q);
  const data = [];
  snap.forEach(docSnap => {
    const d = docSnap.data();
    data.push({
      id: docSnap.id,
      ...d,
      _dateObj: formatDateValue(d.tanggal)
    });
  });
  return data;
}

// Render UI
onAuthStateChanged(auth, async (user) => {
  const userNameEl = document.getElementById("userNameDisplay");
  const currentDiv = document.getElementById("currentAppointment");
  const historyDiv = document.getElementById("historyList");

  if (!user) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
    return;
  }

  // Ambil nama user dari dokumen user/{uid}
  try {
    const userDocRef = doc(db, "user", user.uid);
    const userSnap = await getDoc(userDocRef);
    const displayName = userSnap.exists()
      ? (userSnap.data().userName || "Pengguna")
      : (user.displayName || "Pengguna");
    userNameEl.textContent = `${displayName}`;
  } catch (err) {
    console.warn("Gagal ambil nama user:", err);
    userNameEl.textContent = `*${user.displayName || "Pengguna"}*`;
  }

  currentDiv.innerHTML = `<div class="empty">Memuat data...</div>`;
  historyDiv.innerHTML = `<div class="empty">Memuat data...</div>`;

  try {
    const bookings = await fetchUserBookings(user.uid);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    // Pisahkan otomatis berdasarkan tanggal & status
    const history = bookings.filter(b => {
      const bookingDate = b._dateObj;
      if (!bookingDate) return false;
      return (
        (b.status && b.status.toLowerCase() === "selesai") ||
        bookingDate < today // otomatis masuk history jika tanggal sudah lewat
      );
    });

    const active = bookings.filter(b => {
      const bookingDate = b._dateObj;
      if (!bookingDate) return true;
      return (
        (b.status && b.status.toLowerCase() !== "selesai") &&
        bookingDate >= today // masih aktif
      );
    });

    // Render data aktif
    if (active.length === 0) {
      currentDiv.innerHTML = `<div class="empty">Belum ada appointment aktif.</div>`;
    } else {
      currentDiv.innerHTML = active.map(b =>
        createCardHTML({
          dateObj: b._dateObj,
          jam: b.jam,
          kategori: b.kategori,
          hairColor: b.hairColor,
          status: b.status
        })
      ).join("");
    }

    // Render history
    if (history.length === 0) {
      historyDiv.innerHTML = `<div class="empty">Belum ada riwayat appointment.</div>`;
    } else {
      historyDiv.innerHTML = history.map(b =>
        createCardHTML({
          dateObj: b._dateObj,
          jam: b.jam,
          kategori: b.kategori,
          hairColor: b.hairColor,
          status: "selesai"
        })
      ).join("");
    }

  } catch (err) {
    console.error("Gagal memuat data pembayaran:", err);
    currentDiv.innerHTML = `<div class="empty">Gagal memuat data.</div>`;
    historyDiv.innerHTML = `<div class="empty">Gagal memuat data.</div>`;
  }
});
