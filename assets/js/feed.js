// Auto-load shared UI (dark mode + FAB)
(function(){ if(!window.__ppUiLoaded){ window.__ppUiLoaded=true; var s=document.createElement('script'); s.defer=true; s.src='assets/js/ui.js'; document.head.appendChild(s);} })();

// ===== Community Feed Logic =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-post-form");
  const content = document.getElementById("post-content");
  const postsContainer = document.getElementById("posts-container");

  const loadPosts = () => {
    const posts = JSON.parse(localStorage.getItem("pups_feed") || "[]");
    postsContainer.innerHTML = "";
    posts.reverse().forEach((post, i) => {
      const postEl = document.createElement("div");
      postEl.className = "post card reveal";
      postEl.innerHTML = `
        <div class="row" style="align-items:center;gap:.6rem">
          <img src="${post.avatar || 'assets/img/logo.svg'}" style="width:42px;height:42px;border-radius:50%">
          <strong>${post.name || 'Anonymous Walker'}</strong>
        </div>
        <p style="margin-top:.6rem">${post.text}</p>
        ${post.image ? `<img src="${post.image}" style="width:100%;border-radius:14px;margin-top:.6rem">` : ""}
        <div class="row" style="justify-content:space-between;margin-top:.4rem">
          <small>${new Date(post.date).toLocaleString()}</small>
          <button class="btn btn-outline like-btn" data-id="${i}">❤️ ${post.likes || 0}</button>
        </div>
      `;
      postsContainer.appendChild(postEl);
    });

    document.querySelectorAll(".like-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const posts = JSON.parse(localStorage.getItem("pups_feed") || "[]");
        posts[posts.length - 1 - id].likes = (posts[posts.length - 1 - id].likes || 0) + 1;
        localStorage.setItem("pups_feed", JSON.stringify(posts));
        btn.classList.add("pop");
        loadPosts();
      });
    });
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = content.value.trim();
      if (!text) return;
      const name = document.getElementById("user-name")?.value || "Anonymous Walker";
      const avatar = document.getElementById("user-avatar")?.value || "";
      const posts = JSON.parse(localStorage.getItem("pups_feed") || "[]");
      posts.push({ text, date: new Date().toISOString(), name, avatar });
      localStorage.setItem("pups_feed", JSON.stringify(posts));
      content.value = "";
      loadPosts();
    });
  }

  loadPosts();
});
