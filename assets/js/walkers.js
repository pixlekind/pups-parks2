document.addEventListener("DOMContentLoaded", ()=>{
  const list = document.getElementById("walker-list");
  const form = document.getElementById("walker-filter");

  const render = (rows=[])=>{
    list.innerHTML = rows.map(w => `
      <article class="walker-card reveal">
        <img class="walker-img" src="${w.img}" alt="${w.name}">
        <div class="card" style="border:none;box-shadow:none">
          <div class="row" style="justify-content:space-between">
            <h3>${w.name}</h3>
            <div class="chip">⭐ ${w.rating.toFixed(1)}</div>
          </div>
          <p style="color:#64748b">${w.area} • ${w.badges.join(" • ")}</p>
          <p>${w.bio}</p>
          <div class="row">
            <a class="btn btn-mint" href="inbox.html?to=${encodeURIComponent(w.name)}">Message</a>
            <a class="btn btn-outline" href="profile.html?u=${encodeURIComponent(w.slug)}">View Profile</a>
          </div>
        </div>
      </article>
    `).join("") || `<div class="card">No walkers found.</div>`;
  };

  let data=[];
  fetch("data/walkers.json").then(r=>r.json()).then(d=>{ data=d; render(data); });

  form?.addEventListener("submit", e=>{
    e.preventDefault();
    const q = (document.getElementById("q").value||"").toLowerCase();
    const rating = (document.getElementById("rating").value||"").replace("+","");
    const badge = document.getElementById("badge").value||"";
    let rows = data.filter(w=>
      (!q || [w.name,w.area,(w.breeds||[]).join(" ")].join(" ").toLowerCase().includes(q)) &&
      (!rating || w.rating >= Number(rating)) &&
      (!badge || w.badges.includes(badge))
    );
    render(rows);
  });
});
