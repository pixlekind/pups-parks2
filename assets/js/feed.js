// ===== Community Feed (Enhanced) =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-post-form");
  const nameEl = document.getElementById("post-name");
  const avatarEl = document.getElementById("post-avatar");
  const contentEl = document.getElementById("post-content");
  const postsEl = document.getElementById("posts-container");
  const KEY = "pp_posts_v2";

  const uid = () => Math.random().toString(36).slice(2);

  function getPosts(){ try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]} }
  function setPosts(v){ localStorage.setItem(KEY, JSON.stringify(v)) }

  function render(){
    const posts = getPosts().sort((a,b)=> new Date(b.ts) - new Date(a.ts));
    postsEl.innerHTML = posts.length ? "" : `<div class="card"><p>No posts yet — be the first! 🐾</p></div>`;
    posts.forEach(p=>{
      const card = document.createElement("div");
      card.className = "post-card reveal";
      card.innerHTML = `
        <div class="post-head">
          <img class="avatar" src="${p.avatar||'assets/img/logo.svg'}" alt="${p.name||'Walker'}" />
          <div>
            <div style="font-weight:800">${p.name||'Walker'}</div>
            <div style="color:#64748b; font-size:.9rem">${new Date(p.ts).toLocaleString()}</div>
          </div>
        </div>
        <div class="post-body" style="margin-top:.5rem">
          <p>${escapeHtml(p.text)}</p>
          ${p.img?`<img src="${p.img}" alt="" style="margin-top:.5rem; border-radius:16px; max-height:420px; object-fit:cover; width:100%">`:''}
        </div>
        <div class="post-actions">
          <button class="like" data-like="${p.id}">
            <span class="heart">❤️</span> <span class="count">${p.likes||0}</span>
          </button>
          <button class="btn btn-outline" data-share>Share</button>
        </div>
      `;
      postsEl.appendChild(card);
    });

    // Like handlers
    postsEl.querySelectorAll("[data-like]").forEach(b=>{
      b.addEventListener("click", ()=>{
        const id = b.getAttribute("data-like");
        const all = getPosts(); const post = all.find(x=>x.id===id);
        if(!post) return; post.likes = (post.likes||0)+1; setPosts(all);
        b.classList.add("active"); b.querySelector(".count").textContent = post.likes;
      });
    });

    // Share
    postsEl.querySelectorAll("[data-share]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const url = window.location.href;
        if (navigator.share) navigator.share({title:"Pups & Parks Feed", url}).catch(()=>{});
        else prompt("Copy link:", url);
      });
    });
  }

  function escapeHtml(t){ const d=document.createElement("div"); d.textContent=t; return d.innerHTML; }

  form?.addEventListener("submit", e=>{
    e.preventDefault();
    const text=(contentEl.value||"").trim(); if(!text) return;
    const name=(nameEl.value||"").trim() || "Walker";
    const avatar=(avatarEl.value||"").trim();
    const withImg = text.match(/(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp))/i)?.[1] || "";
    const post = { id: uid(), name, avatar, text, img: withImg, ts: new Date().toISOString(), likes:0 };
    const all=getPosts(); all.push(post); setPosts(all);
    contentEl.value=""; render();
  });

  document.getElementById("seed-demo")?.addEventListener("click", ()=>{
    const demo = [
      {id:uid(), name:"Sarah Johnson", avatar:"https://i.pravatar.cc/120?img=12", text:"Hyde Park sunshine walk! 🌞🐾", img:"", ts:new Date().toISOString(), likes:4},
      {id:uid(), name:"David Wilson", avatar:"https://i.pravatar.cc/120?img=36", text:"Max made a new friend today 🐕‍🦺", img:"", ts:new Date().toISOString(), likes:2}
    ];
    setPosts(demo); render();
  });

  render();
});
