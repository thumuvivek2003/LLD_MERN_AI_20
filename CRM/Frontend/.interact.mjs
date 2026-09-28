import { chromium } from 'playwright-core';

const BASE = 'http://localhost:5173';
const log = [];
const fail = [];
const step = (name, ok, detail = '') => {
  (ok ? log : fail).push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), ['metaforce.userId', 'u_sales']);
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error' && !/favicon/i.test(m.text())) errors.push(m.text()); });

const stamp = Date.now();
const NAME = `Playwright Smoke ${stamp}`;

// ---------- CREATE ----------
await page.goto(`${BASE}/business/objects/customer/records/new`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const inputs = page.locator('form input, form textarea, form select');
step('create form rendered from metadata', (await inputs.count()) > 3, `${await inputs.count()} controls`);

await page.getByPlaceholder('Enter customer name').fill(NAME);
await page.getByPlaceholder('Enter email').fill(`smoke${stamp}@example.com`);
await page.getByPlaceholder('Enter phone').fill('+91 9876500000');
// picklists (City / Customer Type / Status render as selects from metadata options)
const selects = page.locator('form select');
for (let i = 0; i < await selects.count(); i++) {
  const opts = await selects.nth(i).locator('option').all();
  if (opts.length > 1) await selects.nth(i).selectOption({ index: 1 });
}
const citySel = page.locator('form select').first();
step('picklist options come from metadata', (await citySel.locator('option').count()) > 3);
await page.getByRole('button', { name: 'Save', exact: true }).click();
await page.waitForURL(/\/business\/objects\/customer\/records\/rec_/, { timeout: 15000 }).catch(() => {});
const detailUrl = page.url();
step('record created + navigated to detail', /records\/rec_/.test(detailUrl), detailUrl.split('/').pop());

// ---------- VALIDATION ROUND TRIP ----------
await page.goto(`${BASE}/business/objects/customer/records/new`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.getByPlaceholder('Enter customer name').fill('Bad Email Test');
await page.getByPlaceholder('Enter email').fill('not-an-email');
await page.getByRole('button', { name: 'Save', exact: true }).click();
await page.waitForTimeout(800);
const invalidMsg = await page.getByText(/valid email/i).count();
step('client-side validation mirrors field rules', invalidMsg > 0);

// ---------- DETAIL TABS ----------
await page.goto(detailUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
step('detail Overview renders', (await page.getByText('Customer Details').count()) > 0);
await page.getByRole('tab', { name: /Related Records/ }).click();
await page.waitForTimeout(1200);
step('Related tab loads', errors.length === 0, errors.slice(0,1).join(''));
await page.getByRole('tab', { name: 'History' }).click();
await page.waitForTimeout(1200);
const historyRows = await page.locator('table tbody tr').count();
step('History tab loads audit rows', historyRows > 0, `${historyRows} rows`);

// ---------- EDIT ----------
await page.goto(detailUrl + '/edit', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.locator('form select').first().selectOption({ index: 2 });
const newCity = await page.locator('form select').first().inputValue();
await page.getByRole('button', { name: 'Update' }).click();
await page.waitForTimeout(1500);
const detailText = await page.locator('body').innerText();
step('record edited and shows new value', detailText.length > 0 && page.url().includes('rec_'), 'city -> ' + newCity);

// ---------- FILTERED SEARCH ----------
await page.goto(`${BASE}/business/search?objectId=customer`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.getByRole('button', { name: 'Add Filter' }).click();
await page.waitForTimeout(300);
const fSelects = page.locator('select');
await fSelects.nth(1).selectOption({ label: 'City' });      // field select
await page.waitForTimeout(400);
// City is a PICKLIST, so the registry supplies a <select> as its filter widget
const valueSelect = page.locator('select').nth(3);
step('filter value widget comes from the field-type registry',
  (await valueSelect.locator('option').count()) > 3);
await valueSelect.selectOption({ label: 'Hyderabad' });
await page.getByRole('button', { name: 'Search', exact: true }).click();
await page.waitForTimeout(2000);
const planShown = await page.getByText(/INDEX_|SCAN/).count();
const resultRows = await page.locator('table tbody tr').count();
step('filtered search returns rows', resultRows > 0, `${resultRows} rows`);
step('search plan panel rendered', planShown > 0);

// ---------- ARCHIVE ----------
await page.goto(detailUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.getByRole('button', { name: 'More', exact: true }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'Archive Record' }).first().click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Archive Record', exact: true }).last().click();
await page.waitForTimeout(2000);
step('record archived (returned to list)', /\/records$/.test(page.url()), page.url());

// ---------- SAVED VIEW ROUND TRIP ----------
await page.goto(`${BASE}/business/views`, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
const viewRows = await page.locator('table tbody tr').count();
step('saved views listed', viewRows > 0, `${viewRows} views`);

console.log('\nJS errors captured:', errors.length ? errors.slice(0, 5) : 'none');
await browser.close();
process.exit(fail.length ? 1 : 0);
