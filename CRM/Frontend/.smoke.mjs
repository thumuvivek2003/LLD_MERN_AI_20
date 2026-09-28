import { chromium } from 'playwright-core';

const BASE = 'http://localhost:5173';

const ROUTES = {
  u_admin: [
    '/admin', '/admin/objects', '/admin/objects/new', '/admin/objects/customer',
    '/admin/objects/customer?tab=fields', '/admin/objects/customer?tab=settings',
    '/admin/objects/customer?tab=permissions', '/admin/objects/customer?tab=history',
    '/admin/objects/customer/lifecycle', '/admin/objects/customer/fields',
    '/admin/objects/customer/fields/new', '/admin/objects/customer/fields/reorder',
    '/admin/objects/customer/fields/f1', '/admin/objects/customer/fields/f2?tab=validation',
    '/admin/fields', '/admin/relationships', '/admin/validation-rules',
    '/admin/indexes', '/admin/records', '/admin/records/customer',
    '/admin/records/customer/bulk', '/admin/search', '/admin/users',
    '/admin/audit', '/admin/settings',
  ],
  u_sales: [
    '/business', '/business/objects', '/business/favorites', '/business/recent',
    '/business/objects/customer/records', '/business/objects/customer/records/new',
    '/business/objects/customer/bulk', '/business/objects/customer/import',
    '/business/objects/customer/export', '/business/search', '/business/views',
    '/business/reports', '/business/activity', '/business/help', '/business/settings',
  ],
  u_system: [
    '/system', '/system/indexes', '/system/events', '/system/jobs', '/system/lookups',
    '/system/validation', '/system/cache', '/system/data', '/system/audit',
    '/system/logs', '/system/alerts', '/system/metrics', '/system/settings',
    '/system/integrations', '/system/security',
  ],
};

const failures = [];
const notes = [];

const run = async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  for (const [userId, routes] of Object.entries(ROUTES)) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(
      ([key, value]) => localStorage.setItem(key, value),
      ['metaforce.userId', userId],
    );
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });

    for (const route of routes) {
      errors.length = 0;
      try {
        await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(500);
        const url = new URL(page.url());
        const h1 = await page.locator('h1').first().textContent().catch(() => null);
        const body = await page.locator('body').innerText();
        const redirected = url.pathname + (url.search || '') !== route;
        const blank = body.trim().length < 30;
        const hardErrors = errors.filter(
          (e) => !/favicon|Download the React DevTools|net::ERR/i.test(e),
        );
        if (blank) failures.push(`${userId} ${route} → BLANK PAGE`);
        else if (redirected) notes.push(`${userId} ${route} → redirected to ${url.pathname}`);
        if (hardErrors.length) {
          failures.push(`${userId} ${route} → JS ERROR: ${hardErrors.slice(0, 2).join(' | ')}`);
        }
        if (!blank && !hardErrors.length) {
          console.log(`OK  ${userId.padEnd(9)} ${route.padEnd(48)} h1="${(h1 || '').slice(0, 40)}"`);
        }
      } catch (err) {
        failures.push(`${userId} ${route} → NAV FAIL: ${err.message.split('\n')[0]}`);
      }
    }
    await context.close();
  }

  await browser.close();

  console.log('\n--- NOTES ---');
  notes.forEach((n) => console.log(n));
  console.log('\n--- FAILURES ---');
  if (!failures.length) console.log('none');
  failures.forEach((f) => console.log(f));
  process.exit(failures.length ? 1 : 0);
};

run();
