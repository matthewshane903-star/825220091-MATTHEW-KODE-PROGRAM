document.addEventListener("DOMContentLoaded", () => {

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

  
  // Modal Preview
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

  
  // Dropdown Proses 
  const processDropdown = document.getElementById("processDropdown");
  const processBtn = processDropdown.querySelector(".process-btn");
  const processList = document.getElementById("processList");

  const haircutSteps = [
    "-",
  ];

  processList.innerHTML = haircutSteps.map(step => `<li>${step}</li>`).join("");

  processBtn.addEventListener("click", () => {
    processDropdown.classList.toggle("show");
  });
});
