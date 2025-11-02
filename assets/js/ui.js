// Pups & Parks™ UI bootstrap: Dark mode + FAB + Modal (auto-injected)
(function(){
  const THEME_KEY = "pp_theme";
  const getTheme = () => localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
  const setTheme = (t) => { document.documentElement.setAttribute("data-theme", t); localStorage.setItem(THEME_KEY, t); };

  // Apply theme on load
  setTheme(getTheme());

  // Inject theme toggle in header
  function injectThemeToggle(){
    const header = document.querySelector(".header-inner");
    if(!header || header.querySelector(".theme-toggle")) return;
    const btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.innerHTML = `<span class="knob"></span><span>Theme</span>`;
    btn.addEventListener("click", ()=>{
      const next = (document.documentElement.getAttribute("data-theme")==="dark") ? "light" : "dark";
      setTheme(next);
    });
    header.appendChild(btn);
  }

  // Floating Create Button + Menu
  function injectFAB(){
    if (document.querySelector(".fab")) return;
    const fab = document.createElement("div");
    fab.className = "fab";
    fab.innerHTML = `
      <button class="fab-main" aria-label="Create">＋</button>
      <div class="fab-menu">
        <a class="fab-item" href="#" data-open="create-post">📸 New Feed Post</a>
        <a class="fab-item" href="#" data-open="create-listing">🛍️ New Listing</a>
        <a class="fab-item" href="#" data-open="create-meetup">📍 New Meetup</a>
      </div>
    `;
    document.body.appendChild(fab);
    fab.querySelector(".fab-main").addEventListener("click", ()=> fab.classList.toggle("open"));

    // Modal scaffold
    const backdrop = document.createElement("div"); backdrop.className="modal-backdrop";
    const modal = document.createElement("div"); modal.className="modal"; modal.innerHTML = `
      <div class="modal-head">
        <strong id="modal-title">Create</strong>
        <button class="btn btn-outline" id="modal-close">Close</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
    `;
    document.body.append(backdrop, modal);
    const openModal = (title, contentHTML) => {
      document.getElementById("modal-title").textContent = title;
      document.getElementById("modal-body").innerHTML = contentHTML;
      modal.classList.add("show"); backdrop.classList.add("show");
      document.getElementById("modal-close").onclick = closeModal;
    };
    const closeModal = () => { modal.classList.remove("show"); backdrop.classList.remove("show"); };

    // Menu actions (lightweight inline creators that redirect to full pages)
    fab.querySelectorAll("[data-open]").forEach(a=>{
      a.addEventListener("click",(e)=>{
        e.preventDefault();
        const type = a.getAttribute("data-open");
        if (type==="create-post"){
          openModal("New Feed Post", `
            <div class="row"><input class="input" id="m-name" placeholder="Your name"><input class="input" id="m-avatar" placeholder="Avatar URL (optional)"></div>
            <textarea class="input" id="m-text" placeholder="Share your walk… paste image URL to attach"></textarea>
            <div class="row"><button class="btn" id="m-go">Post to Feed</button></div>
          `);
          document.getElementById("m-go").onclick = ()=>{
            // Pass via URL hash (read in feed.js if desired), fallback open page
            location.href = "feed.html#new";
          };
        }
        if (type==="create-listing"){
          openModal("New Marketplace Listing", `
            <div class="row"><input class="input" id="ml-title" placeholder="Title"><input class="input" id="ml-price" type="number" step="0.01" placeholder="Price"></div>
            <div class="row"><input class="input" id="ml-img" placeholder="Image URL"><input class="input" id="ml-loc" placeholder="Location"></div>
            <textarea class="input" id="ml-desc" placeholder="Description"></textarea>
            <div class="row"><button class="btn btn-pink" id="ml-go">Open Marketplace</button></div>
          `);
          document.getElementById("ml-go").onclick = ()=> location.href="marketplace.html#new";
        }
        if (type==="create-meetup"){
          openModal("New Meetup", `
            <div class="row"><input class="input" id="me-title" placeholder="Title"><input class="input" id="me-date" type="datetime-local"></div>
            <div class="row"><input class="input" id="me-loc" placeholder="Location"><input class="input" id="me-host" placeholder="Host (optional)"></div>
            <textarea class="input" id="me-desc" placeholder="Details"></textarea>
            <div class="row"><button class="btn btn-mint" id="me-go">Open Meetups</button></div>
          `);
          document.getElementById("me-go").onclick = ()=> location.href="meetups.html#new";
        }
      });
    });

    // Close modal on backdrop click
    backdrop.addEventListener("click", ()=>{ modal.classList.remove("show"); backdrop.classList.remove("show"); });
  }

  // Init
  document.addEventListener("DOMContentLoaded", ()=>{
    injectThemeToggle();
    injectFAB();
  });
})();
