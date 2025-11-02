<!-- /assets/js/include.js -->
<script>
// Pups & Parks™ — Vision Theme Injector + Shared Header/Footer
document.addEventListener("DOMContentLoaded", () => {
  // HEAD: meta + fonts + CSS (Vision)
  const headHtml = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="assets/img/logo.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="assets/css/styles.css" />
    <link rel="stylesheet" href="assets/css/theme-vision.css" />
    <link rel="stylesheet" href="assets/css/dashboard.css" />
  `;
  document.head.insertAdjacentHTML("afterbegin", headHtml);

  // HEADER
  const headerHtml = `
  <header class="site-header vision-glass">
    <div class="container header-inner">
      <a class="logo" href="index.html">
        <img src="assets/img/logo.svg" width="28" height="28" alt="Pups & Parks logo" />
        <span class="brand">Pups & Parks™</span>
      </a>
      <div class="toolbar">
        <button class="theme-toggle" id="vision-theme-toggle" aria-label="Toggle theme">⦿</button>
        <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
      </div>
      <nav class="nav">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="walkers.html">Walkers</a></li>
          <li><a href="meetups.html">Meetups</a></li>
          <li><a href="feed.html">Feed</a></li>
          <li><a href="marketplace.html">Marketplace</a></li>
          <li><a href="profile.html?u=sarah-johnson">Profile</a></li>
          <li><a href="walker-dashboard.html">Dashboard</a></li>
          <li><a href="inbox.html">Inbox</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>`;

  // FOOTER
  const footerHtml = `
  <footer class="site-footer vision-glass">
    <div class="container">
      <div class="footer-grid">
        <div class="foot-brand">
          <img src="assets/img/logo.svg" width="22" height="22" alt="">
          <strong>Pups & Parks™</strong>
        </div>
        <div class="foot-links">
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
          <a href="meetups.html">Meetups</a>
          <a href="marketplace.html">Marketplace</a>
        </div>
        <div class="foot-copy">© ${new Date().getFullYear()} Pups & Parks™ • Built for dog lovers 🐾</div>
      </div>
    </div>
  </footer>`;

  if (!document.querySelector(".site-header")) {
    document.body.insertAdjacentHTML("afterbegin", headerHtml);
  }
  if (!document.querySelector(".site-footer")) {
    document.body.insertAdjacentHTML("beforeend", footerHtml);
  }

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  toggle?.addEventListener("click", ()=> nav.classList.toggle("open"));

  // Active link highlight
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a=>{
    const href = a.getAttribute("href");
    if (href && path && href.indexOf(path) !== -1) a.classList.add("active");
  });

  // Theme toggle (optional light mode)
  const THEME_KEY="pp_theme_mode";
  const setTheme=(m)=>{document.documentElement.dataset.theme=m; localStorage.setItem(THEME_KEY,m);}
  setTheme(localStorage.getItem(THEME_KEY) || "vision-dark");
  document.getElementById("vision-theme-toggle")?.addEventListener("click",()=>{
    const next = (document.documentElement.dataset.theme==="vision-dark")?"vision-light":"vision-dark";
    setTheme(next);
  });
});
</script>
