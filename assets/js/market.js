// ===== Marketplace Logic =====

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("market-list");
  const cartContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("pups_cart") || "[]");
  let total = 0;

  const loadProducts = async () => {
    try {
      const res = await fetch("data/products.json");
      const products = await res.json();
      list.innerHTML = "";
      products.forEach((p) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <strong>£${p.price.toFixed(2)}</strong><br><br>
          <button class="btn add" data-id="${p.id}">Add to Cart</button>
        `;
        list.appendChild(card);
      });
      bindButtons();
      updateCart();
    } catch (err) {
      list.innerHTML = "<p>Failed to load products.</p>";
    }
  };

  const bindButtons = () => {
    document.querySelectorAll(".add").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        addToCart(id);
      });
    });
  };

  const addToCart = (id) => {
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1 });
    saveCart();
    updateCart();
  };

  const saveCart = () => {
    localStorage.setItem("pups_cart", JSON.stringify(cart));
  };

  const updateCart = async () => {
    const res = await fetch("data/products.json");
    const products = await res.json();
    total = 0;
    cartContainer.innerHTML = "";
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        total += product.price * item.qty;
        const el = document.createElement("div");
        el.innerHTML = `${product.name} x${item.qty} - £${(product.price * item.qty).toFixed(2)}`;
        cartContainer.appendChild(el);
      }
    });
    totalEl.textContent = `£${total.toFixed(2)}`;
  };

  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("🦴 Checkout demo — Stripe integration coming soon!");
  });

  loadProducts();
});
