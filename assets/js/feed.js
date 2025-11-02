(function(){
const form = document.getElementById("create-post-form");
const textarea = document.getElementById("post-content");
const list = document.getElementById("posts-container");
const KEY = "pp_posts";

function getPosts(){ try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch(e){ return []; } }
function setPosts(v){ localStorage.setItem(KEY, JSON.stringify(v)); }
function uid(){ return Math.random().toString(36).slice(2); }

function render(){
const posts = getPosts().sort((a,b)=> new Date(b.ts) - new Date(a.ts));
list.innerHTML = posts.length ? "" : '<p class="loading">No posts yet — be the first! 🐶</p>';
posts.forEach(p=>{
const card = document.createElement("div");
card.className = "card post";
card.innerHTML = `         <div style="display:flex;gap:.75rem;align-items:center">           <img src="assets/img/logo.svg" alt="" width="40" height="40" style="border-radius:50%">           <div>             <div style="font-weight:700">${p.author || "Walker"}</div>             <div style="color:#6b7280;font-size:.9rem">${new Date(p.ts).toLocaleString()}</div>           </div>         </div>         <p style="margin-top:.5rem">${escapeHtml(p.text)}</p>         <div style="display:flex;gap:.5rem">           <button class="btn btn-outline" data-like="${p.id}">❤️ ${p.likes||0}</button>         </div>`;
list.appendChild(card);
});

```
list.querySelectorAll("[data-like]").forEach(b=>{
  b.addEventListener("click", ()=>{
    const id = b.getAttribute("data-like");
    const posts = getPosts();
    const post = posts.find(x=>x.id===id);
    if (post) { post.likes = (post.likes || 0) + 1; setPosts(posts); b.textContent = `❤️ ${post.likes}`; }
  });
});
```

}

function escapeHtml(t){ const d=document.createElement("div"); d.textContent=t; return d.innerHTML; }

if (form) {
form.addEventListener("submit", (e)=>{
e.preventDefault();
const text = (textarea.value || "").trim();
if (!text) return;
const posts = getPosts();
posts.push({ id: uid(), text, author: "Sarah Johnson", ts: new Date().toISOString(), likes: 0 });
setPosts(posts);
textarea.value = "";
render();
});
}

// Seed once
if (getPosts().length === 0) {
setPosts([{ id: uid(), text: "Hyde Park sunshine walk! 🌞🐕", author: "Sarah Johnson", ts: new Date().toISOString(), likes: 4 }]);
}
render();
})();

