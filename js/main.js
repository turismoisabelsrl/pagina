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
const navOverlay = document.getElementById('navOverlay');

const openNav = () => {
  mainNav.classList.add('is-open');
  hamburger.classList.add('is-active');
  if (navOverlay) navOverlay.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
};
const closeNav = () => {
  mainNav.classList.remove('is-open');
  hamburger.classList.remove('is-active');
  if (navOverlay) navOverlay.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
};

hamburger.addEventListener('click', () => {
  if (mainNav.classList.contains('is-open')) closeNav(); else openNav();
});

// Tocar afuera (el fondo oscuro) también cierra el menú
if (navOverlay) navOverlay.addEventListener('click', closeNav);

// Escape cierra el menú si está abierto
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
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

// No permitir elegir una fecha anterior a hoy en el formulario de cotización
const fechaInput = document.getElementById('fecha');
if (fechaInput) {
  fechaInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

// ---------------------------------------------------------------
// IDIOMAS
// Selector de idioma (banderitas) en el header: cambia todo el texto
// visible de la página entre español, inglés y portugués sin recargar.
// Si querés ajustar alguna traducción, es acá abajo, en `translations`.
// Para agregar un idioma nuevo: 1) sumar sus claves a `translations`,
// 2) agregar el botón <button class="lang-btn" data-lang="xx"> en el
// HTML dentro de #langSwitch, con su bandera en SVG.
// ---------------------------------------------------------------
const translations = {
  es: {
    'meta.title': 'Turismo Isabel — Transporte de pasajeros en combi | Buenos Aires',
    'a11y.skip': 'Saltar al contenido',
    'a11y.openMenu': 'Abrir menú',
    'a11y.scrollDown': 'Bajar a la siguiente sección',
    'a11y.social': 'Redes sociales',
    'nav.flota': 'Flota',
    'nav.confianza': 'Habilitaciones',
    'nav.cotizacion': 'Cotización',
    'nav.postulaciones': 'Postulaciones',
    'nav.contacto': 'Contacto',
    'hero.title': 'Más que un transporte,<br>una experiencia.',
    'hero.ctaQuote': 'Solicitar cotización',
    'hero.ctaSales': 'Atención Comercial',
    'flota.eyebrow': 'Unidades Propias · Mantenimiento y Control Diario',
    'flota.title': 'Nuestra Flota',
    'flota.lead': 'Contamos con combis modernas, con capacidad para 19 y 24 pasajeros. Nuestros choferes profesionales están certificados para garantizarte un servicio seguro y de máxima confianza.',
    'flota.spec.gps': 'Monitoreo por GPS',
    'flota.spec.passengers': 'Pasajeros',
    'flota.spec.ac': 'Aire Acondicionado y Calefacción',
    'flota.spec.mic': 'Micrófono',
    'flota.spec.desk': 'Mesa operativa',
    'confianza.eyebrow': 'Viajá con total tranquilidad',
    'confianza.title': 'Habilitaciones',
    'confianza.lead': 'En Turismo Isabel contamos con todas las habilitaciones para operar tanto en destinos nacionales como internacionales.',
    'confianza.national': 'Habilitaciones Nacionales',
    'confianza.international': 'Habilitaciones Internacionales',
    'cotizacion.title': 'Solicita tu cotización',
    'cotizacion.lead': 'Para ofrecerte la mejor cotización posible, completá el siguiente formulario con la información de tu viaje. Cuanto más detalles nos brindes, más precisa será nuestra propuesta. En Turismo Isabel nuestro compromiso es ofrecerte un servicio de calidad, eficiente y hecho a tu medida.',
    'cotizacion.note': 'Elegí cómo preferís enviarnos tu consulta.',
    'form.name': 'Nombre completo *',
    'form.namePlaceholder': 'Tu nombre completo',
    'form.email': 'Email *',
    'form.cell': 'Celular *',
    'form.phone': 'Teléfono *',
    'form.date': 'Fecha del viaje *',
    'form.origin': 'Origen (exacto) *',
    'form.originPlaceholder': 'Dirección o punto de partida',
    'form.destination': 'Destino (exacto) *',
    'form.destinationPlaceholder': 'Dirección o punto de llegada',
    'form.timeOut': 'Horario de ida *',
    'form.timeReturn': 'Horario de vuelta *',
    'form.passengerCount': 'Cantidad de pasajeros *',
    'form.passengerCountPlaceholder': 'Ej: 20',
    'form.notes': 'Notas',
    'form.notesPlaceholder': 'Tipo de servicio, paradas, o cualquier detalle que ayude a cotizar mejor',
    'form.sendEmail': 'Enviar por email',
    'form.sendWhatsapp': 'Enviar por WhatsApp',
    'postulaciones.eyebrow': '¿Manejás profesionalmente?',
    'postulaciones.title': 'Podés ser parte de nuestro equipo',
    'postulaciones.lead': 'Si tenés experiencia en transporte de pasajeros, contanos sobre vos y dejanos tu CV. Nos vamos a contactar en caso de necesitar coordinar una entrevista.',
    'postulaciones.cv': 'CV',
    'postulaciones.registro': 'Registro',
    'postulaciones.attachHint': 'Adjuntalo vos en el mail o WhatsApp que se abra al enviar este formulario.',
    'postulaciones.experienceLabel': 'Contanos tu experiencia',
    'postulaciones.experiencePlaceholder': 'Años de experiencia, tipo de licencia, rutas o servicios habituales, etc.',
    'postulaciones.note': 'Ni el mail ni WhatsApp pueden llevar los archivos adjuntos — acordate de mandar el CV y el Registro ahí una vez que se abra.',
    'contacto.eyebrow': 'Estamos para ayudarte',
    'contacto.title': 'Hablemos',
    'contacto.lead': 'Escribinos por el medio que prefieras — te contestamos a la brevedad, todos los días dentro de nuestro horario de atención.',
    'contacto.whatsappCta': 'Escribinos por WhatsApp',
    'footer.location': 'Ubicación',
    'footer.hours': 'Horarios de atención',
    'footer.hoursWeekday': 'Lunes a viernes de 6 a 19hs',
    'footer.hoursSaturday': 'Sábados de 7 a 19hs',
    'footer.hoursSunday': 'Domingo de 7 a 14hs',
    'footer.copyright': '© {year} Turismo Isabel. Todos los derechos reservados.',
    'msg.quoteGreeting': 'Hola! Quiero pedir una cotización:',
    'msg.name': 'Nombre',
    'msg.email': 'Email',
    'msg.cell': 'Celular',
    'msg.date': 'Fecha',
    'msg.origin': 'Origen',
    'msg.destination': 'Destino',
    'msg.timeOut': 'Horario ida',
    'msg.timeReturn': 'Horario vuelta',
    'msg.passengers': 'Pasajeros',
    'msg.notes': 'Notas',
    'msg.sending': 'Enviando…',
    'msg.quoteEmailSuccess': '¡Listo! Recibimos tu consulta, te contestamos por email a la brevedad.',
    'msg.quoteWaSuccess': 'Se abrió WhatsApp con tus datos cargados.',
    'msg.postGreeting': 'Hola! Quiero postularme como chofer:',
    'msg.phone': 'Teléfono',
    'msg.experience': 'Experiencia',
    'msg.postSubject': 'Postulación Chofer - Turismo Isabel',
    'msg.postEmailSuccess': 'Se abrió tu mail con tus datos — no te olvides de adjuntar el CV y el Registro antes de enviarlo.',
    'msg.postWaSuccess': 'Se abrió WhatsApp con tus datos — no te olvides de adjuntar el CV y el Registro en el chat.',
  },
  en: {
    'meta.title': 'Turismo Isabel — Passenger Van Transportation | Buenos Aires',
    'a11y.skip': 'Skip to content',
    'a11y.openMenu': 'Open menu',
    'a11y.scrollDown': 'Scroll to next section',
    'a11y.social': 'Social media',
    'nav.flota': 'Fleet',
    'nav.confianza': 'Permits',
    'nav.cotizacion': 'Get a Quote',
    'nav.postulaciones': 'Careers',
    'nav.contacto': 'Contact',
    'hero.title': 'More than transportation,<br>an experience.',
    'hero.ctaQuote': 'Request a Quote',
    'hero.ctaSales': 'Contact Sales',
    'flota.eyebrow': 'Company-Owned Fleet · Daily Maintenance & Inspection',
    'flota.title': 'Our Fleet',
    'flota.lead': 'We operate modern vans with capacity for 19 and 24 passengers. Our professional drivers are certified to guarantee you a safe, dependable service.',
    'flota.spec.gps': 'GPS Monitoring',
    'flota.spec.passengers': 'Passengers',
    'flota.spec.ac': 'Air Conditioning & Heating',
    'flota.spec.mic': 'Microphone',
    'flota.spec.desk': 'Onboard operations table',
    'confianza.eyebrow': 'Travel with complete peace of mind',
    'confianza.title': 'Permits & Certifications',
    'confianza.lead': 'At Turismo Isabel we hold every permit needed to operate both domestic and international routes.',
    'confianza.national': 'National Permits',
    'confianza.international': 'International Permits',
    'cotizacion.title': 'Request Your Quote',
    'cotizacion.lead': "To give you the best possible quote, fill out the form below with your trip details. The more information you share, the more accurate our proposal will be. At Turismo Isabel our commitment is a quality, efficient service built around you.",
    'cotizacion.note': "Choose how you'd like to send us your request.",
    'form.name': 'Full name *',
    'form.namePlaceholder': 'Your full name',
    'form.email': 'Email *',
    'form.cell': 'Cell phone *',
    'form.phone': 'Phone *',
    'form.date': 'Trip date *',
    'form.origin': 'Pickup address *',
    'form.originPlaceholder': 'Address or starting point',
    'form.destination': 'Drop-off address *',
    'form.destinationPlaceholder': 'Address or destination',
    'form.timeOut': 'Departure time *',
    'form.timeReturn': 'Return time *',
    'form.passengerCount': 'Number of passengers *',
    'form.passengerCountPlaceholder': 'E.g.: 20',
    'form.notes': 'Notes',
    'form.notesPlaceholder': 'Type of service, stops, or any detail that helps us quote accurately',
    'form.sendEmail': 'Send by email',
    'form.sendWhatsapp': 'Send via WhatsApp',
    'postulaciones.eyebrow': 'Do you drive professionally?',
    'postulaciones.title': 'You could be part of our team',
    'postulaciones.lead': "If you have experience in passenger transport, tell us about yourself and send us your résumé. We'll reach out if we need to schedule an interview.",
    'postulaciones.cv': 'Résumé',
    'postulaciones.registro': "Driver's license",
    'postulaciones.attachHint': 'Attach it yourself to the email or WhatsApp chat that opens when you send this form.',
    'postulaciones.experienceLabel': 'Tell us about your experience',
    'postulaciones.experiencePlaceholder': 'Years of experience, license type, usual routes or services, etc.',
    'postulaciones.note': "Neither email nor WhatsApp can carry file attachments automatically — remember to send your résumé and license once it opens.",
    'contacto.eyebrow': "We're here to help",
    'contacto.title': "Let's talk",
    'contacto.lead': "Write to us through whichever channel you prefer — we'll reply promptly, every day within our business hours.",
    'contacto.whatsappCta': 'Message us on WhatsApp',
    'footer.location': 'Location',
    'footer.hours': 'Business hours',
    'footer.hoursWeekday': 'Monday to Friday, 6 AM–7 PM',
    'footer.hoursSaturday': 'Saturdays, 7 AM–7 PM',
    'footer.hoursSunday': 'Sundays, 7 AM–2 PM',
    'footer.copyright': '© {year} Turismo Isabel. All rights reserved.',
    'msg.quoteGreeting': "Hi! I'd like to request a quote:",
    'msg.name': 'Name',
    'msg.email': 'Email',
    'msg.cell': 'Cell phone',
    'msg.date': 'Date',
    'msg.origin': 'Pickup',
    'msg.destination': 'Drop-off',
    'msg.timeOut': 'Departure time',
    'msg.timeReturn': 'Return time',
    'msg.passengers': 'Passengers',
    'msg.notes': 'Notes',
    'msg.sending': 'Sending…',
    'msg.quoteEmailSuccess': 'Done! We received your request and will reply by email shortly.',
    'msg.quoteWaSuccess': 'WhatsApp opened with your details.',
    'msg.postGreeting': "Hi! I'd like to apply as a driver:",
    'msg.phone': 'Phone',
    'msg.experience': 'Experience',
    'msg.postSubject': 'Driver Application - Turismo Isabel',
    'msg.postEmailSuccess': 'Your email app opened with your details — remember to attach your résumé and license before sending.',
    'msg.postWaSuccess': 'WhatsApp opened with your details — remember to attach your résumé and license in the chat.',
  },
  pt: {
    'meta.title': 'Turismo Isabel — Transporte de Passageiros em Van | Buenos Aires',
    'a11y.skip': 'Pular para o conteúdo',
    'a11y.openMenu': 'Abrir menu',
    'a11y.scrollDown': 'Descer para a próxima seção',
    'a11y.social': 'Redes sociais',
    'nav.flota': 'Frota',
    'nav.confianza': 'Licenças',
    'nav.cotizacion': 'Orçamento',
    'nav.postulaciones': 'Trabalhe Conosco',
    'nav.contacto': 'Contato',
    'hero.title': 'Mais que um transporte,<br>uma experiência.',
    'hero.ctaQuote': 'Solicitar orçamento',
    'hero.ctaSales': 'Atendimento Comercial',
    'flota.eyebrow': 'Frota Própria · Manutenção e Controle Diário',
    'flota.title': 'Nossa Frota',
    'flota.lead': 'Contamos com vans modernas, com capacidade para 19 e 24 passageiros. Nossos motoristas profissionais são certificados para garantir um serviço seguro e de máxima confiança.',
    'flota.spec.gps': 'Monitoramento por GPS',
    'flota.spec.passengers': 'Passageiros',
    'flota.spec.ac': 'Ar-condicionado e Aquecimento',
    'flota.spec.mic': 'Microfone',
    'flota.spec.desk': 'Mesa de operações',
    'confianza.eyebrow': 'Viaje com total tranquilidade',
    'confianza.title': 'Licenças',
    'confianza.lead': 'Na Turismo Isabel contamos com todas as licenças para operar tanto em destinos nacionais quanto internacionais.',
    'confianza.national': 'Licenças Nacionais',
    'confianza.international': 'Licenças Internacionais',
    'cotizacion.title': 'Solicite seu orçamento',
    'cotizacion.lead': 'Para oferecer o melhor orçamento possível, preencha o formulário abaixo com as informações da sua viagem. Quanto mais detalhes você nos der, mais precisa será nossa proposta. Na Turismo Isabel nosso compromisso é oferecer um serviço de qualidade, eficiente e feito sob medida para você.',
    'cotizacion.note': 'Escolha como prefere nos enviar sua consulta.',
    'form.name': 'Nome completo *',
    'form.namePlaceholder': 'Seu nome completo',
    'form.email': 'Email *',
    'form.cell': 'Celular *',
    'form.phone': 'Telefone *',
    'form.date': 'Data da viagem *',
    'form.origin': 'Origem (exata) *',
    'form.originPlaceholder': 'Endereço ou ponto de partida',
    'form.destination': 'Destino (exato) *',
    'form.destinationPlaceholder': 'Endereço ou ponto de chegada',
    'form.timeOut': 'Horário de ida *',
    'form.timeReturn': 'Horário de volta *',
    'form.passengerCount': 'Quantidade de passageiros *',
    'form.passengerCountPlaceholder': 'Ex: 20',
    'form.notes': 'Observações',
    'form.notesPlaceholder': 'Tipo de serviço, paradas, ou qualquer detalhe que ajude a orçar melhor',
    'form.sendEmail': 'Enviar por email',
    'form.sendWhatsapp': 'Enviar por WhatsApp',
    'postulaciones.eyebrow': 'Você dirige profissionalmente?',
    'postulaciones.title': 'Você pode fazer parte da nossa equipe',
    'postulaciones.lead': 'Se você tem experiência em transporte de passageiros, conte um pouco sobre você e envie seu currículo. Entraremos em contato caso seja necessário agendar uma entrevista.',
    'postulaciones.cv': 'Currículo',
    'postulaciones.registro': 'CNH',
    'postulaciones.attachHint': 'Anexe você mesmo no email ou WhatsApp que abrir ao enviar este formulário.',
    'postulaciones.experienceLabel': 'Conte sobre sua experiência',
    'postulaciones.experiencePlaceholder': 'Anos de experiência, tipo de habilitação, rotas ou serviços habituais, etc.',
    'postulaciones.note': 'Nem o email nem o WhatsApp conseguem levar os arquivos anexados automaticamente — lembre-se de enviar o currículo e a CNH assim que abrir.',
    'contacto.eyebrow': 'Estamos aqui para ajudar',
    'contacto.title': 'Vamos conversar',
    'contacto.lead': 'Escreva para nós pelo canal que preferir — respondemos rapidamente, todos os dias dentro do nosso horário de atendimento.',
    'contacto.whatsappCta': 'Fale conosco pelo WhatsApp',
    'footer.location': 'Localização',
    'footer.hours': 'Horário de atendimento',
    'footer.hoursWeekday': 'Segunda a sexta, das 6h às 19h',
    'footer.hoursSaturday': 'Sábados, das 7h às 19h',
    'footer.hoursSunday': 'Domingo, das 7h às 14h',
    'footer.copyright': '© {year} Turismo Isabel. Todos os direitos reservados.',
    'msg.quoteGreeting': 'Olá! Quero pedir um orçamento:',
    'msg.name': 'Nome',
    'msg.email': 'Email',
    'msg.cell': 'Celular',
    'msg.date': 'Data',
    'msg.origin': 'Origem',
    'msg.destination': 'Destino',
    'msg.timeOut': 'Horário de ida',
    'msg.timeReturn': 'Horário de volta',
    'msg.passengers': 'Passageiros',
    'msg.notes': 'Observações',
    'msg.sending': 'Enviando…',
    'msg.quoteEmailSuccess': 'Pronto! Recebemos sua consulta, responderemos por email em breve.',
    'msg.quoteWaSuccess': 'O WhatsApp abriu com seus dados preenchidos.',
    'msg.postGreeting': 'Olá! Quero me candidatar como motorista:',
    'msg.phone': 'Telefone',
    'msg.experience': 'Experiência',
    'msg.postSubject': 'Candidatura Motorista - Turismo Isabel',
    'msg.postEmailSuccess': 'Seu email abriu com seus dados — não esqueça de anexar o currículo e a CNH antes de enviar.',
    'msg.postWaSuccess': 'O WhatsApp abriu com seus dados — não esqueça de anexar o currículo e a CNH no chat.',
  },
};

const htmlLangByCode = { es: 'es-AR', en: 'en', pt: 'pt-BR' };
let currentLang = 'es';

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

function applyLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  document.documentElement.setAttribute('lang', htmlLangByCode[lang] || lang);
  document.title = t('meta.title');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  document.querySelectorAll('[data-i18n-template]').forEach(el => {
    const year = new Date().getFullYear();
    el.textContent = t(el.getAttribute('data-i18n-template')).replace('{year}', year);
  });

  let activeBtn = null;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
    if (isActive) activeBtn = btn;
  });

  // Reflejar la selección actual en el botón disparador del desplegable
  // (bandera + código de idioma), clonando la bandera del ítem activo.
  const triggerFlag = document.getElementById('langTriggerFlag');
  const triggerCode = document.getElementById('langTriggerCode');
  if (activeBtn && triggerFlag) {
    const flagSvg = activeBtn.querySelector('.flag');
    if (flagSvg) triggerFlag.innerHTML = flagSvg.outerHTML;
  }
  if (triggerCode) triggerCode.textContent = lang.toUpperCase();

  try { localStorage.setItem('ti-lang', lang); } catch (err) { /* localStorage no disponible, seguimos igual */ }
}

(function setupLangSwitch() {
  const switcher = document.getElementById('langSwitch');
  const trigger = document.getElementById('langTrigger');
  const menu = document.getElementById('langMenu');
  if (!switcher || !trigger || !menu) return;

  const closeMenu = () => {
    switcher.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    switcher.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (switcher.classList.contains('is-open')) closeMenu(); else openMenu();
  });

  // Cerrar al hacer clic afuera o al apretar Escape
  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  let saved = null;
  try { saved = localStorage.getItem('ti-lang'); } catch (err) { /* ignorar */ }
  const initialLang = translations[saved] ? saved : 'es';
  applyLanguage(initialLang);

  switcher.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.getAttribute('data-lang'));
      closeMenu();
      trigger.focus();
    });
  });
})();

// ---------------------------------------------------------------
// Ayudante compartido para mostrar/ocultar la nota de estado bajo
// cada formulario (vuelve sola al texto por defecto a los 8s, ya
// traducido al idioma que esté activo en ese momento).
// ---------------------------------------------------------------
function makeNoteHelper(note, defaultKey) {
  let timer = null;
  return function showNote(text, type) {
    if (!note) return;
    clearTimeout(timer);
    note.textContent = text;
    note.classList.remove('is-success', 'is-error');
    if (type) note.classList.add(type);
    timer = setTimeout(() => {
      note.textContent = t(defaultKey);
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

  const showNote = makeNoteHelper(document.getElementById('formNote'), 'cotizacion.note');
  const emailBtn = form.querySelector('[data-send="email"]');
  const waBtn = form.querySelector('[data-send="whatsapp"]');
  const hiddenIframe = document.getElementById('hidden_iframe');
  let isSubmitting = false;

  form.addEventListener('submit', () => {
    // Dejamos que la validación nativa de HTML5 actúe: si el formulario
    // no es válido, el navegador cancela el submit y esto no se ejecuta.
    if (!form.checkValidity()) return;
    isSubmitting = true;
    if (emailBtn) { emailBtn.disabled = true; emailBtn.textContent = t('msg.sending'); }
    if (waBtn) waBtn.disabled = true;
  });

  if (hiddenIframe) {
    hiddenIframe.addEventListener('load', () => {
      if (!isSubmitting) return;
      isSubmitting = false;
      form.reset();
      showNote(t('msg.quoteEmailSuccess'), 'is-success');
      if (emailBtn) { emailBtn.disabled = false; emailBtn.textContent = t('form.sendEmail'); }
      if (waBtn) waBtn.disabled = false;
    });
  }

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const text = [
        t('msg.quoteGreeting'),
        `${t('msg.name')}: ${fieldValue(form, 'nombre')}`,
        `${t('msg.email')}: ${fieldValue(form, 'email')}`,
        `${t('msg.cell')}: ${fieldValue(form, 'celular')}`,
        `${t('msg.date')}: ${fieldValue(form, 'fecha')}`,
        `${t('msg.origin')}: ${fieldValue(form, 'origen')}`,
        `${t('msg.destination')}: ${fieldValue(form, 'destino')}`,
        `${t('msg.timeOut')}: ${fieldValue(form, 'horaIda')}`,
        `${t('msg.timeReturn')}: ${fieldValue(form, 'horaVuelta')}`,
        `${t('msg.passengers')}: ${fieldValue(form, 'pasajeros')}`,
        `${t('msg.notes')}: ${fieldValue(form, 'mensaje') || '-'}`,
      ].join('\n');
      window.open(`https://wa.me/5491153061418?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      showNote(t('msg.quoteWaSuccess'), 'is-success');
    });
  }
})();

// ---------------------------------------------------------------
// POSTULACIONES
// "Enviar por email" abre el cliente de mail (mailto) con asunto y
// cuerpo precargados. "Enviar por WhatsApp" abre wa.me. Ninguno de
// los dos puede llevar el CV ni el Registro adjuntos automáticamente
// (ni mailto ni wa.me soportan archivos por URL) — por eso ya no hay
// campo de carga de archivo: el formulario solo le recuerda al
// postulante que los adjunte él mismo en el mail o chat que se abra.
// Cambiá el mail de destino más abajo si RRHH usa una casilla
// distinta a la que está puesta.
// ---------------------------------------------------------------
(function setupPostulacionForm() {
  const form = document.getElementById('postulacionForm');
  if (!form) return;

  const showNote = makeNoteHelper(document.getElementById('postulacionFormNote'), 'postulaciones.note');
  const waBtn = form.querySelector('[data-send="whatsapp"]');
  const destinoMail = 'turismoisabelrrhh@gmail.com';

  const buildMessage = () => [
    `${t('msg.name')}: ${fieldValue(form, 'postNombre')}`,
    `${t('msg.email')}: ${fieldValue(form, 'postEmail')}`,
    `${t('msg.phone')}: ${fieldValue(form, 'postTelefono')}`,
    `${t('msg.experience')}: ${fieldValue(form, 'postExperiencia') || '-'}`,
  ];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const lines = buildMessage();
    const subject = encodeURIComponent(t('msg.postSubject'));
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:${destinoMail}?subject=${subject}&body=${body}`;

    showNote(t('msg.postEmailSuccess'), 'is-success');
  });

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const lines = buildMessage();
      const text = [t('msg.postGreeting'), ...lines].join('\n');
      window.open(`https://wa.me/5491151821276?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      showNote(t('msg.postWaSuccess'), 'is-success');
    });
  }
})();
