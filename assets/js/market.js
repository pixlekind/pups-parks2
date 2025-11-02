// ===== Community Marketplace (Peer-to-Peer) =====
document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("listing-form");
  const listEl = document.getElementById("market-list");
  const seedBtn = document.getElementById("seed-listings");
  const KEY = "pp_listings_v1";

  const uid = () => Math.random().toString(36).slice(2);
  const get = () => { try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]} }
  const set = (v) => localStorage.setItem(KEY, JSON.stringify(v));

  function render(){
    const items = get().sort((a,b)=> new Date(b.ts) - new Date(a.ts));
    listEl.innerHTML = items.length ? "" : `<div class="card"><p>No listings yet — be the first to sell, swap or gift! 🎁</p></div>`;
    items.forEach(it=>{
      const card = document.createElement("article");
      card.className = "listing-card reveal";
      card.innerHTML = `
        ${it.img?`<img class="listing-img" src="${it.img}" alt="${it.title}">`:''}
        <div class="listing-body">
          <div class="listing-meta">
            <h3 style="font-size:1.1rem">${escapeHtml(it.title)}</h3>
            <strong>£${Number(it.price).toFixed(2)}</strong>
          </div>
          <p style="color:#475569">${escapeHtml(it.desc)}</p>
          <div class="listing-meta">
            <div class="seller">
              <img src="${it.avatar||'assets/img/logo.svg'}" alt="${it.seller||'Seller'}" />
              <span>${escapeHtml(it.seller||'Seller')}</span>
            </div>
            <span class="tag">${escapeHtml(it.loc||'Local')}</span>
          </div>
          <div style="display:flex; gap:.5rem; margin-top:.5rem">
            <a class="btn btn-pink" href="inbox.html?to=${encodeURIComponent(it.seller||'Seller')}&item=${encodeURIComponent(it.title)}">Contact Seller</a>
            <button class="btn btn-outline" data-share>Share</button>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });

    listEl.querySelectorAll("[data-share]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const url = window.location.href;
        if (navigator.share) navigator.share({title:"Pups & Parks Marketplace", url}).catch(()=>{});
        else prompt("Copy link:", url);
      });
    });
  }

  function escapeHtml(t){ const d=document.createElement("div"); d.textContent=t; return d.innerHTML; }

  form?.addEventListener("submit", e=>{
    e.preventDefault();
    const title = document.getElementById("l-title").value.trim();
    const price = parseFloat(document.getElementById("l-price").value||"0");
    const img   = document.getElementById("l-img").value.trim();
    const loc   = document.getElementById("l-loc").value.trim();
    const desc  = document.getElementById("l-desc").value.trim();
    const seller= document.getElementById("l-seller").value.trim() || "Community Member";
    const avatar= document.getElementById("l-avatar").value.trim();
    if (!title || !desc || isNaN(price)) return;

    const all = get();
    all.push({ id: uid(), title, price, img, loc, desc, seller, avatar, ts: new Date().toISOString() });
    set(all);
    form.reset(); render();
  });

  seedBtn?.addEventListener("click", ()=>{
    const demo = [
      {id:uid(), title:"Eco Rope Toy", price:8.99, img:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop", loc:"Battersea", desc:"Durable rope, great for tug.", seller:"Emma Martinez", avatar:"https://i.pravatar.cc/120?img=5", ts:new Date().toISOString()},
      {id:uid(), title:"Reflective Harness (M)", price:14.00, img:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop", loc:"Camden", desc:"Soft padding, like new.", seller:"David Wilson", avatar:"https://i.pravatar.cc/120?img=33", ts:new Date().toISOString()}
    ];
    set(demo); render();
  });

  render();
});
