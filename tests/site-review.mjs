import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4323';
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome' });
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
try {
  for (const width of [320, 390, 768, 781, 1024, 1440]) {
    for (const javaScriptEnabled of [true, false]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(baseURL);
      const mobile = width <= 780;
      if (mobile) await page.locator('.site-nav summary').click();
      const nav = page.locator(mobile ? '.site-nav nav' : '.desktop-nav nav');
      check(await nav.isVisible(), `Navigation visible at ${width}, JS=${javaScriptEnabled}`);
      check(await nav.locator('a').count() === 6, 'All navigation destinations present');
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}`);
      check(await page.evaluate(() => [...document.querySelectorAll('.cursor, .term-caret')].every(el => getComputedStyle(el).animationName === 'none')), 'Reduced motion stops cursors');
      check(await page.evaluate(() => [...document.querySelectorAll('.reveal')].every(el => getComputedStyle(el).opacity === '1')), 'Content visible with reduced motion');
      await nav.locator('a[href="#fields"]').click();
      check(new URL(page.url()).hash === '#fields', 'Navigation reaches section');
      check(await page.locator('#fields').evaluate(el => el.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom), 'Anchor clears sticky header');
      if (mobile && javaScriptEnabled) {
        check(!await page.locator('.site-nav').evaluate(el => el.open), 'Menu closes after navigation');
        check(await page.locator('#fields').evaluate(el => el === document.activeElement), 'Focus follows navigation');
        await page.locator('.site-nav summary').click();
        await page.keyboard.press('Escape');
        check(!await page.locator('.site-nav').evaluate(el => el.open), 'Escape closes menu');
        check(await page.locator('.site-nav summary').evaluate(el => el === document.activeElement), 'Escape returns focus');
        await page.setViewportSize({ width: 1440, height: 900 });
        check(await page.locator('.desktop-nav nav').isVisible(), 'Desktop navigation survives mobile close');
        await page.setViewportSize({ width, height: 900 });
      }
      if (javaScriptEnabled && [390, 1440].includes(width)) {
        const result = await new AxeBuilder({ page }).analyze();
        check(result.violations.length === 0, JSON.stringify(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))));
      }
      check(errors.length === 0, `No runtime errors: ${errors}`);
      await context.close();
    }
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.waitForFunction(() => document.querySelector('#term').textContent.includes('1 → N 不在本进程'));
  check(true, 'Terminal animation completes');
  for (const el of await page.locator('.reveal').all()) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForFunction(el => getComputedStyle(el).opacity === '1', await el.elementHandle());
  }
  check(true, 'All scroll-reveal content becomes visible');
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseURL}/404.html`);
    check(await page.locator('h1').isVisible(), '404 heading visible');
    check(await page.locator('a[href="/"]').last().isVisible(), '404 return link visible');
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '404 has no page overflow');
    const result = await new AxeBuilder({ page }).analyze();
    check(result.violations.length === 0, '404 accessibility scan');
  }
  await context.close();
  console.log(`${checks} checks passed`);
} finally {
  await browser.close();
}
