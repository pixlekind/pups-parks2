(function(){
// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

// Simple chat helpers used on inbox/contact pages (if present)
const msgList = document.getElementById("chat-messages");
const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");

function addMsg(text, me=false){
if (!msgList) return;
const div = document.createElement("div");
div.className = "chat-msg" + (me ? " me" : "");
div.textContent = text;
msgList.appendChild(div);
msgList.scrollTop = msgList.scrollHeight;
}
if (send) {
send.addEventListener("click", () => {
const t = (input.value || "").trim();
if (!t) return;
addMsg(t, true);
input.value = "";
setTimeout(() => addMsg("Thanks! We'll be right with you 🐾"), 700);
});
}
})();

