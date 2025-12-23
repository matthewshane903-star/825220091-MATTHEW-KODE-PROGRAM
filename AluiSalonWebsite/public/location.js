// Elemen
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

document.querySelectorAll(".gallery-grid img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

closeBtn.onclick = () => {
  modal.style.display = "none";
};

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Form arah rute ke Alui Salon
document.getElementById("directionForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const userLocation = document.getElementById("userLocation").value.trim();

  if (userLocation !== "") {
    const salonLocation = "Jalan Taman Pluit Kencana No.28, Pluit, Jakarta Utara";
    const directionUrl = `https://www.google.com/maps/dir/${encodeURIComponent(userLocation)}/${encodeURIComponent(salonLocation)}`;
    window.open(directionUrl, "_blank");
  } else {
    alert("Silakan masukkan lokasi Anda terlebih dahulu.");
  }
});

// Gunakan Lokasi (GPS otomatis)
document.getElementById("useMyLocation").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Browser Anda tidak mendukung GPS otomatis.");
  }

  function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const salonLocation = "Jalan Taman Pluit Kencana No.28, Pluit, Jakarta Utara";
    const directionUrl = `https://www.google.com/maps/dir/${lat},${lon}/${encodeURIComponent(salonLocation)}`;
    window.open(directionUrl, "_blank");
  }

  function error() {
    alert("Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif dan izin lokasi diberikan.");
  }
});
