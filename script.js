// Sentio Dynamics — Versie 6.3 Financiële Pijn & Gatekeeper
const CONFIG = {
  CONTACT_EMAIL: "hello@sentiodynamics.com",
  EMAIL_SUBJECT: "Intake-aanvraag Sentio Dynamics (Fit & Governance)",
  EMAIL_BODY: `Beste Krijn,

Graag plannen we een vertrouwelijke intake in om de mogelijkheden van de Onboarding Pulse te verkennen. 

We willen graag de volgende kaders toetsen conform het Mobilisatie-model:

1) Governance (Sponsor Triad)
- Beoogde Executive Sponsor: 
- Beoogde HR Sponsor: 
- Beoogde Ops Sponsor: 

2) Data Scope
- Organisatieomvang (FTE): 
- Geschat kwartaal-cohort (n): 

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
        <div class="elig-text">Risico op "Service Trap". Start alleen mogelijk bij bewezen cohort ≥ 5 en Sponsor Triad commitment.</div>
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
        <div class="elig-text">Vanwege Cashflow Risk uitsluitend na juridische pre-approval op DPA en Kick-off Fee.</div>
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
