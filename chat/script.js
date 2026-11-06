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
const leadStages = new WeakMap();
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
    !(name.value.trim() && contact.value.trim()));
}

function updateSubmitState() { renderLeadState(modalForm); }

function setupLeadStage(form) {
  const stage = form === modalForm ? form.closest('.modal') : form.closest('.strip-inner');
  stage.classList.add('lead-stage');
  stage.setAttribute('data-lead-stage', '');
  const content = form === modalForm
    ? [...stage.querySelectorAll('.modal-heading h2,#form-view,.modal-separator,.modal-phone')]
    : [...stage.children];
  content.forEach(element => element.setAttribute('data-lead-stage-content', ''));
  const success = document.createElement('div');
  success.className = 'lead-success';
  success.setAttribute('data-lead-success', '');
  success.setAttribute('role', 'status');
  success.setAttribute('aria-live', 'polite');
  success.setAttribute('aria-atomic', 'true');
  success.setAttribute('aria-hidden', 'true');
  const icon = document.createElement('span');
  icon.className = 'lead-success-icon';
  icon.setAttribute('aria-hidden', 'true');
  const check = document.createElement('img');
  check.src = './assets/lead-success-check.svg';
  check.width = 27;
  check.height = 19;
  check.alt = '';
  icon.append(check);
  const title = document.createElement('h3');
  title.id = `${form.dataset.leadSource}-success-title`;
  title.tabIndex = -1;
  title.textContent = 'Спасибо! Заявка отправлена';
  const description = document.createElement('p');
  const firstLine = document.createElement('span');
  firstLine.textContent = 'Мы свяжемся с вами в течение рабочего дня';
  const secondLine = document.createElement('span');
  secondLine.textContent = 'и подберём удобное время для демонстрации';
  description.append(firstLine, document.createTextNode(' '), secondLine);
  success.append(icon, title, description);
  stage.append(success);
  leadStages.set(form, {stage, content, success, title});
}

function showLeadSuccess(form, complete) {
  const {stage, content, success, title} = leadStages.get(form);
  const ownedFocus = form.contains(document.activeElement);
  stage.classList.toggle('is-complete', complete);
  success.setAttribute('aria-hidden', String(!complete));
  if (complete) success.dataset.state = 'success';
  else success.removeAttribute('data-state');
  content.forEach(element => {element.inert = complete; element.setAttribute('aria-hidden', String(complete));});
  if (form === modalForm) stage.setAttribute('aria-labelledby', complete ? title.id : 'modal-title');
  if (complete && ownedFocus) {
    if (form === modalForm) modal.querySelector('[data-close-modal]').focus({preventScroll:true});
    else requestAnimationFrame(() => {
      if (leadState(form).sent) title.focus({preventScroll:true});
    });
  }
}

function editLead(form) {
  const state = leadState(form);
  if (state.pending) return;
  state.sent = false;
  showLeadSuccess(form, false);
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
  // Reserve the current stage even when a previous server error is being cleared.
  const {stage} = leadStages.get(form);
  stage.style.minHeight = `${stage.getBoundingClientRect().height}px`;
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
    message.hidden = state.sent;
    if (state.sent) showLeadSuccess(form, true);
  }
}

document.querySelectorAll('[data-lead-source]').forEach(form => {
  setupLeadStage(form);
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
  // Do not summon the mobile keyboard until the visitor taps an input.
  const focusTarget = leadState(modalForm).sent || innerWidth <= 760 || matchMedia('(pointer: coarse)').matches
    ? modal.querySelector('[data-close-modal]') : modalForm.elements.name;
  focusTarget.focus({preventScroll: true});
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
  const elements = [...activeModal.querySelectorAll('button:not(:disabled),input:not(:disabled),a[href],[tabindex="0"]')]
    .filter(element => !element.closest('[inert]') && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
  const first = elements[0], last = elements.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

// Same validation lifecycle as ERP LeadForm: dismissal never changes field values,
// consent, delivery status or retry keys, and lasts until the next submission.
const validationControllers = [];
document.querySelectorAll('[data-lead-source]').forEach(form => {
  const {name, contact, consent} = form.elements;
  const consentLabel = form.querySelector('.quick-consent,.consent');
  const tips = {
    name: form.querySelector('.name-tooltip'),
    contact: form.querySelector('.contact-tooltip'),
    consent: form.querySelector('.consent-tooltip')
  };
  let submitted = false, errorsDismissed = false, focusingInvalid = false;
  let hasVisibleErrors = false;
  const touched = new Set(), retrying = new Set(), positions = new Map();
  form.noValidate = true;

  function rememberScrollPositions() {
    positions.clear();
    positions.set(window, [window.scrollX, window.scrollY]);
    positions.set(document, [window.scrollX, window.scrollY]);
    for (let element = form; element; element = element.parentElement)
      positions.set(element, [element.scrollLeft, element.scrollTop]);
  }
  function showError(input, invalid) {
    const tip = tips[input.name];
    input.classList.toggle('is-invalid', invalid);
    input.setAttribute('aria-invalid', String(invalid));
    input.setCustomValidity('');
    if (input === consent) consentLabel.classList.toggle('is-invalid', invalid);
    tip.classList.toggle('is-visible', invalid);
    tip.setAttribute('aria-hidden', String(!invalid));
    if (invalid) {
      tip.setAttribute('role', 'alert');
      input.setAttribute('aria-describedby', tip.id);
    } else {
      tip.removeAttribute('role');
      input.removeAttribute('aria-describedby');
    }
  }
  function renderValidation() {
    const invalidName = !errorsDismissed && !validName(name.value) &&
      (submitted || touched.has(name)) && !retrying.has(name);
    const invalidContact = !errorsDismissed && !validContact(contact.value) &&
      (submitted || touched.has(contact)) && !retrying.has(contact);
    const invalidConsent = !errorsDismissed && submitted && !consent.checked;
    showError(name, invalidName);
    showError(contact, invalidContact);
    showError(consent, invalidConsent);
    const visible = invalidName || invalidContact || invalidConsent;
    if (visible && !hasVisibleErrors) rememberScrollPositions();
    hasVisibleErrors = visible;
  }
  function dismiss() {
    if (!hasVisibleErrors) return;
    errorsDismissed = true;
    renderValidation();
  }
  validationControllers.push({dismiss, onScroll(event) {
    if (!hasVisibleErrors || !event.target) return;
    const target = event.target;
    const position = target === document || target === window
      ? [window.scrollX, window.scrollY]
      : target instanceof Element ? [target.scrollLeft, target.scrollTop] : [0, 0];
    const before = positions.get(target);
    positions.set(target, position);
    // Ignore a queued pre-validation scroll event if the position did not change.
    if (!before || before[0] !== position[0] || before[1] !== position[1]) dismiss();
  }});
  function updateConsentVisibility() {
    const active = form === modalForm || submitted || Boolean(name.value || contact.value);
    form.classList.toggle('has-input', active);
    consentLabel.setAttribute('aria-hidden', String(!active));
    consent.tabIndex = active ? 0 : -1;
  }
  for (const input of [name, contact]) {
    const beginEditing = () => {
      if (focusingInvalid) return;
      retrying.add(input);
      renderValidation();
    };
    input.addEventListener('pointerdown', beginEditing);
    input.addEventListener('focus', beginEditing);
    input.addEventListener('blur', () => {
      retrying.delete(input);
      touched.add(input);
      renderValidation();
    });
  }
  form.addEventListener('input', () => {updateConsentVisibility(); renderValidation();});
  form.addEventListener('change', renderValidation);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const state = leadState(form);
    if (state.pending || state.sent) return;
    submitted = true;
    errorsDismissed = false;
    retrying.clear();
    updateConsentVisibility();
    renderValidation();
    const invalid = !validName(name.value) ? name : !validContact(contact.value) ? contact : !consent.checked ? consent : null;
    if (invalid) {
      focusingInvalid = true;
      try {invalid.focus({preventScroll:true});}
      finally {focusingInvalid = false;}
      return;
    }
    sendLead(form);
  });
  updateConsentVisibility();
  renderValidation();
});
const dismissValidationErrors = () => validationControllers.forEach(controller => controller.dismiss());
document.addEventListener('pointerdown', dismissValidationErrors, true);
// A keyboard-generated click also dismisses before the submit default action.
document.addEventListener('click', dismissValidationErrors);
window.addEventListener('wheel', dismissValidationErrors, {capture:true, passive:true});
window.addEventListener('scroll', event => validationControllers.forEach(controller => controller.onScroll(event)), {capture:true, passive:true});

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
