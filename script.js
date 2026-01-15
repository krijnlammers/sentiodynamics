// Sentio Dynamics — Versie 6.3 Financiële Pijn & Gatekeeper
const CONFIG = {
  CONTACT_EMAIL: "hello@sentiodynamics.com",
  EMAIL_SUBJECT: "Intake-aanvraag Sentio Dynamics (Onboarding Pulse)",
  EMAIL_BODY: `Beste Krijn,

Graag plannen we een vertrouwelijke intake in om de Onboarding Pulse te verkennen.

Om goed voor te bereiden, delen we alvast:
- Organisatieomvang (FTE):
- Teams/rollen in scope:
- Instroom per kwartaal (aantal aannames):
- Gemiddelde early-exit inschatting (optioneel):

Ik hoor graag wanneer een korte afstemming schikt.

Met vriendelijke groet,`
};


// --- Modal & CTA Logic ---
const modal = document.getElementById("modal");
const emailLink = document.getElementById("emailLink");

function openModal() {
  if(!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  const subject = encodeURIComponent(CONFIG.EMAIL_SUBJECT);
  const body = encodeURIComponent(CONFIG.EMAIL_BODY);
  emailLink.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function closeModal() {
  if(!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll('[data-cta="intake"]').forEach(el => {
  el.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
});

document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener("click", closeModal);
});

// --- ROI Calculator Logic (v6.3: Factor 5.0 voor Replacement) ---
const hiresEl = document.getElementById("hires");
const salaryEl = document.getElementById("salary");
const rateEl = document.getElementById("rate");
const hireTypeEl = document.getElementById("hireType");
const riskEl = document.getElementById("riskValue");
const warningEl = document.getElementById("replacementWarning");

function formatEUR(n) {
  return "€ " + Math.round(n).toLocaleString('nl-NL');
}

function computeRisk() {
  if(!hiresEl || !salaryEl || !rateEl || !riskEl) return;

  const hires = parseFloat(hiresEl.value || 0);
  const salary = parseFloat(salaryEl.value || 0);
  const rate = parseFloat(rateEl.value || 0) / 100;
  const type = hireTypeEl.value;

  let riskFactor = 3.5;
  if (type === 'replacement') {
    riskFactor = 5.0;
    warningEl.style.display = 'block';
  } else {
    warningEl.style.display = 'none';
  }

  const totalRisk = hires * rate * (salary * riskFactor);
  riskEl.textContent = formatEUR(totalRisk);
}

[hiresEl, salaryEl, rateEl, hireTypeEl].forEach(el => el?.addEventListener("input", computeRisk));
[hiresEl, salaryEl, rateEl, hireTypeEl].forEach(el => el?.addEventListener("change", computeRisk));

document.querySelectorAll(".step").forEach(btn => {
  btn.addEventListener("click", () => {
    const delta = parseInt(btn.getAttribute("data-step"));
    hiresEl.value = Math.max(1, parseInt(hiresEl.value || 0) + delta);
    computeRisk();
  });
});

// --- Eligibility Logic (Poortwachter) ---
const eligButtons = document.querySelectorAll(".elig-item");
const eligResult = document.getElementById("eligResult");

function setElig(segment) {
  eligButtons.forEach(b => b.classList.toggle("active", b.dataset.segment === segment));
  if(!eligResult) return;

  let html = "";
  switch(segment) {
    case "<50":
      html = `
        <div class="elig-title" style="color: #e11d48;">ROOD: Buiten Scope</div>
        <div class="elig-text">Vanwege "Data Sparsity" kunnen wij geen betrouwbare Agentic Drafts genereren voor organisaties onder de 50 FTE.</div>
      `;
      break;
    case "50-250":
      html = `
        <div class="elig-title" style="color: #f59e0b;">ORANJE: Beperkt</div>
        <div class="elig-text">Werkt vooral bij terugkerende instroom en duidelijke scope (teams/rollen). Cohortmeting (n ≥ 5) is nodig voor diepere SDT-inzichten.</div>
        <a class="btn-gold btn-inline" href="#" id="dynamicIntakeBtn">Vraag intake aan</a>
      `;
      break;
    case "250-500":
      html = `
        <div class="elig-title" style="color: #10b981;">GROEN: Ideale Fit</div>
        <div class="elig-text">Mid-Market Scale-Up. Optimale balans voor Engine 2. Start direct met de Onboarding Pulse.</div>
        <a class="btn-gold btn-inline" href="#" id="dynamicIntakeBtn">Start intake</a>
      `;
      break;
    case "500+":
      html = `
        <div class="elig-title" style="color: #f59e0b;">ORANJE: Selectief</div>
        <div class="elig-text">Werkt goed als scope en besluitvorming vooraf helder zijn (welke teams/rollen, wie accordeert acties).</div>
        <a class="btn-gold btn-inline" href="#" id="dynamicIntakeBtn">Toets beschikbaarheid</a>
      `;
      break;
  }
  eligResult.innerHTML = html;
  const dynamicBtn = document.getElementById("dynamicIntakeBtn");
  if(dynamicBtn) dynamicBtn.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
}

eligButtons.forEach(b => b.addEventListener("click", () => setElig(b.dataset.segment)));

document.addEventListener("DOMContentLoaded", () => {
  setElig("250-500");
  computeRisk();
});

document.addEventListener("DOMContentLoaded", () => {
  const currentFilled = 3; // De centrale bron voor de status
  const heroFilled = document.getElementById("filledCount");
  const finaleFilled = document.getElementById("filledCountFinale");

  if(heroFilled) heroFilled.textContent = currentFilled;
  if(finaleFilled) finaleFilled.textContent = currentFilled;
});



/* v6.14.2 PATCH: mobile menu toggle (hamburger) */
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".mobile-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    nav.setAttribute("aria-hidden", isOpen ? "false" : "true");
  });

  // close menu when a link is clicked
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", function () {
      nav.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      nav.setAttribute("aria-hidden", "true");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".hamburger, .menu-toggle");
  const menu = document.querySelector(".nav-links, .mobile-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }
});
