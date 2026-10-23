// Give illustrations a short reveal when their decoded image is ready.
// SVG icons stay visible immediately, even while lower-page artwork loads.
document.documentElement.classList.add('has-image-reveal');
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
Promise.all([...heroArtwork.querySelectorAll('img')].map(whenImageReady))
  .then(() => heroArtwork.classList.add('is-ready'));

const modal = document.getElementById('demo-modal');
const modalForm = document.getElementById('demo-form');
const modalMessage = document.getElementById('form-message');
const submitButton = modalForm.querySelector('[type="submit"]');
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
  if (contact.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(contact);
  const digits = contact.replace(/\D/g, '');
  return /^\+?[\d\s().-]+$/u.test(contact) && digits.length >= 10 && digits.length <= 15;
}

function updateSubmitState() {
  const name = modalForm.elements.name.value.trim();
  const contact = modalForm.elements.contact.value.trim();
  submitButton.disabled = !(name && validContact(contact) && modalForm.elements.consent.checked);
  if (!modalMessage.hidden) modalMessage.hidden = true;
}

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
  modalMessage.hidden = true;
  modalForm.elements.name.value = values.name || '';
  modalForm.elements.contact.value = values.contact || '';
  modalForm.elements.contact.classList.remove('is-invalid');
  modalForm.elements.contact.removeAttribute('aria-invalid');
  modalForm.elements.consent.checked = false;
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
    const valid = input === contact ? validContact(input.value) : Boolean(input.value.trim());
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
    // The landing has no submission endpoint yet. Keep the entered details
    // in place and never claim that the lead was delivered.
    message.textContent = 'Форма заполнена. Для отправки заявки нужно подключить серверный обработчик.';
    message.hidden = false;
  });
  updateConsentVisibility();
});

modalForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!modalForm.reportValidity()) return;
  // An API endpoint has not been supplied. Keep the local preview honest:
  // never show the "Заявка отправлена" state without an actual delivery.
  modalMessage.textContent = 'Форма заполнена. Для отправки заявки нужно подключить серверный обработчик.';
  modalMessage.hidden = false;
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
