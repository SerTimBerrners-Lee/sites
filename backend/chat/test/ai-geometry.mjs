import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdir} from 'node:fs/promises';
import {resolve, extname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

// Compare with the deployable ERP build, not a second set of expected numbers.
// Neither landing is changed or allowed to make external requests in this test.
const root = fileURLToPath(new URL('../../../', import.meta.url));
const mime = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.woff2':'font/woff2'};
const parts = [
  ['layout', '.ai-layout', '.ai-demo-layout'],
  ['chat', '.chat-window', '.ai-demo-window'],
  ['panel', '.ai-examples', '.ai-demo-examples'],
  ['card', '.assistant-card', '.ai-demo-card'],
  ['header', '.chat-window-header', '.ai-demo-header'],
  ['messages', '.chat-messages', '.ai-demo-messages'],
  ['composer', '.chat-input-preview', '.ai-demo-composer'],
  ['avatar', '.assistant-avatar', '.ai-demo-card-avatar'],
  ['heading', '.ai-examples h3', '.ai-demo-examples h3'],
  ['cardTitle', '.assistant-card h4', '.ai-demo-card h4'],
  ['prompts', '.prompt-buttons', '.ai-demo-prompts'],
  ['prompt', '.prompt-buttons button', '.ai-demo-prompts button'],
];

test('Chat assistant matches ERP geometry at desktop, tablet and mobile widths', {timeout:120000}, async t => {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + path + (path.endsWith('/') ? 'index.html' : ''));
    if (!/^\/(ERP|chat)\//.test(path) || !file.startsWith(root) || !mime[extname(file)] || !['GET','HEAD'].includes(req.method)) {
      res.writeHead(404).end(); return;
    }
    try {res.writeHead(200, {'Content-Type':mime[extname(file)]}).end(await readFile(file));}
    catch {res.writeHead(404).end();}
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chrome', headless:true});
  t.after(async () => {
    await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  });
  for (const width of [1920,1440,1280,1101,1100,1024,980,920,900,870,851,850,760,601,600,440,390,320]) {
    await t.test(`${width}px`, async () => {
      const snapshots = [];
      for (const [index, name] of ['ERP', 'chat'].entries()) {
        const context = await browser.newContext({viewport:{width,height:1000}, reducedMotion:'reduce'});
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route(/^https:\/\//, route => route.abort());
        try {
          await page.goto(`http://127.0.0.1:${server.address().port}/${name}/`);
          const layout = page.locator(parts[0][index + 1]);
          await layout.waitFor();
          await page.evaluate(() => document.fonts.ready);
          await layout.scrollIntoViewIfNeeded();
          await layout.locator('img').evaluateAll(els => Promise.all(els.filter(el => el.getBoundingClientRect().width > 0).map(el => el.decode())));
          snapshots.push(await page.evaluate(({parts,index}) => {
            const origin = document.querySelector(parts[0][index + 1]).getBoundingClientRect();
            return Object.fromEntries(parts.map(([name,...selectors]) => {
              const el = document.querySelector(selectors[index]);
              const box = el.getBoundingClientRect(), css = getComputedStyle(el);
              return [name, {x:box.x,y:box.y-origin.y,width:box.width,height:box.height,padding:css.padding,
                radius:css.borderRadius,font:css.fontSize,line:css.lineHeight,weight:css.fontWeight,
                gap:name === 'messages' && index === 1 ? getComputedStyle(document.querySelector('.ai-demo-thread')).gap : css.gap,
                marginTop:css.marginTop}];
            }));
          }, {parts,index}));
          if (name === 'chat') {
            const before = await page.locator('.ai-demo-window').boundingBox();
            await page.locator('[data-ai-example="summary"]').click();
            await page.locator('.ai-demo-composer[aria-busy="false"]').waitFor();
            const after = await page.locator('.ai-demo-window').boundingBox();
            assert.equal(after.width,before.width,'example does not resize chat');
            assert.equal(after.height,before.height,'example does not resize chat');
            assert.ok(await layout.evaluate(el => {
              const bounds=el.getBoundingClientRect();
              return bounds.left >= 0 && bounds.right <= innerWidth;
            }),'AI layout stays within the screen');
          }
          if (process.env.AI_GEOMETRY_DIR && [1440,850,390,320].includes(width)) {
            await mkdir(process.env.AI_GEOMETRY_DIR,{recursive:true});
            await layout.screenshot({path:join(process.env.AI_GEOMETRY_DIR,`${name}-${width}.png`),animations:'disabled',
              style:'.site-header,.back-top,.back-to-top,.skip-link{visibility:hidden!important}'});
          }
          assert.deepEqual(errors,[]);
        } finally {await context.close();}
      }
      const [erp,chat] = snapshots;
      for (const [name] of parts) {
        // Labels are product-specific, so their natural button/text widths differ.
        const keys = ['prompts','prompt'].includes(name)
          ? ['y','height','padding','radius','font','line','weight','gap','marginTop']
          : Object.keys(erp[name]);
        for (const key of keys) {
          const actual = chat[name][key], expected = erp[name][key];
          if (typeof expected === 'number') assert.ok(Math.abs(actual-expected) < .15,`${name}.${key}: ERP=${expected}, Chat=${actual}`);
          else assert.equal(actual,expected,`${name}.${key}`);
        }
      }
    });
  }
});
