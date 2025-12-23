import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Elemen
const infoList = document.getElementById("infoList");
const tabNews = document.getElementById("tabNews");
const tabPicture = document.getElementById("tabPicture");

let infoData = [];
let activeTab = "news";

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

//  Tab Switch 
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
