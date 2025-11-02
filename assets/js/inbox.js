(function(){
const list = document.getElementById("chat-messages");
const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");

function addMsg(text, me=false){
const div=document.createElement("div");
div.className="chat-msg" + (me?" me":"");
div.textContent=text;
list.appendChild(div);
list.scrollTop = list.scrollHeight;
}

if (send) {
send.addEventListener("click", ()=>{
const t=(input.value||"").trim();
if (!t) return;
addMsg(t, true);
input.value="";
setTimeout(()=> addMsg("Got it! We'll be right with you 🐕"), 800);
});
}
})();

