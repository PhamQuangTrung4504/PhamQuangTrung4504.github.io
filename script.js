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

// QR Payment - Open Banking App
document.addEventListener("DOMContentLoaded", function () {
  const qrPayment = document.getElementById("qr-payment");
  const qrImage = document.getElementById("qr-image");
  const btnOpenBanking = document.getElementById("btn-open-banking");

  // Thông tin thanh toán
  const bankInfo = {
    bank: "970423", // Mã ngân hàng TPBank
    bankName: "TPBank",
    accountNo: "45404052004",
    accountName: "PHAM QUANG TRUNG",
  };

  // Tạo VietQR URL động
  const vietQRUrl = `https://img.vietqr.io/image/${bankInfo.bank}-${
    bankInfo.accountNo
  }-compact2.jpg?accountName=${encodeURIComponent(bankInfo.accountName)}`;

  // Phát hiện thiết bị
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Hàm mở QR code trong cửa sổ mới
  function openQRCode() {
    const link = document.createElement("a");
    link.href = vietQRUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Hàm hướng dẫn mở app banking
  function tryOpenBankingApp(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Visual feedback
    if (btnOpenBanking) {
      btnOpenBanking.style.transform = "scale(0.95)";
      setTimeout(() => {
        btnOpenBanking.style.transform = "scale(1)";
      }, 200);
    }

    if (isMobile) {
      // Hiển thị hướng dẫn chi tiết cho mobile
      const message = isIOS
        ? `📱 HƯỚNG DẪN THANH TOÁN:\n\n1️⃣ Nhấn OK để xem QR code\n2️⃣ Chụp màn hình (Screenshot)\n3️⃣ Mở app TPBank/Banking của bạn\n4️⃣ Chọn "Quét QR" hoặc "Chuyển tiền"\n5️⃣ Chọn quét từ thư viện ảnh\n6️⃣ Chọn ảnh QR vừa chụp\n\n💡 Thông tin:\n- Bank: ${bankInfo.bankName}\n- STK: ${bankInfo.accountNo}\n- Tên: ${bankInfo.accountName}`
        : `📱 HƯỚNG DẪN THANH TOÁN:\n\n1️⃣ Nhấn OK để xem QR code\n2️⃣ Chụp màn hình hoặc lưu ảnh\n3️⃣ Mở app ngân hàng của bạn\n4️⃣ Quét QR từ thư viện ảnh\n\n💡 Hoặc nhập thủ công:\n- Bank: ${bankInfo.bankName}\n- STK: ${bankInfo.accountNo}\n- Tên: ${bankInfo.accountName}`;

      if (confirm(message)) {
        openQRCode();
      }
    } else {
      // Desktop: Hiển thị hướng dẫn và mở QR
      alert(
        `💳 Quét QR code bằng app ngân hàng trên điện thoại\n\nHoặc chuyển khoản thủ công:\n- Ngân hàng: ${bankInfo.bankName}\n- STK: ${bankInfo.accountNo}\n- Chủ TK: ${bankInfo.accountName}`
      );
      openQRCode();
    }
  }

  // Xử lý click vào QR container (chỉ khi click vào ảnh hoặc vùng trống)
  if (qrPayment) {
    qrPayment.addEventListener("click", function (e) {
      // Nếu click vào nút, không xử lý
      if (e.target.closest("#btn-open-banking")) {
        return;
      }

      // Click vào bất kỳ chỗ nào khác: mở QR lớn
      e.preventDefault();
      openQRCode();
    });

    // Thêm hover effect cho desktop
    if (!isMobile) {
      qrPayment.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      qrPayment.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.02)";
        this.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
      });

      qrPayment.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)";
        this.style.boxShadow = "";
      });
    }
  }

  // Xử lý click vào nút "Mở App Ngân Hàng"
  if (btnOpenBanking) {
    btnOpenBanking.addEventListener("click", tryOpenBankingApp);
  }
});
