// Auto-load shared UI (dark mode + FAB)
(function(){ if(!window.__ppUiLoaded){ window.__ppUiLoaded=true; var s=document.createElement('script'); s.defer=true; s.src='assets/js/ui.js'; document.head.appendChild(s);} })();

// ===== Walker Dashboard Logic (no secrets; Stripe-ready placeholders) =====
document.addEventListener("DOMContentLoaded", () => {
  const PLAN_KEY = "pp_walker_plan";   // "free" | "pro"
  const RENEW_KEY = "pp_walker_renew"; // ISO date
  const REQ_KEY  = "pp_monthly_req";   // number

  // Elements
  const planBadge = document.getElementById("planBadge");
  const reqSlider = document.getElementById("reqSlider");
  const reqLabel  = document.getElementById("reqLabel");
  const renewal   = document.getElementById("renewalDate");
  const upgrade   = document.getElementById("upgradeBtn");
  const verifyBtn = document.getElementById("verifyBtn");
  const verifyNote= document.getElementById("verifyNote");

  // Load state
  const plan   = localStorage.getItem(PLAN_KEY) || "free";
  const renew  = localStorage.getItem(RENEW_KEY) || "";
  const reqVal = Number(localStorage.getItem(REQ_KEY) || 300);

  // Apply plan UI
  function renderPlan(){
    planBadge.textContent = (plan === "pro") ? "Walker Pro" : "Free Plan";
    if (renew) renewal.textContent = "Renews: " + new Date(renew).toLocaleDateString();
    if (plan === "pro") {
      upgrade.textContent = "Manage in Stripe";
      upgrade.classList.add("btn-outline");
      upgrade.classList.remove("btn");
      verifyBtn.textContent = "Verified ✓";
      verifyBtn.disabled = true;
      verifyNote.textContent = "Your Verified badge is live across the platform.";
    }
  }

  // Requests slider
  reqSlider.value = reqVal;
  const updateReq = () => {
    reqLabel.textContent = `${reqSlider.value} / ${reqSlider.max}`;
    localStorage.setItem(REQ_KEY, reqSlider.value);
  };
  updateReq();
  reqSlider.addEventListener("input", updateReq);

  // Lightweight sparkline renderers
  document.querySelectorAll(".spark").forEach(el=>{
    const data = (el.getAttribute("data-spark")||"").split(",").map(n=>Number(n.trim()));
    const c = document.createElement("canvas"); el.appendChild(c);
    const ctx = c.getContext("2d"); const w=el.clientWidth, h=el.clientHeight;
    c.width=w; c.height=h;
    const max = Math.max(...data,1), min = Math.min(...data,0);
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth=2; ctx.beginPath();
    data.forEach((v,i)=>{
      const x = (i/(data.length-1||1))*w;
      const y = h - ((v-min)/(max-min||1))*h;
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    });
    ctx.stroke();
    // glow
    const grad = ctx.createLinearGradient(0,0,w,0);
    grad.addColorStop(0,"rgba(106,123,255,.45)");
    grad.addColorStop(1,"rgba(255,79,163,.45)");
    ctx.strokeStyle=grad; ctx.lineWidth=3; ctx.stroke();
  });

  // Upgrade to Pro (Stripe-ready placeholder)
  upgrade.addEventListener("click", ()=>{
    if (localStorage.getItem(PLAN_KEY) === "pro") {
      alert("Manage your subscription in Stripe (demo).");
      return;
    }
    // In production: redirect to Stripe Checkout session URL returned by your server.
    // window.location.href = "YOUR_CHECKOUT_URL";
    const ok = confirm("Upgrade to Walker Pro for £25/month via Stripe? (Demo)");
    if (!ok) return;
    localStorage.setItem(PLAN_KEY, "pro");
    localStorage.setItem(RENEW_KEY, new Date(Date.now()+30*24*3600*1000).toISOString());
    renderPlan();
    alert("🎉 You’re Pro! Verified badge enabled.");
  });

  // Verify via Stripe (shortcut to same flow)
  verifyBtn.addEventListener("click", ()=>{
    if (localStorage.getItem(PLAN_KEY) === "pro") return;
    upgrade.click();
  });

  renderPlan();
});
