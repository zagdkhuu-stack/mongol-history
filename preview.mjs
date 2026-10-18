import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',e=>console.log('PAGE ERROR',e.message));
await page.goto('http://127.0.0.1:5173/');
await page.waitForTimeout(3500);
await page.screenshot({path:'gallery-preview.png'});
console.log(await page.locator('.topic-screen').count());
await browser.close();
