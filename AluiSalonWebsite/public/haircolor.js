document.addEventListener("DOMContentLoaded", () => {
  const categoryText = document.getElementById("category");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Data produk per kategori
  const data = {
    bleach: [
      {
        title: "Baby Light",
        img: "Picture/babylight.jpg",
        short:
          "The babylight color technique adds depth to your hair, giving it a multi-dimensional effect. Perfect for first-timers who love soft and subtle change.",
        detail:
          "Teknik warna babylight menambahkan kedalaman pada rambut Anda, memberikan efek multi-dimensi. Cocok untuk pemula yang menginginkan hasil lembut dan alami.",
        prices: [
          ["Short", "Rp 3.300.000"],
          ["Medium", "Rp 3.600.000"],
          ["Long", "Rp 3.900.000"],
        ],
        note: "<strong>Note:</strong> Consultation, Bleaching with Olaplex No 1, 2x Hair wash, Hair color, after color treatment, and styling, After care and styling tips are included in the pricelist.",
      },
      {
        title: "Full Bleach",
        img: "Picture/fullheadbleach.jpg",
        short:
          "Solid full hair color with Bleaching. For this technique, bleaching will be done in 2 sessions (on and off scalp) to ensure thorough bleaching.",
        detail:
          "Warna rambut pekat dan penuh dengan Bleaching. Untuk teknik ini, bleaching akan dilakukan dalam 2 sesi (pada rambut dan kulit kepala) untuk memastikan pemutihan menyeluruh.",
        prices: [
          ["Short", "Rp 3.500.000"],
          ["Medium", "Rp 3.900.000"],
          ["Long", "Rp 4.300.000"],
          ["Extra Long", "Rp 4.700.000"],
        ],
        extra: [
          ["Platinum", "Rp 500.000 - Rp 800.000"],
          ["Thick Hair", "Rp 800.000 - Rp 1.500.000"],
        ],
        note: "<strong>Note:</strong> Consultation, Bleaching with Olaplex No 1, 2x Hair wash, Hair color, after color treatment, and styling, After care and styling tips are included in the pricelist.",
      },
      {
        title: "Balayage",
        img: "Picture/balayage.jpg",
        short:
          "A technique characterized by subtle and gradual color transition from roots to tips.",
        detail:
          "Teknik yang ditandai dengan transisi warna yang halus dan bertahap dari akar hingga ujung.",
        prices: [
          ["Short", "Rp 3.900.000"],
          ["Medium", "Rp 4.300.000"],
          ["Long", "Rp 5.300.000"],
          ["Extra Long", "Rp 6.000.000"],
        ],
        extra: [["Thick Hair", "Rp 800.000 - Rp 1.500.000"]],
        note: "<strong>Note:</strong> Consultation, Bleaching with Olaplex No 1, 2x Hair wash, Hair color, after color treatment, and styling, After care and styling tips are included in the pricelist.",
      },
      {
        title: "Root Haircolor Retouch",
        img: "Picture/retouchbleach.jpg",
        short:
          "Babylight :", 
        prices: [
          ["Medium", "Rp 3.500.000 - Rp 3.700.000"],
          ["Long", "Rp 3.800.000 - Rp 3.900.000"],
          ["Extra Long", "Rp 4.000.000 - Rp 4.200.000"],
          ["Extra Thick", "+Rp 200.000 - +Rp 1.000.000"],
        ],
        detail:
          "Root Retouch Full Head (1cm - 4cm) :",
        prices2: [
          ["Short", "Rp 3.600.000 - Rp 3.850.000"],
          ["Medium", "Rp 3.800.000 - Rp 3.950.000"],
          ["Long", "Rp 4.100.000 - Rp 4.300.000"],
          ["Extra Long", "Rp 4.400.000 - Rp 4.700.000"],
        ],
        note: "<strong>Note:</strong> - ",
      },
    ],

    nobeach: [
      {
        title: "Solid One Color",
        img: "Picture/solidonecolor.jpg",
        short: " Giving a new hair color that suits your desires or to cover your white grey hair to be a solid color.",
        detail:
          "Memberikan warna rambut baru yang sesuai dengan keinginan Anda atau menutupi uban putih Anda menjadi warna solid.",
        prices: [
          ["Short", "Rp 850.000"],
          ["Medium", "Rp 1.000.000"],
          ["Long", "Rp 1.200.000"],
        ],
        note: "<strong>Note:</strong> Consultation, hair color, 1x hair wash, blow dry, and styling. Aftercare and styling tips are included in the price list.",
      },
      {
        title: "Babylight No Bleach",
        img: "Picture/babylightnobleach.jpg",
        short: "Highlight hair color technique adds brown strokes definition to your hair without bleach. this hair color is very natural looking and low maintanance.",
        detail:
          "Teknik pewarnaan rambut highlight menambahkan garis gradasi cokelat yang tegas pada rambut Anda tanpa bleach. Warna rambut ini tampak sangat alami dan mudah dirawat.",
        prices: [
          ["Short", "Rp 1.800.000"],
          ["Medium", "Rp 2.200.000"],
          ["Long", "Rp 2.700.000"],
          ["Extra Long", "Rp 3.100.000"],
        ],
        extra: [["Thick Hair", "Rp 300.000 - Rp 500.000"]],
        note: "<strong>Note:</strong> Consultation, hair color, 1x hair wash, blow dry, and styling. Aftercare and styling tips are included in the price list.",
      },
      {
        title: "Tinted Treatment Babylight",
        img: "Picture/tintedtreatment.jpg",
        short: "Color option: (Purple/Violet/Pink). Haircolor treatment infused with tint. For brassy bleach hair to make it more ashy or to tone unwanted color.",
        detail:
          "pilihan warna : (purple/violet/pink) perawatan rambut conditioner yang di sertai dengan pewarna. untuk rambut bleach yang warnanya sudah kusam atau kuning agar tampak lebih ashy atau mengurangi warna yang tidak di inginkan.",
        prices: [
          ["Short", "Rp 300.000 - Rp 400.000"],
          ["Medium", "Rp 400.000 - Rp 500.000"],
          ["Long", "Rp 500.000 - Rp 700.000"],
        ],
        extra: [
          ["Thick Hair", "Rp 50.000 - Rp 200.000"],
        ],
        note: "<strong>Note:</strong> Consultation, hair color, 1x hair wash, blow dry, and styling. Aftercare and styling tips are included in the price list.",
      },
      {
        title: "Root Haircolor Retouch",
        img: "Picture/retouch.jpg",
        short: "No Bleach Hair Root Retouch",
        detail:
          "Price : Rp 300.000 - Rp 700.000 *depending on the hair root length and thickness of the hair.",
        note: "<strong>Note:</strong> -",
      },
    ],
  };

  let currentCategory = "bleach";

  function updateAllCards() {
  const categoryData = data[currentCategory];
  const cards = document.querySelectorAll(".haircard");

  categoryText.textContent =
    currentCategory === "bleach" ? "Bleach" : "No Bleach";

  cards.forEach((card, index) => {
    const info = categoryData[index];
    if (!info) {
      card.style.display = "none";
      return;
    }

    card.style.display = "block";
    card.querySelector(".hairTitle").textContent = info.title;
    card.querySelector(".hairImage").src = info.img;
    card.querySelector(".shortDesc").textContent = info.short;

    const detailP = card.querySelector(".detail p");
    if (detailP) detailP.textContent = info.detail;

    // Tabel utama
    const priceTables = card.querySelectorAll(".priceTable");
    const priceTables2 = card.querySelectorAll(".priceTable2");

    if (priceTables[0]) {
      if (info.prices) {
        priceTables[0].style.display = "table";
        priceTables[0].querySelector("tbody").innerHTML = info.prices
          .map(([len, price]) => `<tr><td>${len}</td><td>${price}</td></tr>`)
          .join("");
      } else {
        priceTables[0].style.display = "none";
      }
    }

    if (priceTables[1]) {
      if (info.extra) {
        priceTables[1].style.display = "table";
        priceTables[1].querySelector("tbody").innerHTML = info.extra
          .map(([extra, price]) => `<tr><td>${extra}</td><td>${price}</td></tr>`)
          .join("");
      } else {
        priceTables[1].style.display = "none";
      }
    }

    // Tabel kedua
    if (priceTables2[0]) {
      if (info.prices2) {
        priceTables2[0].style.display = "table";
        priceTables2[0].querySelector("tbody").innerHTML = info.prices2
          .map(([len, price]) => `<tr><td>${len}</td><td>${price}</td></tr>`)
          .join("");
      } else {
        priceTables2[0].style.display = "none";
      }
    }

    // Note
    card.querySelector(".note").innerHTML = info.note;
  });
}

  // Navigasi kategori
  function toggleCategory() {
    currentCategory = currentCategory === "bleach" ? "nobeach" : "bleach";
    updateAllCards();
  }
  prevBtn.addEventListener("click", toggleCategory);
  nextBtn.addEventListener("click", toggleCategory);

  document.querySelectorAll(".haircard").forEach((card) => {
    const toggleBtn = card.querySelector(".toggleBtn");
    const overlay = card.querySelector(".overlay");
    toggleBtn.addEventListener("click", () => {
      overlay.classList.toggle("active");
      toggleBtn.textContent = overlay.classList.contains("active")
        ? "expand_more"
        : "expand_less";
    });
  });

  // Modal preview gambar
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close-modal");

  document.querySelectorAll(".hairImage").forEach((img) => {
    img.addEventListener("click", () => {
      modal.style.display = "block";
      modalImg.src = img.src;
    });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  updateAllCards();
});

const processDropdown = document.getElementById("processDropdown");
const processBtn = processDropdown.querySelector(".process-btn");
const processList = document.getElementById("processList");
const categoryText = document.getElementById("category");

// Data proses berdasarkan kategori
const processSteps = {
  Bleach: [
    "1. Two times bleach sessions with foils technique (Dua kali sesi bleaching dengan teknik foil).",
    "2. Hair wash (Cuci rambut).",
    "3. Adding color (Penambahan warna).",
    "4. Hair wash (Cuci rambut).",
    "5. After color treatment (15 mins): Rinse, blow dry, and styling (Setelah perawatan pewarnaan (15 menit): Bilas, keringkan, dan tata rambut)."
  ],
  "No Bleach": [
    "1. After the consultation, hair color will be applied starting away from the roots (Setelah konsultasi, warna rambut diaplikasikan mulai dari bagian jauh dari akar).",
    "2. After 30 minutes, hair dye will be applied to the roots for 5–10 minutes. This prevents irritation and ensures even color from roots to ends (Setelah 30 menit, pewarna rambut diaplikasikan ke akar selama 5–10 menit. Teknik ini mencegah iritasi dan memastikan warna merata dari akar hingga ujung).",
    "3. Hair washing and styling (Mencuci dan menata rambut).",
    "4. Process duration: 2–3 hours (Durasi proses: 2–3 jam)."
  ]
};

// Update isi dropdown sesuai kategori
function updateProcessDropdown() {
  const currentCategory = categoryText.textContent.trim();

  if (processSteps[currentCategory]) {
    processDropdown.style.display = "block";
    processList.innerHTML = processSteps[currentCategory]
      .map(step => `<li>${step}</li>`)
      .join("");
  } else {
    processDropdown.style.display = "none";
  }
}

processBtn.addEventListener("click", () => {
  processDropdown.classList.toggle("show");
});

updateProcessDropdown();

document.getElementById("nextBtn").addEventListener("click", () => {
  setTimeout(updateProcessDropdown, 100);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  setTimeout(updateProcessDropdown, 100);
});
