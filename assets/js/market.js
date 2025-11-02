document.addEventListener("DOMContentLoaded", ()=>{
  const form=document.getElementById("listing-form");
  const list=document.getElementById("market-list");
  const seedBtn=document.getElementById("seed-listings");
  const KEY="pp_listings_v2";

  const uid=()=>Math.random().toString(36).slice(2);
  const get=()=>JSON.parse(localStorage.getItem(KEY)||"[]");
  const set=(v)=>localStorage.setItem(KEY,JSON.stringify(v));
  const esc=(t)=>{const d=document.createElement("div");d.textContent=t;return d.innerHTML;}

  function render(rows){
    list.innerHTML = rows.map(it=>`
      <article class="listing-card reveal">
        ${it.img?`<img class="listing-img" src="${it.img}" alt="">`:''}
        <div class="card" style="border:none;box-shadow:none">
          <div class="row" style="justify-content:space-between">
            <h3>${esc(it.title)}</h3><strong>£${Number(it.price).toFixed(2)}</strong>
          </div>
          <p style="color:#475569">${esc(it.desc)}</p>
          <div class="row" style="justify-content:space-between">
            <div class="row" style="align-items:center">
              <img src="${it.avatar||'assets/img/logo.svg'}" width="28" height="28" style="border-radius:999px;object-fit:cover">
              <strong>${esc(it.seller||'Seller')}</strong>
            </div>
            <span class="chip">${esc(it.loc||'Local')}</span>
          </div>
          <div class="row">
            <a class="btn btn-pink" href="inbox.html?to=${encodeURIComponent(it.seller||'Seller')}&item=${encodeURIComponent(it.title)}">Contact Seller</a>
            <button class="btn btn-outline" data-share>Share</button>
          </div>
        </div>
      </article>
    `).join("") || `<div class="card">No listings yet — sell, swap or gift something!</div>`;

    list.querySelectorAll("[data-share]").forEach(b=> b.addEventListener("click",()=>{
      const url=location.href; if(navigator.share) navigator.share({title:"Pups & Parks Marketplace",url}).catch(()=>{});
      else prompt("Copy link:", url);
    }));
  }

  form?.addEventListener("submit",e=>{
    e.preventDefault();
    const row={
      id:uid(),
      title:document.getElementById("l-title").value.trim(),
      price:parseFloat(document.getElementById("l-price").value||"0"),
      img:document.getElementById("l-img").value.trim(),
      loc:document.getElementById("l-loc").value.trim(),
      desc:document.getElementById("l-desc").value.trim(),
      seller:document.getElementById("l-seller").value.trim()||"Community Member",
      avatar:document.getElementById("l-avatar").value.trim(),
      ts:new Date().toISOString()
    };
    const all=get(); all.push(row); set(all); form.reset(); render(all);
  });

  seedBtn?.addEventListener("click",()=>{
    const demo=[
      {id:uid(),title:"Eco Rope Toy",price:8.99,img:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop",loc:"Battersea",desc:"Durable rope, great for tug.",seller:"Emma M.",avatar:"https://i.pravatar.cc/120?img=5"},
      {id:uid(),title:"Reflective Harness (M)",price:14,img:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop",loc:"Camden",desc:"Soft padding, like new.",seller:"David W.",avatar:"https://i.pravatar.cc/120?img=33"}
    ];
    set(demo); render(demo);
  });

  render(get());
});
