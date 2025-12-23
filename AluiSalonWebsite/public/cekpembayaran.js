import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Konfigurasi Firebase
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

// Elemen
const paymentContainer = document.getElementById("paymentContainer");

// Ambil semua booking status pending dari semua user
async function loadPendingPayments() {
  paymentContainer.innerHTML = `<p style="text-align:center;">Memuat data...</p>`;

  try {
    const usersSnapshot = await getDocs(collection(db, "user"));
    const pendingList = [];

    await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const uid = userDoc.id;
        const userData = userDoc.data();

        const bookingRef = collection(db, `user/${uid}/booking`);
        const q = query(
          bookingRef,
          where("status", "==", "pending"),
          orderBy("createdAt", "asc")
        );
        const bookingSnap = await getDocs(q);

        bookingSnap.forEach((b) => {
          pendingList.push({
            id: b.id,
            uid: uid,
            userEmail: userData.userEmail || "-",
            ...b.data(),
            userName: userData.userName || "Tidak diketahui",
          });
        });

      })
    );

    paymentContainer.innerHTML = "";

    if (pendingList.length === 0) {
      paymentContainer.innerHTML = `<p style="text-align:center;">Tidak ada pembayaran pending.</p>`;
      return;
    }

    pendingList.forEach((data) => {
      const card = document.createElement("div");
      card.classList.add("card");

      let tanggalObj = null;
      if (data.tanggal?.toDate) {
        tanggalObj = data.tanggal.toDate();
      } else if (data.tanggal) {
        tanggalObj = new Date(data.tanggal);
      }

      const day = tanggalObj ? tanggalObj.getDate() : "-";
      const month = tanggalObj
        ? tanggalObj.toLocaleString("id-ID", { month: "long" })
        : "-";
      const weekday = tanggalObj
        ? tanggalObj.toLocaleString("id-ID", { weekday: "long" })
        : "-";
      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate().toLocaleString("id-ID")
        : "-";

      card.innerHTML = `
        <div class="card-header">
          <div class="date-box">
            <div class="day">${day}</div>
            <div class="month">${month}</div>
            <div class="time">${data.jam || "-"}</div>
          </div>
          <div class="card-content">
            <p><b>Hari:</b> ${weekday}</p>
            <p><b>UID:</b> ${data.uid}</p>
            <p><b>Nama:</b> ${data.userName}</p>
            <p><b>Kategori:</b> ${data.kategori || "-"}</p>
            <p><b>Jenis Color:</b> ${data.hairColor || "-"}</p>
            <p><b>Pembayaran:</b> ${data.pembayaran || "BCA"}</p>
            <p><b>Bukti Transfer:</b></p>
              ${data.buktiTransferURL
              ? `
            <a href="${data.buktiTransferURL}" target="_blank" style="color:#1e90ff;">
              🔗 Lihat Bukti Transfer
            </a>
            <br>
            `
             : `<span style="color:red;">Belum upload</span>`
            }
          <br>
          <p><b>Dibuat:</b> ${createdAt}</p>
          </div>
        </div>
        <div class="status-container"> 
          <span><b>Status:</b> Pending</span>
          <div class="buttons">
            <button class="approve-btn"><i class="fa-solid fa-check"></i></button>
            <button class="reject-btn"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      `;

      
      // Approve
      card.querySelector(".approve-btn").addEventListener("click", async () => {
        try {
          const bookingRef = doc(db, `user/${data.uid}/booking`, data.id);

          // Update status jadi "approve"
          await updateDoc(bookingRef, { status: "approve" });

          // Tambah data ke collection pembayaran
          const pembayaranRef = doc(collection(db, "pembayaran"));
          await setDoc(pembayaranRef, {
            uid: data.uid,
            userName: data.userName,
            userEmail: data.userEmail || "-",
            kategori: data.kategori || "-",
            hairColor: data.hairColor || "-",
            jam: data.jam || "-",
            tanggal: tanggalObj || null,
            pembayaran: "BCA",
            status: "approve",
            createdAt: serverTimestamp(),
          });

          alert(`✅ Pembayaran ${data.userName} telah disetujui.`);
          loadPendingPayments(); 
        } catch (err) {
          console.error(err);
          alert("Terjadi kesalahan saat menyetujui pembayaran.");
        }
      });

      
      // Reject
      card.querySelector(".reject-btn").addEventListener("click", async () => {
        try {
          const bookingRef = doc(db, `user/${data.uid}/booking`, data.id);
          await updateDoc(bookingRef, { status: "rejected" });
          alert(`❌ Pembayaran ${data.userName} telah ditolak.`);
          loadPendingPayments();
        } catch (err) {
          console.error(err);
          alert("Gagal menolak pembayaran.");
        }
      });

      paymentContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    paymentContainer.innerHTML = `<p style="text-align:center; color:red;">Terjadi kesalahan memuat data.</p>`;
  }
}

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadPendingPayments();
  } else {
    paymentContainer.innerHTML = `<p style="text-align:center; color:red;">Silakan login terlebih dahulu.</p>`;
  }
});