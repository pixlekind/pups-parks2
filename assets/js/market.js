
(function(){
const listEl = document.getElementById("market-list");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
let cart = JSON.parse(localStorage.getItem("pp_cart") || "[]");

async function getProducts(){
const res = await fetch("data/products.json");
return res.json();
}
function saveCart(){ localStorage.setItem("pp_cart", JSON.stringify(cart)); renderCart(); }
function addToCart(id){ const i=cart.find(x=>x.id===id); if(i) i.qty++; else cart.push({id,qty:1}); saveCart(); }
function removeFromCart(id){ cart = cart.filter(x=>x.id!==id); saveCart(); }

async function renderList(){
listEl.innerHTML = '<p class="loading">Loading products…</p>';
const products = await getProducts();
listEl.innerHTML = "";
products.forEach(p=>{
const price = (p.priceGBP/100).toFixed(2);
const card = document.createElement("div");
card.className = "card product";
card.innerHTML = `         <img src="${p.img}" alt="${p.title}">         <h3>${p.title}</h3>         <p style="color:#555">${p.desc}</p>         <div class="product-meta" style="display:flex;align-items:center;justify-content:space-between">           <strong>£${price}</strong>           <button class="btn" data-add="${p.id}">Add to cart</button>         </div>`;
listEl.appendChild(card);
});
listEl.querySelectorAll("[data-add]").forEach(btn=> btn.addEventListener("click", ()=> addToCart(btn.getAttribute("data-add"))));
}

async function renderCart(){
if (!cartItemsEl || !cartTotalEl) return;
const products = await getProducts();
cartItemsEl.innerHTML = "";
if (cart.length === 0) { cartItemsEl.innerHTML = "<p>Your cart is empty.</p>"; cartTotalEl.textContent = "£0.00"; return; }
let total = 0;
cart.forEach(ci=>{
const p = products.find(x=>x.id===ci.id); if (!p) return;
const line = (p.priceGBP * ci.qty)/100; total += line;
const row = document.createElement("div");
row.className = "cart-item";
row.innerHTML = `         <div style="display:flex;align-items:center;gap:.5rem">           <img src="${p.img}" width="40" height="40" style="border-radius:8px" alt="${p.title}">           <div><strong>${p.title}</strong><div style="font-size:.85rem;color:#6b7280">x${ci.qty}</div></div>         </div>         <div>£${line.toFixed(2)} <button class="btn btn-outline" data-remove="${p.id}" style="padding:.25rem .5rem;margin-left:.5rem">✕</button></div>`;
cartItemsEl.appendChild(row);
});
cartTotalEl.textContent = "£" + total.toFixed(2);
cartItemsEl.querySelectorAll("[data-remove]").forEach(b=> b.addEventListener("click", ()=> removeFromCart(b.getAttribute("data-remove"))));
}

if (checkoutBtn) {
checkoutBtn.addEventListener("click", ()=>{
alert("Demo checkout: connect Stripe Payment Links or backend to take payment.");
});
}

renderList(); renderCart();
})();
