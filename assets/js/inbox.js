document.addEventListener("DOMContentLoaded", ()=>{
  const messages=document.getElementById("chat-messages");
  const input=document.getElementById("chat-input");
  const send=document.getElementById("chat-send");
  const title=document.getElementById("chat-title");

  const params=new URLSearchParams(location.search);
  const to=params.get("to"); const item=params.get("item");
  if(to) title.textContent=`Chat with ${to}`;
  if(to||item){ append(`Hi ${to||'there'}! I'm interested in ${item?('"'+item+'"'):'your listing'}.`,"received"); }

  function append(text,type="sent"){
    const msg=document.createElement("div");
    msg.className="chat-msg"+(type==="sent"?" me":"");
    msg.innerHTML=`<p>${text}</p>`;
    messages.appendChild(msg); messages.scrollTop=messages.scrollHeight;
  }

  send?.addEventListener("click",()=>{
    const t=(input.value||"").trim(); if(!t) return;
    append(t,"sent"); input.value="";
    setTimeout(()=>append("Thanks! I’ll reply shortly 🐾","received"),800);
  });
});
