const parallaxCards = document.querySelectorAll(".parallax-card");
const firstPage = document.querySelector(".first-page-container");
const hero = document.querySelector(".hero");
const bg = document.querySelector(".bg");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function updateParallax() {
  if (parallaxCards.length) {
    parallaxCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const speed = Number(card.dataset.parallaxSpeed) || 0.14;
      const bgElement = card.querySelector(".parallax-card-bg");
      if (bgElement) {
        if (prefersReducedMotion.matches) {
          bgElement.style.transform = "translate3d(0, 0, 0) scale(1.08)";
          return;
        }

        const rawOffset = (rect.top - window.innerHeight / 2) * speed;
        const offset = Math.max(-120, Math.min(rawOffset, 120));
        bgElement.style.transform = `translate3d(0, ${offset}px, 0) scale(1.1)`;
      }
    });
    return;
  }

  if (hero && bg) {
    const rect = hero.getBoundingClientRect();
    const offset = rect.top * 0.25;
    bg.style.transform = `translateY(${offset}px)`;
  }
}

const observerFadeUp = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("show")) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.1,
  },
);

document.querySelectorAll(".fade-up, [class*='delay-']").forEach((element) => {
  observerFadeUp.observe(element);
});

// Trigger animations for elements already in viewport on page load
window.addEventListener("load", () => {
  document.querySelectorAll(".fade-up, [class*='delay-']").forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add("show");
    }
  });
});

window.addEventListener("scroll", updateParallax);
window.addEventListener("resize", updateParallax);
window.addEventListener("load", () => {
  if (firstPage) {
    firstPage.classList.add("active");
  }
  updateParallax();
});

updateParallax();

// --- FAQ: кастомный аккордеон с плавной анимацией ---
window.addEventListener("load", () => {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!btn || !answer) return;

    answer.style.overflow = "hidden";
    answer.style.maxHeight = "0";
    answer.style.transition = "max-height 0.35s ease";

    function open() {
      // Закрываем другие открытые элементы (аккордеон: только один открыт)
      const opened = document.querySelectorAll(".faq-item.open");
      opened.forEach((other) => {
        if (other === item) return;
        const otherAnswer = other.querySelector(".faq-answer");
        const otherBtn = other.querySelector(".faq-question");
        if (otherAnswer) {
          if (otherAnswer.style.maxHeight === "none") {
            otherAnswer.style.maxHeight = otherAnswer.scrollHeight + "px";
            otherAnswer.offsetHeight;
          }
          otherAnswer.style.maxHeight = "0";
        }
        other.classList.remove("open");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        if (otherAnswer) otherAnswer.setAttribute("aria-hidden", "true");
      });

      // ensure pixel height before animating
      answer.style.maxHeight = answer.scrollHeight + "px";
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      answer.setAttribute("aria-hidden", "false");

      function onEnd() {
        if (item.classList.contains("open")) {
          answer.style.maxHeight = "none";
        }
        answer.removeEventListener("transitionend", onEnd);
      }
      answer.addEventListener("transitionend", onEnd);
    }

    function close() {
      // if currently 'none', set to exact height first to allow transition
      if (answer.style.maxHeight === "none") {
        answer.style.maxHeight = answer.scrollHeight + "px";
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        answer.offsetHeight;
      }
      answer.style.maxHeight = "0";
      item.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      answer.setAttribute("aria-hidden", "true");
    }

    btn.addEventListener("click", () => {
      if (item.classList.contains("open")) close();
      else open();
    });

    // Adjust height on resize for opened items (if not using 'none')
    window.addEventListener("resize", () => {
      if (
        item.classList.contains("open") &&
        answer.style.maxHeight !== "none"
      ) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});

const observerCounter = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll(".counter");

      counters.forEach((counter) => {
        const target = +counter.dataset.target;
        let current = +counter.innerText;

        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          counter.innerText = Math.floor(progress * target);

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
      });

      observerCounter.unobserve(entry.target);
    }
  });
});

const statsElement = document.querySelector("#stats");
if (statsElement) {
  observerCounter.observe(statsElement);
}
