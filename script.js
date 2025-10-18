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

  // Debug mode - set to false in production to disable console logs
  const DEBUG_MODE = false;
  const debugLog = DEBUG_MODE ? console.log.bind(console) : () => {};
  const debugWarn = DEBUG_MODE ? console.warn.bind(console) : () => {};

  const ACCOUNT_INFO = {
    ba: "45404052004@TPB",
    tn: "Ung ho Pham Quang Trung",
  };

  // Link tải app từ Store (iOS và Android) - Cập nhật đầy đủ 2025
  const APP_STORE_LINKS = {
    vcb: {
      ios: "https://apps.apple.com/vn/app/vcb-dinh/id561433133",
      android: "https://play.google.com/store/apps/details?id=com.VCB",
    },
    bidv: {
      ios: "https://apps.apple.com/vn/app/bidv-smartbanking/id1061867449",
      android: "https://play.google.com/store/apps/details?id=com.vnpay.bidv",
    },
    icb: {
      ios: "https://apps.apple.com/vn/app/vietinbank-ipay/id689963454",
      android:
        "https://play.google.com/store/apps/details?id=com.vietinbank.ipay",
    },
    mb: {
      ios: "https://apps.apple.com/vn/app/mb-bank/id1205807363",
      android: "https://play.google.com/store/apps/details?id=com.mbmobile",
    },
    tcb: {
      ios: "https://apps.apple.com/vn/app/techcombank-mobile/id1548623362",
      android:
        "https://play.google.com/store/apps/details?id=vn.com.techcombank.bb.app",
    },
    vpb: {
      ios: "https://apps.apple.com/vn/app/vpbank-neo/id1209349510",
      android:
        "https://play.google.com/store/apps/details?id=com.vnpay.vpbankonline",
    },
    acb: {
      ios: "https://apps.apple.com/vn/app/acb-one/id950141024",
      android:
        "https://play.google.com/store/apps/details?id=mobile.acb.com.vn",
    },
    ocb: {
      ios: "https://apps.apple.com/vn/app/ocb-omni/id6472261202",
      android: "https://play.google.com/store/apps/details?id=vn.com.ocb.awe",
    },
    tpb: {
      ios: "https://apps.apple.com/vn/app/tpbank-mobile/id450464147",
      android:
        "https://play.google.com/store/apps/details?id=com.tpb.mb.gprsandroid",
    },
    vba: {
      ios: "https://apps.apple.com/vn/app/agribank-plus/id935944952",
      android:
        "https://play.google.com/store/apps/details?id=com.vnpay.Agribank3g",
    },
    vib: {
      ios: "https://apps.apple.com/vn/app/myvib/id1626624790",
      android: "https://play.google.com/store/apps/details?id=com.vib.myvib2",
    },
    lpb: {
      ios: "https://apps.apple.com/vn/app/lpbank/id1488794748",
      android:
        "https://play.google.com/store/apps/details?id=vn.com.lpb.lienviet24h",
    },
    shb: {
      ios: "https://apps.apple.com/vn/app/shb-mobile/id538278798",
      android: "https://play.google.com/store/apps/details?id=vn.shb.mbanking",
    },
    hdb: {
      ios: "https://apps.apple.com/vn/app/hdbank/id1461658565",
      android: "https://play.google.com/store/apps/details?id=com.vnpay.hdbank",
    },
    cake: {
      ios: "https://apps.apple.com/vn/app/cake-ng%C3%A2n-h%C3%A0ng-s%E1%BB%91/id1551907051",
      android: "https://play.google.com/store/apps/details?id=xyz.be.cake",
    },
    seab: {
      ios: "https://apps.apple.com/vn/app/seamobile/id846407152",
      android:
        "https://play.google.com/store/apps/details?id=vn.com.seabank.mb1",
    },
    scb: {
      ios: "https://apps.apple.com/vn/app/scb-mobile-banking/id954973621",
      android: "https://play.google.com/store/apps/details?id=com.vnpay.SCB",
    },
    eib: {
      ios: "https://apps.apple.com/vn/app/eximbank-edigi/id1571427361",
      android:
        "https://play.google.com/store/apps/details?id=com.vnpay.EximBankOmni",
    },
    timo: {
      ios: "https://apps.apple.com/vn/app/timo-ng%C3%A2n-h%C3%A0ng-s%E1%BB%91-by-bvbank/id1521230347",
      android:
        "https://play.google.com/store/apps/details?id=io.lifestyle.plus",
    },
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
    "vib",
    "lpb",
    "shb",
    "hdb",
    "cake",
    "seab",
    "scb",
    "eib",
    "timo",
  ];

  // Danh sách ngân hàng với deep link scheme chính thức (cập nhật 2025)
  const fallbackBanks = [
    {
      appId: "vcb",
      appName: "Vietcombank",
      bankName: "Ngân hàng TMCP Ngoại Thương Việt Nam",
      deeplink: "vcbdigibank://", // Deep link chính thức của Vietcombank
      vietqrLink: "https://dl.vietqr.io/pay?app=vcb",
      appLogo: "",
    },
    {
      appId: "bidv",
      appName: "BIDV SmartBanking",
      bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      deeplink: "bidvsmartbanking://", // Deep link chính thức của BIDV
      vietqrLink: "https://dl.vietqr.io/pay?app=bidv",
      appLogo: "",
    },
    {
      appId: "icb",
      appName: "VietinBank iPay",
      bankName: "Ngân hàng TMCP Công thương Việt Nam",
      deeplink: "vietinbank://", // Deep link chính thức của VietinBank
      vietqrLink: "https://dl.vietqr.io/pay?app=icb",
      appLogo: "",
    },
    {
      appId: "mb",
      appName: "MB Bank",
      bankName: "Ngân hàng TMCP Quân đội",
      deeplink: "mbbank://", // Deep link chính thức của MB Bank
      vietqrLink: "https://dl.vietqr.io/pay?app=mb",
      appLogo: "",
    },
    {
      appId: "tcb",
      appName: "Techcombank Mobile",
      bankName: "Ngân hàng TMCP Kỹ Thương Việt Nam",
      deeplink: "techcombank://", // Deep link chính thức của Techcombank
      vietqrLink: "https://dl.vietqr.io/pay?app=tcb",
      appLogo: "",
    },
    {
      appId: "vpb",
      appName: "VPBank NEO",
      bankName: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
      deeplink: "vpbank://", // Deep link chính thức của VPBank
      vietqrLink: "https://dl.vietqr.io/pay?app=vpb",
      appLogo: "",
    },
    {
      appId: "acb",
      appName: "ACB One",
      bankName: "Ngân hàng TMCP Á Châu",
      deeplink: "acbmobilebanking://", // Deep link chính thức của ACB
      vietqrLink: "https://dl.vietqr.io/pay?app=acb",
      appLogo: "",
    },
    {
      appId: "ocb",
      appName: "OCB OMNI",
      bankName: "Ngân hàng TMCP Phương Đông",
      deeplink: "ocb_omni://", // Deep link chính thức của OCB
      vietqrLink: "https://dl.vietqr.io/pay?app=ocb",
      appLogo: "",
    },
    {
      appId: "tpb",
      appName: "TPBank Mobile",
      bankName: "Ngân hàng TMCP Tiên Phong",
      deeplink: "tpbank://", // Deep link chính thức của TPBank
      vietqrLink: "https://dl.vietqr.io/pay?app=tpb",
      appLogo: "",
    },
    {
      appId: "vba",
      appName: "Agribank E-Mobile Banking",
      bankName: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
      deeplink: "agribank://", // Deep link chính thức của Agribank
      vietqrLink: "https://dl.vietqr.io/pay?app=vba",
      appLogo: "",
    },
    {
      appId: "vib",
      appName: "MyVIB",
      bankName: "Ngân hàng TMCP Quốc tế Việt Nam",
      deeplink: "myvib://", // Deep link chính thức của VIB
      vietqrLink: "https://dl.vietqr.io/pay?app=vib",
      appLogo: "",
    },
    {
      appId: "lpb",
      appName: "LienViet24h",
      bankName: "Ngân hàng TMCP Bưu điện Liên Việt",
      deeplink: "lpbank://", // Deep link chính thức của LienVietPostBank
      vietqrLink: "https://dl.vietqr.io/pay?app=lpb",
      appLogo: "",
    },
    {
      appId: "shb",
      appName: "SHB Mobile Banking",
      bankName: "Ngân hàng TMCP Sài Gòn - Hà Nội",
      deeplink: "shbmobile://", // Deep link chính thức của SHB
      vietqrLink: "https://dl.vietqr.io/pay?app=shb",
      appLogo: "",
    },
    {
      appId: "hdb",
      appName: "HDBank",
      bankName: "Ngân hàng TMCP Phát triển TP.HCM",
      deeplink: "hdbank://", // Deep link chính thức của HDBank
      vietqrLink: "https://dl.vietqr.io/pay?app=hdb",
      appLogo: "",
    },
    {
      appId: "cake",
      appName: "CAKE by VPBank",
      bankName: "Ngân hàng số CAKE by VPBank",
      deeplink: "cake://", // Deep link chính thức của CAKE
      vietqrLink: "https://dl.vietqr.io/pay?app=cake",
      appLogo: "",
    },
    {
      appId: "seab",
      appName: "SeAMobile",
      bankName: "Ngân hàng TMCP Đông Nam Á",
      deeplink: "seabank://", // Deep link chính thức của SeABank
      vietqrLink: "https://dl.vietqr.io/pay?app=seab",
      appLogo: "",
    },
    {
      appId: "scb",
      appName: "SCB Mobile Banking",
      bankName: "Ngân hàng TMCP Sài Gòn",
      deeplink: "scbmobilebanking://", // Deep link chính thức của SCB
      vietqrLink: "https://dl.vietqr.io/pay?app=scb",
      appLogo: "",
    },
    {
      appId: "eib",
      appName: "Eximbank Mobile Banking",
      bankName: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam",
      deeplink: "eximbank://", // Deep link chính thức của Eximbank
      vietqrLink: "https://dl.vietqr.io/pay?app=eib",
      appLogo: "",
    },
    {
      appId: "timo",
      appName: "Timo Digital Bank",
      bankName: "Ngân hàng TMCP Bản Việt (Timo)",
      deeplink: "timo://", // Deep link chính thức của Timo
      vietqrLink: "https://dl.vietqr.io/pay?app=timo",
      appLogo: "",
    },
  ];

  const root = document.documentElement;
  const viewport = window.visualViewport;

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
      const result = url.toString();
      debugLog(`Built deeplink: ${result}`);
      return result;
    } catch (error) {
      debugWarn(`Failed to build deeplink from ${base}:`, error);
      // Fallback: thêm params thủ công nếu URL constructor lỗi
      const separator = base.includes("?") ? "&" : "?";
      return `${base}${separator}ba=${encodeURIComponent(
        ACCOUNT_INFO.ba
      )}&tn=${encodeURIComponent(ACCOUNT_INFO.tn)}`;
    }
  }

  // Detect thiết bị để lấy link store phù hợp
  function getStoreLink(appId) {
    const storeLinks = APP_STORE_LINKS[appId];
    if (!storeLinks) {
      debugWarn(`No store links found for bank: ${appId}`);
      return null;
    }

    // Detect iOS
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    // Detect Android
    const isAndroid = /Android/i.test(navigator.userAgent);

    // Validate links exist
    if (isIOS && storeLinks.ios) {
      return storeLinks.ios;
    } else if (isAndroid && storeLinks.android) {
      return storeLinks.android;
    }

    // Fallback: ưu tiên Android nếu có, không thì iOS
    if (storeLinks.android) {
      return storeLinks.android;
    } else if (storeLinks.ios) {
      return storeLinks.ios;
    }

    return null;
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
      buttons.forEach((btn) => {
        const btnClass = btn.primary
          ? "notification-btn notification-btn-primary"
          : "notification-btn notification-btn-secondary";
        buttonsHTML += `<button class="${btnClass}" data-action="${btn.text}">${btn.text}</button>`;
      });
      buttonsHTML += "</div>";
    } else {
      // Nút đóng mặc định
      buttonsHTML =
        '<div class="notification-buttons"><button class="notification-btn notification-btn-primary" data-action="close">Đóng</button></div>';
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

    // Click nút
    const btnElements = notification.querySelectorAll(".notification-btn");
    btnElements.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        if (buttons && buttons[index] && buttons[index].callback) {
          buttons[index].callback();
        }
        closeNotification();
      });
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

  /**
   * ========================================================================
   * GIẢI PHÁP MỞ APP NGÂN HÀNG - HỖ TRỢ ĐẦY ĐỦ iOS SAFARI VÀ TẤT CẢ NỀN TẢNG
   * ========================================================================
   *
   * VẤN ĐỀ ĐÃ ĐƯỢC GIẢI QUYẾT:
   * - iOS Safari: Deep link gây lỗi "Địa chỉ không hợp lệ" khi app chưa cài
   * - iOS các trình duyệt: Không detect được khi app đã mở thành công
   * - WebView (Zalo, Facebook, TikTok): Bị chặn deep link
   * - Android: Timeout không phù hợp
   * - Desktop: Hiện thông báo chỉ hỗ trợ thiết bị di động
   *
   * GIẢI PHÁP:
   * 1. Dùng deep link scheme chính thức của từng ngân hàng (vcbdigibank://, tpbank://, v.v.)
   * 2. Phát hiện chính xác nền tảng (iOS, Android, WebView, Desktop)
   * 3. iOS: KẾT HỢP iframe ẩn + window.location.href để detect tốt nhất
   *    - Iframe: Tránh lỗi hiển thị
   *    - window.location.href: Trigger visibilitychange events
   * 4. Android: Dùng thẻ <a> ẩn với click()
   * 5. Multi-layer detection: Kiểm tra ngay (200ms) + timeout chính (1.2s)
   * 6. Detect xem app đã mở thành công qua visibilitychange/blur/pagehide
   * 7. Desktop: Hiện thông báo tùy chỉnh thay vì lỗi JSON
   *
   * HỖ TRỢ:
   * - ✅ iOS Safari (iPhone/iPad) - Detect chính xác khi app mở
   * - ✅ iOS Chrome/Edge/Firefox - Detect chính xác khi app mở
   * - ✅ Android Chrome/Firefox/Samsung Internet
   * - ✅ WebView: Zalo, Facebook, TikTok, Instagram, Line
   * - ✅ Desktop: Windows, macOS, Linux (hiện thông báo)
   * ========================================================================
   */
  function openBankApp(bank) {
    debugLog(`=== Opening bank app: ${bank.appName} (${bank.appId}) ===`);

    // Xây dựng deep link với thông tin tài khoản
    const deeplinkUrl = buildDeeplink(bank.vietqrLink || bank.deeplink);
    const storeLink = getStoreLink(bank.appId);

    debugLog(`Deep link: ${deeplinkUrl}`);
    debugLog(`Store link: ${storeLink}`);

    // =====================================================================
    // BƯỚC 1: PHÁT HIỆN NỀN TẢNG VÀ TRÌNH DUYỆT CHÍNH XÁC
    // =====================================================================
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // Detect iOS
    const isIOS = /iPhone|iPad|iPod/i.test(ua) && !window.MSStream;

    // Detect Android
    const isAndroid = /Android/i.test(ua);

    // Detect Safari (iOS Safari thật, không phải Chrome iOS)
    const isSafari =
      /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua) && isIOS;

    // Detect Chrome iOS (CriOS)
    const isChromeIOS = /CriOS/i.test(ua) && isIOS;

    // Detect Firefox iOS (FxiOS)
    const isFirefoxIOS = /FxiOS/i.test(ua) && isIOS;

    // Detect Edge iOS (EdgiOS)
    const isEdgeIOS = /EdgiOS/i.test(ua) && isIOS;

    // Detect WebView (trong app Zalo, Facebook, TikTok, v.v.)
    const isWebView =
      /(WebView|wv|Version\/.+(Chrome))/i.test(ua) ||
      /FB[\w_]+\//i.test(ua) || // Facebook WebView
      /FBAN|FBAV/i.test(ua) || // Facebook App
      /(Line|Instagram|Twitter|Telegram|Zalo)/i.test(ua); // Các app khác

    // Detect mobile (iOS hoặc Android)
    const isMobile = isIOS || isAndroid;

    // Detect desktop
    const isDesktop = !isMobile;

    debugLog(`Platform: ${isIOS ? "iOS" : isAndroid ? "Android" : "Desktop"}`);
    debugLog(
      `Browser: ${
        isSafari
          ? "Safari"
          : isChromeIOS
          ? "Chrome iOS"
          : isFirefoxIOS
          ? "Firefox iOS"
          : isEdgeIOS
          ? "Edge iOS"
          : "Other"
      }`
    );
    debugLog(`WebView: ${isWebView}`);

    // =====================================================================
    // KIỂM TRA DESKTOP: HIỂN THỊ THÔNG BÁO THAY VÌ LỖI JSON
    // =====================================================================
    if (isDesktop) {
      debugLog("Desktop detected - showing mobile-only notification");
      closeModal();

      // Tạo notification modal tùy chỉnh
      showNotification(
        "Chức năng chỉ dành cho thiết bị di động",
        `Tính năng chuyển tiền nhanh qua app ngân hàng chỉ khả dụng trên điện thoại di động (iOS/Android).\n\n` +
          `Vui lòng quét mã QR bằng ứng dụng ngân hàng trên điện thoại của bạn.`,
        "info"
      );
      return;
    }

    // =====================================================================
    // BƯỚC 2: THIẾT LẬP BIẾN THEO DÕI TRẠNG THÁI
    // =====================================================================
    let appOpened = false; // App đã mở thành công?
    let cleanedUp = false; // Đã cleanup?
    let fallbackTimer = null; // Timer cho fallback
    let visibilityTimer = null; // Timer cho visibility check
    const startTime = Date.now(); // Thời điểm bắt đầu

    // =====================================================================
    // BƯỚC 3: HÀM CLEANUP (DỌN DẸP LISTENERS VÀ TIMERS)
    // =====================================================================
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;

      debugLog("Cleaning up listeners and timers");

      // Clear timers
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      if (visibilityTimer) {
        clearTimeout(visibilityTimer);
        visibilityTimer = null;
      }

      // Remove event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };

    // =====================================================================
    // BƯỚC 4: CÁC HÀM XỬ LÝ SỰ KIỆN (DETECT APP ĐÃ MỞ)
    // =====================================================================

    // Khi trang bị ẩn (chuyển sang app khác)
    const handleVisibilityChange = () => {
      if (visibilityTimer) clearTimeout(visibilityTimer);

      // Check ngay lập tức nếu page đã hidden
      if (document.hidden) {
        debugLog("Page hidden immediately - App opened successfully!");
        appOpened = true;
        cleanup();
        closeModal();
        return;
      }

      // Đợi 50ms để xác nhận visibility change là thật
      visibilityTimer = setTimeout(() => {
        if (document.hidden) {
          debugLog("Page hidden after delay - App opened successfully!");
          appOpened = true;
          cleanup();
          closeModal();
        }
      }, 50);
    };

    // Khi trang bị ẩn hoàn toàn (pagehide)
    const handlePageHide = () => {
      debugLog("Page hide - App opened successfully!");
      appOpened = true;
      cleanup();
      closeModal();
    };

    // Khi window mất focus (blur)
    const handleBlur = () => {
      if (visibilityTimer) clearTimeout(visibilityTimer);

      // Đợi 100ms để xác nhận blur là thật (giảm từ 200ms)
      visibilityTimer = setTimeout(() => {
        if (document.hidden || !document.hasFocus()) {
          debugLog("Window blurred - App opened successfully!");
          appOpened = true;
          cleanup();
          closeModal();
        }
      }, 100);
    };

    // Khi window được focus lại (có thể app không mở được)
    const handleFocus = () => {
      if (visibilityTimer) {
        clearTimeout(visibilityTimer);
        visibilityTimer = null;
      }
      debugLog("Window focused - App might not have opened");
    };

    // Đăng ký các event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // =====================================================================
    // BƯỚC 5: MỞ DEEP LINK (PHƯƠNG PHÁP TỐI ưu CHO TỪNG NỀN TẢNG)
    // =====================================================================

    /**
     * iOS Safari: KẾT HỢP IFRAME + WINDOW.LOCATION để detect app mở
     * - Iframe để tránh lỗi "Địa chỉ không hợp lệ"
     * - window.location.href để trigger visibilitychange events
     *
     * Android: window.location.href hoặc thẻ <a>
     *
     * WebView: Tùy thuộc vào app, ưu tiên iframe
     */
    function attemptOpenDeeplink() {
      try {
        debugLog("Attempting to open deep link...");

        // =================================================================
        // PHƯƠNG PHÁP 1: IFRAME + WINDOW.LOCATION (iOS - DETECT TỐT NHẤT)
        // =================================================================
        if (isIOS || isWebView) {
          debugLog("Method: Iframe + window.location (iOS/WebView)");

          // Bước 1: Tạo iframe ẩn để tránh lỗi hiển thị
          const iframe = document.createElement("iframe");
          iframe.style.cssText =
            "display:none;width:0;height:0;border:none;position:absolute;top:-1000px;left:-1000px;";
          iframe.src = deeplinkUrl;
          document.body.appendChild(iframe);

          // Bước 2: Sau 100ms, thử window.location.href để trigger events
          setTimeout(() => {
            if (!appOpened && !document.hidden) {
              debugLog("Trying window.location.href to trigger events");
              try {
                window.location.href = deeplinkUrl;
              } catch (e) {
                debugWarn("window.location.href failed:", e);
              }
            }
          }, 100);

          // Cleanup iframe sau 2 giây
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
              debugLog("Iframe removed");
            }
          }, 2000);

          return true;
        }

        // =================================================================
        // PHƯƠNG PHÁP 2: Thẻ <a> ẩn với click() (TỐT CHO ANDROID)
        // =================================================================
        if (isAndroid) {
          debugLog("Method: Hidden <a> link (Android)");
          const link = document.createElement("a");
          link.href = deeplinkUrl;
          link.style.cssText = "display:none;position:absolute;";
          document.body.appendChild(link);

          // Trigger click
          link.click();

          // Cleanup sau 100ms
          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
          }, 100);

          return true;
        }

        // =================================================================
        // PHƯƠNG PHÁP 3: window.location.href (DESKTOP/FALLBACK)
        // =================================================================
        debugLog("Method: window.location.href (Desktop/Fallback)");
        window.location.href = deeplinkUrl;
        return true;
      } catch (error) {
        debugWarn("Failed to open deep link:", error);
        return false;
      }
    }

    // Mở deep link NGAY LẬP TỨC (không setTimeout)
    // Đây là điều quan trọng nhất cho iOS Safari
    const openSuccess = attemptOpenDeeplink();

    if (!openSuccess) {
      debugWarn("Deep link failed to open");
    }

    // Kiểm tra ngay sau khi mở deeplink (cho iOS)
    setTimeout(() => {
      if (document.hidden && !appOpened) {
        debugLog("Early detection: Page hidden - App opened!");
        appOpened = true;
        cleanup();
        closeModal();
      }
    }, 200);

    // =====================================================================
    // BƯỚC 6: THIẾT LẬP TIMEOUT CHO FALLBACK (APP STORE/PLAY STORE)
    // =====================================================================

    /**
     * Timeout tùy theo nền tảng:
     * - iOS: 1200ms (1.2 giây - đủ để detect app opened)
     * - Android: 1500ms
     * - WebView: 1500ms
     */
    let timeoutDuration = 1200; // iOS mặc định 1.2 giây

    if (isAndroid) {
      timeoutDuration = 1500; // Android 1.5 giây
    } else if (isWebView) {
      timeoutDuration = 1500; // WebView 1.5 giây
    }

    debugLog(`Fallback timeout: ${timeoutDuration}ms`);

    // =====================================================================
    // BƯỚC 7: THIẾT LẬP FALLBACK TIMER
    // =====================================================================
    fallbackTimer = setTimeout(() => {
      cleanup();

      const elapsed = Date.now() - startTime;
      debugLog(`Timeout reached after ${elapsed}ms. App opened: ${appOpened}`);

      // =================================================================
      // TRƯỜNG HỢP 1: APP CHƯA MỞ (CẦN FALLBACK)
      // =================================================================
      if (!appOpened && !document.hidden) {
        debugLog("App not opened - showing fallback");
        closeModal();

        if (storeLink) {
          // Đợi modal đóng xong (300ms)
          setTimeout(() => {
            // Hiển thị thông báo tùy chỉnh với CSS đẹp
            showNotification(
              "Ứng dụng chưa được cài đặt",
              `Ứng dụng ${bank.appName} chưa được cài đặt trên thiết bị của bạn.\n\n` +
                `Bạn có muốn đi tới ${
                  isIOS ? "App Store" : "Google Play"
                } để tải ứng dụng không?`,
              "warning",
              [
                {
                  text: isIOS ? "Đi tới App Store" : "Đi tới Google Play",
                  primary: true,
                  callback: () => {
                    debugLog("User wants to download app");
                    // Mở App Store / Play Store
                    try {
                      window.location.href = storeLink;
                    } catch (error) {
                      debugWarn("Failed to open store:", error);
                      // Fallback với window.open
                      try {
                        window.open(storeLink, "_blank");
                      } catch (err) {
                        showNotification(
                          "Lỗi",
                          "Không thể mở cửa hàng ứng dụng. Vui lòng thử lại.",
                          "error"
                        );
                      }
                    }
                  },
                },
                {
                  text: "Không",
                  primary: false,
                  callback: () => {
                    debugLog("User cancelled download");
                    // User không muốn tải - mở lại modal
                    setTimeout(() => {
                      openModal();
                      if (searchInput) {
                        searchInput.focus({ preventScroll: true });
                      }
                    }, 100);
                  },
                },
              ]
            );
          }, 300);
        } else {
          // Không có store link
          debugWarn("No store link available");
          setTimeout(() => {
            openModal();
            showNotification(
              "Không tìm thấy liên kết",
              `Không tìm thấy liên kết tải ứng dụng ${bank.appName}.\n` +
                `Vui lòng thử ngân hàng khác hoặc tải app trực tiếp từ ${
                  isIOS ? "App Store" : "Google Play"
                }.`,
              "error"
            );
          }, 100);
        }
      }
      // =================================================================
      // TRƯỜNG HỢP 2: APP ĐÃ MỞ THÀNH CÔNG
      // =================================================================
      else if (appOpened) {
        debugLog("App opened successfully - closing modal");
        closeModal();
      }
      // =================================================================
      // TRƯỜNG HỢP 3: PAGE ĐÃ ẨN (APP ĐÃ MỞ)
      // =================================================================
      else if (document.hidden) {
        debugLog("Page hidden - assuming app opened");
        closeModal();
      }
    }, timeoutDuration);

    debugLog("=== Waiting for app to open or timeout... ===");
  }
  function renderList(items, isInitial = false) {
    // Nếu không phải lần đầu render, không clear innerHTML
    if (isInitial) {
      listEl.innerHTML = "";
    }

    if (!items.length) {
      statusEl.textContent = "Không tìm thấy ngân hàng phù hợp.";
      if (!isInitial) {
        // Ẩn tất cả items thay vì xóa
        const allItems = listEl.querySelectorAll(".bank-item");
        allItems.forEach((item) => (item.style.display = "none"));
      }
      return;
    }

    statusEl.textContent = "";

    if (isInitial) {
      // Lần đầu tiên: tạo tất cả items
      items.forEach((bank) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "bank-item";
        button.setAttribute("role", "listitem");
        button.setAttribute("data-app-id", bank.appId);

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
          openBankApp(bank);
        });

        listEl.appendChild(button);
      });
    } else {
      // Khi filter: chỉ ẩn/hiện items, KHÔNG tạo lại DOM
      const allItems = listEl.querySelectorAll(".bank-item");
      const visibleIds = new Set(items.map((bank) => bank.appId));

      allItems.forEach((item) => {
        const appId = item.getAttribute("data-app-id");
        item.style.display = visibleIds.has(appId) ? "" : "none";
      });
    }
  }

  function filterBanks(term) {
    const normalized = normalizeText(term.trim());
    if (!normalized) {
      // Hiện tất cả items
      const allItems = listEl.querySelectorAll(".bank-item");
      allItems.forEach((item) => (item.style.display = ""));
      statusEl.textContent = "";
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

    renderList(filtered, false);
  }

  function openModal() {
    updateViewportHeight();
    attachViewportListeners();
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.scrollTop = 0;

    // Đảm bảo danh sách hiển thị khi mở modal
    if (listEl.children.length === 0) {
      renderList(bankData, true);
    } else {
      // Hiện tất cả items nếu đã có
      const allItems = listEl.querySelectorAll(".bank-item");
      allItems.forEach((item) => (item.style.display = ""));
    }

    setTimeout(() => searchInput.focus({ preventScroll: true }), 100);
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    detachViewportListeners();
    root.style.removeProperty("--modal-viewport-height");
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

  function updateViewportHeight() {
    const height = viewport ? viewport.height : window.innerHeight;
    root.style.setProperty("--modal-viewport-height", `${height}px`);

    // Xử lý đặc biệt cho iOS Safari khi bàn phím bật
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      document.body.style.height = `${height}px`;
    }
  }

  function attachViewportListeners() {
    if (!viewport) {
      window.addEventListener("resize", updateViewportHeight);
      window.addEventListener("orientationchange", updateViewportHeight);
      return;
    }

    viewport.addEventListener("resize", updateViewportHeight);
    viewport.addEventListener("scroll", updateViewportHeight);
  }

  function detachViewportListeners() {
    if (!viewport) {
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
      document.body.style.height = "";
      return;
    }

    viewport.removeEventListener("resize", updateViewportHeight);
    viewport.removeEventListener("scroll", updateViewportHeight);
    document.body.style.height = "";
  }

  renderList(bankData, true);

  fetch("https://api.vietqr.io/v2/android-app-deeplinks")
    .then((response) => response.json())
    .then((data) => {
      if (!data || !Array.isArray(data.apps)) {
        renderList(bankData, true);
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

        renderList(bankData, true);
      }
    })
    .catch(() => {
      renderList(bankData, true);
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
  { passive: true }
); // Passive listener để tăng performance

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
