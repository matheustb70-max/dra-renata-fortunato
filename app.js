(() => {
  'use strict';
  if (window.lucide) window.lucide.createIcons();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  function setMenu(open, returnFocus = false) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    toggle.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" aria-hidden="true"></i>`;
    if (window.lucide) window.lucide.createIcons();
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true); });
  document.addEventListener('click', e => { if (!e.composedPath().includes(document.querySelector('.header')) && toggle.getAttribute('aria-expanded') === 'true') setMenu(false); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  const closingTimers = new WeakMap();
  function setAccordion(button, open) {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    clearTimeout(closingTimers.get(panel));
    button.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
    panel.classList.toggle('is-open', open);
    panel.classList.toggle('is-closing', !open);
    if (!open) closingTimers.set(panel, setTimeout(() => panel.classList.remove('is-closing'), reducedMotion.matches ? 0 : 380));
  }
  document.querySelectorAll('[data-accordion-group]').forEach(group => {
    group.addEventListener('click', e => {
      const trigger = e.target.closest('.accordion-trigger');
      if (!trigger) return;
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      group.querySelectorAll('.accordion-trigger[aria-expanded="true"]').forEach(button => { if (button !== trigger) setAccordion(button, false); });
      setAccordion(trigger, open);
    });
  });

  const track = document.querySelector('.review-track');
  const cards = [...track.children];
  const prev = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  const status = document.querySelector('.carousel-status');
  let targetIndex = 0;
  const getStep = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const getVisible = () => Math.max(1, Math.round(track.clientWidth / getStep()));
  function updateCarousel() {
    const i = Math.round(track.scrollLeft / getStep());
    const visible = getVisible();
    prev.disabled = track.scrollLeft < 3;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 3;
    status.textContent = visible === 1 ? `${i + 1} de ${cards.length}` : `${i + 1}–${Math.min(i + visible, cards.length)} de ${cards.length}`;
  }
  function moveTo(index) {
    targetIndex = Math.max(0, Math.min(index, cards.length - getVisible()));
    track.scrollTo({left: targetIndex * getStep(), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }
  prev.addEventListener('click', () => moveTo(targetIndex - 1));
  next.addEventListener('click', () => moveTo(targetIndex + 1));
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); moveTo(targetIndex + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); moveTo(targetIndex - 1); }
    if (e.key === 'Home') { e.preventDefault(); moveTo(0); }
    if (e.key === 'End') { e.preventDefault(); moveTo(cards.length - 1); }
  });
  track.addEventListener('scroll', updateCarousel, {passive:true});
  track.addEventListener('scrollend', () => { targetIndex = Math.round(track.scrollLeft / getStep()); updateCarousel(); });
  new ResizeObserver(() => { targetIndex = Math.min(targetIndex, cards.length - getVisible()); moveTo(targetIndex); updateCarousel(); }).observe(track);
  updateCarousel();

  const whatsapp = 'https://wa.me/5548991214343?text=' + encodeURIComponent('Olá, gostaria de agendar uma consulta com a Dra. Renata Fortunato.');
  document.querySelectorAll('[data-whatsapp]').forEach(a => { a.href = whatsapp; });
})();
