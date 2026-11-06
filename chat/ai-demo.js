// Local, deterministic showcase: no AI service, microphone, or message API.
(() => {
  const demo = document.querySelector('[data-ai-demo]');
  if (!demo) return;
  const thread = demo.querySelector('[data-ai-thread]');
  const log = demo.querySelector('[role="log"]');
  const form = demo.querySelector('.ai-demo-composer');
  const input = form.querySelector('textarea');
  const send = form.querySelector('[type="submit"]');
  const sendIcon = send.querySelector('img');
  const mode = demo.querySelector('[data-ai-mode]');
  const permission = demo.querySelector('[data-ai-permission]');
  const examples = [...demo.querySelectorAll('[data-ai-example]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  let timer = null;

  const scenarios = {
    voice: {
      question: 'Подведи итоги встречи и выдели договорённости.',
      answer: 'Итоги встречи:\n1. Макет согласован, запуск – в пятницу.\n2. Анна готовит презентацию к 14:00.\n3. Команда проверит материалы перед запуском.'
    },
    tasks: {
      question: 'Какие у меня задачи на сегодня?',
      answer: 'На сегодня 3 задачи:\nДо 12:00 – согласовать макет с командой.\nДо 14:00 – подготовить презентацию.\nДо 17:00 – отправить клиенту итоговое предложение.'
    },
    summary: {
      question: 'Сделай сводку по рабочим чатам за сегодня.',
      answer: '«Запуск проекта»: согласован макет, запуск в пятницу.\n«Команда»: Анна готовит презентацию, Илья проверяет материалы.\n«Клиенты»: ждём согласование предложения до 17:00.'
    }
  };

  function scrollToLatest() {
    // Scroll only the conversation, never move the landing or steal focus.
    log.scrollTo({top:log.scrollHeight, behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  }

  function updateComposer() {
    send.disabled = !input.value.trim() || pending;
    sendIcon.src = send.disabled ? './assets/ai-demo-send.svg' : './assets/ai-demo-send-active.svg';
    form.setAttribute('aria-busy', String(pending));
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 96)}px`;
  }

  function clock() {
    return new Intl.DateTimeFormat('ru-RU', {hour:'2-digit', minute:'2-digit'}).format(new Date());
  }

  function message(text, outgoing = false, {time = clock(), animate = true} = {}) {
    const bubble = document.createElement('div');
    bubble.className = `ai-demo-bubble ${outgoing ? 'is-outgoing' : 'is-incoming'}${animate ? ' is-new' : ''}`;
    bubble.append(document.createTextNode(text));
    const meta = document.createElement('small');
    meta.className = 'ai-demo-meta';
    const timestamp = document.createElement('time');
    timestamp.textContent = time;
    meta.append(timestamp);
    if (outgoing) {
      const read = document.createElement('img');
      read.src = './assets/ai-demo-read.svg';
      read.width = 20;
      read.height = 10;
      read.alt = 'Прочитано';
      meta.append(read);
    }
    bubble.append(meta);
    thread.append(bubble);
    // Keep a long local session bounded; nothing is saved between reloads.
    while (thread.children.length > 40) thread.firstElementChild.remove();
  }

  function demoCta() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-primary ai-demo-cta';
    button.textContent = 'Записаться на демонстрацию';
    button.addEventListener('click', () => openModal());
    thread.append(button);
  }

  function cancelPending() {
    clearTimeout(timer);
    timer = null;
    pending = false;
    thread.querySelector('.ai-demo-typing')?.remove();
    updateComposer();
  }

  function answerLater(result) {
    pending = true;
    const typing = document.createElement('div');
    typing.className = 'ai-demo-bubble is-incoming ai-demo-typing';
    typing.setAttribute('role', 'status');
    typing.setAttribute('aria-label', 'Демо-ассистент печатает');
    for (let i = 0; i < 3; i++) typing.append(document.createElement('span'));
    thread.append(typing);
    updateComposer();
    scrollToLatest();
    timer = setTimeout(() => {
      typing.remove();
      const time = clock();
      for (const text of result.messages || [result.answer]) message(text, false, {time});
      if (result.cta) demoCta();
      pending = false;
      timer = null;
      updateComposer();
      scrollToLatest();
    }, 650);
  }

  examples.forEach(button => button.addEventListener('click', () => {
    cancelPending();
    demo.classList.remove('is-conversing');
    thread.replaceChildren();
    const scenario = scenarios[button.dataset.aiExample];
    examples.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    message(scenario.question, true);
    const answer = scenario.answer;
    answerLater({...scenario, answer});
  }));

  function sendMessage(event) {
    event?.preventDefault();
    const text = input.value.trim().slice(0, 1000);
    if (!text || pending) return;
    // First typed message starts its own conversation rather than appending to examples.
    if (!demo.classList.contains('is-conversing')) thread.replaceChildren();
    demo.classList.add('is-conversing');
    examples.forEach(item => item.setAttribute('aria-pressed', 'false'));
    message(text, true);
    input.value = '';
    answerLater({messages:[
      'Здравствуйте! Я демо-ассистент СЭП:ЧАТ.',
      'Запишитесь на демонстрацию, чтобы узнать все возможности системы и обсудить задачи вашей компании.'
    ], cta:true});
    input.focus({preventScroll:true});
  }

  form.addEventListener('submit', sendMessage);
  input.addEventListener('input', updateComposer);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) sendMessage(event);
  });
  // Same top-layer popover, geometry, focus and keyboard behavior as ERP ChatSetting.
  for (const trigger of [mode, permission]) {
    const menu = document.getElementById(trigger.getAttribute('aria-controls'));
    const options = [...menu.querySelectorAll('[role="menuitemradio"]')];
    let pendingFocus = null;
    const selectedIndex = () => options.findIndex(option => option.dataset.value === trigger.dataset.value);
    function positionMenu() {
      if (!menu.matches(':popover-open')) return;
      const anchor = trigger.getBoundingClientRect();
      const {width, height} = menu.getBoundingClientRect();
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
      const right = left + (viewport?.width || innerWidth);
      const bottom = top + (viewport?.height || innerHeight);
      if (anchor.bottom < top || anchor.top > bottom) {menu.hidePopover(); return;}
      menu.style.left = `${Math.max(left + 8, Math.min(anchor.left, right - width - 8))}px`;
      menu.style.top = `${Math.max(top + 8, Math.min(anchor.top - height - 8 >= top + 8 ? anchor.top - height - 8 : anchor.bottom + 8, bottom - height - 8))}px`;
    }
    function closeMenu() {
      menu.hidePopover();
      trigger.focus({preventScroll:true});
    }
    trigger.addEventListener('keydown', event => {
      if (!['ArrowDown','ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      pendingFocus = event.key === 'ArrowDown' ? 0 : options.length - 1;
      menu.showPopover();
    });
    menu.addEventListener('beforetoggle', event => {
      // Make visibility consistent before Chrome resolves top-layer focusability.
      menu.style.visibility = event.newState === 'open' ? 'visible' : 'hidden';
    });
    menu.addEventListener('toggle', event => {
      const open = event.newState === 'open';
      trigger.setAttribute('aria-expanded', String(open));
      if (open) {
        positionMenu();
        const focusIndex = pendingFocus ?? selectedIndex();
        // Wait for the newly visible top-layer descendants to become focusable.
        requestAnimationFrame(() => {
          if (menu.matches(':popover-open')) options[focusIndex]?.focus({preventScroll:true});
        });
      }
      pendingFocus = null;
    });
    menu.addEventListener('keydown', event => {
      const index = options.indexOf(document.activeElement);
      const next = {ArrowDown:(index + 1) % options.length, ArrowUp:(index - 1 + options.length) % options.length, Home:0, End:options.length - 1}[event.key];
      if (next !== undefined) {event.preventDefault(); options[next].focus();}
      else if (event.key === 'Escape') {event.preventDefault(); closeMenu();}
      else if (event.key === 'Tab') closeMenu();
    });
    for (const option of options) option.addEventListener('click', () => {
      trigger.dataset.value = option.dataset.value;
      const label = option.querySelector('span:last-child').textContent;
      trigger.setAttribute('aria-label', label);
      trigger.querySelector('[data-ai-setting-label]').textContent = label;
      for (const [selector, icon] of [
        ['.ai-demo-desktop-setting-icon', option.dataset.icon],
        ['.ai-demo-mobile-setting-icon', option.dataset.mobileIcon || option.dataset.icon]
      ]) {
        const image = trigger.querySelector(selector);
        const url = new URL(`./assets/${icon}`, document.baseURI).href;
        image.style.setProperty('--ai-demo-icon', `url("${url}")`);
        image.querySelector('img').src = url;
      }
      for (const item of options) {
        item.setAttribute('aria-checked', String(item === option));
        item.tabIndex = item === option ? 0 : -1;
      }
      closeMenu();
    });
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, true);
    window.visualViewport?.addEventListener('resize', positionMenu);
  }

  message('Подведи итоги обсуждения в чате «Запуск проекта».', true, {time:'12:10', animate:false});
  message('Макет согласован. Запуск – в пятницу.\nАнна готовит презентацию, Илья проверяет материалы.', false, {time:'12:10', animate:false});
  message('Подготовь задачу по итогам обсуждения для Анны Смирновой.', true, {time:'12:11', animate:false});
  message('Задача «Подготовить презентацию» готова к созданию.\nИсполнитель: Анна Смирнова. Срок: сегодня, 14:00.', false, {time:'12:11', animate:false});
  updateComposer();
})();
