document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const bgLayer = document.querySelector(".background-layer");
  const searchButtons = document.querySelectorAll(".search-btn");

  let currentIndex = 0;

  bgLayer.style.backgroundImage = `url(${slides[currentIndex].dataset.bg})`;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev");
      if (i === index) {
        slide.classList.add("active");
      } else if (i === (index - 1 + slides.length) % slides.length) {
        slide.classList.add("prev");
      }
    });

    // Transisi background 
    bgLayer.style.opacity = 0;
    setTimeout(() => {
      bgLayer.style.backgroundImage = `url(${slides[index].dataset.bg})`;
      bgLayer.style.opacity = 1;
    }, 300);
  }

  // Tombol next & prev
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  // Search Button 
  searchButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const activeSlide = slides[currentIndex];
      const targetLink = activeSlide.dataset.link;
      if (targetLink) {
        window.location.href = targetLink;
      }
    });
  });

  let startX = 0;
  let endX = 0;

  document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  document.addEventListener("touchend", e => {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    } else if (endX - startX > 50) {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    }
  });
});
