import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createLeadServer } from '../app.mjs';
import { LeadStore } from '../store.mjs';
import { createPreviewServer } from '../preview.mjs';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function fixture(t, viewport = {width:1440, height:1000}, basePath = '/') {
  const messages = [];
  const store = new LeadStore(':memory:');
  const config = {secret:'local-test-only-not-a-real-secret-123456', origins:[], trustProxy:false,
    rateLimit:100, globalRateLimit:1000, rateWindowMs:600000, minFormMs:0, maxConcurrent:3};
  const api = createLeadServer({config, store, logger:()=>{}, mailer:{
    sendMail:async mail => {messages.push(mail); return {accepted:['info@pksep.ru'], rejected:[]};}
  }});
  await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
  const preview = createPreviewServer({backendPort:api.address().port});
  await new Promise(resolve => preview.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${preview.address().port}`;
  config.origins.push(url);
  const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chrome', headless:true});
  const context = await browser.newContext({viewport, reducedMotion:'reduce'});
  await context.route(/^https:\/\//, route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  t.after(async () => {
    await browser.close();
    for (const server of [preview, api]) {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    }
    store.close();
    assert.deepEqual(errors, []);
  });
  await page.goto(url + basePath);
  return {page, url, messages};
}
async function fill(page, source, contact = 'test@example.com') {
  if (source === 'demo-modal') await page.locator('.hero [data-open-modal]').click();
  const form = page.locator(`[data-lead-source="${source}"]`);
  await form.locator('[name="name"]').fill(`Тест ${source}`);
  await form.locator('[name="contact"]').fill(contact);
  await form.locator('[name="consent"]').check();
  return form;
}
async function status(form, kind) {
  await form.locator(`[role="status"][data-state="${kind}"]:not([hidden])`).waitFor();
}
async function submit(form) {await form.locator('[type="submit"]').click();}

for (const basePath of ['/', '/chat/']) {
 for (const width of [1440, 390]) {
  test(`all three forms reach the real local API from ${basePath} at ${width}px`, {timeout:30000}, async t => {
    const {page, messages, url} = await fixture(t, {width, height:900}, basePath);
    assert.ok(await page.locator('.hero').evaluate(el => getComputedStyle(el).position !== 'static'), 'relative stylesheet loads from subdirectory');
    const requests = [];
    page.on('request', req => {if(req.url().endsWith('/api/chat/leads')) requests.push(req);});
    for (const source of ['demo-middle','demo-bottom','demo-modal']) {
      const form = await fill(page, source, source === 'demo-bottom' ? '+7 (812) 309-05-42' : 'test@example.com');
      await submit(form);
      await status(form, 'success');
      assert.equal(await form.locator('[type="submit"]').isDisabled(), true);
      const message = form.locator('[role="status"]');
      const bounds = await message.boundingBox();
      assert.ok(bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= width + 1);
      const visibleWithinSection = await message.evaluate(el => {
        const box = el.getBoundingClientRect(), parent = el.closest('section')?.getBoundingClientRect();
        return !parent || box.bottom <= parent.bottom + 1;
      });
      assert.ok(visibleWithinSection, 'confirmation must not be clipped by its section');
    }
    assert.equal(messages.length, 3);
    assert.equal(requests.length, 3);
    for (const req of requests) {
      assert.equal(new URL(req.url()).pathname, '/api/chat/leads');
      const body = req.postDataJSON();
      assert.equal(body.company, '');
      assert.equal(body.consent, true);
      assert.ok(body.elapsedMs >= 0);
      assert.match(req.headers()['idempotency-key'], uuid);
    }
    assert.equal(messages[1].replyTo, undefined);
    assert.equal(messages[0].subject, 'Заявка на демонстрацию СЭП:ЧАТ');
    assert.equal((await page.request.get(url + '/deploy/chat/.env')).status(), 404);
    assert.equal((await page.request.get(url + '/backend/chat/server.mjs')).status(), 404);
  });
 }
}

for (const source of ['demo-middle','demo-bottom','demo-modal']) {
  test(`${source}: pending guard, preserved fields, stable retries and new key on edit`, {timeout:30000}, async t => {
    const {page} = await fixture(t);
    let release;
    const held = new Promise(resolve => release = resolve);
    const requests = [];
    await page.route('**/api/chat/leads', async route => {
      requests.push(route.request());
      if (requests.length === 1) await held;
      await route.fulfill({status:503, contentType:'application/json', body:JSON.stringify({ok:false, code:'mail_unavailable'})});
    });
    const form = await fill(page, source);
    await submit(form);
    await page.waitForFunction(selector => document.querySelector(selector).getAttribute('aria-busy') === 'true', `[data-lead-source="${source}"]`);
    assert.equal(await form.locator('[name="name"]').getAttribute('readonly'), '');
    assert.equal(await form.locator('[name="consent"]').isDisabled(), true);
    await form.dispatchEvent('submit');
    if (source === 'demo-modal') {
      await page.locator('#demo-modal [data-close-modal]').click();
      await page.locator('.hero [data-open-modal]').click();
      assert.equal(await form.locator('[name="contact"]').inputValue(), 'test@example.com');
      assert.equal(await form.locator('[type="submit"]').isDisabled(), true);
    }
    release();
    await status(form, 'error');
    assert.equal(requests.length, 1);
    assert.equal(await form.locator('[name="consent"]').isChecked(), true);
    assert.equal(await form.locator('[name="name"]').inputValue(), `Тест ${source}`);
    await submit(form);
    await status(form, 'error');
    assert.equal(requests.length, 2);
    assert.equal(requests[0].headers()['idempotency-key'], requests[1].headers()['idempotency-key']);
    await form.locator('[name="name"]').fill('Другое тестовое имя');
    await submit(form);
    await status(form, 'error');
    assert.equal(requests.length, 3);
    assert.notEqual(requests[1].headers()['idempotency-key'], requests[2].headers()['idempotency-key']);
  });
}

test('no false success on network, malformed JSON, missing status or uncertain delivery; consent required', {timeout:30000}, async t => {
  const {page} = await fixture(t, {width:390, height:900});
  let mode = 'no-status', calls = 0;
  await page.route('**/api/chat/leads', async route => {
    calls++;
    if(mode === 'network') return route.abort();
    return route.fulfill({status:mode === 'unknown' ? 503 : 200, contentType:'application/json',
      body:mode === 'malformed' ? '<html>error</html>' : JSON.stringify(mode === 'unknown' ? {ok:false, code:'delivery_unknown'} : {ok:true})});
  });
  const form = await fill(page, 'demo-bottom');
  await form.locator('[name="consent"]').uncheck();
  await submit(form);
  assert.equal(calls, 0);
  await form.locator('[name="consent"]').check();
  for (const next of ['no-status','malformed','network','unknown']) {
    mode = next;
    await submit(form);
    await status(form, 'error');
    assert.equal(await form.locator('[name="contact"]').inputValue(), 'test@example.com');
    assert.equal(await form.locator('[data-state="success"]').count(), 0);
  }
  assert.match(await form.locator('[role="status"]').textContent(), /Не отправляйте заявку повторно/);
  await page.locator('.contact-bottom h2').click();
  await page.mouse.wheel(0, 120);
  assert.equal(await form.locator('[role="status"]').isVisible(), true);
  assert.match(await form.locator('[role="status"]').textContent(), /Не отправляйте заявку повторно/);
  assert.equal(await form.locator('[name="contact"]').inputValue(), 'test@example.com');
  assert.equal(await form.locator('[name="consent"]').isChecked(), true);
  await form.locator('[name="contact"]').fill('bad-email');
  await submit(form);
  assert.equal(calls, 4);
});

for (const width of [1440,390]) {
  test(`ERP validation tooltips dismiss on click, editing and scrolling at ${width}px`, {timeout:60000}, async t => {
    const {page, messages} = await fixture(t, {width, height:900});
    let calls = 0;
    await page.route('**/api/chat/leads', route => {calls++; return route.abort();});
    for (const source of ['demo-middle','demo-bottom','demo-modal']) {
      const form = await fill(page, source, 'неверный контакт');
      const name = form.locator('[name="name"]');
      const contact = form.locator('[name="contact"]');
      const consent = form.locator('[name="consent"]');
      const heading = source === 'demo-modal' ? page.locator('#modal-title') : form.locator('xpath=..').locator('h2');
      await consent.uncheck();
      const expectErrors = async () => {
        await page.waitForFunction(selector => {
          const form = document.querySelector(selector);
          return form.elements.contact.getAttribute('aria-invalid') === 'true' && form.elements.consent.getAttribute('aria-invalid') === 'true';
        }, `[data-lead-source="${source}"]`);
        assert.equal(await form.locator('.contact-tooltip.is-visible[role="alert"]').count(), 1);
        assert.equal(await form.locator('.consent-tooltip.is-visible[role="alert"]').count(), 1);
        assert.equal(await contact.evaluate(el => el === document.activeElement), true, 'submit focuses invalid input without dismissing its error');
      };
      const expectDismissed = async () => {
        await page.waitForFunction(selector => !document.querySelector(selector).querySelector('.is-invalid,.is-visible[role="alert"]'), `[data-lead-source="${source}"]`);
        assert.equal(await contact.getAttribute('aria-invalid'), 'false');
        assert.equal(await consent.getAttribute('aria-invalid'), 'false');
        assert.equal(await contact.getAttribute('aria-describedby'), null);
        assert.equal(await form.locator('[role="alert"]').count(), 0);
        assert.equal(await name.inputValue(), `Тест ${source}`);
        assert.equal(await contact.inputValue(), 'неверный контакт');
        assert.equal(await consent.isChecked(), false);
      };
      await submit(form);
      await expectErrors();
      // An old scroll notification at the same position must not erase new errors.
      await page.evaluate(() => document.dispatchEvent(new Event('scroll')));
      await expectErrors();
      await heading.click();
      await expectDismissed();
      await contact.focus();
      await contact.press('Tab');
      await expectDismissed();

      await submit(form);
      await expectErrors();
      await name.click();
      await expectDismissed();
      await submit(form);
      await expectErrors();
      await heading.dispatchEvent('click');
      await expectDismissed();

      await submit(form);
      await expectErrors();
      await page.mouse.wheel(0, 120);
      await expectDismissed();
      await form.locator('[type="submit"]').focus();
      await form.locator('[type="submit"]').press('Enter');
      await expectErrors();
      if (source === 'demo-modal') {
        await page.locator('#demo-modal .modal').evaluate(el => {
          el.style.maxHeight = '250px';
          el.style.overflowY = 'auto';
          el.scrollTop = 50;
        });
      } else await page.evaluate(() => window.scrollBy({top:120, behavior:'instant'}));
      await expectDismissed();
      if (source === 'demo-modal') await page.locator('#demo-modal .modal').evaluate(el => {el.style.maxHeight = ''; el.style.overflowY = '';});

      await form.evaluate(el => el.scrollIntoView({block:'center', behavior:'instant'}));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await submit(form);
      await expectErrors();
      await name.evaluate(el => el.focus({preventScroll:true}));
      await name.press('Tab');
      assert.equal(await contact.getAttribute('aria-invalid'), 'false', 'keyboard focus clears that field error');
      await contact.press('Tab');
      assert.equal(await contact.getAttribute('aria-invalid'), 'true', 'blur validates an unfinished keyboard retry');
      await heading.click();
      await contact.fill('test@example.com');
      await submit(form);
      assert.equal(await form.locator('.consent-tooltip.is-visible').count(), 1);
      await heading.click();
      assert.equal(await consent.getAttribute('aria-invalid'), 'false');
      if (source === 'demo-modal') await page.keyboard.press('Escape');
    }
    assert.equal(calls, 0, 'dismissing errors never sends invalid forms');
    assert.equal(messages.length, 0);
  });
}
