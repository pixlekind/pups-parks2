// Auto-load shared UI (dark mode + FAB)
(function(){ if(!window.__ppUiLoaded){ window.__ppUiLoaded=true; var s=document.createElement('script'); s.defer=true; s.src='assets/js/ui.js'; document.head.appendChild(s);} })();

// ===== Simple Inbox Chat =====
document.addEventListener("DOMContentLoaded", () => {
  const messages = document.getElementById("chat-messages");
  const input = document.getElementById("chat-input");
  const send = document.getElementById("chat-send");

  const appendMessage = (text, type = "sent") => {
    const msg = document.createElement("div");
    msg.className = "chat-msg " + (type === "sent" ? "me" : "");
    msg.innerHTML = `<p>${text}</p>`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  };

  send.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, "sent");
    input.value = "";

    setTimeout(() => {
      const replies = [
        "Thanks for reaching out!",
        "We’ll get back to you soon 🐾",
        "Glad to help!",
        "Your message has been received!"
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      appendMessage(reply, "received");
    }, 1000);
  });
});
