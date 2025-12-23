import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "login.html";

  const snap = await getDoc(doc(db, "user", user.uid));
  if (snap.data()?.role !== "admin") {
    alert("Akses ditolak!");
    return location.href = "home.html";
  }

  loadDashboard();
});

const PRICE_PER_BOOKING = 500000;

function formatRupiahShort(amount) {
  if (amount >= 1_000_000) {
    const juta = amount / 1_000_000;
    return "Rp " + juta.toFixed(juta % 1 === 0 ? 0 : 1) + " jt";
  }
  return "Rp " + amount.toLocaleString("id-ID");
}

async function loadDashboard() {
  const userSnap = await getDocs(collection(db, "user"));
  document.getElementById("totalUser").textContent = userSnap.size;

  const bookingSnap = await getDocs(collection(db, "pembayaran"));
  document.getElementById("totalBooking").textContent = bookingSnap.size;

  let approved = 0;
  let totalRevenue = 0;
  let monthlyBooking = 0;
  let tomorrowCount = 0;

  const now = new Date();
  const currentMonth = now.getMonth(); 
  const currentYear = now.getFullYear();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  bookingSnap.forEach(doc => {
    const d = doc.data();

    if (!d.tanggal) return;

    const bookingDate = d.tanggal.toDate();
    const bookingMonth = bookingDate.getMonth();
    const bookingYear = bookingDate.getFullYear();

    // Booking bulan ini
    if (bookingMonth === currentMonth && bookingYear === currentYear) {
      monthlyBooking++;
    }

    // Booking approved
    if (d.status === "approve") {
      approved++;
    }

    // Booking besok
    if (bookingDate.toISOString().split("T")[0] === tomorrowStr) {
      tomorrowCount++;
    }
  });

  totalRevenue = approved * PRICE_PER_BOOKING;

  document.getElementById("approvedBooking").textContent = approved;
  document.getElementById("monthlyBooking").textContent = monthlyBooking;
  document.getElementById("tomorrowBooking").textContent = tomorrowCount;
  document.getElementById("totalRevenue").textContent =
  formatRupiahShort(totalRevenue);
}