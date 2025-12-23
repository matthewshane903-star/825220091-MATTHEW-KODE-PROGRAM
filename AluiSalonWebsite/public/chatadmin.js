window.addEventListener("load", () => {
  const adminNo = "6281292920551";

  Swal.fire({
    title: "Mengalihkan ke WhatsApp...",
    text: "Mohon tunggu sebentar.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  setTimeout(() => {
    window.location.href = `https://api.whatsapp.com/send?phone=${adminNo}`;
  }, 1000);
});
