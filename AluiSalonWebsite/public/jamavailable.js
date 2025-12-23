import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCy22AFdR_ye1UmUJKIlWaVmeHICVYgk9Y",
    authDomain: "login-alui-salon.firebaseapp.com",
    projectId: "login-alui-salon",
    storageBucket: "login-alui-salon.firebasestorage.app",
    messagingSenderId: "726282564731",
    appId: "1:726282564731:web:07a6ebb2106fcb4e4fdede",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elemen
const daysContainer = document.getElementById("daysContainer");
const currentMonthText = document.getElementById("currentMonth");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

const savedTimesContainer = document.getElementById("savedTimes");
const btnAddTime = document.getElementById("btnAddTime");

// Modal
const modal = document.getElementById("timeModal");
const modalDate = document.getElementById("modalDate");
const timeChoices = document.getElementById("timeChoices");

const btnSaveTime = document.getElementById("btnSaveTime");
const btnCloseModal = document.getElementById("btnCloseModal");

let selectedDate = null;
let currentYear;
let currentMonth;
let currentUserRole = "user";

// Cek Role
onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userDoc = await getDoc(doc(db, "user", user.uid));
    if (userDoc.exists()) {
        currentUserRole = userDoc.data().role;
        if (currentUserRole === "admin") {
            btnAddTime.style.display = "block";
        }
    }
});

// Kalender
function loadCalendar() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar();
}

function renderCalendar() {
    daysContainer.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    currentMonthText.innerText = monthNames[currentMonth] + " " + currentYear;

    let startIndex = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startIndex; i++) {
        const emptySlot = document.createElement("div");
        emptySlot.classList.add("empty");
        daysContainer.appendChild(emptySlot);
    }

    for (let d = 1; d <= lastDate; d++) {
        const dayEl = document.createElement("div");
        dayEl.classList.add("day");
        dayEl.innerText = d;

        dayEl.addEventListener("click", async () => {

            document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));

            dayEl.classList.add("active");

            const monthNum = (currentMonth + 1).toString().padStart(2, "0");
            selectedDate = `${currentYear}-${monthNum}-${d.toString().padStart(2, "0")}`;

            loadSavedTimes(selectedDate);
        });

        daysContainer.appendChild(dayEl);
    }
}

prevMonthBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

async function loadSavedTimes(dateKey) {
    const snap = await getDoc(doc(db, "availability", dateKey));

    if (snap.exists()) {
        const times = snap.data().times || [];
        savedTimesContainer.innerHTML = times
            .map(t => `<span class="time-pill">${t}</span>`)
            .join("");
    } else {
        savedTimesContainer.innerHTML = "<p>Belum ada jam tersedia untuk tanggal ini.</p>";
    }
}

btnAddTime.addEventListener("click", () => {
    if (!selectedDate) {
        alert("Pilih tanggal terlebih dahulu!");
        return;
    }

    modalDate.textContent = selectedDate;
    timeChoices.innerHTML = "";

    // Input 
    const inputHTML = `
        <div class="input-row">
            <input id="inputTime" class="time-input" placeholder="HH:MM" maxlength="5">
        </div>
        <button id="btnAddSingle" class="add-time-btn-modal">+</button>
    `;

    timeChoices.innerHTML = inputHTML;

    document.getElementById("btnAddSingle").onclick = addTimeManually;

    modal.style.display = "flex";
});

// Validasi Jam
function isValidTime(time) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

// Tambah Jam
function addTimeManually() {
    let time = document.getElementById("inputTime").value.trim();

    if (!isValidTime(time)) {
        alert("Format jam salah! Gunakan format HH:MM (example: 09:00).");
        return;
    }

    // Cek jika sudah ada
    const exists = [...document.querySelectorAll(".time-pill")]
        .some(el => el.innerText === time);

    if (exists) {
        alert("Jam sudah ada!");
        return;
    }

    const pill = document.createElement("span");
    pill.className = "time-pill selected";
    pill.innerText = time;

    pill.addEventListener("click", () => pill.classList.toggle("selected"));

    timeChoices.appendChild(pill);

    document.getElementById("inputTime").value = "";
}

// Simpan Data
btnSaveTime.addEventListener("click", async () => {
    const newTimes = [...document.querySelectorAll(".time-pill.selected")]
        .map(el => el.innerText);

    const snap = await getDoc(doc(db, "availability", selectedDate));
    let oldTimes = [];
    if (snap.exists()) {
        oldTimes = snap.data().times || [];
    }

    const mergedTimes = [...new Set([...oldTimes, ...newTimes])]
        .sort((a, b) => a.localeCompare(b));

    await setDoc(doc(db, "availability", selectedDate), {
        times: mergedTimes
    });

    modal.style.display = "none";

    loadSavedTimes(selectedDate);
});

btnCloseModal.onclick = () => (modal.style.display = "none");

loadCalendar();