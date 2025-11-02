// ===== Community Feed Logic =====

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-post-form");
  const content = document.getElementById("post-content");
  const postsContainer = document.getElementById("posts-container");

  const loadPosts = () => {
    const posts = JSON.parse(localStorage.getItem("pups_feed") || "[]");
    postsContainer.innerHTML = "";
    posts.reverse().forEach((post) => {
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <p>${post.text}</p>
        <div class="post-meta">
          <small>${new Date(post.date).toLocaleString()}</small>
        </div>
      `;
      postsContainer.appendChild(postEl);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = content.value.trim();
    if (!text) return;

    const posts = JSON.parse(localStorage.getItem("pups_feed") || "[]");
    posts.push({ text, date: new Date().toISOString() });
    localStorage.setItem("pups_feed", JSON.stringify(posts));
    content.value = "";
    loadPosts();
  });

  loadPosts();
});
