// minimal modal trigger
document.querySelectorAll('[data-cta="intake"]').forEach(el=>{
  el.addEventListener('click',e=>{
    e.preventDefault();
    window.location.href='mailto:intake@sentiodynamics.com';
  });
});
