// Global variables
let currentLightboxIndex = 0;
let lightboxItems = [];

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initLoader();
  initNavbar();
  initTypedText();
  initScrollAnimations();
  initGalleryFilter();
  initLightbox();
  initSkillBars();
  initSmoothScrolling();
  initScrollToTop();
  initBankSelector();
});

// Loading Screen
function initLoader() {
  window.addEventListener("load", function () {
    setTimeout(() => {
      const loader = document.getElementById("loader");
      loader.classList.add("hidden");
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 1000);
  });
}

// Navbar Scroll Effect
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  mobileMenu.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  const navLinkItems = navLinks.querySelectorAll("a");
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileMenu.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideNav = navbar.contains(event.target);
    if (!isClickInsideNav && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      mobileMenu.classList.remove("active");
    }
  });
}

// Typed Text Effect
function initTypedText() {
  const typedElement = document.getElementById("typed-text");
  const texts = [
    "Đam mê công nghệ",
    "Yêu thích chụp ảnh",
    "Thích khám phá",
    "Sinh viên năng động",
    "Người bạn thân thiện",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeText() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typedElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }

    setTimeout(typeText, typeSpeed);
  }

  typeText();
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right"
  );
  animatedElements.forEach((el) => observer.observe(el));
}

// Gallery Filter
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        if (filterValue === "all") {
          item.classList.remove("hidden");
          setTimeout(() => {
            item.style.display = "block";
          }, 10);
        } else {
          const categories = item.getAttribute("data-category");
          if (categories && categories.includes(filterValue)) {
            item.classList.remove("hidden");
            setTimeout(() => {
              item.style.display = "block";
            }, 10);
          } else {
            item.style.display = "none";
            item.classList.add("hidden");
          }
        }
      });
    });
  });
}

// Lightbox
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  // Collect all gallery items for navigation
  const galleryItems = document.querySelectorAll(".gallery-item");
  lightboxItems = Array.from(galleryItems)
    .map((item) => {
      const img = item.querySelector("img");
      const video = item.querySelector("video");
      const title =
        item.querySelector(".gallery-info h4")?.textContent ||
        "Không có tiêu đề";
      const description =
        item.querySelector(".gallery-info p")?.textContent || "Không có mô tả";

      if (img) {
        return {
          src: img.src,
          type: "image",
          title: title,
          description: description,
        };
      } else if (video) {
        return {
          src: video.src,
          type: "video",
          title: title,
          description: description,
        };
      }
    })
    .filter((item) => item);

  // Add click events to entire gallery items
  galleryItems.forEach((item) => {
    const img = item.querySelector("img");
    const video = item.querySelector("video");

    // Make entire gallery item clickable
    item.style.cursor = "pointer";

    item.addEventListener("click", function (e) {
      // Prevent button clicks from triggering this event
      if (e.target.closest(".gallery-btn")) {
        return;
      }

      const title =
        item.querySelector(".gallery-info h4")?.textContent ||
        "Không có tiêu đề";
      const description =
        item.querySelector(".gallery-info p")?.textContent || "Không có mô tả";

      if (img) {
        openLightbox(img.src, "image", title, description);
      } else if (video) {
        openLightbox(video.src, "video", title, description);
      }
    });
  });

  // Close lightbox
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navigation
  lightboxPrev.addEventListener("click", function () {
    currentLightboxIndex =
      (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightboxContent();
  });

  lightboxNext.addEventListener("click", function () {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
    updateLightboxContent();
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (lightbox.classList.contains("active")) {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        lightboxPrev.click();
      } else if (e.key === "ArrowRight") {
        lightboxNext.click();
      }
    }
  });
}

// Open Lightbox Function
function openLightbox(src, type, title = "", description = "") {
  const lightbox = document.getElementById("lightbox");

  // Find the index of the current item
  currentLightboxIndex = lightboxItems.findIndex((item) => item.src === src);

  // If not found, add the item to the array
  if (currentLightboxIndex === -1) {
    lightboxItems.push({ src, type, title, description });
    currentLightboxIndex = lightboxItems.length - 1;
  }

  updateLightboxContent();
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function updateLightboxContent() {
  const lightboxMedia = document.getElementById("lightboxMedia");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDescription = document.getElementById("lightboxDescription");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const currentItem = lightboxItems[currentLightboxIndex];

  // Update media content
  if (currentItem.type === "image") {
    lightboxMedia.innerHTML = `<img src="${currentItem.src}" alt="${currentItem.title}">`;
  } else if (currentItem.type === "video") {
    lightboxMedia.innerHTML = `<video src="${currentItem.src}" controls autoplay loop></video>`;
  }

  // Update info
  lightboxTitle.textContent = currentItem.title;
  lightboxDescription.textContent = currentItem.description;

  // Update counter
  lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${
    lightboxItems.length
  }`;

  // Update navigation buttons
  lightboxPrev.disabled = lightboxItems.length <= 1;
  lightboxNext.disabled = lightboxItems.length <= 1;
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const videos = lightbox.querySelectorAll("video");

  // Pause any playing videos
  videos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });

  lightbox.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Skill Progress Bars
function initSkillBars() {
  const skillBars = document.querySelectorAll(".progress-bar");

  const skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const percent = progressBar.getAttribute("data-percent");
          setTimeout(() => {
            progressBar.style.width = percent + "%";
          }, 500);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));
}

// Smooth Scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll to Top
function initScrollToTop() {
  const scrollTopBtn = document.getElementById("scrollTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollTopBtn.style.opacity = "1";
      scrollTopBtn.style.pointerEvents = "auto";
    } else {
      scrollTopBtn.style.opacity = "0";
      scrollTopBtn.style.pointerEvents = "none";
    }
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initBankSelector() {
  const qrTrigger = document.querySelector(".qr-container");
  const modal = document.getElementById("bankModal");
  const closeBtn = document.getElementById("bankModalClose");
  const searchInput = document.getElementById("bankSearch");
  const listEl = document.getElementById("bankList");
  const statusEl = document.getElementById("bankStatus");

  if (
    !qrTrigger ||
    !modal ||
    !closeBtn ||
    !searchInput ||
    !listEl ||
    !statusEl
  ) {
    return;
  }

  const ACCOUNT_INFO = {
    ba: "45404052004@TPB",
    tn: "Ung ho Pham Quang Trung",
  };

  const POPULAR_BANK_IDS = [
    "vcb",
    "bidv",
    "icb",
    "mb",
    "tcb",
    "vpb",
    "acb",
    "ocb",
    "tpb",
    "vba",
    "vib-2",
    "lpb",
    "shb",
    "hdb",
    "cake",
    "seab",
    "scb",
    "eib",
    "timo",
    "shbvn",
  ];

  const fallbackBanks = [
    {
      appId: "vcb",
      appName: "Vietcombank",
      bankName: "Ngân hàng TMCP Ngoại Thương Việt Nam",
      deeplink: "https://dl.vietqr.io/pay?app=vcb",
      appLogo: "",
    },
    {
      appId: "bidv",
      appName: "BIDV SmartBanking",
      bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      deeplink: "https://dl.vietqr.io/pay?app=bidv",
      appLogo: "",
    },
    {
      appId: "icb",
      appName: "VietinBank iPay",
      bankName: "Ngân hàng TMCP Công thương Việt Nam",
      deeplink: "https://dl.vietqr.io/pay?app=icb",
      appLogo: "",
    },
    {
      appId: "mb",
      appName: "MB Bank",
      bankName: "Ngân hàng TMCP Quân đội",
      deeplink: "https://dl.vietqr.io/pay?app=mb",
      appLogo: "",
    },
    {
      appId: "tcb",
      appName: "Techcombank Mobile",
      bankName: "Ngân hàng TMCP Kỹ Thương Việt Nam",
      deeplink: "https://dl.vietqr.io/pay?app=tcb",
      appLogo: "",
    },
    {
      appId: "vpb",
      appName: "VPBank NEO",
      bankName: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
      deeplink: "https://dl.vietqr.io/pay?app=vpb",
      appLogo: "",
    },
    {
      appId: "acb",
      appName: "ACB One",
      bankName: "Ngân hàng TMCP Á Châu",
      deeplink: "https://dl.vietqr.io/pay?app=acb",
      appLogo: "",
    },
    {
      appId: "ocb",
      appName: "OCB OMNI",
      bankName: "Ngân hàng TMCP Phương Đông",
      deeplink: "https://dl.vietqr.io/pay?app=ocb",
      appLogo: "",
    },
    {
      appId: "tpb",
      appName: "TPBank Mobile",
      bankName: "Ngân hàng TMCP Tiên Phong",
      deeplink: "https://dl.vietqr.io/pay?app=tpb",
      appLogo: "",
    },
    {
      appId: "vba",
      appName: "Agribank E-Mobile Banking",
      bankName: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
      deeplink: "https://dl.vietqr.io/pay?app=vba",
      appLogo: "",
    },
    {
      appId: "vib-2",
      appName: "MyVIB 2.0",
      bankName: "Ngân hàng TMCP Quốc tế Việt Nam",
      deeplink: "https://dl.vietqr.io/pay?app=vib-2",
      appLogo: "",
    },
    {
      appId: "lpb",
      appName: "LienViet24h",
      bankName: "Ngân hàng TMCP Bưu điện Liên Việt",
      deeplink: "https://dl.vietqr.io/pay?app=lpb",
      appLogo: "",
    },
    {
      appId: "shb",
      appName: "SHB Mobile Banking",
      bankName: "Ngân hàng TMCP Sài Gòn - Hà Nội",
      deeplink: "https://dl.vietqr.io/pay?app=shb",
      appLogo: "",
    },
    {
      appId: "hdb",
      appName: "HDBank",
      bankName: "Ngân hàng TMCP Phát triển TP.HCM",
      deeplink: "https://dl.vietqr.io/pay?app=hdb",
      appLogo: "",
    },
    {
      appId: "cake",
      appName: "CAKE by VPBank",
      bankName: "Ngân hàng số CAKE by VPBank",
      deeplink: "https://dl.vietqr.io/pay?app=cake",
      appLogo: "",
    },
    {
      appId: "seab",
      appName: "SeAMobile",
      bankName: "Ngân hàng TMCP Đông Nam Á",
      deeplink: "https://dl.vietqr.io/pay?app=seab",
      appLogo: "",
    },
    {
      appId: "scb",
      appName: "SCB Mobile Banking",
      bankName: "Ngân hàng TMCP Sài Gòn",
      deeplink: "https://dl.vietqr.io/pay?app=scb",
      appLogo: "",
    },
    {
      appId: "eib",
      appName: "Eximbank Mobile Banking",
      bankName: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam",
      deeplink: "https://dl.vietqr.io/pay?app=eib",
      appLogo: "",
    },
    {
      appId: "timo",
      appName: "Timo Digital Bank",
      bankName: "Ngân hàng TMCP Bản Việt (Timo)",
      deeplink: "https://dl.vietqr.io/pay?app=timo",
      appLogo: "",
    },
    {
      appId: "shbvn",
      appName: "Shinhan Bank SOL",
      bankName: "Ngân hàng TNHH MTV Shinhan Việt Nam",
      deeplink: "https://dl.vietqr.io/pay?app=shbvn",
      appLogo: "",
    },
  ];

  const fallbackBankMap = new Map(
    fallbackBanks.map((bank) => [bank.appId, bank])
  );

  let bankData = [...fallbackBanks];

  function normalizeText(value) {
    return value
      ? value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";
  }

  function buildDeeplink(base) {
    try {
      const url = new URL(base);
      url.searchParams.set("ba", ACCOUNT_INFO.ba);
      url.searchParams.set("tn", ACCOUNT_INFO.tn);
      return url.toString();
    } catch (error) {
      return base;
    }
  }

  function renderList(items) {
    listEl.innerHTML = "";

    if (!items.length) {
      statusEl.textContent = "Không tìm thấy ngân hàng phù hợp.";
      return;
    }

    statusEl.textContent = "";

    items.forEach((bank) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bank-item";
      button.setAttribute("role", "listitem");

      const fallbackSource = bank.appName || bank.bankName || bank.appId;
      const fallbackText =
        fallbackSource
          .split(/\s+/)
          .filter((word) => word && /[a-zA-Z0-9]/.test(word))
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || bank.appId.slice(0, 2).toUpperCase();

      const logoMarkup = bank.appLogo
        ? `<img src="${bank.appLogo}" alt="${bank.bankName}" loading="lazy" />`
        : `<div class="bank-logo-fallback">${fallbackText}</div>`;

      button.innerHTML = `
        ${logoMarkup}
        <div class="bank-item-text">
          <span class="bank-name">${bank.appName}</span>
          <span class="bank-desc">${bank.bankName}</span>
        </div>
      `;

      button.addEventListener("click", () => {
        const url = buildDeeplink(bank.deeplink);
        closeModal();
        window.location.href = url;
      });

      listEl.appendChild(button);
    });
  }

  function filterBanks(term) {
    const normalized = normalizeText(term.trim());
    if (!normalized) {
      renderList(bankData);
      return;
    }

    const filtered = bankData.filter((bank) => {
      const appName = normalizeText(bank.appName);
      const bankName = normalizeText(bank.bankName);
      const appId = normalizeText(bank.appId);

      return (
        appName.includes(normalized) ||
        bankName.includes(normalized) ||
        appId.includes(normalized)
      );
    });

    renderList(filtered);
  }

  function openModal() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput.focus({ preventScroll: true }), 100);
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    qrTrigger.focus();
  }

  qrTrigger.addEventListener("click", openModal);
  qrTrigger.addEventListener("keypress", (event) => {
    if (["Enter", " ", "Space", "Spacebar"].includes(event.key)) {
      event.preventDefault();
      openModal();
    }
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  searchInput.addEventListener("input", (event) => {
    filterBanks(event.target.value);
  });

  renderList(bankData);

  fetch("https://api.vietqr.io/v2/android-app-deeplinks")
    .then((response) => response.json())
    .then((data) => {
      if (!data || !Array.isArray(data.apps)) {
        renderList(bankData);
        return;
      }

      const mapped = data.apps.reduce((acc, app) => {
        if (POPULAR_BANK_IDS.includes(app.appId)) {
          acc.set(app.appId, {
            appId: app.appId,
            appName: app.appName,
            bankName: app.bankName,
            deeplink: app.deeplink,
            appLogo: app.appLogo,
          });
        }
        return acc;
      }, new Map());

      if (mapped.size) {
        // Keep order as POPULAR_BANK_IDS while falling back when API misses entries
        bankData = POPULAR_BANK_IDS.map((id) => {
          const fallbackEntry = fallbackBankMap.get(id);
          const remoteEntry = mapped.get(id);

          if (fallbackEntry && remoteEntry) {
            return { ...fallbackEntry, ...remoteEntry };
          }

          return remoteEntry || fallbackEntry;
        }).filter(Boolean);

        renderList(bankData);
      }
    })
    .catch(() => {
      renderList(bankData);
    });
}

// Lazy Loading for Images
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Video hover effects
document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".gallery-item video");

  videos.forEach((video) => {
    video.addEventListener("mouseenter", function () {
      this.play();
    });

    video.addEventListener("mouseleave", function () {
      this.pause();
      this.currentTime = 0;
    });
  });
});

// Performance optimizations
let ticking = false;

function updateScrollEffects() {
  // Add any scroll-based animations here
  ticking = false;
}

window.addEventListener("scroll", function () {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
});

// Add some fun easter eggs
let clickCount = 0;
document.querySelector(".hero-avatar").addEventListener("click", function () {
  clickCount++;
  if (clickCount === 5) {
    this.style.animation = "spin 2s linear";
    setTimeout(() => {
      this.style.animation = "pulse 2s ease-in-out infinite";
      clickCount = 0;
    }, 2000);
  }
});

// Preload critical images
function preloadImages() {
  const criticalImages = ["avatar/avt.png", "ki_niem/selfphytaidinhdoclap.jpg"];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize preloading
preloadImages();
