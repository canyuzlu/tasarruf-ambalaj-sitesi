/* ============================================================
   Tasarruf Ambalaj — Site Config
   Buradaki telefon / whatsapp / e-posta / adres bilgilerini
   gerçek bilgilerle değiştirin. Tüm sayfalar bu dosyayı kullanır.
   ============================================================ */
const SITE = {
  whatsappNumber: "905525977580",
  phoneDisplay: "0552 597 75 80",
  phoneHref: "+905525977580",
  email: "ahmetbecit@tasarrufambalaj.com.tr",
  addressLine1: "Veliköy OSB Mah. Sanayi Bulv. No:82/1",
  addressLine2: "59000 Çerkezköy / Tekirdağ",
  workHours: "Pazartesi – Cumartesi, 08:30 – 18:00",
};

function waLink(message) {
  const text = encodeURIComponent(message || "Merhaba, ürünleriniz hakkında fiyat teklifi almak istiyorum.");
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---- inject dynamic contact values wherever data-site="key" is used ---- */
  document.querySelectorAll("[data-site]").forEach((el) => {
    const key = el.getAttribute("data-site");
    if (SITE[key]) {
      if (el.tagName === "A" && el.hasAttribute("href")) {
        if (key === "email") el.href = `mailto:${SITE.email}`;
        if (key === "phoneHref") el.href = `tel:${SITE.phoneHref}`;
      }
      el.textContent = SITE[key];
    }
  });

  /* ---- whatsapp links ---- */
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const msg = el.getAttribute("data-wa") || "";
    el.href = waLink(msg);
    el.target = "_blank";
    el.rel = "noopener";
  });

  /* ---- seamless marquee ---- */
  const marqueeTrack = document.getElementById("marqueeTrack");
  if (marqueeTrack) {
    const PX_PER_SECOND = 55;
    const baseSet = marqueeTrack.querySelector(".marquee__set");
    const buildMarquee = () => {
      marqueeTrack.style.animation = "none";
      marqueeTrack
        .querySelectorAll(".marquee__set:not(:first-child)")
        .forEach((el) => el.remove());
      const setWidth = baseSet.getBoundingClientRect().width;
      if (!setWidth) return;
      // Need enough *pairs* of sets so the whole track is comfortably wider
      // than 2x the viewport - otherwise the -50% loop shows a gap on wide screens.
      const neededWidth = window.innerWidth * 2.2;
      let copies = Math.max(2, Math.ceil(neededWidth / setWidth));
      if (copies % 2 !== 0) copies += 1;
      for (let i = 1; i < copies; i++) {
        const clone = baseSet.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        marqueeTrack.appendChild(clone);
      }
      const halfDistance = (setWidth * copies) / 2;
      marqueeTrack.style.setProperty("--marquee-duration", `${halfDistance / PX_PER_SECOND}s`);
      // eslint-disable-next-line no-unused-expressions
      marqueeTrack.offsetHeight; // force reflow before re-enabling animation
      marqueeTrack.style.animation = "";
    };
    buildMarquee();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildMarquee, 250);
    });
  }

  /* ---- hero slider ---- */
  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll(".hero__slide")];
    const dotsWrap = document.getElementById("heroDots");
    let current = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Görsel ${i + 1}`);
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap?.appendChild(dot);
    });
    const dots = dotsWrap ? [...dotsWrap.children] : [];
    function goTo(index) {
      slides[current].classList.remove("is-active");
      dots[current]?.classList.remove("is-active");
      current = index;
      slides[current].classList.add("is-active");
      dots[current]?.classList.add("is-active");
    }
    if (slides.length > 1) {
      setInterval(() => goTo((current + 1) % slides.length), 3200);
    }
  }

  /* ---- floating whatsapp button ---- */
  const fab = document.getElementById("fabWhatsapp");
  if (fab) fab.href = waLink();

  /* ---- mobile nav ---- */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  const navClose = document.getElementById("navClose");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => mobileNav.classList.add("is-open"));
    navClose?.addEventListener("click", () => mobileNav.classList.remove("is-open"));
    mobileNav.addEventListener("click", (e) => {
      if (e.target === mobileNav) mobileNav.classList.remove("is-open");
    });
  }

  /* ---- product filter (urunler.html) ---- */
  const filterBtns = document.querySelectorAll("[data-filter]");
  const productCards = document.querySelectorAll("[data-category]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const target = btn.getAttribute("data-filter");
      productCards.forEach((card) => {
        const match = target === "all" || card.getAttribute("data-category") === target;
        card.style.display = match ? "" : "none";
      });
    });
  });

  /* ---- product detail toggles ---- */
  document.querySelectorAll("[data-toggle-details]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest(".product-card").querySelector(".product-card__details");
      panel.classList.toggle("is-open");
      btn.querySelector("span").textContent = panel.classList.contains("is-open")
        ? "Daha az göster"
        : "Detayları gör";
      btn.classList.toggle("is-open");
    });
  });

  /* ---- contact form -> mailto ---- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = data.get("name") || "";
      const company = data.get("company") || "";
      const phone = data.get("phone") || "";
      const product = data.get("product") || "";
      const message = data.get("message") || "";
      const subject = encodeURIComponent(`Fiyat Teklifi Talebi — ${name}`);
      const body = encodeURIComponent(
        `Ad Soyad: ${name}\nFirma: ${company}\nTelefon: ${phone}\nİlgilenilen Ürün: ${product}\n\nMesaj:\n${message}`
      );
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    });
  }

  /* ---- scroll reveal ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
    // Safety net: never leave content invisible if the observer misses an element
    // (fast programmatic scrolls, older engines, etc.)
    setTimeout(() => reveals.forEach((el) => el.classList.add("is-visible")), 2500);
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }


  /* ---- tanıtım filmi: sessiz önizleme + sesli tam film ---- */
  const filmFrame = document.getElementById("filmFrame");
  const filmVideo = document.getElementById("filmVideo");
  const filmPlay = document.getElementById("filmPlay");
  if (filmFrame && filmVideo && filmPlay) {
    let full = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startTeaser = () => {
      if (full || reduceMotion) return;
      if (!filmVideo.getAttribute("src")) filmVideo.src = filmVideo.dataset.teaser;
      filmVideo.play().catch(() => {});
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (full) return;
          if (entry.isIntersecting) startTeaser();
          else filmVideo.pause();
        });
      }, { threshold: 0.25 }).observe(filmFrame);
    }
    filmPlay.addEventListener("click", () => {
      full = true;
      filmFrame.classList.add("is-playing");
      filmVideo.src = filmVideo.dataset.full;
      filmVideo.loop = false;
      filmVideo.muted = false;
      filmVideo.controls = true;
      filmVideo.play().catch(() => {});
    });
    filmVideo.addEventListener("ended", () => {
      if (!full) return;
      full = false;
      filmFrame.classList.remove("is-playing");
      filmVideo.controls = false;
      filmVideo.muted = true;
      filmVideo.loop = true;
      filmVideo.src = filmVideo.dataset.teaser;
      startTeaser();
    });
  }

  /* ---- current year in footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
