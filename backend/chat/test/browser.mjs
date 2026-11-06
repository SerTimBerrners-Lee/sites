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
    assert.equal(messages[0].subject, 'Заявка на демонстрацию SEP:Chat');
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
  await form.locator('[name="contact"]').fill('bad-email');
  await submit(form);
  assert.equal(calls, 4);
});
