// Sentio Dynamics landing — no dependencies
const CONFIG = {
  // Set your booking link here (Cal.com / Calendly). If empty, we fall back to email.
  BOOKING_URL: "",
  CONTACT_EMAIL: "hello@sentiodynamics.com", // TODO: change to your real inbox
  EMAIL_SUBJECT: "Vertrouwelijke intake — Sentio Dynamics",
  EMAIL_BODY:
`Hoi Krijn,

Ik wil een vertrouwelijke intake aanvragen voor Sentio Dynamics (Onboarding Pulse).

1) Organisatie
- Naam organisatie:
- Website:
- Sector (scale-up / professional services / anders):
- Aantal FTE:
- Aantal aannames per jaar (verwacht):

2) Fit & governance (Intake gates)
- Sponsor Triad: wie zijn Exec / HR / Operations sponsor?
- Cohortgrootte per cluster/team (doel: ≥ 5):
- Is een DPA mogelijk (privacy/legal)?
- Kunnen jullie PII scrubben vóór aanlevering?

3) Context
- Waar gaat het mis in de eerste 90 dagen?
- Kritieke rollen (top 3):
- Huidige early-exit % (90 dagen) (optioneel / schatting):

4) Praktisch
- Voorkeur voor intake-call (2 opties):
- Contactpersoon + telefoon:

Dank!
`
};

// ---- Modal / CTA
const modal = document.getElementById("modal");
const bookLink = document.getElementById("bookLink");
const emailLink = document.getElementById("emailLink");

function openModal(label){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  if(label){
    document.querySelector(".modal-tag").textContent = label;
  }

  const hasBooking = CONFIG.BOOKING_URL && CONFIG.BOOKING_URL.includes("http");
  bookLink.href = hasBooking ? CONFIG.BOOKING_URL : mailtoHref();
  bookLink.textContent = hasBooking ? "Open booking" : "Open e-mail";

  emailLink.href = mailtoHref();
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function mailtoHref(){
  const subject = encodeURIComponent(CONFIG.EMAIL_SUBJECT);
  const body = encodeURIComponent(CONFIG.EMAIL_BODY);
  return `mailto:${CONFIG.CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

document.querySelectorAll('[data-cta="intake"]').forEach((el)=>{
  el.addEventListener("click", (e)=>{
    e.preventDefault();
    openModal("VERTRUWELIJKE INTAKE — FIT & SCOPE");
  });
});

document.querySelectorAll("[data-close]").forEach((el)=>{
  el.addEventListener("click", (e)=>{
    e.preventDefault();
    closeModal();
  });
});

document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

// ---- Mobile nav
const toggle = document.querySelector(".mobile-toggle");
const mobileNav = document.querySelector(".mobile-nav");
if(toggle){
  toggle.addEventListener("click", ()=>{
    const open = mobileNav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
  });
}
document.querySelectorAll(".mobile-nav a").forEach((a)=>{
  a.addEventListener("click", ()=>{
    mobileNav.classList.remove("show");
    toggle?.setAttribute("aria-expanded","false");
  });
});

// ---- Founding badge
(function(){
  const filled = document.getElementById("filledCount");
  const total = document.getElementById("totalCount");
  const badge = document.getElementById("foundingBadge");

  if(!filled || !total || !badge) return;

  if(parseInt(filled.textContent,10) >= parseInt(total.textContent,10)){
    badge.style.display = "none";
  }
})();

// ---- Calculator
const hiresEl = document.getElementById("hires");
const costEl = document.getElementById("cost");
const rateEl = document.getElementById("rate");
const riskEl = document.getElementById("riskValue");

function formatEUR(n){
  const rounded = Math.round(n);
  return "€ " + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function clamp(num, min, max){ return Math.min(Math.max(num, min), max); }

function computeRisk(){
  const hires = clamp(parseFloat(hiresEl.value || "0"), 1, 500);
  const cost = clamp(parseFloat(costEl.value || "0"), 0, 5_000_000);
  const rate = clamp(parseFloat(rateEl.value || "0"), 0, 100) / 100;

  const risk = hires * cost * rate;
  riskEl.textContent = formatEUR(risk);
}

[hiresEl, costEl, rateEl].forEach((el)=>{
  el?.addEventListener("input", computeRisk);
});

document.querySelectorAll(".step").forEach((btn)=>{
  btn.addEventListener("click", ()=>{
    const delta = parseInt(btn.getAttribute("data-step"), 10) || 0;
    hiresEl.value = clamp(parseInt(hiresEl.value || "1", 10) + delta, 1, 500);
    computeRisk();
  });
});

computeRisk();

// ---- Eligibility selector
const eligButtons = document.querySelectorAll(".elig-item");
const eligResult = document.getElementById("eligResult");

function setElig(segment){
  eligButtons.forEach(b => b.classList.toggle("active", b.dataset.segment === segment));
  if(!eligResult) return;

  if(segment === "250-500"){
    eligResult.innerHTML = `
      <div class="elig-title">250–500 FTE: ideale fit.</div>
      <div class="elig-text">Start met Onboarding Pulse (14 dagen) en schaal door naar borging.</div>
      <a class="btn-gold btn-inline" href="#" data-cta="intake">Start intake</a>
    `;
  } else if(segment === "50-250"){
    eligResult.innerHTML = `
      <div class="elig-title">50–250 FTE: mogelijk fit.</div>
      <div class="elig-text">We kunnen starten, maar alleen bij voldoende instroom (cohort) en sponsor-commitment.</div>
      <a class="btn-gold btn-inline" href="#" data-cta="intake">Vraag intake aan</a>
    `;
  } else {
    eligResult.innerHTML = `
      <div class="elig-title">500+ FTE: selectief.</div>
      <div class="elig-text">We doen dit alleen als governance & privacy-voorwaarden snel rond zijn (OR/Legal).</div>
      <a class="btn-gold btn-inline" href="#" data-cta="intake">Vraag intake aan</a>
    `;
  }

  // re-bind CTA inside injected HTML
  eligResult.querySelectorAll('[data-cta="intake"]').forEach((el)=>{
    el.addEventListener("click", (e)=>{ e.preventDefault(); openModal(); });
  });
}

eligButtons.forEach((b)=>{
  b.addEventListener("click", ()=> setElig(b.dataset.segment));
});
setElig("250-500");
