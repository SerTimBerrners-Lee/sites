// Progressive enhancement: cards stay visible without JS or observer support.
function setupCardReveals() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const cards = [...document.querySelectorAll(
    '.benefit-card, .story-card, .feature-list > li, .ai-card, .terms-cards > article'
  )];
  const groups = new Map();
  cards.forEach(card => {
    if (!groups.has(card.parentElement)) groups.set(card.parentElement, []);
    groups.get(card.parentElement).push(card);
  });

  const observer = new IntersectionObserver(entries => {
    const entering = new Set(entries.filter(entry => entry.isIntersecting).map(entry => entry.target));
    // Only stagger siblings entering together; a lone mobile card starts at once.
    groups.forEach(group => group.filter(card => entering.has(card)).forEach((card, index) => {
      card.style.setProperty('--card-reveal-delay', `${Math.min(index, 3) * 90}ms`);
      card.classList.add('is-revealed');
      observer.unobserve(card);
    }));
  }, {threshold: 0.08, rootMargin: '0px 0px -24px 0px'});

  cards.forEach(card => {
    card.classList.add('card-reveal');
    observer.observe(card);
  });

  // Respect a preference change while this page is open, without re-hiding cards.
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    cards.forEach(card => card.classList.add('is-revealed'));
  });

}
setupCardReveals();

// Give illustrations a short reveal when their decoded image is ready.
// SVG icons stay visible immediately, even while lower-page artwork loads.
document.documentElement.classList.add('has-image-reveal', 'image-reveal-initialized');
function whenImageReady(image) {
  return new Promise(resolve => {
    const finish = () => {
      if (!image.naturalWidth || typeof image.decode !== 'function') { resolve(); return; }
      image.decode().catch(() => {}).then(resolve);
    };
    if (image.complete) { finish(); return; }
    image.addEventListener('load', finish, {once: true});
    image.addEventListener('error', resolve, {once: true});
  });
}
document.querySelectorAll('img[data-fade]').forEach(image => {
  whenImageReady(image).then(() => image.classList.add('is-ready'));
});
const heroArtwork = document.querySelector('.hero-art');
if (heroArtwork) {
  Promise.all([...heroArtwork.querySelectorAll('img')].map(whenImageReady))
    .then(() => heroArtwork.classList.add('is-ready'));
}

const modal = document.getElementById('demo-modal');
const modalForm = document.getElementById('demo-form');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.getElementById('main-nav');
const backTop = document.querySelector('.back-top');
const siteHeader = document.querySelector('.site-header');
const documentModal = document.getElementById('document-modal');
const documentScroll = document.getElementById('document-scroll');
const documentTitle = document.getElementById('document-title');
let returnFocus = null;
let modalCloseTimer = null;
let modalOpenFrame = null;
let documentReturnFocus = null;
let documentCloseTimer = null;
let documentOpenFrame = null;

function validContact(value) {
  const contact = value.trim();
  if (contact.length > 150 || /[\u0000-\u001f\u007f]/.test(value)) return false;
  if (contact.includes('@')) return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(contact);
  return /^[+\d\s()−-]+$/.test(contact) && /^\d{10,15}$/.test(contact.replace(/\D/g, ''));
}

function validName(value) {
  return Boolean(value.trim()) && value.length <= 100 && !/[\u0000-\u001f\u007f]/.test(value);
}

// Shared contract with SEP ERP: keep one key for unchanged retries and never
// report success until SMTP acceptance is confirmed by the same-origin API.
const leadStates = new WeakMap();
function leadState(form) {
  if (!leadStates.has(form)) leadStates.set(form, {
    pending: false, sent: false, attempt: null, startedAt: Date.now(),
    buttonText: form.querySelector('[type="submit"]').textContent
  });
  return leadStates.get(form);
}

function submissionKey() {
  // getRandomValues also works over a phone's local-network HTTP connection.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function renderLeadState(form) {
  const state = leadState(form);
  const button = form.querySelector('[type="submit"]');
  const {name, contact, consent} = form.elements;
  form.setAttribute('aria-busy', String(state.pending));
  name.readOnly = contact.readOnly = state.pending;
  consent.disabled = state.pending;
  button.textContent = state.pending ? 'Отправляем...' : state.sent ? 'Отправлено' : state.buttonText;
  button.disabled = state.pending || state.sent || (form === modalForm &&
    !(validName(name.value) && validContact(contact.value) && consent.checked));
}

function updateSubmitState() { renderLeadState(modalForm); }

function editLead(form) {
  const state = leadState(form);
  if (state.pending) return;
  state.sent = false;
  form.querySelector('[role="status"]').hidden = true;
  renderLeadState(form);
}

const leadErrors = {
  rate_limited: 'Слишком много попыток. Подождите несколько минут и попробуйте снова.',
  in_progress: 'Заявка ещё обрабатывается. Подождите немного и повторите проверку отправки.',
  delivery_unknown: 'Не удалось подтвердить доставку. Не отправляйте заявку повторно: уточните её получение по телефону +7(812) 309-05-42 или на info@pksep.ru.',
  too_fast: 'Пожалуйста, подождите пару секунд и повторите отправку.'
};

async function sendLead(form) {
  const state = leadState(form);
  if (state.pending || state.sent) return;
  const {name, contact, consent, company} = form.elements;
  if (!validName(name.value) || !validContact(contact.value) || !consent.checked) return;
  const message = form.querySelector('[role="status"]');
  const payload = {name: name.value.trim(), contact: contact.value.trim(), consent: true, source: form.dataset.leadSource};
  const fingerprint = JSON.stringify(payload);
  state.pending = true;
  message.hidden = true;
  renderLeadState(form);
  try {
    if (state.attempt?.fingerprint !== fingerprint) state.attempt = {fingerprint, key: submissionKey()};
    const response = await fetch('/api/chat/leads', {
      method: 'POST', credentials: 'same-origin',
      headers: {'Content-Type': 'application/json', 'Idempotency-Key': state.attempt.key},
      body: JSON.stringify({...payload, company: company.value, elapsedMs: Date.now() - state.startedAt}),
      signal: AbortSignal.timeout(35000)
    });
    const result = await response.json().catch(() => null);
    if (response.ok && result?.ok === true && result.status === 'sent') {
      state.sent = true;
      message.dataset.state = 'success';
      message.textContent = 'Заявка отправлена! Спасибо, мы свяжемся с вами, чтобы договориться о демонстрации SEP:Chat.';
    } else {
      message.dataset.state = 'error';
      message.textContent = leadErrors[result?.code] || 'Не удалось отправить: заявка не отправлена. Попробуйте ещё раз или напишите на info@pksep.ru.';
    }
  } catch {
    message.dataset.state = 'error';
    message.textContent = 'Не удалось подтвердить отправку заявки. Проверьте соединение и повторите попытку или напишите на info@pksep.ru.';
  } finally {
    state.pending = false;
    renderLeadState(form);
    message.hidden = false;
  }
}

document.querySelectorAll('[data-lead-source]').forEach(form => {
  leadState(form);
  form.addEventListener('input', () => editLead(form));
  form.addEventListener('change', () => editLead(form));
});

function openModal(values = {}) {
  if (modalCloseTimer !== null) clearTimeout(modalCloseTimer);
  if (modalOpenFrame !== null) cancelAnimationFrame(modalOpenFrame);
  modalCloseTimer = null;
  returnFocus = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalOpenFrame = requestAnimationFrame(() => {
    modal.classList.add('is-open');
    modalOpenFrame = null;
  });
  // Closing/reopening must not discard a pending request or its retry key.
  if (!leadState(modalForm).pending && (values.name || values.contact)) {
    modalForm.elements.name.value = values.name || '';
    modalForm.elements.contact.value = values.contact || '';
    modalForm.elements.consent.checked = false;
    editLead(modalForm);
  }
  updateSubmitState();
  modalForm.elements.name.focus({preventScroll: true});
}

function closeModal() {
  if (modal.hidden) return;
  if (modalOpenFrame !== null) cancelAnimationFrame(modalOpenFrame);
  modalOpenFrame = null;
  modal.classList.remove('is-open');
  const finishClose = () => {
    modalCloseTimer = null;
    if (modal.classList.contains('is-open')) return;
    modal.hidden = true;
    if (documentModal.hidden) document.body.classList.remove('modal-open');
    if (returnFocus && typeof returnFocus.focus === 'function') {
      returnFocus.focus({preventScroll: true});
    }
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
  else modalCloseTimer = setTimeout(finishClose, 300);
}

document.querySelectorAll('[data-open-modal]').forEach(button => button.addEventListener('click', () => openModal()));
modalForm.addEventListener('input', updateSubmitState);
modalForm.addEventListener('change', updateSubmitState);
modalForm.elements.contact.addEventListener('blur', () => {
  const input = modalForm.elements.contact;
  const invalid = Boolean(input.value.trim()) && !validContact(input.value);
  input.classList.toggle('is-invalid', invalid);
  if (invalid) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
});
modalForm.elements.contact.addEventListener('input', () => {
  const input = modalForm.elements.contact;
  if (validContact(input.value)) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }
});
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
function openDocument(kind) {
  const title = kind === 'license' ? 'Лицензионное соглашение' : 'Политика обработки персональных данных';
  const template = document.getElementById(kind === 'license' ? 'license-document' : 'privacy-document');
  if (documentCloseTimer !== null) clearTimeout(documentCloseTimer);
  if (documentOpenFrame !== null) cancelAnimationFrame(documentOpenFrame);
  documentCloseTimer = null;
  documentReturnFocus = document.activeElement;
  documentTitle.textContent = title;
  documentScroll.replaceChildren(template.content.cloneNode(true));
  documentScroll.querySelector('.document-note').id = 'document-note';
  documentScroll.scrollTop = 0;
  documentModal.hidden = false;
  if (!modal.hidden) modal.inert = true;
  document.body.classList.add('modal-open');
  documentOpenFrame = requestAnimationFrame(() => {
    documentModal.classList.add('is-open');
    documentOpenFrame = null;
  });
  documentModal.querySelector('[data-close-document]').focus({preventScroll: true});
}

function closeDocument() {
  if (documentModal.hidden) return;
  if (documentOpenFrame !== null) cancelAnimationFrame(documentOpenFrame);
  documentOpenFrame = null;
  documentModal.classList.remove('is-open');
  const finishClose = () => {
    documentCloseTimer = null;
    if (documentModal.classList.contains('is-open')) return;
    documentModal.hidden = true;
    modal.inert = false;
    if (modal.hidden) document.body.classList.remove('modal-open');
    if (documentReturnFocus?.isConnected) documentReturnFocus.focus({preventScroll: true});
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
  else documentCloseTimer = setTimeout(finishClose, 300);
}

document.querySelectorAll('[data-open-document]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  openDocument(link.dataset.openDocument);
}));
document.querySelectorAll('[data-close-document]').forEach(button => button.addEventListener('click', closeDocument));
documentModal.addEventListener('click', event => { if (event.target === documentModal) closeDocument(); });
document.addEventListener('keydown', event => {
  const activeModal = !documentModal.hidden ? documentModal : !modal.hidden ? modal : null;
  if (!activeModal) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    if (activeModal === documentModal) closeDocument();
    else closeModal();
  }
  if (event.key !== 'Tab') return;
  const elements = [...activeModal.querySelectorAll('button:not(:disabled),input:not(:disabled),a[href],[tabindex="0"]')];
  const first = elements[0], last = elements.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

document.querySelectorAll('[data-quick-form]').forEach(form => {
  const message = form.querySelector('.quick-message');
  const name = form.elements.name;
  const contact = form.elements.contact;
  const consent = form.elements.consent;
  const consentLabel = form.querySelector('.quick-consent');
  const tooltip = form.querySelector('.consent-tooltip');
  const contactTooltip = form.querySelector('.contact-tooltip');
  const nameTooltip = form.querySelector('.name-tooltip');

  function showNameError(show) {
    nameTooltip.classList.toggle('is-visible', show);
    nameTooltip.setAttribute('aria-hidden', String(!show));
  }

  function showContactError(show) {
    contactTooltip.classList.toggle('is-visible', show);
    contactTooltip.setAttribute('aria-hidden', String(!show));
  }

  function showConsentError(show) {
    consentLabel.classList.toggle('is-invalid', show);
    tooltip.classList.toggle('is-visible', show);
    tooltip.setAttribute('aria-hidden', String(!show));
    if (show) consent.setAttribute('aria-invalid', 'true');
    else consent.removeAttribute('aria-invalid');
  }

  function updateConsentVisibility() {
    const active = Boolean(name.value || contact.value);
    form.classList.toggle('has-input', active);
    consentLabel.setAttribute('aria-hidden', String(!active));
    consent.tabIndex = active ? 0 : -1;
    if (!active) {
      consent.checked = false;
      showConsentError(false);
    }
  }

  function validateField(input, error) {
    const valid = input === contact ? validContact(input.value) : validName(input.value);
    input.setCustomValidity(valid ? '' : error);
    input.classList.toggle('is-invalid', !valid);
    if (valid) input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
    if (input === contact) showContactError(!valid);
    if (input === name) showNameError(!valid);
    return valid;
  }

  form.addEventListener('input', event => {
    message.hidden = true;
    if (event.target === name || event.target === contact) {
      if ((event.target === contact && contactTooltip.classList.contains('is-visible')) ||
          (event.target === name && nameTooltip.classList.contains('is-visible'))) {
        validateField(event.target, event.target === name ? 'Введите имя' : 'Введите корректный номер телефона или email');
      } else {
        event.target.setCustomValidity('');
        event.target.classList.remove('is-invalid');
        event.target.removeAttribute('aria-invalid');
      }
      updateConsentVisibility();
    }
  });
  contact.addEventListener('blur', () => {
    if (contact.value.trim()) validateField(contact, 'Введите корректный номер телефона или email');
  });
  form.addEventListener('change', () => {
    message.hidden = true;
    if (consent.checked) showConsentError(false);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const hasInput = Boolean(name.value || contact.value);
    if (hasInput) showConsentError(!consent.checked);
    const nameValid = validateField(name, 'Введите имя');
    if (!nameValid) { name.focus(); return; }
    const contactValid = validateField(contact, 'Введите корректный номер телефона или email');
    if (!contactValid) { contact.focus(); return; }
    if (!consent.checked) { consent.focus(); return; }
    sendLead(form);
  });
  updateConsentVisibility();
});

modalForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!modalForm.reportValidity()) return;
  sendLead(modalForm);
});

menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}));

backTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
function updateBackTop() {
  backTop.classList.toggle('visible', window.scrollY > 120);
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 1);
}
window.addEventListener('scroll', updateBackTop, {passive: true});
updateBackTop();
