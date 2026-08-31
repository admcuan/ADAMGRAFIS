document.addEventListener("DOMContentLoaded", () => {

  // 1. Loading Controller
  const loader = document.getElementById("pageLoader");

  function showLoader(callback) {
    if (loader) {
      loader.classList.add("active");
      setTimeout(() => { if (callback) callback(); }, 400);
    } else {
      if (callback) callback();
    }
  }

  function hideLoader() {
    if (loader) {
      setTimeout(() => { loader.classList.remove("active"); }, 250);
    }
  }

  hideLoader();

  // 2. Theme Management
  const urlParams = new URLSearchParams(window.location.search);
  let currentTheme = urlParams.get('theme') || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const themeToggleBtn = document.getElementById("themeToggle");
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === "light" 
        ? '<i class="fa-solid fa-moon"></i>' 
        : '<i class="fa-solid fa-sun"></i>';
    }
    updateAllLinks(theme);
  }

  function updateAllLinks(theme) {
    document.querySelectorAll("a").forEach(link => {
      let href = link.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto") && !href.startsWith("tel")) {
        let cleanHref = href.split('?')[0];
        link.setAttribute("href", `${cleanHref}?theme=${theme}`);

        link.onclick = (e) => {
          e.preventDefault();
          showLoader(() => { window.location.href = `${cleanHref}?theme=${theme}`; });
        };
      }
    });
  }

  applyTheme(currentTheme);

  const themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      showLoader(() => {
        currentTheme = (currentTheme === "light") ? "dark" : "light";
        applyTheme(currentTheme);
        hideLoader();
      });
    });
  }

  // 3. 3D Parallax Tilt Effect (Diaktifkan Hanya Pada Layar Desktop > 768px)
  const tiltCards = document.querySelectorAll(".tilt-card");

  function handleTilt(e) {
    if (window.innerWidth <= 768) return;

    const card = e.currentTarget;
    const maxTilt = parseFloat(card.getAttribute("data-tilt-max")) || 12;
    const children = card.querySelectorAll(".tilt-child");

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;

    children.forEach(child => {
      const depth = parseFloat(child.getAttribute("data-depth")) || 8;
      const moveX = ((x - centerX) / centerX) * depth;
      const moveY = ((y - centerY) / centerY) * depth;
      child.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, ${depth}px)`;
    });
  }

  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    card.querySelectorAll(".tilt-child").forEach(child => {
      child.style.transform = `translate3d(0px, 0px, 0px)`;
    });
  }

  tiltCards.forEach(card => {
    card.addEventListener("mousemove", handleTilt);
    card.addEventListener("mouseleave", resetTilt);
  });

  // 4. Background Mouse Move Parallax Orbs
  const bgOrbs = document.querySelectorAll(".glow-orb");
  document.addEventListener("mousemove", (e) => {
    if (window.innerWidth <= 768) return;
    const mouseX = e.clientX - window.innerWidth / 2;
    const mouseY = e.clientY - window.innerHeight / 2;

    bgOrbs.forEach(orb => {
      const speed = parseFloat(orb.getAttribute("data-parallax-speed")) || 0.04;
      orb.style.transform = `translate3d(${mouseX * speed}px, ${mouseY * speed}px, 0)`;
    });
  });

  // 5. Lightbox Modal Gambar (Fixed Logic)
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const captionText = document.getElementById("lightboxCaption");
  const closeBtn = document.querySelector(".lightbox-close");

  function attachLightboxEvents() {
    document.querySelectorAll(".portfolio-card").forEach(card => {
      card.onclick = () => {
        const img = card.querySelector("img");
        const title = card.querySelector(".card-title")?.innerText || "";
        if (modal && modalImg && img) {
          modal.style.display = "flex";
          modalImg.src = img.src;
          if (captionText) captionText.innerText = title;
        }
      };
    });
  }

  attachLightboxEvents();

  if (closeBtn) {
    closeBtn.onclick = () => { if (modal) modal.style.display = "none"; };
  }

  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  }

  // 6. Portfolio Filter & Search Real-Time
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-card");
  const searchInput = document.getElementById("searchPortfolio");

  function filterPortfolio() {
    const activeBtn = document.querySelector(".filter-btn.active");
    const filterValue = activeBtn ? activeBtn.getAttribute("data-filter") : "all";
    const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";

    portfolioItems.forEach(item => {
      const category = item.getAttribute("data-category") || "";
      const title = item.querySelector(".card-title")?.innerText.toLowerCase() || "";
      const desc = item.querySelector(".card-desc")?.innerText.toLowerCase() || "";
      
      const matchesFilter = (filterValue === "all" || category === filterValue);
      const matchesSearch = title.includes(searchValue) || desc.includes(searchValue);

      if (matchesFilter && matchesSearch) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterPortfolio();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterPortfolio);
  }

  // 7. Stat Counter Animation
  const counters = document.querySelectorAll(".counter");
  if (counters.length > 0) {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const speed = target / 25;
      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target + "+";
        }
      };
      updateCount();
    });
  }

  // 8. Dynamic Price Estimator & WhatsApp Order Link
  const categorySelect = document.getElementById("orderCategory");
  const sizeInput = document.getElementById("orderSize");
  const priceDisplay = document.getElementById("estimatedPrice");
  const clientNameInput = document.getElementById("clientName");
  const orderNotesInput = document.getElementById("orderNotes");
  const waBtn = document.getElementById("sendWaBtn");

  function calculatePrice() {
    if (!categorySelect || !sizeInput || !priceDisplay) return 0;

    const baseRates = { spanduk: 25000, flyer: 150000, stage: 50000 };
    const selectedCategory = categorySelect.value;
    const qty = parseFloat(sizeInput.value) || 1;

    let total = (baseRates[selectedCategory] || 0) * qty;
    priceDisplay.innerText = "Rp " + total.toLocaleString("id-ID");
    return total;
  }

  if (categorySelect && sizeInput) {
    categorySelect.addEventListener("change", calculatePrice);
    sizeInput.addEventListener("input", calculatePrice);
    calculatePrice();
  }

  if (waBtn) {
    waBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const name = clientNameInput ? clientNameInput.value.trim() : "Pelanggan";
      const categoryText = categorySelect ? categorySelect.options[categorySelect.selectedIndex].text : "-";
      const qty = sizeInput ? sizeInput.value : "1";
      const notes = orderNotesInput ? orderNotesInput.value.trim() : "Tidak ada catatan.";
      const totalPrice = calculatePrice();

      const textMessage = `Halo Adam Grafis,%0A%0ASaya ingin memesan jasa desain dengan rincian berikut:%0A- *Nama*: ${encodeURIComponent(name)}%0A- *Kategori*: ${encodeURIComponent(categoryText)}%0A- *Jumlah/Ukuran*: ${encodeURIComponent(qty)}%0A- *Estimasi Total*: Rp ${totalPrice.toLocaleString("id-ID")}%0A- *Catatan*: ${encodeURIComponent(notes)}%0A%0AMohon konfirmasi proses selanjutnya. Terima kasih!`;

      window.open(`https://wa.me/6283874795123?text=${textMessage}`, "_blank");
    });
  }

  // 9. Back to Top Button
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 250) {
        backToTopBtn.style.display = "flex";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
