// ---------------------------------------------------------------
// Turismo Isabel — main.js
// ---------------------------------------------------------------

// Header: solid background after scrolling past the hero
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 60);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// In-page anchor links (nav, hero buttons, scroll cue, footer brand, etc.):
// scroll to the target ourselves and strip the #hash from the address bar
// afterwards, instead of letting the browser jump there natively and leave
// #section sitting in the URL.
const scrollToHash = (hash, { updateHistory = true } = {}) => {
  const id = hash.replace('#', '');
  const target = id ? document.getElementById(id) : null;
  const headerOffset = header.offsetHeight + 16; // small breathing room below the fixed header
  const top = target
    ? target.getBoundingClientRect().top + window.scrollY - headerOffset
    : 0;

  window.scrollTo({ top: Math.max(top, 0), behavior: prefersReducedMotion ? 'auto' : 'smooth' });

  if (updateHistory) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
};

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  scrollToHash(link.getAttribute('href'));
});

// If someone lands directly on a link with a #hash (an old bookmark, a
// link shared before this change, etc.), scroll to that section once,
// accounting for the fixed header, then clean the hash from the URL.
if (window.location.hash) {
  window.addEventListener('load', () => scrollToHash(window.location.hash));
}

// Hero background parallax — the photo drifts down as you scroll,
// so it visually sinks behind the wave divider instead of just cutting off.
const heroSection = document.querySelector('.hero');
const heroMedia = document.querySelector('.hero-media');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroSection && heroMedia && !prefersReducedMotion) {
  let heroTicking = false;
  const updateHeroParallax = () => {
    const rect = heroSection.getBoundingClientRect();
    const scrolledIntoHero = Math.min(Math.max(-rect.top, 0), rect.height);
    heroMedia.style.transform = `translateY(${scrolledIntoHero * 0.35}px)`;
    heroTicking = false;
  };
  updateHeroParallax();
  window.addEventListener('scroll', () => {
    if (!heroTicking) {
      window.requestAnimationFrame(updateHeroParallax);
      heroTicking = true;
    }
  }, { passive: true });
}

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------------------------------------------------------
// Quote form -> Google Forms
// The <form id="quoteForm"> posts directly to the Google Form's
// /formResponse endpoint. Google Forms doesn't allow fetch() from
// other origins (no CORS), so instead the form targets a hidden
// <iframe id="hidden_iframe"> — that keeps the page from navigating
// away, and we show the confirmation in #formNote once the iframe
// finishes loading (which happens right after Google processes it).
// If you ever need to change a field, match its `name="entry.…"` to
// the corresponding question in the Google Form (Form →⋮→ "Get
// pre-filled link" is the easiest way to find each entry ID).
// ---------------------------------------------------------------
const quoteForm = document.getElementById('quoteForm');
const formNote = document.getElementById('formNote');
const formNoteDefault = formNote ? formNote.textContent : '';
const hiddenIframe = document.getElementById('hidden_iframe');
const fechaInput = document.getElementById('fecha');

// No permitir elegir una fecha anterior a hoy
if (fechaInput) {
  fechaInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

if (quoteForm) {
  const submitBtn = quoteForm.querySelector('button[type="submit"]');
  const submitBtnDefault = submitBtn ? submitBtn.textContent : '';
  let isSubmitting = false;

  quoteForm.addEventListener('submit', () => {
    // Dejamos que la validación nativa de HTML5 (required, etc.) actúe:
    // si el formulario no es válido, el navegador cancela el submit y
    // este bloque no llega a ejecutarse.
    if (!quoteForm.checkValidity()) return;

    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
  });

  if (hiddenIframe) {
    hiddenIframe.addEventListener('load', () => {
      if (!isSubmitting) return;
      isSubmitting = false;

      quoteForm.reset();
      formNote.textContent = '¡Listo! Recibimos tu consulta, te contestamos por email a la brevedad.';
      formNote.classList.add('is-success');
      formNote.classList.remove('is-error');

      submitBtn.disabled = false;
      submitBtn.textContent = submitBtnDefault;

      setTimeout(() => {
        formNote.textContent = formNoteDefault;
        formNote.classList.remove('is-success');
      }, 8000);
    });
  }
}
