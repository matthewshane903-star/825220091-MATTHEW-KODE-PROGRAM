// Data produk untuk tiap kategori
const products = {
  pewarna: [
    { img: "Picture/produkaluisalon1.jpg", 
      name: "Violet Conditioner Treatment Rambut rusak Ash Hair", 
      price: "Rp 270.000",
      shopee: "https://id.shp.ee/gcDPSwz" 
    },
    { img: "Picture/produkaluisalon2.jpg", 
      name: "Blue Conditioner 180 gram Masker Rambut Cat Rambut Blue", 
      price: "Rp 260.000",
      shopee: "https://id.shp.ee/rPHEhXF" 
    },
    { img: "Picture/produkaluisalon3.jpg", 
      name: "Soft Purple Conditioner 180gram Vitamin Rambut Rusak perawatan rambut kering ash hair toner", 
      price: "Rp 250.000",
      shopee: "https://id.shp.ee/wCvREhQ"     
    },
    { img: "Picture/produkaluisalon4.jpg", 
      name: "Pink Conditioner 180gram Perawatan Rambut Bleaching Rusak Masker Car Rambut Pink Rosegold Temporary", 
      price: "Rp 260.000",
      shopee: "https://id.shp.ee/v7c7jVA"        
    },
    { img: "Picture/produkaluisalon5.jpg", 
      name: "Purple Conditioner 180gram Masker Cat Rambut Ungu Purple Hairmask Ash brown Lavender Haircolor", 
      price: "Rp 260.000", 
      shopee: "https://id.shp.ee/o9FbTYT"       
    },
    { img: "Picture/produkaluisalon6.jpg", 
      name: "Soft Violet Conditioner Masker Rambut Rusak Ash Blonde Perawatan rambut kering rusak haircolor treatment", 
      price: "Rp 250.000",
      shopee: "https://id.shp.ee/soU8h5W"       
    },
    { img: "Picture/produkaluisalon7.jpg", 
      name: "Violet + Pink Conditioner Amonia Free 180gram Perawatan Rambut Rusak Hair Treatment Rambut Kering Pink Hair Purple", 
      price: "Rp 487.000",
      shopee: "https://id.shp.ee/zhEF7oM"       
    },
    { img: "Picture/produkaluisalon8.jpg", 
      name: "S. Purple + S. Violet Conditioner 180gram Masker Cat Rambut", 
      price: "Rp 460.000",
      shopee: "https://id.shp.ee/i87Y65p"       
    },
    { img: "Picture/produkaluisalon9.jpg", 
      name: "Purple + Violet Softening Hair Conditioner (Haircolor Rambut Rusak Perawatan Rambut Kering Purple Hair Ash Brown Purple)", 
      price: "Rp 527.000",
      shopee: "https://id.shp.ee/vMjn5Ka"       
    },
    { img: "Picture/produkaluisalon10.jpg", 
      name: "Violet + Soft Purple Softening Conditioner (Masker Cat Rambut Rusak Kering Haircolor Grey Ash Brown Lavender)", 
      price: "Rp 532.000",
      shopee: "https://id.shp.ee/KvqUY3r"        
    },
    { img: "Picture/produkaluisalon11.jpg", 
      name: "Violet + Blue Softening Conditioner 360gram Masker Cat Rambut", 
      price: "Rp 460.000",
      shopee: "https://id.shp.ee/iSC1Epe"      
    },
    { img: "Picture/produkaluisalon12.jpg", 
      name: "Purple + Soft Purple Conditioner 180gram Perawatan Rambut Kasar Cat Rambut Ungu Purple Lavender Haircolor", 
      price: "Rp 487.000",
      shopee: "https://id.shp.ee/kkfWyom"       
    },
    { img: "Picture/produkaluisalon13.jpg", 
      name: "Purple + Pink Conditioner 180gram Masker Rambut Kasar Damage Hairmask Perawatan Haircolor", 
      price: "Rp 460.000",
      shopee: "https://id.shp.ee/tovPmUU"        
    },
    { img: "Picture/produkaluisalon14.jpg", 
      name: "Purple + Soft Violet Conditioner 180gram Masker Rambut Rusak Kasar Purple Shampoo Lavender", 
      price: "Rp 522.000",
      shopee: "https://id.shp.ee/cspxLDr"       
    },
    { img: "Picture/produkaluisalon15.jpg", 
      name: "Pink + S.Purple Conditioner Masker Rambut Kering Cotton Candy Pink Lavender Purple Hair", 
      price: "Rp 487.000",
      shopee: "https://id.shp.ee/duZ4Wzd"        
    },
    { img: "Picture/produkaluisalon16.jpg", 
      name: "Pink + S.Violet Conditioner 180gram Perawatan Rambut Bleaching Kasar Rusak Damage Hair Vitamin", 
      price: "Rp 487.000",
      shopee: "https://id.shp.ee/j2zJa5L"        
    },
  ],
  shampoo: [
    { img: "Picture/produkaluisalon17.jpg", 
      name: "Lador Keratin LPP Shampoo 150ml", 
      price: "Rp 115.000",
      shopee: "https://id.shp.ee/pYoiW6C"     
    },
    { img: "Picture/produkaluisalon18.jpg", 
      name: "Dancoly Angel Lavender Shampoo Rambut Berminyak Cepet Lepek", 
      price: "Rp 205.000",
      shopee: "https://id.shp.ee/oazdbGD" 
    },
    { img: "Picture/produkaluisalon19.jpg", 
      name: "Lador Dermatical Hairloss Shampoo Rambut Rontok 200ml", 
      price: "Rp 225.500",
      shopee: "https://id.shp.ee/GTf9Xh1" 
    },
    { img: "Picture/produkaluisalon20.jpg", 
      name: "LADOR Herbalism Shampoo 150ml", 
      price: "Rp 190.000",
      shopee: "https://id.shp.ee/axKRfm3" 
    },
    { img: "Picture/produkaluisalon21.jpg", 
      name: "Lador Damage Protector Acid Shampoo 150ml Damage Hair Rambut Kering Ngembang Rusak", 
      price: "Rp 155.000",
      shopee: "https://id.shp.ee/4bZME4j" 

    },
    { img: "Picture/produkaluisalon22.jpg", 
      name: "Lador Triplex Natural Shampoo", 
      price: "Rp 290.000",
      shopee: "https://id.shp.ee/yuGwuAB" 
    },
  ],
  sisir: [
    { img: "Picture/produkaluisalon23.jpg", 
      name: "Jepitan Rambut Jepit Buaya Jepit Salon Jepitan Hairdo", 
      price: "Rp 10.000",
      shopee: "https://id.shp.ee/ptSXt6D" 
    },
    { img: "Picture/produkaluisalon24.jpg", 
      name: "Sisir Kuas Cat Rambut + Jepitan Rambut", 
      price: "Rp 41.000",
      shopee: "https://id.shp.ee/wGb5rxN" 
    },
    { img: "Picture/produkaluisalon25.jpg", 
      name: "Sisir Kuas Cat Rambut", 
      price: "Rp 30.000",
      shopee: "https://id.shp.ee/9tZFrXM" 
    },
  ],
  treatment: [
    { img: "Picture/produkaluisalon26.jpg", 
      name: "Protein Hairmask (Perawatan Rambut Bleaching Rapuh) 190gr Dupe Olaplex No.3", 
      price: "Rp 329.000", 
      shopee: "https://id.shp.ee/BkCUhLT" 
    },
    { img: "Picture/produkaluisalon27.jpg", 
      name: "Lador Dermatical Scalp Tonic 150ml", 
      price: "Rp 300.000", 
      shopee: "https://id.shp.ee/e8HEoao" 
    },
  ],
  kondisioner: [
    { img: "Picture/produkaluisalon28.jpg", 
      name: "Soft Pink Conditioner 180gr Dusty Pink Haircolor Cotton Candy Pink", 
      price: "Rp 291.000",
      shopee: "https://id.shp.ee/mV2pzmi" 
    },
    { img: "Picture/produkaluisalon29.jpg", 
      name: "Violet + Soft Violet Conditioner 180gram Masker Cat Rambut Orange Ash Grey Hair", 
      price: "Rp 465.000",
      shopee: "https://id.shp.ee/ZmDBL2R" 
    },
  ],
};

// Elemen
const categoryButtons = document.querySelectorAll(".category");
const productGrid = document.getElementById("productGrid");
const productTitle = document.querySelector(".product-title");

// Fungsi untuk menampilkan produk
function displayProducts(category) {
  productGrid.innerHTML = "";
  products[category].forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>${item.price}</p>
    `;

    // Buka Shopee
    card.addEventListener("click", () => {
      Swal.fire({
        title: "Membuka Shopee...",
        text: "Mohon tunggu sebentar.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      setTimeout(() => {
        window.open(item.shopee, "_blank");
        Swal.close();
      }, 1000);
    });

    productGrid.appendChild(card);
  });

  productTitle.textContent = `Produk Alui Salon - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}

// Kategori
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const selectedCategory = btn.getAttribute("data-category");
    displayProducts(selectedCategory);
  });
});

displayProducts("pewarna");