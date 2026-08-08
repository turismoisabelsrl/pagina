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

// No permitir elegir una fecha anterior a hoy en el formulario de cotización
const fechaInput = document.getElementById('fecha');
if (fechaInput) {
  fechaInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

// ---------------------------------------------------------------
// Ayudante compartido para mostrar/ocultar la nota de estado bajo
// cada formulario (vuelve sola al texto por defecto a los 8s).
// ---------------------------------------------------------------
function makeNoteHelper(note) {
  const noteDefault = note ? note.textContent : '';
  let timer = null;
  return function showNote(text, type) {
    if (!note) return;
    clearTimeout(timer);
    note.textContent = text;
    note.classList.remove('is-success', 'is-error');
    if (type) note.classList.add(type);
    timer = setTimeout(() => {
      note.textContent = noteDefault;
      note.classList.remove('is-success', 'is-error');
    }, 8000);
  };
}

const fieldValue = (form, id) => (form.querySelector('#' + id)?.value || '').trim();

// ---------------------------------------------------------------
// COTIZACIÓN
// "Enviar por email" postea al Google Form de siempre (vía el
// <iframe id="hidden_iframe"> oculto, para no salir de la página).
// "Enviar por WhatsApp" abre wa.me con los datos ya redactados.
// Si en algún momento cambia el Google Form, actualizá el `action`
// del <form id="quoteForm"> y los `name="entry.…"` de cada input
// (Form → ⋮ → "Obtener enlace con campos completados" para ver
// cada entry ID).
// ---------------------------------------------------------------
(function setupQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const showNote = makeNoteHelper(document.getElementById('formNote'));
  const emailBtn = form.querySelector('[data-send="email"]');
  const waBtn = form.querySelector('[data-send="whatsapp"]');
  const emailBtnDefault = emailBtn ? emailBtn.textContent : '';
  const hiddenIframe = document.getElementById('hidden_iframe');
  let isSubmitting = false;

  form.addEventListener('submit', () => {
    // Dejamos que la validación nativa de HTML5 actúe: si el formulario
    // no es válido, el navegador cancela el submit y esto no se ejecuta.
    if (!form.checkValidity()) return;
    isSubmitting = true;
    if (emailBtn) { emailBtn.disabled = true; emailBtn.textContent = 'Enviando…'; }
    if (waBtn) waBtn.disabled = true;
  });

  if (hiddenIframe) {
    hiddenIframe.addEventListener('load', () => {
      if (!isSubmitting) return;
      isSubmitting = false;
      form.reset();
      showNote('¡Listo! Recibimos tu consulta, te contestamos por email a la brevedad.', 'is-success');
      if (emailBtn) { emailBtn.disabled = false; emailBtn.textContent = emailBtnDefault; }
      if (waBtn) waBtn.disabled = false;
    });
  }

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const text = [
        'Hola! Quiero pedir una cotización:',
        `Nombre: ${fieldValue(form, 'nombre')}`,
        `Email: ${fieldValue(form, 'email')}`,
        `Celular: ${fieldValue(form, 'celular')}`,
        `Fecha: ${fieldValue(form, 'fecha')}`,
        `Origen: ${fieldValue(form, 'origen')}`,
        `Destino: ${fieldValue(form, 'destino')}`,
        `Horario ida: ${fieldValue(form, 'horaIda')}`,
        `Horario vuelta: ${fieldValue(form, 'horaVuelta')}`,
        `Pasajeros: ${fieldValue(form, 'pasajeros')}`,
        `Notas: ${fieldValue(form, 'mensaje') || '-'}`,
      ].join('\n');
      window.open(`https://wa.me/5491151821276?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      showNote('Se abrió WhatsApp con tus datos cargados.', 'is-success');
    });
  }
})();

// ---------------------------------------------------------------
// POSTULACIONES
// "Enviar por email" abre el cliente de mail (mailto) con asunto y
// cuerpo precargados. "Enviar por WhatsApp" abre wa.me. Ninguno de
// los dos puede llevar el CV adjunto automáticamente (ni mailto ni
// wa.me soportan archivos por URL) — por eso, si el postulante eligió
// un archivo, se lo recordamos en la nota debajo de los botones.
// Cambiá el mail de destino más abajo si RRHH usa una casilla
// distinta a la que está puesta.
// ---------------------------------------------------------------
(function setupPostulacionForm() {
  const form = document.getElementById('postulacionForm');
  if (!form) return;

  const showNote = makeNoteHelper(document.getElementById('postulacionFormNote'));
  const waBtn = form.querySelector('[data-send="whatsapp"]');
  const fileInput = form.querySelector('input[type="file"]');
  const destinoMail = 'turismoisabelrrhh@gmail.com';

  const buildMessage = () => {
    const hasFile = !!(fileInput && fileInput.files && fileInput.files.length);
    const lines = [
      `Nombre: ${fieldValue(form, 'postNombre')}`,
      `Email: ${fieldValue(form, 'postEmail')}`,
      `Teléfono: ${fieldValue(form, 'postTelefono')}`,
      `Experiencia: ${fieldValue(form, 'postExperiencia') || '-'}`,
    ];
    return { lines, hasFile };
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const { lines, hasFile } = buildMessage();
    const subject = encodeURIComponent('Postulación Chofer - Turismo Isabel');
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:${destinoMail}?subject=${subject}&body=${body}`;

    showNote(
      hasFile
        ? 'Se abrió tu mail con tus datos — no te olvides de adjuntar el CV antes de enviarlo.'
        : 'Se abrió tu mail con tus datos cargados.',
      'is-success'
    );
  });

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const { lines, hasFile } = buildMessage();
      const text = ['Hola! Quiero postularme como chofer:', ...lines].join('\n');
      window.open(`https://wa.me/5491151821276?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      showNote(
        hasFile
          ? 'Se abrió WhatsApp con tus datos — no te olvides de adjuntar el CV en el chat.'
          : 'Se abrió WhatsApp con tus datos cargados.',
        'is-success'
      );
    });
  }
})();
