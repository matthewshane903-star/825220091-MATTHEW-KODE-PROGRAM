document.addEventListener("DOMContentLoaded", () => {

  const card = document.querySelector(".haircard");
  const toggleBtn = card.querySelector(".toggleBtn");
  const overlay = card.querySelector(".overlay");

  toggleBtn.addEventListener("click", () => {
    overlay.classList.toggle("active");
    toggleBtn.textContent = overlay.classList.contains("active")
      ? "expand_more"
      : "expand_less";
  });

  // Image Slider
  const images = document.querySelectorAll(".hairImage");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  let index = 0;

  function showImage(i) {
    images.forEach((img, idx) => {
      img.classList.toggle("active", idx === i);
    });
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % images.length;
    showImage(index);
  });

  
  // Zoom
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close-modal");

  images.forEach((img) => {
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

  
  // Dropdown Information
  const processDropdown = document.getElementById("processDropdown");
  const processBtn = processDropdown.querySelector(".process-btn");
  const processList = document.getElementById("processList");

  const haircutSteps = [
    "Haircut by owner (Alui) using Hikari scissors from Japan.",
    "More than 30 years of experience in hair beauty industry.",
    "Personalized consultation for your preferred style.",
    "Includes wash, cut, and final styling session."
  ];

  processList.innerHTML = haircutSteps.map(step => `<li>${step}</li>`).join("");

  processBtn.addEventListener("click", () => {
    processDropdown.classList.toggle("show");
  });
});

// Image Slider
const imageContainer = document.querySelector(".image-container");
const images = document.querySelectorAll(".hairImage");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
let index = 0;

function updateSlider() {
  imageContainer.style.transform = `translateX(-${index * 100}%)`;
}

prevBtn.addEventListener("click", () => {
  index = (index - 1 + images.length) % images.length;
  updateSlider();
});

nextBtn.addEventListener("click", () => {
  index = (index + 1) % images.length;
  updateSlider();
});
