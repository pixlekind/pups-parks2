// ===== Inbox with Prefill from Marketplace =====
document.addEventListener("DOMContentLoaded", () => {
  const messages = document.getElementById("chat-messages");
  const input = document.getElementById("chat-input");
  const send = document.getElementById("chat-send");
  const title = document.getElementById("chat-title");

  const params = new URLSearchParams(location.search);
  const to = params.get("to");
  const item = params.get("item");

  if (to) title.textContent = `Chat with ${to}`;
  if (to || item) {
    const intro = `Hi ${to || 'there'}! I'm interested in ${item ? `"${item}"` : "your listing"}.`;
    appendMessage(intro, "received");
  }

  function appendMessage(text, type="sent"){
    const msg = document.createElement("div");
    msg.className = "chat-msg " + (type === "sent" ? "me" : "");
    msg.innerHTML = `<p>${text}</p>`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  send?.addEventListener("click", ()=>{
    const t=(input.value||"").trim(); if(!t) return;
    appendMessage(t,"sent"); input.value="";
    setTimeout(()=> appendMessage("Thanks! I'll reply shortly 🐾","received"), 800);
  });
});
