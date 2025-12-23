import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, where, Timestamp, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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
const auth = getAuth();

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null;
let selectedTime = null;
let selectedDocSnap = null;

// Elemen
const currentMonthLabel = document.getElementById("currentMonth");
const daysContainer = document.getElementById("daysContainer");
const btnPrev = document.getElementById("prevMonth");
const btnNext = document.getElementById("nextMonth");
const timeSlider = document.getElementById("time-slider") || document.getElementById("timeSlots");
const clientList = document.getElementById("clientList");

const modalOverlay = document.getElementById("modalOverlay");
const newDateSelect = document.getElementById("newDateSelect");
const newTimeSelect = document.getElementById("newTimeSelect");
const rescheduleBtn = document.getElementById("rescheduleBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

// Kalender
function renderCalendar(month, year) {
  currentMonthLabel.textContent = `${monthNames[month]} ${year}`;
  daysContainer.innerHTML = "";

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < startDay; i++) {
    daysContainer.appendChild(document.createElement("span"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement("span");
    dayEl.textContent = day;
    dayEl.classList.add("day");
    dayEl.addEventListener("click", () => selectDay(dayEl, day, month, year));
    daysContainer.appendChild(dayEl);
  }
}

// Hari 
function selectDay(el, day, month, year) {
  document.querySelectorAll(".day.active").forEach(d => d.classList.remove("active"));
  el.classList.add("active");

  selectedDate = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  loadAvailableTimes(selectedDate);
  if (clientList) clientList.innerHTML = "";
}

// Waktu Available
async function loadAvailableTimes(dateStr) {
  if (!timeSlider) return;
  timeSlider.innerHTML = "<p>Loading...</p>";

  try {
    const docRef = doc(db, "availability", dateStr);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || !docSnap.data().times?.length) {
      timeSlider.innerHTML = "<p>Tidak ada waktu tersedia.</p>";
      return;
    }

    timeSlider.innerHTML = "";
    docSnap.data().times.forEach(time => {
      const btn = document.createElement("button");
      btn.textContent = time;
      btn.classList.add("time");
      btn.addEventListener("click", () => {
        document.querySelectorAll(".time.active").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedTime = time;
        loadClientData(selectedDate, selectedTime);
      });
      timeSlider.appendChild(btn);
    });
  } catch (error) {
    console.error("❌ Gagal memuat waktu:", error);
    timeSlider.innerHTML = "<p>Gagal memuat waktu.</p>";
  }
}

// Ambil Data Client
async function loadClientData(date, time) {
  if (!clientList) return;

  const user = auth.currentUser;
  if (!user) {
    clientList.innerHTML = "<p>❌ Silakan login untuk melihat data client.</p>";
    return;
  }

  const userDoc = await getDoc(doc(db, "user", user.uid));
  const role = userDoc.data()?.role;
  if (role !== "admin") {
    clientList.innerHTML = "<p>❌ Akses ditolak. Hanya admin yang bisa melihat data client.</p>";
    return;
  }

  clientList.innerHTML = "<p>Loading...</p>";

  try {
    const startOfDay = new Date(date + "T00:00:00");
    const endOfDay = new Date(date + "T23:59:59");
    const q = query(
      collection(db, "pembayaran"),
      where("tanggal", ">=", Timestamp.fromDate(startOfDay)),
      where("tanggal", "<=", Timestamp.fromDate(endOfDay))
    );
    const snap = await getDocs(q);
    const filtered = snap.docs.filter(docSnap => docSnap.data().jam === time);

    if (!filtered.length) {
      clientList.innerHTML = "<p>Tidak ada client di waktu ini.</p>";
      return;
    }

    clientList.innerHTML = "";
    filtered.forEach(docSnap => {
      const data = docSnap.data();
      const card = document.createElement("div");
      card.className = "client-card";
      card.innerHTML = `
        <div class="client-date">
          <h4>${new Date(date).getDate()}</h4>
          <p>${new Date(date).toLocaleDateString("id-ID", { weekday: "long" })}</p>
        </div>
        <div class="client-info">
          <h4>${data.userName || "Tanpa Nama"}</h4>
          <p>${data.kategori || "-"}</p>
          <p>${data.hairColor || ""}</p>
        </div>
        <div class="reschedule-icon"><i class="fa-solid fa-calendar-days"></i></div>
      `;
      clientList.appendChild(card);

      const icon = card.querySelector(".reschedule-icon");
      icon.addEventListener("click", async (e) => {
        e.stopPropagation();
        selectedDocSnap = docSnap;
        modalOverlay.style.display = "flex";

        newDateSelect.innerHTML = "";
        const availSnapshot = await getDocs(collection(db, "availability"));
        availSnapshot.forEach(d => {
          const option = document.createElement("option");
          option.value = d.id;
          option.textContent = d.id;
          newDateSelect.appendChild(option);
        });

        loadTimesForSelectedDate();
      });
    });
  } catch (error) {
    console.error("❌ Gagal memuat data client:", error);
    clientList.innerHTML = "<p>Gagal memuat data client.</p>";
  }
}

// Load jam
async function loadTimesForSelectedDate() {
  const selectedDateValue = newDateSelect.value;
  newTimeSelect.innerHTML = "";
  const docRef = doc(db, "availability", selectedDateValue);
  const docSnap = await getDoc(docRef);
  (docSnap.exists() ? docSnap.data().times : []).forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    newTimeSelect.appendChild(option);
  });
}

newDateSelect.addEventListener("change", loadTimesForSelectedDate);

// Reschedule Button
rescheduleBtn.addEventListener("click", async () => {
  if (!selectedDocSnap) return;

  const newTanggal = newDateSelect.value;
  const newJam = newTimeSelect.value;

  try {
    await updateDoc(doc(db, "pembayaran", selectedDocSnap.id), {
      tanggal: Timestamp.fromDate(new Date(newTanggal)),
      jam: newJam
    });
    alert("Reschedule berhasil!");
    modalOverlay.style.display = "none";
    loadClientData(selectedDate, selectedTime);
  } catch (error) {
    console.error("❌ Gagal reschedule:", error);
    alert("Gagal reschedule!");
  }
});

// Close Modal
closeModalBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

// Navigasi Bulan
btnPrev?.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar(currentMonth, currentYear);
});

btnNext?.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar(currentMonth, currentYear);
});

// Render kalender 
renderCalendar(currentMonth, currentYear);