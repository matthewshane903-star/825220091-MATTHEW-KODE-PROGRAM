import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { writeBatch } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Config //
const firebaseConfig = {
  apiKey: "AIzaSyCy22AFdR_ye1UmUJKIlWaVmeHICVYgk9Y",
  authDomain: "login-alui-salon.firebaseapp.com",
  projectId: "login-alui-salon",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userSelect = document.getElementById("userSelect");
const currentAdminText = document.getElementById("currentAdmin");
const changeBtn = document.getElementById("changeAdminBtn");

let currentAdminUid = null;

// AUTHENTICATION //
onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "login.html";

  const snap = await getDoc(doc(db, "user", user.uid));
  if (snap.data()?.role !== "admin") {
    alert("Akses ditolak");
    return location.href = "home.html";
  }

  currentAdminUid = user.uid;
  loadUsers();
});

// USERS //
async function loadUsers() {
  const snapshot = await getDocs(collection(db, "user"));

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    if (data.role === "admin") {
      currentAdminText.textContent = `${data.userName} (${data.userEmail})`;
    }

    if (data.role === "user") {
      const opt = document.createElement("option");
      opt.value = docSnap.id;
      opt.textContent = `${data.userName} (${data.userEmail})`;
      userSelect.appendChild(opt);
    }
  });
}

// UBAH ADMIN //
changeBtn.addEventListener("click", async () => {
  const newAdminUid = userSelect.value;
  if (!newAdminUid) return alert("Pilih user terlebih dahulu");

  if (newAdminUid === currentAdminUid) {
    return alert("Tidak bisa memindahkan admin ke diri sendiri");
  }

  const confirmChange = confirm(
    "Yakin ingin memindahkan hak admin? Admin lama akan logout."
  );
  if (!confirmChange) return;

  try {
    await transferAdmin(currentAdminUid, newAdminUid);

    alert("Admin berhasil dipindahkan");

    await signOut(auth);
    location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Gagal mengubah admin");
  }
});

async function transferAdmin(oldAdminUid, newAdminUid) {
  const batch = writeBatch(db);

  const oldAdminRef = doc(db, "user", oldAdminUid);
  const newAdminRef = doc(db, "user", newAdminUid);

  batch.update(oldAdminRef, { role: "user" });
  batch.update(newAdminRef, { role: "admin" });

  await batch.commit(); 
}