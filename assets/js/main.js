// Auto-load shared UI (dark mode + FAB)
(function(){ if(!window.__ppUiLoaded){ window.__ppUiLoaded=true; var s=document.createElement('script'); s.defer=true; s.src='assets/js/ui.js'; document.head.appendChild(s);} })();

// ===== Pups & Parks™ Main Site Script =====
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  const revealOnScroll = () => {
    for (let el of reveals) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) el.classList.add("revealed");
    }
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});
