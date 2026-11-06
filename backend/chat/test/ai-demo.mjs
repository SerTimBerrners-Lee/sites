import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createPreviewServer } from '../preview.mjs';

async function fixture(t, width = 1440, reducedMotion = 'reduce') {
  const server = createPreviewServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chrome', headless:true});
  const context = await browser.newContext({viewport:{width, height:900}, reducedMotion});
  await context.route(/^https:\/\//, route => route.abort());
  const page = await context.newPage();
  const errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', req => {if(req.method() === 'POST') requests.push(req.url());});
  t.after(async () => {
    await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, [], 'demo messages must not be sent to an API');
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/chat/`);
  await page.locator('[data-ai-thread] .ai-demo-bubble').first().waitFor();
  await page.locator('[data-ai-demo]').scrollIntoViewIfNeeded();
  const demo = page.locator('[data-ai-demo]');
  const input = demo.locator('textarea');
  return {page, demo, input};
}
async function settled(demo) {
  await demo.locator('.ai-demo-composer[aria-busy="false"]').waitFor();
}
async function capture(page, name) {
  if (!process.env.AI_REVIEW_DIR) return;
  await mkdir(process.env.AI_REVIEW_DIR, {recursive:true});
  await page.locator('#assistant').screenshot({path:join(process.env.AI_REVIEW_DIR, name + '.png'), animations:'disabled',
    style:'.site-header,.back-top,.skip-link{visibility:hidden!important}'});
}

for (const width of [1440,1280,1024,850,760,600,390,320]) {
  test(`layout and interactive examples at ${width}px`, {timeout:30000}, async t => {
    const {page, demo} = await fixture(t, width);
    assert.equal(await page.locator('.ai-preview,.ai-interactive .ai-card').count(), 0);
    assert.equal(await demo.locator('.ai-demo-badge').count(), 0);
    assert.equal(await page.locator('#ai-demo-disclaimer').count(), 0);
    assert.doesNotMatch(await page.locator('#assistant').textContent(), /Интерактивный пример с\s*подготовленными ответами/);
    assert.deepEqual(await demo.locator('.ai-demo-header-tools img').evaluateAll(els => els.map(el => getComputedStyle(el).opacity)), ['0.4','1','1']);
    assert.doesNotMatch(await page.title(), /SEP:Chat/);
    assert.doesNotMatch(await page.locator('body').textContent(), /SEP:Chat|СЭП:Чат|СЭП Чат/);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal page overflow');
    for (const selector of ['.ai-demo-window','.ai-demo-card','.ai-demo-composer','.ai-demo-prompts button']) {
      const boxes = await demo.locator(selector).evaluateAll(els => els.map(el => {
        const box = el.getBoundingClientRect();
        return {x:box.x, right:box.right, width:box.width};
      }));
      assert.ok(boxes.every(box => box.x >= 0 && box.right <= width + 1 && box.width > 0), selector);
    }
    const before = await demo.locator('.ai-demo-window').boundingBox();
    if ([1440,390].includes(width)) await capture(page, `ai-${width}-initial`);
    for (const scenario of ['voice','tasks','summary']) {
      const button = demo.locator(`[data-ai-example="${scenario}"]`);
      await button.click();
      await settled(demo);
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await demo.locator('.ai-demo-bubble.is-outgoing').count(), 1);
      assert.equal(await demo.locator('.ai-demo-bubble.is-incoming').count(), 1);
      assert.ok((await demo.locator('[data-ai-thread]').textContent()).length > 80);
      assert.doesNotMatch(await demo.locator('[data-ai-thread]').textContent(), /Пример расшифровки|Микрофон не включается/);
    }
    const after = await demo.locator('.ai-demo-window').boundingBox();
    assert.equal(before.height, after.height, 'conversation does not resize the demo window');
    if ([1440,390].includes(width)) await capture(page, `ai-${width}-summary`);
    const loadedImages = await demo.locator('img').evaluateAll(els => els.every(el => el.complete && el.naturalWidth > 0));
    assert.ok(loadedImages, 'all exact icon/image assets load');
  });
}

test('typed messages, Enter, multiline input, pending guard, settings and demo CTA', {timeout:30000}, async t => {
  const {page, demo, input} = await fixture(t);
  const send = demo.getByRole('button', {name:'Отправить сообщение', exact:true});
  assert.equal(await send.isDisabled(), true);
  await input.fill('   ');
  assert.equal(await send.isDisabled(), true);
  await input.fill('Привет');
  await input.press('Shift+Enter');
  assert.ok((await input.inputValue()).includes('\n'));
  await input.dispatchEvent('keydown', {key:'Enter', isComposing:true});
  assert.equal(await demo.locator('.ai-demo-bubble').count(), 4);
  await input.fill('<img src=x onerror=alert(1)>');
  await input.press('Enter');
  await demo.locator('.ai-demo-composer[aria-busy="true"]').waitFor();
  await demo.locator('form').dispatchEvent('submit');
  assert.equal(await demo.locator('.ai-demo-bubble.is-outgoing').count(), 1);
  await settled(demo);
  assert.ok((await demo.locator('.ai-demo-bubble.is-outgoing').textContent()).includes('<img src=x'));
  assert.equal(await demo.locator('[data-ai-thread] img[src="x"]').count(), 0);
  const incoming = demo.locator('.ai-demo-bubble.is-incoming');
  assert.equal(await incoming.count(), 2);
  assert.match(await incoming.nth(0).textContent(), /^Здравствуйте! Я демо-ассистент СЭП:ЧАТ\./);
  assert.match(await incoming.nth(1).textContent(), /^Запишитесь на демонстрацию, чтобы узнать все возможности системы и обсудить задачи вашей компании\./);
  assert.match(await incoming.nth(0).locator('time').textContent(), /^\d{2}:\d{2}$/);
  assert.equal(await incoming.nth(0).locator('time').textContent(), await incoming.nth(1).locator('time').textContent());
  assert.equal(await demo.locator('.ai-demo-cta').evaluate(el => el.previousElementSibling.classList.contains('is-incoming')), true);
  assert.deepEqual(await demo.locator('.ai-demo-cta').evaluate(el => {
    const css = getComputedStyle(el);
    return {background:css.backgroundColor, color:css.color, fontWeight:css.fontWeight, fontSize:css.fontSize, borderRadius:css.borderRadius, minHeight:css.minHeight};
  }), {background:'rgb(119, 166, 255)', color:'rgb(255, 255, 255)', fontWeight:'500', fontSize:'14px', borderRadius:'5px', minHeight:'36px'});
  await demo.getByRole('button', {name:'Записаться на демонстрацию'}).click();
  await page.locator('#demo-modal:not([hidden])').waitFor();
  await page.locator('#demo-modal [data-close-modal]').click();
  await demo.getByRole('button', {name:'Быстрый ответ', exact:true}).click();
  await demo.getByRole('menuitemradio', {name:'Продуманный ответ'}).click();
  assert.ok((await demo.locator('.ai-demo-mode').textContent()).includes('Продуманный ответ'));
  await demo.locator('[data-ai-example="summary"]').click();
  await settled(demo);
  assert.match(await demo.locator('[data-ai-thread]').textContent(), /согласован макет/);
  await input.fill('Создай задачу для Анны');
  await send.click();
  await settled(demo);
  assert.equal(await incoming.count(), 2);
  assert.match(await incoming.first().textContent(), /Здравствуйте! Я демо-ассистент СЭП:ЧАТ\./);
  await demo.getByRole('button', {name:'Запрашивать разрешение', exact:true}).click();
  await demo.getByRole('menuitemradio', {name:'Автоматически подтверждать'}).click();
  await input.fill('Создай ещё задачу');
  await send.click();
  await settled(demo);
  assert.equal(await incoming.count(), 4);
  assert.match(await incoming.nth(2).textContent(), /Здравствуйте! Я демо-ассистент СЭП:ЧАТ\./);
  assert.match(await incoming.nth(3).textContent(), /Запишитесь на демонстрацию, чтобы узнать все возможности системы и обсудить задачи вашей компании\./);
  assert.equal(await demo.getByRole('button', {name:'Подтвердить в демо'}).count(), 0);
});

test('rapid example changes cancel stale replies; mobile composer and bounded history stay usable', {timeout:30000}, async t => {
  const {demo, input} = await fixture(t, 390, 'no-preference');
  await demo.locator('[data-ai-example="voice"]').click();
  await demo.locator('[data-ai-example="tasks"]').click();
  await settled(demo);
  assert.doesNotMatch(await demo.locator('[data-ai-thread]').textContent(), /Микрофон|Итоги встречи/);
  assert.match(await demo.locator('[data-ai-thread]').textContent(), /На сегодня 3 задачи/);
  assert.equal(await input.evaluate(el => getComputedStyle(el).fontSize), '16px');
  await input.fill('Здравствуйте');
  await input.press('Enter');
  await settled(demo);
  assert.equal(await demo.locator('.ai-demo-bubble.is-outgoing').count(), 1, 'typing starts a new conversation after examples');
  for (let i = 0; i < 4; i++) {
    await input.fill('Сводка по чатам');
    await input.press('Enter');
    await settled(demo);
  }
  assert.equal(await demo.locator('.ai-demo-bubble.is-outgoing').count(), 5);
  assert.equal(await demo.locator('.ai-demo-bubble.is-incoming').count(), 10);
  const scroll = await demo.locator('[role="log"]').evaluate(el => ({height:el.clientHeight, total:el.scrollHeight}));
  assert.ok(scroll.total > scroll.height, 'long conversations scroll inside the window');
  assert.equal(await demo.getByRole('button', {name:'Отправить сообщение', exact:true}).isVisible(), true);
});

for (const width of [1440,390,320]) {
  test(`ERP setting buttons and popovers at ${width}px`, {timeout:30000}, async t => {
    const {page, demo, input} = await fixture(t, width);
    const permission = demo.locator('[data-ai-permission]');
    const mode = demo.locator('[data-ai-mode]');
    const modeMenu = demo.getByRole('menu', {name:'Режим ответа', exact:true});
    const permissionMenu = demo.getByRole('menu', {name:'Подтверждение действий', exact:true});
    await input.fill('Не терять черновик');
    const before = await demo.locator('[data-ai-thread]').textContent();
    const height = (await demo.locator('.ai-demo-window').boundingBox()).height;
    const style = await mode.evaluate(el => {
      const css = getComputedStyle(el);
      return {fontSize:css.fontSize, color:css.color, width:el.getBoundingClientRect().width};
    });
    assert.equal(style.color, 'rgb(119, 166, 255)');
    assert.equal(style.fontSize, '14px');
    if (width <= 600) assert.ok(Math.abs(style.width - 25.412) < .1);
    await mode.click();
    await modeMenu.waitFor();
    await page.waitForFunction(() => document.querySelector('[data-ai-mode]').getAttribute('aria-expanded') === 'true');
    assert.equal(await mode.getAttribute('aria-expanded'), 'true');
    assert.equal(await modeMenu.getByRole('menuitemradio', {name:'Быстрый ответ'}).getAttribute('aria-checked'), 'true');
    for (const menu of [modeMenu, permissionMenu]) {
      if (menu === permissionMenu) {
        await permission.click();
        await permissionMenu.waitFor();
        await page.waitForFunction(() => document.querySelector('[data-ai-permission]').getAttribute('aria-expanded') === 'true');
        assert.equal(await modeMenu.isVisible(), false, 'only one popover opens at a time');
      }
      const box = await menu.boundingBox();
      assert.ok(box.x >= 8 && box.x + box.width <= width - 7, 'popover fits the screen');
      assert.ok(box.y >= 8 && box.y + box.height <= 893, 'popover fits the viewport vertically');
      assert.equal(await menu.evaluate(el => getComputedStyle(el).borderRadius), '15px');
      assert.equal(await menu.locator('button').first().evaluate(el => getComputedStyle(el).fontSize), '16px');
    }
    if (process.env.AI_REVIEW_DIR) {
      await mkdir(process.env.AI_REVIEW_DIR, {recursive:true});
      await page.screenshot({path:join(process.env.AI_REVIEW_DIR, `ai-${width}-permission.png`), animations:'disabled'});
    }
    await permissionMenu.getByRole('menuitemradio', {name:'Автоматически подтверждать'}).click();
    assert.equal(await permission.getAttribute('aria-label'), 'Автоматически подтверждать');
    await mode.focus();
    await mode.press('ArrowDown');
    await modeMenu.waitFor();
    await page.waitForFunction(() => document.querySelector('#ai-mode-menu [data-value="quick"]') === document.activeElement);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    assert.equal(await mode.getAttribute('aria-label'), 'Продуманный ответ');
    assert.equal(await modeMenu.isVisible(), false);
    await mode.press('ArrowUp');
    await modeMenu.waitFor();
    await page.waitForFunction(() => document.querySelector('#ai-mode-menu [data-value="thoughtful"]') === document.activeElement);
    await page.keyboard.press('Escape');
    assert.equal(await modeMenu.isVisible(), false);
    assert.equal(await mode.evaluate(el => el === document.activeElement), true);
    await mode.click();
    await modeMenu.waitFor();
    await demo.locator('.ai-demo-header').click();
    assert.equal(await modeMenu.isVisible(), false, 'click outside dismisses menu');
    assert.equal(await input.inputValue(), 'Не терять черновик');
    assert.equal(await demo.locator('[data-ai-thread]').textContent(), before);
    assert.equal((await demo.locator('.ai-demo-window').boundingBox()).height, height);
    await input.press('Enter');
    await settled(demo);
    assert.equal(await demo.locator('.ai-demo-bubble.is-incoming').count(), 2);
    assert.equal(await demo.locator('.ai-demo-cta').evaluate(el => getComputedStyle(el).fontSize), '14px');
    assert.equal((await demo.locator('.ai-demo-cta').boundingBox()).height, 36);
    await capture(page, `ai-${width}-reply`);
  });
}
