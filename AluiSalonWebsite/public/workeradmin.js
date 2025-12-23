import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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
const workerList = document.getElementById("workerList");
const modalAdd = document.getElementById("modalAdd");
const addBtn = document.querySelector(".add-btn");

addBtn.disabled = true;
addBtn.style.opacity = "0.5";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "user", user.uid));

  if (!userDoc.exists()) {
    alert("Data user tidak ditemukan!");
    return;
  }

  const userData = userDoc.data();

  if (userData.role !== "admin") {
    alert("Akses ditolak! Hanya admin yang bisa membuka halaman ini.");
    window.location.href = "index.html";
    return;
  }

  console.log("✔ Admin verified:", user.email);

  addBtn.disabled = false;
  addBtn.style.opacity = "1";

  loadWorkers();
});

addBtn.addEventListener("click", () => {
  modalAdd.style.display = "flex";
});

modalAdd.addEventListener("click", (e) => {
  if (e.target === modalAdd) modalAdd.style.display = "none";
});

document.getElementById("sendWorker").addEventListener("click", async () => {
  const name = document.getElementById("workerName").value.trim();
  const role = document.getElementById("workerRole").value.trim();

  if (!name || !role) {
    alert("Form tidak boleh kosong!");
    return;
  }

  try {
    await addDoc(collection(db, "worker"), {
      name,
      role,
      active: false,
      createdAt: Date.now()
    });

    document.getElementById("workerName").value = "";
    document.getElementById("workerRole").value = "";
    modalAdd.style.display = "none";

  } catch (error) {
    console.error("Gagal menyimpan worker:", error);
    alert("Gagal menyimpan worker! Periksa kembali izin dan rules Firestore.");
  }
});

function loadWorkers() {
  onSnapshot(collection(db, "worker"), (snapshot) => {
    workerList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      workerList.innerHTML += `
        <div class="worker-card">
          <div class="worker-info">
            <span class="material-icons worker-avatar">person</span>
            <div>
              <div class="worker-name">${data.name}</div>
              <div class="worker-role">${data.role}</div>
            </div>
          </div>

          <label class="switch">
            <input type="checkbox" ${data.active ? "checked" : ""} 
              onchange="toggleWorker('${docSnap.id}', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
      `;
    });
  });
}

window.toggleWorker = async function (id, status) {
  try {
    await updateDoc(doc(db, "worker", id), {
      active: status
    });
  } catch (error) {
    console.error("Gagal update status:", error);
    alert("Gagal update status worker!");
  }
};
