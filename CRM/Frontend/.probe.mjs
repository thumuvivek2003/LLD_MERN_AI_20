import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const c = await b.newContext();
await c.addInitScript(([k,v])=>localStorage.setItem(k,v), ['metaforce.userId','u_admin']);
const p = await c.newPage();
p.on('response', r => { if (r.status() >= 400) console.log(r.status(), r.url()); });
await p.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await b.close();
