document.addEventListener("DOMContentLoaded", ()=>{
  const list = document.getElementById("events-list");
  const form = document.getElementById("event-form");
  const seedBtn = document.getElementById("seed-events");
  const KEY = "pp_events_v1";

  const getLS = ()=> JSON.parse(localStorage.getItem(KEY)||"[]");
  const setLS = (v)=> localStorage.setItem(KEY, JSON.stringify(v));

  function render(rows){
    if (!list) return;
    list.innerHTML = rows.map(e=> `
      <article class="event-card reveal">
        <img class="event-img" src="${e.img||'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=1200&auto=format&fit=crop'}" alt="">
        <div class="card" style="border:none;box-shadow:none">
          <h3>${e.title}</h3>
          <p style="color:#64748b">${new Date(e.date).toLocaleString()} • ${e.location}</p>
          <p>${e.desc}</p>
          <a class="btn" href="inbox.html?to=${encodeURIComponent(e.host||'Host')}&item=${encodeURIComponent(e.title)}">Message Host</a>
        </div>
      </article>
    `).join("") || `<div class="card">No meetups yet — create one!</div>`;
  }

  // Page: meetups.html
  if (form && list) {
    const merged = (window._seedEvents||[]).concat(getLS());
    render(merged);

    form.addEventListener("submit", e=>{
      e.preventDefault();
      const row = {
        title: document.getElementById("e-title").value.trim(),
        date: document.getElementById("e-date").value,
        location: document.getElementById("e-location").value.trim(),
        host: document.getElementById("e-host").value.trim() || "Community Host",
        desc: document.getElementById("e-desc").value.trim(),
        img: ""
      };
      const all = getLS(); all.push(row); setLS(all); form.reset();
      render((window._seedEvents||[]).concat(all));
    });

    seedBtn?.addEventListener("click", ()=>{
      localStorage.removeItem(KEY);
      render(window._seedEvents||[]);
    });
  }
});

// optional seed array for home preview
window._seedEvents = [
  {title:"Hyde Park Group Walk", date: new Date(Date.now()+86400000).toISOString(), location:"Hyde Park, London", host:"Sarah Johnson", desc:"Friendly dogs; bring water.", img:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop"},
  {title:"Puppy Social Hour", date: new Date(Date.now()+172800000).toISOString(), location:"Clissold Park, London", host:"Emma Martinez", desc:"For pups under 1yr; on-lead first 15m.", img:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop"},
  {title:"Rescue Meetup & Fundraiser", date: new Date(Date.now()+259200000).toISOString(), location:"Battersea Park", host:"David Wilson", desc:"£5 suggested donation; treats provided.", img:"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop"}
];
