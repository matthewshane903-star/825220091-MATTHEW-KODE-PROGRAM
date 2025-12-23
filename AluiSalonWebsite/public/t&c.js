document.addEventListener("DOMContentLoaded", () => {
  const listItems = document.querySelectorAll(".tac-list li");
  listItems.forEach((item, index) => {
    item.style.opacity = "0";
    setTimeout(() => {
      item.style.transition = "opacity 0.5s ease";
      item.style.opacity = "1";
    }, 150 * index);
  });
});
