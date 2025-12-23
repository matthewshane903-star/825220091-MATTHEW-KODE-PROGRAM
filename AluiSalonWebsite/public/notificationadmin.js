import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, getDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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
const openModal = document.getElementById("openModal");
const modal = document.getElementById("notifModal");
const sendBtn = document.getElementById("sendNotif");
const titleInput = document.getElementById("notifTitle");
const msgInput = document.getElementById("notifMessage");
const targetSelect = document.getElementById("notifTarget");

let currentUser = null;

// Modal 
if (openModal && modal) {
  openModal.addEventListener("click", () => modal.style.display = "flex");
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
}

// Notifikasi
if (sendBtn) {
  sendBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const message = msgInput.value.trim();
    const target = targetSelect.value;

    if (!title || !message) {
      return alert("Mohon isi semua field!");
    }

    try {
      // Simpan notifikasi
      await addDoc(collection(db, "notification"), {
        title,
        message,
        target,
        createdBy: currentUser.uid,
        timestamps: serverTimestamp(),
        isRead: false
      });

      // Kirim Email
      if (target === "all") {
        const usersRef = collection(db, "user");
        const snapshot = await getDocs(usersRef);

        for (const userDoc of snapshot.docs) {
          const email = userDoc.data().userEmail;
          if (email) {
            emailjs.send("service_c7f6o1d", "template_ljl6evr", {
              to_email: email,
              notif_title: title,
              notif_message: message
            });
          }
        }
      } else {
        const userSnap = await getDoc(doc(db, "user", target));
        const email = userSnap.data()?.userEmail;

        if (email) {
          emailjs.send("service_c7f6o1d", "template_ljl6evr", {
            to_email: email,
            notif_title: title,
            notif_message: message
          });
        }
      }

      alert("Notifikasi berhasil dikirim!");
      modal.style.display = "none";
      titleInput.value = "";
      msgInput.value = "";
      targetSelect.value = "all";

    } catch (err) {
      console.error("❌ Gagal kirim notifikasi:", err);
    }
  });
}

// Notifikasi admin
function loadAdminNotifications() {
  if (!container) return;

  const notifRef = collection(db, "notification");
  const q = query(notifRef, where("createdBy", "==", currentUser.uid), orderBy("timestamps", "desc"));

  onSnapshot(q, snapshot => {
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = `<p style="text-align:center; opacity:0.7;">Belum ada notifikasi 📭</p>`;
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const time = data.timestamps?.toDate ? data.timestamps.toDate().toLocaleString("id-ID") : "-";
      const card = document.createElement("div");
      card.classList.add("notif-card");
      card.innerHTML = `<h3>${data.title}</h3><p>${data.message}</p><small>${time}</small>`;
      container.appendChild(card);
    });
  });
}

// Kirim Reminder Otomatis ke User
async function sendAppointmentReminders() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const pembayaranRef = collection(db, "pembayaran");
    const snapshot = await getDocs(pembayaranRef);

    for (const docSnap of snapshot.docs) {
      const pembayaran = docSnap.data();
      if (
        pembayaran.status === "approve" &&
        pembayaran.tanggal?.toDate().toISOString().split("T")[0] === dateStr &&
        !pembayaran.reminderSent
      ) {
        await addDoc(collection(db, "notification"), {
          title: "Reminder Appointment",
          message: `Halo ${pembayaran.userName}, Anda ada jadwal appointment besok pukul ${pembayaran.jam}`,
          target: pembayaran.uid,
          createdBy: "system",
          timestamps: new Date(),
          isRead: false
        });

        // Kirim email
        if (pembayaran.userEmail) {
          try {
            emailjs.send("service_c7f6o1d", "template_ljl6evr", {
              to_email: pembayaran.userEmail,
              notif_title: "Reminder Appointment",
              notif_message: `Halo ${pembayaran.userName}, Anda ada jadwal appointment besok pukul ${pembayaran.jam}`
            });
          } catch (e) { console.error("❌ Gagal kirim email:", e); }
        }

        await updateDoc(doc(db, "pembayaran", docSnap.id), { reminderSent: true });
      }
    }
  } catch (err) {
    console.error("❌ Gagal proses reminder appointment:", err);
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUser = user;
  const snap = await getDoc(doc(db, "user", user.uid));
  const role = snap.data()?.role;
  if (role === "admin") {
    loadAdminNotifications();
    loadUserTargets();
    sendAppointmentReminders(); // trigger otomatis semua reminder besok
  } else {
    alert("Hanya admin yang dapat mengakses halaman ini!");
  }
});

async function loadUserTargets() {
  if (!targetSelect) return;

  const usersRef = collection(db, "user");
  const snapshot = await getDocs(usersRef);

  snapshot.forEach(docSnap => {
    const user = docSnap.data();
    if (user.role !== "admin") { 
      const option = document.createElement("option");
      option.value = docSnap.id; 
      option.textContent = user.userName
        ? `${user.userName} (${user.userEmail})`
        : user.userEmail;
      targetSelect.appendChild(option);
    }
  });
}
