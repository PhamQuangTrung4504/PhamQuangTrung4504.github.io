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
  initGalleryModal();
  initLightbox();
  initGalleryButtonActions();
  initSkillBars();
  initSmoothScrolling();
  initScrollToTop();
  initBankSelector();
  initLazyLoading();
  initVideoHoverEffects();
  initAvatarEasterEgg();
  preloadImages();
});

// Loading Screen - Optimized for faster loading
function initLoader() {
  window.addEventListener("load", function () {
    // Giảm từ 1000ms xuống 300ms để tăng tốc
    setTimeout(() => {
      const loader = document.getElementById("loader");
      loader.classList.add("hidden");
      setTimeout(() => {
        loader.style.display = "none";
      }, 300); // Giảm từ 500ms xuống 300ms
    }, 300);
  });
}

// Navbar Scroll Effect
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");

  if (!navbar || !mobileMenu || !navLinks) {
    return;
  }

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
  if (!typedElement) {
    return;
  }

  const texts = [
    "Đam mê công nghệ",
    "Vui vẻ và thân thiện",
    "Thích chơi game",
    "Thích khám phá thứ mới mẻ",
    "Yêu thích sự sáng tạo",
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
    ".fade-in, .slide-in-left, .slide-in-right",
  );
  animatedElements.forEach((el) => observer.observe(el));
}

// Gallery Filter
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const MAX_VISIBLE_ITEMS = 9;

  // Function to show/hide items based on filter and limit
  const applyFilter = (filterValue) => {
    let visibleCount = 0;
    let totalMatched = 0;

    galleryItems.forEach((item) => {
      const categories = item.getAttribute("data-category");
      let shouldShow = false;

      if (categories && categories.includes(filterValue)) {
        shouldShow = true;
        totalMatched++;
      }

      if (shouldShow && visibleCount < MAX_VISIBLE_ITEMS) {
        item.classList.remove("hidden");
        item.style.display = "block";
        visibleCount++;
      } else {
        item.style.display = "none";
        item.classList.add("hidden");
      }
    });

    // Show/hide "Xem thêm" button based on total items
    const viewMoreBtn = document.getElementById("viewMoreGallery");
    if (viewMoreBtn) {
      if (totalMatched > MAX_VISIBLE_ITEMS) {
        viewMoreBtn.style.display = "inline-flex";
      } else {
        viewMoreBtn.style.display = "none";
      }
    }
  };

  // Initialize: show first 9 photos
  applyFilter("photos");

  // Filter button click handlers
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");
      applyFilter(filterValue);
    });
  });

  // "Xem thêm" button handler
  const viewMoreBtn = document.getElementById("viewMoreGallery");
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", function () {
      openGalleryModal();
    });
  }
}

// Gallery Modal Functions
function openGalleryModal() {
  const modal = document.getElementById("galleryModal");
  const modalGrid = document.getElementById("galleryModalGrid");
  const allItems = document.querySelectorAll(".gallery-item");

  // Clear previous content
  modalGrid.innerHTML = "";

  // Clone all gallery items to modal
  allItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.style.display = "block";
    clone.classList.remove("hidden");

    // Add click handler to open lightbox
    clone.addEventListener("click", function (e) {
      // Don't trigger if clicking on the gallery button
      if (e.target.closest(".gallery-btn")) {
        return;
      }

      const img = clone.querySelector("img");
      const video = clone.querySelector("video");
      const title =
        clone.querySelector(".gallery-info h4")?.textContent ||
        "Không có tiêu đề";
      const description =
        clone.querySelector(".gallery-info p")?.textContent || "Không có mô tả";

      // Close gallery modal first
      closeGalleryModal();

      // Then open lightbox
      if (img) {
        openLightbox(img.src, "image", title, description);
      } else if (video) {
        openLightbox(video.src, "video", title, description);
      }
    });

    modalGrid.appendChild(clone);
  });

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Initialize modal scroll position
  modalGrid.scrollTop = 0;
}

function closeGalleryModal() {
  const modal = document.getElementById("galleryModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function initGalleryModal() {
  const modal = document.getElementById("galleryModal");
  const closeBtn = document.getElementById("galleryModalClose");

  if (!modal) {
    return;
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", closeGalleryModal);
  }

  // Click outside to close
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeGalleryModal();
    }
  });

  // ESC key to close
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeGalleryModal();
    }
  });
}

// Lightbox
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  if (!lightbox || !lightboxClose || !lightboxPrev || !lightboxNext) {
    return;
  }

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
  if (!currentItem) {
    return;
  }

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
  if (!lightbox) {
    return;
  }

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
    { threshold: 0.5 },
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
  if (!scrollTopBtn) {
    return;
  }

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

  if (!qrTrigger) {
    return;
  }

  /**
   * ========================================================================
   * HÀM HIỂN THỊ THÔNG BÁO TỰ ĐỊNH NGHĨA (THAY THẾ alert/confirm)
   * ========================================================================
   * Tạo một modal thông báo đẹp với CSS tùy chỉnh thay vì dùng alert/confirm
   *
   * @param {string} title - Tiêu đề thông báo
   * @param {string} message - Nội dung thông báo
   * @param {string} type - Loại thông báo: 'info', 'warning', 'error', 'success'
   * @param {Array} buttons - Mảng các nút bấm {text, primary, callback}
   */
  function showNotification(title, message, type = "info", buttons = null) {
    // Xóa notification cũ nếu có
    const oldNotification = document.getElementById("custom-notification");
    if (oldNotification) {
      oldNotification.remove();
    }

    // Tạo notification overlay
    const notification = document.createElement("div");
    notification.id = "custom-notification";
    notification.className = `custom-notification ${type}`;
    notification.setAttribute("role", "dialog");
    notification.setAttribute("aria-modal", "true");
    notification.setAttribute("aria-labelledby", "notification-title");

    // Icon theo loại thông báo
    const icons = {
      info: '<i class="fas fa-info-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      error: '<i class="fas fa-times-circle"></i>',
      success: '<i class="fas fa-check-circle"></i>',
    };

    // Tạo nút bấm
    let buttonsHTML = "";
    if (buttons && buttons.length > 0) {
      buttonsHTML = '<div class="notification-buttons">';
      buttons.forEach((btn, idx) => {
        const btnClass = btn.primary
          ? "notification-btn notification-btn-primary"
          : "notification-btn notification-btn-secondary";

        if (btn.href) {
          // Render anchor for native navigation
          buttonsHTML += `<a class="${btnClass}" data-action="${btn.text}" data-callback-index="${idx}" href="${btn.href}">${btn.text}</a>`;
        } else {
          buttonsHTML += `<button class="${btnClass}" data-action="${btn.text}" data-callback-index="${idx}">${btn.text}</button>`;
        }
      });
      buttonsHTML += "</div>";
    } else {
      // Nút đóng mặc định
      buttonsHTML =
        '<div class="notification-buttons"><button class="notification-btn notification-btn-primary" data-action="close" data-callback-index="-1">Đóng</button></div>';
    }

    notification.innerHTML = `
      <div class="notification-overlay"></div>
      <div class="notification-content">
        <div class="notification-icon ${type}">
          ${icons[type] || icons.info}
        </div>
        <h3 class="notification-title" id="notification-title">${title}</h3>
        <p class="notification-message">${message.replace(/\n/g, "<br>")}</p>
        ${buttonsHTML}
      </div>
    `;

    document.body.appendChild(notification);

    // Ngăn scroll khi notification hiển thị
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Hiện notification với animation
    setTimeout(() => {
      notification.classList.add("active");
    }, 10);

    // Xử lý sự kiện click
    const closeNotification = () => {
      notification.classList.remove("active");
      // Khôi phục overflow
      document.body.style.overflow = originalOverflow;
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    };

    // Click overlay để đóng
    const overlay = notification.querySelector(".notification-overlay");
    overlay.addEventListener("click", closeNotification);

    // Click nút / anchor
    const btnElements = notification.querySelectorAll(".notification-btn");
    btnElements.forEach((el) => {
      const idx = parseInt(el.getAttribute("data-callback-index"), 10);
      if (el.tagName.toLowerCase() === "a") {
        el.addEventListener("click", (e) => {
          if (buttons && buttons[idx] && buttons[idx].callback) {
            try {
              buttons[idx].callback();
            } catch (err) {
              console.warn("Callback error:", err);
            }
          }
        });
      } else {
        el.addEventListener("click", () => {
          if (buttons && buttons[idx] && buttons[idx].callback) {
            try {
              buttons[idx].callback();
            } catch (err) {
              console.warn("Callback error:", err);
            }
          }
          closeNotification();
        });
      }
    });

    // ESC để đóng
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeNotification();
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);
  }

  // Copy account number to clipboard and show notification
  const copyAccountNumber = () => {
    const accountNumber = "45404052004";

    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(accountNumber)
        .then(() => {
          showNotification(
            "Đã copy số tài khoản",
            `Số tài khoản ${accountNumber} đã được sao chép vào clipboard.\n\nBạn có thể dán vào ứng dụng ngân hàng để chuyển khoản.`,
            "success",
          );
        })
        .catch(() => {
          // Fallback for clipboard error
          showNotification(
            "Số tài khoản",
            `STK: ${accountNumber}\n\nVui lòng sao chép số tài khoản này để chuyển khoản.`,
            "info",
          );
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = accountNumber;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        textArea.remove();
        showNotification(
          "Đã copy số tài khoản",
          `Số tài khoản ${accountNumber} đã được sao chép vào clipboard.\n\nBạn có thể dán vào ứng dụng ngân hàng để chuyển khoản.`,
          "success",
        );
      } catch (err) {
        textArea.remove();
        showNotification(
          "Số tài khoản",
          `STK: ${accountNumber}\n\nVui lòng sao chép số tài khoản này để chuyển khoản.`,
          "info",
        );
      }
    }
  };

  qrTrigger.addEventListener("click", copyAccountNumber);
  qrTrigger.addEventListener("keypress", (event) => {
    if (["Enter", " ", "Space", "Spacebar"].includes(event.key)) {
      event.preventDefault();
      copyAccountNumber();
    }
  });
}

function initGalleryButtonActions() {
  const galleryButtons = document.querySelectorAll(".gallery-btn");
  if (galleryButtons.length === 0) {
    return;
  }

  galleryButtons.forEach((button) => {
    if (button.hasAttribute("onclick")) {
      button.removeAttribute("onclick");
    }
  });

  document.addEventListener("click", function (event) {
    const button = event.target.closest(".gallery-btn");
    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const item = button.closest(".gallery-item");
    if (!item) {
      return;
    }

    const img = item.querySelector("img");
    const video = item.querySelector("video");
    const title =
      item.querySelector(".gallery-info h4")?.textContent || "Không có tiêu đề";
    const description =
      item.querySelector(".gallery-info p")?.textContent || "Không có mô tả";

    if (img) {
      openLightbox(img.src, "image", title, description);
    } else if (video) {
      openLightbox(video.src, "video", title, description);
    }
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

function initVideoHoverEffects() {
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
}

// Performance optimizations - Throttled scroll handler
let ticking = false;

function updateScrollEffects() {
  // Add any scroll-based animations here
  ticking = false;
}

window.addEventListener(
  "scroll",
  function () {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true },
); // Passive listener để tăng performance

function initAvatarEasterEgg() {
  const heroAvatar = document.querySelector(".hero-avatar");
  if (!heroAvatar) {
    return;
  }

  let clickCount = 0;
  heroAvatar.addEventListener("click", function () {
    clickCount++;
    if (clickCount === 5) {
      this.style.animation = "spin 2s linear";
      setTimeout(() => {
        this.style.animation = "pulse 2s ease-in-out infinite";
        clickCount = 0;
      }, 2000);
    }
  });
}

// Preload critical images
function preloadImages() {
  const criticalImages = ["avatar/avt.png", "ki_niem/selfphytaidinhdoclap.jpg"];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}
