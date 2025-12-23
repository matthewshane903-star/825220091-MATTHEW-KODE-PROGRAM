import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection, addDoc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm";

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

// Ambil Elemen
const consultationCard = document.getElementById("consultationCard");
const downloadBtn = document.getElementById("downloadBtn");
const chatAdminBtn = document.getElementById("chatAdminBtn");
const bleachSection = document.getElementById("bleachSection");
const bookingJadwal = document.getElementById("bookingJadwal");
const detailBooking = document.getElementById("detailBooking");
const btnLanjutBooking = document.getElementById("btnLanjutBooking");
const btnKembaliBleach = document.getElementById("btnKembaliBleach");
const btnDetailBooking = document.getElementById("btnDetailBooking");
const btnKembaliDetail = document.getElementById("btnKembaliDetail");
const btnDownPayment = document.getElementById("btnDownPayment");
const kategoriSelect = document.getElementById("kategori");
const jenisHairColorDiv = document.getElementById("jenisHairColor");

// Data user
let userNotelp = "";
let userName = "Pengguna";
let userEmail = "";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "user", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      userNotelp = userData.userNotelp || "";
      userName = userData.userName || userData.name || user.displayName || "Pengguna";
      userEmail = userData.userEmail || "";
    } else {
      userName = user.displayName || "Pengguna";
      userEmail = user.email || "";
    }
    localStorage.setItem("userName", userName);
    localStorage.setItem("userNotelp", userNotelp);
    localStorage.setItem("userEmail", userEmail);

    const nameEl = document.getElementById("consultUserName");
    const emailEl = document.getElementById("consultUserEmail");

    if (nameEl) nameEl.textContent = userName;
    if (emailEl) emailEl.textContent = userEmail;
  }
});

// Fungsi Update Progress Bar
function updateProgress(currentStep) {
  const totalSteps = 5;
  const percent = ((currentStep - 1) / (totalSteps - 1)) * 80;
  const progressBar = document.querySelector(".progress");
  progressBar.style.setProperty("--progress-percent", `${percent}%`);
  document.querySelectorAll(".step").forEach((s, i) => {
    s.classList.toggle("active", i === currentStep - 1);
    s.classList.toggle("completed", i < currentStep - 1);
  });
}
updateProgress(1);

// Download Consultation Form
downloadBtn?.addEventListener("click", async () => {
  try {
    consultationCard?.scrollIntoView({ behavior: "smooth", block: "center" });
    await new Promise((r) => setTimeout(r, 800));

    const originalMaxHeight = consultationCard.style.maxHeight;
    const originalOverflow = consultationCard.style.overflow;
    const bodyEl = consultationCard.querySelector(".card-body");
    const originalBodyMaxHeight = bodyEl?.style.maxHeight;
    const originalBodyOverflow = bodyEl?.style.overflow;

    consultationCard.style.maxHeight = "none";
    consultationCard.style.overflow = "visible";
    if (bodyEl) {
      bodyEl.style.maxHeight = "none";
      bodyEl.style.overflow = "visible";
    }

    const canvas = await html2canvas(consultationCard, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");

    consultationCard.style.maxHeight = originalMaxHeight;
    consultationCard.style.overflow = originalOverflow;
    if (bodyEl) {
      bodyEl.style.maxHeight = originalBodyMaxHeight;
      bodyEl.style.overflow = originalBodyOverflow;
    }

    const link = document.createElement("a");
    link.href = imgData;
    link.download = "ConsultationForm_AluiSalon.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
      window.open(imgData, "_blank");
    }

    alert("✅ Consultation Form berhasil disimpan!");
    if (chatAdminBtn) chatAdminBtn.disabled = false;

    localStorage.setItem("aluiSalonProgress", "bleachSection");
    // tampilkan bleach step
    hideAllPanels();
    bleachSection?.classList.remove("hidden");
    updateProgress(2);
  } catch (error) {
    console.error("❌ Gagal menyimpan gambar:", error);
    alert("Terjadi kesalahan saat menyimpan gambar.");
  }
});

// Chat Admin Button
chatAdminBtn?.addEventListener("click", () => {
  if (!userNotelp) return alert("⚠️ Nomor telepon user belum tersedia!");
  const adminNo = "6281292920551";
  const pesan = encodeURIComponent(`Halo Admin Alui Salon, saya sudah mengisi Consultation Form.\nNomor saya: ${userNotelp}`);
  window.open(`https://wa.me/${adminNo}?text=${pesan}`, "_blank");

  consultationCard.classList.add("hidden");
  bleachSection?.classList.remove("hidden");
  updateProgress(2);
});

// Restore Progress
window.addEventListener("load", () => {
  const lastProgress = localStorage.getItem("aluiSalonProgress");
  if (lastProgress === "bleachSection") {
    consultationCard.classList.add("hidden");
    bleachSection?.classList.remove("hidden");
    updateProgress(2);
  } else if (lastProgress === "bookingJadwal") {
    consultationCard.classList.add("hidden");
    bleachSection?.classList.add("hidden");
    bookingJadwal.classList.remove("hidden");
    updateProgress(3);
  }
});

// Bleach / No Bleach 
const hairColorOptions = {
  bleach: ["Baby Light", "Full Bleach", "Balayage", "Root Hair Color Retouch"],
  noBleach: ["Solid One Color", "Babylight No Bleach", "Tinted Treatment Babylight", "Root Haircolor Retouch"]
};

kategoriSelect?.addEventListener("change", () => {
  const selected = kategoriSelect.value;
  jenisHairColorDiv.innerHTML = "";
  if (!selected) return;

  hairColorOptions[selected].forEach(color => {
    const btn = document.createElement("button");
    btn.textContent = color;
    btn.classList.add("color-btn");
    btn.addEventListener("click", () => {
      document.querySelectorAll("#jenisHairColor button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
    jenisHairColorDiv.appendChild(btn);
  });
});

// Lanjut ke Booking Jadwal
btnLanjutBooking?.addEventListener("click", () => {
  const kategori = kategoriSelect.value;
  const selectedColorBtn = document.querySelector("#jenisHairColor button.active");

  if (!kategori || !selectedColorBtn) return alert("Harap pilih kategori dan jenis hair color terlebih dahulu!");
  const selectedColor = selectedColorBtn.textContent;

  localStorage.setItem("aluiSalonKategori", kategori);
  localStorage.setItem("aluiSalonHairColor", selectedColor);
  localStorage.setItem("aluiSalonProgress", "bookingJadwal");

  bleachSection.classList.add("hidden");
  bookingJadwal.classList.remove("hidden");
  updateProgress(3);
});

// Kembali dari Booking Jadwal
btnKembaliBleach?.addEventListener("click", () => {
  bookingJadwal.classList.add("hidden");
  bleachSection.classList.remove("hidden");
  updateProgress(2);
});

// Booking Jadwal (kalender + waktu)
window.addEventListener("DOMContentLoaded", () => {
  const currentMonthLabel = document.getElementById("currentMonth");
  const daysContainer = document.getElementById("daysContainer");
  const btnPrev = document.getElementById("prevMonth");
  const btnNext = document.getElementById("nextMonth");
  const timeSlider = document.getElementById("time-slider");

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  let date = new Date();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();

  function renderCalendar(month, year) {
    currentMonthLabel.textContent = `${monthNames[month]} ${year}`;
    daysContainer.innerHTML = "";

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 1; i < (firstDay === 0 ? 7 : firstDay); i++) {
      const empty = document.createElement("span");
      empty.classList.add("empty");
      daysContainer.appendChild(empty);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayEl = document.createElement("span");
      dayEl.textContent = i;
      dayEl.classList.add("day");
      dayEl.addEventListener("click", () => selectDay(dayEl, i, month, year));
      daysContainer.appendChild(dayEl);
    }
  }

  function selectDay(el, day, month, year) {
    document.querySelectorAll(".day.active").forEach(d => d.classList.remove("active"));
    el.classList.add("active");

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    localStorage.setItem("aluiSalonTanggal", dateStr);
    loadAvailableTimes(dateStr);
  }

  async function loadAvailableTimes(dateStr) {
    const docRef = doc(db, "availability", dateStr);
    const docSnap = await getDoc(docRef);
    timeSlider.innerHTML = "";

    if (docSnap.exists()) {
      const times = docSnap.data().times || [];
      if (times.length === 0) {
        timeSlider.innerHTML = "<p>Tidak ada waktu tersedia.</p>";
        return;
      }

      times.forEach(time => {
        const btn = document.createElement("button");
        btn.className = "time";
        btn.textContent = time;
        btn.addEventListener("click", () => {
          document.querySelectorAll("#time-slider .time").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          localStorage.setItem("aluiSalonJam", time);
        });
        timeSlider.appendChild(btn);
      });
    } else {
      timeSlider.innerHTML = "<p>Tidak ada waktu tersedia.</p>";
    }
  }

  btnPrev.addEventListener("click", () => {
    currentMonth = (currentMonth - 1 + 12) % 12;
    if (currentMonth === 11) currentYear--;
    renderCalendar(currentMonth, currentYear);
  });

  btnNext.addEventListener("click", () => {
    currentMonth = (currentMonth + 1) % 12;
    if (currentMonth === 0) currentYear++;
    renderCalendar(currentMonth, currentYear);
  });

  renderCalendar(currentMonth, currentYear);
});

// Tombol Detail Booking (Cek Double Booking)
btnDetailBooking?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Anda harus login untuk melanjutkan!");

  const tanggal = localStorage.getItem("aluiSalonTanggal");
  const jam = localStorage.getItem("aluiSalonJam");
  const kategori = localStorage.getItem("aluiSalonKategori");
  const hairColor = localStorage.getItem("aluiSalonHairColor");

  if (!tanggal || !jam) {
    return alert("Silakan pilih tanggal dan waktu appointment terlebih dahulu!");
  }

  try {
    const bookingRef = collection(db, `user/${user.uid}/booking`);
    const q = query(
      bookingRef,
      where("tanggal", "==", tanggal),
      where("jam", "==", jam)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert("⚠️ Anda sudah melakukan booking di tanggal dan waktu ini! Silakan pilih tanggal lain.");
      return;
    }

    // Ambil userName dari Firestore
    let userName = "User";
    let userEmail = user.email || ""; 

    try {
      const userDocRef = doc(db, "user", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        userName = data.userName || "User";
        userEmail = data.userEmail || userEmail; 
      }
    } catch (err) {
      console.error("❌ Gagal ambil data user:", err);
    }

    // Tampilkan detail booking
    document.getElementById("detailNama").textContent = userName;
    document.getElementById("detailEmail").textContent = userEmail;
    document.getElementById("detailTanggal").textContent = tanggal;
    document.getElementById("detailJam").textContent = jam;
    document.getElementById("detailKategori").textContent = kategori || "-";
    document.getElementById("detailJenis").textContent = hairColor || "-";

    bookingJadwal.classList.add("hidden");
    detailBooking.classList.remove("hidden");
    updateProgress(4);

  } catch (err) {
    console.error("❌ Error saat memeriksa data booking:", err);
    alert("Terjadi kesalahan saat memeriksa data booking.");
  }
});

// Kembali dari Detail Booking
btnKembaliDetail?.addEventListener("click", () => {
  detailBooking.classList.add("hidden");
  bookingJadwal.classList.remove("hidden");
  updateProgress(3);
});

// Lanjut ke Pembayaran
btnDownPayment?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Anda harus login untuk melanjutkan pembayaran!");

  const kategori = localStorage.getItem("aluiSalonKategori");
  const hairColor = localStorage.getItem("aluiSalonHairColor");
  const tanggal = localStorage.getItem("aluiSalonTanggal");
  const jam = localStorage.getItem("aluiSalonJam");

  if (!kategori || !hairColor || !tanggal || !jam) return alert("Pastikan semua data booking sudah lengkap sebelum lanjut ke pembayaran!");

  try {
    detailBooking.classList.add("hidden");
    document.getElementById("pembayaranDP")?.classList.remove("hidden");
    updateProgress(5);
  } catch (err) {
    console.error(err);
    alert("❌ Terjadi kesalahan saat menyimpan booking.");
  }
});

// Tombol Copy Nomor Rekening
document.getElementById("copyRekening")?.addEventListener("click", () => {
  const rekening = document.getElementById("rekeningNumber").textContent;
  navigator.clipboard.writeText(rekening);
  alert("Nomor rekening disalin: " + rekening);
});

const buktiInput = document.getElementById("buktiTransfer");
const btnSelesai = document.getElementById("btnSelesai");

btnSelesai.disabled = true;

buktiInput.addEventListener("change", () => {
  if (buktiInput.files.length > 0) {
    btnSelesai.disabled = false;
  }
});

// Tombol Selesai
btnSelesai?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Anda harus login!");

  if (!buktiInput.files.length) {
    return alert("Harap upload bukti transfer!");
  }

  try {
    const file = buktiInput.files[0];

    // Upload ke Cloudinary
    const downloadURL = await uploadToCloudinary(file);

    const kategori = localStorage.getItem("aluiSalonKategori");
    const hairColor = localStorage.getItem("aluiSalonHairColor");
    const tanggal = localStorage.getItem("aluiSalonTanggal");
    const jam = localStorage.getItem("aluiSalonJam");

    const bookingRef = collection(db, `user/${user.uid}/booking`);
    await addDoc(bookingRef, {
      userName,
      userEmail,
      userNotelp,
      kategori,
      hairColor,
      tanggal,
      jam,
      buktiTransferURL: downloadURL,
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("✅ Booking berhasil & bukti transfer tersimpan!");
    localStorage.removeItem("aluiSalonProgress");
    window.location.href = "mainsalon.html";

  } catch (err) {
    console.error(err);
    alert("❌ Gagal upload bukti transfer!");
  }
});

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "aluiPreset");
  formData.append("folder", "bukti-transfer");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dbvuyb6iu/image/upload",
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error("Gagal upload ke Cloudinary");
  }

  const data = await response.json();
  return data.secure_url; 
}
