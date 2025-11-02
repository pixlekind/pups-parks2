document.addEventListener("DOMContentLoaded", ()=>{
  const toggle=document.querySelector(".nav-toggle");
  const nav=document.querySelector(".nav");
  toggle?.addEventListener("click",()=> nav.classList.toggle("open"));

  // Home page: meetups preview
  if (document.getElementById("meetups-preview")) {
    fetch("data/events.json").then(r=>r.json()).then(items=>{
      const wrap=document.getElementById("meetups-preview");
      wrap.innerHTML="";
      items.slice(0,3).forEach(e=>{
        const card=document.createElement("article");
        card.className="event-card reveal";
        card.innerHTML=`
          <img class="event-img" src="${e.img}" alt="">
          <div class="card" style="box-shadow:none;border:none;padding:1rem">
            <h3>${e.title}</h3>
            <p style="color:#64748b">${new Date(e.date).toLocaleString()} • ${e.location}</p>
            <a class="btn btn-outline" href="meetups.html">Details</a>
          </div>`;
        wrap.appendChild(card);
      });
    }).catch(()=>{});
  }
});
