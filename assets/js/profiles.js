// Auto-load shared UI (dark mode + FAB)
(function(){ if(!window.__ppUiLoaded){ window.__ppUiLoaded=true; var s=document.createElement('script'); s.defer=true; s.src='assets/js/ui.js'; document.head.appendChild(s);} })();

// ===== Profiles + Reviews =====
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("profile-root");
  const params = new URLSearchParams(location.search);
  const slug = params.get("u") || params.get("user") || "sarah-johnson";

  const LS_KEY = (id) => `pp_user_reviews_${id}`;

  const esc = (t) => { const d=document.createElement("div"); d.textContent=t; return d.innerHTML; };
  const avg = (arr) => arr.length ? (arr.reduce((a,b)=>a+Number(b.stars||0),0)/arr.length) : 0;
  const starsHTML = (n) => {
    const full = "★".repeat(Math.round(n));
    const empty = "☆".repeat(5 - Math.round(n));
    return `<span style="color:#f59e0b">${full}${empty}</span>`;
  };

  const openModal = () => {
    document.getElementById("review-modal").classList.add("show");
    document.getElementById("review-backdrop").classList.add("show");
  };
  const closeModal = () => {
    document.getElementById("review-modal").classList.remove("show");
    document.getElementById("review-backdrop").classList.remove("show");
  };
  document.getElementById("review-close")?.addEventListener("click", closeModal);
  document.getElementById("review-backdrop")?.addEventListener("click", closeModal);

  // Load user
  fetch("assets/data/users.json")
    .then(r => r.json())
    .then(users => {
      const user = users.find(u => u.slug === slug) || users[0];

      // Merge reviews from localStorage
      const saved = JSON.parse(localStorage.getItem(LS_KEY(user.id)) || "[]");
      const reviews = [...(user.reviews || []), ...saved];
      const rating = avg(reviews);

      // Render
      root.innerHTML = `
        <section class="card reveal" style="padding:0; overflow:hidden">
          <div style="position:relative; height:220px; background:url('${user.cover || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"}') center/cover no-repeat;"></div>
          <div style="padding:1.2rem; display:grid; gap:.8rem">
            <div class="row" style="align-items:center; justify-content:space-between">
              <div class="row" style="align-items:center">
                <img src="${user.avatar || "assets/img/logo.svg"}" width="86" height="86" style="margin-top:-56px; border-radius:999px; border:4px solid #fff; object-fit:cover; box-shadow:0 12px 28px rgba(0,0,0,.15)">
                <div style="margin-left:.8rem">
                  <h1 style="margin:0">${esc(user.name)}</h1>
                  <p style="color:#64748b; margin:.1rem 0">${esc(user.city || "Local")}</p>
                  <div class="row">
                    ${user.verified ? `<span class="chip">✅ Verified Walker</span>` : ""}
                    ${(user.badges||[]).map(b => `<span class="chip">${esc(b)}</span>`).join("")}
                  </div>
                </div>
              </div>
              <div class="row">
                <a class="btn btn-outline" href="inbox.html?to=${encodeURIComponent(user.name)}">Message</a>
                <button id="leave-review" class="btn btn-mint">Leave Review</button>
              </div>
            </div>

            <p>${esc(user.bio || "Dog lover and community member.")}</p>

            <div class="card" style="margin-top:.6rem">
              <div class="row" style="align-items:center; justify-content:space-between">
                <div>
                  <strong>Rating</strong><br/>
                  <span style="font-size:1.2rem">${starsHTML(rating)} <span style="color:#64748b">(${reviews.length})</span></span>
                </div>
                <div class="row">
                  ${(user.services||[]).map(s => `<span class="chip">${esc(s)}</span>`).join("")}
                </div>
              </div>
            </div>

            ${(user.dogs && user.dogs.length) ? `
            <section>
              <h3>Dogs</h3>
              <div class="grid three" id="dogs-grid">
                ${user.dogs.map(d => `
                  <article class="listing-card">
                    <div class="card" style="border:none; box-shadow:none">
                      <h4 style="margin:0">${esc(d.name)} ${esc(d.emoji||"")}</h4>
                      <p style="color:#64748b">${esc(d.breed||"")}</p>
                    </div>
                  </article>
                `).join("")}
              </div>
            </section>` : ""}

            <section>
              <div class="section-head">
                <h3>Reviews</h3>
                <button id="leave-review-2" class="btn btn-outline">Write a review</button>
              </div>
              <div id="reviews-list" class="grid">
                ${reviews.map(r => reviewCard(r)).join("") || `<div class="card">No reviews yet — be the first!</div>`}
              </div>
            </section>
          </div>
        </section>
      `;

      // Wire up review triggers
      document.getElementById("leave-review")?.addEventListener("click", openModal);
      document.getElementById("leave-review-2")?.addEventListener("click", openModal);

      // Handle form submit
      document.getElementById("review-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const r = {
          name: (document.getElementById("r-name").value || "Member").trim(),
          avatar: (document.getElementById("r-avatar").value || ""),
          stars: Number(document.getElementById("r-stars").value),
          comment: (document.getElementById("r-comment").value || "").trim(),
          date: new Date().toISOString().slice(0,10)
        };
        const existing = JSON.parse(localStorage.getItem(LS_KEY(user.id)) || "[]");
        existing.push(r);
        localStorage.setItem(LS_KEY(user.id), JSON.stringify(existing));
        // Update reviews list
        const list = document.getElementById("reviews-list");
        const card = document.createElement("div");
        card.innerHTML = reviewCard(r);
        list.prepend(card.firstElementChild);
        closeModal();
        e.target.reset();
      });

      function reviewCard(r){
        return `
          <article class="listing-card reveal" style="overflow:visible">
            <div class="card" style="border:none; box-shadow:none">
              <div class="row" style="align-items:center; justify-content:space-between">
                <div class="row" style="align-items:center">
                  <img src="${r.avatar || 'assets/img/logo.svg'}" width="40" height="40" style="border-radius:999px; object-fit:cover">
                  <div style="margin-left:.6rem">
                    <strong>${esc(r.name)}</strong><br/>
                    <small style="color:#64748b">${esc(r.date||'')}</small>
                  </div>
                </div>
                <div style="font-size:1.1rem">${starsHTML(r.stars)}</div>
              </div>
              <p style="margin-top:.5rem">${esc(r.comment)}</p>
            </div>
          </article>
        `;
      }
    })
    .catch(() => {
      root.innerHTML = `<div class="card">Profile not found.</div>`;
    });
});
