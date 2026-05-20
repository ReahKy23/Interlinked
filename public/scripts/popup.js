function openPopup() {
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

<<<<<<< HEAD
=======

>>>>>>> gabrielle
//JS function pulled from previous project of Gabby's to emulate a typing animation
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("blurb");
  if (!el) return;

  const fullText = el.textContent.trim();
  el.textContent = ""; 

  let started = false;

  function typeIt() {
    if (started) return;
    started = true;

    let i = 0;
    const speed = 10; 

    const tick = () => {
      el.textContent = fullText.slice(0, i);
      i++;
      if (i <= fullText.length) setTimeout(tick, speed);
      else el.classList.add("typed");
    };

    tick();
  }

  document.addEventListener("pointerdown", typeIt, { once: true });

  setTimeout(typeIt, 400);
});