import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Config
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
const openModalBtn = document.getElementById("openModalBtn");
const infoModal = document.getElementById("infoModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveInfoBtn = document.getElementById("saveInfoBtn");
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const infoList = document.getElementById("infoList");
const tabNews = document.getElementById("tabNews");
const tabPicture = document.getElementById("tabPicture");

// Disable tombol
saveInfoBtn.disabled = true;
saveInfoBtn.style.opacity = "0.5";

let infoData = [];
let activeTab = "news";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Login dulu!");
        window.location.href = "login.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "user", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== "admin") {
        alert("Hanya admin yang bisa mengakses halaman ini.");
        window.location.href = "index.html";
        return;
    }

    saveInfoBtn.disabled = false;
    saveInfoBtn.style.opacity = "1";
    console.log("✔ Admin verified:", user.email);
});

// Modal
infoModal.style.display = "none";

openModalBtn.addEventListener("click", () => {
    infoModal.style.display = "flex";
    // reset input
    titleInput.value = "";
    descInput.value = "";
});

closeModalBtn.addEventListener("click", () => infoModal.style.display = "none");
infoModal.addEventListener("click", (e) => {
    if (e.target === infoModal) infoModal.style.display = "none";
});


// Tambah Data ke Firestore
saveInfoBtn.onclick = async () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();

    if (!title || !desc) {
        alert("Judul & deskripsi wajib diisi!");
        return;
    }

    try {
        await addDoc(collection(db, "information"), {
            title,
            desc,
            createdAt: new Date(),
        });

        infoModal.style.display = "none";
    } catch (error) {
        console.error("Gagal menyimpan info:", error);
        alert("Gagal menyimpan informasi! Periksa izin Firestore.");
    }
};

const q = query(collection(db, "information"), orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
    infoData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (activeTab === "news") renderCards();
});

function renderCards() {
    infoList.innerHTML = "";

    infoData.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("info-card");

        card.innerHTML = `
            <div class="number">${index.toString().padStart(2, "0")}</div>
            <div class="title">${item.title}</div>
            <div class="desc">${item.desc}</div>
        `;

        const descEl = card.querySelector(".desc");
        descEl.style.maxHeight = "0px";
        descEl.style.overflow = "hidden";
        descEl.style.transition = "max-height 0.3s ease, padding 0.3s ease";

        card.onclick = () => {
            const isActive = card.classList.contains("active");

            document.querySelectorAll(".info-card").forEach(c => {
                c.classList.remove("active");
                const d = c.querySelector(".desc");
                d.style.maxHeight = "0px";
                d.style.paddingTop = "0px";
                d.style.paddingBottom = "0px";
            });

            if (!isActive) {
                card.classList.add("active");
                descEl.style.maxHeight = descEl.scrollHeight + "px";
                descEl.style.paddingTop = "8px";
                descEl.style.paddingBottom = "8px";
            }
        };

        infoList.appendChild(card);
    });
}

// Tab Switch 
tabNews.onclick = () => {
    activeTab = "news";
    tabNews.classList.add("active");
    tabPicture.classList.remove("active");
    renderCards();
};

tabPicture.onclick = () => {
    activeTab = "picture";
    tabPicture.classList.add("active");
    tabNews.classList.remove("active");

    infoList.innerHTML = "";

    const pictures = [
        { 
            src: "Picture/ukuranrambut.jpg", 
            caption: "Ukuran Rambut",
            desc: "Ini adalah ukuran-ukuran rambut"
        },
        { 
            src: "Picture/infoconsul.jpg", 
            caption: "Info Konsultasi",
            desc: "Informasi konsultasi salon untuk pelanggan"
        }
    ];

    pictures.forEach(pic => {
        const card = document.createElement("div");
        card.classList.add("picture-card");

        card.innerHTML = `
            <img src="${pic.src}" alt="${pic.caption}">
            <div class="caption">${pic.caption}</div>
            <div class="desc">${pic.desc}</div>
        `;

        infoList.appendChild(card);
    });
};
