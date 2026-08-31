document.addEventListener("DOMContentLoaded", () => {

  // 1. Loading Overlay Controller (Smooth Transition)
  const loader = document.getElementById("pageLoader");

  function showLoader(callback) {
    if (loader) {
      loader.classList.add("active");
      setTimeout(() => {
        if (callback) callback();
      }, 700); // Animasi loading dibuat tidak terlalu cepat (700ms)
    } else {
      if (callback) callback();
    }
  }

  function hideLoader() {
    if (loader) {
      setTimeout(() => {
        loader.classList.remove("active");
      }, 300);
    }
  }

  // Sembunyikan loader saat halaman awal selesai dimuat
  hideLoader();

  // 2. Theme Management Via URL Parameter
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

        // Tambahkan efek loading saat mengklik tautan antar-halaman
        link.onclick = (e) => {
          e.preventDefault();
          showLoader(() => {
            window.location.href = `${cleanHref}?theme=${theme}`;
          });
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

  // 3. Lightbox Modal Gambar
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const captionText = document.getElementById("lightboxCaption");
  const closeBtn = document.querySelector(".lightbox-close");

  document.querySelectorAll(".portfolio-card").forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const title = card.querySelector(".card-title").innerText;
      if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = img.src;
        if (captionText) captionText.innerText = title;
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.style.display = "none");
  }

  // 4. Stat Counter Animation
  const counters = document.querySelectorAll(".counter");
  if (counters.length > 0) {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const speed = target / 40;
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

  // 5. Portfolio Filter & Dynamic Search
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-card");
  const searchInput = document.getElementById("searchPortfolio");

  function filterPortfolio() {
    const filterValue = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";

    portfolioItems.forEach(item => {
      const category = item.getAttribute("data-category");
      const title = item.querySelector(".card-title").innerText.toLowerCase();
      
      const matchesFilter = (filterValue === "all" || category === filterValue);
      const matchesSearch = title.includes(searchValue);

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
    searchInput.addEventListener("keyup", filterPortfolio);
  }

  // 6. Price Estimator (Order Page)
  const categorySelect = document.getElementById("orderCategory");
  const sizeInput = document.getElementById("orderSize");
  const priceDisplay = document.getElementById("estimatedPrice");

  function calculatePrice() {
    if (!categorySelect || !sizeInput || !priceDisplay) return;

    const baseRates = { spanduk: 25000, flyer: 150000, stage: 50000 };
    const selectedCategory = categorySelect.value;
    const qty = parseFloat(sizeInput.value) || 1;

    let total = (baseRates[selectedCategory] || 0) * qty;
    priceDisplay.innerText = "Rp " + total.toLocaleString("id-ID");
  }

  if (categorySelect && sizeInput) {
    categorySelect.addEventListener("change", calculatePrice);
    sizeInput.addEventListener("input", calculatePrice);
    calculatePrice();
  }

  // 7. Back-to-Top Button
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});