import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

// Elemen
const availableList = document.getElementById("availableList");
const unavailableList = document.getElementById("unavailableList");

onSnapshot(collection(db, "worker"), (snapshot) => {
  availableList.innerHTML = "";
  unavailableList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = createWorkerCard(data);

    if (data.active === true) {
      availableList.innerHTML += card;
    } else {
      unavailableList.innerHTML += card;
    }
  });
});

function createWorkerCard(data) {
  return `
    <div class="worker-card">
      <span class="material-icons worker-avatar">person</span>

      <div class="worker-info">
        <div class="worker-name">${data.name}</div>
        <div class="worker-role">${data.role}</div>
      </div>
    </div>
  `;
}
