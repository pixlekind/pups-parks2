document.addEventListener("DOMContentLoaded", ()=>{
  const form=document.getElementById("create-post-form");
  const postsEl=document.getElementById("posts-container");
  const nameEl=document.getElementById("post-name");
  const avatarEl=document.getElementById("post-avatar");
  const contentEl=document.getElementById("post-content");
  const KEY="pp_posts_v3";

  const uid=()=>Math.random().toString(36).slice(2);
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
  const set=(v)=>localStorage.setItem(KEY,JSON.stringify(v));
  const esc=(t)=>{const d=document.createElement("div");d.textContent=t;return d.innerHTML;}

  function render(){
    const posts=get().sort((a,b)=>new Date(b.ts)-new Date(a.ts));
    postsEl.innerHTML = posts.map(p=>`
      <article class="listing-card reveal" style="overflow:visible">
        <div class="card" style="border:none;box-shadow:none">
          <div class="row" style="justify-content:space-between;align-items:center">
            <div style="display:flex;gap:.6rem;align-items:center">
              <img src="${p.avatar||'assets/img/logo.svg'}" width="40" height="40" style="border-radius:999px;object-fit:cover">
              <div><strong>${p.name||'Member'}</strong><div style="color:#64748b;font-size:.9rem">${new Date(p.ts).toLocaleString()}</div></div>
            </div>
            <button class="chip like" data-like="${p.id}">❤️ <span>${p.likes||0}</span></button>
          </div>
          <p style="margin:.6rem 0">${esc(p.text)}</p>
          ${p.img?`<img src="${p.img}" style="width:100%;border-radius:18px;max-height:420px;object-fit:cover">`:''}
        </div>
      </article>
    `).join("") || `<div class="card">No posts yet — share your first walk!</div>`;

    postsEl.querySelectorAll("[data-like]").forEach(b=>{
      b.addEventListener("click",()=>{
        const id=b.getAttribute("data-like");
        const all=get(); const post=all.find(x=>x.id===id); if(!post) return;
        post.likes=(post.likes||0)+1; set(all);
        b.querySelector("span").textContent=post.likes;
      })
    });
  }

  form?.addEventListener("submit",(e)=>{
    e.preventDefault();
    const t=(contentEl.value||"").trim(); if(!t) return;
    const img=t.match(/(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp))/i)?.[1]||"";
    const row={id:uid(),name:(nameEl.value||"").trim()||"Member",avatar:(avatarEl.value||"").trim(),text:t,img,ts:new Date().toISOString(),likes:0};
    const all=get(); all.push(row); set(all); contentEl.value=""; render();
  });

  document.getElementById("seed-demo")?.addEventListener("click",()=>{
    const demo=[
      {id:uid(),name:"Sarah",avatar:"https://i.pravatar.cc/120?img=12",text:"Hyde Park sunshine walk! 🌞🐾",img:"",ts:new Date().toISOString(),likes:4},
      {id:uid(),name:"David",avatar:"https://i.pravatar.cc/120?img=36",text:"Max made a new friend today 🐕‍🦺",img:"",ts:new Date().toISOString(),likes:2}
    ]; set(demo); render();
  });

  render();
});
